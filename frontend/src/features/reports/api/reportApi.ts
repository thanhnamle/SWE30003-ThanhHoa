import { apiClient } from '../../../lib/apiClient';

export interface OperationalReportData {
  stats: {
    orders: number;
    revenue: number;
    vehicles: number;
    drivers: number;
    customers: number;
  };
  shipmentStatusData: { name: string; value: number }[];
  revenueData: { name: string; value: number }[];
}

export const reportApi = {
  getOperationalReport: async (): Promise<OperationalReportData> => {
    const response = await apiClient.get('/api/reports/operational');
    return response.data;
  }
};
