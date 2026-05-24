'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getStoredSessionUser, subscribeToAuthChanges, type AuthUser } from '../firebase/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdminState, setIsAdminState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateFromSession = async (sessionUser: AuthUser | null) => {
      setUser(sessionUser);

      if (!sessionUser) {
        setIsAdminState(false);
        setLoading(false);
        return;
      }

      setIsAdminState(sessionUser.isAdmin);
      setLoading(false);
    };

    void hydrateFromSession(getStoredSessionUser());

    const unsubscribe = subscribeToAuthChanges((sessionUser) => {
      void hydrateFromSession(sessionUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: isAdminState, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
