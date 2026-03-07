/**
 * InsightsPanel — live call-center intelligence widgets
 *
 * 6 widgets in a 2-col grid, seeded deterministically from companyConfig
 * so the numbers feel real and are consistent across page reloads.
 * All colours use design-system tokens so it works in light + dark mode.
 */
import { useState, createContext, useContext } from 'react'

const WidgetCtx = createContext({ hovered: false, color: '#FF7056' })

// ── Deterministic seed helpers ────────────────────────────────────────────────

function hashStr(s = '') {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seeded(seed, idx) {
  const x = Math.sin(seed * 9301 + idx * 49297 + 233) * 10000
  return x - Math.floor(x)
}

function ri(seed, idx, min, max) {
  return Math.round(min + seeded(seed, idx) * (max - min))
}

function rf(seed, idx, min, max, dec = 1) {
  return parseFloat((min + seeded(seed, idx) * (max - min)).toFixed(dec))
}

function buildInsights(config) {
  const name  = config?.companyName || 'Demo Company'
  const rawTopics = config?.commonTopics?.length
    ? config.commonTopics
    : ['Billing Dispute', 'Account Access', 'Refund Request', 'Technical Issue', 'Delivery Status']
  const seed = hashStr(name)

  // ── Call volume ──────────────────────────────────────────────
  const callVol   = ri(seed, 1, 420, 2800)
  const callYest  = Math.round(callVol * (0.82 + seeded(seed, 2) * 0.38))
  const callDelta = Math.round(((callVol - callYest) / callYest) * 100)

  // Hourly pattern — 12 buckets (2 h each, 0 AM → midnight)
  // Buckets 4-9 are peak hours (8 AM – 8 PM)
  const sparkline = Array.from({ length: 12 }, (_, i) => {
    const isPeak = i >= 4 && i <= 9
    return ri(seed, 100 + i, isPeak ? 52 : 12, isPeak ? 100 : 42)
  })

  // ── CSAT ─────────────────────────────────────────────────────
  const csat      = rf(seed, 3, 87.4, 99.1)
  const csatDelta = rf(seed, 4, -1.8, 3.4)
  const csatWeek  = Array.from({ length: 7 }, (_, i) => rf(seed, 20 + i, 84, 99.5))

  // ── Trending topics ──────────────────────────────────────────
  const rawPcts  = [ri(seed, 5, 26, 44), ri(seed, 6, 15, 28), ri(seed, 7, 9, 18), ri(seed, 8, 4, 10)]
  const totalPct = rawPcts.reduce((a, b) => a + b, 0)
  const topTopics = rawTopics.slice(0, 4).map((label, i) => ({
    label,
    pct:   Math.round((rawPcts[i] / totalPct) * 100),
    count: ri(seed, 40 + i, 12, 480),
  }))

  // ── Escalations ───────────────────────────────────────────────
  const escalations = ri(seed, 9, 6, 52)
  const critical    = Math.round(escalations * rf(seed, 10, 0.15, 0.3, 2))
  const medium      = Math.round(escalations * rf(seed, 11, 0.30, 0.45, 2))
  const low         = Math.max(0, escalations - critical - medium)

  // ── Churn ─────────────────────────────────────────────────────
  const churnCount = ri(seed, 12, 8, 94)
  const churnPct   = rf(seed, 13, 2.8, 15.2)
  const churnDelta = rf(seed, 14, -3.1, 5.4)

  // ── Top agent ─────────────────────────────────────────────────
  const agentPool  = ['Sarah Chen', 'Marcus Reid', 'Priya Nair', 'Tom Okafor', 'Elena Voronova', 'Dev Kapoor']
  const topAgent   = agentPool[ri(seed, 15, 0, agentPool.length - 1)]
  const agentInit  = topAgent.split(' ').map(w => w[0]).join('')
  const agentCsat  = rf(seed, 16, 96.2, 99.9)
  const agentCalls = ri(seed, 17, 70, 210)
  const agentMin   = ri(seed, 18, 2, 7)
  const agentSec   = ri(seed, 19, 0, 59)

  // ── Avg handle time ───────────────────────────────────────────
  const avgMin = ri(seed, 20, 3, 9)
  const avgSec = ri(seed, 21, 0, 59)

  return {
    callVol, callYest, callDelta, sparkline,
    csat, csatDelta, csatWeek,
    topTopics,
    escalations, critical, medium, low,
    churnCount, churnPct, churnDelta,
    topAgent, agentInit, agentCsat, agentCalls,
    agentTime: `${agentMin}:${String(agentSec).padStart(2, '0')}`,
    avgHandle: `${avgMin}:${String(avgSec).padStart(2, '0')}`,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Sparkline({ data, w = 110, h = 40, gid = 'spk' }) {
  const { hovered, color } = useContext(WidgetCtx)
  const c    = hovered ? color : 'var(--text-muted)'
  const min  = Math.min(...data)
  const max  = Math.max(...data)
  const span = max - min || 1
  const pts  = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / span) * (h - 6) - 3,
  ])
  const poly = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `0,${h} ${poly} ${w},${h}`
  const [last] = pts.slice(-1)

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={c} stopOpacity={hovered ? 0.22 : 0.1} />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={poly} fill="none"
        stroke={c} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'stroke 250ms ease' }}
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={c} style={{ transition: 'fill 250ms ease' }} />
      <circle cx={last[0]} cy={last[1]} r="3" fill={c} opacity={hovered ? 0.35 : 0}
        style={{ animation: hovered ? 'dotPulse 2s ease infinite' : 'none', transition: 'fill 250ms ease' }} />
    </svg>
  )
}

