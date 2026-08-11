'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Wordmark } from '@/components/ui/Wordmark';
import { useAuth } from '@/hooks/useAuth';
import { cx } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/solicitar', label: 'Solicitar apoyo' },
  { href: '/lista-de-espera', label: 'Lista de espera' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { account, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Wordmark />

        <nav className="hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                'text-sm transition-colors',
                pathname === link.href ? 'text-silver' : 'text-muted hover:text-silver',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={account ? (isAdmin ? '/admin' : '/panel') : '/ingresar'}
          className="rounded-full border border-edge px-4 py-1.5 text-sm text-silver transition-colors hover:border-accent/60"
        >
          {account ? 'Mi panel' : 'Ingresar'}
        </Link>
      </div>
    </header>
  );
}
