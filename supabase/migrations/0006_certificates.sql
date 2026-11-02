-- Tabel prestasi dan sertifikasi.
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
