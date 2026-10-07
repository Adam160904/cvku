import React, { useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/toastContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await authService.resetPassword(email);
      setSent(true);
      showToast('Instruksi reset password telah dikirim ke email Anda.', 'success');
    } catch (err) {
      showToast(messageOf(err, 'Gagal mengirim instruksi reset password.'), 'error');
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
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h1>
            <p className="text-xs text-slate-400">Masukkan alamat email yang terdaftar untuk menerima link reset.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {sent ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Email Reset Dikirim!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Silakan periksa kotak masuk atau folder spam di email <span className="text-blue-400 font-semibold">{email}</span>.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Akun
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Mengirim...' : 'Kirim Link Reset'}</span>
                  <Send className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
