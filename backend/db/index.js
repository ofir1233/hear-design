import pg from 'pg'

const { Pool } = pg

// Render provides DATABASE_URL automatically when you attach a Postgres instance
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render Postgres requires SSL in production
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

// ── Run once on server start to ensure tables exist ───────────────
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dev_tokens (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token      TEXT UNIQUE NOT NULL,
      email      TEXT NOT NULL,
      used       BOOLEAN DEFAULT FALSE,
      config     JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
    );

    CREATE TABLE IF NOT EXISTS demo_profiles (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_email TEXT NOT NULL,
      name       TEXT NOT NULL,
      subtitle   TEXT,
      color      TEXT DEFAULT '#FF7056',
      config     JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS env_configs (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_email   TEXT NOT NULL,
      env_type      TEXT NOT NULL,
      company_name  TEXT,
      industry      TEXT,
      system_prompt TEXT,
      raw_config    JSONB,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `)
  console.log('[db] tables ready')
}

// ── Token helpers ─────────────────────────────────────────────────

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
     WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
    [token]
  )
  return rows[0] ?? null
}

export async function saveTokenConfig(token, config) {
  await pool.query(
    'UPDATE dev_tokens SET config = $1, used = FALSE WHERE token = $2',
    [JSON.stringify(config), token]
  )
}

// ── Demo profile helpers ──────────────────────────────────────────

export async function getProfilesByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM demo_profiles WHERE user_email = $1 ORDER BY created_at DESC',
    [email]
  )
  return rows
}

export async function createDemoProfile(email, { name, subtitle, color, config }) {
  const { rows } = await pool.query(
    `INSERT INTO demo_profiles (user_email, name, subtitle, color, config)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, name, subtitle ?? '', color ?? '#FF7056', JSON.stringify(config ?? {})]
  )
  return rows[0]
}
