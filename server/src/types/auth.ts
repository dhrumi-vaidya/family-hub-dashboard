export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member' | 'super_admin';
  families: Family[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Family {
  id: string;
  name: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'member' | 'super_admin';
  familyIds: string[];
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}