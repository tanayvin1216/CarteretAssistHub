/**
 * Shared database connection for the scripts in this directory.
 *
 * Every script here talks to Postgres directly, which needs two things that a
 * fresh clone does not have: the `pg` driver (a devDependency, so `npm ci
 * --omit=dev` skips it) and a credential. Previously each script assumed both
 * and crashed with a stack trace when either was missing. This module resolves
 * them once and fails with instructions instead.
 *
 * Credential resolution, first match wins:
 *   1. DATABASE_URL         full connection string — carries its own host
 *   2. SUPABASE_DB_PASSWORD password, combined with the host recorded by
 *                           `supabase link` in supabase/.temp/pooler-url
 *
 * Both are read from .env.local (gitignored) or the real environment.
 */
import { existsSync, readFileSync } from 'node:fs';

const POOLER_PATH = 'supabase/.temp/pooler-url';

export const CREDENTIAL_HELP = `
No database credential found.

  Supabase dashboard -> Project Settings -> Database -> Connection string,
  choose the URI tab, copy it, and put it in .env.local at the repo root:

    DATABASE_URL=postgresql://postgres.<ref>:<password>@<host>:5432/postgres

  .env.local is gitignored, so the password stays on this machine.

Nothing in scripts/ is required, though — every migration and seed under
supabase/ can be pasted into the dashboard's SQL Editor instead.
`;

export function fail(message) {
  console.error(message);
  process.exit(2);
}

/** Parse a dotenv-style file. Missing file is not an error — the real
 *  environment may carry the variables instead. */
export function loadEnv(path = '.env.local') {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

/** The `pg` driver, or a clear message about how to install it. */
export async function loadPg() {
  try {
    return (await import('pg')).default;
  } catch {
    fail("The 'pg' package is not installed. Run:  npm install\n" + CREDENTIAL_HELP);
  }
}

export function resolveConfig(env = { ...loadEnv(), ...process.env }) {
  if (env.DATABASE_URL) {
    // Supabase terminates TLS with a certificate this script has no root for,
    // hence rejectUnauthorized:false — but honour an explicit sslmode=disable
    // so the scripts also work against a plain local Postgres.
    const sslDisabled = /[?&]sslmode=disable\b/.test(env.DATABASE_URL);
    return {
      connectionString: env.DATABASE_URL,
      ssl: sslDisabled ? false : { rejectUnauthorized: false },
    };
  }

  if (env.SUPABASE_DB_PASSWORD) {
    // supabase/.temp/ is gitignored, so this only exists after `supabase link`
    // has been run on this machine. Without it there is no host to connect to.
    if (!existsSync(POOLER_PATH)) {
      fail(
        `SUPABASE_DB_PASSWORD is set but ${POOLER_PATH} is missing, so the\n` +
          'database host is unknown. Either run `supabase link` first, or set\n' +
          'DATABASE_URL instead — it carries the host itself.\n' + CREDENTIAL_HELP,
      );
    }
    // pooler-url: postgresql://postgres.<ref>@<host>:<port>/<db>
    // Parse manually — the WHATWG URL parser mangles userinfo for non-special schemes.
    const line = readFileSync(POOLER_PATH, 'utf8').trim();
    const m = line.match(/^postgresql:\/\/([^@]+)@([^:/]+):(\d+)\/(.+)$/);
    if (!m) fail(`Could not parse ${POOLER_PATH}: ${line}`);
    return {
      user: m[1],
      password: env.SUPABASE_DB_PASSWORD,
      host: m[2],
      port: Number(m[3]),
      database: m[4],
      ssl: { rejectUnauthorized: false },
    };
  }

  fail(CREDENTIAL_HELP);
}

/** Describe the target without ever printing the password. */
export function describe(config) {
  return config.connectionString
    ? config.connectionString.replace(/\/\/[^@]*@/, '//')
    : `${config.user}@${config.host}:${config.port}`;
}

/** A connected pg.Client, or exit(2) with an explanation. */
export async function connect({ quiet = false } = {}) {
  const pg = await loadPg();
  const config = resolveConfig();
  if (!quiet) console.log(`Connecting to ${describe(config)}`);
  const client = new pg.Client(config);
  try {
    await client.connect();
  } catch (e) {
    fail(
      `Could not connect to the database: ${e.message}\n\n` +
        'The credential was found but the connection failed. Check that the\n' +
        'connection string is current (Supabase rotates it when the database\n' +
        'password is reset) and that this network can reach the host.',
    );
  }
  return client;
}
