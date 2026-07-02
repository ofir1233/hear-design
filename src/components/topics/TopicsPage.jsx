import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import PageHeader from '../PageHeader.jsx'
import SegmentedTabs, { SEG_OUTER } from '../SegmentedTabs.jsx'
import DatePicker from '../DatePicker.jsx'

export default function TopicsPage({ isMobile, sidebarWidth = 272, sidebarTransition }) {
  const left = isMobile ? 0 : sidebarWidth
  const iframeRef = useRef(null)

  // The "Add dimension" modal is rendered HERE (in React) — not in the iframe —
  // so its backdrop covers the whole screen. The iframe posts the dimension
  // catalog and we post 'add' actions back to it.
  const [modal, setModal] = useState(null) // { catalog, activeCount } | null
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(() => new Set())
  const [lens, setLens] = useState('flow') // mirror of the iframe's view lens
  const [colorBy, setColorBy] = useState('severity') // mirror of the iframe's colour mode
  const [overall, setOverall] = useState(false) // mirror of the iframe's Overall score toggle
  const [landView, setLandView] = useState('pain') // mirror of the iframe's Landscape preset
  const [pulse, setPulse] = useState(null) // truthy once the iframe reports Pulse is available (tab visibility)
  const [pulseTopicId, setPulseTopicId] = useState(null) // focused topic for the Pulse view (null = All topics)
  const [pulsePeriod, setPulsePeriod] = useState({ type: 'preset', label: 'Last 30 days' })
  const [pulseSelOpen, setPulseSelOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onMsg(e) {
      const m = e && e.data
      if (!m) return
      if (m.type === 'hear-dimmodal') {
        setModal(m.open ? { catalog: m.catalog || [], activeCount: m.activeCount || 0 } : null)
      } else if (m.type === 'hear-lens') {
        setLens(m.lens)
      } else if (m.type === 'hear-colorby') {
        setColorBy(m.colorBy)
      } else if (m.type === 'hear-overall') {
        setOverall(!!m.on)
      } else if (m.type === 'hear-landview') {
        setLandView(m.key)
      } else if (m.type === 'hear-pulse') {
        setPulse(m.active ? { ok: true } : null)
        if (m.active) setPulseTopicId(m.topicId == null ? null : m.topicId)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  function postToIframe(msg) {
    const w = iframeRef.current && iframeRef.current.contentWindow
    if (w) w.postMessage(msg, '*')
  }
  function pickLens(l) { setLens(l); postToIframe({ type: 'hear-lens-set', lens: l }) }
  function pickColorBy(c) { setColorBy(c); postToIframe({ type: 'hear-colorby-set', colorBy: c }) }
  function toggleOverall() { const on = !overall; setOverall(on); postToIframe({ type: 'hear-overall-set', on }) }
  function pickLandView(key) { setLandView(key); postToIframe({ type: 'hear-landview-set', key }) }
  function onQuery(v) {
    setQuery(v)
    const w = iframeRef.current && iframeRef.current.contentWindow
    if (w) w.postMessage({ type: 'hear-query', query: v }, '*')
  }

  function postAction(action, id) {
    const w = iframeRef.current && iframeRef.current.contentWindow
    if (w) w.postMessage({ type: 'hear-dimmodal-action', action, id }, '*')
  }
  function openModal() { setSearch(''); setExpanded(new Set()) }
  function closeModal() { setModal(null) }
  function manageColumns() {
    const w = iframeRef.current && iframeRef.current.contentWindow
    if (w) w.postMessage({ type: 'hear-dimmodal-action', action: 'open' }, '*')
  }

  // On Pulse with a topic focused, the header reflects that topic (else the global roll-up).
  const pulseTopic = lens === 'pulse' && pulseTopicId != null
    ? PULSE_TOPICS.find(t => t.id === pulseTopicId)
    : null

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
      {/* ── Page Header ── reflects the focused topic on the Pulse tab ── */}
      <PageHeader
        title="Topics"
        crumbs={pulseTopic ? ['Demo inv', pulseTopic.name] : ['Demo inv']}
        badge={
          <Badge variant="tinted" color="cobalt" shape="pill">
            {pulseTopic ? `${pulseTopic.volume.toLocaleString()} calls` : '13 topics · 23,109 calls'}
          </Badge>
        }
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TopicSearch value={query} onChange={onQuery} />
            {lens === 'flow' && <Button variant="secondary" size="md" onClick={manageColumns}>Manage columns</Button>}
          </div>
        }
      />

      {/* View-mode tabs — floating segmented control (matches AI Tasks) */}
      <ModeTabs lens={lens} onLens={pickLens} colorBy={colorBy} onColorBy={pickColorBy} overall={overall} onToggleOverall={toggleOverall} landView={landView} onLandView={pickLandView} pulse={pulse}
        pulseTopicId={pulseTopicId} onPulseTopic={setPulseTopicId} pulsePeriod={pulsePeriod} onPulsePeriod={setPulsePeriod} pulseSelOpen={pulseSelOpen} onPulseSelToggle={() => setPulseSelOpen(o => !o)} onPulseSelClose={() => setPulseSelOpen(false)} />

      {/* iframe fills remaining space below the header. Hidden (kept mounted) while
          Pulse is active — Pulse renders in React below. */}
      <iframe
        ref={iframeRef}
        src="/topics/index.html?v=46"
        style={{
          flex: lens === 'pulse' ? 'none' : 1,
          width: '100%',
          border: 'none',
          display: lens === 'pulse' ? 'none' : 'block',
          minHeight: 0,
        }}
        title="Topics"
        allowFullScreen
      />

      {lens === 'pulse' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 24px' }}>
          <PulseView topicId={pulseTopicId} period={pulsePeriod} />
        </div>
      )}

      {modal && createPortal(
        <AddDimensionModal
          catalog={modal.catalog}
          activeCount={modal.activeCount}
          search={search}
          setSearch={setSearch}
          expanded={expanded}
          setExpanded={setExpanded}
          onPick={(id) => postAction('add', id)}
          onClose={closeModal}
          onOpen={openModal}
        />,
        document.body
      )}
    </div>
  )
}

