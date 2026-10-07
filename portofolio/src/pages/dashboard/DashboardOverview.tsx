import React, { useEffect, useState } from 'react';
import { messageOf } from '../../lib/errors';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Briefcase, FolderKanban, CheckCircle2, Circle, Eye, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { educationService } from '../../services/educationService';
import { skillService } from '../../services/skillService';
import { experienceService } from '../../services/experienceService';
import { portfolioService } from '../../services/portfolioService';
import { socialService } from '../../services/socialService';
import { settingsService } from '../../services/settingsService';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import type { Profile, Education, Skill, Experience, Portfolio, SocialLink, UserSettings } from '../../types';

export const DashboardOverview: React.FC = () => {
  const { user, populateDemoData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const { showToast } = useToast();
  const [reloadKey, setReloadKey] = useState(0);
  const [seeding, setSeeding] = useState(false);

  const handleLoadDemo = async () => {
    try {
      setSeeding(true);
      await populateDemoData();
      showToast('Data demo berhasil dimuat.', 'success');
      setReloadKey((k) => k + 1);
    } catch (err) {
      showToast(messageOf(err, 'Gagal memuat data demo.'), 'error');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const [prof, edu, skl, exp, port, soc, stg] = await Promise.all([
          profileService.getProfile(user.id),
          educationService.getEducations(user.id),
          skillService.getSkills(user.id),
          experienceService.getExperiences(user.id),
          portfolioService.getPortfolios(user.id),
          socialService.getSocialLinks(user.id),
          settingsService.getSettings(user.id),
        ]);
        setProfile(prof);
        setEducations(edu);
        setSkills(skl);
        setExperiences(exp);
        setPortfolios(port);
        setSocials(soc);
        setSettings(stg);
      } catch (err) {
        showToast(messageOf(err, 'Gagal memuat data dashboard.'), 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reloadKey]);

  // Completeness check
  const checklist = [
    { label: 'Foto profile', done: Boolean(profile?.photo_url), link: '/dashboard/profile' },
    { label: 'Nama lengkap', done: Boolean(profile?.full_name), link: '/dashboard/profile' },
    { label: 'Tentang saya', done: Boolean(profile?.about), link: '/dashboard/profile' },
    { label: 'Skill', done: skills.length > 0, link: '/dashboard/skills' },
    { label: 'Pendidikan', done: educations.length > 0, link: '/dashboard/education' },
    { label: 'Portfolio', done: portfolios.length > 0, link: '/dashboard/portfolio' },
    { label: 'Social media', done: socials.length > 0, link: '/dashboard/social' },
  ];

  const completedCount = checklist.filter((item) => item.done).length;
  const percentage = Math.round((completedCount / checklist.length) * 100);

  const username = settings?.username ?? '';

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SaaS CV Builder Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat datang, {profile?.full_name || user?.fullName || 'Pengguna'}! 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              CV & Portfolio online kamu dapat diakses publik kapan saja melalui link berikut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/profile"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold shadow-lg transition-transform hover:scale-105"
            >
              Lengkapi Profil
            </Link>
            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Lihat CV Publik</span>
            </a>
          </div>
        </div>
      </div>

      {/* Profile Completeness Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100">Kelengkapan Profil</h3>
            <p className="text-xs text-slate-400">Semakin lengkap profil kamu, semakin profesional tampilan CV publikmu.</p>
          </div>
          <span className="text-xl font-extrabold text-blue-400">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {checklist.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                item.done
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Metrics & Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pendidikan</span>
            <div className="text-2xl font-bold text-white mt-1">{educations.length} Item</div>
            <Link to="/dashboard/education" className="text-[11px] text-blue-400 hover:underline mt-2 inline-block">
              Kelola Pendidikan →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Skill Terdaftar</span>
            <div className="text-2xl font-bold text-white mt-1">{skills.length} Skill</div>
            <Link to="/dashboard/skills" className="text-[11px] text-blue-400 hover:underline mt-2 inline-block">
              Kelola Skill →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pengalaman Kerja</span>
            <div className="text-2xl font-bold text-white mt-1">{experiences.length} Posisi</div>
            <Link to="/dashboard/experience" className="text-[11px] text-blue-400 hover:underline mt-2 inline-block">
              Kelola Pengalaman →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Proyek Portfolio</span>
            <div className="text-2xl font-bold text-white mt-1">{portfolios.length} Proyek</div>
            <Link to="/dashboard/portfolio" className="text-[11px] text-blue-400 hover:underline mt-2 inline-block">
              Kelola Portfolio →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Demo Data Quick Prompt */}
      {skills.length === 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-200">Ingin melihat contoh CV yang sudah lengkap?</h4>
              <p className="text-xs text-amber-300/80">Klik tombol berikut untuk mengisi otomatis data profil Adam Malik (Teknik Informatika & Web Developer).</p>
            </div>
          </div>
          <button
            onClick={handleLoadDemo}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
          >
            {seeding ? 'Memuat...' : 'Muat Data Demo'}
          </button>
        </div>
      )}
    </div>
  );
};
