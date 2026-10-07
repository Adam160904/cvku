import { supabase } from '../lib/supabase';
import { FriendlyError, toFriendlyError } from '../lib/errors';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

export function validateImage(file: File, maxMB: number): void {
  if (!MIME_TO_EXT[file.type]) {
    throw new FriendlyError('Format gambar harus JPG, JPEG, PNG, atau WEBP.');
  }
  if (file.size > maxMB * 1024 * 1024) {
    throw new FriendlyError(`Ukuran gambar maksimal ${maxMB}MB.`);
  }
}

export const storageService = {
  /**
   * Upload gambar ke bucket dan kembalikan URL publik.
   * Path selalu diawali `${userId}/` agar policy storage dapat membatasi per user.
   */
  async uploadImage(
    bucket: 'profile-images' | 'portfolio-images',
    userId: string,
    file: File,
    prefix: string,
    maxMB: number,
  ): Promise<string> {
    validateImage(file, maxMB);
    const ext = MIME_TO_EXT[file.type];
    const path = `${userId}/${prefix}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw toFriendlyError(error, 'Gagal mengunggah gambar. Silakan coba lagi.');

    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
};
