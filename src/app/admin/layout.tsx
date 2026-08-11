import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { requireAdmin } from '@/lib/session';

/**
 * Puerta del panel de administración: el rol se verifica en el servidor
 * con el Admin SDK, no en el navegador.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect('/panel');

  return <>{children}</>;
}
