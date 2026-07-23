import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Dashboard } from '../features/dashboard/Dashboard';
import { renderWithProviders } from '../test/testUtils';
import { shipmentApi } from '../features/shipments/api/shipmentApi';
import { paymentApi } from '../features/payments/api/paymentApi';
import { orderApi } from '../features/orders/api/orderApi';

// Mock Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock APIs
vi.mock('../features/shipments/api/shipmentApi', () => ({
  shipmentApi: {
    getVehicles: vi.fn(),
    getDrivers: vi.fn(),
    getShipments: vi.fn(),
  },
}));

vi.mock('../features/payments/api/paymentApi', () => ({
  paymentApi: {
    getInvoices: vi.fn(),
  },
}));

vi.mock('../features/orders/api/orderApi', () => ({
  orderApi: {
    getCustomers: vi.fn(),
    getOfferings: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.mocked(shipmentApi.getVehicles).mockResolvedValue([
      { id: '1', plateNumber: 'A', type: 'Van', maxPayloadKg: 1000, maxVolumeM3: 5, isUnderMaintenance: false }
    ] as any);
    vi.mocked(shipmentApi.getDrivers).mockResolvedValue([
      { id: '1', name: 'B', licenseNumber: 'C', isOnLeave: false }
    ] as any);
    vi.mocked(shipmentApi.getShipments).mockResolvedValue([
      { id: '1', orderId: 'ord1', status: 'Preparing', createdAt: new Date().toISOString() }
    ] as any);
    vi.mocked(paymentApi.getInvoices).mockResolvedValue([
      { id: 'inv1', orderId: 'ord1', amount: 500, status: 'Paid', issuedAt: new Date().toISOString() }
    ] as any);
    vi.mocked(orderApi.getCustomers).mockResolvedValue([
      { id: 'c1', companyName: 'Customer Corp', isCorporateAccount: true }
    ] as any);
    vi.mocked(orderApi.getOfferings).mockResolvedValue([
      { id: 'o1', category: 'Standard', maxCapacityKg: 5000, baseFee: 100, feePerKm: 2, isActive: true }
    ] as any);
  });

  it('renders operations dashboard layout and title', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Operations dashboard')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('ACTIVE SHIPMENTS')).toBeInTheDocument();
    });
  });
});
