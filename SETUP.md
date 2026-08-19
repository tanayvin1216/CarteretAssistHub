# Assist Hub — Setup guide (v1)

End-to-end steps to get the app running locally and on Vercel, sharing a Supabase backend with
Food Assist.

---

## 1. Supabase — shared database

Assist Hub and Food Assist point at the **same** Supabase project. If you already have the Food
Assist Supabase project, you'll just add this repo's migration on top.

### 1a. If Food Assist is already deployed
You already have migrations 001–008 from FoodAssist_V2. Run only the Assist Hub migration + seed:

```bash
# In the Supabase SQL Editor, run the contents of, in order:
supabase/migrations/001_assist_hub_schema.sql
supabase/migrations/002_enforce_sector_partition.sql
supabase/migrations/003_site_content.sql
supabase/migrations/004_assisthub_admin_scope.sql
supabase/migrations/005_community_reports.sql      # public "report something" intake
supabase/migrations/006_org_read_own_applications.sql
supabase/migrations/007_org_portal.sql             # org self-service listing + roles
supabase/seed.sql
supabase/directory-seed.sql     # real Community Service Committee org directory + volunteer roles
```

Or apply one at a time over the pooler:

```bash
node scripts/apply_migration.mjs supabase/migrations/007_org_portal.sql
```

To find out which migrations a database is actually carrying — the first thing to check when a
feature "doesn't work" — run:

```bash
node scripts/check_schema.mjs
```

It reports each migration as present or missing, and prints the command to apply the missing one.

### 1b. Fresh Supabase project
Create a new Supabase project, then run (in order):

```sql
-- From FoodAssist_V2/supabase/migrations/
001_initial_schema.sql
002_site_settings.sql
003_harden_function_search_path.sql
004_restrict_self_profile_update.sql
005_optimize_rls_auth_uid.sql
006_fix_rls_recursion_with_security_definer_helpers.sql
007_fix_site_settings_timestamp_trigger.sql
008_volunteer_applications.sql

-- Then from THIS repo's supabase/migrations/ + seeds:
001_assist_hub_schema.sql
002_enforce_sector_partition.sql
003_site_content.sql
004_assisthub_admin_scope.sql
005_community_reports.sql
006_org_read_own_applications.sql
007_org_portal.sql
supabase/seed.sql
supabase/directory-seed.sql    -- real org directory + volunteer roles
```

### 1c. Create a county admin user
Supabase Auth → Users → Invite user (enter your email). After accepting:

```sql
-- Assist Hub admin is its own scope on the shared database (migration 004).
-- The global role = 'admin' flag belongs to Food Assist and does NOT grant
-- access to /admin here.
UPDATE profiles SET assisthub_admin = true WHERE email = 'you@example.com';
```

### 1d. Create organization logins
Once migrations 006 and 007 are applied, this is done in the app rather than in SQL: sign in as a
county admin and go to **/admin/org-accounts**. Pick the organization, enter the contact's email,
and a temporary password is generated and shown to you once — pass it to the organization
yourself. The project has no SMTP sender configured, so Supabase's invite emails would go nowhere;
that is why the password is handed over rather than mailed.

This screen needs `SUPABASE_SERVICE_ROLE_KEY` set both locally and in Vercel. Without it the page
loads but tells you it cannot manage accounts.

---

## 2. Local development

```bash
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
# Open http://localhost:3000
```

---

## 3. Vercel deploy (v1 branch strategy)

The repo has `vercel.json` set so **only the `v1` branch auto-deploys** — `main` stays clean for
manual review. When you're ready to release, merge `v1 → main` yourself.

### First-time setup
1. In Vercel, import this GitHub repo.
2. When prompted, select the `v1` branch as the production branch (or leave main as production
   and override via `vercel.json` — current config uses v1).
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.

### Ongoing
Every push to `v1` triggers a Vercel build. `main` is untouched — use `git merge v1` only when
you're ready to publish a release.

---

## 4. Shared-backend mental model

- **One Supabase project** — two Next.js apps point at it.
- Food Assist queries are unchanged; it implicitly filters to orgs where `sector_slug =
  'food-insecurity'` via the backfill in `001_assist_hub_schema.sql`.
- Assist Hub queries cross all 13 sectors.
- An org that updates its phone number in the Food Assist portal sees that change on both sites
  instantly. No sync, no duplication.

---

## 5. Key routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero + 13-sector index |
| `/sectors` | Full sector directory |
| `/sectors/[slug]` | Sector detail (leads, orgs, volunteer roles, activities) |
| `/get-help` | Intent-based org finder |
| `/volunteer` | Cross-sector volunteer role browse |
| `/volunteer/apply` | Bilingual application form |
| `/organizations/[id]` | Organization detail |
| `/report` | Report a wrong listing or an unmet need |
| `/directory.pdf` | The whole directory as a printable PDF (`?lang=es` for Spanish) |
| `/about` | About the hub |
| `/admin/login` | Admin sign-in |
| `/admin` | Admin overview |
| `/admin/sectors` | Sector status management |
| `/admin/organizations` | Full CRUD for orgs |
| `/admin/volunteer-needs` | Post + manage volunteer roles |
| `/admin/applications` | Review incoming applications |
| `/admin/reports` | Triage resident reports |
| `/admin/subcommittee-leads` | Manage leadership per sector |
| `/admin/org-accounts` | Create and revoke organization logins |
| `/admin/content` | Edit site copy in both languages |
| `/admin/settings` | Branding, hero image, contact details |
| `/portal/login` | Organization sign-in |
| `/portal` | Organization overview |
| `/portal/listing` | An org edits its own listing |
| `/portal/roles` | An org posts and closes its own volunteer roles |
| `/portal/applications` | An org works the applications sent to it |
