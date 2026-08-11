'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCommunity } from '@/hooks/useCommunity';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { PanelShell } from '@/layouts/PanelShell';
import { submitImprovementSelection } from '@/services/communities';
import { IMPROVEMENT_AREAS, IMPROVEMENT_AREA_LABELS, type ImprovementArea } from '@/types';

export default function SelectImprovementsPage() {
  useRequireAuth();
  const router = useRouter();
  const { community, loading, reload } = useCommunity();
  const [selected, setSelected] = useState<ImprovementArea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggle(area: ImprovementArea) {
    setSelected((current) =>
      current.includes(area) ? current.filter((a) => a !== area) : [...current, area],
    );
  }

  async function onSubmit() {
    if (!community) return;
    setSaving(true);
    setError(null);
    try {
      await submitImprovementSelection(community.id, selected);
      await reload();
      router.push('/panel');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar la selección.',
      );
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted">Cargando…</p>;
  }

  if (community?.selectedImprovements.length) {
    return (
      <PanelShell title="Áreas de mejora">
        <Card>
          <p className="text-silver">Ya enviaste tu selección.</p>
          <p className="mt-2 text-sm text-muted">
            La selección se hace una sola vez. Si necesitas cambiarla, escríbelo en el grupo
            oficial y el equipo lo revisa contigo.
          </p>
        </Card>
      </PanelShell>
    );
  }

  return (
    <PanelShell
      title="Áreas de mejora"
      description="Elige en qué necesitas ayuda. Esta selección se envía una sola vez y después no se puede modificar."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {IMPROVEMENT_AREAS.map((area) => {
          const checked = selected.includes(area);
          return (
            <li key={area}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  checked ? 'border-accent/60 bg-accent-soft/30' : 'border-edge bg-surface'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(area)}
                  className="h-5 w-5 accent-[#7e8cff]"
                />
                <span className="text-sm text-silver">{IMPROVEMENT_AREA_LABELS[area]}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p className="mt-4 text-sm text-state-stop" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        className="mt-6"
        disabled={selected.length === 0 || saving}
        onClick={() => void onSubmit()}
      >
        {saving ? 'Enviando…' : `Enviar selección (${selected.length})`}
      </Button>
      <p className="mt-3 text-xs text-muted">Al enviar, la selección queda cerrada.</p>
    </PanelShell>
  );
}
