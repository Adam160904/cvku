import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Plus, GraduationCap, Calendar, Edit2, Trash2, Building } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { educationService } from '../../services/educationService';
import { useToast } from '../../components/common/toastContext';
import type { Education } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

const CURRENT_YEAR = new Date().getFullYear();

export const EducationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState<Education[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    major: '',
    start_year: CURRENT_YEAR,
    end_year: '' as number | string,
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
        const data = await educationService.getEducations(userId);
        if (active) setEducations(data);
      } catch {
        if (active) showToast('Gagal memuat riwayat pendidikan', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: Education) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        institution: item.institution,
        degree: item.degree || '',
        major: item.major || '',
        start_year: item.start_year,
        end_year: item.end_year || '',
        description: item.description || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        institution: '',
        degree: '',
        major: '',
        start_year: CURRENT_YEAR,
        end_year: '',
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
        institution: formData.institution,
        degree: formData.degree,
        major: formData.major,
        start_year: Number(formData.start_year),
        end_year: formData.end_year ? Number(formData.end_year) : null,
        description: formData.description,
      };

      if (editingItem) {
        await educationService.updateEducation(user.id, editingItem.id, payload);
        showToast('Pendidikan berhasil diperbarui', 'success');
      } else {
        await educationService.addEducation(user.id, payload);
        showToast('Pendidikan berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan data pendidikan'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await educationService.deleteEducation(user.id, deleteId);
      showToast('Pendidikan berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus data', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Riwayat Pendidikan</h2>
          <p className="text-xs text-slate-400">Tambahkan informasi sekolah, universitas, atau gelar akademismu.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pendidikan</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : educations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Data Pendidikan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan riwayat pendidikanmu agar CV terlihat lengkap dan menarik bagi pembaca.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Pendidikan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {educations.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-lg transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.institution}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200">
                      {item.degree || 'Gelar'}
                    </span>
                    {item.major && <span className="text-slate-400">• {item.major}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {item.start_year} - {item.end_year ? item.end_year : 'Sekarang'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400 pt-2 leading-relaxed max-w-2xl">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Pendidikan"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Hapus Pendidikan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" /> Nama Institusi / Sekolah
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Contoh: Universitas Teknologi Bandung"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Gelar (Degree)</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Contoh: Sarjana (S1), Diploma (D3)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Program Studi / Jurusan</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="Contoh: Teknik Informatika"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tahun Mulai</label>
              <input
                type="number"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: Number(e.target.value) })}
                placeholder="2020"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tahun Selesai (Kosongkan jika masih berlangsung)</label>
              <input
                type="number"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Ringkas</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Jelaskan prestasi, topik keahlian, atau aktivitas organisasi selama studi..."
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
              {submitting ? 'Menyimpan...' : 'Simpan Pendidikan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus data pendidikan ini?"
        isLoading={deleting}
      />
    </div>
  );
};
