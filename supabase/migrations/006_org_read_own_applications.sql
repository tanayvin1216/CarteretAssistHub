-- 006_org_read_own_applications.sql
-- Additive, non-destructive. Gives an organization full control over the
-- volunteer applications addressed to it — the ones people submit from that
-- org's listing or from one of its volunteer roles — and nothing else.
--
-- Until now the only policy on volunteer_applications was "Admins full access
-- volunteer applications" (004), so every application belonged to Assist Hub
-- admins alone and an org had to go through the county advisor to hear about,
-- or act on, its own volunteers.
--
-- After this: admins keep access to everything; an org gets select, insert,
-- update and delete over its own applications only — it can work a status
-- from pending to contacted, write review notes, and clear a row out. It
-- cannot see or touch another org's applications. Applications with no
-- organization_id and no volunteer need — the general "I want to help
-- somewhere" intake — belong to no org and stay admin-only.
--
-- The helpers take names of their own rather than reusing or replacing any
-- FoodAssist helper, so nothing else on the shared database changes.

-- ──────────────────────────────────────────────────────────────────────────
-- 1. Helper: the organization the signed-in user represents, or null.
--    security definer so the lookup is not itself filtered by profiles RLS
--    (and so a policy on volunteer_applications cannot recurse into it).
--    Only role = 'organization' counts — an admin's access comes from 004.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.assisthub_current_org_id()
  returns uuid
  language sql
  stable
  security definer
  set search_path to 'public', 'pg_temp'
as $$
  select p.organization_id
  from public.profiles p
  where p.id = auth.uid()
    and p.role = 'organization'
  limit 1;
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- 2. Helper: does this application belong to the caller's organization?
--    An application is the org's when it carries that organization_id, or
--    when it targets one of the org's volunteer needs — the second arm covers
--    older rows written before the apply form started stamping
--    organization_id.
--
--    The null guard is load-bearing on the write side. Without it an
--    application with a null organization_id and null volunteer_need_id would
--    compare null = null, and the coalesce would have nothing to lean on;
--    with it, a caller who represents no organization is rejected outright.
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.assisthub_org_owns_application(
  p_organization_id   uuid,
  p_volunteer_need_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public', 'pg_temp'
as $$
  select coalesce(
    public.assisthub_current_org_id() is not null
    and (
      p_organization_id = public.assisthub_current_org_id()
      or p_volunteer_need_id in (
        select vn.id
        from public.volunteer_needs vn
        where vn.organization_id = public.assisthub_current_org_id()
      )
    ),
    false
  );
$$;

revoke all on function public.assisthub_current_org_id() from public;
revoke all on function public.assisthub_org_owns_application(uuid, uuid) from public;
grant execute on function public.assisthub_current_org_id() to authenticated;
grant execute on function public.assisthub_org_owns_application(uuid, uuid) to authenticated;

-- ──────────────────────────────────────────────────────────────────────────
-- 3. The policy. Same predicate in using and with check: using decides which
--    rows the org may read, update or delete; with check decides what a row
--    may look like afterwards. Together they mean an org cannot hand its own
--    application to another org, or claim one of theirs, by rewriting
--    organization_id — the row has to still be the org's own on the way out.
--
--    Scoped `to authenticated` so the anon role never evaluates it: the
--    public apply form writes as anon, anon has no execute grant on the
--    helpers, and that would surface as a permission error rather than a
--    silent no-match. Anonymous submissions keep working through the existing
--    public insert policy.
-- ──────────────────────────────────────────────────────────────────────────
drop policy if exists "Orgs read their own volunteer applications"
  on public.volunteer_applications;
drop policy if exists "Orgs manage their own volunteer applications"
  on public.volunteer_applications;
create policy "Orgs manage their own volunteer applications"
  on public.volunteer_applications for all
  to authenticated
  using (
    public.assisthub_org_owns_application(organization_id, volunteer_need_id)
  )
  with check (
    public.assisthub_org_owns_application(organization_id, volunteer_need_id)
  );

-- ──────────────────────────────────────────────────────────────────────────
-- 4. Supporting indexes for the two arms of the ownership check.
-- ──────────────────────────────────────────────────────────────────────────
create index if not exists idx_volunteer_applications_org
  on public.volunteer_applications (organization_id, created_at desc);
create index if not exists idx_volunteer_applications_need
  on public.volunteer_applications (volunteer_need_id);
