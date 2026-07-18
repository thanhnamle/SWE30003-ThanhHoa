import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { Driver, shipmentApi } from "../shipments/api/shipmentApi";

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
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading drivers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map(driver => (
            <div key={driver.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${driver.isOnLeave ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {driver.isOnLeave ? 'On Leave' : 'Active'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">License: <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{driver.licenseNumber}</span></p>
              <p className="text-xs text-gray-400 font-mono truncate" title={driver.id}>{driver.id}</p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
