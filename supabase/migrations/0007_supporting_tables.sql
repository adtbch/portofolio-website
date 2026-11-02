-- Tabel pendukung: sosial, pengaturan situs, dan pesan kontak.
create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  platform varchar(40) not null,
  label varchar(60),
  url text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key varchar(80) primary key,
  value text,
  updated_at timestamptz not null default now()
);

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
