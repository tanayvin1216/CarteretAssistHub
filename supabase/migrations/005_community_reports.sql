-- 005_community_reports.sql
-- Additive, non-destructive. Adds the public "report a need" intake: residents
-- flag an incorrect/closed listing, an unmet need in the county, or anything
-- else the committee should know. Reviewed by Assist Hub admins at
-- /admin/reports. Safe for the shared FoodAssist database.

-- ──────────────────────────────────────────────────────────────────────────
-- 1. Table.
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.community_reports (
  id              uuid primary key default uuid_generate_v4(),
  report_type     text not null
    check (report_type in ('listing_issue', 'unmet_need', 'other')),
  sector_slug     text,
  organization_id uuid references public.organizations(id) on delete set null,
  details         text not null,
  reporter_name   text,
  reporter_email  text,
  reporter_phone  text,
  status          text not null default 'new'
    check (status in ('new', 'reviewing', 'resolved', 'dismissed')),
  review_notes    text,
  reviewed_by     uuid references auth.users(id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_community_reports_status
  on public.community_reports (status, created_at desc);
create index if not exists idx_community_reports_org
  on public.community_reports (organization_id);

-- ──────────────────────────────────────────────────────────────────────────
-- 2. RLS. Anyone may file a report; only Assist Hub admins may read them —
--    reports carry resident contact details, so there is no public select.
--    New rows are pinned to status 'new' so the intake cannot self-resolve.
-- ──────────────────────────────────────────────────────────────────────────
alter table public.community_reports enable row level security;

drop policy if exists "community_reports public insert" on public.community_reports;
create policy "community_reports public insert"
  on public.community_reports for insert
  with check (status = 'new');

drop policy if exists "Admins full access community reports" on public.community_reports;
create policy "Admins full access community reports"
  on public.community_reports for all
  using (public.is_assisthub_admin())
  with check (public.is_assisthub_admin());
