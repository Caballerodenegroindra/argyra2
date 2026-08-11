'use client';

import { useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { whatsappLinks } from '@/lib/utils';

const INSTRUCTIONS = [
  'Menciona tu usuario registrado.',
  'Indica el nombre de tu grupo o comunidad.',
  'Espera la revisión de los líderes.',
  'Completa las verificaciones necesarias.',
];

export default function RequestSentPage() {
  const links = whatsappLinks();
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(links.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="eyebrow">Solicitud enviada</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">Solicitud enviada correctamente</h1>
      <p className="mt-3 text-muted">
        Tu solicitud está pendiente de revisión. Para continuar debes ingresar al grupo
        oficial de WhatsApp de Argyra.
      </p>

      <Card className="mt-8">
        <h2 className="text-base">Grupo oficial</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ButtonLink href={links.standard} target="_blank">
            Unirse con WhatsApp
          </ButtonLink>
          <ButtonLink href={links.business} target="_blank" variant="secondary">
            Unirse con WhatsApp Business
          </ButtonLink>
        </div>
        <button
          onClick={copyLink}
          className="mt-3 w-full rounded-full border border-edge px-5 py-3 text-sm text-muted transition-colors hover:text-silver"
        >
          {copied ? 'Enlace copiado' : 'Copiar enlace'}
        </button>
      </Card>

      <Card className="mt-4">
        <h2 className="text-base">Una vez dentro del grupo</h2>
        <ol className="mt-4 grid gap-3">
          {INSTRUCTIONS.map((instruction, index) => (
            <li key={instruction} className="flex gap-4 text-sm text-muted">
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {instruction}
            </li>
          ))}
        </ol>
      </Card>

      <ButtonLink href="/panel" variant="secondary" className="mt-8">
        Ir a mi panel
      </ButtonLink>
    </div>
  );
}
