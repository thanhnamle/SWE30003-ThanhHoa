import apiClient from '../../../lib/apiClient';

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Unpaid';

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
}

export interface PaymentRequest {
  invoiceId: string;
  paymentMethod: 'CreditCard' | 'BankTransfer' | 'EWallet';
  amount: number;
  referenceNumber: string;
}

export interface Receipt {
  id: string;
  paymentId: string;
  settledAmount: number;
  transactionReference: string;
  issuedAt: string;
}

export interface PaymentResponse {
  paymentId: string;
  receiptId: string;
  status: string;
  message: string;
}

export const paymentApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>('/api/payments/invoices');
    return response.data;
  },

  getReceipts: async (): Promise<Receipt[]> => {
    const response = await apiClient.get<Receipt[]>('/api/payments/receipts');
    return response.data;
  },

  processPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(
      `/api/payments/invoice/${request.invoiceId}`,
      {
        amount: request.amount,
        method: request.paymentMethod,
      }
    );
    return response.data;
  },
};