function WeekBars({ data, minV = 80, maxV = 100 }) {
  const { hovered, color } = useContext(WidgetCtx)
  const days   = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayI = (new Date().getDay() + 6) % 7
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
      {data.map((v, i) => {
        const pct     = Math.max(10, ((v - minV) / (maxV - minV)) * 100)
        const isToday = i === todayI
        const barColor = hovered
          ? (isToday ? color : `${color}55`)
          : 'var(--border-default)'
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
            <div style={{ width: '100%', height: 28, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%',
                height:       `${pct}%`,
                borderRadius: '3px 3px 2px 2px',
                background:   barColor,
                transition:   `height 0.65s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.055}s, background 250ms ease`,
                animation:    `barRise 0.65s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.055}s both`,
              }} />
            </div>
            <span style={{
              fontSize: 8,
              fontWeight: isToday ? 700 : 400,
              color: hovered && isToday ? color : 'var(--text-muted)',
              transition: 'color 250ms ease',
            }}>
              {days[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Trend({ val, unit = '%', invert = false }) {
  const isPos  = val >= 0
  const isGood = invert ? !isPos : isPos
  return (
    <span style={{
      fontSize: 10, fontWeight: 600,
      color: isGood ? 'rgba(75,163,115,0.9)' : 'rgba(239,68,68,0.85)',
      display: 'inline-flex', alignItems: 'center', gap: 1,
    }}>
      {isPos ? '↑' : '↓'} {Math.abs(val)}{unit}
    </span>
  )
}

function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#4BA373', letterSpacing: '0.07em', textTransform: 'uppercase', marginLeft: 'auto' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4BA373', display: 'inline-block', animation: 'livePulse 2s ease infinite' }} />
      Live
    </span>
  )
}

// Single accent — coral at descending opacity gives hierarchy without rainbow noise
const TOPIC_ALPHAS = [1, 0.6, 0.38, 0.22]

function TopicBar({ pct, alpha, delay }) {
  const { hovered, color } = useContext(WidgetCtx)
  return (
    <div style={{ flex: 1, height: 4, background: 'var(--border-default)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 99,
        background: hovered ? `rgba(${hexToRgb(color)},${alpha})` : 'var(--text-muted)',
        opacity: hovered ? 1 : 0.3,
        animation: `topicBar 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both`,
        transition: 'background 250ms ease, opacity 250ms ease',
      }} />
    </div>
  )
}

function ChurnBar({ pct }) {
  const { hovered, color } = useContext(WidgetCtx)
  return (
    <div style={{ height: 8, background: 'var(--border-default)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 99,
        background: hovered ? color : 'var(--text-muted)',
        opacity: hovered ? 1 : 0.35,
        animation: 'topicBar 1s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
        transition: 'background 250ms ease, opacity 250ms ease',
      }} />
    </div>
  )
}

function AgentAvatar({ initials }) {
  const { hovered, color } = useContext(WidgetCtx)
  return (
    <div style={{
      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
      background: hovered ? color : 'var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 800,
      color: hovered ? '#fff' : 'var(--text-muted)',
      transition: 'background 250ms ease, color 250ms ease',
    }}>
      {initials}
    </div>
  )
}

function ChurnPctLabel({ children }) {
  const { hovered, color } = useContext(WidgetCtx)
  return (
    <span style={{ fontSize: 9, fontWeight: 600, color: hovered ? color : 'var(--text-muted)', transition: 'color 250ms ease' }}>
      {children}
    </span>
  )
}

// Convert hex color to "r,g,b" string for rgba()
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r},${g},${b}`
}

function Widget({ children, wide = false, delay = 0, color = '#FF7056' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <WidgetCtx.Provider value={{ hovered, color }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background:    hovered ? `${color}0d` : 'var(--bg-card)',
          border:        '1px solid var(--border-default)',
          borderRadius:  14,
          padding:       '16px 18px',
          display:       'flex',
          flexDirection: 'column',
          gap:           12,
          gridColumn:    wide ? 'span 2' : undefined,
          animation:     `widgetIn 0.48s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both`,
          boxShadow:     hovered ? `inset 3px 0 0 ${color}` : 'none',
          transition:    'box-shadow 200ms ease, background 200ms ease',
          cursor:        'default',
        }}
      >
        {children}
      </div>
    </WidgetCtx.Provider>
  )
}

function WLabel({ icon, children, right }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          6,
      fontSize:     10,
      fontWeight:   700,
      letterSpacing:'0.08em',
      textTransform:'uppercase',
      color:        'var(--text-muted)',
    }}>
      {icon}
      {children}
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.92 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.83 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
  </svg>
)
const SmileyIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
)
const TrendingIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const WarnIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const ChurnIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

// ── InsightsPanel ─────────────────────────────────────────────────────────────

export default function InsightsPanel({ config }) {
  const d = buildInsights(config)

  const churnBarW = Math.min(Math.round(d.churnPct * 6), 100)

  return (
    <>
      <style>{`
        @keyframes widgetIn {
          from { opacity: 0; transform: translateY(16px) scale(0.975); }
          to   { opacity: 1; transform: translateY(0)   scale(1);     }
        }
        @keyframes barRise {
          from { height: 0 !important; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%      { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes dotPulse {
          0%, 100% { r: 3; opacity: 0.35; }
          50%      { r: 7; opacity: 0;    }
        }
        @keyframes topicBar {
          from { width: 0 !important; }
        }
      `}</style>

      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 10,
        paddingBottom:       16,
      }}>

        {/* ── 1 · Call Volume ──────────────────────────────────────── */}
        <Widget delay={0} color="#FF7056">
          <WLabel icon={<PhoneIcon />} right={<LiveDot />}>Call Volume · 24h</WLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {d.callVol.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                {d.callYest.toLocaleString()} yesterday &nbsp;
                <Trend val={d.callDelta} />
              </div>
            </div>
            <Sparkline data={d.sparkline} w={100} h={40} gid="spk-vol" />
          </div>
        </Widget>

        {/* ── 2 · CSAT ─────────────────────────────────────────────── */}
        <Widget delay={0.06} color="#4BA373">
          <WLabel icon={<SmileyIcon />}>CSAT Score · 7-day avg</WLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {d.csat}
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 3 }}>/100</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                vs last week &nbsp;
                <Trend val={d.csatDelta} />
              </div>
            </div>
            <div style={{ minWidth: 90 }}>
              <WeekBars data={d.csatWeek} minV={80} maxV={100} />
            </div>
          </div>
        </Widget>

        {/* ── 3 · Trending Topics ──────────────────────────────────── */}
        <Widget wide delay={0.12} color="#1779F7">
          <WLabel icon={<TrendingIcon />}>Trending Topics · Last 24 hours</WLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {d.topTopics.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 12, color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: i === 0 ? 600 : 400,
                  minWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {t.label}
                </span>
                <TopicBar pct={t.pct} alpha={TOPIC_ALPHAS[i]} delay={0.18 + i * 0.09} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', minWidth: 30, textAlign: 'right' }}>
                  {t.pct}%
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 38, textAlign: 'right' }}>
                  {t.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Widget>

        {/* ── 4 · Top Agent ────────────────────────────────────────── */}
        <Widget delay={0.18} color="#D799E2">
          <WLabel icon={<StarIcon />}>Top Performer · This week</WLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AgentAvatar initials={d.agentInit} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.topAgent}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {d.agentCalls} calls · {d.agentTime} avg handle
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {d.agentCsat}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>
                CSAT
              </div>
            </div>
          </div>
        </Widget>

        {/* ── 5 · Escalations ──────────────────────────────────────── */}
        <Widget delay={0.22} color="#455F61">
          <WLabel icon={<WarnIcon />}>Open Escalations</WLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              fontSize: 36, fontWeight: 800, lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}>
              {d.escalations}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { label: 'Critical', count: d.critical },
                { label: 'Medium',   count: d.medium   },
                { label: 'Low',      count: d.low      },
              ].map(({ label, count }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0, opacity: 0.6 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Widget>

        {/* ── 6 · Churn Risk ───────────────────────────────────────── */}
        <Widget wide delay={0.27} color="#6E95A0">
          <WLabel icon={<ChurnIcon />}>Churn Risk · Flagged this week</WLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {d.churnCount}
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 6 }}>customers</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                {d.churnPct}% of active base &nbsp;
                <Trend val={d.churnDelta} invert />
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <ChurnBar pct={churnBarW} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>0%</span>
                <ChurnPctLabel>{d.churnPct}%</ChurnPctLabel>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>25%</span>
              </div>
            </div>
          </div>
        </Widget>

      </div>
    </>
  )
}
