import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { Driver, shipmentApi } from "../shipments/api/shipmentApi";
import { User, IdCard, CheckCircle2, Clock, Fingerprint } from "lucide-react";

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: shipmentApi.getDrivers() currently filters out drivers on leave.
    // To see all 5 mock drivers including the one on leave, we'd normally adjust the API.
    // For this demonstration, we are displaying the results exactly as provided by the API.
    shipmentApi.getDrivers().then(data => {
      setDrivers(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer title="Drivers" description="Manage your fleet drivers.">
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
                      {driver.name}
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
    </PageContainer>
  );
}