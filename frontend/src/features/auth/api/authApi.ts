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

interface StoredUser extends AuthUser {
  password: string;
}

const USERS_KEY = 'smartfm_mock_users';
const TOKEN_KEY = 'token';
const USER_KEY = 'smartfm_user';

function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      // fall through to reseed
    }
  }
  const seeded: StoredUser[] = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      email: 'admin@smartfm.vn',
      fullName: 'System Administrator',
      role: 'Admin',
      password: 'Admin123!',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateMockToken(user: AuthUser): string {
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 8 * 60 * 60 * 1000,
    })
  );
  return `mock.${payload}.token`;
}

function persistSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

const MOCK_DELAY_MS = 700;

export const authApi = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = loadUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === request.email.trim().toLowerCase()
        );
        if (!found || found.password !== request.password) {
          reject(new Error('Email hoặc mật khẩu không đúng.'));
          return;
        }
        const { password: _password, ...user } = found;
        const token = generateMockToken(user);
        persistSession(token, user);
        resolve({ token, user });
      }, MOCK_DELAY_MS);
    });
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request.password !== request.confirmPassword) {
          reject(new Error('Mật khẩu xác nhận không khớp.'));
          return;
        }
        if (request.password.length < 8) {
          reject(new Error('Mật khẩu phải có ít nhất 8 ký tự.'));
          return;
        }
        const users = loadUsers();
        if (
          users.some(
            (u) => u.email.toLowerCase() === request.email.trim().toLowerCase()
          )
        ) {
          reject(new Error('Email này đã được đăng ký.'));
          return;
        }
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          email: request.email.trim(),
          fullName: request.fullName.trim(),
          role: 'Customer',
          password: request.password,
        };
        users.push(newUser);
        saveUsers(users);

        const { password: _password, ...user } = newUser;
        const token = generateMockToken(user);
        persistSession(token, user);
        resolve({ token, user });
      }, MOCK_DELAY_MS);
    });
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
