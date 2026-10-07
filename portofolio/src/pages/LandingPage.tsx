import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, ArrowRight, FolderKanban, ShieldCheck, Palette, Eye, Globe, Layout } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 space-y-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-16 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          {/* Subtle glowing backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-400 shadow-xl animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SaaS Platform CV & Portfolio Builder #1 Indonesia</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bangun CV dan Portfolio{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Profesionalmu.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Buat CV online, tampilkan project terbaikmu, dan bagikan profil profesionalmu dalam satu link mudah.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-2xl shadow-blue-600/35 transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/u/adam-malik"
              className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-sm font-semibold border border-slate-800 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Lihat Demo CV Publik</span>
            </Link>
          </div>

          {/* Hero Mockup Preview Card */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl shadow-blue-900/20 backdrop-blur-xl overflow-hidden group">
              <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-blue-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  cvkita.com/u/adam-malik
                </span>
                <span className="hidden sm:inline text-emerald-400 font-semibold">● Active SaaS</span>
              </div>

              {/* Mockup Preview Content */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                <div className="md:col-span-4 space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Adam Malik"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Adam Malik</h3>
                    <p className="text-xs text-blue-400 font-medium">Mahasiswa Teknik Informatika & Web Developer</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Berpengalaman membangun aplikasi web full-stack yang cepat dan responsive.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">React</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">TypeScript</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">Supabase</span>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">// FEATURED_PROJECT</span>
                      <span className="text-xs text-blue-400 font-mono">FINORA APP</span>
                    </div>
                    <h4 className="text-base font-bold text-white">FINORA - Finance Management Application</h4>
                    <p className="text-xs text-slate-400">
                      Aplikasi manajemen keuangan pribadi berbasis React & Supabase dengan analitik grafik waktu nyata.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block">EXPERIENCE</span>
                      <span className="text-xs font-bold text-white">Frontend Developer Intern</span>
                      <span className="text-[10px] text-slate-400 block">Solusi Digital Kreatif</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block">EDUCATION</span>
                      <span className="text-xs font-bold text-white">S1 Teknik Informatika</span>
                      <span className="text-[10px] text-slate-400 block">Univ Teknologi Bandung</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CARA KERJA SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Cara Kerja CVKITA</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Hanya dalam 3 langkah praktis, profil profesionalmu siap dipublikasikan ke dunia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 text-center relative group hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Daftar & Login Akun</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Registrasi cepat menggunakan email dan nama lengkapmu. Keamanan didukung Supabase Auth.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 text-center relative group hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Isi Profil & Portfolio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lengkapi riwayat pendidikan, skill, pengalaman kerja, serta screenshot project aplikasi terbaikmu.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 text-center relative group hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Bagikan Link Publik</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dapatkan URL unik /u/nama-kamu yang dapat dilampirkan pada resume, email, atau profil LinkedIn.
              </p>
            </div>
          </div>
        </section>

        {/* FITUR UNGGULAN SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Fitur SaaS Terlengkap</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Semua yang kamu butuhkan untuk memamerkan reputasi dan hasil karyamu secara profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Custom Username URL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih username unik yang mewakili identitasmu. Bebas dari karakter acak yang membingungkan.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3 Pilihan Template Premium</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bebas ganti antara template Modern, Minimal, atau Executive Professional tanpa perlu mengubah data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Portfolio Project Showcase</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tampilkan screenshot aplikasi, deskripsi, teknologi yang digunakan, serta link demo & GitHub.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Supabase Row Level Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Data milikmu terlindungi sepenuhnya. Hanya kamu yang berhak mengubah dan memperbarui informasimu.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Kustomisasi Warna Aksen</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sesuaikan warna utama CV publikmu dengan preferensi personalmu secara langsung.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cetak & Export PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dapat langsung dicetak atau disimpan sebagai dokumen PDF fisik melalui tombol print instan.
              </p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
            <div className="space-y-3 max-w-2xl mx-auto relative z-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Siap Membangun CV & Portfolio Impianmu?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Daftar sekarang dan mulailah membuat profil publik profesionalmu dalam waktu kurang dari 5 menit.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-base hover:bg-slate-100 transition-all shadow-xl hover:scale-105"
              >
                <span>Mulai Sekarang — Gratis</span>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
