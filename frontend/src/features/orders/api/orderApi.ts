// MOCK API for Transport Offerings and Orders until Backend Controllers are ready
export type TransportCategory = 'Standard' | 'Express' | 'Fragile' | 'Bulk';

export interface TransportOffering {
  id: string;
  category: TransportCategory;
  maxCapacityKg: number;
  baseFee: number;
  feePerKm: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  companyName: string;
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

// Seeded Data as per docs/08
const mockOfferings: TransportOffering[] = [
  { id: '11111111-1111-1111-1111-111111111111', category: 'Standard', maxCapacityKg: 5000, baseFee: 50, feePerKm: 2.5, isActive: true },
  { id: '22222222-2222-2222-2222-222222222222', category: 'Express', maxCapacityKg: 2000, baseFee: 150, feePerKm: 5.0, isActive: true },
  { id: '33333333-3333-3333-3333-333333333333', category: 'Fragile', maxCapacityKg: 1000, baseFee: 100, feePerKm: 3.5, isActive: true },
  { id: '44444444-4444-4444-4444-444444444444', category: 'Bulk', maxCapacityKg: 20000, baseFee: 300, feePerKm: 1.5, isActive: true },
];

const mockCustomers: Customer[] = [
  { id: '99999999-9999-9999-9999-999999999999', companyName: 'Acme Logistics Corp', isCorporateAccount: true },
];

const MOCK_DELAY_MS = 800;

export const orderApi = {
  getOfferings: async (): Promise<TransportOffering[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockOfferings), MOCK_DELAY_MS));
  },
  
  getCustomers: async (): Promise<Customer[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockCustomers), MOCK_DELAY_MS));
  },

  createOrder: async (order: CreateOrderRequest): Promise<{ id: string, status: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (order.cargoWeightKg > 20000) {
          reject(new Error("Cargo weight exceeds maximum allowed capacity across all fleets."));
          return;
        }
        resolve({
          id: crypto.randomUUID(),
          status: 'Pending'
        });
      }, MOCK_DELAY_MS);
    });
  }
};
