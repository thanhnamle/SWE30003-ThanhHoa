import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { authApi } from '@/features/auth/api/authApi';


// Mock authApi
vi.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('provides null user and isAuthenticated false initially if no user in localStorage', () => {
    vi.mocked(authApi.getCurrentUser).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides user and isAuthenticated true if user exists in localStorage', () => {
    const mockUser = { id: '1', email: 'test@test.com', fullName: 'Test', role: 'Customer' as const };
    vi.mocked(authApi.getCurrentUser).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('updates state on login', async () => {
    vi.mocked(authApi.getCurrentUser).mockReturnValue(null);
    const mockUser = { id: '1', email: 'test@test.com', fullName: 'Test', role: 'Customer' as const };
    vi.mocked(authApi.login).mockResolvedValue({ token: 'abc', user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });

    expect(authApi.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('updates state on logout', async () => {
    const mockUser = { id: '1', email: 'test@test.com', fullName: 'Test', role: 'Customer' as const };
    vi.mocked(authApi.getCurrentUser).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
