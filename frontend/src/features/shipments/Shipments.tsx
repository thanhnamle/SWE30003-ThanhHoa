import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, User, MapPin, Loader2, CheckCircle2, Clock, Sparkles, X, Edit2, Trash2, Package, FileText, AlertTriangle, Car, Snowflake } from 'lucide-react';
import { shipmentApi, Shipment } from './api/shipmentApi';
import { ExceptionModal } from './components/ExceptionModal';

export const getVehicleIcon = (type?: string, className = "w-5 h-5") => {
  switch (type?.toLowerCase()) {
    case 'van': return <Car className={className} />;
    case 'container': return <Package className={className} />;
    case 'refrigerated': return <Snowflake className={className} />;
    case 'truck':
    default: return <Truck className={className} />;
  }
};

const getLicenseMismatchError = (driver?: { fullName: string; licenseNumber: string }, vehicle?: { type: string }): string => {
  if (!driver || !vehicle) return '';
  const licenseUpper = driver.licenseNumber.toUpperCase();
  const isFCorFE = licenseUpper.includes('FC') || licenseUpper.includes('FE');
  const isClassC = licenseUpper.includes('CLASS-C') || licenseUpper.startsWith('C-') || licenseUpper.startsWith('C') || isFCorFE;

  if (vehicle.type === 'Container' && !isFCorFE) {
    return `Driver ${driver.fullName} (${driver.licenseNumber}) cannot drive Container vehicles (Class FC/FE required).`;
  }
  if ((vehicle.type === 'Truck' || vehicle.type === 'Refrigerated') && (licenseUpper.startsWith('B2') || licenseUpper.includes('B2-')) && !isClassC) {
    return `Driver ${driver.fullName} (${driver.licenseNumber}) has a B2 license, which is insufficient for ${vehicle.type} (Class C required).`;
  }
  return '';
};

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
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null);
  const [deletingShipmentId, setDeletingShipmentId] = useState<string | null>(null);
  const [exceptionShipmentId, setExceptionShipmentId] = useState<string | null>(null);

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

  const { register, handleSubmit, formState: { errors }, reset, setError, watch } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  const watchedVehicleId = watch('vehicleId');
  const watchedDriverId = watch('driverId');

  const activeVehicle = vehicles?.find(v => v.id === watchedVehicleId);
  const activeDriver = drivers?.find(d => d.id === watchedDriverId);

  const realTimeLicenseError = getLicenseMismatchError(activeDriver, activeVehicle);

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
    let hasError = false;

    // Validate Vehicle Capacity & Maintenance
    const selectedVehicle = vehicles?.find(v => v.id === data.vehicleId);
    if (selectedVehicle) {
      if (selectedVehicle.isUnderMaintenance) {
        setError('vehicleId', {
          type: 'manual',
          message: `Vehicle ${selectedVehicle.plateNumber} is currently under maintenance.`
        });
        hasError = true;
      } else if (selectedShipment.order?.cargoWeightKg && selectedVehicle.maxPayloadKg < selectedShipment.order.cargoWeightKg) {
        setError('vehicleId', {
          type: 'manual',
          message: `Vehicle payload limit (${selectedVehicle.maxPayloadKg.toLocaleString()}kg) is less than cargo weight (${selectedShipment.order.cargoWeightKg.toLocaleString()}kg)`
        });
        hasError = true;
      } else if (selectedShipment.order?.cargoVolumeM3 && selectedVehicle.maxVolumeM3 < selectedShipment.order.cargoVolumeM3) {
        setError('vehicleId', {
          type: 'manual',
          message: `Vehicle volume limit (${selectedVehicle.maxVolumeM3}m³) is less than cargo volume (${selectedShipment.order.cargoVolumeM3}m³)`
        });
        hasError = true;
      }
    }

    // Validate Active Assignment Conflicts
    const activeShipments = shipments?.filter(s => s.status !== 'Delivered' && s.id !== selectedShipment.id) || [];
      
    const vehicleInUse = activeShipments.some(s => s.vehicleAssignment?.vehicleId === data.vehicleId);
    if (vehicleInUse && selectedVehicle) {
      setError('vehicleId', {
        type: 'manual',
        message: `Vehicle ${selectedVehicle.plateNumber} is currently assigned to another active shipment.`
      });
      hasError = true;
    }

    // Validate Driver Availability & License Class
    const selectedDriver = drivers?.find(d => d.id === data.driverId);
    if (selectedDriver) {
      if (selectedDriver.isOnLeave) {
        setError('driverId', {
          type: 'manual',
          message: `Driver ${selectedDriver.fullName} is currently on leave.`
        });
        hasError = true;
      } else if (selectedVehicle) {
        const mismatch = getLicenseMismatchError(selectedDriver, selectedVehicle);
        if (mismatch) {
          setError('driverId', {
            type: 'manual',
            message: mismatch
          });
          hasError = true;
        }
      }

      const driverInUse = activeShipments.some(s => s.driverAssignment?.driverId === data.driverId);
      if (driverInUse && selectedDriver) {
        setError('driverId', {
          type: 'manual',
          message: `Driver ${selectedDriver.fullName} is currently assigned to another active shipment.`
        });
        hasError = true;
      }
    }

    // Validate Pickup & Delivery Time Windows
    if (data.pickupWindowEnd <= data.pickupWindowStart) {
      setError('pickupWindowEnd', {
        type: 'manual',
        message: 'Pickup end time must be after start time.'
      });
      hasError = true;
    }

    if (data.deliveryWindowEnd <= data.deliveryWindowStart) {
      setError('deliveryWindowEnd', {
        type: 'manual',
        message: 'Delivery end time must be after start time.'
      });
      hasError = true;
    }

    if (hasError) return;

    assignMutation.mutate({ ...data, shipmentId: selectedShipment.id });
  };

  const deleteMutation = useMutation({
    mutationFn: shipmentApi.deleteShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      if (selectedShipment?.id === deleteMutation.variables) setSelectedShipment(null);
      setDeletingShipmentId(null);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => shipmentApi.updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setEditingShipmentId(null);
    }
  });

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
    <>
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
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer & Route</th>
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
                              <div>
                                <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'} transition-colors`}>{shipment.id.split('-')[0]}</p>
                                <p className="text-xs text-gray-500 font-medium">{new Date(shipment.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-sm">{shipment.order?.customerName || 'Unknown Customer'}</span>
                              <span className="text-xs text-gray-500 max-w-[200px] truncate" title={`${shipment.pickupDeliveryOption?.pickupAddress || 'Pending'} → ${shipment.pickupDeliveryOption?.deliveryAddress || 'Pending'}`}>
                                {shipment.pickupDeliveryOption?.pickupAddress?.split(',')[0] || 'Pending'} → {shipment.pickupDeliveryOption?.deliveryAddress?.split(',')[0] || 'Pending'}
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
                                  {getVehicleIcon(shipment.vehicleAssignment.vehicleType, "w-3.5 h-3.5 text-blue-500")} 
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
                          <td className="px-6 py-5 text-right space-x-2 whitespace-nowrap">
                            {editingShipmentId === shipment.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <select 
                                  value={editStatus}
                                  onChange={(e) => setEditStatus(e.target.value)}
                                  className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                                >
                                  <option value="Preparing">Preparing</option>
                                  <option value="ReadyForPickup">Ready For Pickup</option>
                                  <option value="InTransit">In Transit</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="ExceptionPending">Exception Pending</option>
                                </select>
                                <button 
                                  onClick={() => updateStatusMutation.mutate({ id: shipment.id, status: editStatus })}
                                  disabled={updateStatusMutation.isPending}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingShipmentId(null)}
                                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                {shipment.status === 'Preparing' && (
                                  <button 
                                    onClick={() => setSelectedShipment(shipment)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                      isSelected 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                        : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
                                    }`}
                                  >
                                    {isSelected ? 'Configuring...' : 'Assign Resources'}
                                  </button>
                                )}
                                {shipment.status !== 'Preparing' && (
                                  <>
                                    <button 
                                      onClick={() => setViewingShipment(shipment)}
                                      className="px-4 py-2 bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md rounded-xl text-sm font-bold transition-all duration-300"
                                    >
                                      View Details
                                    </button>
                                    <button 
                                      onClick={() => setExceptionShipmentId(shipment.id)}
                                      className="px-4 py-2 bg-red-50 border-2 border-red-100 text-red-600 hover:border-red-500 hover:text-red-700 hover:shadow-md rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-1.5"
                                    >
                                      <AlertTriangle className="w-4 h-4" /> Issues
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => { setEditingShipmentId(shipment.id); setEditStatus(shipment.status); }}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                  title="Edit Status"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setDeletingShipmentId(shipment.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Delete Shipment"
                                >
                                  {deleteMutation.isPending && deleteMutation.variables === shipment.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
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

              {/* Cargo Specification Summary Card */}
              {selectedShipment.order && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Cargo Requirements
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white text-blue-800 text-[10px] font-bold border border-blue-200/60 shadow-xs">
                      {selectedShipment.order.serviceCategory || 'Standard'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100/50">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Weight Required</p>
                      <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                        {selectedShipment.order.cargoWeightKg ? selectedShipment.order.cargoWeightKg.toLocaleString() : 'N/A'} <span className="text-xs font-normal text-gray-500">kg</span>
                      </p>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100/50">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Volume Required</p>
                      <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                        {selectedShipment.order.cargoVolumeM3 || 'N/A'} <span className="text-xs font-normal text-gray-500">m³</span>
                      </p>
                    </div>
                  </div>

                  {selectedShipment.order.customerName && (
                    <p className="text-xs text-gray-500 font-medium mt-2 pt-2 border-t border-blue-100/50 flex items-center justify-between">
                      <span>Customer:</span>
                      <strong className="text-gray-800">{selectedShipment.order.customerName}</strong>
                    </p>
                  )}
                </div>
              )}

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
                        {vehicles?.filter(v => !v.isUnderMaintenance).map(v => (
                          <option key={v.id} value={v.id}>
                            {v.plateNumber} ({v.type} • Max {v.maxPayloadKg ? v.maxPayloadKg.toLocaleString() : 0}kg / {v.maxVolumeM3}m³)
                          </option>
                        ))}
                      </select>
                      {errors.vehicleId && <p className="text-red-500 text-xs font-semibold animate-pulse">{errors.vehicleId.message}</p>}
                    </div>

                    <div className="space-y-2 group/select">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500"/> Select Driver
                      </label>
                      <select 
                        {...register('driverId')} 
                        className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none appearance-none cursor-pointer ${
                          realTimeLicenseError || errors.driverId 
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 font-medium' 
                            : 'border-gray-200 bg-white hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                        }`}
                      >
                        <option value="">-- Choose available driver --</option>
                        {drivers?.map(d => <option key={d.id} value={d.id}>{d.fullName} ({d.licenseNumber})</option>)}
                      </select>
                      
                      {(realTimeLicenseError || errors.driverId) && (
                        <div className="flex items-start gap-2.5 p-3.5 bg-red-50/90 border-2 border-red-200 rounded-xl text-red-700 text-xs font-bold animate-in fade-in slide-in-from-top-1 shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{realTimeLicenseError || errors.driverId?.message}</span>
                        </div>
                      )}
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
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Time From</label>
                            <input type="time" {...register('pickupWindowStart')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400 transition-all outline-none text-sm font-medium text-gray-700" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Time To</label>
                            <input type="time" {...register('pickupWindowEnd')} className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all outline-none text-sm font-medium ${errors.pickupWindowEnd ? 'border-red-500 bg-red-50/30 text-red-900' : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400'}`} />
                          </div>
                        </div>
                      </div>
                      {errors.pickupWindowEnd && <p className="text-red-500 text-xs font-semibold pl-6">{errors.pickupWindowEnd.message}</p>}
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
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Time From</label>
                            <input type="time" {...register('deliveryWindowStart')} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-400 transition-all outline-none text-sm font-medium text-gray-700" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Time To</label>
                            <input type="time" {...register('deliveryWindowEnd')} className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all outline-none text-sm font-medium ${errors.deliveryWindowEnd ? 'border-red-500 bg-red-50/30 text-red-900' : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-400'}`} />
                          </div>
                        </div>
                      </div>
                      {errors.deliveryWindowEnd && <p className="text-red-500 text-xs font-semibold pl-6">{errors.deliveryWindowEnd.message}</p>}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button 
                      type="submit"
                      disabled={assignMutation.isPending || !!realTimeLicenseError}
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

      {/* Clean View Details Modal */}
      {viewingShipment && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-[2px]" onClick={() => setViewingShipment(null)}></div>
          <div className="relative bg-white border border-slate-100 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] animate-in zoom-in-95 duration-200 custom-scrollbar">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-50/90 backdrop-blur-sm px-6 py-4 border-b border-slate-100 flex items-center justify-between z-20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Shipment #{viewingShipment.id.split('-')[0]}
                  </h2>
                  {getStatusBadge(viewingShipment.status)}
                </div>
              </div>
              <button 
                onClick={() => setViewingShipment(null)} 
                className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Context */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400"/> Order Context
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Customer Name</p>
                    <p className="font-bold text-gray-900 text-sm">{viewingShipment.order?.customerName || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Order Ref ID</p>
                    <p className="font-mono font-bold text-gray-700 text-sm">{viewingShipment.orderId.split('-')[0]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">Service Category</p>
                    <p className="font-bold text-gray-900 text-sm">{viewingShipment.order?.serviceCategory || 'Standard'}</p>
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400"/> Cargo Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Weight & Volume</p>
                    <div className="flex items-end gap-3">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{viewingShipment.order?.cargoWeightKg}</span>
                        <span className="text-sm text-gray-500 font-medium ml-1">kg</span>
                      </div>
                      <div className="w-px h-6 bg-gray-200 mb-1"></div>
                      <div>
                        <span className="text-xl font-bold text-gray-700">{viewingShipment.order?.cargoVolumeM3}</span>
                        <span className="text-sm text-gray-500 font-medium ml-1">m³</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100">
                    <p className="text-xs font-bold uppercase text-amber-700 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5"/> Handling Notes
                    </p>
                    <p className="text-sm font-medium text-amber-900/80">
                      {viewingShipment.order?.specialHandlingNotes || 'No special handling instructions provided.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule & Locations */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500"/> Schedule & Locations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Pickup Block */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs">
                    <p className="text-[11px] font-extrabold uppercase text-amber-600 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500"/> Pickup Location
                    </p>
                    <p className="font-bold text-gray-900 text-sm mb-2.5 line-clamp-2">
                      {viewingShipment.pickupDeliveryOption?.pickupAddress || 'Origin Address Pending Assignment'}
                    </p>
                    <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100/80 flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {viewingShipment.pickupDeliveryOption ? (
                          `Window: ${viewingShipment.pickupDeliveryOption.pickupWindowStart.includes('T') ? new Date(viewingShipment.pickupDeliveryOption.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : viewingShipment.pickupDeliveryOption.pickupWindowStart.slice(0, 5)} - ${viewingShipment.pickupDeliveryOption.pickupWindowEnd.includes('T') ? new Date(viewingShipment.pickupDeliveryOption.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : viewingShipment.pickupDeliveryOption.pickupWindowEnd.slice(0, 5)}`
                        ) : 'Pending Schedule'}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Block */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs">
                    <p className="text-[11px] font-extrabold uppercase text-emerald-600 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500"/> Delivery Location
                    </p>
                    <p className="font-bold text-gray-900 text-sm mb-2.5 line-clamp-2">
                      {viewingShipment.pickupDeliveryOption?.deliveryAddress || 'Destination Address Pending Assignment'}
                    </p>
                    <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80 flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {viewingShipment.pickupDeliveryOption ? (
                          `Window: ${viewingShipment.pickupDeliveryOption.deliveryWindowStart.includes('T') ? new Date(viewingShipment.pickupDeliveryOption.deliveryWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : viewingShipment.pickupDeliveryOption.deliveryWindowStart.slice(0, 5)} - ${viewingShipment.pickupDeliveryOption.deliveryWindowEnd.includes('T') ? new Date(viewingShipment.pickupDeliveryOption.deliveryWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : viewingShipment.pickupDeliveryOption.deliveryWindowEnd.slice(0, 5)}`
                        ) : 'Pending Schedule'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Assignment */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400"/> Fleet Allocation
                </h3>
                {viewingShipment.vehicleAssignment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
                      <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                        {getVehicleIcon(viewingShipment.vehicleAssignment.vehicleType, "w-5 h-5")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Assigned Vehicle</p>
                        <p className="font-bold text-gray-900 text-sm mt-0.5">{viewingShipment.vehicleAssignment.vehiclePlate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
                      <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Assigned Driver</p>
                        <p className="font-bold text-gray-900 text-sm mt-0.5">{viewingShipment.driverAssignment?.driverName || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm font-medium">Resources have not been assigned yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deletingShipmentId && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-[2px]" onClick={() => !deleteMutation.isPending && setDeletingShipmentId(null)}></div>
          <div className="relative bg-white border border-slate-100 rounded-2xl w-full max-w-md p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Shipment</h3>
              <p className="text-gray-500 mb-8">
                Are you sure you want to permanently delete shipment <span className="font-mono font-bold text-gray-700">#{deletingShipmentId.split('-')[0]}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setDeletingShipmentId(null)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deletingShipmentId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Exception Modal */}
      {exceptionShipmentId && (
        <ExceptionModal 
          shipmentId={exceptionShipmentId} 
          onClose={() => setExceptionShipmentId(null)} 
        />
      )}
    </>
  );
}