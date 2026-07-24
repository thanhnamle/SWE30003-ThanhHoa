import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageContainer } from "@/components/common/PageContainer";
import { Modal } from "@/components/common/Modal";
import { Driver, shipmentApi } from "../shipments/api/shipmentApi";
import { User, IdCard, Clock, Fingerprint, UserPlus, Loader2 } from "lucide-react";

const LICENSE_CLASSES = [
  { code: 'B2', label: 'Class B2', desc: 'Light Trucks & Vans (up to 3.5T)' },
  { code: 'C', label: 'Class C', desc: 'Heavy Freight Trucks (> 3.5T)' },
  { code: 'D', label: 'Class D', desc: 'Commercial Passenger Vehicles' },
  { code: 'E', label: 'Class E', desc: 'Trailers & Articulated Trucks' },
  { code: 'FC', label: 'Class FC', desc: 'Heavy Container Trucks' },
];

const driverSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  licenseClass: z.string().min(1, 'Please select a license class'),
  licenseCode: z.string().min(1, 'License ID / Code is required'),
  branchId: z.string(),
});

type DriverFormValues = z.infer<typeof driverSchema>;

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      licenseClass: 'B2',
      branchId: '11111111-1111-1111-1111-111111111111'
    }
  });

  const selectedClass = watch('licenseClass');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    setLoading(true);
    shipmentApi.getDrivers().then(data => {
      setDrivers(data);
      setLoading(false);
    });
  };

  const onSubmit = async (data: DriverFormValues) => {
    setIsSubmitting(true);
    try {
      const combinedLicense = `${data.licenseClass}-${data.licenseCode.trim()}`;
      await shipmentApi.createDriver({
        fullName: data.fullName,
        licenseNumber: combinedLicense,
        branchId: data.branchId,
        isOnLeave: false
      });
      setIsModalOpen(false);
      reset({
        fullName: '',
        licenseClass: 'B2',
        licenseCode: '',
        branchId: '11111111-1111-1111-1111-111111111111'
      });
      fetchDrivers();
    } catch (error) {
      console.error("Failed to create driver:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer 
      title="Drivers" 
      description="Manage your fleet drivers."
      action={
        <button 
          onClick={() => setIsModalOpen(true)}
          className="sfm-cta flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" /> Add Driver
        </button>
      }
    >
      <div className="pb-12 mt-6">
        
        {/* Loading Skeleton State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-48 bg-white/40 border border-gray-100 rounded-[2rem] shadow-sm p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="w-3/4 h-6 bg-gray-200 rounded-md"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Driver Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver, index) => {
              const isLeave = driver.isOnLeave;

              return (
                <div 
                  key={driver.id} 
                  className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 shadow-lg shadow-gray-200/30 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
                >
                  {/* Decorative Background Element */}
                  <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500 ${
                    isLeave ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500 shadow-inner">
                      <User className="w-7 h-7" />
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border transition-colors ${
                      isLeave 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    }`}>
                      {isLeave ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          On Leave
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </>
                      )}
                    </span>
                  </div>

                  <div className="relative z-10 mb-5">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                      {driver.fullName}
                    </h3>
                  </div>

                  {/* Driver Details */}
                  <div className="relative z-10 space-y-3 pt-5 border-t border-gray-100">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">License Number</span>
                      </div>
                      <span className="font-mono font-bold text-gray-900 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg w-fit group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-300">
                        {driver.licenseNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 pt-1">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <p className="text-xs font-mono truncate" title={driver.id}>
                        ID: {driver.id}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}

            {drivers.length === 0 && !loading && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <User className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No Drivers Found</h3>
                <p className="text-gray-500 mt-1">Your fleet currently has no drivers listed.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Driver"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              {...register('fullName')} 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. Jane Smith"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Class <span className="text-red-500">*</span></label>
              <select 
                {...register('licenseClass')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white cursor-pointer"
              >
                {LICENSE_CLASSES.map((lc) => (
                  <option key={lc.code} value={lc.code}>
                    {lc.code} - {lc.label} ({lc.desc})
                  </option>
                ))}
              </select>
              {errors.licenseClass && <p className="text-red-500 text-xs mt-1">{errors.licenseClass.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License ID / Number <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg font-mono font-bold text-sm text-blue-600 shrink-0">
                  {selectedClass || 'B2'}-
                </span>
                <input 
                  {...register('licenseCode')} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                  placeholder="e.g. 99887766"
                />
              </div>
              {errors.licenseCode && <p className="text-red-500 text-xs mt-1">{errors.licenseCode.message}</p>}
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
              Save Driver
            </button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}