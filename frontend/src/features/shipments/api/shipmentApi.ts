import apiClient from '../../../lib/apiClient';

export type ShipmentStatus = 'Preparing' | 'ReadyForPickup' | 'InTransit' | 'Delivered' | 'ExceptionPending';
export type VehicleType = 'Van' | 'Truck' | 'Container' | 'Refrigerated';

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  maxPayloadKg: number;
  maxVolumeM3: number;
  isUnderMaintenance: boolean;
  branchId?: string;
}

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  isOnLeave: boolean;
  branchId?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  createdAt: string;
  vehicleAssignment?: {
    vehicleId: string;
    vehiclePlate: string;
    vehicleType?: string;
  };
  driverAssignment?: {
    driverId: string;
    driverName: string;
  };
  order?: {
    cargoWeightKg: number;
    cargoVolumeM3: number;
    specialHandlingNotes: string;
    customerName: string;
    serviceCategory: string;
  };
  pickupDeliveryOption?: {
    pickupAddress: string;
    pickupWindowStart: string;
    pickupWindowEnd: string;
    deliveryAddress: string;
    deliveryWindowStart: string;
    deliveryWindowEnd: string;
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

export const shipmentApi = {
  getShipments: async (): Promise<Shipment[]> => {
    const response = await apiClient.get<Shipment[]>('/api/shipments');
    return response.data;
  },

  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/api/vehicles');
    return response.data;
  },

  getDrivers: async (): Promise<Driver[]> => {
    const response = await apiClient.get<Driver[]>('/api/drivers');
    return response.data.filter((d) => !d.isOnLeave);
  },

  assignResources: async (request: AssignResourcesRequest): Promise<Shipment> => {
    const { shipmentId, ...body } = request;
    const response = await apiClient.post<Shipment>(
      `/api/shipments/${shipmentId}/assign`,
      body
    );
    return response.data;
  },

  createDriver: async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    const response = await apiClient.post<Driver>('/api/drivers', driver);
    return response.data;
  },

  createVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>('/api/vehicles', vehicle);
    return response.data;
  },

  updateVehicle: async (id: string, vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const response = await apiClient.put<Vehicle>(`/api/vehicles/${id}`, vehicle);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/vehicles/${id}`);
  },

  updateShipmentStatus: async (id: string, status: ShipmentStatus): Promise<Shipment> => {
    const response = await apiClient.put<Shipment>(`/api/shipments/${id}/status`, { status });
    return response.data;
  },

  deleteShipment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/shipments/${id}`);
  },
};
