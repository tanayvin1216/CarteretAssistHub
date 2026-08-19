// Report which Assist Hub migrations are actually present on the linked
// Supabase database. Answers "is this broken in the code or was the migration
// never applied?" without guessing.
//
// Usage: node scripts/check_schema.mjs
import { readFileSync } from 'node:fs';
import pg from 'pg';

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

// What each migration is supposed to have left behind.
const EXPECTED = [
  { migration: '001_assist_hub_schema', tables: ['sectors', 'subcommittee_leads', 'sector_activities'], columns: [['organizations', 'sector_slug']] },
  { migration: '003_site_content', tables: ['site_content'] },
  { migration: '004_assisthub_admin_scope', columns: [['profiles', 'assisthub_admin']], functions: ['is_assisthub_admin'] },
  { migration: '005_community_reports', tables: ['community_reports'], policies: [['community_reports', 'community_reports public insert']] },
  { migration: '006_org_read_own_applications', functions: ['assisthub_current_org_id', 'assisthub_org_owns_application'], policies: [['volunteer_applications', 'Orgs manage their own volunteer applications']] },
  { migration: '007_org_portal', functions: ['assisthub_org_can_edit'], policies: [['organizations', 'Orgs update their own listing'], ['volunteer_needs', 'Orgs manage their own volunteer needs']] },
];

const q = {
  table: `select 1 from information_schema.tables where table_schema='public' and table_name=$1`,
  column: `select 1 from information_schema.columns where table_schema='public' and table_name=$1 and column_name=$2`,
  fn: `select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`,
  policy: `select 1 from pg_policies where schemaname='public' and tablename=$1 and policyname=$2`,
};

const check = async (sql, params) => (await client.query(sql, params)).rowCount > 0;

(async () => {
  await client.connect();
  console.log(`Checking ${m[4]} @ ${m[2]}\n`);
  let missingAny = false;

  for (const group of EXPECTED) {
    const missing = [];
    for (const t of group.tables ?? []) {
      if (!(await check(q.table, [t]))) missing.push(`table ${t}`);
    }
    for (const [t, c] of group.columns ?? []) {
      if (!(await check(q.column, [t, c]))) missing.push(`column ${t}.${c}`);
    }
    for (const f of group.functions ?? []) {
      if (!(await check(q.fn, [f]))) missing.push(`function ${f}()`);
    }
    for (const [t, p] of group.policies ?? []) {
      if (!(await check(q.policy, [t, p]))) missing.push(`policy "${p}" on ${t}`);
    }

    if (missing.length === 0) {
      console.log(`✓ ${group.migration}`);
    } else {
      missingAny = true;
      console.log(`✗ ${group.migration} — missing:`);
      missing.forEach((x) => console.log(`    · ${x}`));
      console.log(`    fix: node scripts/apply_migration.mjs supabase/migrations/${group.migration}.sql`);
    }
  }

  if (!missingAny) console.log('\nAll migrations present.');
  await client.end();
  process.exitCode = missingAny ? 1 : 0;
})();
