'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import { registerUser } from '@/services/auth';
import { createCommunity } from '@/services/communities';
import { createRequest } from '@/services/requests';

/** Mensajes de Firebase traducidos a algo accionable. */
function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/email-already-in-use') {
      return 'Ese correo ya tiene una cuenta. Ingresa con tu contraseña.';
    }
    if (error.code === 'auth/weak-password') {
      return 'La contraseña es demasiado corta.';
    }
    if (error.code === 'auth/network-request-failed') {
      return 'Sin conexión con el servidor. Revisa tu red e inténtalo otra vez.';
    }
  }
  return 'No se pudo crear la solicitud. Inténtalo de nuevo en unos minutos.';
}

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    try {
      const credential = await registerUser({
        nick: values.nick,
        email: values.email,
        whatsapp: values.whatsapp,
        password: values.password,
      });

      const communityId = await createCommunity({
        ownerUid: credential.user.uid,
        ownerNick: values.nick,
        communityName: values.communityName,
      });

      await createRequest({ userId: credential.user.uid, communityId });

      router.push('/solicitud-enviada');
    } catch (error) {
      setFormError(authErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="eyebrow">Paso 3 de 3</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">Crear solicitud</h1>
      <p className="mt-3 text-sm text-muted">
        Usaremos estos datos para verificar tu grupo y contactarte por WhatsApp.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5" noValidate>
        <Field
          label="Nick o sobrenombre"
          hint="Debe ser real, sin emojis ni símbolos."
          error={errors.nick?.message}
        >
          <Input {...register('nick')} autoComplete="nickname" placeholder="Camila" />
        </Field>

        <Field
          label="Nombre del grupo o comunidad"
          error={errors.communityName?.message}
        >
          <Input {...register('communityName')} placeholder="Grupo Alpha" />
        </Field>

        <Field
          label="Número de WhatsApp"
          hint="Con código de país."
          error={errors.whatsapp?.message}
        >
          <Input
            {...register('whatsapp')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+5491122334455"
          />
        </Field>

        <Field
          label="Correo electrónico"
          hint="Lo usarás para recuperar tu cuenta."
          error={errors.email?.message}
        >
          <Input
            {...register('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@correo.com"
          />
        </Field>

        <Field
          label="Contraseña"
          hint="Letras y números, mínimo 8 caracteres."
          error={errors.password?.message}
        >
          <Input {...register('password')} type="password" autoComplete="new-password" />
        </Field>

        <Field label="Repetir contraseña" error={errors.confirmPassword?.message}>
          <Input
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
          />
        </Field>

        {formError ? (
          <p
            className="rounded-xl border border-state-stop/40 bg-state-stop/10 p-3 text-sm text-state-stop"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando solicitud…' : 'Crear solicitud'}
        </Button>
      </form>
    </div>
  );
}
