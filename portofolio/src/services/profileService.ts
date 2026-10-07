import { supabase } from '../lib/supabase';
import { toFriendlyError } from '../lib/errors';
import type { Profile } from '../types';
import { storageService } from './storageService';
import { normalizeUrl } from '../utils/url';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw toFriendlyError(error, 'Gagal memuat profil.');
    return data as Profile | null;
  },

  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    const body: Record<string, unknown> = { ...profileData };
    delete body.id;
    delete body.created_at;
    if (typeof body.website === 'string') body.website = normalizeUrl(body.website);
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { ...body, user_id: userId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
      .select()
      .single();
    if (error) throw toFriendlyError(error, 'Gagal menyimpan profil.');
    return data as Profile;
  },

  uploadPhoto: (userId: string, file: File) =>
    storageService.uploadImage('profile-images', userId, file, 'avatar', 5),
};
