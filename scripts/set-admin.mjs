/**
 * Convierte a un usuario ya registrado en administrador de Argyra.
 *
 *   node scripts/set-admin.mjs correo@ejemplo.com
 *
 * Lee las credenciales del Admin SDK desde .env.local.
 */
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function loadEnv() {
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) process.env[match[1]] ??= match[2].replace(/^"|"$/g, '');
    }
  } catch {
    console.error('No se encontró .env.local en la raíz del proyecto.');
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/set-admin.mjs correo@ejemplo.com');
  process.exit(1);
}

loadEnv();

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const user = await getAuth().getUserByEmail(email);

await getFirestore().collection('users').doc(user.uid).update({
  role: 'admin',
  status: 'approved',
});

console.log(`Listo: ${email} ahora es administrador (uid ${user.uid}).`);
