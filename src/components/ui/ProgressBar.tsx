export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        {label ? <span className="text-sm text-muted">{label}</span> : null}
        <span className="font-mono text-xs text-silver">{safe}%</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-raise"
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
