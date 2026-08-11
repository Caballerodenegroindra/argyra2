'use client';

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth';

import { auth } from '@/firebase/config';
import { createUserProfile } from '@/services/users';

/** Registro: crea la cuenta, el perfil en Firestore y la cookie de sesion. */
export async function registerUser(input: {
  nick: string;
  email: string;
  whatsapp: string;
  password: string;
}): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);

  await createUserProfile({
    uid: credential.user.uid,
    nick: input.nick,
    email: input.email,
    whatsapp: input.whatsapp,
  });

  await openSession();
  return credential;
}

export async function login(email: string, password: string): Promise<UserCredential> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await openSession();
  return credential;
}

export async function logout(): Promise<void> {
  await fetch('/api/session', { method: 'DELETE' });
  await signOut(auth);
}

export async function recoverPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/** Cambia el ID token por una cookie httpOnly que el middleware puede leer. */
export async function openSession(): Promise<void> {
  const idToken = await auth.currentUser?.getIdToken(true);
  if (!idToken) return;

  await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}
