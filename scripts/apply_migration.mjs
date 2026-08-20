// Apply a SQL migration file to the linked Supabase DB over the pooler.
// Usage: node scripts/apply_migration.mjs supabase/migrations/003_site_content.sql
import { readFileSync } from 'node:fs';
import { connect } from './db.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/apply_migration.mjs <path-to-sql>');
  process.exit(1);
}

const client = await connect();

const sql = readFileSync(file, 'utf8');

(async () => {
  console.log(`Applying ${file}`);
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('commit');
    console.log('✓ Migration applied and committed.');
  } catch (e) {
    await client.query('rollback');
    console.error('✗ Rolled back:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
