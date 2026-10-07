import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../services/publicService';
import type { PublicCVData } from '../types';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { Skeleton } from '../components/common/Skeleton';
import { FileText, Copy, Check, Printer, Sparkles } from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PublicCVData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPublicCV() {
      if (!username) return;
      try {
        setLoading(true);
        const result = await publicService.getPublicCVByUsername(username);
        setData(result);
      } catch (err) {
        console.error('Error fetching public CV:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicCV();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!data || !data.profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Profil CV Tidak Ditemukan</h1>
        <p className="text-xs text-slate-400 max-w-sm">
          Maaf, profil dengan username <span className="text-rose-400 font-mono">/u/{username}</span> belum dibuat atau tidak tersedia.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
        >
          Kembali ke Beranda CVKITA
        </Link>
      </div>
    );
  }

  const template = data.settings?.template || 'modern';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Floating Action Bar for Visitors */}
      <div className="no-print fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl shadow-2xl backdrop-blur-md">
        <button
          onClick={handleCopyLink}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Salin Link CV"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
          <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
        </button>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20"
          title="Cetak CV / Simpan PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print PDF</span>
        </button>
      </div>

      {/* Render Template */}
      {template === 'minimal' ? (
        <MinimalTemplate data={data} />
      ) : template === 'professional' ? (
        <ProfessionalTemplate data={data} />
      ) : (
        <ModernTemplate data={data} />
      )}

      {/* Powered by CVKITA Banner */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <span>Dibuat dengan</span>
          <Link to="/" className="font-extrabold text-slate-300 hover:text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> CVKITA
          </Link>
          <span>— Platform CV & Portfolio Online</span>
        </div>
      </footer>
    </div>
  );
};
