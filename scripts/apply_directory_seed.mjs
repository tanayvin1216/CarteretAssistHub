/**
 * One-off: apply supabase/directory-seed.sql to the linked Supabase project.
 *
 * Credential resolution (first match wins), all read from .env.local so no
 * secret is ever passed on the command line:
 *   - DATABASE_URL            full postgres connection string, or
 *   - SUPABASE_DB_PASSWORD    DB password; combined with the linked pooler host.
 *
 * Usage: node scripts/apply_directory_seed.mjs
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';

function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = loadEnv('.env.local');
const poolerLine = readFileSync('supabase/.temp/pooler-url', 'utf8').trim();

if (!env.SUPABASE_DB_PASSWORD && !env.DATABASE_URL) {
  console.error('Missing credential. Add SUPABASE_DB_PASSWORD (or DATABASE_URL) to .env.local.');
  process.exit(2);
}

// pooler-url: postgresql://postgres.<ref>@<host>:<port>/<db>
// Parse manually — the WHATWG URL parser mangles userinfo for non-special schemes.
const m = poolerLine.match(/^postgresql:\/\/([^@]+)@([^:/]+):(\d+)\/(.+)$/);
if (!env.DATABASE_URL && !m) {
  console.error('Could not parse pooler-url:', poolerLine);
  process.exit(2);
}
const clientConfig = env.DATABASE_URL
  ? { connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: m[1],
      password: env.SUPABASE_DB_PASSWORD,
      host: m[2],
      port: Number(m[3]),
      database: m[4],
      ssl: { rejectUnauthorized: false },
    };
console.log(`Connecting as ${clientConfig.user || '(url)'} @ ${clientConfig.host || ''}:${clientConfig.port || ''}`);

const sql = readFileSync('supabase/directory-seed.sql', 'utf8');
const client = new pg.Client(clientConfig);

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

await client.connect();
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
