import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Orders } from '@/features/orders/Orders';
import { renderWithProviders } from '@/test/testUtils';
import { orderApi } from '@/features/orders/api/orderApi';
import { shipmentApi } from '@/features/shipments/api/shipmentApi';

vi.mock('@/features/orders/api/orderApi', () => ({
  orderApi: {
    getOfferings: vi.fn(),
    getCustomers: vi.fn(),
    getOrders: vi.fn(),
    createOrder: vi.fn(),
    editOrder: vi.fn(),
    cancelOrder: vi.fn(),
  }
}));

vi.mock('@/features/shipments/api/shipmentApi', () => ({
  shipmentApi: {
    getShipments: vi.fn(),
  }
}));

describe('Orders Component - Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(orderApi.getOfferings).mockResolvedValue([
      { id: 'off-1', name: 'Express Delivery', category: 'Express', baseFee: 100, feePerKm: 1, maxCapacityKg: 5000, isActive: true }
    ]);
    
    vi.mocked(orderApi.getCustomers).mockResolvedValue([
      { id: 'cus-1', name: 'Test Customer', isCorporateAccount: true }
    ]);
    
    vi.mocked(orderApi.getOrders).mockResolvedValue([]);
    vi.mocked(shipmentApi.getShipments).mockResolvedValue([]);
  });

  it('renders order form', async () => {
    renderWithProviders(<Orders />);
    
    await waitFor(() => {
      expect(screen.getByText('Create Transport Order')).toBeInTheDocument();
      expect(screen.getByText('Express')).toBeInTheDocument();
    });
  });



  it('submits successfully with valid data', async () => {
    renderWithProviders(<Orders />);
    
    await waitFor(() => {
      expect(screen.getByText('Express')).toBeInTheDocument();
    });
    
    // Select offering
    const offeringCards = screen.getAllByText('Express');
    await userEvent.click(offeringCards[0]);
    
    // Select customer
    const customerSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(customerSelect, 'cus-1');
    
    // Fill in weight and volume
    const weightInput = screen.getByPlaceholderText('e.g., 1500');
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, '100');
    
    const volumeInput = screen.getByPlaceholderText('e.g., 5.5');
    await userEvent.clear(volumeInput);
    await userEvent.type(volumeInput, '2.5');
    
    // Submit
    const submitBtn = screen.getByRole('button', { name: /Confirm & Submit Order/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(orderApi.createOrder).toHaveBeenCalledWith({
        branchId: '11111111-1111-1111-1111-111111111111',
        cargoVolumeM3: 2.5,
        cargoWeightKg: 100,
        customerId: 'cus-1',
        specialHandlingNotes: '',
        transportOfferingId: 'off-1',
      }, expect.anything());
    });
  });
});
