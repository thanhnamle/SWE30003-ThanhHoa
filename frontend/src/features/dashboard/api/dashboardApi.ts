import apiClient from '../../../lib/apiClient';

export interface DashboardStats {
  orders: number;
  revenue: number;
  vehicles: number;
  drivers: number;
  customers: number;
}

export interface DashboardReport {
  stats: DashboardStats;
  shipmentStatusData: { name: string; value: number }[];
  revenueData: { name: string; value: number }[];
}

export const dashboardApi = {
  getOperationalReport: async (): Promise<DashboardReport> => {
    const response = await apiClient.get<DashboardReport>('/api/reports/operational');
    return response.data;
  },
};
