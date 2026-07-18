import { useEffect, useState } from "react";
import { Link } from "react-router";
import { 
  Package, Truck, DollarSign, Users, ArrowUpRight, 
  ArrowDownRight, Plus, MoreVertical, 
  TrendingUp, Globe, Activity 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { shipmentApi } from "../shipments/api/shipmentApi";
import { paymentApi } from "../payments/api/paymentApi";
import { PageContainer } from "@/components/common/PageContainer";

export function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, orders: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

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

  const revenueData = [
    { name: 'Jan', value: 40000 }, { name: 'Feb', value: 52000 }, { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 65000 }, { name: 'May', value: 72000 }, { name: 'Jun', value: 68000 },
    { name: 'Jul', value: 85000 }, { name: 'Aug', value: 80000 }, { name: 'Sep', value: 92000 },
    { name: 'Oct', value: 88000 }, { name: 'Nov', value: 105000 }, { name: 'Dec', value: 115000 }
  ];

  const shipmentStatusData = [
    { name: 'Pending', value: 45, color: '#6366f1' },
    { name: 'Delivered', value: 420, color: '#10b981' },
    { name: 'Returned', value: 12, color: '#f43f5e' },
  ];

  const recentOrders = [
    { id: 'ORD-10482', customer: 'VinFast Assembly', route: 'HCM → Hanoi', status: 'In Transit', amount: 4280, date: '2 mins ago' },
    { id: 'ORD-10483', customer: 'Samsung Electronics', route: 'Bac Ninh → Hai Phong', status: 'Delivered', amount: 8500, date: '1 hour ago' },
    { id: 'ORD-10484', customer: 'TH True Milk', route: 'Nghe An → Danang', status: 'Pending', amount: 1250, date: '3 hours ago' },
    { id: 'ORD-10485', customer: 'Hoa Phat Group', route: 'Quang Ngai → HCM', status: 'In Transit', amount: 15400, date: '5 hours ago' },
  ];

  return (
    <PageContainer 
      title="Operations Overview" 
      description="Real-time monitoring of your logistics ecosystem."
      action={
        <Link to="/orders" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <Plus className="w-4 h-4" /> New Order
        </Link>
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Synchronizing fleet data...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Active Shipments" 
              value={(stats.orders * 250).toLocaleString()} 
              icon={<Package className="w-5 h-5 text-indigo-600" />}
              trend={{ value: 8.2, isPositive: true }}
              color="indigo"
            />
            <DashboardCard 
              title="Fleet Utilization" 
              value="86.4%" 
              icon={<Truck className="w-5 h-5 text-emerald-600" />}
              trend={{ value: 3.1, isPositive: true }}
              color="emerald"
            />
            <DashboardCard 
              title="Total Revenue" 
              value={`$${(stats.revenue / 1000000).toFixed(2)}M`} 
              icon={<DollarSign className="w-5 h-5 text-amber-600" />}
              trend={{ value: 12.6, isPositive: true }}
              color="amber"
            />
            <DashboardCard 
              title="Active Clients" 
              value={(stats.customers * 68).toLocaleString()} 
              icon={<Users className="w-5 h-5 text-rose-600" />}
              trend={{ value: 1.4, isPositive: false }}
              color="rose"
            />
          </div>

          {/* Main Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm shadow-slate-200/50 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Revenue Performance</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <p className="text-sm text-slate-500 underline underline-offset-4 decoration-emerald-200">12% increase from last quarter</p>
                  </div>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  {['12M', '6M', '30D'].map((t) => (
                    <button key={t} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${t === '12M' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Globe className="w-32 h-32" />
              </div>
              <h3 className="font-bold text-lg mb-2">Shipment Distribution</h3>
              <p className="text-slate-400 text-sm mb-8">Performance metrics by status</p>
              
              <div className="space-y-6">
                {shipmentStatusData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-300">{item.name}</span>
                      <span className="font-bold">{item.value} units</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ backgroundColor: item.color, width: `${(item.value / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">System Status</p>
                    <p className="text-sm font-bold">Operational 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-8 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">Recent Dispatches</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-xl">View Log</button>
              </div>
              <div className="px-8 pb-8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4">Tracking ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Route</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5">
                          <span className="font-bold text-slate-900 block">{order.id}</span>
                          <span className="text-xs text-slate-400">{order.date}</span>
                        </td>
                        <td className="py-5 font-medium text-slate-600">{order.customer}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{order.route.split('→')[0]}</span>
                            <span className="text-[10px]">→</span>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{order.route.split('→')[1]}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                            order.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'Delivered' ? 'bg-emerald-500' :
                              order.status === 'In Transit' ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`} />
                            {order.status}
                          </div>
                        </td>
                        <td className="py-5 text-right font-bold text-slate-900">${order.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900 text-lg">Fleet Status</h3>
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="space-y-8 flex-1">
                <FleetProgress label="Container Units" current={42} total={58} color="#6366f1" />
                <FleetProgress label="Refrigerated Fleet" current={18} total={24} color="#10b981" />
                <FleetProgress label="Flatbed Trailers" current={8} total={12} color="#f59e0b" />
                <FleetProgress label="Local Vans" current={12} total={15} color="#ec4899" />
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Idle Vehicles</p>
                    <p className="text-lg font-bold text-slate-900">14 Trucks</p>
                  </div>
                  <Link to="/fleet" className="text-xs font-bold bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    Assign Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function DashboardCard({ title, value, icon, trend, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-200/50 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend.value}%
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">{value}</div>
        <p className="text-[10px] text-slate-400 mt-4 font-bold tracking-widest uppercase">Vs previous period</p>
      </div>
    </div>
  );
}

function FleetProgress({ label, current, total, color }: any) {
  const percentage = (current / total) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="text-slate-400 font-bold tracking-tighter">
          <span className="text-slate-900">{current}</span> / {total}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3">
        <div 
          className="h-3 rounded-full shadow-sm transition-all duration-1000 ease-out" 
          style={{ backgroundColor: color, width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}