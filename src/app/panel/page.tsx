'use client';

import { useEffect, useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/hooks/useCommunity';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { PanelShell } from '@/layouts/PanelShell';
import { formatDate } from '@/lib/utils';
import { logout } from '@/services/auth';
import { watchUserRequests } from '@/services/requests';
import { uploadCommunityLogo } from '@/services/storage';
import {
  IMPROVEMENT_AREA_LABELS,
  IMPROVEMENT_STATUS_LABELS,
  type SupportRequest,
} from '@/types';

const STATUS_MESSAGE: Record<string, string> = {
  pending:
    'Ingresa al grupo de WhatsApp y menciona tu usuario para que el equipo te verifique.',
  approved: 'Tu cuenta está aprobada. Ya puedes avanzar con tu comunidad.',
  rejected: 'Tu solicitud fue rechazada. Escribe en el grupo para conocer los motivos.',
  suspended: 'Tu cuenta está suspendida. Contacta al equipo en el grupo oficial.',
};

export default function UserPanelPage() {
  useRequireAuth();
  const { account, profile, loading } = useAuth();
  const { community, improvements, progress, reload } = useCommunity();
  const [requests, setRequests] = useState<SupportRequest[]>([]);

  useEffect(() => {
    if (!account) return;
    return watchUserRequests(account.uid, setRequests);
  }, [account]);

  if (loading || !profile) {
    return <p className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted">Cargando tu panel…</p>;
  }

  const comments = requests.filter((request) => request.notes.trim().length > 0);

  const canChooseAreas =
    community &&
    community.selectedImprovements.length === 0 &&
    ['approved', 'in_progress'].includes(community.status);

  return (
    <PanelShell title={`Hola, ${profile.nick}`} description="Estado de tu solicitud y avances.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="eyebrow">Tu solicitud</p>
          <div className="mt-3">
            <StatusBadge status={profile.status} />
          </div>
          <p className="mt-3 text-sm text-muted">{STATUS_MESSAGE[profile.status]}</p>
        </Card>

        <Card>
          <p className="eyebrow">Tu comunidad</p>
          {community ? (
            <>
              <p className="mt-3 text-silver">{community.communityName}</p>
              <div className="mt-3">
                <StatusBadge status={community.status} />
              </div>
              <p className="mt-3 text-sm text-muted">
                Administración verificada: {community.isAdminVerified ? 'sí' : 'pendiente'}
              </p>
              <div className="mt-5">
                <ImageUpload
                  label={community.logoUrl ? 'Cambiar logo' : 'Subir logo'}
                  currentUrl={community.logoUrl}
                  onUpload={async (file) => {
                    const url = await uploadCommunityLogo(community.id, file);
                    await reload();
                    return url;
                  }}
                />
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Todavía no registraste una comunidad.</p>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <p className="eyebrow">Progreso general</p>
        <div className="mt-4">
          <ProgressBar value={progress} label="Avance del plan de mejora" />
        </div>

        {community?.selectedImprovements.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {community.selectedImprovements.map((area) => (
              <li
                key={area}
                className="rounded-full border border-edge px-3 py-1.5 text-xs text-silver"
              >
                {IMPROVEMENT_AREA_LABELS[area]}
              </li>
            ))}
          </ul>
        ) : null}

        {canChooseAreas ? (
          <ButtonLink href="/panel/mejoras" className="mt-6">
            Elegir áreas de mejora
          </ButtonLink>
        ) : null}
      </Card>

      <Card className="mt-4">
        <p className="eyebrow">Comentarios del equipo</p>
        {comments.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Sin comentarios por ahora. Aquí verás las respuestas de los líderes de Argyra.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {comments.map((request) => (
              <li
                key={request.id}
                className="border-t border-edge pt-4 first:border-0 first:pt-0"
              >
                <p className="text-sm text-silver">{request.notes}</p>
                <p className="mt-2 font-mono text-xs text-muted">
                  {formatDate(request.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-4">
        <p className="eyebrow">Tareas</p>
        {improvements.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Aún no hay tareas registradas. Aparecerán aquí cuando el equipo arme tu plan.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {improvements.map((improvement) => (
              <li
                key={improvement.id}
                className="border-t border-edge pt-4 first:border-0 first:pt-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm text-silver">{improvement.title}</h3>
                  <span className="font-mono text-[11px] text-muted">
                    {IMPROVEMENT_STATUS_LABELS[improvement.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{improvement.description}</p>
                {improvement.assignedTo ? (
                  <p className="mt-1 text-xs text-muted">
                    Responsable: {improvement.assignedTo}
                  </p>
                ) : null}
                <div className="mt-3">
                  <ProgressBar value={improvement.progress} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <button
        onClick={() => void logout()}
        className="mt-8 text-sm text-muted hover:text-silver"
      >
        Cerrar sesión
      </button>
    </PanelShell>
  );
}
