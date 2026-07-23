import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageContainer } from "@/components/common/PageContainer";
import { Modal } from "@/components/common/Modal";
import { Vehicle, shipmentApi } from "../shipments/api/shipmentApi";
import { Truck, Wrench, Weight, Box, Activity, Plus, Loader2, Car, Snowflake, Package } from 'lucide-react';

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  type: z.enum(['Van', 'Truck', 'Container', 'Refrigerated']),
  maxPayloadKg: z.number().min(1, 'Max payload must be at least 1kg'),
  maxVolumeM3: z.number().min(0.1, 'Max volume must be at least 0.1m³'),
  branchId: z.string(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export const renderVehicleIcon = (type: string, className = "w-7 h-7") => {
  switch (type?.toLowerCase()) {
    case 'van':
      return <Car className={className} />;
    case 'container':
      return <Package className={className} />;
    case 'refrigerated':
      return <Snowflake className={className} />;
    case 'truck':
    default:
      return <Truck className={className} />;
  }
};

export const VEHICLE_DOMAIN_BOUNDS: Record<string, {
  minPayloadKg: number;
  maxPayloadKg: number;
  minVolumeM3: number;
  maxVolumeM3: number;
  defaultPayloadKg: number;
  defaultVolumeM3: number;
  rangeText: string;
}> = {
  Van: {
    minPayloadKg: 500,
    maxPayloadKg: 2000,
    minVolumeM3: 3,
    maxVolumeM3: 12,
    defaultPayloadKg: 1000,
    defaultVolumeM3: 6.5,
    rangeText: '500kg - 2,000kg • 3 - 12m³ (Light City Van)',
  },
  Truck: {
    minPayloadKg: 2000,
    maxPayloadKg: 15000,
    minVolumeM3: 12,
    maxVolumeM3: 50,
    defaultPayloadKg: 5000,
    defaultVolumeM3: 20,
    rangeText: '2,000kg - 15,000kg • 12 - 50m³ (Medium Cargo Truck)',
  },
  Refrigerated: {
    minPayloadKg: 1500,
    maxPayloadKg: 15000,
    minVolumeM3: 8,
    maxVolumeM3: 45,
    defaultPayloadKg: 3500,
    defaultVolumeM3: 16,
    rangeText: '1,500kg - 15,000kg • 8 - 45m³ (Cold Storage Reefer)',
  },
  Container: {
    minPayloadKg: 15000,
    maxPayloadKg: 40000,
    minVolumeM3: 30,
    maxVolumeM3: 120,
    defaultPayloadKg: 25000,
    defaultVolumeM3: 65,
    rangeText: '15,000kg - 40,000kg • 30 - 120m³ (Heavy Freight Container)',
  },
};

const vehicleTypeOptions = [
  {
    type: 'Van',
    label: 'Van',
    desc: 'Light city delivery (0.5T - 2T)',
    icon: Car,
    bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    type: 'Truck',
    label: 'Truck',
    desc: 'Medium freight (2T - 15T)',
    icon: Truck,
    bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    type: 'Container',
    label: 'Container',
    desc: 'Heavy container (15T - 40T)',
    icon: Package,
    bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    type: 'Refrigerated',
    label: 'Refrigerated',
    desc: 'Cold storage (1.5T - 15T)',
    icon: Snowflake,
    bgColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  }
];

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, setError } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'Van',
      branchId: '11111111-1111-1111-1111-111111111111'
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    setLoading(true);
    shipmentApi.getVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  };

  const onSubmit = async (data: VehicleFormValues) => {
    const bounds = VEHICLE_DOMAIN_BOUNDS[data.type];
    if (bounds) {
      let hasError = false;
      if (data.maxPayloadKg < bounds.minPayloadKg || data.maxPayloadKg > bounds.maxPayloadKg) {
        setError('maxPayloadKg', {
          type: 'manual',
          message: `Payload for ${data.type} must be between ${bounds.minPayloadKg.toLocaleString()}kg and ${bounds.maxPayloadKg.toLocaleString()}kg.`
        });
        hasError = true;
      }
      if (data.maxVolumeM3 < bounds.minVolumeM3 || data.maxVolumeM3 > bounds.maxVolumeM3) {
        setError('maxVolumeM3', {
          type: 'manual',
          message: `Volume for ${data.type} must be between ${bounds.minVolumeM3}m³ and ${bounds.maxVolumeM3}m³.`
        });
        hasError = true;
      }
      if (hasError) return;
    }

    setIsSubmitting(true);
    try {
      await shipmentApi.createVehicle({
        ...data,
        isUnderMaintenance: false
      });
      setIsModalOpen(false);
      reset();
      fetchVehicles();
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer 
      title="Fleet Vehicles" 
      description="Manage and monitor your active transport vehicles."
      action={
        <button 
          onClick={() => setIsModalOpen(true)}
          className="sfm-cta flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      }
    >
      <div className="pb-12 mt-6">
        
        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-56 bg-white/40 border border-gray-100 rounded-[2rem] shadow-sm p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="w-1/2 h-6 bg-gray-200 rounded-md"></div>
                  <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fleet Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => {
              const isMaintenance = vehicle.isUnderMaintenance;

              return (
                <div 
                  key={vehicle.id} 
                  className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 shadow-lg shadow-gray-200/30 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
                >
                  {/* Decorative Background Element */}
                  <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500 ${
                    isMaintenance ? 'bg-red-500' : 'bg-emerald-500'
                  }`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-inner transition-colors duration-500 ${
                      isMaintenance 
                        ? 'bg-red-50 text-red-500 group-hover:bg-red-100' 
                        : vehicle.type.toLowerCase() === 'van' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                        : vehicle.type.toLowerCase() === 'container' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                        : vehicle.type.toLowerCase() === 'refrigerated' ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100'
                        : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                    }`}>
                      {renderVehicleIcon(vehicle.type, "w-7 h-7")}
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border transition-colors ${
                      isMaintenance 
                        ? 'bg-red-50 text-red-700 border-red-200/60' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    }`}>
                      {isMaintenance ? (
                        <>
                          <Wrench className="w-3 h-3" />
                          Maintenance
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </>
                      )}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{vehicle.type}</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                      {vehicle.plateNumber}
                    </h3>
                  </div>

                  {/* Capacity Metrics */}
                  <div className="relative z-10 grid grid-cols-2 gap-3 mt-8 pt-5 border-t border-gray-100">
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50/50 transition-colors duration-300 border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Weight className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Payload</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        {vehicle.maxPayloadKg.toLocaleString()} <span className="text-gray-500 font-medium">kg</span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50/50 transition-colors duration-300 border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Box className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Volume</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        {vehicle.maxVolumeM3} <span className="text-gray-500 font-medium">m³</span>
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
            
            {vehicles.length === 0 && !loading && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <Truck className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No Vehicles Found</h3>
                <p className="text-gray-500 mt-1">Your fleet is currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Vehicle"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
            <input 
              {...register('plateNumber')} 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. 51A-123.45"
            />
            {errors.plateNumber && <p className="text-red-500 text-xs mt-1">{errors.plateNumber.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              {vehicleTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setValue('type', opt.type as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-500/10'
                        : 'border-gray-100 bg-gray-50/60 hover:bg-gray-100/80 hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-blue-600 text-white' : opt.bgColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-extrabold ${isSelected ? 'text-blue-950' : 'text-gray-900'}`}>{opt.label}</p>
                      <p className="text-[10px] font-semibold text-gray-500 leading-tight mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('type')} />
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}

            {/* Dynamic Logistics Spec Banner */}
            {selectedType && VEHICLE_DOMAIN_BOUNDS[selectedType] && (
              <div className="mt-2.5 p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-2xs">
                <span className="font-extrabold uppercase text-[10px] text-blue-600 tracking-wider">Normative Spec Range:</span>
                <span className="font-bold font-mono text-[11px] text-blue-950">
                  {VEHICLE_DOMAIN_BOUNDS[selectedType].rangeText}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Payload (kg)</label>
              <input 
                {...register('maxPayloadKg', { valueAsNumber: true })} 
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={`e.g. ${VEHICLE_DOMAIN_BOUNDS[selectedType]?.defaultPayloadKg || 1000}`}
              />
              {errors.maxPayloadKg && <p className="text-red-500 text-xs mt-1">{errors.maxPayloadKg.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Volume (m³)</label>
              <input 
                {...register('maxVolumeM3', { valueAsNumber: true })} 
                type="number"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={`e.g. ${VEHICLE_DOMAIN_BOUNDS[selectedType]?.defaultVolumeM3 || 15.5}`}
              />
              {errors.maxVolumeM3 && <p className="text-red-500 text-xs mt-1">{errors.maxVolumeM3.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Vehicle
            </button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}