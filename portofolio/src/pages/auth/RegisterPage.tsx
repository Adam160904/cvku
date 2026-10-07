import React, { useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/toastContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    if (password.length < 6) {
      showToast('Password minimal 6 karakter.', 'error');
      return;
    }

    try {
      setLoading(true);
      const { needsEmailVerification } = await register(email, password, fullName);
      if (needsEmailVerification) {
        showToast('Registrasi berhasil! Cek email Anda untuk verifikasi, lalu login.', 'success');
        navigate('/login');
      } else {
        showToast('Registrasi berhasil! Selamat datang di CVKITA.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(messageOf(err, 'Gagal membuat akun.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 mx-auto shadow-xl shadow-blue-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-blue-400 font-extrabold text-xl">
                CV
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Buat Akun CVKITA Baru</h1>
            <p className="text-xs text-slate-400">Bangun CV & Portfolio profesional gratis dalamhitangan menit.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Adam Malik"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adam.malik@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Membuat Akun...' : 'Daftar Gratis'}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-blue-400 font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
