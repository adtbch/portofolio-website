-- Migration 0009: Add experience_id to projects (One-to-Many relation)
alter table public.projects
  add column if not exists experience_id uuid references public.experiences(id) on delete set null;

create index if not exists projects_experience_id_idx on public.projects (experience_id);
