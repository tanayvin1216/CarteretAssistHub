// Apply a SQL migration file to the linked Supabase DB over the pooler.
// Usage: node scripts/apply_migration.mjs supabase/migrations/003_site_content.sql
import { readFileSync } from 'node:fs';
import pg from 'pg';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/apply_migration.mjs <path-to-sql>');
  process.exit(1);
}

const env = readFileSync('.env.local', 'utf8');
const get = (k) => {
  const m = env.match(new RegExp('^\\s*' + k + '\\s*=\\s*(.+)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
};

const poolerLine = readFileSync('supabase/.temp/pooler-url', 'utf8').trim();
const m = poolerLine.match(/^postgresql:\/\/([^@]+)@([^:/]+):(\d+)\/(.+)$/);
if (!m) {
  console.error('Could not parse pooler-url:', poolerLine);
  process.exit(1);
}

const client = new pg.Client({
  user: m[1],
  password: get('SUPABASE_DB_PASSWORD'),
  host: m[2],
  port: Number(m[3]),
  database: m[4],
  ssl: { rejectUnauthorized: false },
});

const sql = readFileSync(file, 'utf8');

(async () => {
  await client.connect();
  console.log(`Applying ${file} as ${m[1]} @ ${m[2]}:${m[3]}`);
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
