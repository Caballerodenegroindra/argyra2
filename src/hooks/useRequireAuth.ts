'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

/**
 * Guarda de cliente para paginas privadas. El middleware ya bloquea la ruta;
 * esto evita el parpadeo de contenido mientras carga la sesion.
 */
export function useRequireAuth(options: { adminOnly?: boolean } = {}) {
  const { account, profile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!account) {
      router.replace('/ingresar');
      return;
    }
    if (options.adminOnly && !isAdmin) {
      router.replace('/panel');
    }
  }, [account, loading, isAdmin, options.adminOnly, router]);

  return { account, profile, loading, isAdmin };
}
