import { Router } from 'express'
import { groqChat, buildSystemPrompt } from '../services/llm.js'
import { getToken } from '../db.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    // If the request carries a devToken, load that environment's config
    const devToken = req.headers['x-dev-token']
    let config = null
    if (devToken) {
      const row = await getToken(devToken).catch(() => null)
      config = row?.config ?? null
    }

    const systemPrompt = buildSystemPrompt(config)

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    ]

    const raw = await groqChat(groqMessages)

    const match = raw.match(/\{[\s\S]*\}/)
    let reply   = 'No response.'
    let related = []
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        reply   = parsed.reply   ?? raw
        related = Array.isArray(parsed.related) ? parsed.related.slice(0, 4) : []
      } catch {
        reply = raw
      }
    } else {
      reply = raw
    }

    res.json({ reply, related })
  } catch (err) {
    console.error('[chat]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
