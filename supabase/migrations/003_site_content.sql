-- 003_site_content.sql
-- Additive, non-destructive. Adds editable site copy/settings, org
-- feature/ordering controls, and a public storage bucket for site images.
-- Safe for the shared FoodAssist database: nothing is dropped or renamed.

-- ──────────────────────────────────────────────────────────────────────────
-- 1. site_content: key/value store for editable copy + settings.
--    Keys that match an i18n MessageKey (e.g. 'hero.headline') override the
--    hardcoded dictionary on public pages. Keys prefixed 'settings.' are raw
--    settings (hero image url, sister-site url, …).
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.site_content (
  key         text primary key,
  value_en    text,
  value_es    text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

alter table public.site_content enable row level security;

drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select
  using (true);

drop policy if exists "site_content admin write" on public.site_content;
create policy "site_content admin write"
  on public.site_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────
-- 2. Organizations: feature + manual ordering controls.
-- ──────────────────────────────────────────────────────────────────────────
alter table public.organizations
  add column if not exists is_featured boolean not null default false;
alter table public.organizations
  add column if not exists display_order integer;

-- ──────────────────────────────────────────────────────────────────────────
-- 3. Public storage bucket for site images (hero photo, etc.).
-- ──────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "site-assets public read" on storage.objects;
create policy "site-assets public read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "site-assets admin write" on storage.objects;
create policy "site-assets admin write"
  on storage.objects for all
  using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());
