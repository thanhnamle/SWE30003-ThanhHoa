import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Reports } from '@/features/reports/Reports';
import { reportApi } from '@/features/reports/api/reportApi';
import { renderWithProviders } from '@/test/testUtils';

// Mock Recharts to avoid DOM SVG measuring issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="barchart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  PieChart: ({ children }: any) => <div data-testid="piechart">{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  Legend: () => <div />
}));

vi.mock('@/features/reports/api/reportApi', () => ({
  reportApi: {
    getOperationalReport: vi.fn()
  }
}));

describe('Reports Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(reportApi.getOperationalReport).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<Reports />);
    expect(screen.getByText('Analytics Reports')).toBeInTheDocument();
  });

  it('renders dashboard stats after data loads', async () => {
    const mockReportData = {
      stats: { revenue: 150000, orders: 150, vehicles: 20, drivers: 25, customers: 100 },
      shipmentStatusData: [{ name: 'In Transit', value: 50 }],
      revenueData: [{ name: 'Jan', value: 1000 }]
    };
    
    vi.mocked(reportApi.getOperationalReport).mockResolvedValue(mockReportData);

    renderWithProviders(<Reports />);

    await waitFor(() => {
      expect(screen.getByText('Operational Analytics')).toBeInTheDocument();
    });

    expect(screen.getByText('$150,000')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('barchart')).toBeInTheDocument();
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
  });

  it('handles api failure gracefully', async () => {
    vi.mocked(reportApi.getOperationalReport).mockRejectedValue(new Error('API error'));

    renderWithProviders(<Reports />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load reports')).toBeInTheDocument();
      expect(screen.getByText('Please try again later.')).toBeInTheDocument();
    });
  });
});
