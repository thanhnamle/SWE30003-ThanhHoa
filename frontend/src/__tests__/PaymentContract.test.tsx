import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Payments } from '@/features/payments/Payments';
import { paymentApi } from '@/features/payments/api/paymentApi';
import { renderWithProviders } from '@/test/testUtils';

vi.mock('@/features/payments/api/paymentApi', () => ({
  paymentApi: {
    getInvoices: vi.fn(),
    processPayment: vi.fn(),
    getReceipts: vi.fn()
  }
}));

describe('PaymentContract Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    vi.mocked(paymentApi.getInvoices).mockResolvedValue([
      { id: 'inv-1', orderId: 'ord-1', amount: 500, status: 'Unpaid', issuedAt: new Date().toISOString() }
    ]);
    
    vi.mocked(paymentApi.getReceipts).mockResolvedValue([]);
  });

  it('renders invoices after loading', async () => {
    renderWithProviders(<Payments />);
    
    await waitFor(() => {
      expect(screen.getByText('INV: inv-1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('handles payment submission successfully', async () => {
    vi.mocked(paymentApi.processPayment).mockResolvedValue({
      paymentId: 'pay-123',
      receiptId: 'rec-123',
      status: 'success',
      message: 'Payment processed successfully'
    });

    renderWithProviders(<Payments />);

    await waitFor(() => {
      expect(screen.getByText('INV: inv-1')).toBeInTheDocument();
    });

    // Click Process Payment button
    const payButtons = screen.getAllByRole('button', { name: /process payment/i });
    if (payButtons.length > 0) {
      await userEvent.click(payButtons[0]);
      
      // Select payment method from select
      const methodSelect = screen.getByRole('combobox');
      await userEvent.selectOptions(methodSelect, 'CreditCard');

      // Enter reference number
      const refInput = screen.getByPlaceholderText(/e\.g\. TXN-/i);
      await userEvent.type(refInput, 'REF12345');
      
      // Submit
      const confirmButton = screen.getByRole('button', { name: /confirm payment/i });
      await userEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(paymentApi.processPayment).toHaveBeenCalledWith({
          invoiceId: 'inv-1',
          amount: 500,
          paymentMethod: 'CreditCard',
          referenceNumber: 'REF12345'
        });
      });
    }
  });
});
