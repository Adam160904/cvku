import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, LayoutDashboard, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              CVKITA
            </span>
          </div>
        </Link>

        {/* Navigation Links & Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Gratis</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
