const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL    = 'openai/gpt-oss-120b'

// ── Chat completion (used by /api/chat route) ─────────────────────
export async function groqChat(messages) {
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024 }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ── Structured extraction from raw scraped/uploaded text ──────────
// Returns a config object the platform uses to personalise itself.
export async function extractConfig(rawText, { url = '', description = '' } = {}) {
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

Return ONLY a valid JSON object with this exact shape (no markdown, no extra text):
{
  "companyName": "string",
  "industry": "string",
  "keyProducts": ["string"],
  "tone": "formal | conversational | technical",
  "keyMetrics": ["string — metrics this company cares about"],
  "commonTopics": ["string — topics that come up in their calls/data"],
  "systemPromptAddition": "string — 2-3 sentences to append to the AI system prompt that will make it relevant to this company",
  "suggestedPrompts": [
    "string — example question their team would actually ask",
    "string",
    "string",
    "string",
    "string"
  ]
}
`.trim()

  try {
    const raw = await groqChat([
      { role: 'system', content: 'You extract structured JSON configuration from company data. Return only valid JSON.' },
      { role: 'user',   content: prompt },
    ])
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON in response')
    return JSON.parse(match[0])
  } catch (err) {
    console.warn('[llm] extractConfig failed:', err.message)
    // Return a safe fallback so the platform still works
    return {
      companyName: 'Your Company',
      industry: 'Enterprise',
      keyProducts: [],
      tone: 'formal',
      keyMetrics: [],
      commonTopics: [],
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

// ── Build the full system prompt for /api/chat ────────────────────
export function buildSystemPrompt(config) {
  const base = `You are Hear's AI assistant — an enterprise intelligence platform for analyzing call data, signals, and customer insights. Be concise and professional. Keep responses short and to the point — 2 to 4 sentences max unless a table or list genuinely helps. Use markdown only when it adds real clarity. Never over-explain.`

  const context = config?.systemPromptAddition
    ? `\n\nThis platform is configured for ${config.companyName} (${config.industry}). ${config.systemPromptAddition}`
    : ''

  return `${base}${context}

Always respond with a JSON object in this exact format:
{
  "reply": "your response here",
  "related": ["Short follow-up topic 1", "Short follow-up topic 2", "Short follow-up topic 3", "Short follow-up topic 4"]
}
The "related" array must contain exactly 4 short, relevant follow-up topics.`
}
