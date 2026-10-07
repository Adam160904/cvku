import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Edit3, Eye, Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { publicService } from '../../services/publicService';
import { settingsService } from '../../services/settingsService';
import type { PublicCVData } from '../../types';
import { ModernTemplate } from '../../components/templates/ModernTemplate';
import { MinimalTemplate } from '../../components/templates/MinimalTemplate';
import { ProfessionalTemplate } from '../../components/templates/ProfessionalTemplate';
import { useToast } from '../../components/common/toastContext';
import { Skeleton } from '../../components/common/Skeleton';

export const PreviewCVPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PublicCVData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCVData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const stg = await settingsService.getSettings(user.id);
        const cvData = await publicService.getPublicCVByUsername(stg.username);
        setData(cvData);
      } catch {
        showToast('Gagal memuat pratinjau CV', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchCVData();
  }, [user, showToast]);

  const username = data?.settings?.username ?? '';
  const publicUrl = `${window.location.origin}/u/${username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Link CV publik berhasil disalin!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentTemplate = data?.settings?.template || 'modern';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Action Header (hidden during print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" /> Pratinjau Realtime CV
          </h2>
          <p className="text-xs text-slate-400">
            Link publik kamu: <span className="text-blue-400 font-semibold">{publicUrl}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <Link
            to="/dashboard/profile"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profil</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Bagikan CV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* CV Content Preview Container */}
      <div className="cv-preview-container border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
        {loading ? (
          <div className="p-12 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : !data ? (
          <div className="p-12 text-center text-slate-400 text-sm">Data pratinjau tidak ditemukan.</div>
        ) : currentTemplate === 'minimal' ? (
          <MinimalTemplate data={data} />
        ) : currentTemplate === 'professional' ? (
          <ProfessionalTemplate data={data} />
        ) : (
          <ModernTemplate data={data} />
        )}
      </div>
    </div>
  );
};
