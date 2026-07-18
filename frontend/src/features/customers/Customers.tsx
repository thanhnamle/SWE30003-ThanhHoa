import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { SearchBar } from "@/components/common/SearchBar";
import { Customer, orderApi } from "../orders/api/orderApi";
import { Building2, User, UserPlus, Users } from "lucide-react";

const AVATAR_PALETTES = [
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
];

function paletteFor(name: string) {
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getCustomers().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer 
      title="Customers" 
      description="Manage your client relationships."
      action={
        <button className="sfm-cta flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      }
    >
      <style>{`
        @keyframes sfm-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfm-shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes sfm-pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .sfm-enter { opacity: 0; animation: sfm-fade-up 0.5s ease-out forwards; }
        .sfm-row { opacity: 0; animation: sfm-fade-up 0.4s ease-out forwards; transition: background-color 0.2s ease, transform 0.2s ease; }
        .sfm-row:hover { transform: translateX(2px); }
        .sfm-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
          background-size: 400% 100%;
          animation: sfm-shimmer 1.6s ease-in-out infinite;
        }
        .sfm-avatar { animation: sfm-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .sfm-enter, .sfm-row, .sfm-skeleton, .sfm-avatar { animation: none !important; }
        }
      `}</style>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sfm-enter">
        <div className="max-w-md w-full">
          <SearchBar placeholder="Search customers by name or email..." />
        </div>
        {!loading && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 whitespace-nowrap">
            <Users className="w-4 h-4 text-gray-400" />
            {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sfm-enter" style={{ animationDelay: '0.05s' }}>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="sfm-skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="sfm-skeleton h-4 w-40 rounded" />
                  <div className="sfm-skeleton h-3 w-24 rounded" />
                </div>
                <div className="sfm-skeleton h-6 w-20 rounded-full" />
                <div className="sfm-skeleton h-4 w-16 rounded hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center sfm-enter">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700">No customers yet</h3>
          <p className="text-sm text-gray-400 mt-1">New customers will appear here once added.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sfm-enter" style={{ animationDelay: '0.05s' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Account Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {customers.map((customer, idx) => (
                <tr
                  key={customer.id}
                  className="sfm-row hover:bg-gray-50"
                  style={{ animationDelay: `${Math.min(idx * 0.05, 0.6)}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`sfm-avatar shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${paletteFor(customer.companyName)} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                        style={{ animationDelay: `${Math.min(idx * 0.05, 0.6) + 0.1}s` }}
                      >
                        {initialsFor(customer.companyName)}
                      </div>
                      <span className="font-semibold text-gray-900">{customer.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-full ${customer.isCorporateAccount ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {customer.isCorporateAccount ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {customer.isCorporateAccount ? 'Corporate' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{customer.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}