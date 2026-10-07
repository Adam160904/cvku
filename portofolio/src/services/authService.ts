import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { FriendlyError, toFriendlyError } from '../lib/errors';

export interface RegisterResult {
  /** true bila Supabase meminta verifikasi email sebelum bisa login. */
  needsEmailVerification: boolean;
}

export const authService = {
  async register(email: string, password: string, fullName: string): Promise<RegisterResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw toFriendlyError(error, 'Pendaftaran gagal. Silakan coba lagi.');

    // Supabase mengembalikan user tanpa identities bila email sudah terdaftar.
    if (data.user && data.user.identities?.length === 0) {
      throw new FriendlyError('Email ini sudah terdaftar. Silakan login.');
    }
    return { needsEmailVerification: !data.session };
  },

  async login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw toFriendlyError(error, 'Login gagal. Silakan coba lagi.');
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw toFriendlyError(error, 'Gagal keluar. Silakan coba lagi.');
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw toFriendlyError(error);
    return data.session;
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw toFriendlyError(error, 'Gagal mengirim email reset password.');
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw toFriendlyError(error, 'Gagal mengubah password.');
  },
};
