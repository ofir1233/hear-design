import { Router } from 'express'
import multer from 'multer'
import { getProfilesByEmail, createDemoProfile } from '../db.js'
import { extractFromUrl, extractFromFile } from '../services/extract.js'
import { extractConfig } from '../services/llm.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// ── GET /api/demo/profiles ────────────────────────────────────────
router.get('/profiles', async (req, res) => {
  try {
    const email = req.headers['x-user-email']
    if (!email) return res.status(400).json({ error: 'x-user-email header required' })

    const profiles = await getProfilesByEmail(email)
    res.json({ profiles })
  } catch (err) {
    console.error('[demo/profiles]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/demo/generate ───────────────────────────────────────
router.post('/generate', upload.single('file'), async (req, res) => {
  try {
    const { userEmail, url, description } = req.body

    const parts = []
    if (description?.trim()) parts.push(`User description:\n${description.trim()}`)

    if (url?.trim()) {
      const scraped = await extractFromUrl(url.trim())
      if (scraped) parts.push(`Website content:\n${scraped}`)
    }

    if (req.file) {
      const fileText = await extractFromFile(req.file.buffer, req.file.mimetype, req.file.originalname)
      if (fileText) parts.push(`Uploaded file:\n${fileText}`)
    }

    const rawText = parts.join('\n\n---\n\n')
    const config  = await extractConfig(rawText, { url: url?.trim(), description: description?.trim() })

    // Save as a demo profile for this user
    const profile = await createDemoProfile(userEmail, {
      name:     config.companyName,
      subtitle: `${config.industry} · Demo`,
      color:    '#FF7056',
      config,
    })

    res.json({ success: true, profile, config })
  } catch (err) {
    console.error('[demo/generate]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
