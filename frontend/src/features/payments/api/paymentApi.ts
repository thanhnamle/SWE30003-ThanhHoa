export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface PaymentRequest {
  invoiceId: string;
  paymentMethod: 'CreditCard' | 'BankTransfer' | 'Cash';
  amount: number;
  referenceNumber: string;
}

export interface Receipt {
  id: string;
  invoiceId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
}

// Mock Data State
let mockInvoices: Invoice[] = [
  {
    id: 'INV-2026-0001',
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbb',
    customerId: '99999999-9999-9999-9999-999999999999',
    customerName: 'Acme Logistics Corp',
    amount: 1250.00,
    status: 'Pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'INV-2026-0002',
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbc',
    customerId: '99999999-9999-9999-9999-999999999998',
    customerName: 'Global Retailers Ltd',
    amount: 3400.50,
    status: 'Overdue',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INV-2026-0003',
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbd',
    customerId: '99999999-9999-9999-9999-999999999997',
    customerName: 'John Doe Personal',
    amount: 500.00,
    status: 'Pending',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INV-2026-0004',
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbe',
    customerId: '99999999-9999-9999-9999-999999999996',
    customerName: 'Swift Manufacturing',
    amount: 10250.00,
    status: 'Paid',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'INV-2026-0005',
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbf',
    customerId: '99999999-9999-9999-9999-999999999995',
    customerName: 'Jane Smith',
    amount: 850.25,
    status: 'Overdue',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let mockReceipts: Receipt[] = [
  { id: 'RCPT-11111', invoiceId: 'INV-2026-0004', amountPaid: 10250.00, paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'BankTransfer', referenceNumber: 'TXN-001' },
  { id: 'RCPT-22222', invoiceId: 'INV-2025-9999', amountPaid: 500.00, paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'CreditCard', referenceNumber: 'TXN-002' },
  { id: 'RCPT-33333', invoiceId: 'INV-2025-9998', amountPaid: 1200.00, paymentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'Cash', referenceNumber: 'TXN-003' },
  { id: 'RCPT-44444', invoiceId: 'INV-2025-9997', amountPaid: 340.50, paymentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'CreditCard', referenceNumber: 'TXN-004' },
  { id: 'RCPT-55555', invoiceId: 'INV-2025-9996', amountPaid: 8000.00, paymentDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'BankTransfer', referenceNumber: 'TXN-005' },
];

const MOCK_DELAY_MS = 1000;

export const paymentApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockInvoices]), MOCK_DELAY_MS));
  },

  getReceipts: async (): Promise<Receipt[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockReceipts]), MOCK_DELAY_MS));
  },

  processPayment: async (request: PaymentRequest): Promise<Receipt> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invoiceIndex = mockInvoices.findIndex(i => i.id === request.invoiceId);
        if (invoiceIndex === -1) {
          reject(new Error("Invoice not found"));
          return;
        }

        const invoice = mockInvoices[invoiceIndex];
        
        // Very simple mock validation
        if (request.amount !== invoice.amount) {
          reject(new Error("Payment amount must exactly match the invoice total."));
          return;
        }

        // Update invoice status
        mockInvoices[invoiceIndex] = {
          ...invoice,
          status: 'Paid'
        };

        // Generate Receipt (Docs say Receipt is init-only, we just create it)
        const newReceipt: Receipt = {
          id: `RCPT-${Math.floor(Math.random() * 100000)}`,
          invoiceId: invoice.id,
          amountPaid: request.amount,
          paymentDate: new Date().toISOString(),
          paymentMethod: request.paymentMethod,
          referenceNumber: request.referenceNumber
        };

        mockReceipts.push(newReceipt);

        resolve(newReceipt);
      }, MOCK_DELAY_MS);
    });
  }
};
