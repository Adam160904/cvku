import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Camera, Save, User, Mail, Phone, MapPin, Globe, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { useToast } from '../../components/common/toastContext';
import type { Profile } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: '',
    headline: '',
    about: '',
    photo_url: '',
    location: '',
    email: '',
    phone: '',
    website: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await profileService.getProfile(user.id);
        if (data) {
          setFormData(data);
          setPhotoPreview(data.photo_url || '');
        } else {
          setFormData((prev) => ({ ...prev, email: user.email }));
        }
      } catch {
        showToast('Gagal memuat profil', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploading(true);
      // Local preview
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Service upload
      const url = await profileService.uploadPhoto(user.id, file);
      setFormData((prev) => ({ ...prev, photo_url: url }));
      showToast('Foto profil berhasil diunggah', 'success');
    } catch (err) {
      showToast(messageOf(err, 'Gagal mengunggah foto'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      await profileService.updateProfile(user.id, formData);
      showToast('Profil berhasil disimpan', 'success');
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan profil'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Profil Saya</h2>
          <p className="text-xs text-slate-400">Atur informasi biodata diri yang akan ditampilkan pada CV publik.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 shadow-md">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <label className="absolute inset-0 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 mb-1 text-blue-400" />
              <span className="text-[10px] font-semibold">Ubah Foto</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-slate-200">Foto Profil</h3>
            <p className="text-xs text-slate-400">
              Format yang didukung: JPG, JPEG, PNG, atau WEBP. Maksimal 5MB.
            </p>
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>{uploading ? 'Mengunggah...' : 'Pilih Foto Baru'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Informasi Utama</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Nama Lengkap
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                placeholder="Contoh: Adam Malik"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Headline / Judul Profesional
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline || ''}
                onChange={handleChange}
                placeholder="Contoh: Mahasiswa Teknik Informatika & Web Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Tentang Saya (Ringkasan Bio)
            </label>
            <textarea
              name="about"
              value={formData.about || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Ceritakan latar belakang, minat teknologi, dan keahlian utamamu..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Kontak & Lokasi</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Lokasi / Domisili
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Contoh: Bandung, Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Publik
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="adam.malik@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="+62 812-3456-7890"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Website / Portfolio Pribadi
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="https://adammalik.dev"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
