import React from 'react';
import { AlertTriangle } from 'lucide-react';

/** Ditampilkan bila variabel environment Supabase belum diisi. */
export const ConfigMissing: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
    <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-8 space-y-5 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-white">Supabase belum dikonfigurasi</h1>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        CVKITA menyimpan semua data di Supabase. Buat file <code className="text-amber-300">.env</code> di
        root project, lalu isi:
      </p>
      <pre className="text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`}
      </pre>
      <ol className="text-sm text-slate-400 list-decimal pl-5 space-y-1">
        <li>Jalankan <code className="text-slate-200">supabase/schema.sql</code> di Supabase SQL Editor.</li>
        <li>Salin URL dan publishable key dari Project Settings → API.</li>
        <li>Restart <code className="text-slate-200">npm run dev</code>.</li>
      </ol>
    </div>
  </div>
);
