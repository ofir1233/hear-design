/**
 * LabApp — Design Lab shell.
 * Isolated from MainApp/Demo. All UI experiments happen here.
 * To override a component: copy src/components/X.jsx → src/lab/components/X.jsx
 * and update the import below. Demo is never affected.
 */
import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { apiFetch, apiHeaders } from '../lib/api.js'
import HearLogo    from '../components/HearLogo.jsx'
import ChatBubble  from '../components/ChatBubble.jsx'
import ChatInput   from '../components/ChatInput.jsx'
import Sidebar     from './components/Sidebar.jsx'
import Header      from './components/Header.jsx'
import DataPage    from '../components/data/DataPage.jsx'
import ExplorePage from '../components/data/ExplorePage.jsx'
import ReportsPage from '../components/reports/ReportsPage.jsx'
import CreateReportPage from '../components/reports/CreateReportPage.jsx'
import AgentEvalPage from '../components/agent-eval/AgentEvalPage.jsx'
import SignalsPage from '../components/signals/SignalsPage.jsx'
import CreateSignalPage from '../components/signals/CreateSignalPage.jsx'
import KnowledgePage from '../components/knowledge/KnowledgePage.jsx'
import OrganizationPage from '../components/settings/OrganizationPage.jsx'
import ProjectsPage, { PROJECT_NAMES } from '../components/settings/ProjectsPage.jsx'
import TeamsPage from '../components/settings/TeamsPage.jsx'
import PromptsPage from '../components/settings/PromptsPage.jsx'
import ProfilePage from '../components/settings/ProfilePage.jsx'
import BillingPage from '../components/settings/BillingPage.jsx'
import UsagePage from '../components/settings/UsagePage.jsx'
import ActionsPage from '../components/actions/ActionsPage.jsx'
import TopicsPage from '../components/topics/TopicsPage.jsx'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import DailyBriefing from './components/DailyBriefing.jsx'

// Inspector lives here — never in Demo
const InspectorRoot = lazy(() => import('../inspector/index.jsx'))

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const SIDEBAR_WIDTH = 288 // 272px panel + 16px left margin

const SETTINGS_TAB_META = {
  'organization':   { label: 'Organization',   desc: 'Manage your organization profile and preferences' },
  'teams':          { label: 'Teams',           desc: 'Create and manage teams within your organization' },
  'prompts':        { label: 'Prompts Management', desc: 'Manage system, organization, and project-level prompts and their definitions' },
  'projects':       { label: 'Projects',        desc: 'Configure projects and their settings' },
  'profile':        { label: 'Profile',         desc: 'Update your personal profile and account details' },
  'actions':        { label: 'Actions',         desc: 'Define and manage automated actions' },
  'billing':        { label: 'Billing',         desc: 'Manage your subscription, invoices and payment methods' },
  'usage':          { label: 'Usage',           desc: 'Monitor usage across your organization' },
  'user-analytics': { label: 'User Analytics',  desc: 'Insights into user activity and engagement' },
  'integrations':   { label: 'Integrations',    desc: 'Connect third-party tools and services' },
  'it-admin':       { label: 'IT Admin',        desc: 'Security, SSO, and infrastructure settings' },
  'marketplace':    { label: 'Marketplace',     desc: 'Browse and install apps and extensions' },
}

function SettingsTabHeader({ tab, rightSlot }) {
  const meta = SETTINGS_TAB_META[tab] ?? { label: tab, desc: '' }
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        paddingBottom: 16, borderBottom: '1px solid var(--border-default)',
      }}>
        <div>
          <div style={{
            fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
            fontFamily: "'Byrd', sans-serif", lineHeight: 1.2,
          }}>
            {meta.label}
          </div>
          <div style={{
            fontSize: 13, color: 'var(--text-muted)',
            fontFamily: "'Byrd', sans-serif", marginTop: 4,
          }}>
            {meta.desc}
          </div>
        </div>
        {tab === 'organization' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingTop: 2 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>Org ID</span>
            <Badge variant="tinted" color="coral" shape="rect" uppercase={false}>
              65f96f19e688fdd512b3226a
            </Badge>
          </div>
        )}
        {rightSlot}
      </div>
    </div>
  )
}

