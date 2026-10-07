import React from 'react';
import { safeHref } from '../../utils/url';
import type { PublicCVData } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink, GitBranch } from 'lucide-react';

export const MinimalTemplate: React.FC<{ data: PublicCVData }> = ({ data }) => {
  const { profile, educations, skills, experiences, portfolios, hobbies, social_links, settings } = data;
  const primaryColor = settings?.primary_color || '#2563EB';

  const showEmail = settings?.show_email !== false;
  const showPhone = settings?.show_phone !== false;
  const showHobbies = settings?.show_hobbies !== false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono pb-24 selection:bg-slate-800">
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16">
        {/* Minimal Header */}
        <header className="space-y-6 border-b border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white font-sans">
                {profile?.full_name || 'Nama Lengkap'}
              </h1>
              <p className="text-base font-semibold" style={{ color: primaryColor }}>
                {profile?.headline}
              </p>
            </div>

            {profile?.photo_url && (
              <img
                src={profile.photo_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-800 shrink-0"
              />
            )}
          </div>

          {profile?.about && (
            <p className="text-xs leading-relaxed text-slate-400 font-sans max-w-2xl">{profile.about}</p>
          )}

          {/* Contact details */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-slate-900">
            {profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.location}
              </span>
            )}
            {showEmail && profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {profile.email}
              </a>
            )}
            {showPhone && profile?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> {profile.phone}
              </span>
            )}
            {profile?.website && (
              <a href={safeHref(profile.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:underline">
                <Globe className="w-3.5 h-3.5" /> {profile.website}
              </a>
            )}
          </div>

          {/* Social Links */}
          {social_links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {social_links.map((s) => (
                <a
                  key={s.id}
                  href={safeHref(s.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-300 hover:underline border-b border-slate-700 pb-0.5"
                >
                  [{s.platform}]
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Projects Section */}
        {portfolios.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">// PORTFOLIO_PROJECTS</h2>
            <div className="space-y-6">
              {portfolios.map((p) => (
                <div key={p.id} className="border border-slate-800 rounded-xl p-5 bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-sans">{p.title}</h3>
                    <div className="flex items-center gap-3 text-xs">
                      {p.project_url && (
                        <a href={safeHref(p.project_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                      {p.github_url && (
                        <a href={safeHref(p.github_url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-white">
                          <GitBranch className="w-3 h-3" /> Code
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{p.description}</p>

                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 pt-1">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">// TECHNICAL_SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                  {s.name} <span className="text-slate-500">({s.percentage}%)</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">// WORK_EXPERIENCE</h2>
            <div className="space-y-6 border-l border-slate-800 pl-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <div className="flex justify-between items-baseline text-xs text-slate-400">
                    <span className="font-bold text-white text-sm font-sans">{exp.position}</span>
                    <span>{exp.start_date} ~ {exp.is_current ? 'Present' : exp.end_date}</span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: primaryColor }}>{exp.company}</div>
                  {exp.description && <p className="text-xs text-slate-400 font-sans pt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">// EDUCATION</h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start text-xs border-b border-slate-900 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm font-sans">{edu.institution}</h3>
                    <p className="text-slate-400">{edu.degree} - {edu.major}</p>
                  </div>
                  <span className="text-slate-500 shrink-0">{edu.start_year} - {edu.end_year || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies Section */}
        {showHobbies && hobbies.length > 0 && (
          <section className="space-y-2 pt-4 border-t border-slate-900">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">// INTERESTS</h2>
            <p className="text-xs text-slate-400">{hobbies.map((h) => h.name).join(' • ')}</p>
          </section>
        )}
      </div>
    </div>
  );
};

