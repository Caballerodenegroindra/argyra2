import { ButtonLink } from '@/components/ui/Button';
import { Card, CardText, CardTitle } from '@/components/ui/Card';
import { Wordmark } from '@/components/ui/Wordmark';

const AREAS = [
  {
    title: 'Administración',
    text: 'Repartimos roles, ordenamos permisos y dejamos por escrito cómo se toman las decisiones.',
  },
  {
    title: 'Organización',
    text: 'Estructura de canales, temas y horarios para que nadie tenga que adivinar dónde va cada cosa.',
  },
  {
    title: 'Crecimiento',
    text: 'Formas sanas de sumar miembros y de que se queden: bienvenida, actividades y seguimiento.',
  },
  {
    title: 'Automatización',
    text: 'Tareas repetitivas que dejan de hacerse a mano: avisos, bienvenidas y moderación básica.',
  },
  {
    title: 'Diseño',
    text: 'Perfil, descripción e identidad visual para que tu grupo se entienda en cinco segundos.',
  },
  {
    title: 'Estrategias comunitarias',
    text: 'Un plan de mejora con metas claras y avances medibles, revisado junto a tu equipo.',
  },
];

const STEPS = [
  { n: '01', title: 'Reglas y permisos', text: 'Aceptas las condiciones del acompañamiento.' },
  { n: '02', title: 'Registro', text: 'Creas tu solicitud con tu nick, correo y WhatsApp.' },
  { n: '03', title: 'Verificación', text: 'El equipo confirma por WhatsApp que administras el grupo.' },
  { n: '04', title: 'Plan de mejora', text: 'Eliges las áreas y damos seguimiento al progreso.' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="pb-14 pt-16 sm:pt-24">
        <p className="eyebrow">Apoyo a comunidades</p>
        <div className="mt-4">
          <Wordmark size="lg" />
        </div>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Argyra es un proyecto de apoyo a grupos y comunidades mediante colaboración mutua.
          Trabajamos junto a quienes administran: tú conoces a tu gente, nosotros ponemos el
          método y las herramientas.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/solicitar">Solicitar apoyo</ButtonLink>
          <ButtonLink href="/lista-de-espera" variant="secondary">
            Ver lista de espera
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="que-es" className="border-t border-edge py-14">
        <p className="eyebrow">Qué hacemos</p>
        <h2 id="que-es" className="mt-3 text-2xl sm:text-3xl">
          ¿Qué es Argyra?
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Acompañamiento en las siete áreas donde un grupo suele trabarse. Eliges dónde
          necesitas ayuda y avanzamos por partes.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => (
            <Card key={area.title}>
              <CardTitle>{area.title}</CardTitle>
              <CardText>{area.text}</CardText>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="proceso" className="border-t border-edge py-14">
        <p className="eyebrow">Cómo funciona</p>
        <h2 id="proceso" className="mt-3 text-2xl sm:text-3xl">
          Cuatro pasos, en este orden
        </h2>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <li key={step.n} className="card flex gap-4 p-5">
              <span className="font-mono text-sm text-accent">{step.n}</span>
              <div>
                <h3 className="text-base">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <ButtonLink href="/solicitar">Solicitar apoyo</ButtonLink>
        </div>
      </section>
    </div>
  );
}
