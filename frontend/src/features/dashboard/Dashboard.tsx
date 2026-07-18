import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PageContainer } from "@/components/common/PageContainer";
import { Package, Truck, DollarSign, Users, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { shipmentApi } from "../shipments/api/shipmentApi";
import { paymentApi } from "../payments/api/paymentApi";

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
          <Link to="/orders" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New order
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="ACTIVE SHIPMENTS" 
              value={(stats.orders * 250).toLocaleString()} 
              icon={<Package className="w-5 h-5 text-gray-600" />}
              trend={{ value: 8.2, isPositive: true }}
            />
            <DashboardCard 
              title="FLEET UTILIZATION" 
              value="86.4%" 
              icon={<Truck className="w-5 h-5 text-gray-600" />}
              trend={{ value: 3.1, isPositive: true }}
            />
            <DashboardCard 
              title="MONTHLY REVENUE" 
              value={`$${(stats.revenue / 1000000).toFixed(2)}M`} 
              icon={<DollarSign className="w-5 h-5 text-gray-600" />}
              trend={{ value: 12.6, isPositive: true }}
            />
            <DashboardCard 
              title="ACTIVE CUSTOMERS" 
              value={(stats.customers * 68).toLocaleString()} 
              icon={<Users className="w-5 h-5 text-gray-600" />}
              trend={{ value: 1.4, isPositive: false }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Revenue overview</h3>
                  <p className="text-sm text-gray-500 mt-1">Monthly gross revenue ($, thousands)</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md">FY 2026</span>
              </div>
              <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 30, 60, 90, 120]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: any) => [`$${val}k`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-900 text-base">Shipment status</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">Last 30 days</p>
              <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shipmentStatusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 150, 300, 450, 600]} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {shipmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Delivered' ? '#3b82f6' : entry.name === 'Pending' ? '#60a5fa' : '#93c5fd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Original Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 h-[400px] flex flex-col shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
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
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="shipments" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorShipments)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 h-[400px] flex flex-col shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
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
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-base">Recent orders</h3>
                <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">View all</button>
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
                      <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-4 font-semibold text-gray-900">{order.id}</td>
                        <td className="py-4 text-gray-600">{order.customer}</td>
                        <td className="py-4 text-gray-500">{order.route}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
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

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base mb-6">Fleet availability</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Container trucks</span>
                    <span className="text-gray-500 font-medium">42/58</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Refrigerated vans</span>
                    <span className="text-gray-500 font-medium">18/24</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Flatbed trucks</span>
                    <span className="text-gray-500 font-medium">8/12</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function DashboardCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: { value: number, isPositive: boolean } }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</div>
      <div className="flex items-center text-sm font-medium">
        <span className={`flex items-center gap-0.5 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trend.isPositive ? '+' : '-'}{trend.value}%
        </span>
        <span className="text-gray-500 ml-1.5">vs last month</span>
      </div>
    </div>
  );
}
