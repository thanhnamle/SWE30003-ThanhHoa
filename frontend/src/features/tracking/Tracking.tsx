import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Navigation, CheckSquare, Upload, Loader2, CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { trackingApi } from './api/trackingApi';
import { Shipment } from '../shipments/api/shipmentApi';

export function Tracking() {
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showPodModal, setShowPodModal] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['driver-shipments'],
    queryFn: trackingApi.getDriverShipments
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => trackingApi.updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-shipments'] });
    }
  });

  const podMutation = useMutation({
    mutationFn: trackingApi.submitProofOfDelivery,
    onSuccess: () => {
      setShowPodModal(false);
      setSelectedShipment(null);
      setSignatureData(null);
      setDeliveryNotes('');
      queryClient.invalidateQueries({ queryKey: ['driver-shipments'] });
    }
  });

  const handleStatusUpdate = (shipment: Shipment, newStatus: string) => {
    statusMutation.mutate({ id: shipment.id, status: newStatus });
    // Optimistic update for local UI
    if (shipments) {
       const s = shipments.find(s => s.id === shipment.id);
       if (s) s.status = newStatus as any;
    }
  };

  const handleSubmitPod = () => {
    if (!selectedShipment || !signatureData) return;
    podMutation.mutate({
      shipmentId: selectedShipment.id,
      signatureImageBase64: signatureData,
      notes: deliveryNotes
    });
    // Optimistic update
    if (shipments) {
      const s = shipments.find(s => s.id === selectedShipment.id);
      if (s) s.status = 'Delivered' as any;
   }
  };

  // Mocking drawing a signature
  const handleSign = () => {
    setSignatureData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='); // tiny mock image
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* Mobile-Friendly Premium Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse duration-10000"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Truck className="w-4 h-4" /> Live Route
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-tight">
            Driver Dashboard
          </h1>
          <p className="text-blue-200/80 mt-2 text-base md:text-lg">
            Manage your active route assignments and confirm deliveries.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100/50 backdrop-blur-sm border border-gray-100 rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {shipments?.map((shipment, idx) => (
            <div 
              key={shipment.id} 
              className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 md:p-8 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/80 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              
              {/* Card Header & Status */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Delivery Task</h3>
                    <span className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 mt-1 inline-block">
                      Ref: {shipment.id.split('-')[0]}
                    </span>
                  </div>
                </div>

                {/* Animated Status Badges */}
                {shipment.status === 'ReadyForPickup' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-sm font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Ready For Pickup
                  </span>
                )}
                {shipment.status === 'InTransit' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-sm font-bold shadow-sm shadow-blue-500/10">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    In Transit
                  </span>
                )}
                {shipment.status === 'Delivered' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-sm font-bold shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Delivered
                  </span>
                )}
              </div>

              {/* Route Visualization */}
              <div className="relative flex flex-col md:flex-row items-stretch justify-between p-5 bg-gray-50/50 rounded-3xl border border-gray-100 group-hover:bg-blue-50/30 transition-colors duration-500 gap-6 md:gap-0">
                
                {/* Connecting Dashed Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-gray-300 -translate-y-1/2 group-hover:border-blue-300 transition-colors duration-500 z-0"></div>
                
                {/* Connecting Dashed Line (Mobile) */}
                <div className="block md:hidden absolute left-[34px] top-[20%] bottom-[20%] w-0.5 border-l-2 border-dashed border-gray-300 group-hover:border-blue-300 transition-colors duration-500 z-0"></div>

                {/* Pickup Location */}
                <div className="relative z-10 flex md:flex-col items-center gap-4 md:w-1/3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 md:-ml-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shrink-0 shadow-inner shadow-amber-200">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="md:text-center">
                    <span className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest block mb-1">Pickup From</span>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{shipment.pickupDeliveryOption?.pickupAddress}</p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="hidden md:flex relative z-10 items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-100 shadow-md">
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Delivery Location */}
                <div className="relative z-10 flex md:flex-col items-center gap-4 md:w-1/3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 md:-mr-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 shrink-0 shadow-inner shadow-emerald-200">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="md:text-center">
                    <span className="text-[10px] font-black text-emerald-600/80 uppercase tracking-widest block mb-1">Deliver To</span>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{shipment.pickupDeliveryOption?.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8">
                {shipment.status === 'ReadyForPickup' && (
                  <button 
                    onClick={() => handleStatusUpdate(shipment, 'InTransit')}
                    disabled={statusMutation.isPending}
                    className="group/btn relative w-full flex justify-center items-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:shadow-gray-900/40 hover:-translate-y-0.5 transition-all overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {statusMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Truck className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                        Confirm Pickup & Start Route
                      </>
                    )}
                  </button>
                )}

                {shipment.status === 'InTransit' && (
                  <button 
                    onClick={() => { setSelectedShipment(shipment); setShowPodModal(true); }}
                    className="group/btn relative w-full flex justify-center items-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                  >
                    <CheckSquare className="w-6 h-6 group-hover/btn:scale-110 transition-transform" /> 
                    Collect Proof of Delivery
                  </button>
                )}
                
                {shipment.status === 'Delivered' && (
                  <button disabled className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-50/50 text-emerald-700 border-2 border-emerald-200 rounded-2xl font-bold cursor-default opacity-80">
                    <ShieldCheck className="w-6 h-6" /> Completed Successfully
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Proof of Delivery Modal */}
      {showPodModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-12 md:zoom-in-95 duration-500 ease-out overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Proof of Delivery</h2>
              <p className="text-gray-500 mt-1 font-medium">Verify recipient and secure signature.</p>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              {/* Digital Pad for Signature */}
              <div className="space-y-3 group/pad">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Recipient Signature <span className="text-red-400">*</span>
                </label>
                <div className={`h-40 border-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 ${
                  signatureData 
                    ? 'border-emerald-400 bg-emerald-50/50 shadow-inner shadow-emerald-100' 
                    : 'border-dashed border-gray-300 bg-gray-50 group-hover/pad:border-blue-400 group-hover/pad:bg-blue-50/30'
                }`}>
                  {signatureData ? (
                    <div className="text-center text-emerald-600 animate-in zoom-in duration-300">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold block">Signature Captured</span>
                    </div>
                  ) : (
                    <button 
                      onClick={handleSign} 
                      className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" /> Tap to Sign Digital Pad
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 group/notes">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Delivery Notes
                </label>
                <textarea 
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="e.g., Left with front desk receptionist, John..."
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowPodModal(false)}
                className="w-full sm:w-1/3 py-4 text-gray-600 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitPod}
                disabled={!signatureData || podMutation.isPending}
                className="group/submit w-full sm:w-2/3 py-4 text-white bg-gray-900 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:hover:bg-gray-900 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {podMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Complete Delivery 
                    <ArrowRight className="w-5 h-5 group-hover/submit:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}