-- Portofolio Adit - initial schema
-- Run in Supabase SQL Editor or `supabase db push`

create extension if not exists "pgcrypto";

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug varchar(150) not null unique,
  title varchar(150) not null,
  subtitle varchar(200),
  category varchar(50),
  description text,
  content text,
  cover_image_url text,
  cover_public_id varchar(255),
  gallery text[],
  challenge text,
  solution text,
  tech_stack text[],
  live_url text,
  repo_url text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_published_idx on public.projects (published, sort_order);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;

-- experiences
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company varchar(150) not null,
  role varchar(150) not null,
  type varchar(30) check (type in ('internship','freelance','fulltime','organization')),
  location varchar(150),
  start_date date not null,
  end_date date,
  description text[],
  tech_stack text[],
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists experiences_published_idx on public.experiences (published, sort_order);

-- education
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution varchar(200) not null,
  degree varchar(200) not null,
  period varchar(50),
  description text,
  gpa varchar(20),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null,
  "group" varchar(40) not null check ("group" in ('languages','frameworks','databases','tools','others')),
  icon_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists skills_published_idx on public.skills (published, "group", sort_order);

-- certificates
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  issuer varchar(150) not null,
  issued_at date,
  credential_url text,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- socials
create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  platform varchar(40) not null,
  label varchar(60),
  url text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- site_settings
create table if not exists public.site_settings (
  key varchar(80) primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- contact_messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  email varchar(150) not null,
  message text not null,
  status varchar(20) not null default 'unread' check (status in ('unread','read','archived')),
  ip_address varchar(45),
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();

-- RLS
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certificates enable row level security;
alter table public.socials enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projects','experiences','education','skills','certificates','socials'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published = true)', t);
  end loop;
end $$;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

-- no public select on contact_messages; insert only
drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- rate limit: enforced in the server action (per-IP), not in RLS.
-- service_role bypasses RLS for admin operations.
