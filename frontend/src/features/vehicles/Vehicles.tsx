import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { Vehicle, shipmentApi } from "../shipments/api/shipmentApi";
import { Truck, Wrench, CheckCircle2, Weight, Box, Activity } from 'lucide-react';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shipmentApi.getVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer title="Fleet Vehicles" description="Manage and monitor your active transport vehicles.">
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
                  style={{ animationFillMode: 'both' }}
                >
                  {/* Decorative Background Element */}
                  <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500 ${
                    isMaintenance ? 'bg-red-500' : 'bg-emerald-500'
                  }`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-inner transition-colors duration-500 ${
                      isMaintenance 
                        ? 'bg-red-50 text-red-500 group-hover:bg-red-100' 
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      <Truck className="w-7 h-7" />
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
    </PageContainer>
  );
}