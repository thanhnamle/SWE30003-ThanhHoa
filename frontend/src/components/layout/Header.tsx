import { Menu, Bell, Search, ChevronRight, Package, User, Truck as TruckIcon, X, CheckCheck, Info, AlertTriangle, CreditCard } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi, NotificationDto } from "@/features/notifications/api/notificationApi";
import { searchApi, SearchResultDto } from "@/features/search/api/searchApi";
import { formatDistanceToNow } from "date-fns";

export function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const queryClient = useQueryClient();

  // --- Notifications State ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery<NotificationDto[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getRecent(10),
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading: isSearching } = useQuery<SearchResultDto[]>({
    queryKey: ['search', searchQuery],
    queryFn: () => searchApi.globalSearch(searchQuery),
    enabled: searchQuery.trim().length > 0,
  });

  // Debounce search input
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue.trim()) setShowSearch(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="hidden lg:flex flex-1 justify-center px-8" ref={searchRef}>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => { if (inputValue.trim()) setShowSearch(true); }}
              placeholder="Search anything..."
              className="w-full rounded-2xl border border-slate-200 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {/* Search Results Dropdown */}
            {showSearch && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        onClick={() => {
                          navigate(result.url);
                          setShowSearch(false);
                          setInputValue("");
                        }}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex gap-4 items-center transition"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          {result.type === "Customer" && <User className="h-5 w-5 text-blue-600" />}
                          {result.type === "Shipment" && <Package className="h-5 w-5 text-emerald-600" />}
                          {result.type === "Vehicle" && <TruckIcon className="h-5 w-5 text-amber-600" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{result.title}</div>
                          <div className="text-xs text-slate-500">{result.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 relative" ref={notifRef}>

          {/* Notification */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 transition-all duration-300 hover:bg-blue-50 hover:scale-105"
          >
            <Bell className="h-5 w-5 text-slate-600" />

            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </span>
            )}
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
                  Notifications ({unreadCount})
                </h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) markReadMutation.mutate(notif.id);
                    }}
                    className={`cursor-pointer p-5 transition hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <h4 className={`font-semibold ${!notif.isRead ? 'text-blue-900' : 'text-slate-900'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm ${!notif.isRead ? 'text-blue-700' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 p-4">
              <button 
                onClick={() => {
                  setShowNotifications(false);
                  setShowAllModal(true);
                }}
                className="w-full rounded-xl bg-slate-100 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                View All Notifications
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* View All Notifications Modal */}
      {showAllModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">All Notifications</h2>
                  <p className="text-xs text-slate-500 font-medium">Manage and view system alerts and updates</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllReadMutation.mutate()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                  >
                    <CheckCheck className="w-4 h-4" /> Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setShowAllModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-medium">
                  No notifications recorded yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) markReadMutation.mutate(notif.id);
                    }}
                    className={`p-4 rounded-2xl transition cursor-pointer flex items-start gap-4 border ${
                      !notif.isRead ? 'bg-blue-50/60 border-blue-100 shadow-xs' : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-100'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${
                      notif.title.toLowerCase().includes('order') ? 'bg-emerald-100 text-emerald-600' :
                      notif.title.toLowerCase().includes('delayed') ? 'bg-amber-100 text-amber-600' :
                      notif.title.toLowerCase().includes('payment') ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notif.title.toLowerCase().includes('order') && <Package className="w-5 h-5" />}
                      {notif.title.toLowerCase().includes('delayed') && <AlertTriangle className="w-5 h-5" />}
                      {notif.title.toLowerCase().includes('payment') && <CreditCard className="w-5 h-5" />}
                      {!notif.title.toLowerCase().includes('order') && !notif.title.toLowerCase().includes('delayed') && !notif.title.toLowerCase().includes('payment') && <Info className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs font-medium text-slate-400 shrink-0">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setShowAllModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}