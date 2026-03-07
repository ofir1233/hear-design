import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { apiFetch, apiHeaders } from './lib/api.js'
import HearLogo from './components/HearLogo.jsx'
import ChatBubble from './components/ChatBubble.jsx'
import ChatInput from './components/ChatInput.jsx'
import Sidebar from './components/Sidebar.jsx'
import SignIn from './components/SignIn.jsx'
import DataPage from './components/data/DataPage.jsx'
import InsightsPanel from './components/dashboard/InsightsPanel.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const SIDEBAR_WIDTH = 272

// Build request cards from company config, or fall back to generic ones
function buildRequestCards(config) {
  const name = config?.companyName || 'your company'
  const topics = config?.commonTopics?.length
    ? config.commonTopics
    : ['Trending Topics', 'Agent Performance', 'Customer Sentiment', 'Escalations', 'Call Volume', 'Product Mentions', 'Churn Risk', 'Satisfaction']

  if (config?.suggestedPrompts?.length) {
    const prompts = config.suggestedPrompts.slice(0, 10)
    // Pad to at least 10 using fallback pool if needed
    const fallback = [
      `Show me trending topics from ${name} customer calls this week`,
      `Which agents handled ${name} inquiries best this month?`,
      `What are the top complaints from ${name} customers?`,
      `Summarize sentiment trends for ${name} support calls`,
      `Which ${name} topics are driving the most escalations?`,
      `Show me call volume patterns for ${name} over the last 30 days`,
      `What products are ${name} customers mentioning most?`,
      `Identify churn risk signals in recent ${name} conversations`,
      `Compare ${name} customer satisfaction scores across regions`,
      `What are the most common reasons ${name} customers call in?`,
    ]
    while (prompts.length < 10) prompts.push(fallback[prompts.length % fallback.length])
    return prompts.map((prompt, i) => ({
      id: `#${String(21195386 + i).slice(-8)}`,
      tag: topics[i % topics.length],
      description: prompt,
    }))
  }

  const fallbackPrompts = [
    `Show me trending topics from ${name} customer calls this week`,
    `Which agents handled ${name} inquiries best this month?`,
    `What are the top complaints from ${name} customers?`,
    `Summarize sentiment trends for ${name} support calls`,
    `Which ${name} topics are driving the most escalations?`,
    `Show me call volume patterns for ${name} over the last 30 days`,
    `What products are ${name} customers mentioning most?`,
    `Identify churn risk signals in recent ${name} conversations`,
    `Compare ${name} customer satisfaction scores across regions`,
    `What are the most common reasons ${name} customers call in?`,
  ]
  return fallbackPrompts.map((prompt, i) => ({
    id: `#${String(21195386 + i).slice(-8)}`,
    tag: topics[i % topics.length],
    description: prompt,
  }))
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11.1999V4.80013C2 4.43776 1.99929 4.12563 2.02019 3.86979C2.04172 3.60628 2.08958 3.34403 2.2181 3.0918C2.40983 2.71556 2.71556 2.40983 3.0918 2.2181C3.34403 2.08958 3.60628 2.04172 3.86979 2.02019C4.12563 1.99929 4.43776 2 4.80013 2H6.66667C7.03486 2 7.33334 2.29848 7.33334 2.66667C7.33334 3.03486 7.03486 3.33334 6.66667 3.33334H4.80013C4.41577 3.33334 4.16749 3.33418 3.97852 3.34961C3.79732 3.36442 3.73019 3.38948 3.69727 3.40625C3.57186 3.47016 3.47016 3.57186 3.40625 3.69727C3.38948 3.73019 3.36442 3.79732 3.34961 3.97852C3.33418 4.16749 3.33334 4.41577 3.33334 4.80013V11.1999C3.33334 11.5842 3.33418 11.8327 3.34961 12.0215C3.36441 12.2025 3.38945 12.2697 3.40625 12.3027C3.47037 12.4285 3.57228 12.5307 3.69727 12.5944C3.73014 12.6111 3.7973 12.6363 3.97787 12.651C4.16649 12.6665 4.41455 12.6667 4.79818 12.6667H11.2018C11.5852 12.6667 11.8331 12.6664 12.0215 12.651C12.2017 12.6363 12.2691 12.6112 12.3021 12.5944C12.4277 12.5304 12.5306 12.4274 12.5944 12.3021C12.6111 12.2691 12.6363 12.202 12.651 12.0221C12.6665 11.8336 12.6667 11.5855 12.6667 11.2018V9.33334C12.6667 8.96515 12.9651 8.66667 13.3333 8.66667C13.7015 8.66667 14 8.96515 14 9.33334V11.2018C14 11.5633 14.0007 11.8748 13.9798 12.1302C13.9583 12.3934 13.9103 12.6555 13.7819 12.9076C13.5901 13.284 13.2837 13.5902 12.9076 13.7819C12.6555 13.9103 12.3935 13.9583 12.1302 13.9798C11.8748 14.0007 11.5633 14 11.2018 14H4.79818C4.43654 14 4.12467 14.0007 3.86914 13.9798C3.60592 13.9583 3.34388 13.9103 3.0918 13.7819C2.71526 13.59 2.40964 13.284 2.2181 12.9082C2.08961 12.656 2.04173 12.3937 2.02019 12.1302C1.99929 11.8745 2 11.5622 2 11.1999Z" fill="#898989"/>
      <path d="M13.3333 2C13.7015 2 13.9999 2.29848 13.9999 2.66667V6.66667C13.9999 7.03486 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6666 7.03486 12.6666 6.66667V4.27604L8.13797 8.80469C7.87762 9.06504 7.45561 9.06504 7.19526 8.80469C6.93491 8.54434 6.93491 8.12233 7.19526 7.86198L11.7239 3.33333H9.33328C8.96509 3.33333 8.66662 3.03486 8.66662 2.66667C8.66662 2.29848 8.96509 2 9.33328 2H13.3333Z" fill="#898989"/>
    </svg>
  )
}


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}


