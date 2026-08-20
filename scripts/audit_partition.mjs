/**
 * Audit the AssistHub <-> FoodAssist partition on the shared organizations table.
 *
 * Invariant: committee orgs must NOT be visible to FoodAssist, which lists only
 * rows where sector = 'food_insecurity'. Reports counts, lists FoodAssist's
 * visible set for eyeballing, and FAILS (exit 1) on any leak or anomaly.
 *
 * Usage: node scripts/audit_partition.mjs   (needs DATABASE_URL in .env.local)
 */
import { connect } from './db.mjs';

const c = await connect();
const rows = async (q) => (await c.query(q)).rows;
let failed = false;
try {
  const committee = (await rows(`SELECT count(*)::int n FROM organizations WHERE sector='other'`))[0].n;
  const foodassist = (await rows(`SELECT count(*)::int n FROM organizations WHERE sector='food_insecurity'`))[0].n;
  console.log(`committee orgs (sector='other'): ${committee}`);
  console.log(`FoodAssist-visible (sector='food_insecurity'): ${foodassist}`);

  const anomalies = await rows(`SELECT name, sector FROM organizations WHERE sector NOT IN ('other','food_insecurity') ORDER BY name`);
  if (anomalies.length) {
    failed = true;
    console.log(`\nANOMALY — unexpected sector value(s):`);
    anomalies.forEach((r) => console.log(`  - ${r.name}: sector=${r.sector}`));
  }

  // A leak = a row with a non-food AssistHub sector_slug yet visible to FoodAssist.
  const leaks = await rows(`SELECT name, sector_slug FROM organizations
    WHERE sector='food_insecurity' AND sector_slug IS NOT NULL AND sector_slug <> 'food-insecurity' ORDER BY name`);
  if (leaks.length) {
    failed = true;
    console.log(`\nLEAK — committee orgs visible to FoodAssist:`);
    leaks.forEach((r) => console.log(`  - ${r.name} (sector_slug=${r.sector_slug})`));
  }

  console.log(`\nFoodAssist's visible set (verify these are all genuine FoodAssist orgs):`);
  const fa = await rows(`SELECT name FROM organizations WHERE sector='food_insecurity' AND is_active ORDER BY name`);
  fa.forEach((r) => console.log(`  - ${r.name}`));

  console.log(`\n${failed ? 'AUDIT FAILED ✗' : 'AUDIT PASSED ✓ — no leaks or anomalies'}`);
} finally {
  await c.end();
}
process.exit(failed ? 1 : 0);
