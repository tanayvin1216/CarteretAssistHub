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
# In the Supabase SQL Editor, run the contents of:
supabase/migrations/001_assist_hub_schema.sql
supabase/seed.sql
supabase/demo-seed.sql          # optional — demo orgs + leads + volunteer roles
```

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
supabase/seed.sql
supabase/demo-seed.sql    -- optional demo data
```

### 1c. Create an admin user
Supabase Auth → Users → Invite user (enter your email). After accepting:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
```

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
| `/about` | About the hub |
| `/admin/login` | Admin sign-in |
| `/admin` | Admin overview |
| `/admin/sectors` | Sector status management |
| `/admin/organizations` | Full CRUD for orgs |
| `/admin/volunteer-needs` | Post + manage volunteer roles |
| `/admin/applications` | Review incoming applications |
| `/admin/subcommittee-leads` | Manage leadership per sector |
