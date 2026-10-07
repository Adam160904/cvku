import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, GraduationCap, Sparkles, Briefcase, FolderKanban, Heart, Share2, Eye, Settings, LogOut, Menu, X, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { settingsService } from '../services/settingsService';
import { useToast } from '../components/common/toastContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Profil Saya', path: '/dashboard/profile', icon: User },
  { name: 'Pendidikan', path: '/dashboard/education', icon: GraduationCap },
  { name: 'Skill', path: '/dashboard/skills', icon: Sparkles },
  { name: 'Pengalaman', path: '/dashboard/experience', icon: Briefcase },
  { name: 'Portfolio', path: '/dashboard/portfolio', icon: FolderKanban },
  { name: 'Hobi', path: '/dashboard/hobbies', icon: Heart },
  { name: 'Social Media', path: '/dashboard/social', icon: Share2 },
  { name: 'Preview CV', path: '/dashboard/preview', icon: Eye },
  { name: 'Pengaturan', path: '/dashboard/settings', icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      settingsService.getSettings(user.id).then((stg) => {
        if (stg?.username) setUsername(stg.username);
        if (stg?.dark_mode !== undefined) setDarkMode(stg.dark_mode);
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    showToast('Berhasil keluar dari akun', 'info');
    navigate('/login');
  };

  const currentTitle = navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col md:flex-row font-sans`}>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            CV
          </div>
          <span className="font-bold text-lg text-white">CVKITA</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/u/${username}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-xs bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>CV</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 w-64 h-screen bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-blue-400 font-extrabold text-lg">
                  CV
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">CVKITA</h1>
                <span className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">Dashboard SaaS</span>
              </div>
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer / Public CV Quick Link */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-2">

          <a
            href={`/u/${username}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Lihat CV Publik</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-slate-100">{currentTitle}</h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/20 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>/u/{username}</span>
            </a>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">{user?.fullName || 'Pengguna'}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
