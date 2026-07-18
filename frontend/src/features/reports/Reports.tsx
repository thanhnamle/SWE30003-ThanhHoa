import { PageContainer } from "@/components/common/PageContainer";
import { FileText, Download, BarChart2, TrendingUp, DollarSign, Clock } from "lucide-react";

export function Reports() {
  const reports = [
    { id: 1, title: 'Monthly Revenue Report', date: 'July 2026', icon: <DollarSign className="w-6 h-6 text-green-500" />, bg: 'bg-green-50' },
    { id: 2, title: 'Fleet Utilization Metrics', date: 'Q2 2026', icon: <BarChart2 className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
    { id: 3, title: 'Driver Performance Review', date: 'June 2026', icon: <TrendingUp className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50' },
    { id: 4, title: 'Delivery Time Analysis', date: 'Last 30 Days', icon: <Clock className="w-6 h-6 text-orange-500" />, bg: 'bg-orange-50' },
    { id: 5, title: 'Maintenance Logs', date: 'Year to Date', icon: <FileText className="w-6 h-6 text-gray-500" />, bg: 'bg-gray-100' },
  ];

  return (
    <PageContainer title="Analytics Reports" description="Generate and view detailed performance analytics.">
      <div className="mt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div 
              key={report.id} 
              className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 shadow-lg shadow-gray-200/30 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Icon Container */}
              <div className={`mb-6 w-14 h-14 ${report.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                {report.icon}
              </div>

              {/* Title and Date */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {report.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  {report.date}
                </p>
              </div>

              {/* Action Button */}
              <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-blue-600 hover:text-white py-3 rounded-xl transition-all duration-300 border border-gray-100 shadow-sm">
                <Download className="w-4 h-4" /> 
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}