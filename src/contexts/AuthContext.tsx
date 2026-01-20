import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

export type UserRole = 'admin' | 'member' | 'super_admin';

export interface Family {
  id: string;
  name: string;
  memberCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  families: Family[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  selectedFamily: Family | null;
  setSelectedFamily: (family: Family) => void;
}

// Dummy users for demonstration
const dummyUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'super.admin@kutumb.com',
    password: 'Qwerty@123',
    user: {
      id: '0',
      name: 'System Administrator',
      email: 'super.admin@kutumb.com',
      role: 'super_admin',
      families: [],
    },
  },
  {
    email: 'rahul@sharma.com',
    password: 'password123',
    user: {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@sharma.com',
      role: 'admin',
      families: [
        { id: '1', name: 'Sharma Family', memberCount: 8 },
        { id: '2', name: 'Verma Family', memberCount: 5 },
      ],
    },
  },
  {
    email: 'sunita@sharma.com',
    password: 'password123',
    user: {
      id: '2',
      name: 'Sunita Sharma',
      email: 'sunita@sharma.com',
      role: 'member',
      families: [{ id: '1', name: 'Sharma Family', memberCount: 8 }],
    },
  },
  {
    email: '9876543210',
    password: 'password123',
    user: {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@sharma.com',
      role: 'admin',
      families: [
        { id: '1', name: 'Sharma Family', memberCount: 8 },
        { id: '2', name: 'Verma Family', memberCount: 5 },
      ],
    },
  },
  {
    email: '9876543211',
    password: 'password123',
    user: {
      id: '2',
      name: 'Sunita Sharma',
      email: 'sunita@sharma.com',
      role: 'member',
      families: [{ id: '1', name: 'Sharma Family', memberCount: 8 }],
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('kutumbos_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(() => {
    const stored = localStorage.getItem('kutumbos_selected_family');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('kutumbos_user', JSON.stringify(response.user));
        
        // Auto-select family if only one (but not for super admin)
        if (response.user.role !== 'super_admin' && response.user.families.length === 1) {
          setSelectedFamily(response.user.families[0]);
          localStorage.setItem('kutumbos_selected_family', JSON.stringify(response.user.families[0]));
        }
        
        return { success: true, user: response.user };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setSelectedFamily(null);
    localStorage.removeItem('kutumbos_user');
    localStorage.removeItem('kutumbos_selected_family');
    localStorage.removeItem('kutumbos_mode_selected');
  };

  const handleSetSelectedFamily = (family: Family) => {
    setSelectedFamily(family);
    localStorage.setItem('kutumbos_selected_family', JSON.stringify(family));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        selectedFamily,
        setSelectedFamily: handleSetSelectedFamily,
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
