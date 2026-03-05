import pg from 'pg'

const { Pool } = pg

// ─────────────────────────────────────────────────────────────────
// Connection pool
// DATABASE_URL is automatically injected by Render when you attach
// a managed Postgres instance to your Web Service.
// ─────────────────────────────────────────────────────────────────
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Render's managed Postgres requires SSL; local dev does not.
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,

  // Connection pool sizing — Render's free Postgres allows max 25 connections.
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  console.error('[db] unexpected pool error:', err.message)
})

// ─────────────────────────────────────────────────────────────────
// initDb — called once at server start.
// Creates all tables if they don't exist yet.
// Safe to call on every deploy (IF NOT EXISTS guards).
// ─────────────────────────────────────────────────────────────────
export async function initDb() {
  await pool.query(`
    -- Stores magic-link tokens for Dev environment setup.
    CREATE TABLE IF NOT EXISTS dev_tokens (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      token      TEXT        UNIQUE NOT NULL,
      email      TEXT        NOT NULL,
      used       BOOLEAN     DEFAULT FALSE,
      config     JSONB,                          -- populated after /activate
      created_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
    );

    -- Stores demo environment profiles, one row per company per user.
    CREATE TABLE IF NOT EXISTS demo_profiles (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_email TEXT        NOT NULL,
      name       TEXT        NOT NULL,
      subtitle   TEXT,
      color      TEXT        DEFAULT '#FF7056',
      config     JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Stores the LLM-extracted company config for any environment type.
    CREATE TABLE IF NOT EXISTS env_configs (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_email   TEXT        NOT NULL,
      env_type      TEXT        NOT NULL CHECK (env_type IN ('dev', 'demo')),
      company_name  TEXT,
      industry      TEXT,
      system_prompt TEXT,
      raw_config    JSONB,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    -- Index for fast profile lookups by email
    CREATE INDEX IF NOT EXISTS demo_profiles_email_idx
      ON demo_profiles (user_email);

    -- One access token per demo user — used in magic-link emails
    CREATE TABLE IF NOT EXISTS demo_access_tokens (
      token      TEXT        PRIMARY KEY,
      email      TEXT        NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)

  console.log('[db] schema ready')
}

// ─────────────────────────────────────────────────────────────────
// dev_tokens helpers
// ─────────────────────────────────────────────────────────────────

export async function createToken(email) {
  const { v4: uuidv4 } = await import('uuid')
  const token = uuidv4()
  await pool.query(
    'INSERT INTO dev_tokens (token, email) VALUES ($1, $2)',
    [token, email]
  )
  return token
}

export async function getToken(token) {
  const { rows } = await pool.query(
    `SELECT * FROM dev_tokens
     WHERE token = $1
       AND used = FALSE
       AND expires_at > NOW()`,
    [token]
  )
  return rows[0] ?? null
}

// Saves the extracted config against the token without marking it used,
// so the user's session remains valid across page reloads.
export async function saveTokenConfig(token, config) {
  await pool.query(
    `UPDATE dev_tokens
     SET config = $1
     WHERE token = $2`,
    [JSON.stringify(config), token]
  )
}

export async function markTokenUsed(token) {
  await pool.query(
    'UPDATE dev_tokens SET used = TRUE WHERE token = $1',
    [token]
  )
}

// ─────────────────────────────────────────────────────────────────
// demo_profiles helpers
// ─────────────────────────────────────────────────────────────────

export async function getProfilesByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM demo_profiles
     WHERE user_email = $1
     ORDER BY created_at DESC`,
    [email]
  )
  return rows
}

export async function getDemoProfile(id) {
  const { rows } = await pool.query(
    'SELECT * FROM demo_profiles WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

export async function createDemoProfile(email, { name, subtitle, color, config }) {
  const { rows } = await pool.query(
    `INSERT INTO demo_profiles (user_email, name, subtitle, color, config)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [email, name, subtitle ?? '', color ?? '#FF7056', JSON.stringify(config ?? {})]
  )
  return rows[0]
}

// ─────────────────────────────────────────────────────────────────
// demo_access_tokens helpers
// ─────────────────────────────────────────────────────────────────

// Returns existing token for the email, or creates a new one.
export async function upsertDemoAccessToken(email) {
  const { v4: uuidv4 } = await import('uuid')
  const { rows } = await pool.query(
    'SELECT token FROM demo_access_tokens WHERE email = $1',
    [email]
  )
  if (rows[0]) return rows[0].token
  const token = uuidv4()
  await pool.query(
    'INSERT INTO demo_access_tokens (token, email) VALUES ($1, $2)',
    [token, email]
  )
  return token
}

// Looks up the email from the token, then returns all profiles for that email.
export async function getProfilesByDemoToken(token) {
  const { rows } = await pool.query(
    'SELECT email FROM demo_access_tokens WHERE token = $1',
    [token]
  )
  if (!rows[0]) return null
  return getProfilesByEmail(rows[0].email)
}
