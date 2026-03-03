import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SYSTEM_PROMPT = `You are Hear's AI assistant — an enterprise intelligence platform for analyzing call data, signals, and customer insights. Be concise and professional. Keep responses short and to the point — 2 to 4 sentences max unless a table or list genuinely helps. Use markdown only when it adds real clarity (e.g. a small table or bullet list). Never over-explain.

Always respond with a JSON object in this exact format:
{
  "reply": "your response here",
  "related": ["Short follow-up topic 1", "Short follow-up topic 2", "Short follow-up topic 3", "Short follow-up topic 4"]
}
The "related" array must contain exactly 4 short, relevant follow-up topics.`

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-dev-handler',
        configureServer(server) {
          server.middlewares.use('/api/chat', (req, res) => {
            if (req.method === 'OPTIONS') {
              res.writeHead(200)
              return res.end()
            }
            if (req.method !== 'POST') {
              res.writeHead(405, { 'Content-Type': 'application/json' })
              return res.end(JSON.stringify({ error: 'Method not allowed' }))
            }

            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body)
                const groqMessages = [
                  { role: 'system', content: SYSTEM_PROMPT },
                  ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                ]

                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.GROQ_API_KEY}`,
                  },
                  body: JSON.stringify({
                    model: 'openai/gpt-oss-120b',
                    messages: groqMessages,
                    temperature: 0.7,
                    max_tokens: 1024,
                  }),
                })

                const data = await groqRes.json()
                if (!groqRes.ok) {
                  res.writeHead(groqRes.status, { 'Content-Type': 'application/json' })
                  return res.end(JSON.stringify({ error: JSON.stringify(data) }))
                }

                const content = data.choices?.[0]?.message?.content ?? ''
                const jsonMatch = content.match(/\{[\s\S]*\}/)
                let reply = 'No response.'
                let related = []
                if (jsonMatch) {
                  try {
                    const parsed = JSON.parse(jsonMatch[0])
                    reply = parsed.reply ?? reply
                    related = Array.isArray(parsed.related) ? parsed.related.slice(0, 4) : []
                  } catch {
                    reply = content
                  }
                } else {
                  reply = content
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ reply, related }))
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
  }
})
