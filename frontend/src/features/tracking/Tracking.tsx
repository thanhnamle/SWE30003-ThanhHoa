import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Navigation, CheckSquare, Upload, Loader2, CheckCircle2, ChevronRight, PackageCheck } from 'lucide-react';
import { trackingApi, ProofOfDeliveryRequest } from './api/trackingApi';
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Mobile-Friendly Header for Driver */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">Driver Dashboard</h1>
        <p className="text-blue-100 mt-1">Today's active route assignments</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="space-y-4">
          {shipments?.map((shipment) => (
            <div key={shipment.id} className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md mb-2 inline-block">ID: {shipment.id.split('-')[0]}</span>
                  <h3 className="font-semibold text-gray-900 text-lg">Delivery Task</h3>
                </div>
                {shipment.status === 'ReadyForPickup' && <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Ready For Pickup</span>}
                {shipment.status === 'InTransit' && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold animate-pulse">In Transit</span>}
                {shipment.status === 'Delivered' && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Delivered</span>}
              </div>

              <div className="flex flex-col space-y-4 pt-2">
                
                {/* Pickup - Top Left */}
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/30 shadow-sm w-[85%] md:w-3/4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-600/80 uppercase tracking-wider">Pickup</span>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{shipment.pickupDeliveryOption?.pickupAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery - Bottom Right */}
                <div className="flex justify-end">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-green-100 bg-green-50/30 shadow-sm w-[85%] md:w-3/4 flex-row-reverse text-right">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 shrink-0 shadow-sm">
                      <Navigation className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-green-600/80 uppercase tracking-wider">Delivery</span>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{shipment.pickupDeliveryOption?.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                {shipment.status === 'ReadyForPickup' && (
                  <button 
                    onClick={() => handleStatusUpdate(shipment, 'InTransit')}
                    disabled={statusMutation.isPending}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-md hover:bg-gray-800 transition-colors"
                  >
                    {statusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Pickup'}
                  </button>
                )}

                {shipment.status === 'InTransit' && (
                  <button 
                    onClick={() => { setSelectedShipment(shipment); setShowPodModal(true); }}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4" /> Collect Proof of Delivery
                  </button>
                )}
                
                {shipment.status === 'Delivered' && (
                  <button disabled className="flex-1 flex justify-center items-center gap-2 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-medium cursor-default">
                    <PackageCheck className="w-4 h-4" /> Delivered & Signed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof of Delivery Modal */}
      {showPodModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Proof of Delivery</h2>
            <p className="text-sm text-gray-500 mb-6">Collect recipient signature and notes.</p>

            <div className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Recipient Signature</label>
                <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${signatureData ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                  {signatureData ? (
                    <div className="text-center text-green-600">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">Signature Captured</span>
                    </div>
                  ) : (
                    <button onClick={handleSign} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 shadow-sm flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Tap to Sign
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Delivery Notes (Optional)</label>
                <textarea 
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g., Left with receptionist..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPodModal(false)}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitPod}
                  disabled={!signatureData || podMutation.isPending}
                  className="flex-1 py-3 text-white bg-blue-600 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {podMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Delivery'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
