import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, User, MapPin, Loader2, CheckCircle2, Clock, Sparkles, X } from 'lucide-react';
import { shipmentApi, Shipment } from './api/shipmentApi';

const assignmentSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  pickupAddress: z.string().min(5, 'Valid pickup address is required'),
  deliveryAddress: z.string().min(5, 'Valid delivery address is required'),
  pickupWindowStart: z.string().min(1, 'Required'),
  pickupWindowEnd: z.string().min(1, 'Required'),
  deliveryWindowStart: z.string().min(1, 'Required'),
  deliveryWindowEnd: z.string().min(1, 'Required'),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function Shipments() {
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data: shipments, isLoading: isLoadingShipments } = useQuery({
    queryKey: ['shipments'],
    queryFn: shipmentApi.getShipments
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: shipmentApi.getVehicles
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: shipmentApi.getDrivers
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  const assignMutation = useMutation({
    mutationFn: shipmentApi.assignResources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setTimeout(() => {
        setSelectedShipment(null);
        reset();
      }, 2000); // Hold success state briefly before closing
    }
  });

  const onSubmit = (data: AssignmentFormValues) => {
    if (!selectedShipment) return;
    assignMutation.mutate({ ...data, shipmentId: selectedShipment.id });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Preparing': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Preparing
          </span>
        );
      case 'ReadyForPickup': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Ready For Pickup
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200/60 rounded-full text-xs font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8 md:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-10000"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Logistics Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
            Branch Operations
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl">
            Monitor active shipments, track statuses, and seamlessly assign local fleet resources in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Shipment List */}
        <div className={`space-y-6 transition-all duration-700 ease-in-out ${selectedShipment ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Active Shipments
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold border border-gray-200">
                {shipments?.length || 0}
              </span>
            </h2>
          </div>
          
          {isLoadingShipments ? (
            <div className="h-[400px] w-full bg-gray-100/50 backdrop-blur-sm border border-gray-100 rounded-3xl animate-pulse"></div>
          ) : (
            <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Shipment ID</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Resources</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80">
                    {shipments?.map((shipment, idx) => {
                      const isSelected = selectedShipment?.id === shipment.id;
                      return (
                        <tr 
                          key={shipment.id} 
                          className={`group transition-all duration-300 ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'} animate-in fade-in slide-in-from-bottom-4`}
                          style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-gray-400'} transition-colors`} />
                              <span className={`text-sm font-bold font-mono tracking-tight ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                {shipment.id.split('-')[0]}...
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {getStatusBadge(shipment.status)}
                          </td>
                          <td className="px-6 py-5">
                            {shipment.vehicleAssignment ? (
                              <div className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100/50 w-fit px-2 py-0.5 rounded-md">
                                  <Truck className="w-3.5 h-3.5 text-blue-500"/> 
                                  {shipment.vehicleAssignment.vehiclePlate}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-gray-500 w-fit px-2 py-0.5">
                                  <User className="w-3.5 h-3.5 text-gray-400"/> 
                                  {shipment.driverAssignment?.driverName}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 italic bg-gray-50 px-3 py-1 rounded-md border border-dashed border-gray-200">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right">
                            {shipment.status === 'Preparing' ? (
                              <button 
                                onClick={() => setSelectedShipment(shipment)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                  isSelected 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
                                }`}
                              >
                                {isSelected ? 'Configuring...' : 'Assign Resources'}
                              </button>
                            ) : (
                              <button className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors">
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {shipments?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                            <Truck className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No active shipments found at the moment.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Assignment Form */}
        <div className={`xl:col-span-1 transition-all duration-500 ease-in-out origin-right ${selectedShipment ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-12 absolute pointer-events-none xl:relative xl:hidden'}`}>
          {selectedShipment && (
            <div className="sticky top-8 bg-white border border-gray-200/80 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-blue-900/5">
              
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Resource Assignment</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Ref</span>
                    <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                      {selectedShipment.id.split('-')[0]}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {assignMutation.isSuccess ? (
                <div className="text-center py-12 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner shadow-green-100">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Assignment Complete!</h3>
                  <p className="text-gray-500 mt-2">Resources locked and schedule confirmed.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Fleet Selection */}
                  <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                    <div className="space-y-2 group/select">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-500"/> Select Vehicle
                      </label>
                      <select {...register('vehicleId')} className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">-- Choose available vehicle --</option>
                        {vehicles?.map(v => <option key={v.id} value={v.id}>{v.plateNumber} ({v.type})</option>)}
                      </select>
                      {errors.vehicleId && <p className="text-red-500 text-xs font-semibold animate-pulse">{errors.vehicleId.message}</p>}
                    </div>

                    <div className="space-y-2 group/select">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500"/> Select Driver
                      </label>
                      <select {...register('driverId')} className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">-- Choose available driver --</option>
                        {drivers?.map(d => <option key={d.id} value={d.id}>{d.fullName} ({d.licenseNumber})</option>)}
                      </select>
                      {errors.driverId && <p className="text-red-500 text-xs font-semibold animate-pulse">{errors.driverId.message}</p>}
                    </div>
                  </div>

                  {/* Pickup Config */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-amber-600"/>
                      </span>
                      <h4 className="font-bold text-gray-900">Pickup Details</h4>
                    </div>
                    <div className="pl-8 space-y-3">
                      <input {...register('pickupAddress')} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all outline-none" placeholder="123 Warehouse St..." />
                      {errors.pickupAddress && <p className="text-red-500 text-xs font-semibold">{errors.pickupAddress.message}</p>}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <input type="time" {...register('pickupWindowStart')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400 transition-all outline-none text-sm font-medium" />
                          <input type="time" {...register('pickupWindowEnd')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400 transition-all outline-none text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Config */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600"/>
                      </span>
                      <h4 className="font-bold text-gray-900">Delivery Details</h4>
                    </div>
                    <div className="pl-8 space-y-3">
                      <input {...register('deliveryAddress')} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all outline-none" placeholder="456 Destination Ave..." />
                      {errors.deliveryAddress && <p className="text-red-500 text-xs font-semibold">{errors.deliveryAddress.message}</p>}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <input type="time" {...register('deliveryWindowStart')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-400 transition-all outline-none text-sm font-medium" />
                          <input type="time" {...register('deliveryWindowEnd')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-400 transition-all outline-none text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button 
                      type="submit"
                      disabled={assignMutation.isPending}
                      className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none"
                    >
                      {assignMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Assignment'
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedShipment(null)}
                      className="w-full mt-3 py-3 text-sm font-bold text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      Cancel & Close
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}