function buildRequestCards(config) {
  const name   = config?.companyName || 'your company'
  const topics = config?.commonTopics?.length
    ? config.commonTopics
    : ['Trending Topics', 'Agent Performance', 'Customer Sentiment', 'Escalations', 'Call Volume', 'Product Mentions', 'Churn Risk', 'Satisfaction']

  if (config?.suggestedPrompts?.length) {
    const prompts = config.suggestedPrompts.slice(0, 10)
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

function parsePath() {
  const parts = window.location.pathname.replace(/^\//, '').split('/')
  const page  = parts[0] || 'dashboard'
  const sub   = parts[1] || null
  const id    = parts[2] || null
  return { page, sub, id }
}

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function LabApp({ isDark, onThemeToggle, companyConfig, onSignOut, onProjectChange, userId, profileId }) {
  const greeting     = getGreeting()
  const userName     = localStorage.getItem('hear-user-name') || 'there'
  const fullGreeting = `${greeting}, ${userName}.`
  const requests     = buildRequestCards(companyConfig)
  const isMobile     = useIsMobile()

  const [route, setRoute] = useState(parsePath)
  const activePage    = route.page
  const selectedCall  = route.sub === 'explore' && route.id
    ? JSON.parse(sessionStorage.getItem(`hear-call-${route.id}`) || 'null')
    : null

  useEffect(() => {
    function onPop() { setRoute(parsePath()) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function setActivePage(page) { navigate(`/${page}`) }

  function openCall(call) {
    sessionStorage.setItem(`hear-call-${call.id}`, JSON.stringify(call))
    navigate(`/data/explore/${call.id}`, { call })
  }

  function closeExplore() { navigate('/data') }

  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true')
  const [submitted, setSubmitted]              = useState(false)
  const [settled, setSettled]                  = useState(false)
  const justSettledRef                         = useRef(false)
  const [loading, setLoading]                  = useState(false)
  const [fixedStart, setFixedStart]            = useState(null)
  const [inputOffset, setInputOffset]          = useState(0)
  const [messages, setMessages]                = useState([])
  const inputRef           = useRef(null)
  const cardsRef           = useRef(null)
  const messagesEndRef     = useRef(null)
  const [cardsScrolled, setCardsScrolled]     = useState(false)
  const [cardsScrolling, setCardsScrolling]   = useState(false)
  const cardsScrollTimeout                     = useRef(null)
  const [mentionActive, setMentionActive]     = useState(false)
  const [uploadActive, setUploadActive]       = useState(false)
  const [hoveredMsg, setHoveredMsg]           = useState(null)
  const [copiedIndex, setCopiedIndex]         = useState(null)
  const [chatDefaultText, setChatDefaultText] = useState('')
  const dashTabContentRef = useRef(null)
  const dashTabReady      = useRef(false)

  const [sessions, setSessions]                   = useState([])
  const [activeSessionId, setActiveSessionId]     = useState(null)
  const [newlyNamedId, setNewlyNamedId]           = useState(null)
  const activeSessionRef                          = useRef(null)

  const logoRef          = useRef(null)
  const subtitleRef      = useRef(null)
  const greetingRef       = useRef(null)
  const suggestionsRef    = useRef(null)
  const dailyBriefingRef  = useRef(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [logoActive, setLogoActive]       = useState(false)
  const [logoGradHover, setLogoGradHover] = useState(false)
  const logoTimerRef = useRef(null)
  const focusTlRef   = useRef(null)

  const logoGradTweenRef  = useRef(null)


  // Clean up logo animations when conversation starts — kill tweens only,
  // let the CSS parent fade handle the visual disappearance
  useEffect(() => {
    if (!submitted) return
    clearTimeout(logoTimerRef.current)
    logoGradTweenRef.current?.kill()
    logoGradTweenRef.current = null

    // Kill all running tweens without touching opacity (CSS handles the fade)
    ;['logoGradPath','logoDotsRing'].forEach(id => {
      const el = document.getElementById(id)
      if (el) gsap.killTweensOf(el)
    })
    for (let i = 0; i < 28; i++) gsap.killTweensOf(document.getElementById(`logoDot-${i}`))

    // Delay React state cleanup until after CSS transition completes (~200ms)
    const t = setTimeout(() => {
      setLogoActive(false)
      setInputFocused(false)
    }, 200)
    return () => clearTimeout(t)
  }, [submitted])

  useEffect(() => {
    clearTimeout(logoTimerRef.current)
    if (inputFocused) {
      logoTimerRef.current = setTimeout(() => {
        setLogoGradHover(false)
        setLogoActive(true)
        // Two rAFs: first lets React render the new elements, second starts GSAP
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const grad = document.getElementById('logoRadiance')
          const path = document.getElementById('logoGradPath')
          if (!grad || !path) return

          // Start rotation immediately (no position flicker when it fades in)
          logoGradTweenRef.current = gsap.fromTo(grad,
            { attr: { gradientTransform: 'rotate(0, 34.5, 30)' } },
            { attr: { gradientTransform: 'rotate(360, 34.5, 30)' },
              duration: 3, ease: 'none', repeat: -1 }
          )
          // Fade gradient in
          gsap.to(path, { opacity: 1, duration: 0.55, ease: 'power2.out' })

          // ── Inner ring (clockwise) ──────────────────────────────────
          const ring = document.getElementById('logoDotsRing')
          if (ring) {
            gsap.to(ring, { opacity: 1, duration: 0.5, ease: 'power2.out' })
            gsap.to(ring, { rotation: 360, svgOrigin: '34.5 30', duration: 8, ease: 'none', repeat: -1 })

            const dotEls = Array.from({ length: 28 }, (_, i) => document.getElementById(`logoDot-${i}`)).filter(Boolean)
            const origFills   = dotEls.map(el => el.getAttribute('fill'))
            const origOpacity = dotEls.map(el => parseFloat(el.getAttribute('opacity')))

            const innerTl = gsap.timeline({ repeat: -1 })
            innerTl.to(dotEls, { attr: { fill: '#4DA3FF' }, opacity: 1, duration: 0.2, ease: 'power2.out', stagger: 8 / 28 })
            innerTl.to(dotEls, {
              attr: { fill: (i) => origFills[i] },
              opacity: (i) => origOpacity[i],
              duration: 0.35, ease: 'power2.in',
              stagger: 8 / 28,
            }, `<+0.9`)
          }

        }))
      }, 420)
    } else {
      // Fade out gradient path before killing tween
      const path = document.getElementById('logoGradPath')
      const ring = document.getElementById('logoDotsRing')
      if (ring) { gsap.killTweensOf(ring); gsap.to(ring, { opacity: 0, duration: 0.2 }) }
      if (path) {
        gsap.to(path, {
          opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            logoGradTweenRef.current?.kill()
            logoGradTweenRef.current = null
            setLogoActive(false)
          }
        })
      } else {
        logoGradTweenRef.current?.kill()
        logoGradTweenRef.current = null
        setLogoActive(false)
      }
    }
    return () => clearTimeout(logoTimerRef.current)
  }, [inputFocused])

  useEffect(() => {
    window.__hearActivePage = activePage
    window.dispatchEvent(new CustomEvent('hear:nav-changed', { detail: activePage }))
  }, [activePage])
  useEffect(() => {
    function onInspectorNav(e) { navigate(`/${e.detail}`) }
    window.addEventListener('hear:nav', onInspectorNav)
    return () => window.removeEventListener('hear:nav', onInspectorNav)
  }, [])

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
    gsap.set(words,    { opacity: 0, y: 22 })
    gsap.set(subtitle, { opacity: 0, y: 14 })
    gsap.set(input,    { opacity: 0, y: 18 })
    gsap.set(cards,    { opacity: 0, y: 20 })

    tl.to(logo,     { opacity: 1, scale: 1, duration: 0.55 },                                    0)
    tl.to(words,    { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 },    0.15)
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.55 },                   0.48)
    tl.to(input,    { opacity: 1, y: 0, duration: 0.55 },                                        0.62)
    tl.to(cards,    { opacity: 1, y: 0, duration: 0.42, stagger: 0.045 },                        0.78)
    dashTabReady.current = true
  }, [activePage])

  // ── Focus expand / greeting shrink ─────────────────────────────
  useEffect(() => {
    if (submitted || settled) return

    // Kill any in-progress focus/blur animation before starting a new one
    focusTlRef.current?.kill()

    const suggestions  = suggestionsRef.current
    const suggItems    = suggestions?.querySelectorAll('.hive-badge') ?? []
    const db           = dailyBriefingRef.current

    const logo     = logoRef.current
    const words    = document.querySelectorAll('.dash-word')
    const subtitle = subtitleRef.current

    if (inputFocused) {
      const tl = gsap.timeline()
      focusTlRef.current = tl

      // Fade out greeting text only (words + subtitle) — logo stays
      tl.to([...words, subtitle], {
        opacity: 0, y: -12,
        duration: 0.22, ease: 'power3.in', stagger: 0.03,
      }, 0)

      // Shrink logo in place
      tl.to(logo, {
        scale: 0.52, y: 0,
        duration: 0.45, ease: 'expo.out',
      }, 0.1)


      // Lift input up
      if (inputRef.current) tl.to(inputRef.current, {
        y: -100, scale: 1.018, duration: 0.5, ease: 'expo.out',
      }, 0.22)

      // Suggestions stagger in
      if (suggItems.length) tl.fromTo(suggItems,
        { opacity: 0, y: 10, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.04, ease: 'expo.out' },
        0.38
      )

      // Push Daily Briefing below suggestions
      if (db) tl.to(db, { y: 230, duration: 0.5, ease: 'expo.out' }, 0.22)

    } else {
      const tl = gsap.timeline()
      focusTlRef.current = tl

      // Fade suggestions out first
      if (suggItems.length) tl.to(suggItems, {
        opacity: 0, y: 6, scale: 0.94, duration: 0.18, stagger: 0.02, ease: 'power2.in',
      }, 0)

      // Drop input back
      if (inputRef.current) tl.to(inputRef.current, {
        y: 0, scale: 1, duration: 0.5, ease: 'expo.out',
      }, 0.1)

      // Daily Briefing back up
      if (db) tl.to(db, { y: 0, duration: 0.5, ease: 'expo.out' }, 0.1)

      // Logo returns to full size
      tl.to(logo, { scale: 1, y: 0, duration: 0.45, ease: 'expo.out' }, 0.15)

      // Text fades back in
      tl.to([...words, subtitle], {
        opacity: 1, y: 0,
        duration: 0.45, ease: 'expo.out', stagger: 0.04,
      }, 0.28)
    }
  }, [inputFocused]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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
  function lsGetSessions()      { try { return JSON.parse(localStorage.getItem(sessionNs) || '[]') } catch { return [] } }
  function lsSetSessions(s)     { localStorage.setItem(sessionNs, JSON.stringify(s)) }
  function lsGetMsgs(sid)       { try { return JSON.parse(localStorage.getItem(`hear-msgs-${sid}`) || '[]') } catch { return [] } }
  function lsSetMsgs(sid, msgs) { localStorage.setItem(`hear-msgs-${sid}`, JSON.stringify(msgs)) }
  function lsDelMsgs(sid)       { localStorage.removeItem(`hear-msgs-${sid}`) }

  useEffect(() => {
    if (!userId) return
    let stored = lsGetSessions()
    if (!stored.find(s => s.is_welcome)) {
      const welcomeId      = `welcome-${userId}${profileId ? `-${profileId}` : ''}`
      const welcomeSession = { id: welcomeId, user_id: userId, title: 'Welcome to Hear', is_welcome: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      const welcomeMsgs    = [{ role: 'ai', text: WELCOME_MSG_TEXT, related: WELCOME_RELATED }]
      stored = [...stored, welcomeSession]
      lsSetSessions(stored)
      lsSetMsgs(welcomeId, welcomeMsgs)
    }
    setSessions(stored)
    syncWithBackend(stored)
  }, [userId, profileId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function syncWithBackend(localSessions) {
    try {
      await apiFetch('/api/sessions/ensure-welcome', {
        method: 'POST',
        headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
      }).catch(() => {})
      const r = await apiFetch('/api/sessions', { headers: apiHeaders({ 'x-user-id': userId }) })
      if (!r.ok) return
      const data       = await r.json()
      const dbSessions = data.sessions || []
      if (dbSessions.length === 0) return
      const dbWelcome      = dbSessions.find(s => s.is_welcome)
      const localWelcomeId = `welcome-${userId}`
      if (dbWelcome && localSessions.find(s => s.id === localWelcomeId)) {
        const localMsgs = lsGetMsgs(localWelcomeId)
        if (localMsgs.length) lsSetMsgs(dbWelcome.id, localMsgs)
        lsDelMsgs(localWelcomeId)
        const merged = [
          ...dbSessions.filter(s => !s.is_welcome),
          ...localSessions.filter(s => !s.is_welcome && !dbSessions.find(d => d.id === s.id)),
          dbWelcome,
        ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        lsSetSessions(merged)
        setSessions(merged)
        if (activeSessionRef.current === localWelcomeId) {
          activeSessionRef.current = dbWelcome.id
          setActiveSessionId(dbWelcome.id)
        }
      }
    } catch { /* silent */ }
  }

  function createNewSession() {
    const id      = crypto.randomUUID()
    const now     = new Date().toISOString()
    const session = { id, user_id: userId, title: '', is_welcome: false, created_at: now, updated_at: now }
    setSessions(prev => {
      const next = [session, ...prev.filter(s => !s.is_welcome), ...prev.filter(s => s.is_welcome)]
      lsSetSessions(next)
      return next
    })
    activeSessionRef.current = id
    setActiveSessionId(id)
    apiFetch('/api/sessions', {
      method: 'POST',
      headers: apiHeaders({ 'x-user-id': userId, 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: '' }),
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (!data?.session) return
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
    const msg  = { role, text, related: related || [] }
    const msgs = [...lsGetMsgs(sessionId), msg]
    lsSetMsgs(sessionId, msgs)
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, updated_at: new Date().toISOString() } : s)
      lsSetSessions(next)
      return next
    })
    apiFetch(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role, content: text, related }),
    }).catch(() => {})
  }

  async function autoTitleSession(localId, firstMessage) {
    const fallbackTitle  = firstMessage.trim().replace(/\s+/g, ' ').slice(0, 50) || 'New conversation'
    const controller     = new AbortController()
    const timeout        = setTimeout(() => controller.abort(), 15000)

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
      const currentId = applyTitle(data.title)
      setNewlyNamedId(currentId)
      setTimeout(() => setNewlyNamedId(null), 8000)
    } catch {
      clearTimeout(timeout)
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
    navigate('/dashboard')
  }

  function handleSubmit(text) {
    setChatDefaultText('')
    const userMsg        = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    const isFirstMessage = !activeSessionRef.current

    if (!submitted) {
      if (!inputRef.current) return
      // Kill any in-flight GSAP transforms and snap to natural position
      // before capturing the rect — prevents wrong fixedStart from y/scale tweens
      gsap.killTweensOf(inputRef.current)
      gsap.set(inputRef.current, { y: 0, scale: 1 })
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

    let sessionId = activeSessionRef.current
    if (!sessionId) { sessionId = createNewSession() }
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
        const aiText    = data.reply || data.error || 'Something went wrong.'
        const aiRelated = data.related || []
        setMessages(prev => [...prev, { role: 'ai', text: aiText, related: aiRelated }])
        const resolvedId = activeSessionRef.current || sessionId
        if (resolvedId) saveMessage(resolvedId, 'ai', aiText, aiRelated)
        if (isFirstMessage && resolvedId) autoTitleSession(resolvedId, text)
      })
      .catch(() => {
        setLoading(false)
        setMessages(prev => [...prev, { role: 'ai', text: 'Failed to reach the server. Please try again.' }])
      })
  }

  const [settingsTab, setSettingsTab] = useState('organization')
  const [selectedProject, setSelectedProject] = useState(PROJECT_NAMES[0])

  // On mobile: hamburger is left:16 width:52 → right edge at 68px. Add 16px gap → header at 84px.
  // effectiveSidebarWidth drives header left (value + 16), so 68 gives left:84.
  const effectiveSidebarWidth = isMobile ? 68 : (sidebarCollapsed ? 72 : SIDEBAR_WIDTH)
  const sidebarTransition     = 'left 250ms cubic-bezier(0.4,0,0.2,1), padding-left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)'
  const paddingLeft           = isMobile ? '1.5rem' : `calc(${effectiveSidebarWidth}px + 1.5rem)`

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
            navigate(`/${page}`)
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => { const next = !c; localStorage.setItem('sidebar_collapsed', next); return next })}
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
        settingsTab={settingsTab}
        onSettingsTabChange={setSettingsTab}
      />

      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed', top: 16, left: 16, zIndex: 90,
            width: 52, height: 52,
            background: 'var(--bg-sidebar)',
            border: 'var(--page-header-border)',
            borderRadius: 16,
            boxShadow: 'var(--page-header-shadow)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 5, cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2 }} />
        </button>
      )}

      {activePage === 'data' && selectedCall ? (
        <ExplorePage
          call={selectedCall}
          onBack={closeExplore}
          isMobile={isMobile}
          sidebarWidth={effectiveSidebarWidth}
          sidebarTransition={sidebarTransition}
        />
      ) : activePage === 'data' ? (
        <DataPage
          isMobile={isMobile}
          sidebarWidth={effectiveSidebarWidth}
          sidebarTransition={sidebarTransition}
          companyConfig={companyConfig}
          onOpenCall={openCall}
        />
      ) : activePage === 'reports' && route.sub === 'create' ? (
        <CreateReportPage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'reports' ? (
        <ReportsPage isMobile={isMobile} sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} companyConfig={companyConfig} />
      ) : activePage === 'agent-eval' ? (
        <AgentEvalPage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'signals' && route.sub === 'create' ? (
        <CreateSignalPage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'signals' ? (
        <SignalsPage isMobile={isMobile} sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'topics' ? (
        <TopicsPage isMobile={isMobile} sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'knowledge' ? (
        <KnowledgePage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'actions' ? (
        <ActionsPage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />
      ) : activePage === 'settings' ? (
        <div style={{ position: 'fixed', top: 0, left: effectiveSidebarWidth, right: 0, bottom: 0, transition: sidebarTransition, background: 'var(--bg-canvas)' }}>
          <Header
            style={{ left: effectiveSidebarWidth + 16, transition: sidebarTransition }}
            left={
              <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                Settings
                <span style={{ fontWeight: 400, color: 'var(--text-muted)', margin: '0 6px' }}>›</span>
                <span style={{ color: 'var(--c100)' }}>
                  {settingsTab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </span>
            }
            right={
              <div style={{ display: 'flex', gap: 8 }}>
                {settingsTab === 'teams' ? (
                  <Button variant="primary" size="sm">Add Team</Button>
                ) : settingsTab === 'prompts' ? (
                  <Button variant="primary" size="sm">Create Prompt</Button>
                ) : settingsTab === 'profile' ? (
                  <Button variant="primary" size="sm">Update Profile</Button>
                ) : settingsTab === 'billing' ? (
                  <Button variant="primary" size="sm">Add Card</Button>
                ) : settingsTab === 'projects' ? (
                  <>
                    <Button variant="secondary" size="sm">Clone Project</Button>
                    <Button variant="secondary" size="sm">Create Project</Button>
                    <Button variant="danger" size="sm">Delete Project</Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm">Add Organization</Button>
                    <Button variant="secondary" size="sm">Delete Organization</Button>
                  </>
                )}
              </div>
            }
          />
          {/* Content */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', paddingTop: 84 }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 40px 48px' }}>
              <SettingsTabHeader
                tab={settingsTab}
                rightSlot={settingsTab === 'projects' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>Select project</span>
                    <select
                      value={selectedProject}
                      onChange={e => setSelectedProject(e.target.value)}
                      style={{
                        height: 34, padding: '0 28px 0 10px',
                        background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
                        borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
                        fontFamily: "'Byrd', sans-serif", outline: 'none', cursor: 'pointer',
                        appearance: 'none', minWidth: 180,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                      }}
                    >
                      {PROJECT_NAMES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
              />
              {settingsTab === 'organization' ? (
                <OrganizationPage />
              ) : settingsTab === 'teams' ? (
                <TeamsPage />
              ) : settingsTab === 'prompts' ? (
                <PromptsPage />
              ) : settingsTab === 'profile' ? (
                <ProfilePage />
              ) : settingsTab === 'billing' ? (
                <BillingPage isDark={isDark} />
              ) : settingsTab === 'usage' ? (
                <UsagePage isDark={isDark} />
              ) : settingsTab === 'projects' ? (
                <ProjectsPage selectedProject={selectedProject} onProjectChange={setSelectedProject} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    {settingsTab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6 }}>Coming soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activePage !== 'dashboard' ? (
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
          className="flex flex-col items-center justify-center px-6"
          style={{ height: '100vh', overflow: 'visible', paddingLeft, paddingTop: 84, paddingBottom: 84, transition: sidebarTransition, boxSizing: 'border-box' }}
        >
          <Header
            style={{
              left: effectiveSidebarWidth + 16,
              transition: sidebarTransition,
            }}
            left={
              <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                Dashboard
              </span>
            }
          />
          <div
            ref={greetingRef}
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
            <div ref={logoRef} style={{ marginBottom: '1.5rem', willChange: 'transform, opacity' }}>
              <HearLogo className="w-20 h-14" isActive={logoActive} gradientOnly={logoGradHover && !logoActive} />
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

          <div
            ref={inputRef}
            style={
              settled
                ? (() => {
                    const noTransition = justSettledRef.current
                    if (noTransition) requestAnimationFrame(() => { justSettledRef.current = false })
                    return {
                      position: 'fixed', bottom: 32,
                      left:      isMobile ? '50%' : `calc(50% + ${effectiveSidebarWidth / 2}px)`,
                      transform: 'translateX(-50%)',
                      width:     isMobile ? 'calc(100% - 3rem)' : `calc(100% - ${effectiveSidebarWidth}px - 3rem)`,
                      transition: noTransition ? 'none' : sidebarTransition,
                      maxWidth: '42rem', zIndex: 50,
                    }
                  })()
                : fixedStart
                ? {
                    position: 'fixed',
                    top:       fixedStart.top,
                    left:      fixedStart.left,
                    width:     fixedStart.width,
                    willChange: 'transform',
                    transform:  `translateY(${inputOffset}px)`,
                    transition: inputOffset !== 0
                      ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'none',
                    zIndex: 50,
                  }
                : { width: '100%', maxWidth: '42rem', position: 'relative', zIndex: 10, isolation: 'isolate', willChange: 'transform' }
            }
            onTransitionEnd={(e) => {
              if (
                e.target === inputRef.current &&
                e.propertyName === 'transform' &&
                fixedStart && !settled
              ) { justSettledRef.current = true; setSettled(true) }
            }}
          >
            <ChatInput
              onSubmit={(text) => handleSubmit(text)}
              onMentionChange={setMentionActive}
              onUploadChange={setUploadActive}
              onFocusChange={setInputFocused}
              loading={loading}
              settled={settled}
              suggestedPrompts={companyConfig?.suggestedPrompts}
              defaultText={chatDefaultText}
              onKeystroke={(dir) => {
                const ring = document.getElementById('logoDotsRing')
                if (ring) {
                  clearTimeout(ring._keystrokeTimer)
                  const tweens = gsap.getTweensOf(ring)
                  const overlay = document.getElementById('logoDeleteOverlay')
                  const gradPath = document.getElementById('logoGradPath')
                  if (dir === 'delete') {
                    tweens.forEach(t => gsap.to(t, { timeScale: -1, duration: 0.2, ease: 'power2.out' }))
                    gsap.to(ring, { filter: 'sepia(1) saturate(3) hue-rotate(-20deg)', duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
                    if (gradPath) gsap.to(gradPath, { opacity: 0.08, duration: 0.25, ease: 'power2.out', overwrite: true })
                    if (overlay)  gsap.to(overlay,  { opacity: 0.72, duration: 0.3, ease: 'power2.out', overwrite: true })
                  } else if (dir === 'deleteEnd' || dir === 'add') {
                    tweens.forEach(t => gsap.to(t, { timeScale: 1, duration: 0.35, ease: 'power2.inOut' }))
                    gsap.killTweensOf(ring, 'filter')
                    gsap.set(ring, { filter: 'none' })
                    if (overlay)  { gsap.killTweensOf(overlay, 'opacity');  gsap.to(overlay,  { opacity: 0,    duration: 0.45, ease: 'power2.out' }) }
                    if (gradPath) { gsap.killTweensOf(gradPath, 'opacity'); gsap.to(gradPath, { opacity: 0.85, duration: 0.45, ease: 'power2.out' }) }
                  }
                }
                if (dir === 'add') {
                  // Gradient gleam
                  const path = document.getElementById('logoGradPath')
                  if (path) {
                    gsap.killTweensOf(path, 'opacity')
                    gsap.fromTo(path, { opacity: 1 }, { opacity: 0.8, duration: 0.5, ease: 'power2.out' })
                  }
                  // Dot flicker
                  const dotEls = Array.from({ length: 28 }, (_, i) => document.getElementById(`logoDot-${i}`)).filter(Boolean)
                  if (dotEls.length) {
                    gsap.killTweensOf(dotEls, 'opacity')
                    gsap.fromTo(dotEls,
                      { opacity: 0.85 },
                      { opacity: 0.28, duration: 0.6, ease: 'power2.out', stagger: { each: 0.012, from: 'random' } }
                    )
                  }
                }
              }}
              onLogoHover={(hovering) => {
                const logo = logoRef.current
                const ring = document.getElementById('logoDotsRing')

                // Scale
                if (logo) {
                  if (hovering) {
                    // Wait for any in-flight scale tween to settle before snapshotting
                    const activeScaleTween = gsap.getTweensOf(logo).find(t => t.vars.scale !== undefined)
                    const snapScale = activeScaleTween ? (activeScaleTween.vars.scale ?? gsap.getProperty(logo, 'scaleX')) : gsap.getProperty(logo, 'scaleX')
                    logo._preHoverScale = snapScale
                    gsap.to(logo, { scale: snapScale * 1.07, duration: 0.35, ease: 'back.out(1.8)', overwrite: 'auto' })
                  } else {
                    const restore = logo._preHoverScale ?? 1
                    gsap.to(logo, { scale: restore, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
                  }
                }

                // Ring speed — only change when not already active
                if (ring && !logoActive) gsap.getTweensOf(ring).forEach(t => gsap.to(t, { timeScale: hovering ? 3.5 : 1, duration: 0.4 }))

                // Gradient colour morph — only when logo isn't already fully active
                if (!logoActive) {
                  if (hovering) {
                    setLogoGradHover(true)
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                      const grad = document.getElementById('logoRadiance')
                      const path = document.getElementById('logoGradPath')
                      if (!grad || !path) return
                      gsap.fromTo(grad,
                        { attr: { gradientTransform: 'rotate(0, 34.5, 30)' } },
                        { attr: { gradientTransform: 'rotate(360, 34.5, 30)' }, duration: 3, ease: 'none', repeat: -1 }
                      )
                      gsap.to(path, { opacity: 1, duration: 0.45, ease: 'power2.out' })
                    }))
                  } else {
                    const path = document.getElementById('logoGradPath')
                    const grad = document.getElementById('logoRadiance')
                    if (path) {
                      gsap.to(path, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                        if (grad) gsap.killTweensOf(grad)
                        setLogoGradHover(false)
                      }})
                    } else {
                      setLogoGradHover(false)
                    }
                  }
                }
              }}
            />

            {/* Hive suggestion badges — absolutely positioned below input, out of flex flow */}
            {!submitted && !settled && (
              <div
                ref={suggestionsRef}
                style={{
                  position: 'absolute', top: 'calc(100% + 16px)', left: 0, right: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  pointerEvents: 'auto',
                }}
              >
                <span className="hive-badge" style={{
                  opacity: 0,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                  fontFamily: "'Byrd', sans-serif",
                  pointerEvents: 'none',
                }}>
                  AI Suggestions
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                  {(companyConfig?.suggestedPrompts ?? [
                    'What are the top call topics this week?',
                    'Show agent performance trends',
                    'Any compliance flags today?',
                    'Summarize customer sentiment',
                    'Which issues are escalating?',
                    'Compare teams this month',
                  ]).slice(0, 5).map((prompt, i) => (
                    <div
                      key={i}
                      style={{ position: 'relative', padding: '1px', borderRadius: 999, opacity: 0, background: 'var(--border-default)', transition: 'background 0ms' }}
                      className="hive-badge"
                      onMouseMove={e => {
                        const r = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - r.left
                        const y = e.clientY - r.top
                        e.currentTarget.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(23,121,247,0.75) 0%, rgba(23,121,247,0.2) 40%, var(--border-default) 70%)`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--border-default)'
                      }}
                    >
                      <button
                        onClick={e => {
                          // Flash the pill then paste
                          const btn = e.currentTarget
                          gsap.to(btn, { scale: 0.92, duration: 0.1, ease: 'power2.in',
                            onComplete: () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
                          })
                          setChatDefaultText(prompt)
                        }}
                        style={{
                          width: '100%',
                          padding: '9px 18px',
                          borderRadius: 999,
                          border: 'none',
                          background: 'var(--bg-card)',
                          color: 'var(--text-secondary)',
                          fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', whiteSpace: 'nowrap',
                          fontFamily: "'Byrd', sans-serif",
                          transition: 'color 150ms ease',
                          display: 'block',
                        }}
                        onMouseDown={e => e.preventDefault()}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        {prompt}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!submitted && (
            <div ref={dailyBriefingRef} style={{ marginTop: 12 }}>
              <DailyBriefing
                sidebarWidth={effectiveSidebarWidth}
                onPin={prompt => {
                  const userMsg = { role: 'user', text: prompt }
                  setMessages(prev => [...prev, userMsg])
                  setChatDefaultText('')
                  setSubmitted(true)
                  setSettled(true)
                  setMessages(prev => [...prev, {
                    role: 'ai',
                    text: "Here's your daily briefing summary:\n\nSentiment is tracking up and escalations are down vs. the 7-day average. The main area to watch is the spike in delivery-related contacts — up 34% vs. the 7-day average, likely tied to yesterday's logistics partner outage.\n\n**Key highlights:**\n- Calls handled: 1,284 (+12%)\n- Avg sentiment: 72% (+3pts)\n- Escalations: 23 (−8%)\n- Top agent: Martha Kellett at 94% CSAT\n\nWould you like to drill into any of these areas?"
                  }])
                }}
              />
            </div>
          )}

          {submitted && settled && (
            <div className="smooth-scroll" style={{
              position: 'fixed', top: 92,
              left: effectiveSidebarWidth,
              right: 0, bottom: 80,
              overflowY: 'auto',
              transition: sidebarTransition,
              padding: '24px 24px 160px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(() => {
                  const lastAIIndex = messages.reduce((acc, m, i) => m.role === 'ai' ? i : acc, -1)
                  return messages.map((msg, i) => {
                    const isAI       = msg.role === 'ai'
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
                {loading && <ChatBubble role="thinking" />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      )}



      {/* Inspector — Design Lab only */}
      <Suspense fallback={null}>
        <InspectorRoot />
      </Suspense>
    </div>
  )
}
