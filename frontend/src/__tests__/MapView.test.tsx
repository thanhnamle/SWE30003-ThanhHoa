import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Tracking } from '@/features/tracking/Tracking';
import { renderWithProviders } from '@/test/testUtils';
import { trackingApi } from '@/features/tracking/api/trackingApi';


// Mock Leaflet as it requires a real DOM and causes issues in JSDOM
vi.mock('leaflet', () => {
  return {
    default: {
      map: vi.fn().mockReturnValue({
        setView: vi.fn().mockReturnThis(),
        remove: vi.fn(),
        fitBounds: vi.fn(),
      }),
      tileLayer: vi.fn().mockReturnValue({
        addTo: vi.fn(),
      }),
      marker: vi.fn().mockReturnValue({
        addTo: vi.fn().mockReturnThis(),
        bindTooltip: vi.fn().mockReturnThis(),
      }),
      divIcon: vi.fn(),
      latLngBounds: vi.fn().mockReturnValue({
        extend: vi.fn().mockReturnThis(),
      }),
      polyline: vi.fn().mockReturnValue({
        addTo: vi.fn(),
      })
    }
  };
});

vi.mock('@/features/tracking/api/trackingApi', () => ({
  trackingApi: {
    getDriverShipments: vi.fn(),
    updateShipmentStatus: vi.fn(),
    uploadPod: vi.fn(),
  }
}));

describe('MapView / Tracking Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(trackingApi.getDriverShipments).mockResolvedValue([
      {
        id: 'ship-1',
        orderId: 'ord-1',
        status: 'InTransit' as any,
        createdAt: '2026-01-01',
        pickupDeliveryOption: {
          pickupAddress: 'Hanoi',
          deliveryAddress: 'HCMC',
          pickupLocationLat: 21.0285,
          pickupLocationLng: 105.8542,
          deliveryLocationLat: 10.8231,
          deliveryLocationLng: 106.6297
        },
        order: { customerName: 'Customer A' },
        currentLocationLat: 16.0471,
        currentLocationLng: 108.2062
      } as any
    ]);
  });

  it('renders tracking page and shipment list', async () => {
    renderWithProviders(<Tracking />);
    
    await waitFor(() => {
      expect(screen.getByText('Driver Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Delivery Task')).toBeInTheDocument();
    });
  });

  it('renders leaflet map container for InTransit shipments', async () => {
    renderWithProviders(<Tracking />);
    
    // First, wait for the shipment item to appear and click it
    await waitFor(() => {
      expect(screen.getByText('Delivery Task')).toBeInTheDocument();
    });
    
    // Find a clickable element for the shipment. 'Tracking ID' or just the text block.
    // The Tracking component usually has a button or div to expand. We can click on the shipment orderId or customer name
    const shipmentCard = screen.getByText('Delivery Task');
    await userEvent.click(shipmentCard);
    
    await waitFor(() => {
      expect(screen.getByText('Leaflet GPS Live Map')).toBeInTheDocument();
    });
  });
});
