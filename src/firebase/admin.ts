import 'server-only';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Admin SDK: solo servidor. Se usa para verificar la cookie de sesion
 * y para operaciones privilegiadas del panel de administracion.
 */
function initAdmin(): App {
  if (getApps().length) return getApp();

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error(
      'Faltan credenciales del Admin SDK. Revisa FIREBASE_ADMIN_CLIENT_EMAIL y FIREBASE_ADMIN_PRIVATE_KEY en .env.local',
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const adminApp = initAdmin();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
