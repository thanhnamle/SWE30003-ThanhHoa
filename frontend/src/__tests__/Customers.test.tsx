import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Customers } from '../features/customers/Customers';
import { renderWithProviders } from '../test/testUtils';
import { orderApi } from '../features/orders/api/orderApi';

// Mock Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock orderApi
vi.mock('../features/orders/api/orderApi', () => ({
  orderApi: {
    getCustomers: vi.fn(),
  },
}));

describe('Customers Component', () => {
  const mockCustomers = [
    { id: '1', companyName: 'VinFast Assembly Co.', isCorporateAccount: true },
    { id: '2', companyName: 'Nguyen Van A Personal', isCorporateAccount: false },
  ];

  beforeEach(() => {
    vi.mocked(orderApi.getCustomers).mockResolvedValue(mockCustomers);
  });

  it('renders loading state and list of customers', async () => {
    renderWithProviders(<Customers />);

    expect(screen.getByText('Customers')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('VinFast Assembly Co.')).toBeInTheDocument();
      expect(screen.getByText('Nguyen Van A Personal')).toBeInTheDocument();
    });
  });
});
