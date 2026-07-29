import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, FileText, CheckCircle2, DollarSign, Clock, AlertCircle, Loader2, ArrowRight, Wallet, Receipt } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { paymentApi, Invoice, PaymentRequest, PaymentResponse } from './api/paymentApi';

const paymentSchema = z.object({
  paymentMethod: z.enum(['CreditCard', 'BankTransfer', 'EWallet']),
  referenceNumber: z.string().min(5, 'Reference number is required'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function Payments() {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setPaymentResult(data);
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
      case 'Paid': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold shadow-sm w-fit">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Paid
        </span>
      );
      case 'Overdue': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full text-xs font-bold shadow-sm w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Overdue
        </span>
      );
      default: return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-bold shadow-sm w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Pending
        </span>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out max-w-7xl mx-auto mt-6">

      {/* Modern Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Wallet className="w-4 h-4" /> Billing & Payments
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Financial Dashboard</h1>
          <p className="text-gray-500 text-lg max-w-xl">Manage customer invoices, process payments, and track revenue seamlessly.</p>
        </div>
        
        {/* Total Collected Highlight Card */}
        <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 shadow-2xl min-w-[300px] hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-400/30 transition-colors duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Collected</p>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {formatCurrency(receipts?.reduce((sum, r) => sum + r.settledAmount, 0) || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Invoices List (Takes up more space) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-gray-900">Outstanding Invoices</h2>
          </div>

          {isLoadingInvoices ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-[2rem] animate-pulse"></div>
              ))}
            </div>
          ) : invoices?.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
              <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Outstanding Invoices</h3>
              <p className="text-gray-500 font-medium">All caught up! There are no pending invoices to pay.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices?.map((invoice, idx) => (
                <div 
                  key={invoice.id} 
                  className="group relative bg-white border border-gray-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-inner">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">INV: {invoice.id}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-xs font-semibold text-gray-500">Order: {invoice.orderId.split('-')[0]}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Order: {invoice.orderId.split('-')[0]}</h3>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                      <div className="font-black text-2xl text-gray-900">{formatCurrency(invoice.amount)}</div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>

                  {invoice.status !== 'Paid' && (
                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock className="w-4 h-4 text-gray-400" /> 
                        Issued {new Date(invoice.issuedAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-600/30 flex items-center justify-center gap-2 group/btn"
                      >
                        Process Payment
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Receipts List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-gray-900">Recent Receipts</h2>
          </div>
          
          <div className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-4 min-h-[300px]">
            {receipts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Receipt className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-medium">No receipts generated yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {receipts?.map((receipt, idx) => (
                  <div 
                    key={receipt.id} 
                    className="flex justify-between items-center p-4 border border-gray-200/60 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                  >
                    <div>
                      <span className="font-mono text-sm font-black text-gray-900 block mb-1">{receipt.id.split('-')[0]}</span>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span>Pmt: {receipt.paymentId.split('-')[0]}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-blue-600 truncate max-w-[120px]">{receipt.transactionReference}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block mb-1">{formatCurrency(receipt.settledAmount)}</span>
                      <div className="text-xs font-semibold text-gray-500">Issued: {new Date(receipt.issuedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Payment Processing Modal */}
      <Modal 
        isOpen={!!selectedInvoice} 
        onClose={() => { setSelectedInvoice(null); setPaymentResult(null); paymentMutation.reset(); }}
        title="Process Payment"
      >
        {selectedInvoice && (
          <div>
            {paymentResult ? (
              <div className="flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{paymentResult.message || 'Payment Successful'}</h3>
                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 text-left">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Receipt ID</span>
                     <span className="font-mono text-xs font-black text-gray-900">{paymentResult.receiptId}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment ID</span>
                     <span className="font-mono text-xs font-black text-gray-900">{paymentResult.paymentId}</span>
                   </div>
                </div>
                <button 
                  onClick={() => { setSelectedInvoice(null); setPaymentResult(null); paymentMutation.reset(); }}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-xl shadow-gray-900/20"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-6 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice ID</span>
                    <span className="font-mono text-sm font-black text-gray-900 bg-white px-2 py-1 rounded border border-gray-100">{selectedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</span>
                    <span className="text-sm font-bold text-gray-900">{selectedInvoice.orderId.split('-')[0]}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-blue-200/60">
                    <span className="text-sm font-black text-gray-900">Total Amount Due</span>
                    <span className="font-black text-2xl text-blue-700">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>

                {paymentMutation.isError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    {paymentMutation.error?.message || 'Payment failed to process. Please try again.'}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Payment Method</label>
                    <select 
                      {...register('paymentMethod')} 
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-gray-900 cursor-pointer appearance-none"
                    >
                      <option value="CreditCard">Credit Card</option>
                      <option value="BankTransfer">Bank Transfer</option>
                      <option value="EWallet">E-Wallet</option>
                    </select>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Reference Number <span className="text-red-400">*</span></label>
                    <input
                      {...register('referenceNumber')}
                      placeholder="e.g. TXN-987654321"
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-gray-900 placeholder-gray-400"
                    />
                    {errors.referenceNumber && (
                      <p className="text-red-500 text-xs font-bold mt-1.5 animate-in fade-in">{errors.referenceNumber.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setSelectedInvoice(null); setPaymentResult(null); paymentMutation.reset(); }} 
                      className="w-full sm:w-1/3 py-4 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={paymentMutation.isPending} 
                      className="w-full sm:w-2/3 py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-gray-900/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center justify-center gap-2"
                    >
                      {paymentMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Confirm Payment <CheckCircle2 className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}