import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Tracking } from '../features/tracking/Tracking';
import { renderWithProviders } from '../test/testUtils';

// Mock the Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock React Query directly to avoid any async query client issues
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
    useQuery: ({ queryKey }: any) => {
      if (queryKey[0] === 'driver-shipments') {
        return {
          data: [
            {
              id: 'ship1',
              orderId: 'ord1',
              status: 'ReadyForPickup',
              createdAt: new Date().toISOString(),
              pickupDeliveryOption: { pickupAddress: 'Warehouse A', deliveryAddress: 'Retailer B' },
              vehicleAssignment: { vehicleId: 'v1', vehiclePlate: '51A-12345' },
              driverAssignment: { driverId: 'd1', driverName: 'Driver Test' }
            },
            {
              id: 'ship2',
              orderId: 'ord2',
              status: 'InTransit',
              createdAt: new Date().toISOString(),
              pickupDeliveryOption: { pickupAddress: 'Port X', deliveryAddress: 'Factory Y' },
              vehicleAssignment: { vehicleId: 'v2', vehiclePlate: '51B-54321' },
              driverAssignment: { driverId: 'd1', driverName: 'Driver Test' }
            }
          ],
          isLoading: false,
        };
      }
      return { data: [], isLoading: false };
    },
    useMutation: ({ mutationFn, onSuccess }: any) => {
      return {
        mutate: async (variables: any) => {
          if (mutationFn) {
            await mutationFn(variables);
          }
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

// Mock trackingApi
const mockUpdateStatus = vi.fn().mockResolvedValue({ id: 'ship1', status: 'InTransit' });
const mockSubmitPod = vi.fn().mockResolvedValue({ success: true });
vi.mock('../features/tracking/api/trackingApi', () => ({
  trackingApi: {
    getDriverShipments: vi.fn(),
    updateShipmentStatus: (id: string, status: string) => mockUpdateStatus(id, status),
    submitProofOfDelivery: (data: any) => mockSubmitPod(data),
  },
}));

describe('Tracking Component', () => {
  it('renders driver tracking timeline and shipments list', async () => {
    renderWithProviders(<Tracking />);

    expect(screen.getByText(/ship1/i)).toBeInTheDocument();
    expect(screen.getByText(/ship2/i)).toBeInTheDocument();
  });

  it('allows driver to mark shipment as In Transit', async () => {
    renderWithProviders(<Tracking />);

    const startTransitButton = screen.getByText('Confirm Pickup & Start Route');
    fireEvent.click(startTransitButton);

    expect(mockUpdateStatus).toHaveBeenCalledWith('ship1', 'InTransit');
  });

  it('allows driver to submit Proof of Delivery (POD) for In Transit shipment', async () => {
    renderWithProviders(<Tracking />);

    const collectPodButton = screen.getByText('Collect Proof of Delivery');
    fireEvent.click(collectPodButton);

    // Should open the POD modal
    expect(screen.getByText('Proof of Delivery')).toBeInTheDocument();

    const signButton = screen.getByText('Tap to Sign Digital Pad');
    fireEvent.click(signButton);

    const submitButton = screen.getByText('Complete Delivery');
    fireEvent.click(submitButton);

    expect(mockSubmitPod).toHaveBeenCalled();
  });
});
