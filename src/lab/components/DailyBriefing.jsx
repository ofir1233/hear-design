import { useState, useEffect, useRef } from 'react'

// ── Keyframes ─────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes db-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes db-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes db-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes db-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes db-slide-up {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`

// ── Mock data ─────────────────────────────────────────────────────────────────
const TODAY_KEY = `hear_briefing_v2_${new Date().toISOString().split('T')[0]}`

const LOAD_STEPS = [
  'Analyzing yesterday\'s calls…',
  'Processing sentiment signals…',
  'Identifying top topics…',
  'Building your briefing…',
]

function mockBriefing() {
  return {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    summary: 'Sentiment is tracking up and escalations are down vs. the 7-day average. Watch for a spike in delivery-related contacts — likely tied to yesterday\'s logistics partner outage. Team Alpha is performing exceptionally well this week.',
    metrics: [
      { label: 'Calls handled',   value: '1,284', delta: '+12%',  up: true  },
      { label: 'Avg sentiment',   value: '72%',   delta: '+3pts', up: true  },
      { label: 'Escalations',     value: '23',    delta: '−8%',   up: true  },
      { label: 'Avg handle time', value: '4m 32s',delta: '+0:15', up: false },
    ],
    topics: [
      { label: 'Product returns',   count: 342, pct: 100, trend: '+34%',  hot: true  },
      { label: 'Billing disputes',  count: 218, pct: 64,  trend: '+5%',   hot: false },
      { label: 'Delivery delays',   count: 197, pct: 58,  trend: '+61%',  hot: true  },
      { label: 'Feature requests',  count: 134, pct: 39,  trend: '+18%',  hot: false },
      { label: 'Onboarding',        count: 89,  pct: 26,  trend: '−3%',   hot: false },
    ],
    events: [
      { type: 'warn',     text: 'Delivery delay contacts up 34% vs. 7-day avg' },
      { type: 'neutral',  text: 'New product launch driving feature request volume' },
      { type: 'positive', text: 'Team Alpha holding 91% CSAT this week' },
    ],
    topAgent: { name: 'Martha Kellett', score: '94%' },
  }
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconMinimize() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}
function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}
function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M9 1L13 5l-4 4-2-1-3 3-1-1 3-3-1-2L9 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}
function IconChevronUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconSpark() {
  return (
    <svg viewBox="0 0 69 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="14">
      <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="currentColor"/>
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Metric({ label, value, delta, up }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      padding: '14px 16px',
      background: 'var(--bg-active)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", letterSpacing: '0.01em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{
        fontSize: 11, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        color: up ? 'var(--g100)' : 'var(--c100)',
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        <span style={{ fontSize: 9 }}>{up ? '▲' : '▼'}</span>
        {delta}
      </div>
    </div>
  )
}

function EventRow({ type, text }) {
  const colors = { warn: 'var(--c100)', neutral: 'var(--text-muted)', positive: 'var(--g100)' }
  const labels = { warn: 'Alert', neutral: 'Info', positive: 'Good' }
  const c = colors[type]
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--border-default)',
    }}>
      <span style={{
        flexShrink: 0, marginTop: 1,
        fontSize: 9, fontWeight: 700, fontFamily: "'Byrd', sans-serif",
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: c,
        padding: '2px 6px', borderRadius: 4,
        background: type === 'warn' ? 'var(--badge-coral-bg)' : type === 'positive' ? 'var(--badge-green-bg)' : 'var(--bg-active)',
        border: `1px solid ${type === 'warn' ? 'var(--badge-coral-bd)' : type === 'positive' ? 'var(--badge-green-bd)' : 'var(--border-default)'}`,
        lineHeight: 1.6,
      }}>{labels[type]}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.55 }}>{text}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DailyBriefing({ onPin, sidebarWidth = 0 }) {
  const [phase, setPhase]       = useState(() => localStorage.getItem(TODAY_KEY) ? 'ready' : 'loading')
  const [stepIdx, setStepIdx]   = useState(0)
  const [briefing, setBriefing] = useState(() => {
    const saved = localStorage.getItem(TODAY_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [modalIn, setModalIn]   = useState(false)
  const styleInjected           = useRef(false)

  useEffect(() => {
    if (styleInjected.current) return
    styleInjected.current = true
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    let step = 0
    const iv = setInterval(() => {
      step++
      if (step < LOAD_STEPS.length) {
        setStepIdx(step)
      } else {
        clearInterval(iv)
        const data = mockBriefing()
        localStorage.setItem(TODAY_KEY, JSON.stringify(data))
        setBriefing(data)
        setPhase('ready')
      }
    }, 900)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (phase === 'open') {
      const raf = requestAnimationFrame(() => setModalIn(true))
      return () => cancelAnimationFrame(raf)
    } else {
      setModalIn(false)
    }
  }, [phase])

  function openModal()  { setPhase('open') }
  function closeModal() { setPhase('ready') }
  function minimize()   { setPhase('minimized') }
  function restore()    { setPhase('open') }

  function pinAsConversation() {
    const prompt = `Give me a daily briefing summary. Here's the context:\n\n${briefing.summary}\n\nTop topics: ${briefing.topics.map(t => t.label).join(', ')}.\n\nKey metrics: ${briefing.metrics.map(m => `${m.label}: ${m.value} (${m.delta})`).join(', ')}.`
    onPin?.(prompt)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', animation: 'db-fade-in 400ms ease forwards' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 999,
          fontSize: 12, fontFamily: "'Byrd', sans-serif",
          color: 'var(--text-muted)',
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            border: '1.5px solid var(--border-default)',
            borderTopColor: 'var(--c100)',
            display: 'inline-block',
            animation: 'db-spin 700ms linear infinite',
            flexShrink: 0,
          }} />
          <span key={stepIdx} style={{
            background: 'linear-gradient(90deg, var(--text-muted) 25%, var(--text-secondary) 50%, var(--text-muted) 75%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'db-shimmer 1.4s linear infinite',
          }}>
            {LOAD_STEPS[stepIdx]}
          </span>
        </div>
      </div>
    )
  }

  // ── Minimized ─────────────────────────────────────────────────────────────
  if (phase === 'minimized') {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 400, animation: 'db-fade-in 200ms ease forwards' }}>
        <button
          onClick={restore}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 16px',
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-default)',
            borderRadius: 999,
            fontSize: 12, fontFamily: "'Byrd', sans-serif",
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
            transition: 'box-shadow 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c100)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.22)' }}
        >
          <span style={{ color: 'var(--c100)', display: 'flex' }}><IconSpark /></span>
          Daily briefing
          <IconChevronUp />
        </button>
      </div>
    )
  }

  // ── Ready pill ────────────────────────────────────────────────────────────
  const readyPill = (
    <div style={{
      marginTop: 12,
      display: 'flex', justifyContent: 'center',
      animation: phase === 'ready' ? 'db-fade-in 400ms ease forwards' : undefined,
    }}>
      <button
        onClick={openModal}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 999,
          fontSize: 12, fontFamily: "'Byrd', sans-serif",
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c100)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-card)' }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c100)', flexShrink: 0, animation: 'db-pulse 2s ease-in-out infinite' }} />
        Daily briefing ready
        <span style={{ color: 'var(--c100)', fontWeight: 600 }}>· View</span>
      </button>
    </div>
  )

  // ── Modal ─────────────────────────────────────────────────────────────────
  const modal = phase === 'open' && briefing && (
    <div
      onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: modalIn ? 1 : 0,
        transition: 'opacity 180ms ease',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        width: 620, maxWidth: 'calc(100vw - 40px)',
        background: 'var(--bg-sidebar)',
        borderRadius: 18,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border-default)',
        overflow: 'hidden',
        transform: modalIn ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'transform 260ms cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Top coral accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--c100) 0%, var(--c60) 100%)' }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 14px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'var(--badge-coral-bg)', border: '1px solid var(--badge-coral-bd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c100)',
            }}>
              <IconSpark />
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.2 }}>
                Daily Briefing
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginTop: 1 }}>
                {briefing.date}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={pinAsConversation}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 30, padding: '0 12px',
                background: 'var(--badge-coral-bg)', border: '1px solid var(--badge-coral-bd)',
                borderRadius: 8, cursor: 'pointer',
                fontSize: 11, fontFamily: "'Byrd', sans-serif",
                color: 'var(--c100)',
                transition: 'all 130ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--c20)'; e.currentTarget.style.borderColor = 'var(--c100)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--badge-coral-bg)'; e.currentTarget.style.borderColor = 'var(--badge-coral-bd)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 6C1 3.24 3.24 1 6 1s5 2.24 5 5-2.24 5-5 5H1.5L1 10.5V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              Start conversation
            </button>

            {[{ icon: <IconMinimize />, fn: minimize, label: 'Minimize' }, { icon: <IconClose />, fn: closeModal, label: 'Close' }].map(({ icon, fn, label }) => (
              <button key={label} onClick={fn} title={label} style={{
                width: 30, height: 30, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18, maxHeight: '70vh', overflowY: 'auto' }}>

          {/* Summary */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--c20)',
            border: '1px solid var(--c30)',
            borderLeft: '3px solid var(--c100)',
            borderRadius: 10,
          }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
              {briefing.summary}
            </p>
          </div>

          {/* Metrics */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginBottom: 10 }}>
              Key Metrics
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {briefing.metrics.map(m => <Metric key={m.label} {...m} />)}
            </div>
          </div>

          {/* Events */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginBottom: 4 }}>
              Notable Events
            </div>
            {briefing.events.map((ev, i) => <EventRow key={i} {...ev} />)}
          </div>

          {/* Top Topics */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginBottom: 10 }}>
              Top Topics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {briefing.topics.map((t, i) => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  background: i === 0 ? 'var(--badge-coral-bg)' : 'var(--bg-active)',
                  border: `1px solid ${i === 0 ? 'var(--badge-coral-bd)' : 'var(--border-default)'}`,
                  borderRadius: 10,
                }}>
                  {/* Rank */}
                  <span style={{
                    fontSize: 11, fontWeight: 700, fontFamily: "'Byrd', sans-serif",
                    color: i === 0 ? 'var(--c100)' : 'var(--text-muted)',
                    width: 16, flexShrink: 0, textAlign: 'center',
                  }}>{i + 1}</span>

                  {/* Label */}
                  <span style={{
                    flex: 1, fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                    fontFamily: "'Byrd', sans-serif",
                    color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>{t.label}</span>

                  {/* Bar */}
                  <div style={{ width: 80, height: 4, borderRadius: 99, background: 'var(--border-default)', flexShrink: 0, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${t.pct}%`,
                      background: i === 0 ? 'var(--c100)' : i < 3 ? 'var(--b80)' : 'var(--text-muted)',
                    }} />
                  </div>

                  {/* Count */}
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Byrd', sans-serif", color: 'var(--text-secondary)', width: 32, textAlign: 'right', flexShrink: 0 }}>
                    {t.count}
                  </span>

                  {/* Trend */}
                  <span style={{
                    fontSize: 10, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
                    color: t.hot ? 'var(--c100)' : 'var(--text-muted)',
                    width: 36, textAlign: 'right', flexShrink: 0,
                  }}>{t.trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top agent */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--bg-active)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'var(--badge-coral-bg)', border: '1.5px solid var(--badge-coral-bd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--c100)', fontFamily: "'Byrd', sans-serif",
            }}>
              {briefing.topAgent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginBottom: 3 }}>
                Top agent
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                {briefing.topAgent.name}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--g100)', fontFamily: "'Byrd', sans-serif", letterSpacing: '-0.02em', flexShrink: 0 }}>
              {briefing.topAgent.score}
            </div>
          </div>

        </div>
      </div>
    </div>
  )

  return (
    <>
      {readyPill}
      {modal}
    </>
  )
}
