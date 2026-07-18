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
      // Mocking 5 shipments for the driver dashboard
      resolve([
        {
          id: 'aaaa1111-1111-1111-1111-11111111aaac',
          orderId: 'bbbb2222-2222-2222-2222-22222222bbbd',
          status: 'ReadyForPickup',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          pickupDeliveryOption: { pickupAddress: 'Warehouse A, Dist 7', deliveryAddress: 'Retailer X, Dist 1' },
          vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222222', vehiclePlate: '51A-123.45' },
          driverAssignment: { driverId: '33333333-3333-3333-3333-333333333333', driverName: 'Nguyen Van A' }
        },
        {
          id: 'aaaa1111-1111-1111-1111-11111111aaad',
          orderId: 'bbbb2222-2222-2222-2222-22222222bbbe',
          status: 'InTransit',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          pickupDeliveryOption: { pickupAddress: 'Port Cat Lai', deliveryAddress: 'Factory Y, Binh Duong' },
          vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222223', vehiclePlate: '51B-987.65' },
          driverAssignment: { driverId: '33333333-3333-3333-3333-333333333334', driverName: 'Tran Van B' }
        },
        {
          id: 'aaaa1111-1111-1111-1111-11111111aaaf',
          orderId: 'bbbb2222-2222-2222-2222-22222222bbbf',
          status: 'ReadyForPickup',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          pickupDeliveryOption: { pickupAddress: 'Supplier Z, Dist 9', deliveryAddress: 'Store C, Dist 3' },
          vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222222', vehiclePlate: '51A-123.45' },
          driverAssignment: { driverId: '33333333-3333-3333-3333-333333333333', driverName: 'Nguyen Van A' }
        },
        {
          id: 'aaaa1111-1111-1111-1111-11111111aab1',
          orderId: 'bbbb2222-2222-2222-2222-22222222bbc1',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          pickupDeliveryOption: { pickupAddress: 'Farm D, Dong Nai', deliveryAddress: 'Supermarket E, Dist 10' },
          vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222223', vehiclePlate: '51B-987.65' },
          driverAssignment: { driverId: '33333333-3333-3333-3333-333333333334', driverName: 'Tran Van B' }
        },
        {
          id: 'aaaa1111-1111-1111-1111-11111111aab2',
          orderId: 'bbbb2222-2222-2222-2222-22222222bbc2',
          status: 'InTransit',
          createdAt: new Date(Date.now() - 2400000).toISOString(),
          pickupDeliveryOption: { pickupAddress: 'Warehouse F, Thu Duc', deliveryAddress: 'Shop G, Go Vap' },
          vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222222', vehiclePlate: '51A-123.45' },
          driverAssignment: { driverId: '33333333-3333-3333-3333-333333333333', driverName: 'Nguyen Van A' }
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
