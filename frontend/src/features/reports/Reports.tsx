import { PageContainer } from "@/components/common/PageContainer";
import { DollarSign, Package, Car, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { reportApi } from './api/reportApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export function Reports() {
  const { data: reportData, isLoading, isError } = useQuery({
    queryKey: ['operationalReport'],
    queryFn: reportApi.getOperationalReport
  });

  if (isLoading) {
    return (
      <PageContainer title="Analytics Reports" description="Generate and view detailed performance analytics.">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !reportData) {
    return (
      <PageContainer title="Analytics Reports" description="Generate and view detailed performance analytics.">
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 rounded-2xl border border-red-100">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-red-700">Failed to load reports</h3>
          <p className="text-red-500 text-sm">Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  const { stats, shipmentStatusData, revenueData } = reportData;

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
    { title: 'Active Orders', value: stats.orders.toLocaleString(), icon: <Package className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
    { title: 'Fleet Vehicles', value: stats.vehicles.toLocaleString(), icon: <Car className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100' },
    { title: 'Active Drivers', value: stats.drivers.toLocaleString(), icon: <Users className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-100' },
    { title: 'Total Customers', value: stats.customers.toLocaleString(), icon: <Users className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-100' },
  ];

  return (
    <PageContainer title="Operational Analytics" description="Real-time insights and performance metrics across your entire fleet operations.">
      
      {/* Top Metrics Row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        
        {/* Revenue Chart */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Monthly Revenue</h2>
              <p className="text-sm text-gray-500 font-medium">Revenue trends across the year (in thousands)</p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shipment Status Chart */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shipment Status Breakdown</h2>
              <p className="text-sm text-gray-500 font-medium">Distribution of current shipment statuses</p>
            </div>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            {shipmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shipmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {shipmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-sm font-medium">No shipment data available</div>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}