export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  about: string;
  photo_url: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  major: string;
  degree: string;
  start_year: number;
  end_year?: number | null;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  level: string; // e.g. 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Hobby {
  id: string;
  user_id: string;
  name: string;
  icon?: string;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string; // e.g. 'GitHub', 'LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube', 'Website'
  url: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  username: string;
  template: 'modern' | 'minimal' | 'professional';
  primary_color: string;
  dark_mode: boolean;
  show_email: boolean;
  show_phone: boolean;
  show_hobbies: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PublicCVData {
  profile: Profile | null;
  educations: Education[];
  skills: Skill[];
  experiences: Experience[];
  portfolios: Portfolio[];
  hobbies: Hobby[];
  social_links: SocialLink[];
  settings: UserSettings | null;
}
