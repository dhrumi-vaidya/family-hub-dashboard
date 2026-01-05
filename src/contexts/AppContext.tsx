import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UXMode = 'simple' | 'fast';

interface Family {
  id: string;
  name: string;
  memberCount: number;
}

interface AppContextType {
  mode: UXMode;
  setMode: (mode: UXMode) => void;
  currentFamily: Family;
  setCurrentFamily: (family: Family) => void;
  families: Family[];
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
}

const defaultFamilies: Family[] = [
  { id: '1', name: 'Sharma Family', memberCount: 8 },
  { id: '2', name: 'Gupta Family', memberCount: 5 },
  { id: '3', name: 'Patel Family', memberCount: 12 },
];

const ONBOARDING_KEY = 'kutumbos_onboarding_complete';
const DISMISSED_HINTS_KEY = 'kutumbos_dismissed_hints';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UXMode>('simple');
  const [currentFamily, setCurrentFamily] = useState<Family>(defaultFamilies[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
        currentFamily,
        setCurrentFamily,
        families: defaultFamilies,
        sidebarCollapsed,
        setSidebarCollapsed,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        showOnboarding,
        setShowOnboarding,
        dismissedHints,
        dismissHint,
        resetHints,
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
