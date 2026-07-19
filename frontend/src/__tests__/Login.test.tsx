import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../features/auth/Login';
import { renderWithProviders } from '../test/testUtils';

// Mock useNavigate and useLocation
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/login', state: {} }),
  };
});

const mockLogin = vi.fn();
vi.mock('../features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText('ban@congty.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('validates empty email and password submission', async () => {
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole('button', { name: /Log in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your password.')).toBeInTheDocument();
    });
  });

  it('handles successful submit', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText('ban@congty.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
