-- Tabel pendidikan.
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
