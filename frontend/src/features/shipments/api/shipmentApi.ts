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

// Seeded Data
const mockVehicles: Vehicle[] = [
  { id: '55555555-5555-5555-5555-555555555555', plateNumber: 'TRK-9000', type: 'Truck', maxPayloadKg: 10000, maxVolumeM3: 35.0, isUnderMaintenance: false },
  { id: '66666666-6666-6666-6666-666666666666', plateNumber: 'VAN-1001', type: 'Van', maxPayloadKg: 1500, maxVolumeM3: 8.0, isUnderMaintenance: false },
];

const mockDrivers: Driver[] = [
  { id: '77777777-7777-7777-7777-777777777777', name: 'John Doe', licenseNumber: 'DL-123456', isOnLeave: false },
  { id: '88888888-8888-8888-8888-888888888888', name: 'Jane Smith', licenseNumber: 'DL-654321', isOnLeave: false },
];

// In-memory state for mock shipments
let mockShipments: Shipment[] = [
  { 
    id: 'aaaa1111-1111-1111-1111-11111111aaaa', 
    orderId: 'bbbb2222-2222-2222-2222-22222222bbbb', 
    status: 'Preparing', 
    createdAt: new Date().toISOString() 
  }
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
