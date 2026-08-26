import { neon } from "@neondatabase/serverless";

let _sql;
let _schemaReady;

/**
 * Neon SQL-over-HTTP client. Stateless, perfect for serverless.
 * Usage: const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 */
export function getDb() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Get a connection string from https://neon.tech"
      );
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

/** Creates tables once per serverless instance. */
export async function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = initSchema().catch((err) => {
      _schemaReady = undefined; // allow retry on next request
      throw err;
    });
  }
  return _schemaReady;
}

async function initSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      address VARCHAR(500) DEFAULT '',
      avatar TEXT,
      banned BOOLEAN NOT NULL DEFAULT FALSE,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      email_verified BOOLEAN NOT NULL DEFAULT TRUE,
      verification_token TEXT,
      verification_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'`;
  // Default TRUE so accounts created before email verification existed keep working
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMPTZ`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_change_token TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_change_expires TIMESTAMPTZ`;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token UUID PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      feature VARCHAR(100) NOT NULL,
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id)`;
}
