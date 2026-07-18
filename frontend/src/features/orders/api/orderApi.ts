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

// Seeded Data from Backend DbContext + Extra Mocks
const mockOfferings: TransportOffering[] = [
  { id: '44444444-4444-4444-4444-444444444444', category: 'Standard', maxCapacityKg: 5000, baseFee: 500000, feePerKm: 15000, isActive: true },
  { id: '44444444-4444-4444-4444-444444444445', category: 'Express', maxCapacityKg: 2000, baseFee: 800000, feePerKm: 20000, isActive: true },
  { id: '44444444-4444-4444-4444-444444444446', category: 'Fragile', maxCapacityKg: 1000, baseFee: 600000, feePerKm: 18000, isActive: true },
  { id: '44444444-4444-4444-4444-444444444447', category: 'Bulk', maxCapacityKg: 20000, baseFee: 1500000, feePerKm: 10000, isActive: true },
  { id: '44444444-4444-4444-4444-444444444448', category: 'Standard', maxCapacityKg: 10000, baseFee: 700000, feePerKm: 16000, isActive: true },
];

const mockCustomers: Customer[] = [
  { id: '99999999-9999-9999-9999-999999999999', companyName: 'Acme Logistics Corp', isCorporateAccount: true },
  { id: '99999999-9999-9999-9999-999999999998', companyName: 'Global Retailers Ltd', isCorporateAccount: true },
  { id: '99999999-9999-9999-9999-999999999997', companyName: 'John Doe Personal', isCorporateAccount: false },
  { id: '99999999-9999-9999-9999-999999999996', companyName: 'Swift Manufacturing', isCorporateAccount: true },
  { id: '99999999-9999-9999-9999-999999999995', companyName: 'Jane Smith', isCorporateAccount: false },
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
