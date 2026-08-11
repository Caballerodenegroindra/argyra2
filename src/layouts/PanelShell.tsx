'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

/** Marco compartido por el panel de usuario y el de administración. */
export function PanelShell({
  title,
  description,
  tabs,
  children,
}: {
  title: string;
  description?: string;
  tabs?: { href: string; label: string }[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-xl text-sm text-muted">{description}</p> : null}

      {tabs?.length ? (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cx(
                'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
                pathname === tab.href
                  ? 'border-accent/60 bg-accent-soft/40 text-silver'
                  : 'border-edge text-muted hover:text-silver',
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8">{children}</div>
    </div>
  );
}
