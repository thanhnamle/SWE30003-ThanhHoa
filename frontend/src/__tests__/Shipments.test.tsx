import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Shipments } from '../features/shipments/Shipments';
import { renderWithProviders } from '../test/testUtils';

// Mock Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User' },
  }),
}));

// Mock React Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: ({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'shipments') {
        return {
          data: [
            { id: 'ship1-uuid', orderId: 'ord1-uuid', status: 'Preparing', createdAt: new Date().toISOString() },
            { id: 'ship2-uuid', orderId: 'ord2-uuid', status: 'InTransit', createdAt: new Date().toISOString() },
          ],
          isLoading: false,
          error: null,
        };
      }
      if (queryKey[0] === 'vehicles') {
        return {
          data: [
            { id: 'v1', plateNumber: '29A-11111', type: 'Van', maxPayloadKg: 1000, maxVolumeM3: 5, isUnderMaintenance: false },
          ],
          isLoading: false,
          error: null,
        };
      }
      if (queryKey[0] === 'drivers') {
        return {
          data: [
            { id: 'd1', fullName: 'John Doe', licenseNumber: 'B2-111', isOnLeave: false },
          ],
          isLoading: false,
          error: null,
        };
      }
      return { data: [], isLoading: false, error: null };
    },
    useMutation: () => {
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn().mockResolvedValue({ status: 'ReadyForPickup' }),
        isLoading: false,
        isSuccess: false,
        error: null,
      };
    },
  };
});

describe('Shipments Component', () => {
  it('renders shipments list after loading', async () => {
    renderWithProviders(<Shipments />);

    expect(screen.getByText(/ship1/i)).toBeInTheDocument();
    expect(screen.getByText(/ship2/i)).toBeInTheDocument();
  });

  it('shows assignment modal when clicking Assign on a Preparing shipment', async () => {
    renderWithProviders(<Shipments />);

    const assignButton = screen.getByText('Assign Resources');
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(screen.getByText('Resource Assignment')).toBeInTheDocument();
      expect(screen.getByText(/29A-11111/)).toBeInTheDocument();
      expect(screen.getByText('John Doe (B2-111)')).toBeInTheDocument();
    });
  });

  it('validates required fields in assignment form', async () => {
    renderWithProviders(<Shipments />);

    const assignButton = screen.getByText('Assign Resources');
    fireEvent.click(assignButton);

    const submitButton = screen.getByText('Confirm Assignment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Valid pickup address is required')).toBeInTheDocument();
      expect(screen.getByText('Valid delivery address is required')).toBeInTheDocument();
    });
  });
});
