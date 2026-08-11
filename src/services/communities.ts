'use client';

import {
  addDoc,
  collection,
  doc,
  getDoc,
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
import type { Community, CommunityStatus, ImprovementArea } from '@/types';

export async function createCommunity(input: {
  ownerUid: string;
  ownerNick: string;
  communityName: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.communities), {
    ownerUid: input.ownerUid,
    ownerNick: input.ownerNick,
    communityName: input.communityName,
    isAdminVerified: false,
    status: 'waiting' satisfies CommunityStatus,
    selectedImprovements: [],
    progress: 0,
    logoUrl: '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getCommunity(id: string): Promise<Community | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.communities, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Community) : null;
}

export async function getCommunityByOwner(ownerUid: string): Promise<Community | null> {
  const q = query(collection(db, COLLECTIONS.communities), where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(q);
  const first = snapshot.docs[0];
  return first ? ({ id: first.id, ...first.data() } as Community) : null;
}

/** Lista de espera publica: todo lo que ya paso la verificacion. */
export function watchWaitingList(callback: (items: Community[]) => void) {
  const q = query(
    collection(db, COLLECTIONS.communities),
    where('status', 'in', ['verifying', 'approved', 'in_progress', 'completed']),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Community));
  });
}

/** Vista del equipo: incluye tambien las comunidades que siguen en espera. */
export function watchAllCommunities(callback: (items: Community[]) => void) {
  const q = query(collection(db, COLLECTIONS.communities), orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Community));
  });
}

export async function setCommunityStatus(id: string, status: CommunityStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communities, id), { status });
}

export async function verifyCommunityAdmin(id: string, verified: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communities, id), { isAdminVerified: verified });
}

/** Edicion de datos de la comunidad. Solo administradores. */
export async function updateCommunityInfo(
  id: string,
  data: Partial<Pick<Community, 'communityName' | 'ownerNick'>>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communities, id), data);
}

/** El dueno puede cambiar el logo sin tocar el resto del documento. */
export async function setCommunityLogo(id: string, logoUrl: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communities, id), { logoUrl });
}

/** Avance general, recalculado por el equipo al mover una tarea. */
export async function setCommunityProgress(id: string, progress: number): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.communities, id), {
    progress: Math.max(0, Math.min(100, Math.round(progress))),
  });
}

/**
 * Seleccion de mejoras. Se permite una unica vez: si el arreglo ya tiene
 * elementos la operacion se rechaza aqui y tambien en las reglas de Firestore.
 */
export async function submitImprovementSelection(
  id: string,
  areas: ImprovementArea[],
): Promise<void> {
  const community = await getCommunity(id);
  if (!community) throw new Error('La comunidad no existe.');
  if (community.selectedImprovements.length > 0) {
    throw new Error('Ya enviaste tu selección y no se puede modificar.');
  }
  if (areas.length === 0) {
    throw new Error('Elige al menos un área.');
  }
  await updateDoc(doc(db, COLLECTIONS.communities, id), { selectedImprovements: areas });
}
