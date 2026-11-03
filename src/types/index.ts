export type ProjectCategory = "web" | "backend" | "iot" | "fullstack" | "mobile";

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
  images: ProjectImage[];
  challenge: string | null;
  solution: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  experience_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  url: string;
  alt: string;
  public_id?: string;
}

export type ExperienceType = "internship" | "freelance" | "fulltime" | "organization";

export interface Experience {
  id: string;
  company: string;
  role: string;
  logo_url?: string | null;
  logo_public_id?: string | null;
  type: ExperienceType | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string[] | null;
  tech_stack: string[] | null;
  sort_order: number;
  published: boolean;
  projects: Project[];
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

export type SkillGroup = "languages" | "frameworks" | "databases" | "tools" | "embedded";

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  icon_url: string | null;
  icon_public_id?: string | null;
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
  image_public_id?: string | null;
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
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface HeroSettings {
  id: string;
  name: string;
  role: string;
  description: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  image_url: string | null;
  image_public_id: string | null;
  available: boolean;
  available_text: string;
  sort_order: number;
  published: boolean;
  updated_at: string;
}

export interface AboutSettings {
  id: string;
  heading: string;
  title: string;
  body_left: string;
  body_right: string;
  cta_label: string | null;
  cta_href: string | null;
  updated_at: string;
}
