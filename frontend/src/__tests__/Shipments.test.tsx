import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Shipments } from '../features/shipments/Shipments';
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
      if (queryKey[0] === 'shipments') {
        return {
          data: [
            { id: 'ship1', orderId: 'ord1', status: 'Preparing', createdAt: new Date().toISOString() },
            { id: 'ship2', orderId: 'ord2', status: 'ReadyForPickup', createdAt: new Date().toISOString() },
          ],
          isLoading: false,
        };
      }
      if (queryKey[0] === 'vehicles') {
        return {
          data: [
            { id: 'v1', plateNumber: '29A-11111', type: 'Van', maxPayloadKg: 1000, maxVolumeM3: 5, isUnderMaintenance: false },
          ],
          isLoading: false,
        };
      }
      if (queryKey[0] === 'drivers') {
        return {
          data: [
            { id: 'd1', name: 'Nguyen Van A', licenseNumber: 'B2-111', isOnLeave: false },
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

    expect(screen.getByText('Resource Assignment')).toBeInTheDocument();
    expect(screen.getByText('29A-11111 (Van)')).toBeInTheDocument();
    expect(screen.getByText('Nguyen Van A (B2-111)')).toBeInTheDocument();
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
