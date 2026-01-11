import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'member';

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  selectedFamily: Family | null;
  setSelectedFamily: (family: Family) => void;
}

// Dummy users for demonstration
const dummyUsers: { email: string; password: string; user: User }[] = [
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = dummyUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.user);
      localStorage.setItem('kutumbos_user', JSON.stringify(foundUser.user));
      
      // Auto-select family if only one
      if (foundUser.user.families.length === 1) {
        setSelectedFamily(foundUser.user.families[0]);
        localStorage.setItem('kutumbos_selected_family', JSON.stringify(foundUser.user.families[0]));
      }
      
      return { success: true };
    }

    return { success: false, error: 'Incorrect details. Please try again.' };
  };

  const logout = () => {
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
