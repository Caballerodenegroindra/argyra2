'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PanelShell } from '@/layouts/PanelShell';
import { ADMIN_TABS } from '@/lib/nav';
import {
  setCommunityStatus,
  updateCommunityInfo,
  verifyCommunityAdmin,
  watchAllCommunities,
} from '@/services/communities';
import { getRequestByCommunity, setRequestNotes } from '@/services/requests';
import {
  COMMUNITY_STATUS_LABELS,
  IMPROVEMENT_AREA_LABELS,
  type Community,
  type CommunityStatus,
} from '@/types';

const FLOW: CommunityStatus[] = ['waiting', 'verifying', 'approved', 'in_progress', 'completed'];

function CommunityCard({ community }: { community: Community }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(community.communityName);
  const [nick, setNick] = useState(community.ownerNick);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);

  useEffect(() => {
    void getRequestByCommunity(community.id).then((request) => {
      setNote(request?.notes ?? '');
      setLoadingNote(false);
    });
  }, [community.id]);

  async function saveNote() {
    const request = await getRequestByCommunity(community.id);
    if (!request) return;
    await setRequestNotes(request.id, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  }

  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-silver">{community.communityName}</p>
          <p className="mt-0.5 text-xs text-muted">Administra: {community.ownerNick || '—'}</p>
          <p className="mt-0.5 font-mono text-[11px] break-all text-muted">
            {community.ownerUid}
          </p>
        </div>
        <StatusBadge status={community.status} />
      </div>

      <div className="mt-4">
        <ProgressBar value={community.progress ?? 0} label="Progreso" />
      </div>

      {community.selectedImprovements?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {community.selectedImprovements.map((area) => (
            <li
              key={area}
              className="rounded-full border border-edge px-3 py-1 text-[11px] text-silver"
            >
              {IMPROVEMENT_AREA_LABELS[area]}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-xs text-muted">Áreas sin elegir.</p>
      )}

      {editing ? (
        <div className="mt-4 grid gap-3">
          <Field label="Nombre de la comunidad">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Nick del administrador">
            <Input value={nick} onChange={(event) => setNick(event.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button
              className="px-4 py-2 text-xs"
              onClick={async () => {
                await updateCommunityInfo(community.id, {
                  communityName: name.trim(),
                  ownerNick: nick.trim(),
                });
                setEditing(false);
              }}
            >
              Guardar cambios
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
          <Button
            variant="secondary"
            className="px-4 py-2 text-xs"
            onClick={() => void verifyCommunityAdmin(community.id, !community.isAdminVerified)}
          >
            {community.isAdminVerified ? 'Quitar verificación' : 'Confirmar que administra'}
          </Button>

          {FLOW.filter((status) => status !== community.status).map((status) => (
            <Button
              key={status}
              variant="secondary"
              className="px-4 py-2 text-xs"
              onClick={() => void setCommunityStatus(community.id, status)}
            >
              {COMMUNITY_STATUS_LABELS[status]}
            </Button>
          ))}

          <Button
            variant="secondary"
            className="px-4 py-2 text-xs"
            onClick={() => setEditing(true)}
          >
            Editar datos
          </Button>
        </div>
      )}

      <div className="mt-5 border-t border-edge pt-4">
        <label className="text-xs text-muted" htmlFor={`note-${community.id}`}>
          Comentario para el solicitante
        </label>
        <textarea
          id={`note-${community.id}`}
          value={note}
          disabled={loadingNote}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Lo que escribas aquí aparece en el panel del usuario."
          className="mt-2 w-full rounded-xl border border-edge bg-raise px-4 py-3 text-sm text-silver placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
        <Button className="mt-2 px-4 py-2 text-xs" onClick={() => void saveNote()}>
          {noteSaved ? 'Comentario guardado' : 'Guardar comentario'}
        </Button>
      </div>
    </li>
  );
}

export default function AdminCommunitiesPage() {
  const [items, setItems] = useState<Community[] | null>(null);

  useEffect(() => watchAllCommunities(setItems), []);

  return (
    <PanelShell
      title="Gestión de comunidades"
      description="Confirma la administración, mueve cada comunidad por el proceso y deja comentarios."
      tabs={ADMIN_TABS}
    >
      {items === null ? (
        <p className="text-sm text-muted">Cargando comunidades…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No hay comunidades registradas.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
