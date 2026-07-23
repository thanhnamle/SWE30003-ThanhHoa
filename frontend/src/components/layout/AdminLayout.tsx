import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-2xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

      </div>

      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Main */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}
        <Header
          toggleSidebar={() =>
            setSidebarCollapsed(!sidebarCollapsed)
          }
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          <div className="mx-auto h-full max-w-[1800px]">

            <div className="min-h-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-xl transition-all duration-300">

              <div className="p-6 lg:p-8">

                <Outlet />

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}