import type { Settings } from '../types';

export function normalizeWhatsAppNumber(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '237681504830';
  // Ensure Cameroon country code
  if (digits.startsWith('237')) return digits;
  if (digits.length === 9) return '237' + digits;
  return digits;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const n = normalizeWhatsAppNumber(number);
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(settings: Settings | null, message: string) {
  const num = settings?.whatsapp_number || '237681504830';
  window.open(buildWhatsAppUrl(num, message), '_blank', 'noopener,noreferrer');
}
