import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { renderWithProviders } from '@/test/testUtils';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { shipmentApi } from '@/features/shipments/api/shipmentApi';
import { paymentApi } from '@/features/payments/api/paymentApi';
import React from 'react';

vi.mock('@/features/dashboard/api/dashboardApi', () => ({
  dashboardApi: {
    getOperationalReport: vi.fn(),
  }
}));

vi.mock('@/features/shipments/api/shipmentApi', () => ({
  shipmentApi: {
    getShipments: vi.fn(),
  }
}));

vi.mock('@/features/payments/api/paymentApi', () => ({
  paymentApi: {
    getInvoices: vi.fn(),
  }
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock requestAnimationFrame for AnimatedValue
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    
    vi.mocked(dashboardApi.getOperationalReport).mockResolvedValue({
      stats: { vehicles: 10, drivers: 15, orders: 120, revenue: 5000000, customers: 50 },
      shipmentStatusData: [{ name: 'Delivered', value: 100 }],
      revenueData: [{ name: 'Jan', value: 50 }],
    });
    
    vi.mocked(shipmentApi.getShipments).mockResolvedValue([
      { 
        id: '123', 
        orderId: 'ord-1',
        createdAt: '2026-01-01',
        status: 'Delivered' as any,
        pickupDeliveryOption: { pickupAddress: 'A', deliveryAddress: 'B' },
        order: { customerName: 'Test Customer' }
      } as any
    ]);
    
    vi.mocked(paymentApi.getInvoices).mockResolvedValue([
      { orderId: 'ord-1', amount: 500 } as any
    ]);
  });

  it('renders loading state initially', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard stats after data loads', async () => {
    renderWithProviders(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('ACTIVE SHIPMENTS')).toBeInTheDocument();
      expect(screen.getByText('Recent orders')).toBeInTheDocument();
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles api failure gracefully', async () => {
    vi.mocked(dashboardApi.getOperationalReport).mockRejectedValue(new Error('API error'));
    
    renderWithProviders(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('System Default')).toBeInTheDocument();
    });
  });
});
