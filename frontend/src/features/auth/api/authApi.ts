import apiClient from '../../../lib/apiClient';

export type UserRole = 'Admin' | 'OperationsManager' | 'BranchStaff' | 'Customer';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'smartfm_user';

function persistSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const authApi = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', request);
    const { token, user } = response.data;
    persistSession(token, user);
    return response.data;
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', request);
    const { token, user } = response.data;
    persistSession(token, user);
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return Promise.resolve();
  },

  getCurrentUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!raw || !token) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
};
