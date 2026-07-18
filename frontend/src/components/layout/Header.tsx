import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router";
import { useState } from "react";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 h-16 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center text-sm text-gray-500 font-medium">
          <span>Home</span>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            return (
              <span key={value} className="flex items-center">
                <span className="mx-2 text-gray-300">/</span>
                <span className={isLast ? "text-gray-900 font-semibold capitalize" : "capitalize"}>
                  {value}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {showNotifications && (
          <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">Mark all as read</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm text-gray-900 font-medium">New Order Created</p>
                <p className="text-xs text-gray-500 mt-1">Order ORD-10486 was just placed by Samsung Electronics.</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase">2 minutes ago</p>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm text-gray-900 font-medium">Delivery Delayed</p>
                <p className="text-xs text-gray-500 mt-1">Shipment SHP-9022 is experiencing traffic delays in District 1.</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase">1 hour ago</p>
              </div>
            </div>
            <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
              <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">View all notifications</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
