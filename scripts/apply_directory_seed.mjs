/**
 * One-off: apply supabase/directory-seed.sql to the linked Supabase project.
 *
 * Credentials come from .env.local via scripts/db.mjs, so no secret is ever
 * passed on the command line.
 *
 * Usage: node scripts/apply_directory_seed.mjs
 */
import { readFileSync } from 'node:fs';
import { connect } from './db.mjs';

const client = await connect();

const sql = readFileSync('supabase/directory-seed.sql', 'utf8');

const counts = async (label) => {
  const q = async (t, w = '') => (await client.query(`SELECT count(*)::int n FROM ${t} ${w}`)).rows[0].n;
  console.log(`\n[${label}]`,
    'orgs:', await q('organizations'),
    '| needs:', await q('volunteer_needs'),
    '| leads:', await q('subcommittee_leads'),
    '| activities:', await q('sector_activities'));
  const bySector = await client.query(
    `SELECT sector_slug, count(*)::int n FROM organizations WHERE is_active GROUP BY 1 ORDER BY 2 DESC`);
  console.log('  by sector:', bySector.rows.map((r) => `${r.sector_slug}=${r.n}`).join(' '));
};
try {
  await counts('before');
  await client.query('BEGIN');
  await client.query(sql);
  await client.query('COMMIT');
  console.log('\nApplied directory-seed.sql in a transaction (committed).');
  await counts('after');
} catch (e) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('\nFAILED, rolled back:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
