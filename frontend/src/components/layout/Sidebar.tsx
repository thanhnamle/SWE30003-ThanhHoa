import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Truck,
  Map,
  Package,
  Navigation,
  CreditCard,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "../../features/auth/context/AuthContext";
import { SmartFMLogo } from "../common/SmartFMLogo";

const navSections = [
  {
    title: "Operations",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Orders", href: "/dashboard/orders", icon: Package },
      { name: "Shipments", href: "/dashboard/shipments", icon: Map },
      { name: "Tracking", href: "/dashboard/tracking", icon: Navigation },
    ],
  },
  {
    title: "Fleet",
    items: [
      { name: "Vehicles", href: "/dashboard/vehicles", icon: Truck },
      { name: "Drivers", href: "/dashboard/drivers", icon: Users },
    ],
  },
  {
    title: "Finance",
    items: [
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen overflow-hidden border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl transition-all duration-500 flex flex-col",
        collapsed ? "w-24" : "w-72"
      )}
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Logo */}

      <div className="relative border-b border-slate-100 px-6 py-6">

        <Link
          to="/"
          title="Back to Home"
          className={cn(
            "flex items-center cursor-pointer group",
            collapsed ? "justify-center" : "gap-4"
          )}
        >

          <div className="transition duration-300 group-hover:rotate-6 group-hover:scale-105">
            <SmartFMLogo className="h-12 w-12" />
          </div>

          {!collapsed && (

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  SmartFM
                </h2>

                <Sparkles className="h-4 w-4 text-blue-500" />

              </div>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                Fleet Platform
              </p>

            </div>

          )}

        </Link>

      </div>

      {/* Navigation */}

      <nav className="relative flex-1 overflow-y-auto py-6 px-4">

        <div className="space-y-8">

          {navSections.map((section) => (

            <div key={section.title}>

              {!collapsed && (

                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {section.title}
                </p>

              )}

              <ul className="space-y-2">

                {section.items.map((item) => {

                  const Icon = item.icon;

                  return (

                    <li key={item.name}>

                      <NavLink
                        to={item.href}
                        end={item.href === "/dashboard"}
                        title={collapsed ? item.name : undefined}
                        className={({ isActive }) =>
                          cn(
                            "group relative flex items-center rounded-2xl transition-all duration-300",
                            collapsed
                              ? "justify-center p-3"
                              : "gap-4 px-4 py-3",

                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>

                            {isActive && (
                              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-cyan-300" />
                            )}

                            <Icon
                              className={cn(
                                "h-5 w-5 transition duration-300",
                                isActive
                                  ? "text-white"
                                  : "group-hover:scale-110"
                              )}
                            />

                            {!collapsed && (

                              <span className="font-medium">
                                {item.name}
                              </span>

                            )}

                          </>
                        )}
                      </NavLink>

                    </li>

                  );

                })}

              </ul>

            </div>

          ))}

        </div>

      </nav>
            {/* User Section */}

      <div className="relative border-t border-slate-100 p-4">

        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={cn(
            "group w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:shadow-lg",
            collapsed
              ? "flex justify-center p-3"
              : "flex items-center gap-3 p-3"
          )}
        >

          {/* Avatar */}

          <div className="relative">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 font-bold text-white shadow-md">

              {user?.fullName
                ? user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "GU"}

            </div>

            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />

          </div>

          {!collapsed && (

            <div className="flex flex-1 flex-col overflow-hidden text-left">

              <span className="truncate text-sm font-semibold text-slate-900">
                {user?.fullName ?? "Guest User"}
              </span>

              <span className="truncate text-xs text-slate-500">
                {user?.role ?? "Customer"}
              </span>

            </div>

          )}

        </button>

        {/* Dropdown */}

        <div
          className={cn(
            "absolute bottom-24 left-4 right-4 origin-bottom rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300",
            showProfileMenu
              ? "visible translate-y-0 opacity-100 scale-100"
              : "invisible translate-y-2 opacity-0 scale-95"
          )}
        >

          <div className="border-b border-slate-100 p-4">

            <p className="text-sm font-semibold text-slate-900">
              {user?.fullName ?? "Guest User"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {user?.role ?? "Customer"}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100">
              →
            </span>

            Sign Out
          </button>

        </div>

      </div>

    </aside>
  );
}