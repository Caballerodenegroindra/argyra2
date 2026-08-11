import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-3xl">Esta página no existe</h1>
      <p className="mt-3 text-muted">
        El enlace puede estar mal escrito o la página se movió.
      </p>
      <ButtonLink href="/" className="mt-8">
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
