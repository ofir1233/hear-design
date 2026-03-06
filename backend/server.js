import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import Papa from 'papaparse'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

import {
  pool,
  initDb,
  createToken,
  getToken,
  saveTokenConfig,
  getProfilesByEmail,
  createDemoProfile,
  softDeleteProfile,
  ensureWelcomeSession,
  getSessionsByUser,
  createSession,
  updateSessionTitle,
  softDeleteSession,
  getSessionMessages,
  addSessionMessage,
} from './db.js'

// ─────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────
const PORT    = process.env.PORT    || 3001
const resend  = new Resend(process.env.RESEND_API_KEY)
const upload  = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },  // 10 MB max
})

const GROQ_API     = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL   = 'openai/gpt-oss-120b'
const SYSTEM_BASE  = `You are Hear's AI assistant — an enterprise intelligence platform for analyzing call data, signals, and customer insights. Be concise and professional. Keep responses to 2–4 sentences unless a table or list genuinely helps. Use markdown only when it adds real clarity. Never over-explain.`

// ─────────────────────────────────────────────────────────────────
// Express app
// ─────────────────────────────────────────────────────────────────
const app = express()

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    // Allow server-to-server calls (no Origin header) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

// ── Groq chat completion ──────────────────────────────────────────
async function groqChat(messages) {
  const res = await fetch(GROQ_API, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens:  1024,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Groq error ${res.status}: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ── URL scraper ───────────────────────────────────────────────────
async function scrapeUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HearBot/1.0)' },
      signal:  AbortSignal.timeout(10_000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    const $    = cheerio.load(html)

    $('script, style, nav, footer, header, aside, [aria-hidden="true"]').remove()

    const title    = $('title').text().trim()
    const metaDesc = $('meta[name="description"]').attr('content') ?? ''
    const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get().join(' · ')
    const body     = $('main, article, section, .content, body')
      .first().text().replace(/\s+/g, ' ').trim().slice(0, 4000)

    return [title, metaDesc, headings, body].filter(Boolean).join('\n\n')
  } catch (err) {
    console.warn('[scrape] failed for', url, '—', err.message)
    return ''
  }
}

// ── File text extractor ───────────────────────────────────────────
async function extractFile(buffer, mimetype, filename) {
  const ext = filename.split('.').pop().toLowerCase()
  try {
    if (ext === 'pdf' || mimetype === 'application/pdf') {
      const data = await pdfParse(buffer)
      return data.text.slice(0, 6000)
    }
    if (ext === 'csv' || mimetype === 'text/csv') {
      const { data } = Papa.parse(buffer.toString('utf-8'), { header: true, skipEmptyLines: true })
      const headers  = Object.keys(data[0] ?? {}).join(', ')
      const sample   = data.slice(0, 5).map(r => Object.values(r).join(' | ')).join('\n')
      return `Columns: ${headers}\n\nSample rows:\n${sample}`
    }
    if (['txt', 'md', 'json'].includes(ext)) {
      return buffer.toString('utf-8').slice(0, 6000)
    }
    return `[${filename} — unsupported format]`
  } catch (err) {
    console.warn('[extract] file parse failed:', err.message)
    return ''
  }
}

// ── LLM config extraction ─────────────────────────────────────────
async function extractConfig(rawText, { url = '', description = '' } = {}) {
  const prompt = `
You are a configuration extractor for an enterprise AI platform called Hear.
Given the following content about a company, extract a structured configuration.

Content:
---
URL: ${url}
User description: ${description}
Scraped / uploaded content:
${rawText.slice(0, 8000)}
---

Return ONLY a valid JSON object — no markdown fences, no commentary:
{
  "companyName": "string",
  "industry": "string",
  "keyProducts": ["string"],
  "tone": "formal | conversational | technical",
  "keyMetrics": ["metric this company tracks"],
  "commonTopics": ["topic that comes up in their calls/data"],
  "systemPromptAddition": "2–3 sentences that make the AI contextually relevant to this company",
  "suggestedPrompts": [
    "example question their team would actually ask",
    "example question",
    "example question",
    "example question",
    "example question"
  ]
}`.trim()

  try {
    const raw   = await groqChat([
      { role: 'system', content: 'Extract structured JSON from company data. Return only valid JSON.' },
      { role: 'user',   content: prompt },
    ])
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON in response')
    return JSON.parse(match[0])
  } catch (err) {
    console.warn('[llm] extractConfig failed:', err.message)
    return {
      companyName:         'Your Company',
      industry:            'Enterprise',
      keyProducts:         [],
      tone:                'formal',
      keyMetrics:          [],
      commonTopics:        [],
      systemPromptAddition: '',
      suggestedPrompts: [
        'Who are my top performing agents?',
        'Show me a summary of calls from the last 7 days.',
        'What are the trending topics this week?',
        'Which customers are at risk of churn?',
        'Give me a compliance overview for this month.',
      ],
    }
  }
}

