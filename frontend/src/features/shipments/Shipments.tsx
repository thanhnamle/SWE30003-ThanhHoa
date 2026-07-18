import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, User, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
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
      setSelectedShipment(null);
      reset();
    }
  });

  const onSubmit = (data: AssignmentFormValues) => {
    if (!selectedShipment) return;
    assignMutation.mutate({ ...data, shipmentId: selectedShipment.id });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Preparing': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Preparing</span>;
      case 'ReadyForPickup': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Ready For Pickup</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Branch Operations</h1>
        <p className="text-gray-500 mt-1">Manage active shipments and assign local resources.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Shipment List */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Shipments</h2>
          
          {isLoadingShipments ? (
            <div className="h-64 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl animate-pulse"></div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipment ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {shipments?.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900 font-mono">
                        {shipment.id.split('-')[0]}...
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(shipment.status)}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {shipment.vehicleAssignment ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1"><Truck className="w-3 h-3"/> {shipment.vehicleAssignment.vehiclePlate}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3"/> {shipment.driverAssignment?.driverName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {shipment.status === 'Preparing' && (
                          <button 
                            onClick={() => setSelectedShipment(shipment)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Assign Resources
                          </button>
                        )}
                        {shipment.status !== 'Preparing' && (
                          <button className="px-4 py-2 text-gray-400 hover:text-gray-600 rounded-lg text-sm font-semibold transition-colors">
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {shipments?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No active shipments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Assignment Form */}
        {selectedShipment && (
          <div className="xl:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl border border-blue-200/60 rounded-3xl p-6 shadow-lg shadow-blue-500/5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Resource Assignment</h2>
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{selectedShipment.id.split('-')[0]}</span>
              </div>

              {assignMutation.isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Assignment Complete</h3>
                  <p className="text-sm text-gray-500 mt-1">Resources locked and schedule confirmed.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Truck className="w-4 h-4"/> Select Vehicle</label>
                    <select {...register('vehicleId')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">-- Choose available vehicle --</option>
                      {vehicles?.map(v => <option key={v.id} value={v.id}>{v.plateNumber} ({v.type})</option>)}
                    </select>
                    {errors.vehicleId && <p className="text-red-500 text-xs">{errors.vehicleId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><User className="w-4 h-4"/> Select Driver</label>
                    <select {...register('driverId')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">-- Choose available driver --</option>
                      {drivers?.map(d => <option key={d.id} value={d.id}>{d.name} ({d.licenseNumber})</option>)}
                    </select>
                    {errors.driverId && <p className="text-red-500 text-xs">{errors.driverId.message}</p>}
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500"/> Pickup Location</label>
                      <input {...register('pickupAddress')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50" placeholder="123 Warehouse St..." />
                      {errors.pickupAddress && <p className="text-red-500 text-xs">{errors.pickupAddress.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" {...register('pickupWindowStart')} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                      <input type="time" {...register('pickupWindowEnd')} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500"/> Delivery Location</label>
                      <input {...register('deliveryAddress')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50" placeholder="456 Destination Ave..." />
                      {errors.deliveryAddress && <p className="text-red-500 text-xs">{errors.deliveryAddress.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" {...register('deliveryWindowStart')} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                      <input type="time" {...register('deliveryWindowEnd')} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={assignMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                      {assignMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Assignment'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedShipment(null)}
                      className="w-full mt-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
