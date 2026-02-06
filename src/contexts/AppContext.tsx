import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth, UserRole } from './AuthContext';
import { apiClient } from '@/lib/api';

type UXMode = 'simple' | 'fast';

interface Family {
  id: string;
  name: string;
  memberCount: number;
}

interface AppContextType {
  mode: UXMode;
  setMode: (mode: UXMode) => void;
  canChangeMode: boolean; // Whether user can change UI mode
  currentFamily: Family;
  setCurrentFamily: (family: Family) => void;
  families: Family[];
  setFamilies: (families: Family[]) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  // Onboarding state
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  // Hints state
  dismissedHints: string[];
  dismissHint: (hintId: string) => void;
  resetHints: () => void;
  // Mode selection tracking
  isModeSelected: boolean;
  setModeSelected: (selected: boolean) => void;
}

const ONBOARDING_KEY = 'kutumbos_onboarding_complete';
const DISMISSED_HINTS_KEY = 'kutumbos_dismissed_hints';
const MODE_SELECTED_KEY = 'kutumbos_mode_selected';

// Determine if user can change UI mode based on role
const canUserChangeMode = (role: UserRole | undefined): boolean => {
  if (!role) return false;
  
  // These roles are forced into Simple Mode
  const forcedSimpleRoles: UserRole[] = ['SENIOR', 'TEEN', 'CHILD', 'EMERGENCY'];
  return !forcedSimpleRoles.includes(role);
};

// Determine default mode based on user role
const getDefaultModeForRole = (role: UserRole | undefined): UXMode => {
  if (!role) return 'simple';
  
  // These roles default to Simple Mode
  const simpleRoles: UserRole[] = ['SENIOR', 'TEEN', 'CHILD', 'EMERGENCY'];
  return simpleRoles.includes(role) ? 'simple' : 'fast';
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, selectedFamily } = useAuth();
  
  // Determine user's role in current family
  const userRole = selectedFamily?.role || (user?.globalRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' as UserRole : undefined);
  
  const [mode, setModeState] = useState<UXMode>(() => {
    // Check if user can change mode
    if (!canUserChangeMode(userRole)) {
      return getDefaultModeForRole(userRole);
    }
    
    // For users who can change mode, check localStorage
    const stored = localStorage.getItem('kutumbos_mode');
    return (stored as UXMode) || getDefaultModeForRole(userRole);
  });

  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family>(() => {
    if (selectedFamily) {
      return {
        id: selectedFamily.id,
        name: selectedFamily.name,
        memberCount: 0 // Will be updated when families are loaded
      };
    }
    return { id: '', name: '', memberCount: 0 };
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // On smaller screens we start with the sidebar closed so it doesn't block content.
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });
  
  // Mode selected state - reactive version
  const [isModeSelected, setIsModeSelectedState] = useState(() => {
    const stored = localStorage.getItem(MODE_SELECTED_KEY);
    return stored === 'true';
  });
  
  // Onboarding state - check localStorage
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    return stored === 'true';
  });
  
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    return stored !== 'true'; // Show if not completed
  });
  
  // Dismissed hints state
  const [dismissedHints, setDismissedHints] = useState<string[]>(() => {
    const stored = localStorage.getItem(DISMISSED_HINTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Enforce mode based on user role
  useEffect(() => {
    if (userRole) {
      const canChange = canUserChangeMode(userRole);
      if (!canChange) {
        const requiredMode = getDefaultModeForRole(userRole);
        if (mode !== requiredMode) {
          setModeState(requiredMode);
        }
      }
    }
  }, [userRole, mode]);

  // Wrapper to persist mode selection (only if user can change mode)
  const setMode = useCallback((newMode: UXMode) => {
    if (!canUserChangeMode(userRole)) {
      console.warn('User role does not allow mode changes');
      return;
    }
    
    setModeState(newMode);
    localStorage.setItem('kutumbos_mode', newMode);
  }, [userRole]);

  // Wrapper to persist mode selected state
  const setModeSelected = useCallback((selected: boolean) => {
    setIsModeSelectedState(selected);
    localStorage.setItem(MODE_SELECTED_KEY, String(selected));
  }, []);

  // Persist onboarding completion
  useEffect(() => {
    localStorage.setItem(ONBOARDING_KEY, String(hasCompletedOnboarding));
  }, [hasCompletedOnboarding]);

  // Persist dismissed hints
  useEffect(() => {
    localStorage.setItem(DISMISSED_HINTS_KEY, JSON.stringify(dismissedHints));
  }, [dismissedHints]);

  const dismissHint = (hintId: string) => {
    setDismissedHints((prev) => [...prev, hintId]);
  };

  const resetHints = () => {
    setDismissedHints([]);
    localStorage.removeItem(DISMISSED_HINTS_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        canChangeMode: canUserChangeMode(userRole),
        currentFamily,
        setCurrentFamily,
        families,
        setFamilies,
        sidebarCollapsed,
        setSidebarCollapsed,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        showOnboarding,
        setShowOnboarding,
        dismissedHints,
        dismissHint,
        resetHints,
        isModeSelected,
        setModeSelected,
      }}
    >
      <div className={mode === 'simple' ? 'mode-simple' : 'mode-fast'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
