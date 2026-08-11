import 'server-only';

import { cookies } from 'next/headers';

import { COLLECTIONS, SESSION_COOKIE } from '@/firebase/collections';
import { adminAuth, adminDb } from '@/firebase/admin';
import type { AppUser } from '@/types';

/** Perfil verificado en el servidor. Usar en layouts de rutas privadas. */
export async function getSessionUser(): Promise<AppUser | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    const snapshot = await adminDb.collection(COLLECTIONS.users).doc(decoded.uid).get();
    return snapshot.exists ? (snapshot.data() as AppUser) : null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AppUser | null> {
  const user = await getSessionUser();
  return user?.role === 'admin' ? user : null;
}
