-- 006_org_read_own_applications.sql
-- Additive, non-destructive. Lets an organization read the volunteer
-- applications addressed to it — the applications people submit from that
-- org's listing or from one of its volunteer roles.
--
-- Until now the only readable policy on volunteer_applications was
-- "Admins full access volunteer applications" (004), so every application was
-- visible to Assist Hub admins alone and an org had to go through the county
-- advisor to hear about its own volunteers.
--
-- Scope: SELECT only. Orgs read; triage (status, review_notes) stays with the
-- committee. Applications with no organization_id — the general "I want to
-- help somewhere" intake — remain admin-only, as they belong to no org.
--
-- The helper takes a name of its own rather than reusing/replacing any
-- FoodAssist helper, so nothing on the shared database changes behaviour.

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

revoke all on function public.assisthub_current_org_id() from public;
grant execute on function public.assisthub_current_org_id() to authenticated;

-- ──────────────────────────────────────────────────────────────────────────
-- 2. Read policy. An application belongs to an org when it carries that
--    organization_id, or when it targets one of the org's volunteer needs —
--    the second arm covers older rows written before the apply form started
--    stamping organization_id.
--    Scoped `to authenticated` so the anon role never evaluates it: the
--    public apply form writes as anon, and anon has no execute grant on the
--    helper, which would surface as a permission error rather than no rows.
--    The null guard matters too: without it a signed-in non-org user would
--    compare against null, and a null organization_id row would compare
--    null = null. Both are false today, but the guard makes that explicit
--    instead of load-bearing.
-- ──────────────────────────────────────────────────────────────────────────
drop policy if exists "Orgs read their own volunteer applications"
  on public.volunteer_applications;
create policy "Orgs read their own volunteer applications"
  on public.volunteer_applications for select
  to authenticated
  using (
    public.assisthub_current_org_id() is not null
    and (
      organization_id = public.assisthub_current_org_id()
      or volunteer_need_id in (
        select vn.id
        from public.volunteer_needs vn
        where vn.organization_id = public.assisthub_current_org_id()
      )
    )
  );

-- ──────────────────────────────────────────────────────────────────────────
-- 3. Supporting indexes for the two arms of that policy.
-- ──────────────────────────────────────────────────────────────────────────
create index if not exists idx_volunteer_applications_org
  on public.volunteer_applications (organization_id, created_at desc);
create index if not exists idx_volunteer_applications_need
  on public.volunteer_applications (volunteer_need_id);
