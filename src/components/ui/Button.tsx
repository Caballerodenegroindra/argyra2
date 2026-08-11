import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-ink hover:bg-[#93a0ff] active:bg-[#6b7aef]',
  secondary: 'bg-raise text-silver border border-edge hover:border-accent/60',
  ghost: 'text-muted hover:text-silver',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cx(BASE, VARIANTS[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
  target,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={cx(BASE, VARIANTS[variant], className)}
    >
      {children}
    </Link>
  );
}
