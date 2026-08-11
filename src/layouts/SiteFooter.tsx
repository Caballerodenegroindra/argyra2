import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-edge pb-24 pt-10 sm:pb-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Argyra — apoyo a grupos y comunidades.</p>
        <div className="flex gap-5">
          <Link href="/solicitar" className="hover:text-silver">
            Solicitar apoyo
          </Link>
          <Link href="/lista-de-espera" className="hover:text-silver">
            Lista de espera
          </Link>
          <Link href="/ingresar" className="hover:text-silver">
            Ingresar
          </Link>
        </div>
      </div>
    </footer>
  );
}
