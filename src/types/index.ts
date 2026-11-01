export type ProjectCategory = "web" | "backend" | "iot" | "fullstack";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: ProjectCategory | null;
  description: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_public_id: string | null;
  gallery: string[] | null;
  challenge: string | null;
  solution: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ExperienceType = "internship" | "freelance" | "fulltime" | "organization";

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: ExperienceType | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string[] | null;
  tech_stack: string[] | null;
  sort_order: number;
  published: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string | null;
  description: string | null;
  gpa: string | null;
  sort_order: number;
  published: boolean;
}

export type SkillGroup = "languages" | "frameworks" | "databases" | "tools" | "others";

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  icon_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_at: string | null;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface Social {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
  published: boolean;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}
