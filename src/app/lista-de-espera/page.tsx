'use client';

import { useEffect, useState } from 'react';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { watchWaitingList } from '@/services/communities';
import type { Community } from '@/types';

export default function WaitingListPage() {
  const [items, setItems] = useState<Community[] | null>(null);

  useEffect(() => watchWaitingList(setItems), []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="eyebrow">Lista pública</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">Lista de espera</h1>
      <p className="mt-3 text-muted">
        Comunidades verificadas, en el orden en que entraron al programa.
      </p>

      {items === null ? (
        <p className="mt-10 text-sm text-muted">Cargando comunidades…</p>
      ) : items.length === 0 ? (
        <div className="card mt-10 p-8 text-center">
          <p className="text-silver">Todavía no hay comunidades en la lista.</p>
          <p className="mt-2 text-sm text-muted">
            La tuya puede ser la primera: envía tu solicitud y verifica tu grupo.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {items.map((community, index) => (
            <li key={community.id} className="card p-4">
              <div className="flex items-start gap-4">
                <span className="mt-1 font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="truncate text-silver">{community.communityName}</p>
                    <StatusBadge status={community.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    Administra: {community.ownerNick || '—'}
                  </p>
                  <div className="mt-3">
                    <ProgressBar value={community.progress ?? 0} label="Progreso" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
