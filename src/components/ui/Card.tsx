import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx('card p-5', className)}>{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-base text-silver">{children}</h3>;
}

export function CardText({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>;
}
