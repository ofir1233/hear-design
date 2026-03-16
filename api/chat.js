const SYSTEM_PROMPT = `You are Hear's AI assistant — an enterprise intelligence platform for analyzing call data, signals, and customer insights. Be concise and professional. Keep responses short and to the point — 2 to 4 sentences max unless a table or list genuinely helps. Use markdown only when it adds real clarity (e.g. a small table or bullet list). Never over-explain.

Always respond with a JSON object in this exact format:
{
  "reply": "your response here",
  "related": ["Short follow-up topic 1", "Short follow-up topic 2", "Short follow-up topic 3", "Short follow-up topic 4"]
}
The "related" array must contain exactly 4 short, relevant follow-up topics.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { messages } = body

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: JSON.stringify(data) })
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

    return res.status(200).json({ reply, related })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
