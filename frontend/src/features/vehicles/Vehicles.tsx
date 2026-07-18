import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { Vehicle, shipmentApi } from "../shipments/api/shipmentApi";

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
    <PageContainer title="Vehicles" description="Manage your fleet vehicles.">
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading vehicles...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plate Number</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity (Kg / M3)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {vehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 font-mono">{vehicle.plateNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{vehicle.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vehicle.maxPayloadKg.toLocaleString()} kg / {vehicle.maxVolumeM3} m³</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${vehicle.isUnderMaintenance ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {vehicle.isUnderMaintenance ? 'Maintenance' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
