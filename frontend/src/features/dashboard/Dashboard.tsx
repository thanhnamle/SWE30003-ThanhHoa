import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { PageContainer } from "@/components/common/PageContainer";
import { Package, Truck, DollarSign, Users, ArrowUpRight, ArrowDownRight, Plus, Boxes, Snowflake } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { shipmentApi } from "../shipments/api/shipmentApi";
import { paymentApi } from "../payments/api/paymentApi";

export function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, orders: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      shipmentApi.getVehicles(),
      shipmentApi.getDrivers(),
      shipmentApi.getShipments(),
      paymentApi.getInvoices()
    ]).then(([vehicles, drivers, shipments, invoices]) => {
      const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
      setStats({
        vehicles: vehicles.length,
        drivers: drivers.length,
        orders: shipments.length,
        revenue: totalRevenue || 1840000,
        customers: 5
      });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setBarsVisible(true), 250);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const revenueData = [
    { name: 'Jan', value: 40 }, { name: 'Feb', value: 50 }, { name: 'Mar', value: 48 },
    { name: 'Apr', value: 65 }, { name: 'May', value: 72 }, { name: 'Jun', value: 68 },
    { name: 'Jul', value: 85 }, { name: 'Aug', value: 80 }, { name: 'Sep', value: 92 },
    { name: 'Oct', value: 88 }, { name: 'Nov', value: 105 }, { name: 'Dec', value: 115 }
  ];

  const shipmentStatusData = [
    { name: 'Pending', value: 45 },
    { name: 'Delivered', value: 420 },
    { name: 'Returned', value: 12 },
  ];

  const recentOrders = [
    { id: 'ORD-10482', customer: 'VinFast Assembly Co.', route: 'HCM → Hanoi', status: 'In Transit', amount: 4280 },
    { id: 'ORD-10483', customer: 'Samsung Electronics', route: 'Bac Ninh → Hai Phong', status: 'Delivered', amount: 8500 },
    { id: 'ORD-10484', customer: 'TH True Milk', route: 'Nghe An → Danang', status: 'Pending', amount: 1250 },
    { id: 'ORD-10485', customer: 'Hoa Phat Group', route: 'Quang Ngai → HCM', status: 'In Transit', amount: 15400 },
  ];

  return (
    <PageContainer 
      title="Operations dashboard" 
      description="A real-time snapshot of your fleet, shipments and revenue."
      action={
        <div className="flex items-center gap-3">
          <Link to="/orders" className="sfm-cta flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm">
            <Plus className="w-4 h-4" /> New order
          </Link>
        </div>
      }
    >
      <style>{`
        @keyframes sfm-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfm-pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.35; } }
        @keyframes sfm-shimmer { from { transform: translateX(-100%); } to { transform: translateX(220%); } }
        @keyframes sfm-icon-pop { from { opacity: 0; transform: scale(0.6) rotate(-8deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        .sfm-enter { opacity: 0; animation: sfm-fade-up 0.5s ease-out forwards; }
        .sfm-icon-pop { animation: sfm-icon-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .sfm-live-dot { position: relative; }
        .sfm-live-dot::after {
          content: ''; position: absolute; inset: 0; border-radius: 9999px;
          background: inherit; animation: sfm-pulse-dot 1.8s ease-in-out infinite;
        }
        .sfm-bar-fill { position: relative; overflow: hidden; }
        .sfm-bar-fill::after {
          content: ''; position: absolute; inset: 0; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: sfm-shimmer 2.2s ease-in-out infinite;
        }
        .sfm-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .sfm-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -8px rgba(30, 64, 175, 0.15);
        }
        .sfm-table-row {
          opacity: 0; animation: sfm-fade-up 0.4s ease-out forwards;
          transition: background-color 0.2s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .sfm-enter, .sfm-icon-pop, .sfm-live-dot::after, .sfm-bar-fill::after, .sfm-table-row { animation: none !important; }
          .sfm-card:hover { transform: none; }
        }
      `}</style>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 text-gray-500 py-20">
          <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="sfm-enter" style={{ animationDelay: '0s' }}>
              <DashboardCard 
                title="ACTIVE SHIPMENTS" 
                value={(stats.orders * 250).toLocaleString()} 
                icon={<Package className="w-5 h-5" />}
                accent="blue"
                trend={{ value: 8.2, isPositive: true }}
              />
            </div>
            <div className="sfm-enter" style={{ animationDelay: '0.08s' }}>
              <DashboardCard 
                title="FLEET UTILIZATION" 
                value="86.4%" 
                icon={<Truck className="w-5 h-5" />}
                accent="indigo"
                trend={{ value: 3.1, isPositive: true }}
              />
            </div>
            <div className="sfm-enter" style={{ animationDelay: '0.16s' }}>
              <DashboardCard 
                title="MONTHLY REVENUE" 
                value={`$${(stats.revenue / 1000000).toFixed(2)}M`} 
                icon={<DollarSign className="w-5 h-5" />}
                accent="emerald"
                trend={{ value: 12.6, isPositive: true }}
              />
            </div>
            <div className="sfm-enter" style={{ animationDelay: '0.24s' }}>
              <DashboardCard 
                title="ACTIVE CUSTOMERS" 
                value={(stats.customers * 68).toLocaleString()} 
                icon={<Users className="w-5 h-5" />}
                accent="violet"
                trend={{ value: 1.4, isPositive: false }}
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="sfm-card sfm-enter lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">Revenue overview</h3>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="sfm-live-dot w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Monthly gross revenue ($, thousands)</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">FY 2026</span>
              </div>
              <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.28}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 30, 60, 90, 120]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 8px 20px -6px rgb(30 64 175 / 0.2)' }}
                      formatter={(val: any) => [`$${val}k`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sfm-card sfm-enter bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col" style={{ animationDelay: '0.38s' }}>
              <h3 className="font-bold text-gray-900 text-base">Shipment status</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">Last 30 days</p>
              <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shipmentStatusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 150, 300, 450, 600]} />
                    <RechartsTooltip 
                      cursor={{ fill: '#eff6ff' }}
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 8px 20px -6px rgb(30 64 175 / 0.2)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1200}>
                      {shipmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Delivered' ? '#2563eb' : entry.name === 'Pending' ? '#60a5fa' : '#bfdbfe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Original Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="sfm-card sfm-enter bg-white border border-gray-200/80 rounded-2xl p-6 h-[400px] flex flex-col shadow-sm" style={{ animationDelay: '0.44s' }}>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Package className="w-4 h-4" />
                </span>
                Shipments Over Time
              </h3>
              <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Jan', shipments: 65 },
                    { name: 'Feb', shipments: 59 },
                    { name: 'Mar', shipments: 80 },
                    { name: 'Apr', shipments: 81 },
                    { name: 'May', shipments: 56 },
                    { name: 'Jun', shipments: 95 },
                    { name: 'Jul', shipments: 110 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 8px 20px -6px rgb(30 64 175 / 0.2)' }}
                    />
                    <Area type="monotone" dataKey="shipments" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorShipments)" animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sfm-card sfm-enter bg-white border border-gray-200/80 rounded-2xl p-6 h-[400px] flex flex-col shadow-sm" style={{ animationDelay: '0.5s' }}>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </span>
                Revenue by Region
              </h3>
              <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'North', revenue: 42000 },
                    { name: 'South', revenue: 38000 },
                    { name: 'East', revenue: 21000 },
                    { name: 'West', revenue: 29000 },
                    { name: 'Central', revenue: 15000 },
                  ]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val: number) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f0fdf4' }}
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 8px 20px -6px rgb(30 64 175 / 0.2)' }}
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="sfm-card sfm-enter lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm" style={{ animationDelay: '0.56s' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-base">Recent orders</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-transparent border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Route</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="sfm-table-row border-b border-gray-50 last:border-0 hover:bg-blue-50/50"
                        style={{ animationDelay: `${0.62 + idx * 0.06}s` }}
                      >
                        <td className="py-4 font-semibold text-gray-900">{order.id}</td>
                        <td className="py-4 text-gray-600">{order.customer}</td>
                        <td className="py-4 text-gray-500">{order.route}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-500' :
                              order.status === 'In Transit' ? 'bg-blue-500 sfm-live-dot' :
                              'bg-gray-400'
                            }`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-semibold text-gray-900">${order.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sfm-card sfm-enter bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm" style={{ animationDelay: '0.62s' }}>
              <h3 className="font-bold text-gray-900 text-base mb-6">Fleet availability</h3>
              <div className="space-y-6">
                <FleetBar icon={<Boxes className="w-4 h-4" />} label="Container trucks" used={42} total={58} percent={72} visible={barsVisible} delay={0} />
                <FleetBar icon={<Snowflake className="w-4 h-4" />} label="Refrigerated vans" used={18} total={24} percent={75} visible={barsVisible} delay={120} />
                <FleetBar icon={<Truck className="w-4 h-4" />} label="Flatbed trucks" used={8} total={12} percent={66} visible={barsVisible} delay={240} />
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

const ACCENTS: Record<string, { chip: string; icon: string; ring: string }> = {
  blue: { chip: 'bg-blue-50', icon: 'text-blue-600', ring: 'group-hover:ring-blue-100' },
  indigo: { chip: 'bg-indigo-50', icon: 'text-indigo-600', ring: 'group-hover:ring-indigo-100' },
  emerald: { chip: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'group-hover:ring-emerald-100' },
  violet: { chip: 'bg-violet-50', icon: 'text-violet-600', ring: 'group-hover:ring-violet-100' },
};

function DashboardCard({ title, value, icon, trend, accent = 'blue' }: { title: string, value: string, icon: React.ReactNode, trend: { value: number, isPositive: boolean }, accent?: string }) {
  const colors = ACCENTS[accent] ?? ACCENTS.blue;
  return (
    <div className="sfm-card group bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className={`sfm-icon-pop p-2 rounded-xl ${colors.chip} ${colors.icon} ring-4 ring-transparent transition-all duration-300 ${colors.ring}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
        <AnimatedValue value={value} />
      </div>
      <div className="flex items-center text-sm font-medium">
        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${trend.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {trend.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trend.isPositive ? '+' : '-'}{trend.value}%
        </span>
        <span className="text-gray-500 ml-1.5">vs last month</span>
      </div>
    </div>
  );
}

function FleetBar({ icon, label, used, total, percent, visible, delay }: { icon: React.ReactNode, label: string, used: number, total: number, percent: number, visible: boolean, delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="text-blue-500">{icon}</span>
          {label}
        </span>
        <span className="text-gray-500 font-medium">{used}/{total}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="sfm-bar-fill bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all ease-out"
          style={{ width: visible ? `${percent}%` : '0%', transitionDuration: '1000ms', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

/** Parses a formatted stat string (e.g. "$1.84M", "86.4%", "12,500") and animates it
 *  from 0 to its target value on mount, purely as a display effect. */
function AnimatedValue({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match ? value.replace(/[\d,.]+/, '0') : value);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ''));
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const useCommas = numStr.includes(',');
    const duration = 900;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = useCommas
        ? current.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : current.toFixed(decimals);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}</span>;
}