// ── Build system prompt (base + per-company addition) ────────────
function buildSystemPrompt(config) {
  const addition = config?.systemPromptAddition
    ? `\n\nThis platform is configured for ${config.companyName} (${config.industry}). ${config.systemPromptAddition}`
    : ''

  return `${SYSTEM_BASE}${addition}

Always respond with a JSON object in this exact format:
{
  "reply": "your response here",
  "related": ["follow-up topic 1", "follow-up topic 2", "follow-up topic 3", "follow-up topic 4"]
}
The "related" array must contain exactly 4 short, relevant follow-up topics.`
}

// ─────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────

// ── Health check ─────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')       // also verifies DB is reachable
    res.json({ ok: true, ts: new Date().toISOString() })
  } catch {
    res.status(503).json({ ok: false })
  }
})

// ── POST /api/chat ────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' })
    }

    // Load per-environment config if the client sent a dev token
    let config = null
    const devToken = req.headers['x-dev-token']
    if (devToken) {
      const row = await getToken(devToken).catch(() => null)
      config = row?.config ?? null
    }

    const groqMessages = [
      { role: 'system', content: buildSystemPrompt(config) },
      ...messages.map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    ]

    const raw     = await groqChat(groqMessages)
    const match   = raw.match(/\{[\s\S]*\}/)
    let reply     = raw
    let related   = []

    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        reply   = parsed.reply   ?? raw
        related = Array.isArray(parsed.related) ? parsed.related.slice(0, 4) : []
      } catch { /* use raw */ }
    }

    res.json({ reply, related })
  } catch (err) {
    console.error('[/api/chat]', err.message)
    res.status(500).json({ error: 'Chat request failed.' })
  }
})

