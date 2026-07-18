import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Map, 
  Package, 
  Navigation, 
  CreditCard, 
  FileText, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../features/auth/context/AuthContext";

const navSections = [
  {
    title: "Operations",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Orders", href: "/orders", icon: Package },
      { name: "Shipments", href: "/shipments", icon: Map },
      { name: "Tracking", href: "/tracking", icon: Navigation },
    ]
  },
  {
    title: "Fleet",
    items: [
      { name: "Vehicles", href: "/vehicles", icon: Truck },
      { name: "Drivers", href: "/drivers", icon: Users }, // Ideally a different icon, but keeping Users for now
    ]
  },
  {
    title: "Finance",
    items: [
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Reports", href: "/reports", icon: FileText },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
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
    <aside className={cn(
      "bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 flex flex-col shadow-sm z-10",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="bg-blue-600 rounded-lg p-1.5 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">SmartFM</span>
            <span className="text-[10px] text-gray-500 font-medium">Fleet Operations</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-6 px-3">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <h4 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h4>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
                          isActive 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          collapsed && "justify-center px-0"
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100 relative">
        <div 
          className={cn(
            "flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors",
            collapsed ? "justify-center" : ""
          )}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            LN
          </div>
          {!collapsed && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {user?.fullName ?? "Guest"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.role ?? "Customer"}
              </span>
            </div>
          )}
        </div>
        
        {showProfileMenu && (
          <div className="absolute bottom-16 left-4 w-48 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
