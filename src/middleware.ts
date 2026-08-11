import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/firebase/collections';

/**
 * Protege las rutas privadas comprobando la cookie de sesion.
 * La verificacion real del token ocurre en el servidor (/api/session)
 * y el rol de administrador se revalida dentro de /admin.
 */
const PROTECTED = ['/panel', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSession = PROTECTED.some((route) => pathname.startsWith(route));

  if (!needsSession) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/ingresar';
    url.searchParams.set('siguiente', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/admin/:path*'],
};
