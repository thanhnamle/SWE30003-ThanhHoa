import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Vehicles } from '../features/vehicles/Vehicles';
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
    getVehicles: vi.fn(),
    createVehicle: vi.fn(),
  },
}));

describe('Vehicles Component', () => {
  const mockVehicles = [
    {
      id: 'v1',
      plateNumber: '51A-123.45',
      type: 'Truck',
      maxPayloadKg: 5000,
      maxVolumeM3: 20,
      isUnderMaintenance: false,
      branchId: 'b1',
    },
    {
      id: 'v2',
      plateNumber: '29C-999.99',
      type: 'Container',
      maxPayloadKg: 15000,
      maxVolumeM3: 80,
      isUnderMaintenance: true,
      branchId: 'b1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shipmentApi.getVehicles).mockResolvedValue(mockVehicles as any);
  });

  it('renders page header and vehicle cards after loading', async () => {
    renderWithProviders(<Vehicles />);

    expect(screen.getByText('Fleet Vehicles')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('51A-123.45')).toBeInTheDocument();
      expect(screen.getByText('29C-999.99')).toBeInTheDocument();
    });
  });

  it('displays status badges for available and maintenance vehicles', async () => {
    renderWithProviders(<Vehicles />);

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });
  });

  it('renders empty state when no vehicles exist', async () => {
    vi.mocked(shipmentApi.getVehicles).mockResolvedValue([]);
    renderWithProviders(<Vehicles />);

    await waitFor(() => {
      expect(screen.getByText('No Vehicles Found')).toBeInTheDocument();
    });
  });

  it('opens add vehicle modal when clicking Add Vehicle button', async () => {
    renderWithProviders(<Vehicles />);

    const addButton = screen.getByText('Add Vehicle');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 51A-123.45')).toBeInTheDocument();
  });
});