function MainApp({ isDark, onThemeToggle, companyConfig, onSignOut, onProjectChange, userId, profileId }) {
  const greeting = getGreeting()
  const userName = localStorage.getItem('hear-user-name') || 'there'
  const fullGreeting = `${greeting}, ${userName}.`
  const requests = buildRequestCards(companyConfig)
  const isMobile = useIsMobile()
  const [activePage, setActivePage] = useState(() => window.__hearActivePage || 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [settled, setSettled]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [fixedStart, setFixedStart]   = useState(null)
  const [inputOffset, setInputOffset] = useState(0)
  const [messages, setMessages]       = useState([])
  const inputRef = useRef(null)
  const cardsRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [cardsScrolled, setCardsScrolled] = useState(false)
  const [cardsScrolling, setCardsScrolling] = useState(false)
  const cardsScrollTimeout = useRef(null)
  const [mentionActive, setMentionActive] = useState(false)
  const [uploadActive, setUploadActive]   = useState(false)
  const [hoveredMsg, setHoveredMsg] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [chatDefaultText, setChatDefaultText] = useState('')
  const [dashTab, setDashTab] = useState('suggestions')

  // ── Session state ───────────────────────────────────────────────
  const [sessions, setSessions]           = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [newlyNamedId, setNewlyNamedId]   = useState(null)
  const activeSessionRef                  = useRef(null)

  const logoRef     = useRef(null)
  const subtitleRef = useRef(null)

  // ── Inspector ↔ App page nav bridge ────────────────────────────────────────
  useEffect(() => {
    window.__hearActivePage = activePage
    window.dispatchEvent(new CustomEvent('hear:nav-changed', { detail: activePage }))
  }, [activePage])
  useEffect(() => {
    function onInspectorNav(e) { setActivePage(e.detail) }
    window.addEventListener('hear:nav', onInspectorNav)
    return () => window.removeEventListener('hear:nav', onInspectorNav)
  }, [])

  // ── Dashboard entrance animation ───────────────────────────────────────────
  useEffect(() => {
    if (activePage !== 'dashboard' || submitted) return
    const logo     = logoRef.current
    const subtitle = subtitleRef.current
    const words    = document.querySelectorAll('.dash-word')
    const input    = inputRef.current
    const cards    = cardsRef.current?.querySelectorAll('.request-card') ?? []
    if (!logo || !subtitle || !input) return

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    gsap.set(logo,     { opacity: 0, scale: 0.82 })
    gsap.set(words,    { opacity: 0, y: 22, filter: 'blur(10px)' })
    gsap.set(subtitle, { opacity: 0, y: 14, filter: 'blur(8px)' })
    gsap.set(input,    { opacity: 0, y: 18 })
    gsap.set(cards,    { opacity: 0, y: 20 })

    tl.to(logo,     { opacity: 1, scale: 1, duration: 0.55 },                                    0)
    tl.to(words,    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.07 },    0.15)
    tl.to(subtitle, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 },                   0.48)
    tl.to(input,    { opacity: 1, y: 0, duration: 0.55 },                                        0.62)
    tl.to(cards,    { opacity: 1, y: 0, duration: 0.42, stagger: 0.045 },                        0.78)
  }, [activePage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Session helpers — local-first, backend is background sync ───
  const WELCOME_MSG_TEXT = `Welcome to Hear — your AI intelligence layer for customer conversations and operational data.

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

  const sessionNs = profileId ? `hear-sessions-${userId}:${profileId}` : `hear-sessions-${userId}`
  function lsGetSessions()          { try { return JSON.parse(localStorage.getItem(sessionNs) || '[]') } catch { return [] } }
  function lsSetSessions(s)         { localStorage.setItem(sessionNs, JSON.stringify(s)) }
  function lsGetMsgs(sid)           { try { return JSON.parse(localStorage.getItem(`hear-msgs-${sid}`) || '[]') } catch { return [] } }
  function lsSetMsgs(sid, msgs)     { localStorage.setItem(`hear-msgs-${sid}`, JSON.stringify(msgs)) }
  function lsDelMsgs(sid)           { localStorage.removeItem(`hear-msgs-${sid}`) }

  useEffect(() => {
    if (!userId) return
    // Load from localStorage immediately — zero latency
    let stored = lsGetSessions()
    // Seed welcome session if this user has never had one
    if (!stored.find(s => s.is_welcome)) {
      const welcomeId = `welcome-${userId}${profileId ? `-${profileId}` : ''}`
      const welcomeSession = { id: welcomeId, user_id: userId, title: 'Welcome to Hear', is_welcome: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      const welcomeMsgs   = [{ role: 'ai', text: WELCOME_MSG_TEXT, related: WELCOME_RELATED }]
      stored = [...stored, welcomeSession]
      lsSetSessions(stored)
      lsSetMsgs(welcomeId, welcomeMsgs)
    }
    setSessions(stored)
    // Background: sync with backend (fire and forget)
    syncWithBackend(stored)
  }, [userId, profileId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function syncWithBackend(localSessions) {
    try {
      // Ensure welcome exists in DB
      await apiFetch('/api/sessions/ensure-welcome', {
        method: 'POST',
        headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
      }).catch(() => {})
      // Pull DB sessions and merge (DB is source of truth for IDs)
      const r = await apiFetch('/api/sessions', { headers: apiHeaders({ 'x-user-id': userId }) })
      if (!r.ok) return
      const data = await r.json()
      const dbSessions = data.sessions || []
      if (dbSessions.length === 0) return
      // Replace local welcome session with DB welcome session
      const dbWelcome = dbSessions.find(s => s.is_welcome)
      const localWelcomeId = `welcome-${userId}`
      if (dbWelcome && localSessions.find(s => s.id === localWelcomeId)) {
        // Migrate messages from local welcome ID to DB welcome ID
        const localMsgs = lsGetMsgs(localWelcomeId)
        if (localMsgs.length) lsSetMsgs(dbWelcome.id, localMsgs)
        lsDelMsgs(localWelcomeId)
        // Rebuild sessions list replacing local placeholder with real DB sessions
        const merged = [
          ...dbSessions.filter(s => !s.is_welcome),
          ...localSessions.filter(s => !s.is_welcome && !dbSessions.find(d => d.id === s.id)),
          dbWelcome,
        ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        lsSetSessions(merged)
        setSessions(merged)
        // Remap activeSessionId if pointing at old welcome placeholder
        if (activeSessionRef.current === localWelcomeId) {
          activeSessionRef.current = dbWelcome.id
          setActiveSessionId(dbWelcome.id)
        }
      }
    } catch { /* silent — backend is optional */ }
  }

  function createNewSession() {
    const id    = crypto.randomUUID()
    const now   = new Date().toISOString()
    const session = { id, user_id: userId, title: '', is_welcome: false, created_at: now, updated_at: now }
    setSessions(prev => {
      const next = [session, ...prev.filter(s => !s.is_welcome), ...prev.filter(s => s.is_welcome)]
      lsSetSessions(next)
      return next
    })
    activeSessionRef.current = id
    setActiveSessionId(id)
    // Background: persist to DB
    apiFetch('/api/sessions', {
      method: 'POST',
      headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: '' }),
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (!data?.session) return
      // Replace local UUID with real DB ID everywhere
      const dbId = data.session.id
      setSessions(prev => {
        const next = prev.map(s => s.id === id ? { ...data.session } : s)
        lsSetSessions(next)
        return next
      })
      const msgs = lsGetMsgs(id)
      if (msgs.length) { lsSetMsgs(dbId, msgs); lsDelMsgs(id) }
      if (activeSessionRef.current === id) {
        activeSessionRef.current = dbId
        setActiveSessionId(dbId)
      }
    }).catch(() => {})
    return id
  }

  function saveMessage(sessionId, role, text, related) {
    if (!sessionId) return
    const msg = { role, text, related: related || [] }
    const msgs = [...lsGetMsgs(sessionId), msg]
    lsSetMsgs(sessionId, msgs)
    // Update session updated_at in local list
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, updated_at: new Date().toISOString() } : s)
      lsSetSessions(next)
      return next
    })
    // Background: sync to DB (content, not just meta)
    apiFetch(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role, content: text, related }),
    }).catch(() => {})
  }

  async function autoTitleSession(localId, firstMessage) {
    // Always have a fallback so the session never stays stuck on "..."
    const fallbackTitle = firstMessage.trim().replace(/\s+/g, ' ').slice(0, 50) || 'New conversation'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    function applyTitle(title) {
      const currentId = activeSessionRef.current || localId
      setSessions(prev => {
        const next = prev.map(s =>
          (s.id === currentId || s.id === localId) ? { ...s, title } : s
        )
        lsSetSessions(next)
        return next
      })
      apiFetch(`/api/sessions/${currentId}/title`, {
        method: 'PATCH',
        headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
        body: JSON.stringify({ title }),
      }).catch(() => {})
      return currentId
    }

    try {
      const r = await apiFetch('/api/title', {
        method: 'POST',
        headers: apiHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message: firstMessage }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!r.ok) throw new Error('title api failed')
      const data = await r.json()
      if (!data.title) throw new Error('no title in response')

      // Use the current session ID (may have been remapped from local UUID to DB UUID by now)
      const currentId = applyTitle(data.title)
      // Trigger typewriter only on success
      setNewlyNamedId(currentId)
      setTimeout(() => setNewlyNamedId(null), 8000)
    } catch {
      clearTimeout(timeout)
      // API failed or timed out — apply fallback so dots never stay stuck
      applyTitle(fallbackTitle)
    }
  }

  function handleSelectSession(sessionId) {
    if (sessionId === activeSessionRef.current) return
    activeSessionRef.current = sessionId
    setActiveSessionId(sessionId)
    setMessages([])
    setSubmitted(false)
    setSettled(false)
    setFixedStart(null)
    // Load from localStorage immediately
    const msgs = lsGetMsgs(sessionId)
    if (msgs.length) {
      setMessages(msgs)
      setSubmitted(true)
      setSettled(true)
    }
  }

  function handleDeleteSession(sessionId) {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId)
      lsSetSessions(next)
      return next
    })
    lsDelMsgs(sessionId)
    if (activeSessionRef.current === sessionId) {
      activeSessionRef.current = null
      setActiveSessionId(null)
      setMessages([])
      setSubmitted(false)
      setSettled(false)
    }
    apiFetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: apiHeaders({ 'x-user-id': userId }),
    }).catch(() => {})
  }

  function handleRenameSession(sessionId, newTitle) {
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s)
      lsSetSessions(next)
      return next
    })
    apiFetch(`/api/sessions/${sessionId}/title`, {
      method: 'PATCH',
      headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: newTitle }),
    }).catch(() => {})
  }

  function handleNewChat() {
    activeSessionRef.current = null
    setActiveSessionId(null)
    setMessages([])
    setSubmitted(false)
    setSettled(false)
    setFixedStart(null)
  }

  function handleProjectSwitch(profile) {
    onProjectChange?.(profile)
    activeSessionRef.current = null
    setActiveSessionId(null)
    setSessions([])
    setMessages([])
    setSubmitted(false)
    setSettled(false)
    setFixedStart(null)
    setInputOffset(0)
  }

  function handleSubmit(text) {
    setChatDefaultText('')
    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])

    const isFirstMessage = !activeSessionRef.current

    if (!submitted) {
      if (!inputRef.current) return
      const rect = inputRef.current.getBoundingClientRect()
      setFixedStart({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      setSubmitted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInputOffset(window.innerHeight - 32 - rect.bottom)
        })
      })
    }

    setLoading(true)

    // Create session on first message (synchronous — no backend needed)
    let sessionId = activeSessionRef.current
    if (!sessionId) {
      sessionId = createNewSession()
    }
    saveMessage(sessionId, 'user', text, null)

    const history = [...messages, userMsg].map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.text,
    }))

    apiFetch('/api/chat', {
      method: 'POST',
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ messages: history }),
    })
      .then(r => r.json())
      .then(data => {
        setLoading(false)
        const aiText = data.reply || data.error || 'Something went wrong.'
        const aiRelated = data.related || []
        setMessages(prev => [...prev, { role: 'ai', text: aiText, related: aiRelated }])
        // Always use the ref — by the time this resolves, the session may have been
        // remapped from a local UUID to its real DB UUID. The ref is always current.
        const resolvedId = activeSessionRef.current || sessionId
        if (resolvedId) saveMessage(resolvedId, 'ai', aiText, aiRelated)
        if (isFirstMessage && resolvedId) autoTitleSession(resolvedId, text)
      })
      .catch(() => {
        setLoading(false)
        setMessages(prev => [...prev, { role: 'ai', text: 'Failed to reach the server. Please try again.' }])
      })
  }

  const effectiveSidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 0 : SIDEBAR_WIDTH)
  const sidebarTransition = 'left 250ms cubic-bezier(0.4,0,0.2,1), padding-left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)'
  const paddingLeft = isMobile ? '1.5rem' : `calc(${effectiveSidebarWidth}px + 1.5rem)`

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        activeNav={activePage}
        onNavChange={(page) => {
          if (page === 'dashboard' && activePage === 'dashboard') {
            handleNewChat()
          } else {
            setActivePage(page)
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        onSignOut={onSignOut}
        companyConfig={companyConfig}
        userId={userId}
        onProjectChange={handleProjectSwitch}
        sessions={sessions}
        activeSessionId={activeSessionId}
        newlyNamedId={newlyNamedId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onNewChat={handleNewChat}
      />

      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 90,
            width: 40, height: 40,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
        </button>
      )}

      {activePage === 'data' ? (
        <DataPage isMobile={isMobile} sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} companyConfig={companyConfig} />
      ) : activePage !== 'dashboard' ? (
        /* Placeholder for unimplemented pages */
        <div style={{
          position: 'fixed', top: 0,
          left: effectiveSidebarWidth,
          right: 0, bottom: 0,
          transition: sidebarTransition,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {activePage.charAt(0).toUpperCase() + activePage.slice(1).replace(/-/g, ' ')}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6 }}>Coming soon</span>
        </div>
      ) : (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ paddingLeft, transition: sidebarTransition }}
      >

      {/* Header */}
      <div
        className="flex flex-col items-center w-full max-w-2xl"
        style={{
          opacity:       submitted ? 0 : 1,
          transform:     submitted ? 'translateY(-20px)' : 'translateY(0)',
          marginBottom:  submitted ? 0 : '1.5rem',
          pointerEvents: submitted ? 'none' : 'auto',
          transition: [
            'opacity 150ms cubic-bezier(0.4, 0, 1, 1)',
            'transform 150ms cubic-bezier(0.4, 0, 1, 1)',
            'margin-bottom 150ms cubic-bezier(0.4, 0, 1, 1)',
          ].join(', '),
        }}
      >
        <div ref={logoRef} style={{ marginBottom: '1.5rem' }}>
          <HearLogo className="w-20 h-14" />
        </div>
        <div className="text-center">
          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {fullGreeting.split(' ').map((word, i) => (
              <span
                key={i}
                className="dash-word"
                style={{ display: 'inline-block', marginRight: '0.28em' }}
              >
                {word}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="mt-2 text-lg tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            {companyConfig?.companyName
            ? `What would you like to explore for ${companyConfig.companyName}?`
            : 'What would you like to explore today?'
          }
          </p>
        </div>
      </div>

      {fixedStart && !settled && (
        <div style={{ width: '100%', maxWidth: '42rem', height: fixedStart.height, flexShrink: 0 }} />
      )}

      {/* Chat input */}
      <div
        ref={inputRef}
        style={
          settled
            ? {
                position:  'fixed',
                bottom:    32,
                left:       isMobile ? '50%' : `calc(50% + ${effectiveSidebarWidth / 2}px)`,
                transform:  'translateX(-50%)',
                width:      isMobile ? 'calc(100% - 3rem)' : `calc(100% - ${effectiveSidebarWidth}px - 3rem)`,
                transition: sidebarTransition,
                maxWidth:  '42rem',
                zIndex:    50,
              }
            : fixedStart
            ? {
                position:   'fixed',
                top:        fixedStart.top,
                left:       fixedStart.left,
                width:      fixedStart.width,
                willChange: 'transform',
                transform:  `translateY(${inputOffset}px)`,
                transition: inputOffset !== 0
                  ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
                zIndex: 50,
              }
            : {
                width:    '100%',
                maxWidth: '42rem',
              }
        }
        onTransitionEnd={(e) => {
          if (
            e.target === inputRef.current &&
            e.propertyName === 'transform' &&
            fixedStart &&
            !settled
          ) {
            setSettled(true)
          }
        }}
      >
        <ChatInput onSubmit={(text) => handleSubmit(text)} onMentionChange={setMentionActive} onUploadChange={setUploadActive} loading={loading} settled={settled} suggestedPrompts={companyConfig?.suggestedPrompts} defaultText={chatDefaultText} />
      </div>

      {/* Request cards — pre-submit */}
      {!submitted && (
        <div style={{
          width: '100%',
          maxWidth: '42rem',
          marginTop: '1.5rem',
          opacity: (mentionActive || uploadActive) ? 0 : 1,
          transition: 'opacity 200ms ease',
          pointerEvents: (mentionActive || uploadActive) ? 'none' : 'auto',
        }}>
          {/* ── Tab toggle ── */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-active)',
            borderRadius: 10,
            padding: 3,
            gap: 2,
            marginBottom: 14,
          }}>
            {[
              { id: 'suggestions', label: 'AI Suggestions' },
              { id: 'insights',    label: '✦ Insights'     },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setDashTab(id)}
                style={{
                  padding: '6px 18px',
                  borderRadius: 7,
                  border: 'none',
                  background: dashTab === id ? 'var(--bg-card)' : 'transparent',
                  color: dashTab === id ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Byrd', sans-serif",
                  cursor: 'pointer',
                  transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
                  boxShadow: dashTab === id ? '0 1px 4px rgba(0,0,0,0.14)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {dashTab === 'suggestions' ? (
            /* ── AI Suggestions cards ── */
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 72,
                background: 'linear-gradient(to bottom, var(--bg-canvas) 0%, transparent 100%)',
                pointerEvents: 'none', zIndex: 3,
                opacity: cardsScrolled ? 1 : 0, transition: 'opacity 350ms ease',
              }} />
              <div ref={cardsRef} className="cards-scroll" data-scrolling={cardsScrolling} onScroll={e => {
                setCardsScrolled(e.currentTarget.scrollTop > 0)
                setCardsScrolling(true)
                clearTimeout(cardsScrollTimeout.current)
                cardsScrollTimeout.current = setTimeout(() => setCardsScrolling(false), 800)
              }} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
                gap: 12,
                maxHeight: 280,
                overflowY: 'auto',
                paddingBottom: 40,
              }}>
                {requests.map((req, i) => (
                  <div
                    key={i}
                    className="request-card"
                    style={{ borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="card-title" style={{ fontSize: 13, fontWeight: 600 }}>Request {req.id}</span>
                        <span className="card-tag" style={{ fontSize: 11, borderRadius: 999, border: '1px solid', padding: '2px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '12ch' }}>{req.tag}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><ExternalLinkIcon /></span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{req.description}</p>
                  </div>
                ))}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 96,
                background: 'linear-gradient(to bottom, transparent 0%, var(--bg-canvas) 100%)',
                pointerEvents: 'none', zIndex: 3,
              }} />
            </div>
          ) : (
            /* ── Insights panel ── */
            <InsightsPanel config={companyConfig} />
          )}
        </div>
      )}

      {/* Chat thread — post-submit */}
      {submitted && settled && (
        <div className="smooth-scroll" style={{
          position: 'fixed',
          top: 0,
          left: effectiveSidebarWidth,
          right: 0,
          bottom: 80,
          overflowY: 'auto',
          transition: sidebarTransition,
          padding: '40px 24px 160px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(() => {
              const lastAIIndex = messages.reduce((acc, m, i) => m.role === 'ai' ? i : acc, -1)
              return messages.map((msg, i) => {
                const isAI = msg.role === 'ai'
                const showActions = isAI && (i === lastAIIndex || hoveredMsg === i)
                return (
                  <ChatBubble
                    key={i}
                    role={msg.role}
                    text={msg.text}
                    related={i === lastAIIndex ? (msg.related ?? []) : []}
                    showActions={showActions}
                    onCopy={() => { navigator.clipboard.writeText(msg.text); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 1500) }}
                    copied={copiedIndex === i}
                    onRelatedClick={(topic) => setChatDefaultText(topic)}
                    onMouseEnter={() => isAI && setHoveredMsg(i)}
                    onMouseLeave={() => isAI && setHoveredMsg(null)}
                  />
                )
              })
            })()}

            {/* Thinking indicator */}
            {loading && <ChatBubble role="thinking" />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

    </div>
      )}
    </div>
  )
}

export default function App() {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem('hear-signed-in') === '1')
  const [companyConfig, setCompanyConfig] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('hear-session-config') || 'null') } catch { return null }
  })

  const [profileId, setProfileId] = useState(() => localStorage.getItem('hear-demo-profile-id') || null)

  // Stable user identifier (email for demo users, anon UUID otherwise)
  const [userId, setUserId] = useState(() => {
    const stored = sessionStorage.getItem('hear-user-id')
    if (stored) return stored
    let anon = localStorage.getItem('hear-anon-id')
    if (!anon) { anon = crypto.randomUUID(); localStorage.setItem('hear-anon-id', anon) }
    return anon
  })
  const [isDark, setIsDark] = useState(() => {
    const dark = localStorage.getItem('hear-theme') !== 'light'
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    return dark
  })

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    localStorage.setItem('hear-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(d => !d)

  function handleSignIn(profile = null) {
    const config = profile?.config ?? (profile?.companyName ? profile : null)
    if (config?.companyName) {
      setCompanyConfig(config)
      sessionStorage.setItem('hear-session-config', JSON.stringify(config))
      localStorage.setItem('hear-demo-config', JSON.stringify(config))
    } else {
      setCompanyConfig(null)
      sessionStorage.removeItem('hear-session-config')
    }

    // Persist user identifier for session binding
    const email = profile?.user_email ?? profile?.email ?? ''
    let finalId
    if (email) {
      finalId = email
    } else {
      let anon = localStorage.getItem('hear-anon-id')
      if (!anon) { anon = crypto.randomUUID(); localStorage.setItem('hear-anon-id', anon) }
      finalId = anon
    }
    sessionStorage.setItem('hear-user-id', finalId)
    setUserId(finalId)

    // Scope sessions to the selected profile
    const pid = profile?.id ? String(profile.id) : null
    setProfileId(pid)

    sessionStorage.setItem('hear-signed-in', '1')
    setSignedIn(true)
  }

  function handleProjectChange(profile) {
    const config = profile?.config ?? null
    if (config?.companyName) {
      setCompanyConfig(config)
      sessionStorage.setItem('hear-session-config', JSON.stringify(config))
      localStorage.setItem('hear-demo-config', JSON.stringify(config))
    }
    const pid = profile?.id ? String(profile.id) : null
    // Keep localStorage in sync so apiHeaders() sends the correct x-demo-profile-id
    if (pid) localStorage.setItem('hear-demo-profile-id', pid)
    else localStorage.removeItem('hear-demo-profile-id')
    setProfileId(pid)
  }

  function handleSignOut() {
    sessionStorage.removeItem('hear-signed-in')
    sessionStorage.removeItem('hear-session-config')
    setCompanyConfig(null)
    setSignedIn(false)
  }

  if (!signedIn) return <SignIn onSignIn={handleSignIn} />
  return <MainApp isDark={isDark} onThemeToggle={toggleTheme} companyConfig={companyConfig} onSignOut={handleSignOut} onProjectChange={handleProjectChange} userId={userId} profileId={profileId} />
}
