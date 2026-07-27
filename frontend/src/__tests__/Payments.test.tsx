import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Payments } from '../features/payments/Payments';
import { renderWithProviders } from '../test/testUtils';

// Mock the Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock React Query directly
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
    useQuery: ({ queryKey }: any) => {
      if (queryKey[0] === 'invoices') {
        return {
          data: [
            { id: 'inv1', orderId: 'ord1', customerId: 'c1', customerName: 'VinFast', amount: 500, status: 'Pending', issuedAt: new Date().toISOString(), dueDate: new Date().toISOString(), createdAt: new Date().toISOString() },
            { id: 'inv2', orderId: 'ord2', customerId: 'c2', customerName: 'Samsung', amount: 300, status: 'Paid', issuedAt: new Date().toISOString(), dueDate: new Date().toISOString(), createdAt: new Date().toISOString() },
          ],
          isLoading: false,
        };
      }
      if (queryKey[0] === 'receipts') {
        return {
          data: [
            { id: 'rc1', invoiceId: 'inv2', paymentId: 'pay1-uuid', amountPaid: 300, paymentDate: new Date().toISOString(), paymentMethod: 'CreditCard', referenceNumber: 'TRX-123' },
          ],
          isLoading: false,
        };
      }
      return { data: [], isLoading: false };
    },
    useMutation: ({ onSuccess }: any) => {
      return {
        mutate: (variables: any) => {
          if (onSuccess) onSuccess();
        },
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
      };
    },
  };
});

describe('Payments Component', () => {
  it('renders invoices list after loading', async () => {
    renderWithProviders(<Payments />);

    expect(screen.getByText(/inv1/i)).toBeInTheDocument();
    expect(screen.getByText(/inv2/i)).toBeInTheDocument();
  });

  it('shows payment form when clicking Pay on a pending invoice', async () => {
    renderWithProviders(<Payments />);

    const payButton = screen.getByText('Process Payment');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getAllByText('Process Payment').length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText('e.g. TXN-987654321')).toBeInTheDocument();
    });
  });

  it('validates reference number format', async () => {
    renderWithProviders(<Payments />);

    const payButton = screen.getByText('Process Payment');
    fireEvent.click(payButton);

    const submitButton = screen.getByText('Confirm Payment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Reference number is required')).toBeInTheDocument();
    });
  });
});
