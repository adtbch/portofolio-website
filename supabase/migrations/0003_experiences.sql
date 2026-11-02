-- Tabel pengalaman magang, freelance, pekerjaan, dan organisasi.
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
