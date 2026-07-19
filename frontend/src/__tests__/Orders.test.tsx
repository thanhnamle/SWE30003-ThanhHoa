import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Orders } from '../features/orders/Orders';
import { renderWithProviders } from '../test/testUtils';
import { orderApi } from '../features/orders/api/orderApi';

// Mock the Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock the order API to avoid setTimeout delays
vi.mock('../features/orders/api/orderApi', () => ({
  orderApi: {
    getOfferings: vi.fn(),
    getCustomers: vi.fn(),
    createOrder: vi.fn(),
  },
}));

describe('Orders Component', () => {
  const mockOfferings = [
    { id: '1', category: 'Standard', maxCapacityKg: 5000, baseFee: 100, feePerKm: 2, isActive: true },
    { id: '2', category: 'Express', maxCapacityKg: 2000, baseFee: 200, feePerKm: 3, isActive: true },
  ];

  const mockCustomers = [
    { id: 'c1', companyName: 'Customer Corp', isCorporateAccount: true },
  ];

  beforeEach(() => {
    vi.mocked(orderApi.getOfferings).mockResolvedValue(mockOfferings);
    vi.mocked(orderApi.getCustomers).mockResolvedValue(mockCustomers);
  });

  it('renders loading state initially', async () => {
    renderWithProviders(<Orders />);
    expect(screen.getByText(/Create Transport Order/i)).toBeInTheDocument();
  });

  it('renders list of offerings after loading', async () => {
    renderWithProviders(<Orders />);

    await waitFor(() => {
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Express')).toBeInTheDocument();
    });
  });

  it('shows form after selecting offering', async () => {
    renderWithProviders(<Orders />);

    await waitFor(() => {
      expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    const standardOffering = screen.getByText('Standard').closest('div');
    expect(standardOffering).not.toBeNull();
    fireEvent.click(standardOffering!);

    expect(screen.getByText('Freight Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 1500')).toBeInTheDocument();
  });

  it('validates empty weight input', async () => {
    renderWithProviders(<Orders />);

    await waitFor(() => {
      expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    const standardOffering = screen.getByText('Standard').closest('div');
    fireEvent.click(standardOffering!);

    const weightInput = screen.getByPlaceholderText('e.g., 1500');
    fireEvent.change(weightInput, { target: { value: '-5' } });

    const submitButton = screen.getByText('Confirm & Submit Order');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Weight must be at least 1kg')).toBeInTheDocument();
    });
  });
});
