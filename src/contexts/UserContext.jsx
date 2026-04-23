import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'campusreserve-profile';

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  major: '',
  year: '',
  studentId: '',
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...DEFAULT_PROFILE, ...(stored || {}) };
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = useCallback((next) => {
    setProfile(prev => ({ ...prev, ...next }));
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  const isSignedIn = Boolean(profile.name && profile.email);

  return (
    <UserContext.Provider value={{ profile, updateProfile, clearProfile, isSignedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
