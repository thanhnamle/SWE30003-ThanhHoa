import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Truck, Info, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { orderApi, TransportOffering } from './api/orderApi';

const orderSchema = z.object({
  cargoWeightKg: z.number().min(1, 'Weight must be at least 1kg').max(20000, 'Exceeds maximum fleet capacity'),
  cargoVolumeM3: z.number().min(0.1, 'Volume must be at least 0.1m³'),
  specialHandlingNotes: z.string().optional(),
  transportOfferingId: z.string().min(1, 'Please select a transport offering'),
  customerId: z.string().min(1, 'Customer identity required'),
  branchId: z.string().min(1, 'Branch routing required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function Orders() {
  const [selectedOffering, setSelectedOffering] = useState<TransportOffering | null>(null);

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

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      branchId: '00000000-0000-0000-0000-000000000001', // Seeded Branch
    }
  });

  const orderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      setSelectedOffering(null);
      // Reset form usually goes here
    }
  });

  const onSubmit = (data: OrderFormValues) => {
    orderMutation.mutate(data);
  };

  const handleSelectOffering = (offering: TransportOffering) => {
    setSelectedOffering(offering);
    setValue('transportOfferingId', offering.id);
    if (customers && customers.length > 0) {
      setValue('customerId', customers[0].id); // Auto-bind to mock session customer
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Transport Order</h1>
          <p className="text-gray-500 mt-1">Select a service offering and configure your freight details.</p>
        </div>
      </div>

      {orderMutation.isSuccess && (
        <div className="bg-green-50/50 backdrop-blur-sm border border-green-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Order Successfully Placed</h3>
            <p className="text-green-700 mt-1">Your order has been sent to the branch for operational validation. You can track its progress in the Shipments dashboard once approved.</p>
            <button 
              onClick={() => orderMutation.reset()}
              className="mt-4 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-medium text-sm"
            >
              Create Another Order
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Offerings Catalog */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">1</span>
          Select Service Level
        </h2>
        
        {isLoadingOfferings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offerings?.map((offering) => (
              <div 
                key={offering.id}
                onClick={() => handleSelectOffering(offering)}
                className={`group relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                  selectedOffering?.id === offering.id 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50/30 border-blue-300 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-white/70 backdrop-blur-md border-gray-200 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${
                    selectedOffering?.id === offering.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                  } transition-colors`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  {selectedOffering?.id === offering.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 animate-in zoom-in" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{offering.category}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Up to {offering.maxCapacityKg.toLocaleString()} kg capacity</p>
                <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Base</span>
                  <span className="font-bold text-gray-900">${offering.baseFee}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Cargo Details */}
      <div className={`transition-all duration-500 ${selectedOffering ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-4'}`}>
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">2</span>
          Freight Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
          {orderMutation.isError && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{orderMutation.error?.message || 'Failed to submit order'}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total Weight (kg)</label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.1"
                  {...register('cargoWeightKg', { valueAsNumber: true })}
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border bg-white/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.cargoWeightKg ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'}`}
                  placeholder="e.g., 1500"
                />
                <Package className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.cargoWeightKg && <p className="text-red-500 text-xs font-medium">{errors.cargoWeightKg.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total Volume (m³)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  {...register('cargoVolumeM3', { valueAsNumber: true })}
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border bg-white/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.cargoVolumeM3 ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'}`}
                  placeholder="e.g., 5.5"
                />
                <div className="absolute right-4 top-3.5 text-sm font-bold text-gray-400">m³</div>
              </div>
              {errors.cargoVolumeM3 && <p className="text-red-500 text-xs font-medium">{errors.cargoVolumeM3.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Special Handling Notes
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <textarea 
                {...register('specialHandlingNotes')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 min-h-[100px] resize-none"
                placeholder="Any special instructions for the driver or warehouse staff (e.g., Keep refrigerated, fragile items, specific gate entry)..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit"
              disabled={orderMutation.isPending || !selectedOffering}
              className="group relative flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed overflow-hidden"
            >
              {orderMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Order
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
