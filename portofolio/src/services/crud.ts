import { supabase } from '../lib/supabase';
import { toFriendlyError } from '../lib/errors';

interface OwnedRow {
  id: string;
  user_id: string;
}

interface CrudOptions {
  table: string;
  orderBy: string;
  ascending?: boolean;
  /** Tabel hobbies tidak memiliki kolom updated_at. */
  hasUpdatedAt?: boolean;
}

function omitProtected<T extends object>(data: Partial<T>): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...data };
  delete copy.id;
  delete copy.user_id;
  delete copy.created_at;
  return copy;
}

/**
 * Pabrik service CRUD generik. Semua query selalu dibatasi user_id
 * (defense in depth; pembatas utama tetap RLS di database).
 * Tidak ada fallback: error selalu dilempar agar tampil ke pengguna.
 */
export function createCrudService<T extends OwnedRow>({
  table,
  orderBy,
  ascending = false,
  hasUpdatedAt = true,
}: CrudOptions) {
  return {
    async list(userId: string): Promise<T[]> {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .order(orderBy, { ascending });
      if (error) throw toFriendlyError(error, 'Gagal memuat data.');
      return (data ?? []) as T[];
    },

    async create(userId: string, payload: Omit<T, 'id' | 'user_id'>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .insert({ ...omitProtected<T>(payload as Partial<T>), user_id: userId })
        .select()
        .single();
      if (error) throw toFriendlyError(error, 'Gagal menyimpan data.');
      return data as T;
    },

    async update(userId: string, id: string, payload: Partial<T>): Promise<T> {
      const body = omitProtected<T>(payload);
      if (hasUpdatedAt) body.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from(table)
        .update(body)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw toFriendlyError(error, 'Gagal memperbarui data.');
      return data as T;
    },

    async remove(userId: string, id: string): Promise<void> {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw toFriendlyError(error, 'Gagal menghapus data.');
    },
  };
}
