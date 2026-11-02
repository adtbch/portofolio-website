-- Tabel karya/project portfolio.
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
