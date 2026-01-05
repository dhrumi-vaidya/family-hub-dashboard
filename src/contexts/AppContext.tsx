import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const defaultFamilies: Family[] = [
  { id: '1', name: 'Sharma Family', memberCount: 8 },
  { id: '2', name: 'Gupta Family', memberCount: 5 },
  { id: '3', name: 'Patel Family', memberCount: 12 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UXMode>('simple');
  const [currentFamily, setCurrentFamily] = useState<Family>(defaultFamilies[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
