import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Save, Check, Palette, Layout, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/common/toastContext';
import type { UserSettings } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';

const colorOptions = [
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Deep Purple', hex: '#7C3AED' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Burnt Orange', hex: '#EA580C' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Cyan Blue', hex: '#0284C7' },
];

const templateOptions = [
  { id: 'modern', name: 'Modern SaaS', desc: 'Hero gradient header, responsive rounded cards & tech badges.' },
  { id: 'minimal', name: 'Minimal Mono', desc: 'Desain bersih dengan tipografi monospaced yang elegan & ringkas.' },
  { id: 'professional', name: 'Executive Split', desc: 'Layout 2 kolom dengan sidebar profil kiri & timeline formal.' },
];

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');

  const [formData, setFormData] = useState<Partial<UserSettings>>({
    username: '',
    template: 'modern',
    primary_color: '#2563EB',
    dark_mode: true,
    show_email: true,
    show_phone: true,
    show_hobbies: true,
  });

  useEffect(() => {
    async function loadSettings() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const stg = await settingsService.getSettings(user.id);
        if (stg) {
          setFormData(stg);
          setUsernameInput(stg.username || '');
        }
      } catch {
        showToast('Gagal memuat pengaturan', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [user, showToast]);

  // Handle Username Typing & Validation
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setUsernameInput(cleanVal);

    if (!cleanVal) {
      setIsUsernameValid(false);
      setUsernameMessage('Username tidak boleh kosong.');
      return;
    }

    if (cleanVal.length < 3) {
      setIsUsernameValid(false);
      setUsernameMessage('Username minimal 3 karakter.');
      return;
    }

    try {
      setIsCheckingUsername(true);
      const isAvailable = await settingsService.isUsernameAvailable(cleanVal);
      if (isAvailable) {
        setIsUsernameValid(true);
        setUsernameMessage('Username tersedia!');
        setFormData((prev) => ({ ...prev, username: cleanVal }));
      } else {
        setIsUsernameValid(false);
        setUsernameMessage('Username sudah digunakan oleh pengguna lain.');
      }
    } catch {
      setIsUsernameValid(false);
      setUsernameMessage('Gagal mengecek ketersediaan username.');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !isUsernameValid) {
      showToast('Periksa kembali username Anda.', 'error');
      return;
    }

    try {
      setSaving(true);
      await settingsService.updateSettings(user.id, {
        ...formData,
        username: usernameInput,
      });
      showToast('Pengaturan berhasil disimpan!', 'success');
    } catch (err) {
      showToast(messageOf(err, 'Gagal menyimpan pengaturan'), 'error');
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

  const publicLink = `${window.location.origin}/u/${usernameInput}`;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Pengaturan CV & URL</h2>
          <p className="text-xs text-slate-400">Atur username publik, tema tampilan, warna utama, dan visibilitas data.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !isUsernameValid}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username & URL Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" /> Username URL Publik
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Username Unique</label>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
                /u/
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={handleUsernameChange}
                placeholder="adam-malik"
                className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm font-mono focus:outline-none transition-colors ${
                  isUsernameValid ? 'border-slate-800 focus:border-blue-500' : 'border-rose-500/80 focus:border-rose-500'
                }`}
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className={isUsernameValid ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {isCheckingUsername ? 'Mengecek ketersediaan...' : usernameMessage}
              </span>
              <a href={publicLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                Buka Link Publik →
              </a>
            </div>
          </div>
        </div>

        {/* Template Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-400" /> Pilih Template Tampilan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templateOptions.map((tpl) => {
              const isSelected = formData.template === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setFormData((prev) => ({ ...prev, template: tpl.id as UserSettings['template'] }))}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tpl.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Palette Customization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Warna Aksen Utama (Primary Color)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {colorOptions.map((c) => {
              const isSelected = formData.primary_color === c.hex;
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, primary_color: c.hex }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-white ring-2 ring-white/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] font-semibold text-slate-300">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy & Visibility Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" /> Visibilitas & Privasi
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                {formData.show_email ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                <div>
                  <h4 className="text-xs font-bold text-white">Tampilkan Email di CV Publik</h4>
                  <p className="text-[11px] text-slate-400">Pengunjung dapat melihat email kontakmu.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.show_email !== false}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_email: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                {formData.show_phone ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                <div>
                  <h4 className="text-xs font-bold text-white">Tampilkan Nomor Telepon</h4>
                  <p className="text-[11px] text-slate-400">Pengunjung dapat melihat nomor telepon/WhatsApp.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.show_phone !== false}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_phone: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                {formData.show_hobbies ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                <div>
                  <h4 className="text-xs font-bold text-white">Tampilkan Hobi & Minat</h4>
                  <p className="text-[11px] text-slate-400">Tampilkan section hobi pada CV publik.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.show_hobbies !== false}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_hobbies: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving || !isUsernameValid}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
