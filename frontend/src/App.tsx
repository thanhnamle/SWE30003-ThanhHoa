import { Navigate, Route, Routes } from "react-router";
import { type ReactNode } from "react";
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
import { Login } from "./features/auth/Login";
import { Register } from "./features/auth/Register";
import { useAuth } from "./features/auth/context/AuthContext";
import { LandingPage } from "./features/landing/LandingPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Đang tải hệ thống...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
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
