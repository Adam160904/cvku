import React, { useEffect, useState } from 'react';
import { safeHref } from '../../utils/url';
import { messageOf } from '../../lib/errors';
import { Plus, FolderKanban, ExternalLink, GitBranch, Edit2, Trash2, Image as ImageIcon, Upload, Tag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { portfolioService } from '../../services/portfolioService';
import { useToast } from '../../components/common/toastContext';
import type { Portfolio } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

export const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPort, setEditingPort] = useState<Portfolio | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologiesStr: '',
  });

  const userId = user?.id;
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data = await portfolioService.getPortfolios(userId);
        if (active) setPortfolios(data);
      } catch {
        if (active) showToast('Gagal memuat proyek portfolio', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: Portfolio) => {
    if (item) {
      setEditingPort(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        image_url: item.image_url || '',
        project_url: item.project_url || '',
        github_url: item.github_url || '',
        technologiesStr: (item.technologies || []).join(', '),
      });
      setImagePreview(item.image_url || '');
    } else {
      setEditingPort(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        project_url: '',
        github_url: '',
        technologiesStr: 'React, TypeScript, Supabase, Tailwind CSS',
      });
      setImagePreview('');
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const url = await portfolioService.uploadPortfolioImage(user.id, file);
      setFormData((prev) => ({ ...prev, image_url: url }));
      showToast('Gambar proyek berhasil diunggah', 'success');
    } catch (err) {
      showToast(messageOf(err, 'Gagal mengunggah gambar'), 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSubmitting(true);
      const techArray = formData.technologiesStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || imagePreview,
        project_url: formData.project_url,
        github_url: formData.github_url,
        technologies: techArray,
      };

      if (editingPort) {
        await portfolioService.updatePortfolio(user.id, editingPort.id, payload);
        showToast('Proyek berhasil diperbarui', 'success');
      } else {
        await portfolioService.addPortfolio(user.id, payload);
        showToast('Proyek berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan proyek'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await portfolioService.deletePortfolio(user.id, deleteId);
      showToast('Proyek berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus proyek', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Portfolio Project</h2>
          <p className="text-xs text-slate-400">Tampilkan karya terbaik, screenshot aplikasi, dan link demo project milikmu.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : portfolios.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <FolderKanban className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Portfolio Project</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tampilkan aplikasi buatanmu seperti web app, mobile app, UI design, atau open-source library.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Project Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-2xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Project Image Header */}
              <div className="relative h-44 bg-slate-950 overflow-hidden border-b border-slate-800">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
                    <ImageIcon className="w-10 h-10 mb-1" />
                    <span className="text-[10px]">No Image Preview</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1 text-slate-300 hover:text-blue-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1 text-slate-300 hover:text-rose-400 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.description || 'Tidak ada deskripsi proyek.'}
                  </p>
                </div>

                {/* Tech Tags */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs">
                  {item.project_url && (
                    <a
                      href={safeHref(item.project_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-blue-400 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={safeHref(item.github_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPort ? 'Edit Portfolio Project' : 'Tambah Portfolio Project'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Judul Project</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: FINORA - Finance Management Application"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Ringkas Project</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Jelaskan kegunaan aplikasi, fitur utama, dan solusi yang diselesaikan proyek ini..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          {/* Image Upload / Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Gambar Preview Project</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-500">No Image</span>
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>{uploadingImage ? 'Mengunggah Gambar...' : 'Unggah Foto Project'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Atau masukkan URL Gambar langsung (https://...)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" /> Teknologi yang Digunakan (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.technologiesStr}
              onChange={(e) => setFormData({ ...formData, technologiesStr: e.target.value })}
              placeholder="React, TypeScript, Supabase, Tailwind CSS"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Live Demo / Website URL</label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://myproject.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
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
              {submitting ? 'Menyimpan...' : 'Simpan Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus proyek portfolio ini?"
        isLoading={deleting}
      />
    </div>
  );
};
