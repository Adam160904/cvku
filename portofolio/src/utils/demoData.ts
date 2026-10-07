import type { Profile, Education, Skill, Experience, Portfolio, Hobby, SocialLink, UserSettings } from '../types';

export const DEMO_PROFILE: Omit<Profile, 'id' | 'user_id'> = {
  full_name: 'Adam Malik',
  headline: 'Mahasiswa Teknik Informatika & Web Developer',
  about: 'Mahasiswa Teknik Informatika yang memiliki minat tinggi dalam pengembangan web full-stack, software engineering, dan teknologi digital. Berpengalaman membangun aplikasi web modern yang cepat, responsive, dan user-friendly.',
  photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  location: 'Bandung, Indonesia',
  email: 'adam.malik@example.com',
  phone: '+62 812-3456-7890',
  website: 'https://github.com/adammalik',
};

export const DEMO_EDUCATIONS: Omit<Education, 'id' | 'user_id'>[] = [
  {
    institution: 'Universitas Teknologi Bandung',
    degree: 'Sarjana (S1)',
    major: 'Teknik Informatika',
    start_year: 2022,
    end_year: 2026,
    description: 'Fokus pada Software Engineering, Basis Data, Algoritma, dan Pemrograman Web. Aktif di Himpunan Mahasiswa Informatika.',
  },
  {
    institution: 'SMA Negeri 1 Bandung',
    degree: 'SMA',
    major: 'MIPA',
    start_year: 2019,
    end_year: 2022,
    description: 'Lulus dengan nilai kejuruan sains yang memuaskan dan aktif dalam ekstrakurikuler Komputer & Fotografi.',
  }
];

export const DEMO_SKILLS: Omit<Skill, 'id' | 'user_id'>[] = [
  { name: 'React', level: 'Expert', percentage: 90 },
  { name: 'TypeScript', level: 'Advanced', percentage: 85 },
  { name: 'Tailwind CSS', level: 'Expert', percentage: 92 },
  { name: 'Supabase', level: 'Advanced', percentage: 80 },
  { name: 'Python', level: 'Intermediate', percentage: 75 },
  { name: 'Node.js / Express', level: 'Intermediate', percentage: 78 },
  { name: 'PostgreSQL', level: 'Advanced', percentage: 82 },
  { name: 'Git & GitHub', level: 'Expert', percentage: 88 }
];

export const DEMO_EXPERIENCES: Omit<Experience, 'id' | 'user_id'>[] = [
  {
    company: 'Solusi Digital Kreatif',
    position: 'Frontend Developer Intern',
    start_date: '2024-06-01',
    end_date: '2024-12-31',
    is_current: false,
    description: 'Mengembangkan antarmuka aplikasi web manajemen inventory menggunakan React, Redux, dan Tailwind CSS. Meningkatkan kecepatan loading halaman sebesar 35%.',
  },
  {
    company: 'Freelance Software Developer',
    position: 'Full-Stack Web Developer',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true,
    description: 'Membangun lebih dari 10+ proyek landing page, dashboard admin, dan e-commerce untuk UMKM dan startup lokal.',
  }
];

export const DEMO_PORTFOLIOS: Omit<Portfolio, 'id' | 'user_id'>[] = [
  {
    title: 'FINORA - Finance Management App',
    description: 'Aplikasi manajemen keuangan pribadi yang membantu pencatatan transaksi harian, analisis pengeluaran bulanan, dan perencanaan anggaran berbasis grafik interaktif.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://finora-demo.vercel.app',
    github_url: 'https://github.com/adammalik/finora-app',
    technologies: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Chart.js'],
  },
  {
    title: 'CVKITA - Portfolio Builder SaaS',
    description: 'Platform pembuatan CV dan portfolio publik modern dengan sistem custom domain/slug, 3 pilihan template profesional, serta integrasi Supabase Auth & Storage.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://cvkita.vercel.app',
    github_url: 'https://github.com/adammalik/cvkita-saas',
    technologies: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  },
  {
    title: 'DevMetrics - Productivity Dashboard',
    description: 'Dashboard analitik waktu nyata untuk pengembang perangkat lunak untuk melacak commits, pull requests, dan jam produktivitas kerja.',
    image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://devmetrics-demo.vercel.app',
    github_url: 'https://github.com/adammalik/devmetrics',
    technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'Recharts'],
  }
];

export const DEMO_HOBBIES: Omit<Hobby, 'id' | 'user_id'>[] = [
  { name: 'Programming', icon: 'Code' },
  { name: 'Gaming', icon: 'Gamepad2' },
  { name: 'Reading Tech Blogs', icon: 'BookOpen' },
  { name: 'Photography', icon: 'Camera' }
];

export const DEMO_SOCIAL_LINKS: Omit<SocialLink, 'id' | 'user_id'>[] = [
  { platform: 'GitHub', url: 'https://github.com/adammalik' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/adammalik' },
  { platform: 'Instagram', url: 'https://instagram.com/adammalik' },
  { platform: 'X', url: 'https://x.com/adammalik_dev' }
];

export const DEMO_SETTINGS: Omit<UserSettings, 'id' | 'user_id'> = {
  username: 'adam-malik',
  template: 'modern',
  primary_color: '#2563EB',
  dark_mode: false,
  show_email: true,
  show_phone: true,
  show_hobbies: true,
};
