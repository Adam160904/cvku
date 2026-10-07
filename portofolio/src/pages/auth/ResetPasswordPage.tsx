import React, { useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/toastContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const ResetPasswordPage: React.FC = () => {
  const { user, loading: authLoading, recoveryMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password minimal 6 karakter.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Konfirmasi password tidak sama.', 'error');
      return;
    }
    try {
      setSaving(true);
      await authService.updatePassword(password);
      showToast('Password berhasil diubah.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(messageOf(err, 'Gagal mengubah password.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Halaman ini hanya valid bila dibuka lewat tautan dari email reset.
  const canReset = recoveryMode || Boolean(user);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Buat Password Baru</h1>
            <p className="text-xs text-slate-400">Masukkan password baru untuk akun Anda.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {authLoading ? (
              <p className="text-sm text-slate-400 text-center">Memeriksa tautan...</p>
            ) : !canReset ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-300">
                  Tautan reset password tidak valid atau sudah kedaluwarsa.
                </p>
                <Link to="/forgot-password" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                  Minta tautan baru
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" /> Password Baru
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" /> Ulangi Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold transition-colors"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