// ── POST /api/dev/send-link ───────────────────────────────────────
// Creates a DB token and emails a magic setup link to the developer.
app.post('/api/dev/send-link', async (req, res) => {
  try {
    const { email } = req.body
    if (!email?.trim()) return res.status(400).json({ error: 'email required' })

    const token    = await createToken(email.trim())
    const setupUrl = `${process.env.APP_URL}?devToken=${token}`

    await resend.emails.send({
      from:    process.env.FROM_EMAIL,
      to:      email.trim(),
      subject: 'Your Hear developer setup link',
      html: `
        <!DOCTYPE html><html>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:48px 24px;">
              <table width="480" cellpadding="0" cellspacing="0"
                     style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                <tr><td style="padding:40px 40px 32px;">
                  <img src="${process.env.APP_URL}/Logo.svg" alt="Hear" height="36"
                       style="display:block;margin-bottom:32px;" />
                  <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">
                    Your developer setup link
                  </h1>
                  <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">
                    Click below to configure your Hear developer environment.
                    This link expires in <strong style="color:rgba(255,255,255,0.75);">24 hours</strong>.
                  </p>
                  <a href="${setupUrl}"
                     style="display:inline-block;padding:13px 28px;background:#1779F7;border-radius:10px;
                            color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
                    Open setup page →
                  </a>
                </td></tr>
                <tr><td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                    If you didn't request this, ignore this email.<br/>
                    <span style="color:rgba(255,255,255,0.3);">${setupUrl}</span>
                  </p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('[/api/dev/send-link]', err.message)
    res.status(500).json({ error: 'Failed to send email.' })
  }
})

// ── GET /api/dev/token/:token ─────────────────────────────────────
// Frontend calls this when it detects ?devToken= in the URL.
app.get('/api/dev/token/:token', async (req, res) => {
  try {
    const row = await getToken(req.params.token)
    if (!row) return res.status(404).json({ error: 'Token not found or expired.' })
    res.json({ email: row.email, hasConfig: !!row.config })
  } catch (err) {
    console.error('[/api/dev/token]', err.message)
    res.status(500).json({ error: 'Token lookup failed.' })
  }
})

// ── POST /api/dev/activate ────────────────────────────────────────
// Receives URL + description + optional file.
// Scrapes/parses all content, sends to LLM, stores config in DB.
app.post('/api/dev/activate', upload.single('file'), async (req, res) => {
  try {
    const { token, email, url, description } = req.body

    // Validate token if provided (setup via magic link)
    const row        = token ? await getToken(token).catch(() => null) : null
    const ownerEmail = row?.email ?? email ?? 'unknown'

    // ── 1. Collect text from all sources ─────────────────────────
    const parts = []
    if (description?.trim()) {
      parts.push(`User description:\n${description.trim()}`)
    }
    if (url?.trim()) {
      console.log('[activate] scraping:', url)
      const scraped = await scrapeUrl(url.trim())
      if (scraped) parts.push(`Website content:\n${scraped}`)
    }
    if (req.file) {
      console.log('[activate] parsing file:', req.file.originalname)
      const fileText = await extractFile(req.file.buffer, req.file.mimetype, req.file.originalname)
      if (fileText) parts.push(`Uploaded file (${req.file.originalname}):\n${fileText}`)
    }

    // ── 2. LLM extraction ─────────────────────────────────────────
    const rawText = parts.join('\n\n---\n\n')
    console.log('[activate] running LLM extraction for', ownerEmail)
    const config = await extractConfig(rawText, { url: url?.trim(), description: description?.trim() })

    // ── 3. Persist ────────────────────────────────────────────────
    if (row) {
      await saveTokenConfig(token, config)
    }

    // Also write to env_configs for audit / future lookup
    await pool.query(
      `INSERT INTO env_configs (owner_email, env_type, company_name, industry, system_prompt, raw_config)
       VALUES ($1, 'dev', $2, $3, $4, $5)`,
      [ownerEmail, config.companyName, config.industry, config.systemPromptAddition, JSON.stringify(config)]
    )

    res.json({ success: true, config })
  } catch (err) {
    console.error('[/api/dev/activate]', err.message)
    res.status(500).json({ error: 'Activation failed.' })
  }
})

// ── DELETE /api/demo/profiles/:id ────────────────────────────────
app.delete('/api/demo/profiles/:id', async (req, res) => {
  try {
    const email = req.headers['x-user-email']
    if (!email) return res.status(400).json({ error: 'x-user-email header required' })
    const deleted = await softDeleteProfile(req.params.id, email)
    if (!deleted) return res.status(404).json({ error: 'Profile not found.' })
    res.json({ success: true })
  } catch (err) {
    console.error('[/api/demo/profiles DELETE]', err.message)
    res.status(500).json({ error: 'Could not delete profile.' })
  }
})

// ── GET /api/demo/profiles ────────────────────────────────────────
app.get('/api/demo/profiles', async (req, res) => {
  try {
    const email = req.headers['x-user-email']
    if (!email) return res.status(400).json({ error: 'x-user-email header required' })

    const profiles = await getProfilesByEmail(email)
    res.json({ profiles })
  } catch (err) {
    console.error('[/api/demo/profiles]', err.message)
    res.status(500).json({ error: 'Could not fetch profiles.' })
  }
})

// ── POST /api/demo/generate ───────────────────────────────────────
app.post('/api/demo/generate', upload.single('file'), async (req, res) => {
  try {
    const { userEmail, url, description } = req.body

    const parts = []
    if (description?.trim()) parts.push(`User description:\n${description.trim()}`)
    if (url?.trim()) {
      const scraped = await scrapeUrl(url.trim())
      if (scraped) parts.push(`Website content:\n${scraped}`)
    }
    if (req.file) {
      const fileText = await extractFile(req.file.buffer, req.file.mimetype, req.file.originalname)
      if (fileText) parts.push(`Uploaded file:\n${fileText}`)
    }

    const rawText = parts.join('\n\n---\n\n')
    const config  = await extractConfig(rawText, { url: url?.trim(), description: description?.trim() })

    const profile = await createDemoProfile(userEmail, {
      name:     config.companyName,
      subtitle: `${config.industry} · Demo`,
      color:    '#FF7056',
      config,
    })

    await pool.query(
      `INSERT INTO env_configs (owner_email, env_type, company_name, industry, system_prompt, raw_config)
       VALUES ($1, 'demo', $2, $3, $4, $5)`,
      [userEmail, config.companyName, config.industry, config.systemPromptAddition, JSON.stringify(config)]
    )

    res.json({ success: true, profile, config })
  } catch (err) {
    console.error('[/api/demo/generate]', err.message)
    res.status(500).json({ error: 'Generation failed.' })
  }
})

// ─────────────────────────────────────────────────────────────────
// Chat session routes
// ─────────────────────────────────────────────────────────────────

// GET /api/sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const sessions = await getSessionsByUser(userId)
    res.json({ sessions })
  } catch (err) {
    console.error('[/api/sessions GET]', err.message)
    res.status(500).json({ error: 'Could not fetch sessions.' })
  }
})

// POST /api/sessions/ensure-welcome  (must be before /:id routes)
app.post('/api/sessions/ensure-welcome', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const result = await ensureWelcomeSession(userId)
    res.json(result)
  } catch (err) {
    console.error('[/api/sessions/ensure-welcome]', err.message)
    res.status(500).json({ error: 'Could not ensure welcome session.' })
  }
})

// POST /api/sessions
app.post('/api/sessions', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const { title } = req.body
    const session = await createSession(userId, title)
    res.json({ session })
  } catch (err) {
    console.error('[/api/sessions POST]', err.message)
    res.status(500).json({ error: 'Could not create session.' })
  }
})

// PATCH /api/sessions/:id/title
app.patch('/api/sessions/:id/title', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const { title } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'title required' })
    const session = await updateSessionTitle(req.params.id, userId, title.trim())
    if (!session) return res.status(404).json({ error: 'Session not found.' })
    res.json({ session })
  } catch (err) {
    console.error('[/api/sessions PATCH title]', err.message)
    res.status(500).json({ error: 'Could not rename session.' })
  }
})

// DELETE /api/sessions/:id
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const deleted = await softDeleteSession(req.params.id, userId)
    if (!deleted) return res.status(404).json({ error: 'Session not found.' })
    res.json({ success: true })
  } catch (err) {
    console.error('[/api/sessions DELETE]', err.message)
    res.status(500).json({ error: 'Could not delete session.' })
  }
})

// GET /api/sessions/:id/messages
app.get('/api/sessions/:id/messages', async (req, res) => {
  try {
    const messages = await getSessionMessages(req.params.id)
    res.json({ messages })
  } catch (err) {
    console.error('[/api/sessions messages GET]', err.message)
    res.status(500).json({ error: 'Could not fetch messages.' })
  }
})

// POST /api/sessions/:id/messages
app.post('/api/sessions/:id/messages', async (req, res) => {
  try {
    const { role, content, related } = req.body
    if (!role || !content) return res.status(400).json({ error: 'role and content required' })
    const message = await addSessionMessage(req.params.id, { role, content, related })
    res.json({ message })
  } catch (err) {
    console.error('[/api/sessions messages POST]', err.message)
    res.status(500).json({ error: 'Could not save message.' })
  }
})

// POST /api/sessions/:id/auto-title
app.post('/api/sessions/:id/auto-title', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const { firstMessage } = req.body
    if (!firstMessage) return res.status(400).json({ error: 'firstMessage required' })

    const raw = await groqChat([
      { role: 'system', content: 'Generate a short, descriptive conversation title (4-7 words max) based on the user message. Return ONLY the title text — no punctuation at the end, no quotes, no markdown.' },
      { role: 'user', content: firstMessage.slice(0, 300) },
    ])
    const title = raw.trim().replace(/^["']|["']$/g, '').replace(/[.!?]$/, '').slice(0, 60)
    const session = await updateSessionTitle(req.params.id, userId, title)
    res.json({ title, session })
  } catch (err) {
    console.error('[/api/sessions auto-title]', err.message)
    res.status(500).json({ error: 'Could not auto-title session.' })
  }
})

// ─────────────────────────────────────────────────────────────────
// Global error handler — catches anything thrown without a res.send
// ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err.message)
  res.status(500).json({ error: 'Internal server error.' })
})

// ─────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────
async function start() {
  try {
    await initDb()
    const server = app.listen(PORT, () => {
      console.log(`[server] listening on :${PORT} (${process.env.NODE_ENV ?? 'development'})`)
    })

    // Graceful shutdown — Render sends SIGTERM before stopping a service
    process.on('SIGTERM', () => {
      console.log('[server] SIGTERM received, shutting down')
      server.close(async () => {
        await pool.end()
        console.log('[server] shutdown complete')
        process.exit(0)
      })
    })
  } catch (err) {
    console.error('[server] startup failed:', err)
    process.exit(1)
  }
}

start()
