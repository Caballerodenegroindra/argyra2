'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { COLLECTIONS } from '@/firebase/collections';
import { db } from '@/firebase/config';
import { setCommunityProgress } from '@/services/communities';
import type { Improvement, ImprovementStatus } from '@/types';

export async function createImprovement(input: {
  communityId: string;
  title: string;
  description: string;
  assignedTo?: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.improvements), {
    communityId: input.communityId,
    title: input.title,
    description: input.description,
    assignedTo: input.assignedTo ?? '',
    progress: 0,
    status: 'pending' satisfies ImprovementStatus,
    updatedAt: serverTimestamp(),
  });

  await syncCommunityProgress(input.communityId);
  return ref.id;
}

/** El panel del usuario y el del equipo escuchan los mismos avances. */
export function watchImprovements(
  communityId: string,
  callback: (items: Improvement[]) => void,
) {
  const q = query(
    collection(db, COLLECTIONS.improvements),
    where('communityId', '==', communityId),
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Improvement));
  });
}

/**
 * Copia el promedio de avance al documento de la comunidad. La lista de espera
 * es publica y no puede leer las tareas, asi que el numero viaja con la comunidad.
 */
export async function syncCommunityProgress(communityId: string): Promise<void> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.improvements), where('communityId', '==', communityId)),
  );

  if (snapshot.empty) {
    await setCommunityProgress(communityId, 0);
    return;
  }

  const total = snapshot.docs.reduce((sum, d) => sum + (d.data().progress as number), 0);
  await setCommunityProgress(communityId, total / snapshot.size);
}

export async function updateProgress(
  id: string,
  communityId: string,
  progress: number,
): Promise<void> {
  const value = Math.max(0, Math.min(100, Math.round(progress)));

  await updateDoc(doc(db, COLLECTIONS.improvements, id), {
    progress: value,
    status: value === 0 ? 'pending' : value === 100 ? 'completed' : 'in_progress',
    updatedAt: serverTimestamp(),
  });

  await syncCommunityProgress(communityId);
}

/** Marcar completada de un toque, sin arrastrar el control deslizante. */
export async function completeImprovement(id: string, communityId: string): Promise<void> {
  await updateProgress(id, communityId, 100);
}

export async function assignImprovement(id: string, assignedTo: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.improvements, id), {
    assignedTo,
    updatedAt: serverTimestamp(),
  });
}

export async function updateImprovementInfo(
  id: string,
  data: Partial<Pick<Improvement, 'title' | 'description'>>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.improvements, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteImprovement(id: string, communityId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.improvements, id));
  await syncCommunityProgress(communityId);
}
