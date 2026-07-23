import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthUser, LoginRequest, RegisterRequest } from '../api/authApi';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authApi.getCurrentUser());
    setIsLoading(false);
  }, []);

  const login = async (request: LoginRequest) => {
    const { user } = await authApi.login(request);
    setUser(user);
  };

  const register = async (request: RegisterRequest) => {
    const { user } = await authApi.register(request);
    setUser(user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
