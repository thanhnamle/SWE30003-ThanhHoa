import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Drivers } from '../features/drivers/Drivers';
import { renderWithProviders } from '../test/testUtils';
import { shipmentApi } from '../features/shipments/api/shipmentApi';

// Mock Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Admin User' },
  }),
}));

// Mock shipmentApi
vi.mock('../features/shipments/api/shipmentApi', () => ({
  shipmentApi: {
    getDrivers: vi.fn(),
    createDriver: vi.fn(),
  },
}));

describe('Drivers Component', () => {
  const mockDrivers = [
    {
      id: 'd1',
      fullName: 'John Smith',
      licenseNumber: 'B2-998877',
      isOnLeave: false,
      branchId: 'b1',
    },
    {
      id: 'd2',
      fullName: 'Alice Johnson',
      licenseNumber: 'FC-112233',
      isOnLeave: true,
      branchId: 'b1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shipmentApi.getDrivers).mockResolvedValue(mockDrivers as any);
  });

  it('renders page header and driver cards after loading', async () => {
    renderWithProviders(<Drivers />);

    expect(screen.getByText('Drivers')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });
  });

  it('displays status badges for active and on leave drivers', async () => {
    renderWithProviders(<Drivers />);

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('On Leave')).toBeInTheDocument();
    });
  });

  it('renders empty state when no drivers exist', async () => {
    vi.mocked(shipmentApi.getDrivers).mockResolvedValue([]);
    renderWithProviders(<Drivers />);

    await waitFor(() => {
      expect(screen.getByText('No Drivers Found')).toBeInTheDocument();
    });
  });

  it('opens add driver modal when clicking Add Driver button', async () => {
    renderWithProviders(<Drivers />);

    const addButton = screen.getByText('Add Driver');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Driver')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Jane Smith')).toBeInTheDocument();
  });
});
