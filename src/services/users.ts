'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { COLLECTIONS } from '@/firebase/collections';
import { db } from '@/firebase/config';
import type { AppUser, UserStatus } from '@/types';

export async function createUserProfile(input: {
  uid: string;
  nick: string;
  email: string;
  whatsapp: string;
}): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.users, input.uid), {
    uid: input.uid,
    nick: input.nick,
    email: input.email,
    whatsapp: input.whatsapp,
    role: 'user',
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.users, uid));
  return snapshot.exists() ? (snapshot.data() as AppUser) : null;
}

export async function listUsers(status?: UserStatus): Promise<AppUser[]> {
  const base = collection(db, COLLECTIONS.users);
  const q = status
    ? query(base, where('status', '==', status), orderBy('createdAt', 'desc'))
    : query(base, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as AppUser);
}

/** Aprobar, rechazar, suspender o restablecer. Solo administradores. */
export async function setUserStatus(uid: string, status: UserStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.users, uid), { status });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<AppUser, 'nick' | 'whatsapp' | 'photoUrl'>>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.users, uid), data);
}
