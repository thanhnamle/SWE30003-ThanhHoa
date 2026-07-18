export type ShipmentStatus = 'Preparing' | 'ReadyForPickup' | 'InTransit' | 'Delivered' | 'ExceptionPending';
export type VehicleType = 'Van' | 'Truck' | 'Container' | 'Refrigerated';

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  maxPayloadKg: number;
  maxVolumeM3: number;
  isUnderMaintenance: boolean;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  isOnLeave: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  createdAt: string;
  pickupDeliveryOption?: {
    pickupAddress: string;
    deliveryAddress: string;
  };
  vehicleAssignment?: {
    vehicleId: string;
    vehiclePlate: string;
  };
  driverAssignment?: {
    driverId: string;
    driverName: string;
  };
}

export interface AssignResourcesRequest {
  shipmentId: string;
  vehicleId: string;
  driverId: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
}

// Seeded Data from Backend DbContext + extra mocks
const mockVehicles: Vehicle[] = [
  { id: '22222222-2222-2222-2222-222222222222', plateNumber: '51A-123.45', type: 'Truck', maxPayloadKg: 5000, maxVolumeM3: 20, isUnderMaintenance: false },
  { id: '22222222-2222-2222-2222-222222222223', plateNumber: '51B-987.65', type: 'Van', maxPayloadKg: 1500, maxVolumeM3: 8, isUnderMaintenance: false },
  { id: '22222222-2222-2222-2222-222222222224', plateNumber: '51C-456.78', type: 'Container', maxPayloadKg: 20000, maxVolumeM3: 60, isUnderMaintenance: true },
  { id: '22222222-2222-2222-2222-222222222225', plateNumber: '51D-111.22', type: 'Refrigerated', maxPayloadKg: 3000, maxVolumeM3: 15, isUnderMaintenance: false },
  { id: '22222222-2222-2222-2222-222222222226', plateNumber: '51E-333.44', type: 'Truck', maxPayloadKg: 8000, maxVolumeM3: 30, isUnderMaintenance: false },
];

const mockDrivers: Driver[] = [
  { id: '33333333-3333-3333-3333-333333333333', name: 'Nguyen Van A', licenseNumber: 'B2-998877', isOnLeave: false },
  { id: '33333333-3333-3333-3333-333333333334', name: 'Tran Van B', licenseNumber: 'C-112233', isOnLeave: false },
  { id: '33333333-3333-3333-3333-333333333335', name: 'Le Thi C', licenseNumber: 'B2-445566', isOnLeave: true },
  { id: '33333333-3333-3333-3333-333333333336', name: 'Pham Van D', licenseNumber: 'FC-778899', isOnLeave: false },
  { id: '33333333-3333-3333-3333-333333333337', name: 'Hoang Van E', licenseNumber: 'C-990011', isOnLeave: false },
];

// In-memory state for mock shipments
let mockShipments: Shipment[] = [
  { id: 'aaaa1111-1111-1111-1111-11111111aaaa', orderId: 'bbbb2222-2222-2222-2222-22222222bbbb', status: 'Preparing', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'aaaa1111-1111-1111-1111-11111111aaab', orderId: 'bbbb2222-2222-2222-2222-22222222bbbc', status: 'Preparing', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'aaaa1111-1111-1111-1111-11111111aaac', orderId: 'bbbb2222-2222-2222-2222-22222222bbbd', status: 'ReadyForPickup', createdAt: new Date(Date.now() - 14400000).toISOString(), vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222222', vehiclePlate: '51A-123.45' }, driverAssignment: { driverId: '33333333-3333-3333-3333-333333333333', driverName: 'Nguyen Van A' } },
  { id: 'aaaa1111-1111-1111-1111-11111111aaad', orderId: 'bbbb2222-2222-2222-2222-22222222bbbe', status: 'InTransit', createdAt: new Date(Date.now() - 86400000).toISOString(), vehicleAssignment: { vehicleId: '22222222-2222-2222-2222-222222222223', vehiclePlate: '51B-987.65' }, driverAssignment: { driverId: '33333333-3333-3333-3333-333333333334', driverName: 'Tran Van B' } },
  { id: 'aaaa1111-1111-1111-1111-11111111aaae', orderId: 'bbbb2222-2222-2222-2222-22222222bbbf', status: 'ExceptionPending', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_DELAY_MS = 600;

export const shipmentApi = {
  getShipments: async (): Promise<Shipment[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockShipments]), MOCK_DELAY_MS));
  },
  
  getVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockVehicles.filter(v => !v.isUnderMaintenance)), MOCK_DELAY_MS));
  },

  getDrivers: async (): Promise<Driver[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockDrivers.filter(d => !d.isOnLeave)), MOCK_DELAY_MS));
  },

  assignResources: async (request: AssignResourcesRequest): Promise<Shipment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shipmentIndex = mockShipments.findIndex(s => s.id === request.shipmentId);
        if (shipmentIndex === -1) {
          reject(new Error("Shipment not found"));
          return;
        }

        const vehicle = mockVehicles.find(v => v.id === request.vehicleId);
        const driver = mockDrivers.find(d => d.id === request.driverId);

        if (!vehicle || !driver) {
          reject(new Error("Invalid vehicle or driver selected"));
          return;
        }

        // Update shipment state
        mockShipments[shipmentIndex] = {
          ...mockShipments[shipmentIndex],
          status: 'ReadyForPickup',
          vehicleAssignment: { vehicleId: vehicle.id, vehiclePlate: vehicle.plateNumber },
          driverAssignment: { driverId: driver.id, driverName: driver.name },
          pickupDeliveryOption: { pickupAddress: request.pickupAddress, deliveryAddress: request.deliveryAddress }
        };

        resolve(mockShipments[shipmentIndex]);
      }, MOCK_DELAY_MS);
    });
  }
};
