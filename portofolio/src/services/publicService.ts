import { supabase } from '../lib/supabase';
import { toFriendlyError } from '../lib/errors';
import type { PublicCVData } from '../types';

export const publicService = {
  /**
   * Mengambil data CV publik lewat fungsi database `get_public_cv`.
   * Fungsi itu hanya mengembalikan data untuk username yang diminta dan
   * menghormati show_email / show_phone / show_hobbies.
   */
  async getPublicCVByUsername(username: string): Promise<PublicCVData | null> {
    const clean = username.toLowerCase().trim();
    const { data, error } = await supabase.rpc('get_public_cv', { p_username: clean });
    if (error) throw toFriendlyError(error, 'Gagal memuat halaman CV.');
    return (data as PublicCVData | null) ?? null;
  },
};
