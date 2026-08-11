'use client';

import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { PanelShell } from '@/layouts/PanelShell';
import { ADMIN_TABS } from '@/lib/nav';
import { getPlatformStats } from '@/services/stats';
import type { PlatformStats } from '@/types';

const LABELS: Record<keyof PlatformStats, string> = {
  registeredUsers: 'Usuarios registrados',
  approvedCommunities: 'Comunidades aprobadas',
  waitingCommunities: 'Comunidades en espera',
  inProgressCommunities: 'Comunidades en proceso',
  completedCommunities: 'Comunidades finalizadas',
  pendingRequests: 'Solicitudes pendientes',
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    void getPlatformStats().then(setStats);
  }, []);

  return (
    <PanelShell title="Panel de Argyra" tabs={ADMIN_TABS}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(LABELS) as (keyof PlatformStats)[]).map((key) => (
          <Card key={key}>
            <p className="eyebrow">{LABELS[key]}</p>
            <p className="mt-3 font-mono text-3xl text-silver">
              {stats ? stats[key] : '—'}
            </p>
          </Card>
        ))}
      </div>
    </PanelShell>
  );
}
