'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PanelShell } from '@/layouts/PanelShell';
import { ADMIN_TABS } from '@/lib/nav';
import { formatDate } from '@/lib/utils';
import { listUsers, setUserStatus, updateUserProfile } from '@/services/users';
import type { AppUser, UserStatus } from '@/types';

const ACTIONS: { status: UserStatus; label: string }[] = [
  { status: 'approved', label: 'Aprobar' },
  { status: 'rejected', label: 'Rechazar' },
  { status: 'suspended', label: 'Suspender' },
  { status: 'pending', label: 'Restablecer' },
];

const FILTERS: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'suspended', label: 'Suspendidos' },
];

function UserRow({ user, onChanged }: { user: AppUser; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState(user.nick);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await updateUserProfile(user.uid, { nick: nick.trim(), whatsapp: whatsapp.trim() });
    await onChanged();
    setSaving(false);
    setEditing(false);
  }

  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-silver">{user.nick}</p>
          <p className="mt-0.5 font-mono text-xs break-all text-muted">
            {user.email} · {user.whatsapp}
          </p>
          <p className="mt-0.5 text-xs text-muted">Alta: {formatDate(user.createdAt)}</p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {editing ? (
        <div className="mt-4 grid gap-3">
          <Field label="Nick">
            <Input value={nick} onChange={(event) => setNick(event.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <Input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button className="px-4 py-2 text-xs" disabled={saving} onClick={() => void save()}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-xs"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {ACTIONS.filter((action) => action.status !== user.status).map((action) => (
            <Button
              key={action.status}
              variant="secondary"
              className="px-4 py-2 text-xs"
              onClick={async () => {
                await setUserStatus(user.uid, action.status);
                await onChanged();
              }}
            >
              {action.label}
            </Button>
          ))}
          <Button
            variant="secondary"
            className="px-4 py-2 text-xs"
            onClick={() => setEditing(true)}
          >
            Editar
          </Button>
        </div>
      )}
    </li>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [filter, setFilter] = useState<UserStatus | 'all'>('all');

  const load = useCallback(async () => setUsers(await listUsers()), []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = users?.filter((user) => filter === 'all' || user.status === filter);

  return (
    <PanelShell title="Gestión de usuarios" tabs={ADMIN_TABS}>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${
              filter === option.value
                ? 'border-accent/60 bg-accent-soft/40 text-silver'
                : 'border-edge text-muted hover:text-silver'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {users === null ? (
        <p className="text-sm text-muted">Cargando usuarios…</p>
      ) : !visible?.length ? (
        <p className="text-sm text-muted">No hay usuarios con ese estado.</p>
      ) : (
        <ul className="grid gap-3">
          {visible.map((user) => (
            <UserRow key={user.uid} user={user} onChanged={load} />
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
