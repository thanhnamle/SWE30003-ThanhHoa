import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Login } from '@/features/auth/Login';
import { renderWithProviders } from '@/test/testUtils';
import { useAuth } from '@/features/auth/context/AuthContext';


vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      logout: vi.fn(),
      user: null,
      isLoading: false,
      register: vi.fn(),
    });
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderWithProviders(<Login />);
    
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your password.')).toBeInTheDocument();
    });
    
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login function with correct data on valid submit', async () => {
    renderWithProviders(<Login />);
    
    await userEvent.type(screen.getByPlaceholderText('name@company.com'), 'test@smartfm.vn');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
    
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@smartfm.vn',
        password: 'Password123!',
      });
    });
  });

  it('shows server error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    renderWithProviders(<Login />);
    
    await userEvent.type(screen.getByPlaceholderText('name@company.com'), 'test@smartfm.vn');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'WrongPass');
    
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
