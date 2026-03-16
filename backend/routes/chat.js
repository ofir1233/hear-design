import { Router } from 'express'
import { groqChat, buildSystemPrompt } from '../services/llm.js'
import { getToken, getDemoProfile } from '../db.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    // Load company config — dev token takes priority, then demo profile
    const devToken       = req.headers['x-dev-token']
    const demoProfileId  = req.headers['x-demo-profile-id']
    let config = null
    if (devToken) {
      const row = await getToken(devToken).catch(() => null)
      config = row?.config ?? null
    } else if (demoProfileId) {
      const profile = await getDemoProfile(demoProfileId).catch(() => null)
      config = profile?.config ?? null
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
