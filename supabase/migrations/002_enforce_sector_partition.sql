-- ============================================================================
-- Guard rail for the shared organizations table.
--
-- AssistHub (committee directory) and FoodAssist share this table. FoodAssist
-- shows ONLY rows where sector = 'food_insecurity'. Committee orgs therefore
-- must keep sector = 'other' (or anything other than 'food_insecurity') so they
-- never appear on the FoodAssist site.
--
-- This trigger enforces that: any row carrying a non-food AssistHub sector_slug
-- but sector = 'food_insecurity' is corrected to sector = 'other'.
--
-- FoodAssist's own rows are never touched — they have sector_slug NULL or
-- 'food-insecurity', both excluded by the condition below.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforce_assist_hub_sector_partition()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sector_slug IS NOT NULL
     AND NEW.sector_slug <> 'food-insecurity'
     AND NEW.sector = 'food_insecurity' THEN
    NEW.sector := 'other';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Named to sort AFTER trg_sync_org_sector_slug so sector_slug is already synced
-- from sector_id when this runs (Postgres fires BEFORE triggers in name order).
DROP TRIGGER IF EXISTS trg_zz_enforce_sector_partition ON organizations;
CREATE TRIGGER trg_zz_enforce_sector_partition
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_assist_hub_sector_partition();
