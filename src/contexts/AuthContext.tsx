'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { COLLECTIONS } from '@/firebase/collections';
import { auth, db } from '@/firebase/config';
import type { AppUser } from '@/types';

export interface AuthContextValue {
  /** Cuenta de Firebase Authentication. */
  account: User | null;
  /** Documento del usuario en Firestore (rol, estado, nick). */
  profile: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  account: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isApproved: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAccount(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!account) return;

    // El perfil se escucha en vivo: si el equipo aprueba al usuario,
    // su panel cambia sin necesidad de recargar.
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.users, account.uid),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as AppUser) : null);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return unsubscribe;
  }, [account]);

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      isApproved: profile?.status === 'approved',
    }),
    [account, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
