-- Tabel keahlian.
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
