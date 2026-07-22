import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../features/auth/Login';
import { renderWithProviders } from '../test/testUtils';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

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

  it('renders login form correctly with English placeholders', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
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
    mockLogin.mockResolvedValue(undefined);
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
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
    });
  });

  it('handles login failure and displays error message', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid email or password.'));
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });
});
