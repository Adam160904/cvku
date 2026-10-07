import { supabase } from '../lib/supabase';
import { toFriendlyError } from '../lib/errors';
import type { UserSettings } from '../types';

export const USERNAME_REGEX = /^[a-z0-9-]{3,30}$/;

export const settingsService = {
  async getSettings(userId: string): Promise<UserSettings> {
    const read = () =>
      supabase.from('settings').select('*').eq('user_id', userId).maybeSingle();

    let { data, error } = await read();
    if (error) throw toFriendlyError(error, 'Gagal memuat pengaturan.');

    // Akun lama (dibuat sebelum trigger terpasang) belum punya baris settings/profile.
    if (!data) {
      const { error: ensureError } = await supabase.rpc('ensure_user_rows');
      if (ensureError) throw toFriendlyError(ensureError, 'Gagal menyiapkan akun.');
      ({ data, error } = await read());
      if (error || !data) throw toFriendlyError(error, 'Gagal memuat pengaturan.');
    }
    return data as UserSettings;
  },

  async updateSettings(userId: string, data: Partial<UserSettings>): Promise<UserSettings> {
    const body: Record<string, unknown> = { ...data };
    delete body.id;
    delete body.created_at;
    if (typeof body.username === 'string') body.username = body.username.toLowerCase().trim();

    const { data: result, error } = await supabase
      .from('settings')
      .upsert(
        { ...body, user_id: userId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
      .select()
      .single();
    if (error) throw toFriendlyError(error, 'Gagal menyimpan pengaturan.');
    return result as UserSettings;
  },

  /** Cek format lalu cek ke database (RPC) apakah username masih bebas. */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const clean = username.toLowerCase().trim();
    if (!USERNAME_REGEX.test(clean)) return false;
    const { data, error } = await supabase.rpc('is_username_available', { p_username: clean });
    if (error) throw toFriendlyError(error, 'Gagal memeriksa username.');
    return data === true;
  },
};
