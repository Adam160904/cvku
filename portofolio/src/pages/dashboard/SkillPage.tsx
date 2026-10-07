import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Plus, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { skillService } from '../../services/skillService';
import { useToast } from '../../components/common/toastContext';
import type { Skill } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

export const SkillPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate',
    percentage: 80,
  });

  const userId = user?.id;
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data = await skillService.getSkills(userId);
        if (active) setSkills(data);
      } catch {
        if (active) showToast('Gagal memuat daftar skill', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: Skill) => {
    if (item) {
      setEditingSkill(item);
      setFormData({
        name: item.name,
        level: item.level || 'Intermediate',
        percentage: item.percentage || 80,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        level: 'Intermediate',
        percentage: 80,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        level: formData.level,
        percentage: Number(formData.percentage),
      };

      if (editingSkill) {
        await skillService.updateSkill(user.id, editingSkill.id, payload);
        showToast('Skill berhasil diperbarui', 'success');
      } else {
        await skillService.addSkill(user.id, payload);
        showToast('Skill berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan skill'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await skillService.deleteSkill(user.id, deleteId);
      showToast('Skill berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus skill', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Keahlian & Skill</h2>
          <p className="text-xs text-slate-400">Kelola kemampuan teknis, bahasa pemrograman, atau tools yang kamu kuasai.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Skill</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan skill utama seperti React, TypeScript, Python, Tailwind, SQL, dll.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Skill Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">{item.level || 'Intermediate'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {item.percentage}%
                  </span>
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Skill</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: React, TypeScript, Python, HTML"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tingkat Penguasaan (Level)</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Beginner">Beginner (Pemula)</option>
              <option value="Intermediate">Intermediate (Menengah)</option>
              <option value="Advanced">Advanced (Mahir)</option>
              <option value="Expert">Expert (Ahli)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span>Persentase Kemampuan</span>
              <span className="text-blue-400 font-bold">{formData.percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
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
              {submitting ? 'Menyimpan...' : 'Simpan Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus skill ini?"
        isLoading={deleting}
      />
    </div>
  );
};
