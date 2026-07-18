import { PageContainer } from "@/components/common/PageContainer";
import { FileText, Download, BarChart2, TrendingUp, DollarSign, Clock } from "lucide-react";

export function Reports() {
  const reports = [
    { id: 1, title: 'Monthly Revenue Report', date: 'July 2026', icon: <DollarSign className="w-5 h-5 text-green-500" /> },
    { id: 2, title: 'Fleet Utilization Metrics', date: 'Q2 2026', icon: <BarChart2 className="w-5 h-5 text-blue-500" /> },
    { id: 3, title: 'Driver Performance Review', date: 'June 2026', icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
    { id: 4, title: 'Delivery Time Analysis', date: 'Last 30 Days', icon: <Clock className="w-5 h-5 text-orange-500" /> },
    { id: 5, title: 'Maintenance Logs', date: 'Year to Date', icon: <FileText className="w-5 h-5 text-gray-500" /> },
  ];

  return (
    <PageContainer title="Reports" description="Generate and view analytics reports.">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        <ul className="divide-y divide-gray-100">
          {reports.map((report) => (
            <li key={report.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {report.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.date}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-bold bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}
