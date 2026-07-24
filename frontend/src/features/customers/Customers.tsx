import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageContainer } from "@/components/common/PageContainer";
import { SearchBar } from "@/components/common/SearchBar";
import { Modal } from "@/components/common/Modal";
import { Customer, orderApi } from "../orders/api/orderApi";
import { Building2, User, UserPlus, Users, Loader2, Pencil, Trash2 } from "lucide-react";

const AVATAR_PALETTES = [
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
];

function paletteFor(name: string) {
  if (!name) return AVATAR_PALETTES[0];
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function initialsFor(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

const customerSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }, { message: 'Phone number must contain 10 or 11 digits (e.g. 0912345678)' }),
  isCorporateAccount: z.boolean(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      isCorporateAccount: false
    }
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    orderApi.getCustomers().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    reset({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      isCorporateAccount: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setValue('name', customer.name || customer.fullName || '');
    setValue('companyName', customer.companyName || '');
    setValue('email', customer.email || '');
    setValue('phone', customer.phone || '');
    setValue('isCorporateAccount', customer.isCorporateAccount);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setDeletingId(id);
    try {
      await orderApi.deleteCustomer(id);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await orderApi.updateCustomer(editingCustomer.id, data);
      } else {
        await orderApi.createCustomer(data);
      }
      setIsModalOpen(false);
      reset();
      fetchCustomers();
    } catch (error) {
      console.error("Failed to save customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer 
      title="Customers" 
      description="Manage your client relationships."
      action={
        <button 
          onClick={handleOpenAdd}
          className="sfm-cta flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
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
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
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
                        className={`sfm-avatar shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${paletteFor(customer.companyName || customer.name || customer.fullName || '')} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                        style={{ animationDelay: `${Math.min(idx * 0.05, 0.6) + 0.1}s` }}
                      >
                        {initialsFor(customer.companyName || customer.name || customer.fullName || '')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{customer.companyName || customer.name || customer.fullName}</div>
                        {(customer.email || customer.phone) && (
                          <div className="text-xs text-gray-400">{customer.email || customer.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-full ${customer.isCorporateAccount ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {customer.isCorporateAccount ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {customer.isCorporateAccount ? 'Corporate' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(customer)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        disabled={deletingId === customer.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Customer"
                      >
                        {deletingId === customer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name <span className="text-red-500">*</span></label>
            <input 
              {...register('name')} 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
            <input 
              {...register('companyName')} 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. Acme Corp"
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input 
                {...register('email')} 
                type="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input 
                {...register('phone')} 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. 0912345678 (10-11 digits)"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input 
              type="checkbox" 
              id="isCorporateAccount"
              {...register('isCorporateAccount')} 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isCorporateAccount" className="text-sm font-medium text-gray-700">
              Corporate Account
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingCustomer ? 'Save Changes' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}