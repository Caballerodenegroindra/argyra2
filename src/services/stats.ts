'use client';

import { collection, getCountFromServer, query, where } from 'firebase/firestore';

import { COLLECTIONS } from '@/firebase/collections';
import { db } from '@/firebase/config';
import type { PlatformStats } from '@/types';

async function count(path: string, field?: string, value?: string): Promise<number> {
  const base = collection(db, path);
  const q = field && value ? query(base, where(field, '==', value)) : query(base);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

/** Agregados del panel de estadisticas. Usa count() para no leer documentos. */
export async function getPlatformStats(): Promise<PlatformStats> {
  const [
    registeredUsers,
    approvedCommunities,
    waitingCommunities,
    inProgressCommunities,
    completedCommunities,
    pendingRequests,
  ] = await Promise.all([
    count(COLLECTIONS.users),
    count(COLLECTIONS.communities, 'status', 'approved'),
    count(COLLECTIONS.communities, 'status', 'waiting'),
    count(COLLECTIONS.communities, 'status', 'in_progress'),
    count(COLLECTIONS.communities, 'status', 'completed'),
    count(COLLECTIONS.requests, 'status', 'pending'),
  ]);

  return {
    registeredUsers,
    approvedCommunities,
    waitingCommunities,
    inProgressCommunities,
    completedCommunities,
    pendingRequests,
  };
}
