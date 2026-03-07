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

  // Migrate existing demo_profiles table — add deleted_at if absent
  await pool.query(`
    ALTER TABLE demo_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
  `).catch(() => {})

  // Session tables — safe to run on every deploy
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    TEXT        NOT NULL,
      title      TEXT        NOT NULL DEFAULT 'New Conversation',
      is_welcome BOOLEAN     DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    )
  `).catch(err => console.warn('[db] chat_sessions table:', err.message))

  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID        NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role       TEXT        NOT NULL,
      content    TEXT        NOT NULL,
      related    JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(err => console.warn('[db] chat_messages table:', err.message))

  await pool.query(`CREATE INDEX IF NOT EXISTS chat_sessions_user_idx ON chat_sessions (user_id)`)
    .catch(() => {})
  await pool.query(`CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id)`)
    .catch(() => {})

  // Add profile_id column for per-profile session scoping (safe on re-deploy)
  await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS profile_id TEXT`)
    .catch(() => {})

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
     WHERE user_email = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [email]
  )
  return rows
}

export async function deleteDemoProfile(id) {
  await pool.query('DELETE FROM demo_profiles WHERE id = $1', [id])
}

export async function softDeleteProfile(id, email) {
  const { rowCount } = await pool.query(
    `UPDATE demo_profiles SET deleted_at = NOW()
     WHERE id = $1 AND user_email = $2 AND deleted_at IS NULL`,
    [id, email]
  )
  return rowCount > 0
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

// ─────────────────────────────────────────────────────────────────
// chat_sessions helpers
// ─────────────────────────────────────────────────────────────────

const WELCOME_CONTENT = `Welcome to Hear — your AI intelligence layer for customer conversations and operational data.

Here's what I can help you explore:
- **Call Analytics** — Trending topics, sentiment shifts, and resolution rates
- **Agent Performance** — Handle time, CSAT scores, and coaching signals
- **Customer Signals** — Churn risk, satisfaction drivers, and product feedback
- **Compliance** — Flagged interactions and policy adherence

Ask me anything about your operations, or explore a topic below to get started.`

const WELCOME_RELATED = [
  "What's my call volume this week?",
  "Show me top agent performers",
  "Which customers are at risk of churn?",
  "Give me a compliance summary",
]

export async function ensureWelcomeSession(userId, profileId = null) {
  const { rows } = await pool.query(
    `SELECT * FROM chat_sessions
     WHERE user_id = $1 AND is_welcome = TRUE AND deleted_at IS NULL
       AND COALESCE(profile_id, '') = COALESCE($2, '')`,
    [userId, profileId]
  )
  if (rows[0]) return { session: rows[0], created: false }

  const { rows: sessions } = await pool.query(
    `INSERT INTO chat_sessions (user_id, profile_id, title, is_welcome) VALUES ($1, $2, 'Welcome to Hear', TRUE) RETURNING *`,
    [userId, profileId]
  )
  const session = sessions[0]
  await pool.query(
    `INSERT INTO chat_messages (session_id, role, content, related) VALUES ($1, 'ai', $2, $3)`,
    [session.id, WELCOME_CONTENT, JSON.stringify(WELCOME_RELATED)]
  )
  return { session, created: true }
}

export async function getSessionsByUser(userId, profileId = null) {
  const { rows } = await pool.query(
    `SELECT * FROM chat_sessions
     WHERE user_id = $1 AND deleted_at IS NULL
       AND COALESCE(profile_id, '') = COALESCE($2, '')
     ORDER BY updated_at DESC`,
    [userId, profileId]
  )
  return rows
}

export async function createSession(userId, title = 'New Conversation', profileId = null) {
  const { rows } = await pool.query(
    `INSERT INTO chat_sessions (user_id, profile_id, title) VALUES ($1, $2, $3) RETURNING *`,
    [userId, profileId, title]
  )
  return rows[0]
}

export async function updateSessionTitle(id, userId, title) {
  const { rows } = await pool.query(
    `UPDATE chat_sessions SET title = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3 AND deleted_at IS NULL RETURNING *`,
    [title, id, userId]
  )
  return rows[0] ?? null
}

export async function softDeleteSession(id, userId) {
  const { rowCount } = await pool.query(
    `UPDATE chat_sessions SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  )
  return rowCount > 0
}

export async function getSessionMessages(sessionId) {
  const { rows } = await pool.query(
    `SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  )
  return rows
}

export async function addSessionMessage(sessionId, { role, content, related }) {
  const { rows } = await pool.query(
    `INSERT INTO chat_messages (session_id, role, content, related) VALUES ($1, $2, $3, $4) RETURNING *`,
    [sessionId, role, content, related ? JSON.stringify(related) : null]
  )
  await pool.query(`UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1`, [sessionId])
  return rows[0]
}
