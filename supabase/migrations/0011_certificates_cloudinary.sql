-- Migration 0011: Cloudinary public_ids for certificates and projects gallery
alter table public.certificates
  add column if not exists image_public_id varchar(255);

alter table public.projects
  add column if not exists gallery_public_ids text[];
