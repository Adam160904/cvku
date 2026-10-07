import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Plus, Briefcase, Calendar, Edit2, Trash2, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { experienceService } from '../../services/experienceService';
import { useToast } from '../../components/common/toastContext';
import type { Experience } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

export const ExperiencePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  const userId = user?.id;
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data = await experienceService.getExperiences(userId);
        if (active) setExperiences(data);
      } catch {
        if (active) showToast('Gagal memuat pengalaman kerja', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: Experience) => {
    if (item) {
      setEditingExp(item);
      setFormData({
        company: item.company,
        position: item.position,
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        is_current: item.is_current || false,
        description: item.description || '',
      });
    } else {
      setEditingExp(null);
      setFormData({
        company: '',
        position: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_current: false,
        description: '',
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
        company: formData.company,
        position: formData.position,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date || null,
        is_current: formData.is_current,
        description: formData.description,
      };

      if (editingExp) {
        await experienceService.updateExperience(user.id, editingExp.id, payload);
        showToast('Pengalaman berhasil diperbarui', 'success');
      } else {
        await experienceService.addExperience(user.id, payload);
        showToast('Pengalaman berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan pengalaman'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await experienceService.deleteExperience(user.id, deleteId);
      showToast('Pengalaman berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus pengalaman', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Pengalaman Kerja & Karir</h2>
          <p className="text-xs text-slate-400">Tambahkan riwayat pekerjaan, magang, atau proyek freelance yang telah kamu selesaikan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Pengalaman Kerja</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tampilkan perjalanan profesionalmu agar calon perekrut tertarik melihat jejak karirmu.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Pengalaman Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-lg transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.position}
                    </h3>
                    {item.is_current && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        Sekarang
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {item.company}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {formatDateLabel(item.start_date)} - {item.is_current ? 'Sekarang' : formatDateLabel(item.end_date || '')}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 pt-2 leading-relaxed max-w-2xl whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
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
        title={editingExp ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Posisi / Jabatan</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Contoh: Full-Stack Web Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nama Perusahaan / Organisasi</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Contoh: PT Solusi Tech Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tanggal Mulai</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tanggal Selesai</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.is_current}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_current"
              checked={formData.is_current}
              onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="is_current" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Saya masih bekerja di posisi ini (Tampilkan "Sekarang")
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Tugas & Pencapaian</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Jelaskan tanggung jawab utama, teknologi yang digunakan, serta dampak/pencapaianmu..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 resize-y"
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
              {submitting ? 'Menyimpan...' : 'Simpan Pengalaman'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus data pengalaman kerja ini?"
        isLoading={deleting}
      />
    </div>
  );
};
