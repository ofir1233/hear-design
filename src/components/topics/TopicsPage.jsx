import { useState, useMemo, useEffect } from 'react'

// ── Color constants — mosaic dark theme ──────────────────────────────────────
const M_BG      = '#0d040f'   // mosaic area background
const M_CARD    = '#170920'   // card fill
const M_BORDER  = '#6b1545'   // card border default
const M_ACTIVE  = '#be1464'   // card border hover / selected
const M_TEXT    = '#ffffff'   // card title
const M_META    = '#b87099'   // card meta (call count, sentiment)
const M_DIVIDER = '#3d0a28'   // internal dividers

// ── Mock data ─────────────────────────────────────────────────────────────────
const TOPICS = [
  { id:  1, name: 'Promotions & Discounts',    calls: 780, sentiment: 71, trend: [65,68,72,70,73,71,74,71,76,71,73,72] },
  { id:  2, name: 'Billing & Payments',        calls: 640, sentiment: 67, trend: [62,65,68,66,69,67,70,67,72,67,69,68] },
  { id:  3, name: 'Renewal Offers',            calls: 620, sentiment: 64, trend: [59,62,65,63,66,64,67,64,69,64,66,65] },
  { id:  4, name: 'Plan Upgrades / Add-ons',   calls: 450, sentiment: 50, trend: [46,49,52,50,53,50,55,50,57,50,53,51] },
  { id:  5, name: 'Cross-sell / Bundle Deals', calls: 380, sentiment: 57, trend: [53,56,59,57,60,57,62,57,64,57,60,58] },
  { id:  6, name: 'Price Objections',          calls: 350, sentiment: 43, trend: [40,42,45,43,46,43,48,43,50,43,46,44] },
  { id:  7, name: 'Successful Conversions',    calls: 290, sentiment: 71, trend: [67,69,72,70,73,71,74,71,76,71,73,72] },
  { id:  8, name: 'Free Plan Inquiries',       calls: 260, sentiment: 77, trend: [73,75,78,76,79,77,80,77,82,77,79,78] },
  { id:  9, name: 'Contract Negotiations',     calls: 230, sentiment: 61, trend: [57,59,62,60,63,61,64,61,66,61,63,62] },
  { id: 10, name: 'Cancellation Requests',     calls: 210, sentiment: 43, trend: [40,42,45,43,46,43,48,43,50,43,46,44] },
  { id: 11, name: 'Technical Support',         calls: 195, sentiment: 65, trend: [61,63,66,64,67,65,68,65,70,65,67,66] },
  { id: 12, name: 'Onboarding Issues',         calls: 180, sentiment: 58, trend: [54,56,59,57,60,58,61,58,63,58,60,59] },
]

// ── Icons ────────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Sparkline (waveform style for trend panel) ────────────────────────────────
function Sparkline({ data, color = '#be1464', width = 96, height = 32 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  )
}

// ── Card span logic ──────────────────────────────────────────────────────────
function getSpan(calls) {
  return calls >= 550 ? 2 : 1
}

// ── Topic card ───────────────────────────────────────────────────────────────
function TopicCard({ topic, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false)
  const span = getSpan(topic.calls)
  const isActive = isSelected || hovered

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(topic)}
      onKeyDown={e => e.key === 'Enter' && onClick(topic)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: `span ${span}`,
        background: isActive ? 'rgba(190,20,100,0.06)' : M_CARD,
        border: `1px solid ${isActive ? M_ACTIVE : M_BORDER}`,
        borderRadius: 8,
        padding: span === 2 ? '16px 18px' : '13px 15px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: span === 2 ? 116 : 94,
        transition: 'border-color 140ms ease, background 140ms ease',
        userSelect: 'none',
        outline: 'none',
        position: 'relative',
      }}
    >
      {/* Call count */}
      <div style={{ fontSize: 10.5, color: M_META, fontWeight: 500, letterSpacing: '0.015em' }}>
        {topic.calls.toLocaleString()} Calls
      </div>

      {/* Topic name */}
      <div style={{
        fontSize: span === 2 ? 17 : 13.5,
        fontWeight: 700,
        color: isActive ? '#fff' : M_TEXT,
        lineHeight: 1.25,
        marginTop: 8,
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        fontFamily: "'Byrd', sans-serif",
      }}>
        {topic.name}
      </div>

      {/* Sentiment */}
      <div style={{ fontSize: 10.5, color: M_META, marginTop: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span
          style={{
            display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
            background: topic.sentiment >= 65 ? '#4BA373' : topic.sentiment >= 52 ? '#EAB308' : '#EF4444',
            flexShrink: 0,
          }}
        />
        {topic.sentiment}% Sentiment score
      </div>
    </div>
  )
}

