'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { loginSchema, type LoginInput } from '@/lib/validation';
import { login, recoverPassword } from '@/services/auth';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.push(params.get('siguiente') ?? '/panel');
    } catch {
      setFormError('Correo o contraseña incorrectos.');
    }
  }

  async function onRecover() {
    const email = getValues('email');
    if (!email) {
      setFormError('Escribe tu correo para enviarte el enlace de recuperación.');
      return;
    }
    await recoverPassword(email);
    setNotice('Te enviamos un enlace para restablecer la contraseña.');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5" noValidate>
      <Field label="Correo electrónico" error={errors.email?.message}>
        <Input {...register('email')} type="email" autoComplete="email" />
      </Field>

      <Field label="Contraseña" error={errors.password?.message}>
        <Input {...register('password')} type="password" autoComplete="current-password" />
      </Field>

      {formError ? (
        <p className="text-sm text-state-stop" role="alert">
          {formError}
        </p>
      ) : null}
      {notice ? <p className="text-sm text-state-done">{notice}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>

      <div className="flex justify-between text-sm">
        <button type="button" onClick={onRecover} className="text-muted hover:text-silver">
          Recuperar contraseña
        </button>
        <Link href="/solicitar" className="text-accent hover:underline">
          Crear solicitud
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl sm:text-3xl">Ingresar</h1>
      <p className="mt-3 text-sm text-muted">Accede al estado de tu solicitud y a tus avances.</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
