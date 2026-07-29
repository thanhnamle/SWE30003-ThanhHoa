import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Truck, Info, CheckCircle2, AlertCircle, ChevronRight, Loader2, Sparkles, Edit2, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { orderApi, TransportOffering } from './api/orderApi';
import { shipmentApi } from '../shipments/api/shipmentApi';

const orderSchema = z.object({
  cargoWeightKg: z.number().min(1, 'Weight must be at least 1kg').max(20000, 'Exceeds maximum fleet capacity'),
  cargoVolumeM3: z.number().min(0.1, 'Volume must be at least 0.1m³'),
  specialHandlingNotes: z.string().optional(),
  transportOfferingId: z.string().min(1, 'Please select a transport offering'),
  customerId: z.string().min(1, 'Customer identity required'),
  branchId: z.string().min(1, 'Branch routing required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const getServiceDescription = (category: string) => {
  switch (category.toLowerCase()) {
    case 'express': return 'Priority routing with guaranteed fast delivery times.';
    case 'fragile': return 'Specialized handling for delicate or high-value cargo.';
    case 'standard': return 'Cost-effective reliable transport for regular goods.';
    case 'bulk': return 'Dedicated heavy-duty fleet for massive volume transport.';
    default: return 'Reliable transport for your cargo needs.';
  }
};

export function Orders() {
  const [selectedOffering, setSelectedOffering] = useState<TransportOffering | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch Offerings
  const { data: offerings, isLoading: isLoadingOfferings } = useQuery({
    queryKey: ['offerings'],
    queryFn: orderApi.getOfferings
  });

  // Fetch Customers (Mocked active session)
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: orderApi.getCustomers
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders
  });

  const { data: shipments } = useQuery({
    queryKey: ['shipments'],
    queryFn: shipmentApi.getShipments
  });

  const { register, handleSubmit, setValue, setError, reset, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      branchId: '11111111-1111-1111-1111-111111111111', // Seeded Branch
    }
  });

  const orderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      setSelectedOffering(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const editMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) => orderApi.editOrder(data.id, data.payload),
    onSuccess: () => {
      setSelectedOffering(null);
      setIsEditMode(false);
      setEditingOrderId(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const approveMutation = useMutation({
    mutationFn: orderApi.approveOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    }
  });

  const onSubmit = (data: OrderFormValues) => {
    if (selectedOffering && data.cargoWeightKg > selectedOffering.maxCapacityKg) {
      setError('cargoWeightKg', {
        type: 'manual',
        message: `Exceeds the ${selectedOffering.category} capacity limit of ${selectedOffering.maxCapacityKg.toLocaleString()}kg`
      });
      return;
    }

    const payload = {
      ...data,
      specialHandlingNotes: data.specialHandlingNotes ?? '',
    };

    if (isEditMode && editingOrderId) {
      editMutation.mutate({ id: editingOrderId, payload });
    } else {
      orderMutation.mutate(payload);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (order: any) => {
    orderMutation.reset();
    editMutation.reset();
    setIsEditMode(true);
    setEditingOrderId(order.id);
    
    setValue('customerId', order.customerId);
    setValue('cargoWeightKg', order.cargoWeightKg);
    setValue('cargoVolumeM3', order.cargoVolumeM3);
    setValue('specialHandlingNotes', order.specialHandlingNotes || '');
    setValue('transportOfferingId', order.transportOfferingId);
    setValue('branchId', order.branchId || '11111111-1111-1111-1111-111111111111');

    const offering = offerings?.find(o => o.id === order.transportOfferingId);
    if (offering) setSelectedOffering(offering);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelForm = () => {
    setIsEditMode(false);
    setEditingOrderId(null);
    setSelectedOffering(null);
    reset();
  };

  const currentMutation = isEditMode ? editMutation : orderMutation;

  const handleSelectOffering = (offering: TransportOffering) => {
    setSelectedOffering(offering);
    setValue('transportOfferingId', offering.id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> {isEditMode ? 'Edit Shipment' : 'New Shipment'}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              Create Transport Order
            </h1>
            <p className="text-gray-400 mt-3 text-lg max-w-xl">
              Configure your freight details and select a service offering to get your cargo moving.
            </p>
          </div>
        </div>
      </div>

      {/* Success State */}
      <div className={`transition-all duration-700 ease-in-out transform ${(orderMutation.isSuccess || editMutation.isSuccess) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 absolute pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 backdrop-blur-xl border border-green-200/60 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-green-100 rounded-full shadow-inner shadow-green-200/50">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">{editMutation.isSuccess ? 'Order Successfully Updated!' : 'Order Successfully Placed!'}</h3>
              <p className="text-green-700 mt-1.5 leading-relaxed max-w-2xl">
                {editMutation.isSuccess 
                  ? 'Your changes have been saved successfully.' 
                  : 'Your order has been sent to the branch for operational validation. You can track its progress in the Shipments dashboard once approved.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { orderMutation.reset(); editMutation.reset(); handleCancelForm(); }}
            className="whitespace-nowrap px-6 py-3 bg-white border border-green-200 text-green-700 rounded-xl hover:bg-green-60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm font-semibold focus:ring-4 focus:ring-green-500/20"
          >
            {editMutation.isSuccess ? 'Dismiss' : 'Create Another Order'}
          </button>
        </div>
      </div>

      <div ref={formRef} className={`space-y-12 transition-all duration-500 ${(orderMutation.isSuccess || editMutation.isSuccess) ? 'opacity-40 pointer-events-none grayscale-[30%]' : 'opacity-100'}`}>
        
        {/* Step 1: Offerings Catalog */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Select Service Level</h2>
          </div>
          
          {isLoadingOfferings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerings?.map((offering) => {
                const isSelected = selectedOffering?.id === offering.id;
                return (
                  <div 
                    key={offering.id}
                    onClick={() => handleSelectOffering(offering)}
                    className={`group relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-500 ease-out border-2 ${
                      isSelected 
                        ? 'bg-blue-50/40 border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1.5'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-[100px] -z-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3.5 rounded-2xl transition-all duration-500 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                          : 'bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        <Truck className="w-6 h-6" />
                      </div>
                      
                      <div className={`transition-all duration-500 transform ${isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <CheckCircle2 className="w-7 h-7 text-blue-500" />
                      </div>
                    </div>
                    
                    <h3 className={`font-bold text-xl transition-colors duration-300 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {offering.category}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Up to {offering.maxCapacityKg.toLocaleString()} kg capacity</p>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                      {getServiceDescription(offering.category)}
                    </p>
                    
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-end justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Base Rate</span>
                      <span className={`text-2xl font-black transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                        ${offering.baseFee}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Cargo Details */}
        <div className={`transition-all duration-700 ease-out transform origin-top ${
          selectedOffering 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95 pointer-events-none h-0 overflow-hidden'
        }`}>
          <div className="flex items-center gap-4 mb-6 pt-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white font-bold shadow-lg shadow-gray-900/20">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Freight Details</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white border border-gray-200/60 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/40">
            {currentMutation.isError && (
              <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Submission Failed</h4>
                  <p className="text-sm text-red-700 mt-1">{currentMutation.error?.message || 'We could not process your request at this time.'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group/input md:col-span-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Customer</label>
                <div className="relative">
                  <select 
                    {...register('customerId')}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none ${
                      errors.customerId 
                        ? 'border-red-300 focus:border-red-500 text-red-900' 
                        : 'border-gray-100 focus:border-blue-500 text-gray-900'
                    }`}
                  >
                    <option value="">Select a customer...</option>
                    {customers?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.fullName || c.companyName || 'Unknown Customer'} {c.email ? `(${c.email})` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <ChevronRight className={`w-5 h-5 rotate-90 transition-colors duration-300 ${errors.customerId ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                </div>
                {errors.customerId && <p className="text-red-500 text-sm font-semibold animate-pulse">{errors.customerId.message}</p>}
              </div>

              <div className="space-y-3 group/input">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Total Weight (kg)</label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    {...register('cargoWeightKg', { valueAsNumber: true })}
                    className={`w-full pl-5 pr-12 py-4 rounded-2xl border-2 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                      errors.cargoWeightKg 
                        ? 'border-red-300 focus:border-red-500 text-red-900' 
                        : 'border-gray-100 focus:border-blue-500 text-gray-900'
                    }`}
                    placeholder="e.g., 1500"
                  />
                  <Package className={`absolute right-4 top-4 w-6 h-6 transition-colors duration-300 ${errors.cargoWeightKg ? 'text-red-400' : 'text-gray-400 group-focus-within/input:text-blue-500'}`} />
                </div>
                {errors.cargoWeightKg && <p className="text-red-500 text-sm font-semibold animate-pulse">{errors.cargoWeightKg.message}</p>}
              </div>

              <div className="space-y-3 group/input">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Total Volume (m³)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    {...register('cargoVolumeM3', { valueAsNumber: true })}
                    className={`w-full pl-5 pr-12 py-4 rounded-2xl border-2 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                      errors.cargoVolumeM3 
                        ? 'border-red-300 focus:border-red-500 text-red-900' 
                        : 'border-gray-100 focus:border-blue-500 text-gray-900'
                    }`}
                    placeholder="e.g., 5.5"
                  />
                  <div className={`absolute right-5 top-4 font-black transition-colors duration-300 ${errors.cargoVolumeM3 ? 'text-red-400' : 'text-gray-400 group-focus-within/input:text-blue-500'}`}>m³</div>
                </div>
                {errors.cargoVolumeM3 && <p className="text-red-500 text-sm font-semibold animate-pulse">{errors.cargoVolumeM3.message}</p>}
              </div>

              <div className="space-y-3 md:col-span-2 group/textarea">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  Special Handling Notes
                  <Info className="w-4 h-4 text-gray-400" />
                </label>
                <textarea 
                  {...register('specialHandlingNotes')}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] resize-y text-gray-900"
                  placeholder="Any special instructions for the driver or warehouse staff (e.g., Keep refrigerated, fragile items, specific gate entry)..."
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium text-gray-500 hidden md:block">
                Double check your requirements before submitting.
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={handleCancelForm}
                  className="w-full sm:w-auto px-6 py-4 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700 rounded-2xl font-bold transition-all duration-300 shadow-sm text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={currentMutation.isPending || !selectedOffering}
                  className="group relative w-full sm:w-auto flex justify-center items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-blue-600/30 disabled:shadow-none hover:-translate-y-1 disabled:translate-y-0 disabled:cursor-not-allowed overflow-hidden"
                >
                  {currentMutation.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      {isEditMode ? 'Save Changes' : 'Confirm & Submit Order'}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-gray-200/60 p-8 shadow-xl shadow-gray-200/40 mt-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">My Recent Orders</h2>
        </div>
        
        {isLoadingOrders ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600 rounded-l-xl">Order ID</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600">Customer</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600">Service Level</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600">Status</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600">Weight</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600">Date</th>
                  <th className="px-5 py-4 text-sm font-bold text-gray-600 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders?.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm text-gray-600 font-bold uppercase">{order.id.split('-')[0]}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                      {customers?.find(c => c.id === order.customerId)?.fullName || customers?.find(c => c.id === order.customerId)?.name || customers?.find(c => c.id === order.customerId)?.companyName || 'Unknown Customer'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {offerings?.find(o => o.id === order.transportOfferingId)?.category || 'Unknown'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.cargoWeightKg} kg</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{format(new Date(order.createdAt), 'PP')}</td>
                    <td className="px-5 py-4">
                      {order.status === 'Pending' && !shipments?.some(s => s.orderId === order.id && s.status !== 'Preparing') && (
                        <div className="flex gap-2">
                          <button onClick={() => approveMutation.mutate(order.id)} disabled={approveMutation.isPending} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50" title="Approve Order"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => handleEditClick(order)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit Order"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => cancelMutation.mutate(order.id)} disabled={cancelMutation.isPending} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50" title="Cancel Order"><XCircle className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}