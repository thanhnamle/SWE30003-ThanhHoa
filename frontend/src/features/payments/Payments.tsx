import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, FileText, CheckCircle2, DollarSign, Clock, AlertCircle, Loader2, X } from 'lucide-react';
import { paymentApi, Invoice, PaymentRequest } from './api/paymentApi';

const paymentSchema = z.object({
  paymentMethod: z.enum(['CreditCard', 'BankTransfer', 'Cash']),
  referenceNumber: z.string().min(5, 'Reference number is required'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function Payments() {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: paymentApi.getInvoices
  });

  const { data: receipts } = useQuery({
    queryKey: ['receipts'],
    queryFn: paymentApi.getReceipts
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const paymentMutation = useMutation({
    mutationFn: (data: PaymentRequest) => paymentApi.processPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setSelectedInvoice(null);
      reset();
    }
  });

  const onSubmit = (data: PaymentFormValues) => {
    if (!selectedInvoice) return;
    paymentMutation.mutate({
      invoiceId: selectedInvoice.id,
      amount: selectedInvoice.amount, // Real app might allow partial payments, but A2 says exact or fully paid for simplicity in our mock
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
      case 'Overdue': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Overdue</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage customer invoices and process payments.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-700 rounded-lg"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Collected</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(receipts?.reduce((sum, r) => sum + r.amountPaid, 0) || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Invoices List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FileText className="w-5 h-5" /> Outstanding & Paid Invoices</h2>

          {isLoadingInvoices ? (
            <div className="h-64 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl animate-pulse"></div>
          ) : (
            <div className="space-y-3">
              {invoices?.map((invoice) => (
                <div key={invoice.id} className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-5 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md mb-2 inline-block">{invoice.id}</span>
                      <h3 className="font-semibold text-gray-900">{invoice.customerName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Order: {invoice.orderId}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{formatCurrency(invoice.amount)}</div>
                      <div className="mt-2 flex justify-end">{getStatusBadge(invoice.status)}</div>
                    </div>
                  </div>

                  {invoice.status !== 'Paid' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                      >
                        Process Payment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Receipts / Payment History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Recent Receipts</h2>
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 shadow-sm min-h-[300px]">
            {receipts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p>No receipts generated yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts?.map(receipt => (
                  <div key={receipt.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <div>
                      <span className="font-mono text-sm font-bold text-gray-900">{receipt.id}</span>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>Inv: {receipt.invoiceId}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{receipt.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">{formatCurrency(receipt.amountPaid)}</span>
                      <div className="text-xs text-gray-400 mt-1">{new Date(receipt.paymentDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Payment Processing Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
              <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-1">Process Payment</h2>
              <p className="text-blue-100 text-sm">Record a payment to settle the invoice.</p>
            </div>

            <div className="p-6">

              {/* Invoice Summary Card */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Invoice ID</span>
                  <span className="font-mono text-sm font-semibold">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="text-sm font-semibold">{selectedInvoice.customerName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200/50 mt-2">
                  <span className="font-medium text-gray-700">Amount Due</span>
                  <span className="font-bold text-lg text-blue-700">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
              </div>

              {paymentMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {paymentMutation.error?.message || 'Payment failed'}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <select {...register('paymentMethod')} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="CreditCard">Credit Card</option>
                    <option value="BankTransfer">Bank Transfer</option>
                    <option value="Cash">Cash / Cheque</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Transaction / Reference Number</label>
                  <input
                    {...register('referenceNumber')}
                    placeholder="e.g. TXN-987654321"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {errors.referenceNumber && <p className="text-red-500 text-xs mt-1">{errors.referenceNumber.message}</p>}
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setSelectedInvoice(null)} className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={paymentMutation.isPending} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {paymentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Settle Invoice'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
