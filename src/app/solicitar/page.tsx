'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const RULES = [
  'Respetar a los miembros.',
  'Proporcionar información real.',
  'Cumplir los acuerdos establecidos.',
];

const PERMISSIONS = [
  'Autorizar la revisión administrativa.',
  'Permitir la verificación del grupo.',
  'Aceptar las condiciones de apoyo.',
];

export default function RulesPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="eyebrow">Paso 1 de 3</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">Reglas y permisos</h1>
      <p className="mt-3 text-muted">
        Antes de continuar, revisa lo que aceptas al pedir acompañamiento.
      </p>

      <div className="mt-8 grid gap-4">
        <Card>
          <h2 className="text-base">Reglas</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {rule}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-base">Permisos</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {PERMISSIONS.map((permission) => (
              <li key={permission} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {permission}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-edge bg-raise p-4">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 h-5 w-5 accent-[#7e8cff]"
        />
        <span className="text-sm text-silver">He leído y acepto las reglas y permisos.</span>
      </label>

      <Button
        className="mt-6 w-full sm:w-auto"
        disabled={!accepted}
        onClick={() => router.push('/solicitar/programa')}
      >
        Continuar
      </Button>
    </div>
  );
}
