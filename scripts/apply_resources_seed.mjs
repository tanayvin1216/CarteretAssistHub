/**
 * Apply the Resource Directory to the linked Supabase project:
 *   1. supabase/migrations/008_resource_directory.sql  (creates the tables)
 *   2. supabase/resources-seed.sql                     (fills them)
 *
 * Both are idempotent, so re-running is safe and self-correcting: regenerate
 * the seed with scripts/gen_resources_seed.py after the committee revises the
 * Resource Aid document, then run this again.
 *
 * Credentials come from .env.local via scripts/db.mjs. If you would rather not
 * store a database password locally, skip this script entirely and paste
 * supabase/resource-directory-install.sql into the dashboard's SQL Editor.
 *
 * Usage: node scripts/apply_resources_seed.mjs
 */
import { readFileSync } from 'node:fs';
import { connect } from './db.mjs';

const client = await connect();

const migration = readFileSync('supabase/migrations/008_resource_directory.sql', 'utf8');
const seed = readFileSync('supabase/resources-seed.sql', 'utf8');

async function report(label) {
  const { rows } = await client.query(`
    SELECT c.name, count(r.id)::int AS n
    FROM resource_categories c
    LEFT JOIN resources r ON r.category_id = c.id
    GROUP BY c.id, c.name, c.display_order
    ORDER BY c.display_order
  `);
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  console.log(`\n[${label}] ${rows.length} categories, ${total} resources`);
  for (const r of rows) console.log(`  ${String(r.n).padStart(3)}  ${r.name}`);
}

try {
  // The migration is CREATE-IF-NOT-EXISTS throughout, so it is safe to run
  // every time and keeps a fresh database one command away from working.
  await client.query(migration);
  console.log('Migration 008_resource_directory.sql applied.');

  // The seed opens its own transaction (BEGIN/COMMIT) so the wipe-and-rewrite
  // is atomic — the directory is never briefly empty for live readers.
  await client.query(seed);
  console.log('Seed supabase/resources-seed.sql applied.');
  await report('after');
} catch (e) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('\nFAILED, rolled back:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
