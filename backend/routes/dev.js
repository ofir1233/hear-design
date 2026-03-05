import { Router } from 'express'
import multer from 'multer'
import { createToken, getToken, saveTokenConfig } from '../db.js'
import { sendDevSetupLink } from '../services/email.js'
import { extractFromUrl, extractFromFile } from '../services/extract.js'
import { extractConfig } from '../services/llm.js'

const router  = Router()
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// ── POST /api/dev/send-link ───────────────────────────────────────
// Creates a token, sends magic link email, returns 200.
router.post('/send-link', async (req, res) => {
  try {
    const { email } = req.body
    if (!email?.trim()) return res.status(400).json({ error: 'email required' })

    const token = await createToken(email.trim())
    await sendDevSetupLink(email.trim(), token)

    res.json({ success: true })
  } catch (err) {
    console.error('[dev/send-link]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/dev/token/:token ─────────────────────────────────────
// Frontend calls this on load when ?devToken= is in the URL.
// Returns the email so we can pre-fill the setup form.
router.get('/token/:token', async (req, res) => {
  try {
    const row = await getToken(req.params.token)
    if (!row) return res.status(404).json({ error: 'Token not found or expired' })
    res.json({ email: row.email, hasConfig: !!row.config })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/dev/activate ────────────────────────────────────────
// Receives URL + description + optional file, extracts content,
// calls LLM to build structured config, stores it against the token.
router.post('/activate', upload.single('file'), async (req, res) => {
  try {
    const { token, email, url, description } = req.body

    // Validate token
    const row = token ? await getToken(token) : null
    // If no token (dev shortcut path), we still process and return config
    const ownerEmail = row?.email ?? email ?? 'unknown'

    // ── 1. Extract text from all sources ────────────────────────
    const parts = []

    if (description?.trim()) {
      parts.push(`User description:\n${description.trim()}`)
    }

    if (url?.trim()) {
      console.log('[dev/activate] scraping', url)
      const scraped = await extractFromUrl(url.trim())
      if (scraped) parts.push(`Website content:\n${scraped}`)
    }

    if (req.file) {
      console.log('[dev/activate] parsing file:', req.file.originalname)
      const fileText = await extractFromFile(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      )
      if (fileText) parts.push(`Uploaded file (${req.file.originalname}):\n${fileText}`)
    }

    // ── 2. LLM extraction ────────────────────────────────────────
    const rawText = parts.join('\n\n---\n\n')
    const config  = await extractConfig(rawText, { url: url?.trim(), description: description?.trim() })

    // ── 3. Persist to DB ─────────────────────────────────────────
    if (row) {
      await saveTokenConfig(token, config)
    }

    res.json({ success: true, config })
  } catch (err) {
    console.error('[dev/activate]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
