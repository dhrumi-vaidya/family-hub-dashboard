// API client for KutumbOS backend with secure token handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: T;
  accessToken?: string;
  refreshToken?: string;
  families?: T[];
  error?: string;
  code?: string;
  details?: string[];
}

// Token storage utilities (matching AuthContext)
class TokenStorage {
  private static accessToken: string | null = null;

  static setAccessToken(token: string) {
    this.accessToken = token;
  }

  static getAccessToken(): string | null {
    return this.accessToken;
  }

  static clearAccessToken() {
    this.accessToken = null;
  }
}

class ApiClient {
  private baseURL: string;
  private selectedFamilyId: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setFamilyContext(familyId: string | null) {
    this.selectedFamilyId = familyId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add access token if available
    const token = TokenStorage.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Add family context header if available
    if (this.selectedFamilyId) {
      headers['X-Family-ID'] = this.selectedFamilyId;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for refresh token
      });

      const data = await response.json();

      // Handle token refresh on 401
      if (response.status === 401 && data.code === 'TOKEN_INVALID') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          const newToken = TokenStorage.getAccessToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
              credentials: 'include',
            });
            return retryResponse.json();
          }
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      // Don't log 401 errors for refresh token endpoint as they're expected
      if (!(endpoint === '/auth/refresh' && error instanceof Error && error.message.includes('401'))) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.accessToken) {
      TokenStorage.setAccessToken(response.accessToken);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({}), // Empty body, refresh token comes from cookie
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      TokenStorage.clearAccessToken();
    }
  }

  async refreshToken() {
    try {
      // Don't send refresh token in body - it should come from HttpOnly cookie
      const response = await this.request<any>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({}), // Empty body, token comes from cookie
      });

      if (response.success && response.accessToken) {
        TokenStorage.setAccessToken(response.accessToken);
        return true;
      }
      return false;
    } catch (error: any) {
      // Don't log refresh failures as errors if it's just missing token or unauthorized
      if (!error.message.includes('Refresh token not found') && !error.message.includes('Unauthorized')) {
        console.error('Token refresh failed:', error);
      }
      TokenStorage.clearAccessToken();
      return false;
    }
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async getUserFamilies() {
    return this.request<any>('/auth/families');
  }

  async validateFamilyContext(familyId: string) {
    return this.request<any>('/auth/validate-family', {
      method: 'POST',
      body: JSON.stringify({ familyId }),
    });
  }

  async switchFamily(familyId: string) {
    return this.request<any>('/auth/switch-family', {
      method: 'POST',
      body: JSON.stringify({ familyId }),
    });
  }

  async generateInvite(roleToAssign: string, expiresInHours: number = 24, recipientEmail?: string) {
    return this.request<any>('/auth/generate-invite', {
      method: 'POST',
      body: JSON.stringify({ roleToAssign, expiresInHours, recipientEmail }),
    });
  }

  async getInviteInfo(token: string) {
    return this.request<any>(`/auth/invite/${token}`);
  }

  async register(email: string, password: string, familyName?: string, inviteToken?: string) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, familyName, inviteToken }),
    });
  }

  async changeUserRole(targetUserId: string, newRole: string) {
    return this.request<any>('/auth/change-role', {
      method: 'POST',
      body: JSON.stringify({ targetUserId, newRole }),
    });
  }

  async getAuditLogs(limit: number = 50, action?: string) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (action) params.append('action', action);
    
    return this.request<any>(`/auth/audit-logs?${params.toString()}`);
  }

  // Health check
  async healthCheck() {
    return this.request<any>('/health');
  }

  // Generic CRUD methods for future modules
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export utilities for use in contexts
export { TokenStorage };

// Export types
export type { ApiResponse };