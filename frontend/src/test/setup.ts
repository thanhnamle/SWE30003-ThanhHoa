import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock SVGPathElement methods missing in JSDOM
if (typeof window !== 'undefined') {
  if (typeof SVGElement !== 'undefined') {
    (SVGElement.prototype as any).getTotalLength = () => 100;
    (SVGElement.prototype as any).getPointAtLength = () => ({ x: 0, y: 0 });
  }
}

// Mock Recharts to avoid ResizeObserver and ResponsiveContainer errors/warnings in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => children,
  AreaChart: ({ children }: any) => children,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  BarChart: ({ children }: any) => children,
  Bar: () => null,
  Cell: () => null,
}));

// Mock ResizeObserver which is missing in JSDOM
(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Automatically clean up React DOM after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
