'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Field';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PanelShell } from '@/layouts/PanelShell';
import { ADMIN_TABS } from '@/lib/nav';
import { watchAllCommunities } from '@/services/communities';
import {
  assignImprovement,
  completeImprovement,
  createImprovement,
  deleteImprovement,
  updateProgress,
  watchImprovements,
} from '@/services/improvements';
import {
  IMPROVEMENT_STATUS_LABELS,
  type Community,
  type Improvement,
} from '@/types';

function ImprovementCard({ improvement }: { improvement: Improvement }) {
  const [assignee, setAssignee] = useState(improvement.assignedTo ?? '');

  return (
    <li className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm text-silver">{improvement.title}</h3>
        <span className="font-mono text-[11px] text-muted">
          {IMPROVEMENT_STATUS_LABELS[improvement.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{improvement.description}</p>

      <div className="mt-4">
        <ProgressBar value={improvement.progress} />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={improvement.progress}
        onChange={(event) =>
          void updateProgress(improvement.id, improvement.communityId, Number(event.target.value))
        }
        className="mt-3 w-full accent-[#7e8cff]"
        aria-label={`Avance de ${improvement.title}`}
      />

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div className="min-w-[180px] flex-1">
          <Field label="Responsable">
            <Input
              value={assignee}
              placeholder="Nombre del líder a cargo"
              onChange={(event) => setAssignee(event.target.value)}
              onBlur={() => void assignImprovement(improvement.id, assignee.trim())}
            />
          </Field>
        </div>
        <Button
          variant="secondary"
          className="px-4 py-2 text-xs"
          onClick={() => void completeImprovement(improvement.id, improvement.communityId)}
        >
          Marcar completada
        </Button>
        <Button
          variant="ghost"
          className="px-4 py-2 text-xs"
          onClick={() => void deleteImprovement(improvement.id, improvement.communityId)}
        >
          Eliminar
        </Button>
      </div>
    </li>
  );
}

export default function AdminImprovementsPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => watchAllCommunities(setCommunities), []);

  useEffect(() => {
    if (!communityId) {
      setImprovements([]);
      return;
    }
    return watchImprovements(communityId, setImprovements);
  }, [communityId]);

  async function addTask() {
    if (!communityId || !title.trim()) return;
    setSaving(true);
    await createImprovement({
      communityId,
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim(),
    });
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setSaving(false);
  }

  return (
    <PanelShell
      title="Gestión de mejoras"
      description="Crea tareas por comunidad, asigna responsables y registra el avance."
      tabs={ADMIN_TABS}
    >
      <Card>
        <Field label="Comunidad">
          <select
            value={communityId}
            onChange={(event) => setCommunityId(event.target.value)}
            className="w-full rounded-xl border border-edge bg-raise px-4 py-3 text-base text-silver focus:border-accent focus:outline-none"
          >
            <option value="">Elige una comunidad</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.communityName}
              </option>
            ))}
          </select>
        </Field>

        <div className="mt-4 grid gap-4">
          <Field label="Título de la tarea">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field label="Descripción">
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
          <Field label="Responsable">
            <Input
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
            />
          </Field>
          <Button
            disabled={!communityId || !title.trim() || saving}
            onClick={() => void addTask()}
          >
            {saving ? 'Creando…' : 'Crear tarea'}
          </Button>
        </div>
      </Card>

      {communityId && improvements.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Esta comunidad todavía no tiene tareas.</p>
      ) : null}

      {improvements.length ? (
        <ul className="mt-4 grid gap-3">
          {improvements.map((improvement) => (
            <ImprovementCard key={improvement.id} improvement={improvement} />
          ))}
        </ul>
      ) : null}
    </PanelShell>
  );
}
