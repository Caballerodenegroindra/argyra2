'use client';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { storage } from '@/firebase/config';
import { setCommunityLogo } from '@/services/communities';
import { updateUserProfile } from '@/services/users';

const MAX_BYTES = 3 * 1024 * 1024;

function assertImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('La imagen no puede pesar más de 3 MB.');
  }
}

/** Sube el logo de la comunidad y guarda la URL en el documento. */
export async function uploadCommunityLogo(communityId: string, file: File): Promise<string> {
  assertImage(file);

  const extension = file.name.split('.').pop() ?? 'jpg';
  const fileRef = ref(storage, `communities/${communityId}/logo.${extension}`);

  await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(fileRef);

  await setCommunityLogo(communityId, url);
  return url;
}

export async function uploadUserAvatar(uid: string, file: File): Promise<string> {
  assertImage(file);

  const extension = file.name.split('.').pop() ?? 'jpg';
  const fileRef = ref(storage, `users/${uid}/avatar.${extension}`);

  await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(fileRef);

  await updateUserProfile(uid, { photoUrl: url });
  return url;
}
