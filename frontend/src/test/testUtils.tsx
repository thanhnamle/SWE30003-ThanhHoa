import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

// Creates a fresh QueryClient for each test case to avoid data leakage
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for speed and deterministic testing
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Wrapper utility for React testing library
export function renderWithProviders(ui: React.ReactElement, initialEntries = ['/']) {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
}
