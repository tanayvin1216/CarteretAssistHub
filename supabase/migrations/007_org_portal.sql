-- 007_org_portal.sql
-- Additive, non-destructive. Completes the organization portal: an org that
-- signs in at /portal can now read and edit its own listing and manage its own
-- volunteer roles, on top of the applications access granted in 006.
--
-- Before this, an organization account could log in and see the applications
-- addressed to it and nothing else — every listing correction and every new
-- volunteer role still had to go through the county advisor by email, which is
-- the bottleneck the portal exists to remove.
--
-- Three things happen here:
--   1. a helper naming the org the caller represents (reusing 006's lookup)
--   2. select + update on that org's own row in `organizations`, and full
--      control of that org's rows in `volunteer_needs`
--   3. a guard trigger pinning the columns that stay the county's call
--
-- `organizations` and `volunteer_needs` are shared with FoodAssist. Everything
-- added here is a new, separately-named policy or trigger — no existing policy
-- is dropped or rewritten, and FoodAssist's own rows are unaffected because
-- the predicates key off profiles.organization_id, which FoodAssist already
-- populates for its own org accounts. A FoodAssist org account therefore gains
-- the same self-service over its own row, which is the intent on both sites.

-- ──────────────────────────────────────────────────────────────────────────
-- 1. Helper: does the caller represent this organization?
--    Thin wrapper over 006's assisthub_current_org_id() so the policies below
--    read as an ownership question rather than an id comparison, and so the
--    null case (a caller representing no org) is rejected in one place.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.assisthub_org_can_edit(p_organization_id uuid)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public', 'pg_temp'
as $$
  select coalesce(
    public.assisthub_current_org_id() is not null
      and p_organization_id = public.assisthub_current_org_id(),
    false
  );
$$;

revoke all on function public.assisthub_org_can_edit(uuid) from public;
grant execute on function public.assisthub_org_can_edit(uuid) to authenticated;

-- ──────────────────────────────────────────────────────────────────────────
-- 2. Policies.
--
--    Read is granted separately from update rather than folding both into a
--    FOR ALL policy: an org that hides its own listing (is_active = false)
--    would otherwise fall out of the public-read policy and lose sight of the
--    row it just hid, with no way back. FOR ALL would also hand out insert and
--    delete, and an org creating or destroying `organizations` rows is the
--    county's call, not theirs.
--
--    Scoped `to authenticated` so the anon role never evaluates the helpers —
--    anon has no execute grant on them, and that would raise a permission
--    error on ordinary public reads rather than simply not matching.
-- ──────────────────────────────────────────────────────────────────────────
drop policy if exists "Orgs read their own listing" on public.organizations;
create policy "Orgs read their own listing"
  on public.organizations for select
  to authenticated
  using (public.assisthub_org_can_edit(id));

drop policy if exists "Orgs update their own listing" on public.organizations;
create policy "Orgs update their own listing"
  on public.organizations for update
  to authenticated
  using (public.assisthub_org_can_edit(id))
  with check (public.assisthub_org_can_edit(id));

-- Volunteer roles are wholly the org's to post, edit, close, and delete.
drop policy if exists "Orgs manage their own volunteer needs" on public.volunteer_needs;
create policy "Orgs manage their own volunteer needs"
  on public.volunteer_needs for all
  to authenticated
  using (public.assisthub_org_can_edit(organization_id))
  with check (public.assisthub_org_can_edit(organization_id));

-- ──────────────────────────────────────────────────────────────────────────
-- 3. Guard trigger: which columns an org may not move on its own row.
--
--    RLS is row-level; it cannot say "you may edit your hours but not your
--    placement." Without this, the update policy above would let any org set
--    is_featured = true and pin itself to the top of the public directory, or
--    re-tag itself into a sector its subcommittee never vetted. Placement and
--    sector assignment are editorial decisions belonging to the committee, so
--    an org's own update silently carries the old values forward for them.
--
--    Admins (either site's) and the service role pass straight through:
--    assisthub_current_org_id() is null for them, so the ownership test fails
--    and nothing is pinned.
--
--    Named to sort after trg_zz_enforce_sector_partition (002) so it has the
--    last word — Postgres fires BEFORE triggers in name order.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.assisthub_guard_org_self_edit()
returns trigger as $$
begin
  if public.assisthub_current_org_id() is distinct from old.id then
    return new;
  end if;

  new.is_featured             := old.is_featured;
  new.display_order           := old.display_order;
  new.sector_id               := old.sector_id;
  new.sector_slug             := old.sector_slug;
  new.additional_sector_slugs := old.additional_sector_slugs;
  new.sector                  := old.sector;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_zzz_guard_org_self_edit on public.organizations;
create trigger trg_zzz_guard_org_self_edit
  before update on public.organizations
  for each row execute function public.assisthub_guard_org_self_edit();

-- ──────────────────────────────────────────────────────────────────────────
-- 4. Supporting index — every portal request resolves the caller's org
--    through profiles.organization_id.
-- ──────────────────────────────────────────────────────────────────────────
create index if not exists idx_profiles_organization
  on public.profiles (organization_id)
  where organization_id is not null;
