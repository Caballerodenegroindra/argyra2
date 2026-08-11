import Link from 'next/link';

/** Logotipo: el destello metálico es la firma visual de la marca. */
export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const scale = size === 'lg' ? 'text-5xl sm:text-7xl' : 'text-lg';

  return (
    <Link href="/" className="inline-block">
      <span
        className={`sheen font-display font-semibold tracking-[0.24em] ${scale}`}
      >
        ARGYRA
      </span>
    </Link>
  );
}
