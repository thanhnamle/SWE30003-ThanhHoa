import { Routes, Route } from "react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
import { Customers } from "./features/customers/Customers";
import { Drivers } from "./features/drivers/Drivers";
import { Vehicles } from "./features/vehicles/Vehicles";
import { Orders } from "./features/orders/Orders";
import { Shipments } from "./features/shipments/Shipments";
import { Tracking } from "./features/tracking/Tracking";
import { Payments } from "./features/payments/Payments";
import { Reports } from "./features/reports/Reports";
import { Settings } from "./features/settings/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