function TopicSearch({ value, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search topics…"
        style={{
          width: 200, height: 32, border: '1px solid var(--border-input)', borderRadius: 8,
          padding: '0 32px 0 12px', fontSize: 13, fontFamily: "'Byrd', sans-serif",
          color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none',
        }}
      />
      <span style={{ position: 'absolute', right: 11, color: 'var(--text-muted)', display: 'inline-flex', pointerEvents: 'none' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" /></svg>
      </span>
    </div>
  )
}

const VIEW_MODES = [
  { id: 'flow', label: 'Flow' },
  { id: 'landscape', label: 'Landscape' },
]

const LAND_PRESETS = [
  { key: 'pain', label: 'Call resolution' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'csat', label: 'Churn risk' },
  { key: 'coach', label: 'Agent score' },
  { key: 'aht', label: 'Handle time' },
  { key: 'emerging', label: "What's Emerging" },
  { key: 'digital', label: 'Digital Deflection' },
  { key: 'conversion', label: 'Closure rate' },
]

function ModeTabs({ lens, onLens, colorBy, onColorBy, overall, onToggleOverall, landView, onLandView, pulse,
  pulseTopicId, onPulseTopic, pulsePeriod, onPulsePeriod, pulseSelOpen, onPulseSelToggle, onPulseSelClose }) {
  const views = pulse ? [...VIEW_MODES, { id: 'pulse', label: 'Pulse' }] : VIEW_MODES
  return (
    <div style={{ padding: '12px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {/* Primary: view switcher (shared master component) */}
      <SegmentedTabs items={views} value={lens} onChange={onLens} />

      {/* Separator between the view switcher and per-view controls (all tabs) */}
      <div style={{ width: 1, height: SEG_OUTER - 8, background: 'var(--border-input)', flexShrink: 0 }} />

      {/* Flow-only options */}
      {lens === 'flow' && (
        <>
          <CheckPill checked={colorBy === 'topic'} label="Color by topic" onClick={() => onColorBy(colorBy === 'topic' ? 'severity' : 'topic')} />
          <CheckPill checked={overall} label="Overall score" onClick={onToggleOverall} title="Roll all active dimensions into one score" />
        </>
      )}

      {/* Landscape-only: view presets */}
      {lens === 'landscape' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          {LAND_PRESETS.map(p => (
            <PresetChip key={p.key} active={landView === p.key} label={p.label} onClick={() => onLandView(p.key)} />
          ))}
        </div>
      )}

      {/* Pulse-only: topic selector + period */}
      {lens === 'pulse' && (
        <PulseControls topicId={pulseTopicId} onSelect={onPulseTopic} period={pulsePeriod} onPeriod={onPulsePeriod} open={pulseSelOpen} onToggle={onPulseSelToggle} onClose={onPulseSelClose} />
      )}
    </div>
  )
}

const PULSE_PERIODS = [
  { label: 'Last 7 days', kind: 'days', days: 7 },
  { label: 'Last 30 days', kind: 'days', days: 30 },
  { label: 'Last 90 days', kind: 'days', days: 90 },
]

function PulseControls({ topicId, onSelect, period, onPeriod, open, onToggle, onClose }) {
  const current = topicId == null ? 'All topics' : (PULSE_TOPICS.find(t => t.id === topicId) || {}).name
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <button onClick={onToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: SEG_OUTER, boxSizing: 'border-box', padding: '0 13px', border: '1px solid var(--border-input)', background: 'var(--bg-card)', borderRadius: 8, cursor: 'pointer', fontFamily: "'Byrd',sans-serif", fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
          {current}
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▾</span>
        </button>
        {open && (
          <div style={{ position: 'absolute', left: 0, top: SEG_OUTER + 4, zIndex: 30, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', padding: 5, minWidth: 250, maxHeight: 360, overflowY: 'auto' }}>
            {[{ id: null, name: 'All topics', volume: null }].concat(PULSE_TOPICS.slice().sort((a, b) => b.volume - a.volume)).map((t, i) => {
              const active = (t.id == null && topicId == null) || t.id === topicId
              return (
                <button key={i} onClick={() => { onSelect(t.id); onClose() }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', padding: '8px 9px', border: 'none', background: active ? 'var(--bg-active)' : 'transparent', borderRadius: 7, cursor: 'pointer', fontFamily: "'Byrd',sans-serif", fontSize: 13, color: 'var(--text-primary)', textAlign: 'left' }}>
                  <span style={{ fontWeight: active ? 600 : 500 }}>{t.name}</span>
                  {t.volume != null && <span style={{ color: 'var(--text-muted)', fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}>{t.volume.toLocaleString()}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <DatePicker value={period} onChange={onPeriod} presets={PULSE_PERIODS} triggerStyle={{ height: SEG_OUTER }} />
    </div>
  )
}

function PresetChip({ active, label, onClick, dashed }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: SEG_OUTER, boxSizing: 'border-box', padding: '0 12px', borderRadius: 99, cursor: 'pointer',
        fontFamily: "'Byrd', sans-serif", fontSize: 12.5, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
        border: `1px ${dashed ? 'dashed' : 'solid'} ${active ? 'var(--b100)' : 'var(--border-input)'}`,
        background: active ? 'color-mix(in srgb, var(--b100) 10%, var(--bg-card))' : (dashed ? 'transparent' : 'var(--bg-card)'),
        color: active ? 'var(--b100)' : 'var(--text-secondary)',
        transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
      }}
    >
      {label}
    </button>
  )
}

function CheckPill({ checked, label, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: SEG_OUTER, boxSizing: 'border-box', padding: '0 13px',
        fontFamily: "'Byrd', sans-serif", fontSize: 13, fontWeight: checked ? 600 : 500,
        border: checked ? '1px solid var(--badge-cobalt-bd)' : 'var(--page-header-border)', borderRadius: 12,
        boxShadow: 'var(--page-header-shadow)',
        background: checked ? 'var(--badge-cobalt-fill)' : 'var(--bg-card)',
        color: checked ? 'var(--b100)' : 'var(--text-secondary)',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--b100)' : 'var(--border-input)'}`,
        background: checked ? 'var(--b100)' : 'transparent',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </span>
      {label}
    </button>
  )
}

function AddDimensionModal({ catalog, activeCount, search, setSearch, expanded, setExpanded, onPick, onClose }) {
  const q = search.trim().toLowerCase()
  const atMax = activeCount >= 7

  function toggleGroup(id) {
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483000,
        background: 'rgba(20,22,26,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Byrd', sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 460, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 80px)',
          background: 'var(--bg-card)', borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Add dimension</span>
          <button onClick={onClose} style={{ width: 28, height: 28, border: 'none', background: 'var(--bg-canvas)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* body */}
        <div style={{ padding: '16px 20px 6px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-input)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="var(--text-muted)" strokeWidth="1.5" /><path d="M11 11l3 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dimensions..."
              autoFocus
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
          </div>

          {catalog.map(section => {
            const groups = section.groups
              .map(g => ({ ...g, dims: g.dims.filter(d => d.label.toLowerCase().includes(q)) }))
              .filter(g => g.dims.length > 0)
            if (groups.length === 0) return null
            return (
              <div key={section.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 4px 8px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{section.label}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                </div>
                {groups.map(group => {
                  const isExp = expanded.has(group.id) || q.length > 0
                  return (
                    <div key={group.id}>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '13px 6px', background: 'none', border: 'none', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{group.label}</span>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ transition: 'transform .18s ease', transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <path d="M3 5l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isExp && group.dims.map(d => {
                        const disabled = d.disabled
                        return (
                          <button
                            key={d.id}
                            onClick={() => { if (!disabled) onPick(d.id) }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 8px 9px 16px', border: 'none', background: 'transparent', borderRadius: 8, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 14, color: 'var(--text-primary)', textAlign: 'left', opacity: disabled && !d.active ? 0.4 : 1, transition: 'background 100ms' }}
                            onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--bg-active)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                          >
                            <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: '1.5px solid ' + (d.active ? '#1779F7' : 'var(--border-input)'), background: d.active ? '#1779F7' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{d.active ? '✓' : ''}</span>
                            <span style={{ flex: 1 }}>{d.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-default)', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activeCount} of 7 dimensions</span>
          <button onClick={onClose} style={{ height: 36, padding: '0 20px', border: 'none', background: '#1779F7', color: '#fff', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>Done</button>
        </div>
      </div>
    </div>
  )
}

/* ── Pulse: per-topic vitals scorecard (rendered in React for reliability) ── */
const PULSE_TOPICS = [
  { id: 1, name: 'Flight Booking', volume: 4879, unres: 34.1, aht: 5.88, agent: 95, csat: 4.1, sil: 3.42, trendPct: 9, emerging: true },
  { id: 2, name: 'Booking Status', volume: 3832, unres: 47.6, aht: 0.25, agent: 92.7, csat: 4.7, sil: 16.31, trendPct: 6, emerging: false },
  { id: 3, name: 'Ticket Confirmation', volume: 2689, unres: 18.9, aht: 2.2, agent: 88.5, csat: 4.3, sil: 2.72, trendPct: 3, emerging: false },
  { id: 4, name: 'Existing Flight Details', volume: 2594, unres: 13.6, aht: 4.25, agent: 85.7, csat: 3.8, sil: 3.99, trendPct: -2, emerging: false },
  { id: 5, name: 'Ticket Changes & Cancellations', volume: 2142, unres: 40.8, aht: 5.6, agent: 90.3, csat: 3.6, sil: 3.13, trendPct: 22, emerging: true },
  { id: 6, name: 'Refunds & Payments', volume: 1761, unres: 41.2, aht: 3.41, agent: 93.1, csat: 3.6, sil: 5.68, trendPct: 18, emerging: true },
  { id: 7, name: 'Flight Details Change', volume: 1404, unres: 42.2, aht: 4.57, agent: 89.6, csat: 4.4, sil: 2.32, trendPct: 7, emerging: false },
  { id: 8, name: 'Seats & Upgrades', volume: 1214, unres: 34.5, aht: 5.67, agent: 87.9, csat: 4.2, sil: 2.82, trendPct: 4, emerging: false },
  { id: 9, name: 'Medical & Special Assistance', volume: 904, unres: 28.5, aht: 6.27, agent: 94.2, csat: 4.0, sil: 2.03, trendPct: 5, emerging: false },
  { id: 10, name: 'Customer Relations & Follow-up', volume: 619, unres: 64.7, aht: 3.85, agent: 91.8, csat: 4.8, sil: 3.36, trendPct: 26, emerging: true },
  { id: 11, name: 'Baggage & Cargo', volume: 476, unres: 26.4, aht: 6.29, agent: 86.5, csat: 3.9, sil: 3.45, trendPct: 11, emerging: false },
  { id: 12, name: 'Security Checks & Documents', volume: 357, unres: 18.9, aht: 4.43, agent: 96.2, csat: 4.3, sil: 1.4, trendPct: 2, emerging: false },
  { id: 13, name: 'Points & Loyalty Club', volume: 238, unres: 27, aht: 4.65, agent: 88.9, csat: 4.2, sil: 2.92, trendPct: 8, emerging: false },
]
const PS_GOOD = '#4BA373', PS_MED = '#E9B047', PS_POOR = '#FF7056'
const fmtMin = m => { const mm = Math.floor(m), ss = Math.round((m - mm) * 60); return mm + ':' + String(ss).padStart(2, '0') }
const PULSE_METRICS = [
  { key: 'volume', label: 'Volume', sub: 'calls', get: t => t.volume, fmt: v => Math.round(v).toLocaleString(), dir: null },
  { key: 'resolution', label: 'Resolution rate', sub: 'calls resolved', get: t => 100 - t.unres, fmt: v => Math.round(v) + '%', dir: 'hi', good: 75, med: 55 },
  { key: 'aht', label: 'Handle time', sub: 'avg per call', get: t => t.aht, fmt: fmtMin, dir: 'lo', good: 3, med: 6 },
  { key: 'agent', label: 'Agent score', sub: 'out of 100', get: t => t.agent, fmt: v => v.toFixed(1), dir: 'hi', good: 90, med: 85 },
  { key: 'csat', label: 'Satisfaction', sub: 'out of 5.0', get: t => t.csat, fmt: v => v.toFixed(1), dir: 'hi', good: 4.3, med: 3.8 },
  { key: 'silence', label: 'Silent time', sub: 'of call duration', get: t => t.sil, fmt: v => v.toFixed(1) + '%', dir: 'lo', good: 5, med: 10 },
]
function pulseStatus(m, v) {
  if (!m.dir) return null
  // badge = design-system Badge tone name (horizon = amber)
  const G = { k: 'good', label: 'Good', color: PS_GOOD, badge: 'green' }
  const M = { k: 'med', label: 'Med', color: PS_MED, badge: 'horizon' }
  const P = { k: 'poor', label: 'Poor', color: PS_POOR, badge: 'coral' }
  if (m.dir === 'hi') return v >= m.good ? G : v >= m.med ? M : P
  return v <= m.good ? G : v <= m.med ? M : P
}
function pulseAggregate() {
  const tot = PULSE_TOPICS.reduce((s, t) => s + t.volume, 0)
  const w = f => PULSE_TOPICS.reduce((s, t) => s + f(t) * t.volume, 0) / tot
  return { id: null, name: 'All topics', volume: tot, unres: w(t => t.unres), aht: w(t => t.aht), agent: w(t => t.agent), csat: w(t => t.csat), sil: w(t => t.sil), trendPct: Math.round(w(t => t.trendPct)), emerging: false }
}
function pulseSeries(base, trend, seed) {
  const n = 8, a = []; let v = base * (1 - Math.min(0.3, Math.abs(trend) / 150))
  for (let i = 0; i < n; i++) { v = v * (1 + (trend / 100) / (n - 1) + Math.sin(i * 1.3 + seed) * 0.04); a.push(v) }
  return a
}
function pulsePoints(data, w, h) {
  const max = Math.max(...data), min = Math.min(...data), rng = (max - min) || 1
  return data.map((v, i) => [(i / (data.length - 1)) * (w - 6) + 3, (h - 8) - ((v - min) / rng) * (h - 14) + 4])
}
function Sparkline({ data, color, w = 60, h = 24 }) {
  const pts = pulsePoints(data, w, h)
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')
  const area = `M${pts[0][0].toFixed(1)},${h} ${line.replace(/^M/, 'L')} L${pts[pts.length - 1][0].toFixed(1)},${h} Z`
  const last = pts[pts.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <path d={area} fill={color} opacity="0.10" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
    </svg>
  )
}
function TrendChart({ data, avg, color }) {
  const W = 720, H = 170
  const all = data.concat(avg), max = Math.max(...all), min = Math.min(...all), rng = (max - min) || 1
  const px = arr => arr.map((v, i) => [(i / (arr.length - 1)) * (W - 6) + 3, (H - 14) - ((v - min) / rng) * (H - 28) + 7])
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')
  const tp = px(data), ap = px(avg), tline = path(tp)
  const area = `M${tp[0][0].toFixed(1)},${H - 1} ${tline.replace(/^M/, 'L')} L${tp[tp.length - 1][0].toFixed(1)},${H - 1} Z`
  const last = tp[tp.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', height: 'auto', overflow: 'visible' }}>
      {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1="0" y1={(H * g).toFixed(1)} x2={W} y2={(H * g).toFixed(1)} stroke="var(--border-default)" strokeWidth="1" opacity="0.5" vectorEffect="non-scaling-stroke" />)}
      <path d={path(ap)} fill="none" stroke="var(--border-input)" strokeWidth="1.6" strokeDasharray="4 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={area} fill={color} opacity="0.10" />
      <path d={tline} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}
function PulseView({ topicId }) {
  const [metricKey, setMetricKey] = useState('volume')
  const total = PULSE_TOPICS.reduce((s, t) => s + t.volume, 0)
  const target = topicId == null ? pulseAggregate() : (PULSE_TOPICS.find(t => t.id === topicId) || pulseAggregate())

  const info = m => {
    const val = m.get(target), status = pulseStatus(m, val)
    if (m.key === 'volume') {
      const tr = target.trendPct
      return { m, val, status, color: '#1779F7', deltaLabel: (tr >= 0 ? '↗ +' : '↘ ') + Math.abs(tr) + '%', deltaGood: tr >= 0, deltaSub: 'vs prev period', series: pulseSeries(val, tr, 1), avg: pulseSeries(total / PULSE_TOPICS.length, 1, 7) }
    }
    const mean = PULSE_TOPICS.reduce((s, t) => s + m.get(t), 0) / PULSE_TOPICS.length
    const d = val - mean, good = m.dir === 'hi' ? d >= 0 : d <= 0
    return { m, val, status, color: status.color, deltaLabel: (d >= 0 ? '↗ ' : '↘ ') + m.fmt(Math.abs(d)), deltaGood: good, deltaSub: 'avg ' + m.fmt(mean), series: pulseSeries(val, (good ? 1 : -1) * 4, m.key.length + Math.round(val)), avg: pulseSeries(mean, 1, m.key.length) }
  }
  const infos = {}; PULSE_METRICS.forEach(m => { infos[m.key] = info(m) })
  const fi = infos[metricKey]
  const card = { background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12 }

  return (
    <div style={{ fontFamily: "'Byrd',sans-serif", width: '100%' }}>
      {/* Health strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(158px,1fr))', gap: 10, marginBottom: 14 }}>
        {PULSE_METRICS.map(m => {
          const inf = infos[m.key], selected = metricKey === m.key
          const vcol = inf.status && inf.status.k !== 'med' ? inf.status.color : 'var(--text-primary)'
          return (
            <button key={m.key} onClick={() => setMetricKey(m.key)} style={{ ...card, padding: '12px 13px', cursor: 'pointer', textAlign: 'left', border: '1px solid ' + (selected ? 'var(--b100)' : 'var(--border-default)'), boxShadow: selected ? '0 0 0 3px color-mix(in srgb,var(--b100) 18%,transparent)' : 'none', transition: 'border-color .15s,box-shadow .15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{m.label.toUpperCase()}</span>
                {inf.status && <Badge variant="tinted" color={inf.status.badge} shape="soft" style={{ height: 20, fontSize: 11, padding: '0 8px' }}>{inf.status.label}</Badge>}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.05, color: vcol, fontVariantNumeric: 'tabular-nums' }}>{m.fmt(inf.val)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                <Badge variant="tinted" color={inf.deltaGood ? 'green' : 'coral'} shape="pill" style={{ height: 20, fontSize: 11, padding: '0 7px' }}>{inf.deltaLabel}</Badge>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{inf.deltaSub}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Focused trend */}
      <div style={{ ...card, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{fi.m.label} trend</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Weekly · last 8 weeks</div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 2, background: fi.color, borderRadius: 2 }} />Topic</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 0, borderTop: '2px dashed var(--border-input)' }} />Avg</span>
          </div>
        </div>
        <TrendChart data={fi.series} avg={fi.avg} color={fi.color} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>
          {['W7', 'W6', 'W5', 'W4', 'W3', 'W2', 'W1', 'Now'].map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </div>
  )
}
