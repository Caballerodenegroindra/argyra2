import type { InputHTMLAttributes, ReactNode } from 'react';

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-silver">{label}</span>
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="mt-2 block text-xs text-state-stop" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-edge bg-raise px-4 py-3 text-base text-silver placeholder:text-muted/60 focus:border-accent focus:outline-none"
    />
  );
}
