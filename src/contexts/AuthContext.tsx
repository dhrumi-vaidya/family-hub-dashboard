import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient, TokenStorage } from '@/lib/api';

// Updated role system to match backend
export type UserRole = 'FAMILY_ADMIN' | 'ADULT' | 'SENIOR' | 'TEEN' | 'CHILD' | 'EMERGENCY';

export interface Family {
  id: string;
  name: string;
  role: UserRole; // User's role in this family
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  globalRole: 'SUPER_ADMIN' | 'USER';
  createdAt: Date;
  lastLogin: Date | null;
  families: Family[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  selectedFamily: Family | null;
  setSelectedFamily: (family: Family) => void;
  accessToken: string | null;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(() => {
    const stored = localStorage.getItem('kutumbos_selected_family');
    return stored ? JSON.parse(stored) : null;
  });

  // Auto-refresh token on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only try to refresh if we don't already have a user
        if (!user) {
          const refreshed = await apiClient.refreshToken();
          if (refreshed) {
            // Get user profile
            const userResponse = await apiClient.getCurrentUser();
            if (userResponse.success) {
              // Get families
              const familiesResponse = await apiClient.getUserFamilies();
              const userWithFamilies = {
                ...userResponse.user,
                families: familiesResponse.families || []
              };
              setUser(userWithFamilies);
              
              // Restore selected family if valid
              if (selectedFamily) {
                const validFamily = userWithFamilies.families.find((f: Family) => f.id === selectedFamily.id);
                if (validFamily) {
                  setSelectedFamily(validFamily);
                  apiClient.setFamilyContext(validFamily.id);
                } else {
                  setSelectedFamily(null);
                  localStorage.removeItem('kutumbos_selected_family');
                }
              }
            }
          }
        }
      } catch (error) {
        // Silently handle auth initialization failures
        // This is normal for first-time visitors
        setUser(null);
        setSelectedFamily(null);
        localStorage.removeItem('kutumbos_selected_family');
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []); // Remove selectedFamily dependency to avoid loops

  // Update API client family context when family changes
  useEffect(() => {
    if (selectedFamily) {
      apiClient.setFamilyContext(selectedFamily.id);
    } else {
      apiClient.setFamilyContext(null);
    }
  }, [selectedFamily]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await apiClient.login(email, password);

      if (response.success) {
        const userWithFamilies = {
          ...response.user,
          families: response.families || []
        };
        setUser(userWithFamilies);
        
        // Auto-select family if only one (but not for super admin)
        if (response.user.globalRole !== 'SUPER_ADMIN' && response.families.length === 1) {
          setSelectedFamily(response.families[0]);
          localStorage.setItem('kutumbos_selected_family', JSON.stringify(response.families[0]));
        }
        
        return { success: true, user: userWithFamilies };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUser(null);
      setSelectedFamily(null);
      localStorage.removeItem('kutumbos_selected_family');
      localStorage.removeItem('kutumbos_mode_selected');
      apiClient.setFamilyContext(null);
    }
  };

  const refreshTokenFn = async (): Promise<boolean> => {
    return await apiClient.refreshToken();
  };

  const handleSetSelectedFamily = (family: Family) => {
    setSelectedFamily(family);
    localStorage.setItem('kutumbos_selected_family', JSON.stringify(family));
    apiClient.setFamilyContext(family.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        logout,
        selectedFamily,
        setSelectedFamily: handleSetSelectedFamily,
        accessToken: TokenStorage.getAccessToken(),
        refreshToken: refreshTokenFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
