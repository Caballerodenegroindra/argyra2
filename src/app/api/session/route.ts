import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/firebase/collections';
import { adminAuth } from '@/firebase/admin';

const FIVE_DAYS = 60 * 60 * 24 * 5;

/** Crea la cookie de sesion a partir del ID token del cliente. */
export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: 'Falta el token de acceso.' }, { status: 400 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS * 1000,
    });

    (await cookies()).set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: FIVE_DAYS,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo iniciar la sesión.' }, { status: 401 });
  }
}

/** Cierra la sesion del navegador. */
export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
