import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IMPROVEMENT_AREA_LABELS, IMPROVEMENT_AREAS } from '@/types';

export const metadata = { title: 'Información del programa' };

const REQUIREMENTS = [
  'Ser administrador de un grupo o comunidad.',
  'Verificar la administración con el equipo de Argyra.',
  'Coordinar el proceso con los líderes.',
  'Seleccionar las áreas donde necesitas ayuda.',
];

export default function ProgramPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="eyebrow">Paso 2 de 3</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">Información del programa</h1>
      <p className="mt-3 text-muted">
        Así funciona el acompañamiento y esto es lo que necesitas para entrar.
      </p>

      <Card className="mt-8">
        <h2 className="text-base">Requisitos para recibir apoyo</h2>
        <ol className="mt-4 grid gap-3">
          {REQUIREMENTS.map((requirement, index) => (
            <li key={requirement} className="flex gap-4 text-sm text-muted">
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {requirement}
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mt-4">
        <h2 className="text-base">Áreas disponibles</h2>
        <p className="mt-2 text-sm text-muted">
          Elegirás entre estas cuando tu comunidad quede habilitada.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {IMPROVEMENT_AREAS.map((area) => (
            <li
              key={area}
              className="rounded-full border border-edge px-3 py-1.5 text-sm text-silver"
            >
              {IMPROVEMENT_AREA_LABELS[area]}
            </li>
          ))}
        </ul>
      </Card>

      <ButtonLink href="/registro" className="mt-8 w-full sm:w-auto">
        Acepto y deseo registrarme
      </ButtonLink>
    </div>
  );
}
