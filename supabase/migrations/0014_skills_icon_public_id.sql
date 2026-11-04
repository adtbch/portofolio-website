-- Tambah kolom public_id untuk icon skill (dipakai untuk hapus file lama di Cloudinary).
alter table public.skills add column if not exists icon_public_id text;
