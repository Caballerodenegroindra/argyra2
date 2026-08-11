'use client';

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { COLLECTIONS } from '@/firebase/collections';
import { db } from '@/firebase/config';
import type { RequestStatus, SupportRequest } from '@/types';

export async function createRequest(input: {
  userId: string;
  communityId: string;
  notes?: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.requests), {
    userId: input.userId,
    communityId: input.communityId,
    status: 'pending' satisfies RequestStatus,
    notes: input.notes ?? '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listRequests(status?: RequestStatus): Promise<SupportRequest[]> {
  const base = collection(db, COLLECTIONS.requests);
  const q = status
    ? query(base, where('status', '==', status), orderBy('createdAt', 'desc'))
    : query(base, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as SupportRequest);
}

/** Comentarios del equipo hacia el solicitante, en vivo dentro de su panel. */
export function watchUserRequests(
  userId: string,
  callback: (items: SupportRequest[]) => void,
) {
  const q = query(collection(db, COLLECTIONS.requests), where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as SupportRequest));
  });
}

export async function getRequestByCommunity(
  communityId: string,
): Promise<SupportRequest | null> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.requests), where('communityId', '==', communityId)),
  );
  const first = snapshot.docs[0];
  return first ? ({ id: first.id, ...first.data() } as SupportRequest) : null;
}

export async function resolveRequest(
  id: string,
  status: RequestStatus,
  notes?: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.requests, id), {
    status,
    ...(notes !== undefined ? { notes } : {}),
  });
}

/** Deja un comentario visible para el solicitante. */
export async function setRequestNotes(id: string, notes: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.requests, id), { notes });
}
