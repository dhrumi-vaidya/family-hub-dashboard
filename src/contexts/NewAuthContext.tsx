/**
 * KutumbOS New Authentication Context
 * Integrates with the new JWT-based auth system
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole as PermissionUserRole } from '@/types/permissions';

// Backend types matching the server
export enum GlobalRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER'
}

export enum FamilyRole {
  FAMILY_ADMIN = 'FAMILY_ADMIN',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
  TEEN = 'TEEN',
  CHILD = 'CHILD'
}

export interface UserProfile {
  id: string;
  email: string;
  globalRole: GlobalRole;
  createdAt: string;
  lastLogin: string | null;
}

export interface FamilyWithRole {
  id: string;
  name: string;
  role: FamilyRole;
  createdAt: string;
}

export interface FamilyContext {
  familyId: string;
  userRole: FamilyRole;
  isValid: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  familyName?: string;
  inviteToken?: string;
}

export interface InviteTokenData {
  familyId: string;
  familyName: string;
  roleToAssign: FamilyRole;
  invitedBy: string;
  expiresAt: string;
}

interface AuthContextType {
  // Authentication state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Family context
  families: FamilyWithRole[];
  selectedFamily: FamilyWithRole | null;
  familyContext: FamilyContext | null;
  
  // Authentication methods
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  
  // Family methods
  setSelectedFamily: (family: FamilyWithRole) => Promise<void>;
  switchFamily: (familyId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Token management
  refreshToken: () => Promise<boolean>;
  
  // Invite methods
  getInviteInfo: (token: string) => Promise<InviteTokenData | null>;
  generateInvite: (roleToAssign: FamilyRole, expiresInHours?: number) => Promise<{ success: boolean; inviteToken?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API client with automatic token management
class AuthAPI {
  private static baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
  
  private static getAccessToken(): string | null {
    return localStorage.getItem('kutumbos_access_token');
  }
  
  private static getRefreshToken(): string | null {
    return localStorage.getItem('kutumbos_refresh_token');
  }
  
  private static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('kutumbos_access_token', accessToken);
    localStorage.setItem('kutumbos_refresh_token', refreshToken);
  }
  
  private static clearTokens(): void {
    localStorage.removeItem('kutumbos_access_token');
    localStorage.removeItem('kutumbos_refresh_token');
    localStorage.removeItem('kutumbos_selected_family');
  }
  
  private static getFamilyId(): string | null {
    const family = localStorage.getItem('kutumbos_selected_family');
    return family ? JSON.parse(family).id : null;
  }
  
  private static async request(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = this.getAccessToken();
    const familyId = this.getFamilyId();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    
    if (familyId) {
      headers['X-Family-ID'] = familyId;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    // Handle token expiration
    if (response.status === 401 && data.code === 'TOKEN_INVALID') {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        return this.request(endpoint, options);
      } else {
        // Refresh failed, clear tokens and redirect to login
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }
  
  private static async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;
      
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }
  
  // Auth endpoints
  static async login(credentials: LoginRequest) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }
  
  static async register(registerData: RegisterRequest) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
    
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }
  
  static async logout(refreshToken?: string) {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
    } finally {
      this.clearTokens();
    }
  }
  
  static async logoutAll() {
    try {
      await this.request('/auth/logout-all', {
        method: 'POST'
      });
    } finally {
      this.clearTokens();
    }
  }
  
  static async getMe() {
    return this.request('/auth/me');
  }
  
  static async getFamilies() {
    return this.request('/auth/families');
  }
  
  static async switchFamily(familyId: string) {
    return this.request('/auth/switch-family', {
      method: 'POST',
      body: JSON.stringify({ familyId })
    });
  }
  
  static async getInviteInfo(token: string) {
    return this.request(`/auth/invite/${token}`);
  }
  
  static async generateInvite(roleToAssign: FamilyRole, expiresInHours = 24) {
    return this.request('/auth/generate-invite', {
      method: 'POST',
      body: JSON.stringify({ roleToAssign, expiresInHours })
    });
  }
  
  static async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;
    
    const data = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }
}

// Map backend roles to permission system roles
const mapGlobalRoleToPermission = (globalRole: GlobalRole): PermissionUserRole => {
  switch (globalRole) {
    case GlobalRole.SUPER_ADMIN:
      return PermissionUserRole.SUPER_ADMIN;
    case GlobalRole.USER:
      return PermissionUserRole.ADULT_MEMBER; // Default for users
    default:
      return PermissionUserRole.ADULT_MEMBER;
  }
};

const mapFamilyRoleToPermission = (familyRole: FamilyRole): PermissionUserRole => {
  switch (familyRole) {
    case FamilyRole.FAMILY_ADMIN:
      return PermissionUserRole.FAMILY_ADMIN;
    case FamilyRole.ADULT:
      return PermissionUserRole.ADULT_MEMBER;
    case FamilyRole.SENIOR:
      return PermissionUserRole.SENIOR_MEMBER;
    case FamilyRole.TEEN:
      return PermissionUserRole.TEEN_MEMBER;
    case FamilyRole.CHILD:
      return PermissionUserRole.CHILD_MEMBER;
    default:
      return PermissionUserRole.ADULT_MEMBER;
  }
};

export function NewAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [families, setFamilies] = useState<FamilyWithRole[]>([]);
  const [selectedFamily, setSelectedFamilyState] = useState<FamilyWithRole | null>(null);
  const [familyContext, setFamilyContext] = useState<FamilyContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('kutumbos_access_token');
        if (!accessToken) {
          setIsLoading(false);
          return;
        }
        
        // Get user profile
        const userResponse = await AuthAPI.getMe();
        setUser(userResponse.user);
        
        // Get families
        const familiesResponse = await AuthAPI.getFamilies();
        setFamilies(familiesResponse.families);
        
        // Restore selected family
        const storedFamily = localStorage.getItem('kutumbos_selected_family');
        if (storedFamily) {
          const family = JSON.parse(storedFamily);
          const validFamily = familiesResponse.families.find((f: FamilyWithRole) => f.id === family.id);
          if (validFamily) {
            setSelectedFamilyState(validFamily);
            setFamilyContext({
              familyId: validFamily.id,
              userRole: validFamily.role,
              isValid: true
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid tokens
        localStorage.removeItem('kutumbos_access_token');
        localStorage.removeItem('kutumbos_refresh_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await AuthAPI.login(credentials);
      setUser(response.user);
      setFamilies(response.families);
      
      // Auto-select family if only one (except for Super Admin)
      if (response.user.globalRole !== GlobalRole.SUPER_ADMIN && response.families.length === 1) {
        const family = response.families[0];
        setSelectedFamilyState(family);
        setFamilyContext({
          familyId: family.id,
          userRole: family.role,
          isValid: true
        });
        localStorage.setItem('kutumbos_selected_family', JSON.stringify(family));
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };
  
  const register = async (data: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await AuthAPI.register(data);
      setUser(response.user);
      setFamilies(response.families);
      
      // Auto-select the family they just joined/created
      if (response.families.length === 1) {
        const family = response.families[0];
        setSelectedFamilyState(family);
        setFamilyContext({
          familyId: family.id,
          userRole: family.role,
          isValid: true
        });
        localStorage.setItem('kutumbos_selected_family', JSON.stringify(family));
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('kutumbos_refresh_token');
      await AuthAPI.logout(refreshToken || undefined);
    } finally {
      setUser(null);
      setFamilies([]);
      setSelectedFamilyState(null);
      setFamilyContext(null);
    }
  };
  
  const logoutAll = async (): Promise<void> => {
    try {
      await AuthAPI.logoutAll();
    } finally {
      setUser(null);
      setFamilies([]);
      setSelectedFamilyState(null);
      setFamilyContext(null);
    }
  };
  
  const setSelectedFamily = async (family: FamilyWithRole): Promise<void> => {
    setSelectedFamilyState(family);
    setFamilyContext({
      familyId: family.id,
      userRole: family.role,
      isValid: true
    });
    localStorage.setItem('kutumbos_selected_family', JSON.stringify(family));
  };
  
  const switchFamily = async (familyId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await AuthAPI.switchFamily(familyId);
      const family = families.find(f => f.id === familyId);
      if (family) {
        await setSelectedFamily(family);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to switch family' 
      };
    }
  };
  
  const refreshToken = async (): Promise<boolean> => {
    try {
      await AuthAPI.refreshToken();
      return true;
    } catch {
      return false;
    }
  };
  
  const getInviteInfo = async (token: string): Promise<InviteTokenData | null> => {
    try {
      const response = await AuthAPI.getInviteInfo(token);
      return response.invite;
    } catch {
      return null;
    }
  };
  
  const generateInvite = async (
    roleToAssign: FamilyRole, 
    expiresInHours = 24
  ): Promise<{ success: boolean; inviteToken?: string; error?: string }> => {
    try {
      const response = await AuthAPI.generateInvite(roleToAssign, expiresInHours);
      return { 
        success: true, 
        inviteToken: response.inviteToken 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate invite' 
      };
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        families,
        selectedFamily,
        familyContext,
        login,
        register,
        logout,
        logoutAll,
        setSelectedFamily,
        switchFamily,
        refreshToken,
        getInviteInfo,
        generateInvite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useNewAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useNewAuth must be used within a NewAuthProvider');
  }
  return context;
}

// Helper to get permission role for current user
export function usePermissionRole(): PermissionUserRole {
  const { user, familyContext } = useNewAuth();
  
  if (!user) {
    return PermissionUserRole.ADULT_MEMBER; // Default
  }
  
  if (user.globalRole === GlobalRole.SUPER_ADMIN) {
    return PermissionUserRole.SUPER_ADMIN;
  }
  
  if (familyContext) {
    return mapFamilyRoleToPermission(familyContext.userRole);
  }
  
  return mapGlobalRoleToPermission(user.globalRole);
}