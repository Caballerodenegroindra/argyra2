'use client';

import { useRef, useState } from 'react';

/** Selector de imagen con estado de subida y errores en el sitio. */
export function ImageUpload({
  label,
  currentUrl,
  onUpload,
}: {
  label: string;
  currentUrl?: string;
  onUpload: (file: File) => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setPreview(await onUpload(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-edge bg-raise">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full border border-edge px-4 py-2 text-sm text-silver transition-colors hover:border-accent/60 disabled:opacity-50"
        >
          {busy ? 'Subiendo…' : label}
        </button>
        <p className="mt-1 text-xs text-muted">JPG o PNG, hasta 3 MB.</p>
        {error ? (
          <p className="mt-1 text-xs text-state-stop" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleChange(event.target.files?.[0])}
      />
    </div>
  );
}
