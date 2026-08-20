-- 008_resource_directory.sql
-- Additive, non-destructive. Adds the bilingual Resource Directory — the
-- committee's "Carteret County and Surrounding Area Resource Aide" booklet,
-- 25 need-based categories of local services.
--
-- This is a SEPARATE dataset from `organizations`. Organizations are partner
-- nonprofits the committee works with: they have accounts, volunteer needs,
-- and applications. Resources are service listings people look up when they
-- need help — a dentist, an apartment, a food pantry, a crisis line — with no
-- account and no volunteer pipeline. Keeping them apart means the booklet can
-- be reprinted verbatim without polluting the partner/volunteer flows.
--
-- Safe for the shared FoodAssist database: nothing is dropped or renamed.

-- ──────────────────────────────────────────────────────────────────────────
-- 1. resource_categories — the booklet's sections, in document order.
--    `sector_slug` optionally cross-links a category to one of the 13
--    AssistHub sectors. It is nullable on purpose: several categories
--    (mobile home parks, thrift stores, transportation) have no sector home.
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.resource_categories (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  name_es       text,
  description   text,
  description_es text,
  sector_slug   text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_resource_categories_order
  on public.resource_categories(display_order);
create index if not exists idx_resource_categories_sector
  on public.resource_categories(sector_slug);

-- ──────────────────────────────────────────────────────────────────────────
-- 2. resources — one row per booklet entry.
--    The source document packs each entry into three cells; the columns here
--    are the parsed form, so the site can render tel:/mailto:/map links.
--    `notes` keeps whatever prose the entry carried (hours, eligibility,
--    "call ahead") verbatim. `_es` columns hold the Spanish edition's text.
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.resources (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid not null references public.resource_categories(id) on delete cascade,
  name          text not null,
  name_es       text,
  address       text,
  address_es    text,
  town          text,
  website       text,
  phone         text,
  email         text,
  notes         text,
  notes_es      text,
  sector_slug   text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_resources_category
  on public.resources(category_id);
create index if not exists idx_resources_sector
  on public.resources(sector_slug);
create index if not exists idx_resources_order
  on public.resources(category_id, display_order);
create index if not exists idx_resources_town
  on public.resources(town);

-- ──────────────────────────────────────────────────────────────────────────
-- 3. updated_at triggers.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.touch_resource_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_touch_resource_categories on public.resource_categories;
create trigger trg_touch_resource_categories
  before update on public.resource_categories
  for each row execute function public.touch_resource_updated_at();

drop trigger if exists trg_touch_resources on public.resources;
create trigger trg_touch_resources
  before update on public.resources
  for each row execute function public.touch_resource_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- 4. Row-Level Security — public read, admin write. Matches site_content.
-- ──────────────────────────────────────────────────────────────────────────
alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;

drop policy if exists "resource_categories public read" on public.resource_categories;
create policy "resource_categories public read"
  on public.resource_categories for select
  using (is_active = true);

drop policy if exists "resource_categories admin write" on public.resource_categories;
create policy "resource_categories admin write"
  on public.resource_categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "resources public read" on public.resources;
create policy "resources public read"
  on public.resources for select
  using (is_active = true);

drop policy if exists "resources admin write" on public.resources;
create policy "resources admin write"
  on public.resources for all
  using (public.is_admin())
  with check (public.is_admin());
