import { Menu, Bell, Search, ChevronRight } from "lucide-react";
import { useLocation } from "react-router";
import { useState } from "react";

export function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            onClick={toggleSidebar}
            className="group rounded-xl p-2.5 transition-all duration-300 hover:bg-blue-50 hover:scale-105"
          >
            <Menu className="h-5 w-5 text-slate-600 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center text-sm">

            <span className="font-medium text-slate-400">
              Home
            </span>

            {pathnames.map((value, index) => {
              const isLast = index === pathnames.length - 1;

              return (
                <div
                  key={value}
                  className="flex items-center"
                >
                  <ChevronRight className="mx-2 h-4 w-4 text-slate-300" />

                  <span
                    className={`capitalize ${
                      isLast
                        ? "font-semibold text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Center Search */}
        <div className="hidden lg:flex flex-1 justify-center px-8">

          <div className="relative w-full max-w-xl">

            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

            <input
              placeholder="Search anything..."
              className="w-full rounded-2xl border border-slate-200 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3 relative">

          {/* Notification */}

          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="relative rounded-xl p-2.5 transition-all duration-300 hover:bg-blue-50 hover:scale-105"
          >
            <Bell className="h-5 w-5 text-slate-600" />

            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70"></span>

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>

            </span>
          </button>

          {/* Notification Dropdown */}

          <div
            className={`absolute right-0 top-16 w-96 origin-top rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
              showNotifications
                ? "visible scale-100 opacity-100 translate-y-0"
                : "invisible scale-95 opacity-0 -translate-y-2"
            }`}
          >

            <div className="border-b border-slate-100 p-5">

              <div className="flex items-center justify-between">

                <h3 className="font-bold text-slate-900">
                  Notifications
                </h3>

                <button className="text-sm font-medium text-blue-600 hover:underline">
                  Mark all read
                </button>

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              <div className="cursor-pointer p-5 transition hover:bg-slate-50">

                <div className="flex justify-between">

                  <h4 className="font-semibold text-slate-900">
                    New Order Created
                  </h4>

                  <span className="text-xs text-slate-400">
                    2m
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Samsung Electronics placed a new freight order.
                </p>

              </div>

              <div className="cursor-pointer p-5 transition hover:bg-slate-50">

                <div className="flex justify-between">

                  <h4 className="font-semibold text-slate-900">
                    Shipment Delayed
                  </h4>

                  <span className="text-xs text-slate-400">
                    1h
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  SHP-9022 is delayed due to heavy traffic conditions.
                </p>

              </div>

              <div className="cursor-pointer p-5 transition hover:bg-slate-50">

                <div className="flex justify-between">

                  <h4 className="font-semibold text-slate-900">
                    Payment Received
                  </h4>

                  <span className="text-xs text-slate-400">
                    Today
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Invoice INV-2026-114 has been successfully paid.
                </p>

              </div>

            </div>

            <div className="border-t border-slate-100 p-4">

              <button className="w-full rounded-xl bg-slate-100 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                View All Notifications
              </button>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}