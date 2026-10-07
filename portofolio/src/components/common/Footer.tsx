import React from 'react';
import { FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white">CVKITA</span>
          <span className="text-xs text-slate-500 ml-2">© {CURRENT_YEAR} CVKITA Inc.</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="hover:text-white transition-colors">Daftar</Link>
          <Link to="/u/adam-malik" className="hover:text-white transition-colors">Contoh CV Publik</Link>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> untuk profesional Indonesia.
        </div>
      </div>
    </footer>
  );
};