// ── Overall sentiment bar ────────────────────────────────────────────────────
function SentimentBar({ topics }) {
  if (!topics.length) return null
  const min  = Math.min(...topics.map(t => t.sentiment))
  const max  = Math.max(...topics.map(t => t.sentiment))
  const avg  = Math.round(topics.reduce((s, t) => s + t.sentiment, 0) / topics.length)
  return (
    <div style={{
      padding: '10px 16px 13px',
      borderTop: `1px solid ${M_DIVIDER}`,
      display: 'flex', alignItems: 'center', gap: 10,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 10, color: M_META, whiteSpace: 'nowrap', fontFamily: "'Byrd', sans-serif" }}>
        {min}% Sentiment score
      </span>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#2a0a1a', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: `${avg}%`, height: '100%',
          background: 'linear-gradient(90deg, #4a0830 0%, #be1464 100%)',
          borderRadius: 2,
        }} />
      </div>
      <span style={{ fontSize: 10, color: M_META, whiteSpace: 'nowrap', fontFamily: "'Byrd', sans-serif" }}>
        {max}% Sentiment score
      </span>
    </div>
  )
}

// ── Trend row (right panel) ──────────────────────────────────────────────────
function TrendRow({ topic, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false)
  const isActive = isSelected || hovered
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(topic)}
      onKeyDown={e => e.key === 'Enter' && onClick(topic)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        background: isActive ? 'var(--bg-active)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 130ms ease',
        borderBottom: '1px solid var(--border-input)',
        outline: 'none',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600,
          color: isSelected ? 'var(--color-brand)' : 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontFamily: "'Byrd', sans-serif",
          transition: 'color 130ms ease',
        }}>
          {topic.name}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2, fontFamily: "'Byrd', sans-serif" }}>
          This month (7/4/25 – 7/5/25)
        </div>
      </div>
      <Sparkline
        data={topic.trend}
        color={isSelected ? '#be1464' : 'var(--text-muted)'}
        width={88}
        height={28}
      />
    </div>
  )
}

// ── TopicsPage ────────────────────────────────────────────────────────────────
export default function TopicsPage({ isMobile, sidebarWidth = 272, sidebarTransition }) {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [search, setSearch] = useState('')

  const left = isMobile ? 0 : sidebarWidth

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return TOPICS
    return TOPICS.filter(t => t.name.toLowerCase().includes(q))
  }, [search])

  function handleSelect(topic) {
    setSelectedTopic(prev => prev?.id === topic.id ? null : topic)
  }

  return (
    <div
      data-inspector="TopicsPage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 52, flexShrink: 0,
        margin: '16px 16px 0',
        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 16,
        boxShadow: 'var(--page-header-shadow)',
      }}>
        {/* Left: title + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 'var(--type-p11)', fontWeight: 600,
            color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
          }}>
            Topics
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
            }}>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics…"
              style={{
                paddingLeft: 28, paddingRight: 10,
                height: 30, width: 190,
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-input)',
                borderRadius: 8, outline: 'none',
                fontSize: 12, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Right: count */}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", flexShrink: 0 }}>
          {filtered.length} {filtered.length === 1 ? 'topic' : 'topics'}
        </span>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', overflow: 'hidden',
        margin: '12px 16px 16px',
        borderRadius: 16,
        border: 'var(--page-header-border)',
        boxShadow: 'var(--page-header-shadow)',
        background: M_BG,
      }}>

        {/* Left: mosaic grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            alignContent: 'start',
          }}>
            {filtered.length === 0 ? (
              <div style={{
                gridColumn: 'span 4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: M_META, fontSize: 13, padding: 40,
                fontFamily: "'Byrd', sans-serif",
              }}>
                No topics match your search
              </div>
            ) : (
              filtered.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic?.id === topic.id}
                  onClick={handleSelect}
                />
              ))
            )}
          </div>

          {/* Sentiment bar */}
          <SentimentBar topics={filtered} />
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: M_DIVIDER, flexShrink: 0 }} />

        {/* Right: trend list */}
        <div style={{
          width: 300, flexShrink: 0,
          background: 'var(--bg-sidebar)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          borderRadius: '0 16px 16px 0',
        }}>
          <div style={{
            padding: '12px 16px 10px',
            borderBottom: '1px solid var(--border-input)',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: "'Byrd', sans-serif",
            }}>
              Trend by Topic
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(topic => (
              <TrendRow
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic?.id === topic.id}
                onClick={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
