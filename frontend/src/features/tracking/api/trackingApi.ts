import { Shipment } from '../../shipments/api/shipmentApi';

export interface ProofOfDeliveryRequest {
  shipmentId: string;
  signatureImageBase64: string;
  notes?: string;
}

// Since this is mock data, we will share the mock shipments state from shipmentApi 
// But in a real app, this would hit the backend tracking controllers.
// For the sake of the mock, we simulate it here.

const MOCK_DELAY_MS = 800;

export const trackingApi = {
  // Simulate getting shipments assigned to the logged-in driver that are ReadyForPickup or InTransit
  getDriverShipments: async (): Promise<Shipment[]> => {
    return new Promise((resolve) => setTimeout(() => {
      // Mocking 2 shipments for the driver dashboard
      resolve([
        {
          id: 'xxxx9999-9999-9999-9999-99999999xxxx',
          orderId: 'yyyy8888-8888-8888-8888-88888888yyyy',
          status: 'InTransit',
          createdAt: new Date().toISOString(),
          pickupDeliveryOption: {
            pickupAddress: '123 Logistics Park, Dock 4',
            deliveryAddress: '789 Corporate Blvd, Suite 100'
          },
          vehicleAssignment: { vehicleId: '5555', vehiclePlate: 'TRK-9000' },
          driverAssignment: { driverId: '7777', driverName: 'John Doe' }
        },
        {
          id: 'zzzz7777-7777-7777-7777-77777777zzzz',
          orderId: 'wwww6666-6666-6666-6666-66666666wwww',
          status: 'ReadyForPickup',
          createdAt: new Date().toISOString(),
          pickupDeliveryOption: {
            pickupAddress: '456 Supplier St, Gate B',
            deliveryAddress: '321 Retail Rd, Store 5'
          },
          vehicleAssignment: { vehicleId: '5555', vehiclePlate: 'TRK-9000' },
          driverAssignment: { driverId: '7777', driverName: 'John Doe' }
        }
      ]);
    }, MOCK_DELAY_MS));
  },

  submitProofOfDelivery: async (request: ProofOfDeliveryRequest): Promise<{ success: boolean, deliveredAt: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          deliveredAt: new Date().toISOString()
        });
      }, MOCK_DELAY_MS);
    });
  },

  updateShipmentStatus: async (shipmentId: string, newStatus: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, MOCK_DELAY_MS);
    });
  }
};
