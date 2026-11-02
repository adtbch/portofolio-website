-- Trigger updated_at.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();

-- RLS aktif pada seluruh tabel.
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certificates enable row level security;
alter table public.socials enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projects','experiences','education','skills','certificates','socials'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published = true)', t);
  end loop;
end $$;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Write admin memakai service_role; service_role melewati RLS.
