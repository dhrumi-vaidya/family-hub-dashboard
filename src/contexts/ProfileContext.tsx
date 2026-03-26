import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  name: string;
  photoUrl: string; // base64 or object URL
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: (data: Partial<ProfileData>) => void;
}

const STORAGE_KEY = 'kutumbos_profile';

function loadProfile(): ProfileData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { name: '', photoUrl: '' };
  } catch {
    return { name: '', photoUrl: '' };
  }
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData>(loadProfile);

  const setProfile = (data: Partial<ProfileData>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
