import React from 'react';
import { safeHref } from '../../utils/url';
import type { PublicCVData } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink, GitBranch, GraduationCap, Briefcase, Sparkles, Heart, FolderKanban, Share2 } from 'lucide-react';

export const ModernTemplate: React.FC<{ data: PublicCVData }> = ({ data }) => {
  const { profile, educations, skills, experiences, portfolios, hobbies, social_links, settings } = data;
  const primaryColor = settings?.primary_color || '#2563EB';

  const showEmail = settings?.show_email !== false;
  const showPhone = settings?.show_phone !== false;
  const showHobbies = settings?.show_hobbies !== false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Header / Hero Section */}
      <header className="relative bg-slate-900/90 border-b border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl p-1 border-2"
              style={{ borderColor: primaryColor }}
            >
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-4xl text-slate-400 rounded-2xl">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 text-white"
                style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
              >
                PUBLIC CV & PORTFOLIO
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {profile?.full_name || 'Nama Lengkap'}
              </h1>
              <p className="text-lg font-semibold text-slate-300 mt-1">{profile?.headline}</p>
            </div>

            {profile?.about && (
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{profile.about}</p>
            )}

            {/* Quick Contact & Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-2">
              {profile?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {showEmail && profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{profile.email}</span>
                </a>
              )}
              {showPhone && profile?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile?.website && (
                <a href={safeHref(profile.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:underline">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {social_links.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                {social_links.map((sl) => (
                  <a
                    key={sl.id}
                    href={safeHref(sl.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>{sl.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* PORTFOLIO PROJECTS SECTION (Featured) */}
        {portfolios.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PROJECT & PORTFOLIO</h2>
                <p className="text-xs text-slate-400">Karya dan hasil proyek pilihan terbaik.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  {p.image_url && (
                    <div className="h-44 bg-slate-950 overflow-hidden">
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{p.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">{p.description}</p>
                    </div>

                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {p.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs">
                      {p.project_url && (
                        <a href={safeHref(p.project_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold hover:underline" style={{ color: primaryColor }}>
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Lihat Project</span>
                        </a>
                      )}
                      {p.github_url && (
                        <a href={safeHref(p.github_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-white">
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {skills.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">KEAHLIAN & SKILL</h2>
                <p className="text-xs text-slate-400">Tingkat kemampuan teknis dan alat pengembangan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="font-semibold text-slate-400">{s.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.percentage}%`, backgroundColor: primaryColor }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PENGALAMAN KERJA</h2>
                <p className="text-xs text-slate-400">Jejak karir dan peran profesional.</p>
              </div>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 w-max">
                      {exp.start_date} - {exp.is_current ? 'Sekarang' : exp.end_date}
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: primaryColor }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-slate-400 pt-2 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {educations.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PENDIDIKAN</h2>
                <p className="text-xs text-slate-400">Latar belakang akademik dan studi.</p>
              </div>
            </div>

            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 w-max">
                      {edu.start_year} - {edu.end_year || 'Sekarang'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{edu.degree} - {edu.major}</p>
                  {edu.description && <p className="text-xs text-slate-400 pt-1 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HOBBIES SECTION */}
        {showHobbies && hobbies.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Hobi & Minat</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((h) => (
                <span key={h.id} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                  {h.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

