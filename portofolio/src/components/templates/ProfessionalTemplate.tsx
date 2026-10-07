import React from 'react';
import { safeHref } from '../../utils/url';
import type { PublicCVData } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink, GitBranch, GraduationCap, Briefcase, Sparkles, FolderKanban, Share2 } from 'lucide-react';

export const ProfessionalTemplate: React.FC<{ data: PublicCVData }> = ({ data }) => {
  const { profile, educations, skills, experiences, portfolios, hobbies, social_links, settings } = data;
  const primaryColor = settings?.primary_color || '#2563EB';

  const showEmail = settings?.show_email !== false;
  const showPhone = settings?.show_phone !== false;
  const showHobbies = settings?.show_hobbies !== false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Sidebar Profile) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-center lg:text-left">
              {/* Photo */}
              <div className="w-32 h-32 rounded-2xl mx-auto lg:mx-0 overflow-hidden bg-slate-800 border-2 shadow-lg" style={{ borderColor: primaryColor }}>
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-400">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-white">{profile?.full_name || 'Nama Lengkap'}</h1>
                <p className="text-xs font-semibold mt-1" style={{ color: primaryColor }}>{profile?.headline}</p>
              </div>

              {profile?.about && (
                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">{profile.about}</p>
              )}

              {/* Contact list */}
              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
                {profile?.location && (
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {showEmail && profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 justify-center lg:justify-start hover:text-white truncate">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}
                {showPhone && profile?.phone && (
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.website && (
                  <a href={safeHref(profile.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 justify-center lg:justify-start text-blue-400 hover:underline truncate">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span className="truncate">{profile.website}</span>
                  </a>
                )}
              </div>

              {/* Social Links */}
              {social_links.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Social Media</span>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {social_links.map((s) => (
                      <a
                        key={s.id}
                        href={safeHref(s.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-300 border border-slate-700 flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3 text-blue-400" />
                        <span>{s.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {showHobbies && hobbies.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Minat / Hobi</span>
                  <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                    {hobbies.map((h) => (
                      <span key={h.id} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        {h.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Column (Experience, Portfolios, Skills, Education) */}
          <main className="lg:col-span-8 space-y-8">
            {/* PORTFOLIOS */}
            {portfolios.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                  <FolderKanban className="w-5 h-5" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-white">PORTFOLIO PROJECT</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolios.map((p) => (
                    <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      {p.image_url && (
                        <div className="h-32 rounded-xl overflow-hidden bg-slate-900">
                          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-white">{p.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>

                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-[9px] text-blue-300">
                          {p.technologies.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">{t}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2 text-xs">
                        {p.project_url && (
                          <a href={safeHref(p.project_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold hover:underline" style={{ color: primaryColor }}>
                            <ExternalLink className="w-3.5 h-3.5" /> Demo
                          </a>
                        )}
                        {p.github_url && (
                          <a href={safeHref(p.github_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-white">
                            <GitBranch className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EXPERIENCES */}
            {experiences.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                  <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-white">PENGALAMAN KERJA</h2>
                </div>

                <div className="space-y-6 border-l-2 border-slate-800 pl-4 ml-2">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative space-y-1">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900" style={{ backgroundColor: primaryColor }} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h3 className="text-base font-bold text-white">{exp.position}</h3>
                        <span className="text-xs text-slate-400">{exp.start_date} - {exp.is_current ? 'Sekarang' : exp.end_date}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: primaryColor }}>{exp.company}</p>
                      {exp.description && <p className="text-xs text-slate-400 pt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                  <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-white">KEAHLIAN & SKILL</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{s.name}</span>
                        <span className="text-slate-400">{s.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: primaryColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATIONS */}
            {educations.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                  <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-white">PENDIDIKAN</h2>
                </div>

                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-white">{edu.institution}</h3>
                        <p className="text-xs text-slate-300">{edu.degree} - {edu.major}</p>
                        {edu.description && <p className="text-xs text-slate-400 pt-1">{edu.description}</p>}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{edu.start_year} - {edu.end_year || 'Sekarang'}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
