import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Plus, Heart, Code, Gamepad2, BookOpen, Camera, Music, Compass, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hobbyService } from '../../services/hobbyService';
import { useToast } from '../../components/common/toastContext';
import type { Hobby } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

const iconOptions = [
  { name: 'Code', label: 'Programming', icon: Code },
  { name: 'Gamepad2', label: 'Gaming', icon: Gamepad2 },
  { name: 'BookOpen', label: 'Reading', icon: BookOpen },
  { name: 'Camera', label: 'Photography', icon: Camera },
  { name: 'Music', label: 'Music', icon: Music },
  { name: 'Compass', label: 'Traveling', icon: Compass },
  { name: 'Heart', label: 'Fitness / General', icon: Heart },
  { name: 'Sparkles', label: 'Creative Design', icon: Sparkles },
];

export const HobbyPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    icon: 'Heart',
  });

  const userId = user?.id;
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data = await hobbyService.getHobbies(userId);
        if (active) setHobbies(data);
      } catch {
        if (active) showToast('Gagal memuat daftar hobi', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: Hobby) => {
    if (item) {
      setEditingHobby(item);
      setFormData({ name: item.name, icon: item.icon || 'Heart' });
    } else {
      setEditingHobby(null);
      setFormData({ name: '', icon: 'Code' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSubmitting(true);
      if (editingHobby) {
        await hobbyService.updateHobby(user.id, editingHobby.id, formData);
        showToast('Hobi berhasil diperbarui', 'success');
      } else {
        await hobbyService.addHobby(user.id, formData);
        showToast('Hobi berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan hobi'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await hobbyService.deleteHobby(user.id, deleteId);
      showToast('Hobi berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus hobi', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const renderIcon = (iconName?: string) => {
    const found = iconOptions.find((i) => i.name === iconName);
    const IconComp = found ? found.icon : Heart;
    return <IconComp className="w-5 h-5 text-rose-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Minat & Hobi</h2>
          <p className="text-xs text-slate-400">Tambahkan aktivitas luar kerja atau hobi yang menggambarkan personalitasmu.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Hobi</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : hobbies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Hobi</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tunjukkan minatmu seperti Programming, Gaming, Reading, atau Photography.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Hobi Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {hobbies.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  {renderIcon(item.icon)}
                </div>
                <span className="text-sm font-semibold text-white truncate">{item.name}</span>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHobby ? 'Edit Hobi' : 'Tambah Hobi Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Hobi</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Programming, Gaming, Photography"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pilih Icon Representasi</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = formData.icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.name })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <IconComp className="w-5 h-5 mb-1" />
                    <span className="text-[10px] truncate w-full text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Hobi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus hobi ini?"
        isLoading={deleting}
      />
    </div>
  );
};
