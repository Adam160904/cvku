import { FriendlyError } from '../lib/errors';

/**
 * Menormalkan URL buatan user: menambah https:// bila tidak ada skema,
 * dan menolak skema berbahaya (javascript:, data:, dll).
 * String kosong dikembalikan apa adanya.
 */
export function normalizeUrl(raw: string | null | undefined): string {
  const value = (raw ?? '').trim();
  if (!value) return '';

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    throw new FriendlyError('Format URL tidak valid.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new FriendlyError('URL harus diawali http:// atau https://');
  }
  return parsed.toString();
}

/**
 * Untuk dipakai di atribut href saat menampilkan data user.
 * Hanya mengizinkan http(s); selain itu mengembalikan undefined
 * sehingga tautan tidak bisa diklik (mencegah javascript: / data:).
 */
export function safeHref(raw: string | null | undefined): string | undefined {
  const value = (raw ?? '').trim();
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}
