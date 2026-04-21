-- ============================================================================
-- ASSIST HUB — schema extensions on top of the existing FoodAssist database.
--
-- Run this AFTER FoodAssist's 001-008 migrations have been applied. This
-- migration is idempotent where possible and additive only — it never drops
-- or modifies FoodAssist tables destructively. Both apps share one Postgres
-- database; FoodAssist continues to work unmodified, while AssistHub gains
-- the sector hierarchy on top.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. Sectors — the 13 county-wide issue areas.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_es TEXT,
  short_description TEXT,
  short_description_es TEXT,
  description TEXT,
  description_es TEXT,
  accent_color TEXT NOT NULL DEFAULT '#1E3A5F',
  numeral TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'forming'
    CHECK (status IN ('forming', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sectors_slug ON sectors(slug);
CREATE INDEX IF NOT EXISTS idx_sectors_order ON sectors(display_order);

-- ---------------------------------------------------------------------------
-- 2. Subcommittee leads — the people running each sector for the county
--    community-service committee. Up to N leads per sector.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subcommittee_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'lead'
    CHECK (role IN ('lead', 'co-lead', 'member')),
  email TEXT,
  phone TEXT,
  affiliation TEXT,
  bio TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subcommittee_sector ON subcommittee_leads(sector_id);

-- ---------------------------------------------------------------------------
-- 3. Sector activities — "Next Activity" column from the planning sheet.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sector_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_es TEXT,
  description TEXT,
  description_es TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  location TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sector_activities_sector ON sector_activities(sector_id);
CREATE INDEX IF NOT EXISTS idx_sector_activities_scheduled ON sector_activities(scheduled_for);

-- ---------------------------------------------------------------------------
-- 4. Extend organizations with sector FK and cross-sector tags.
--    FoodAssist's organizations table stays as-is; we add columns.
-- ---------------------------------------------------------------------------
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sector_slug TEXT,
  ADD COLUMN IF NOT EXISTS additional_sector_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mission TEXT,
  ADD COLUMN IF NOT EXISTS mission_es TEXT;

CREATE INDEX IF NOT EXISTS idx_org_sector ON organizations(sector_id);
CREATE INDEX IF NOT EXISTS idx_org_sector_slug ON organizations(sector_slug);
CREATE INDEX IF NOT EXISTS idx_org_additional_sectors
  ON organizations USING GIN(additional_sector_slugs);

-- Backfill: any existing FoodAssist organizations are Food Insecurity orgs.
-- (Idempotent — only updates rows still NULL on sector_slug.)
UPDATE organizations
SET sector_slug = 'food-insecurity'
WHERE sector_slug IS NULL;

-- ---------------------------------------------------------------------------
-- 5. Extend volunteer_needs with sector tag, for cross-sector browsing
--    without a JOIN on every read.
-- ---------------------------------------------------------------------------
ALTER TABLE volunteer_needs
  ADD COLUMN IF NOT EXISTS sector_slug TEXT,
  ADD COLUMN IF NOT EXISTS title_es TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT;

CREATE INDEX IF NOT EXISTS idx_vol_needs_sector ON volunteer_needs(sector_slug);

-- Backfill sector_slug from the parent organization so FoodAssist needs
-- flow into Food Insecurity without manual editing.
UPDATE volunteer_needs vn
SET sector_slug = o.sector_slug
FROM organizations o
WHERE vn.organization_id = o.id
  AND vn.sector_slug IS NULL;

-- ---------------------------------------------------------------------------
-- 6. Trigger: keep organizations.sector_slug in sync with sectors.slug
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_org_sector_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sector_id IS NOT NULL THEN
    SELECT slug INTO NEW.sector_slug FROM sectors WHERE id = NEW.sector_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_sync_org_sector_slug ON organizations;
CREATE TRIGGER trg_sync_org_sector_slug
  BEFORE INSERT OR UPDATE OF sector_id ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.sync_org_sector_slug();

-- ---------------------------------------------------------------------------
-- 7. Trigger: sector updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_sectors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_touch_sectors_updated_at ON sectors;
CREATE TRIGGER trg_touch_sectors_updated_at
  BEFORE UPDATE ON sectors
  FOR EACH ROW EXECUTE FUNCTION public.touch_sectors_updated_at();

-- ---------------------------------------------------------------------------
-- 8. Row-Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcommittee_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_activities ENABLE ROW LEVEL SECURITY;

-- Sectors: everyone reads. Only admins write.
DROP POLICY IF EXISTS "Public read sectors" ON sectors;
CREATE POLICY "Public read sectors"
  ON sectors FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage sectors" ON sectors;
CREATE POLICY "Admins manage sectors"
  ON sectors FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Subcommittee leads: public read, admin write.
DROP POLICY IF EXISTS "Public read leads" ON subcommittee_leads;
CREATE POLICY "Public read leads"
  ON subcommittee_leads FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage leads" ON subcommittee_leads;
CREATE POLICY "Admins manage leads"
  ON subcommittee_leads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Sector activities: public read published, admin write.
DROP POLICY IF EXISTS "Public read activities" ON sector_activities;
CREATE POLICY "Public read activities"
  ON sector_activities FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins manage activities" ON sector_activities;
CREATE POLICY "Admins manage activities"
  ON sector_activities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
