import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Truck, Info, CheckCircle2, AlertCircle, ChevronRight, Loader2, Sparkles, Edit2, XCircle, List, Plus } from 'lucide-react';
import { orderApi, TransportOffering } from './api/orderApi';
import { format } from 'date-fns';

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
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [selectedOffering, setSelectedOffering] = useState<TransportOffering | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: offerings, isLoading: isLoadingOfferings } = useQuery({
    queryKey: ['offerings'],
    queryFn: orderApi.getOfferings
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: orderApi.getCustomers
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders
  });

  const { register, handleSubmit, setValue, setError, reset, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      branchId: '11111111-1111-1111-1111-111111111111', 
    }
  });

  const createMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      setSelectedOffering(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setActiveTab('list');
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
      setActiveTab('list');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
      createMutation.mutate(payload);
    }
  };

  const handleSelectOffering = (offering: TransportOffering) => {
    setSelectedOffering(offering);
    setValue('transportOfferingId', offering.id);
  };

  const handleEditClick = (order: any) => {
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

    setActiveTab('create');
  };

  const handleCancelForm = () => {
    setIsEditMode(false);
    setEditingOrderId(null);
    setSelectedOffering(null);
    reset();
  };

  const currentMutation = isEditMode ? editMutation : createMutation;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Orders Management
            </h1>
            <p className="text-gray-400 mt-2">Manage customer transport orders and capacity.</p>
          </div>
          <div className="flex bg-gray-800/50 p-1.5 rounded-xl border border-gray-700/50 backdrop-blur-md">
            <button 
              onClick={() => { setActiveTab('create'); if(!isEditMode) handleCancelForm(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Plus className="w-4 h-4" /> {isEditMode ? 'Edit Order' : 'New Order'}
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" /> My Orders
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Orders</h2>
          {isLoadingOrders ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 rounded-xl">
                  <tr>
                    <th className="px-4 py-3 text-sm font-bold text-gray-600 rounded-l-xl">Order ID</th>
                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Weight</th>
                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-sm font-bold text-gray-600 rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders?.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">{order.id.split('-')[0]}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{order.cargoWeightKg} kg</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{format(new Date(order.createdAt), 'PP')}</td>
                      <td className="px-4 py-4">
                        {order.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleEditClick(order)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => cancelMutation.mutate(order.id)} disabled={cancelMutation.isPending} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"><XCircle className="w-4 h-4" /></button>
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
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white text-sm">1</span>
              Select Service Level
            </h2>
            {isLoadingOfferings ? (
               <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {offerings?.map((offering) => {
                  const isSelected = selectedOffering?.id === offering.id;
                  return (
                    <div 
                      key={offering.id}
                      onClick={() => handleSelectOffering(offering)}
                      className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                    >
                      <Truck className={`w-6 h-6 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <h3 className={`font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{offering.category}</h3>
                      <p className="text-xs text-gray-500 mt-1">Up to {offering.maxCapacityKg} kg</p>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.transportOfferingId && <p className="text-red-500 text-sm font-semibold">{errors.transportOfferingId.message}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-900 text-white text-sm">2</span>
              Freight Details
            </h2>

            {currentMutation.isError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 font-medium">
                <AlertCircle className="w-5 h-5" />
                {currentMutation.error?.message || 'Failed to process request.'}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Customer</label>
                <select {...register('customerId')} className={`w-full p-3.5 rounded-xl border-2 ${errors.customerId ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500'} bg-gray-50 outline-none`}>
                  <option value="">Select customer...</option>
                  {customers?.map(c => <option key={c.id} value={c.id}>{c.name || c.fullName}</option>)}
                </select>
                {errors.customerId && <p className="text-red-500 text-xs font-semibold">{errors.customerId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Weight (kg)</label>
                <input type="number" step="0.1" {...register('cargoWeightKg', { valueAsNumber: true })} className={`w-full p-3.5 rounded-xl border-2 ${errors.cargoWeightKg ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500'} bg-gray-50 outline-none`} />
                {errors.cargoWeightKg && <p className="text-red-500 text-xs font-semibold">{errors.cargoWeightKg.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Volume (m³)</label>
                <input type="number" step="0.1" {...register('cargoVolumeM3', { valueAsNumber: true })} className={`w-full p-3.5 rounded-xl border-2 ${errors.cargoVolumeM3 ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500'} bg-gray-50 outline-none`} />
                {errors.cargoVolumeM3 && <p className="text-red-500 text-xs font-semibold">{errors.cargoVolumeM3.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Handling Notes</label>
                <textarea {...register('specialHandlingNotes')} className="w-full p-3.5 rounded-xl border-2 border-gray-100 focus:border-blue-500 bg-gray-50 outline-none h-24 resize-none" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
              <button type="button" onClick={handleCancelForm} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={currentMutation.isPending || !selectedOffering} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2">
                {currentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {isEditMode ? 'Save Changes' : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}