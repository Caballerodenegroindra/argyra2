import { z } from 'zod';

/** Nick real: letras, numeros, espacios, punto, guion. Sin emojis ni simbolos. */
const NICK_PATTERN = /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ._-]+$/;

/** Contrasena de letras y numeros, sin caracteres especiales extranos. */
const PASSWORD_PATTERN = /^[A-Za-z0-9]+$/;

/** WhatsApp en formato internacional: +codigo de pais y numero. */
const WHATSAPP_PATTERN = /^\+[1-9]\d{7,14}$/;

export const registerSchema = z
  .object({
    nick: z
      .string()
      .trim()
      .min(3, 'El nick debe tener al menos 3 caracteres.')
      .max(24, 'El nick no puede superar los 24 caracteres.')
      .regex(NICK_PATTERN, 'Usa solo letras y números, sin emojis ni símbolos.'),
    whatsapp: z
      .string()
      .trim()
      .regex(WHATSAPP_PATTERN, 'Incluye el código de país, por ejemplo +5491122334455.'),
    email: z.string().trim().toLowerCase().email('Escribe un correo válido.'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(PASSWORD_PATTERN, 'Usa solo letras y números.')
      .regex(/[A-Za-z]/, 'Incluye al menos una letra.')
      .regex(/[0-9]/, 'Incluye al menos un número.'),
    confirmPassword: z.string(),
    communityName: z
      .string()
      .trim()
      .min(3, 'Escribe el nombre de tu grupo o comunidad.')
      .max(60, 'El nombre es demasiado largo.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Escribe un correo válido.'),
  password: z.string().min(1, 'Escribe tu contraseña.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
