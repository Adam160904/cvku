import React, { useEffect, useState } from 'react';
import { safeHref } from '../../utils/url';
import { messageOf } from '../../lib/errors';
import { Plus, Globe, Share2, Edit2, Trash2, ExternalLink, Code, Briefcase, Camera, MessageCircle, Video } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { socialService } from '../../services/socialService';
import { useToast } from '../../components/common/toastContext';
import type { SocialLink } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Skeleton } from '../../components/common/Skeleton';

const platformOptions = [
  { name: 'GitHub', icon: Code, color: 'text-slate-200' },
  { name: 'LinkedIn', icon: Briefcase, color: 'text-blue-400' },
  { name: 'Instagram', icon: Camera, color: 'text-pink-400' },
  { name: 'Facebook', icon: MessageCircle, color: 'text-blue-500' },
  { name: 'X', icon: Share2, color: 'text-slate-300' },
  { name: 'YouTube', icon: Video, color: 'text-rose-500' },
  { name: 'Website', icon: Globe, color: 'text-emerald-400' },
];

export const SocialPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    platform: 'GitHub',
    url: '',
  });

  const userId = user?.id;
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data = await socialService.getSocialLinks(userId);
        if (active) setSocials(data);
      } catch {
        if (active) showToast('Gagal memuat link social media', 'error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, showToast]);

  const handleOpenModal = (item?: SocialLink) => {
    if (item) {
      setEditingSocial(item);
      setFormData({ platform: item.platform, url: item.url });
    } else {
      setEditingSocial(null);
      setFormData({ platform: 'GitHub', url: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSubmitting(true);
      if (editingSocial) {
        await socialService.updateSocialLink(user.id, editingSocial.id, formData);
        showToast('Social media berhasil diperbarui', 'success');
      } else {
        await socialService.addSocialLink(user.id, formData);
        showToast('Social media berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan social media'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    try {
      setDeleting(true);
      await socialService.deleteSocialLink(user.id, deleteId);
      showToast('Social media berhasil dihapus', 'success');
      setDeleteId(null);
      reload();
    } catch {
      showToast('Gagal menghapus social media', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getPlatformIcon = (platformName: string) => {
    const found = platformOptions.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
    const IconComp = found ? found.icon : Globe;
    const colorClass = found ? found.color : 'text-blue-400';
    return <IconComp className={`w-5 h-5 ${colorClass}`} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Social Media & Link</h2>
          <p className="text-xs text-slate-400">Hubungkan profil GitHub, LinkedIn, Instagram, atau website pribadimu.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Link</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : socials.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Share2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Link Social Media</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hubungkan akun GitHub dan LinkedIn agar pengunjung CV publikmu mudah terhubung.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            + Tambah Social Media Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4 group transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {getPlatformIcon(item.platform)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.platform}
                  </h3>
                  <a
                    href={safeHref(item.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-blue-300 truncate block max-w-[200px]"
                  >
                    {item.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={safeHref(item.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
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
        title={editingSocial ? 'Edit Link Social Media' : 'Tambah Link Social Media'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              {platformOptions.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">URL Profil / Link</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://github.com/adammalik"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
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
              {submitting ? 'Menyimpan...' : 'Simpan Link'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus link social media ini?"
        isLoading={deleting}
      />
    </div>
  );
};
