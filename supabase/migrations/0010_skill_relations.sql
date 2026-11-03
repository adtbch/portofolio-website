-- Migration 0010: Skill junctions for projects and experiences
create table if not exists public.project_skills (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (project_id, skill_id)
);

create table if not exists public.experience_skills (
  experience_id uuid not null references public.experiences(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (experience_id, skill_id)
);

create index if not exists project_skills_skill_id_idx on public.project_skills (skill_id);
create index if not exists experience_skills_skill_id_idx on public.experience_skills (skill_id);
