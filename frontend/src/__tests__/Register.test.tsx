import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Register } from '@/features/auth/Register';
import { renderWithProviders } from '@/test/testUtils';
import { useAuth } from '@/features/auth/context/AuthContext';

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Register Component', () => {
  const mockRegister = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
      isLoading: false,
      register: mockRegister,
    });
  });

  it('renders register form correctly', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderWithProviders(<Register />);
    
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows password mismatch error', async () => {
    renderWithProviders(<Register />);
    
    await userEvent.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('ban@congty.com'), 'test@smartfm.vn');
    
    await userEvent.type(screen.getByPlaceholderText('At least 8 characters'), 'Password123!');
    await userEvent.type(screen.getByPlaceholderText('Confirm your password'), 'Password456!');
    
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('calls register function with correct data on valid submit', async () => {
    renderWithProviders(<Register />);
    
    await userEvent.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('ban@congty.com'), 'test@smartfm.vn');
    
    await userEvent.type(screen.getByPlaceholderText('At least 8 characters'), 'Password123!');
    await userEvent.type(screen.getByPlaceholderText('Confirm your password'), 'Password123!');
    
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@smartfm.vn',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    });
  });

  it('shows server error message when registration fails', async () => {
    mockRegister.mockRejectedValue(new Error('Email already exists'));
    
    renderWithProviders(<Register />);
    
    await userEvent.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('ban@congty.com'), 'test@smartfm.vn');
    
    await userEvent.type(screen.getByPlaceholderText('At least 8 characters'), 'Password123!');
    await userEvent.type(screen.getByPlaceholderText('Confirm your password'), 'Password123!');
    
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
