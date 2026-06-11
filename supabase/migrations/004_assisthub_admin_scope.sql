-- 004_assisthub_admin_scope.sql
-- Per-site admin scoping for Assist Hub on the shared FoodAssist database.
--
-- Problem: admin was a single global flag (profiles.role = 'admin'); every
-- admin could administer both sites. We want ONLY Assist Hub's own admins
-- (Tanay + Sujata) to manage Assist Hub, while FoodAssist admins keep their
-- access to the shared/FoodAssist tables.
--
-- Approach (additive, non-destructive to FoodAssist):
--   • new profiles.assisthub_admin flag (FoodAssist never reads it)
--   • is_assisthub_admin() helper
--   • re-scope write policies on Assist-Hub-EXCLUSIVE tables only.
-- Shared tables (organizations, profiles) and FoodAssist tables
-- (council_donations, pdf_archives, site_settings, page_views) keep is_admin().

-- ──────────────────────────────────────────────────────────────────────────
-- 1. Flag + grants. Default false → no one gains Assist Hub admin implicitly.
-- ──────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists assisthub_admin boolean not null default false;

update public.profiles
  set assisthub_admin = true
  where lower(email) in ('tanayvinaykya16@gmail.com', 'sujunaik@gmail.com');

-- ──────────────────────────────────────────────────────────────────────────
-- 2. Helper, mirroring is_admin() but reading the Assist Hub flag.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.is_assisthub_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public', 'pg_temp'
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and assisthub_admin = true
  );
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- 3. Re-scope admin write policies on Assist-Hub-exclusive tables.
--    Each keeps its name + ALL command; public-read policies are untouched,
--    as are public volunteer-application INSERT policies.
-- ──────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins manage sectors" on public.sectors;
create policy "Admins manage sectors" on public.sectors
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());

drop policy if exists "Admins manage activities" on public.sector_activities;
create policy "Admins manage activities" on public.sector_activities
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());

drop policy if exists "Admins manage leads" on public.subcommittee_leads;
create policy "Admins manage leads" on public.subcommittee_leads
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());

drop policy if exists "Admins full access volunteer needs" on public.volunteer_needs;
create policy "Admins full access volunteer needs" on public.volunteer_needs
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());

drop policy if exists "Admins full access volunteer applications" on public.volunteer_applications;
create policy "Admins full access volunteer applications" on public.volunteer_applications
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());

drop policy if exists "site_content admin write" on public.site_content;
create policy "site_content admin write" on public.site_content
  for all using (public.is_assisthub_admin()) with check (public.is_assisthub_admin());
