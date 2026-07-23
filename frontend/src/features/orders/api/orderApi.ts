import apiClient from '../../../lib/apiClient';

export type TransportCategory = 'Standard' | 'Express' | 'Fragile' | 'Bulk';

export interface TransportOffering {
  id: string;
  name?: string;
  category: TransportCategory;
  maxCapacityKg: number;
  baseFee: number;
  feePerKm: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name?: string;
  fullName?: string;
  companyName?: string | null;
  email?: string;
  phone?: string;
  isCorporateAccount: boolean;
}

export interface CreateOrderRequest {
  cargoWeightKg: number;
  cargoVolumeM3: number;
  specialHandlingNotes: string;
  customerId: string;
  branchId: string;
  transportOfferingId: string;
}

export const orderApi = {
  getOfferings: async (): Promise<TransportOffering[]> => {
    const response = await apiClient.get<TransportOffering[]>('/api/transportofferings');
    return response.data.filter((o) => o.isActive);
  },

  getCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>('/api/customers');
    return response.data;
  },

  createOrder: async (order: CreateOrderRequest): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post<{ id: string; status: string }>('/api/orders', {
      customerId: order.customerId,
      branchId: order.branchId,
      transportOfferingId: order.transportOfferingId,
      cargoWeightKg: order.cargoWeightKg,
      cargoVolumeM3: order.cargoVolumeM3,
      specialHandlingNotes: order.specialHandlingNotes,
    });
    return response.data;
  },

  createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/api/customers', customer);
    return response.data;
  },

  updateCustomer: async (id: string, customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/api/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/customers/${id}`);
  },
};
