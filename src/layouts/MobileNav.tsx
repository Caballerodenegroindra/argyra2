'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { cx } from '@/lib/utils';

/** Navegación inferior: el recorrido principal en pantallas de teléfono. */
const TABS = [
  { href: '/', label: 'Inicio' },
  { href: '/solicitar', label: 'Solicitar' },
  { href: '/lista-de-espera', label: 'Espera' },
  { href: '/panel', label: 'Panel' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { account } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-ink/95 backdrop-blur-md sm:hidden">
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const href = tab.href === '/panel' && !account ? '/ingresar' : tab.href;

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex flex-col items-center gap-1 py-3 font-mono text-[11px] tracking-widest uppercase transition-colors',
                  active ? 'text-accent' : 'text-muted',
                )}
              >
                <span
                  className={cx(
                    'h-1 w-1 rounded-full',
                    active ? 'bg-accent' : 'bg-transparent',
                  )}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
