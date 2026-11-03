-- Migration 0012: Hero and About editable settings tables
create table if not exists public.hero_settings (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null default 'Aditya Bachtiar',
  role varchar(150) not null default 'Backend Developer & Robotics Engineer',
  description text not null default '',
  cta_primary_label varchar(50) not null default 'Lihat Karya',
  cta_primary_href varchar(150) not null default '#works',
  cta_secondary_label varchar(50) not null default 'Hubungi',
  cta_secondary_href varchar(150) not null default '#contact',
  image_url text,
  image_public_id varchar(255),
  available boolean not null default true,
  available_text varchar(80) not null default 'Tersedia untuk bekerja',
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.about_settings (
  id uuid primary key default gen_random_uuid(),
  heading varchar(150) not null default 'Tentang Saya',
  title varchar(150) not null default 'Backend Developer & Robotics Engineer',
  body_left text not null default '',
  body_right text not null default '',
  cta_label varchar(50),
  cta_href varchar(150),
  updated_at timestamptz not null default now()
);

insert into public.hero_settings (name, role, description)
values (
  'Aditya Bachtiar',
  'Backend Developer & Robotics Engineer',
  'Backend Developer & Robotics Engineer berbasis di Jawa Tengah, fokus pada pengembangan backend, sistem embedded, IoT, dan aplikasi web.'
)
on conflict do nothing;

insert into public.about_settings (heading, title, body_left, body_right, cta_label, cta_href)
values (
  'Tentang Saya',
  'Backend Developer & Robotics Engineer',
  'Lulusan Teknik Informatika Universitas Islam Sultan Agung dengan pengalaman dalam pengembangan perangkat lunak, backend, embedded system, dan robotika.',
  'Terbiasa menggunakan C/C++, Python, Golang, PHP, SQL, ESP32, dan berbagai teknologi pengembangan perangkat lunak.',
  'Lihat Profil Lengkap',
  '#'
)
on conflict do nothing;
