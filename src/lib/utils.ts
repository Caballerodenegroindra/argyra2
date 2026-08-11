import type { FireDate } from '@/types';

/** Une clases condicionales sin dependencias externas. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/** Convierte cualquier forma de fecha de Firestore a Date. */
export function toDate(value: FireDate): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  if (typeof value === 'object' && 'toDate' in value) return value.toDate();
  return null;
}

export function formatDate(value: FireDate): string {
  const date = toDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date);
}

/** Enlaces del grupo oficial para WhatsApp y WhatsApp Business. */
export function whatsappLinks() {
  const url = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? '';
  return {
    url,
    standard: url,
    business: url.replace('https://chat.whatsapp.com/', 'whatsapp://chat?code='),
  };
}
