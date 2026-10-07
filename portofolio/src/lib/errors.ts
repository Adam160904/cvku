/**
 * Mengubah error teknis (Supabase / jaringan) menjadi pesan yang mudah
 * dipahami pengguna. Error mentah hanya dicatat ke console untuk debugging.
 */

interface ErrorLike {
  message?: string;
  code?: string;
  status?: number;
  details?: string;
}

function asErrorLike(err: unknown): ErrorLike {
  if (typeof err === 'object' && err !== null) return err as ErrorLike;
  if (typeof err === 'string') return { message: err };
  return {};
}

export function getFriendlyMessage(
  err: unknown,
  fallback = 'Terjadi kesalahan. Silakan coba lagi.',
): string {
  const { message = '', code = '', status, details = '' } = asErrorLike(err);
  const msg = message.toLowerCase();

  // Auth
  if (msg.includes('invalid login credentials')) return 'Email atau password salah.';
  if (msg.includes('email not confirmed')) {
    return 'Email belum terverifikasi. Silakan cek kotak masuk Anda dan klik tautan verifikasi.';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'Email ini sudah terdaftar. Silakan login.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
  }
  if (msg.includes('rate limit') || status === 429) {
    return 'Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.';
  }
  if (
    msg.includes('jwt expired') ||
    msg.includes('invalid jwt') ||
    msg.includes('refresh token') ||
    code === 'PGRST301'
  ) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.';
  }

  // Database
  if (code === '23505') {
    if (msg.includes('username') || details.includes('username')) {
      return 'Username sudah digunakan. Silakan pilih username lain.';
    }
    return 'Data tersebut sudah ada.';
  }
  if (code === '23514') return 'Data yang dimasukkan tidak valid.';
  if (code === '42501' || msg.includes('row-level security')) {
    return 'Anda tidak memiliki izin untuk melakukan aksi ini.';
  }

  // Storage
  if (msg.includes('mime type') || msg.includes('not supported')) {
    return 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.';
  }
  if (msg.includes('exceeded the maximum allowed size') || status === 413) {
    return 'Ukuran file terlalu besar.';
  }

  // Jaringan
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed')) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }

  return fallback;
}

/** Bungkus error apa pun menjadi Error dengan pesan ramah pengguna. */
export function toFriendlyError(err: unknown, fallback?: string): Error {
  console.error('[CVKITA]', err);
  // Error yang sudah kita buat sendiri (validasi) dipertahankan apa adanya.
  if (err instanceof FriendlyError) return err;
  return new FriendlyError(getFriendlyMessage(err, fallback));
}

export class FriendlyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FriendlyError';
  }
}

/** Pesan aman untuk ditampilkan: hanya FriendlyError yang diteruskan, selainnya pakai fallback. */
export function messageOf(err: unknown, fallback: string): string {
  return err instanceof FriendlyError ? err.message : fallback;
}
