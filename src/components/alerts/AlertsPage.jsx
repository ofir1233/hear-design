import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'
import PageHeader from '../PageHeader.jsx'
import Button from '../Button.jsx'
import Badge from '../Badge.jsx'
import Modal from '../Modal.jsx'
import { DotsIcon } from '../icons/index.jsx'
import MonitoringFilters from './MonitoringFilters.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ── AG Grid setup (mirrors AgentEvalPage / DataPage) ─────────────────────────────

ModuleRegistry.registerModules([AllCommunityModule])

const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 14,
  cellHorizontalPaddingScale: 1.15,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:               '#FFFFFF',
  foregroundColor:               '#181818',
  headerBackgroundColor:         '#FFFFFF',
  headerTextColor:               '#606060',
  borderColor:                   '#E5E7EB',
  rowHoverColor:                 '#E8E8E6',
  selectedRowBackgroundColor:    'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:         '#F9F9F7',
  headerColumnResizeHandleColor: '#D1D5DB',
})
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  ...THEME_PARAMS,
  backgroundColor:               '#242424',
  foregroundColor:               '#F4F3F1',
  headerBackgroundColor:         '#242424',
  headerTextColor:               '#9B9B9B',
  borderColor:                   '#333333',
  rowHoverColor:                 '#2A2A2A',
  selectedRowBackgroundColor:    'rgba(23,121,247,0.12)',
  oddRowBackgroundColor:         '#202020',
  headerColumnResizeHandleColor: '#444444',
})

function useIsDark() {
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.dataset.theme === 'dark'))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

// ── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2H4A1.5 1.5 0 002.5 3.5V9A1.5 1.5 0 004 10.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExpandIcon() {
  // "arrows pointing out"
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M8 3H3v5M17 8V3h-5M12 17h5v-5M3 12v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M11 2.5l2.5 2.5M2.5 13.5L3 11l7.5-7.5 2.5 2.5L5.5 13.5 2.5 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 5.5a1.5 1.5 0 011.5-1.5h9A1.5 1.5 0 0114 5.5v1a1 1 0 000 2v1a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 10v-1a1 1 0 000-2v-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9.5 4v8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.5 1.5" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7" cy="4.3" r="0.75" fill="currentColor" />
    </svg>
  )
}

// ── Mock data (MonitorCountResult) ──────────────────────────────────────────────

const MONITORS = [
  { _id: '68b1c0f2add1e4d78', name: 'Investment Advice',                          prompt: 'Agent provides regulated investment advice without a license.',               is_active: true,  count: 7,   last_triggered_at: 'Jun 1, 18:04',   created_by: 'Anouk Berger' },
  { _id: '68b1c0f2add1e4dd7', name: 'Distressed Client',                          prompt: 'Customer expresses financial distress, panic, or vulnerability.',             is_active: true,  count: 13,  last_triggered_at: 'Today, 12:31',   created_by: 'Anouk Berger' },
  { _id: 'd7c1908a5d8f3d61',  name: 'Unprofessional Behavior',                    prompt: 'Agent uses inappropriate, rude, or unprofessional language.',                 is_active: true,  count: 10,  last_triggered_at: 'Jun 1, 20:37',   created_by: 'Yossi Mizrahi' },
  { _id: 'a19be7c25d8f3e7c',  name: 'Interfering with or downplaying KYC, registration, or Proof of Funds.', prompt: 'Agent discourages or bypasses KYC / proof-of-funds requirements.', is_active: true, count: 12, last_triggered_at: 'Jun 1, 19:57', created_by: 'Anouk Berger' },
  { _id: 'e2f6b04c5d8f3eaf',  name: 'Deposits/Withdrawals Recommendations',       prompt: 'Agent gives unsolicited advice about deposits or withdrawals.',               is_active: true,  count: 8,   last_triggered_at: 'Jun 1, 19:56',   created_by: 'Anouk Berger' },
  { _id: 'b3e8a7025d8f3eb2',  name: 'Legal & Regulatory Violations',              prompt: 'Statements that breach legal or regulatory obligations.',                     is_active: true,  count: 5,   last_triggered_at: 'May 29, 20:19',  created_by: 'Anouk Berger' },
  { _id: '68b1c0f2a0c84cd5e', name: 'Third Party',                                prompt: 'Agent shares customer information with an unauthorized third party.',         is_active: true,  count: 305, last_triggered_at: 'Today, 16:21',   created_by: 'Anouk Berger' },
  { _id: '7f22d391badf03144', name: 'Information Violation',                       prompt: 'Sensitive personal or account data is exposed without verification.',          is_active: true,  count: 43,  last_triggered_at: 'Today, 14:58',   created_by: 'Yossi Mizrahi' },
  { _id: '90ab77e1d00be7d1',  name: 'Loan Mentioned',                             prompt: 'A loan product is mentioned or offered during the conversation.',             is_active: false, count: 0,   last_triggered_at: null,             created_by: 'Yossi Mizrahi' },
]

// Alerts-over-time — one series per monitor, grouped by week (matches the original).
const CHART_WEEKS = ['Week 23, 2026', 'Week 24, 2026', 'Week 25, 2026', 'Week 26, 2026', 'Week 27, 2026']

// Colors mapped to the Hear design-system palette (accent hues = data categoricals).
const CHART_SERIES = [
  { name: 'Investment Advice',                     color: 'var(--g100)',   data: [1, 0, 0, 1, 0] },   // green
  { name: 'Distressed Client',                     color: 'var(--b100)',   data: [1, 0, 2, 2, 0] },   // cobalt
  { name: 'Unprofessional Behavior',               color: 'var(--l100)',   data: [1, 0, 0, 3, 0] },   // lilac
  { name: 'Interfering with or downplaying KYC, registration, or Proof of Funds.', color: 'var(--h100)', data: [1, 0, 1, 2, 0] }, // horizon
  { name: 'Deposits/Withdrawals Recommendations',  color: 'var(--s100)',   data: [1, 0, 1, 0, 0] },   // sage
  { name: 'Legal & Regulatory Violations',         color: 'var(--t100)',   data: [0, 0, 0, 1, 1] },   // teal
  { name: 'Third Party',                           color: 'var(--c100)',   data: [33, 59, 57, 77, 69] }, // coral (dominant)
  { name: 'Information Violation',                 color: 'var(--red100)', data: [6, 8, 5, 11, 2] },  // error red
  { name: 'Loan Mentioned',                        color: 'var(--n40)',    data: [0, 0, 0, 0, 0] },   // neutral
]

const UNIQUE_ALERTS = 280

const ACTIVE_MONITORS_LIMIT = 12

// ── Count-up hook ──────────────────────────────────────────────────────────────

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setVal(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

// ── Tooltip (lightweight, hover) — for elements outside the grid ─────────────────

function Tooltip({ label, children, maxWidth = 280 }) {
  const [show, setShow] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && label && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'var(--text-inverse)',
          fontSize: 11, fontWeight: 500, lineHeight: 1.45, padding: '6px 9px', borderRadius: 6,
          maxWidth, width: 'max-content', whiteSpace: 'normal', textAlign: 'left',
          zIndex: 50, pointerEvents: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        }}>
          {label}
        </span>
      )}
    </span>
  )
}

// ── Alerts-over-time bar chart ───────────────────────────────────────────────────

function niceCeil(v) {
  if (v <= 0) return 10
  const step = v <= 40 ? 10 : 20
  return Math.ceil(v / step) * step
}

function AlertsChart({ series, weeks, height = 300 }) {
  const weekTotals = weeks.map((_, wi) => series.reduce((s, ser) => s + (ser.data[wi] ?? 0), 0))
  const niceMax = niceCeil(Math.max(...weekTotals, 1))
  const ticks = 4
  const TOP = 26 // week-label row
  const [hover, setHover] = useState(null) // { wi, x, y }

  const hoverRows = hover
    ? series.map(s => ({ name: s.name, color: s.color, v: s.data[hover.wi] ?? 0 })).filter(r => r.v > 0).sort((a, b) => b.v - a.v)
    : []

  return (
    <div style={{ fontFamily: "'Byrd', sans-serif" }}>
      <div style={{ display: 'flex', height }}>
        {/* Y-axis title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
          <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Total Alerts
          </span>
        </div>

        {/* Y-axis ticks */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          paddingTop: TOP, paddingBottom: 1, width: 30, textAlign: 'right',
        }}>
          {Array.from({ length: ticks + 1 }).map((_, i) => (
            <span key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1 }}>
              {Math.round((niceMax * (ticks - i)) / ticks)}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* week labels on top */}
          <div style={{ height: TOP, display: 'flex' }}>
            {weeks.map(w => (
              <div key={w} style={{ flex: 1, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>{w}</div>
            ))}
          </div>

          {/* bars area */}
          <div style={{
            flex: 1, position: 'relative', display: 'flex',
            borderBottom: '1px solid var(--border-default)', borderLeft: '1px solid var(--border-default)',
          }}>
            {/* gridlines */}
            {Array.from({ length: ticks }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: 0, right: 0, top: `${((height - TOP - 1) * i) / ticks}px`,
                borderTop: '1px solid var(--border-default)', opacity: 0.5,
              }} />
            ))}
            {weeks.map((w, wi) => {
              const total = weekTotals[wi]
              return (
                <div key={w}
                  onMouseEnter={e => setHover({ wi, x: e.clientX, y: e.clientY })}
                  onMouseMove={e => setHover({ wi, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    padding: '0 8px', minWidth: 0, zIndex: 1, cursor: 'default',
                  }}>
                  <div style={{
                    width: '58%', maxWidth: 52,
                    height: `${(total / niceMax) * 100}%`,
                    display: 'flex', flexDirection: 'column-reverse',
                    borderRadius: '4px 4px 0 0', overflow: 'hidden',
                    outline: hover?.wi === wi ? '2px solid var(--border-input)' : 'none', outlineOffset: 1,
                  }}>
                    {series.map(s => {
                      const v = s.data[wi] ?? 0
                      if (v <= 0) return null
                      return (
                        <div key={s.name} style={{
                          height: `${(v / total) * 100}%`, background: s.color, flexShrink: 0,
                        }} />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px 22px', justifyContent: 'center',
        padding: '16px 8px 4px',
      }}>
        {series.map(s => (
          <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-primary)' }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            {s.name}
          </span>
        ))}
      </div>

      {/* Hover distribution tooltip */}
      {hover && createPortal(
        <div style={{
          position: 'fixed', zIndex: 10050, pointerEvents: 'none',
          top: Math.min(hover.y + 16, window.innerHeight - (hoverRows.length * 22 + 88)),
          left: Math.min(hover.x + 16, window.innerWidth - 288),
          width: 268, padding: '10px 12px', borderRadius: 10,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.16)', fontFamily: "'Byrd', sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 8, marginBottom: 6, borderBottom: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{weeks[hover.wi]}</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total <b style={{ color: 'var(--text-primary)' }}>{weekTotals[hover.wi].toLocaleString()}</b></span>
          </div>
          {hoverRows.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No alerts</div>
          ) : hoverRows.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: r.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{r.v.toLocaleString()}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

function ChartCard({ series, weeks, onExpand }) {
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        borderRadius: 12, padding: '16px 20px 12px', position: 'relative',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Alerts
        </div>
        <button
          onClick={onExpand}
          aria-label="Expand chart"
          style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, padding: 6, borderRadius: 6,
            border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'background 120ms ease, color 120ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <ExpandIcon />
        </button>
        <AlertsChart series={series} weeks={weeks} height={320} />
      </div>
    </div>
  )
}

// ── Stat cards ───────────────────────────────────────────────────────────────────

function StatCard({ label, value, info }) {
  const display = useCountUp(value)
  return (
    <div style={{
      position: 'relative', background: 'var(--bg-card)',
      border: '1px solid var(--border-default)', borderRadius: 12,
      padding: '18px 16px', textAlign: 'center',
      transition: 'border-color 120ms ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-input)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
    >
      {info && (
        <span style={{ position: 'absolute', top: 8, right: 8, color: 'var(--text-muted)', display: 'flex' }}>
          <Tooltip label={info} maxWidth={240}><InfoIcon /></Tooltip>
        </span>
      )}
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.1 }}>
        {display.toLocaleString()}
      </div>
    </div>
  )
}

// ── Active toggle (presentational) ───────────────────────────────────────────────

function ActiveToggle({ checked, disabled, onClick }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 34, height: 20, borderRadius: 99, border: 'none', padding: 0,
        position: 'relative', flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--border-default)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'background 200ms ease',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 17 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.25)', transition: 'left 200ms ease',
      }} />
    </button>
  )
}

// ── AG Grid cell renderers ───────────────────────────────────────────────────────

function NameCellRenderer(params) {
  const m = params.data
  const [copied, setCopied] = useState(false)
  if (!m) return null
  const short = m._id.slice(-8)

  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(m._id).catch(() => {})
    setCopied(true)
    params.onCopyToast?.('Report ID copied to clipboard')
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%', minWidth: 0 }}>
      {/* id chip */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', alignSelf: 'center', gap: 6,
        padding: '2px 6px', borderRadius: 4, background: '#F9F9F7', flexShrink: 0, lineHeight: 1,
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, lineHeight: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'var(--d50)', letterSpacing: '-0.01em' }}>
          {short}
        </span>
        <button
          onClick={copy}
          title="Copy alert ID"
          aria-label="Copy alert ID"
          style={{ display: 'flex', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: copied ? 'var(--g100)' : '#9B9B9B' }}
        >
          {copied ? <CheckIcon12 /> : <CopyIcon12 />}
        </button>
      </span>

      {/* name */}
      <span
        title={m.prompt || m.name || 'Unknown'}
        style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {m.name}
      </span>
    </div>
  )
}

function CountCellRenderer(params) {
  if (params.data == null) return null
  return <span style={{ fontWeight: 500 }}>{(params.value ?? 0).toLocaleString()}</span>
}

function DateCellRenderer(params) {
  if (params.data == null) return null
  return params.value
    ? <span style={{ color: 'var(--text-secondary)' }}>{params.value}</span>
    : <span style={{ color: 'var(--text-muted)' }}>-</span>
}

function CreatedByCellRenderer(params) {
  const m = params.data
  if (!m) return null
  const text = m.source === 'Tommy'
    ? (m.created_by ? `Tommy; ${m.created_by}` : 'Tommy')
    : (m.created_by || 'N/A')
  return <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
}

function ActiveToggleCellRenderer(params) {
  const m = params.data
  const [busy, setBusy] = useState(false)
  if (!m) return null
  const click = () => {
    if (busy) return
    setBusy(true)
    params.onToggle(m)
    setTimeout(() => setBusy(false), 350)
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <ActiveToggle checked={m.is_active} disabled={busy} onClick={click} />
    </div>
  )
}

function ActionsCellRenderer(params) {
  const m = params.data
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const openMenu = () => {
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  if (!m) return null

  const items = [
    { key: 'explore', label: 'Explore', Icon: SearchIcon, onClick: () => navigate(`/data?filter=monitor_alerts.${m._id}:monitor:$exists:&project=${params.projectId}`) },
    { key: 'edit',    label: 'Edit',    Icon: EditIcon,   onClick: () => navigate(`/monitoring/edit/${m._id}?project=${params.projectId}`) },
    { key: 'ticket',  label: 'Assign Ticket', Icon: TicketIcon, onClick: () => params.onCopyToast?.('Assign-ticket flow opened') },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <button
        ref={btnRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-label="Actions"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 6, border: 'none',
          background: open ? 'var(--bg-active)' : 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 120ms ease',
        }}
      >
        <DotsIcon />
      </button>
      {open && pos && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: pos.top, right: pos.right, zIndex: 10002,
          minWidth: 170, padding: 4, borderRadius: 10,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
        }}>
          {items.map(({ key, label, Icon, onClick }) => (
            <button
              key={key}
              onClick={() => { setOpen(false); onClick() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '8px 10px', borderRadius: 6, border: 'none', background: 'transparent',
                color: 'var(--text-primary)', fontSize: 13, fontFamily: "'Byrd', sans-serif",
                textAlign: 'left', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}><Icon /></span>
              {label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

// ── Alerts grid ──────────────────────────────────────────────────────────────────

const ROW_H = 41
const HEADER_H = 56

function AlertsGrid({ rows, showProject, projectId, onToggle, onCopyToast }) {
  const isDark = useIsDark()

  const colDefs = useMemo(() => {
    const cols = [
      { headerName: '', width: 64, valueGetter: p => (p.node?.rowIndex ?? 0) + 1, cellStyle: { color: 'var(--text-muted)' }, sortable: false, resizable: false, suppressMovable: true },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 240, cellRenderer: NameCellRenderer, cellRendererParams: { onCopyToast } },
    ]
    if (showProject) {
      cols.push({ field: 'projectName', headerName: 'Project', flex: 0.7, minWidth: 140, valueGetter: p => p.data?.projectName || '—' })
    }
    cols.push(
      { field: 'count', headerName: 'Total Alerts', width: 140, cellRenderer: CountCellRenderer },
      { field: 'last_triggered_at', headerName: 'Last Triggered At', flex: 0.8, minWidth: 180, cellRenderer: DateCellRenderer },
      { field: 'is_active', headerName: 'Is Active', width: 110, cellRenderer: ActiveToggleCellRenderer, cellRendererParams: { onToggle }, cellStyle: { justifyContent: 'center' } },
      { field: 'created_by', headerName: 'Created by', flex: 0.8, minWidth: 160, cellRenderer: CreatedByCellRenderer },
      { headerName: 'Actions', width: 100, cellRenderer: ActionsCellRenderer, cellRendererParams: { projectId, onCopyToast }, cellStyle: { justifyContent: 'center' }, resizable: false },
    )
    return cols
  }, [showProject, projectId, onToggle, onCopyToast])

  const gridHeight = HEADER_H + Math.max(rows.length, 3) * ROW_H + 2

  return (
    <div className="hear-grid alerts-grid" style={{
      height: gridHeight, width: '100%', borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--border-default)', background: 'var(--bg-card)',
    }}>
      <AgGridReact
        theme={isDark ? darkTheme : lightTheme}
        className="hear-grid"
        rowData={rows}
        columnDefs={colDefs}
        defaultColDef={{ resizable: true, sortable: false, suppressHeaderMenuButton: true }}
        rowHeight={ROW_H}
        headerHeight={HEADER_H}
        suppressCellFocus
        getRowId={p => p.data._id}
        overlayNoRowsTemplate="No monitors match the current filters"
      />
    </div>
  )
}

function AlertsTables({ monitors, orgMode, projectId, onToggle, onCopyToast }) {
  if (!orgMode) {
    return <AlertsGrid rows={monitors} showProject={false} projectId={projectId} onToggle={onToggle} onCopyToast={onCopyToast} />
  }
  const orgRows = monitors.filter(m => m.scope?.type === 'organization')
  const projRows = monitors.filter(m => m.scope?.type !== 'organization')
  const heading = t => <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: 'var(--text-primary)' }}>{t}</h2>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {orgRows.length > 0 && <div>{heading('Organization Monitors')}<AlertsGrid rows={orgRows} showProject={false} projectId={projectId} onToggle={onToggle} onCopyToast={onCopyToast} /></div>}
      <div>{heading('Project Monitors')}<AlertsGrid rows={projRows} showProject projectId={projectId} onToggle={onToggle} onCopyToast={onCopyToast} /></div>
    </div>
  )
}

// ── Empty / loading states ───────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: 'var(--bg-card)',
        border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', marginBottom: 16,
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a5 5 0 015 5v3.5l1.5 3H5.5L7 11.5V8a5 5 0 015-5zM9.5 19a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>No alerts have been created</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Create a new alert to get started</div>
    </div>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
      <span style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '3px solid var(--border-default)', borderTopColor: 'var(--b100)',
        animation: 'btn-spin 0.7s linear infinite',
      }} />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────────

export default function AlertsPage({ sidebarWidth = 272, sidebarTransition = 'none', orgMode = false, projectId = 'demo', loading = false }) {
  const [monitors, setMonitors] = useState(MONITORS)
  const [expanded, setExpanded] = useState(false)
  const [toast, setToast] = useState(null)
  const [quotaModal, setQuotaModal] = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const stats = useMemo(() => ({
    totalMonitors: monitors.length,
    totalAlerts: monitors.reduce((s, m) => s + m.count, 0),
    activeMonitors: monitors.filter(m => m.is_active).length,
    uniqueAlerts: UNIQUE_ALERTS,
  }), [monitors])

  const handleToggle = useCallback((m) => {
    // Activating: quota gate on active-monitors.
    if (!m.is_active) {
      const activeCount = monitors.filter(x => x.is_active).length
      if (activeCount >= ACTIVE_MONITORS_LIMIT) { setQuotaModal(true); return }
    }
    setMonitors(prev => prev.map(x => x._id === m._id ? { ...x, is_active: !x.is_active } : x))
    showToast('Alert updated successfully')
  }, [monitors, showToast])

  const hasNoAlerts = monitors.length === 0 && stats.uniqueAlerts === 0

  return (
    <div
      data-inspector="AlertsPage"
      style={{
        position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
        background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', transition: sidebarTransition,
      }}
    >
      <PageHeader
        title="Alerts"
        badge={<Badge variant="tinted" color="coral" shape="pill">Total Monitors&nbsp;{stats.totalMonitors}</Badge>}
        actions={<Button size="sm" leftIcon={<PlusIcon />} onClick={() => navigate('/monitoring/edit')}>Create Alert</Button>}
      />

      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {loading ? <Loader /> : hasNoAlerts ? <EmptyState /> : (
            <>
              {/* Filters */}
              <MonitoringFilters />

              {/* Alerts-over-time chart */}
              <ChartCard series={CHART_SERIES} weeks={CHART_WEEKS} onExpand={() => setExpanded(true)} />

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <StatCard label="Total Monitors" value={stats.totalMonitors} />
                <StatCard label="Total Alerts" value={stats.totalAlerts} />
                <StatCard label="Active Monitors" value={stats.activeMonitors} />
                <StatCard label="Unique Alerts" value={stats.uniqueAlerts} info="Number of unique files that have at least one triggered alert in the selected time period" />
              </div>

              {/* Table (AG Grid) */}
              <AlertsTables
                monitors={monitors}
                orgMode={orgMode}
                projectId={projectId}
                onToggle={handleToggle}
                onCopyToast={showToast}
              />
            </>
          )}
        </div>
      </div>

      {/* Expand chart modal */}
      <Modal open={expanded} onClose={() => setExpanded(false)} title="Alerts" width="min(90vw, 1100px)">
        <div style={{ height: '70vh', maxHeight: 620 }}>
          <AlertsChart series={CHART_SERIES} weeks={CHART_WEEKS} height={520} />
        </div>
      </Modal>

      {/* Quota-limit modal */}
      <Modal
        open={quotaModal}
        onClose={() => setQuotaModal(false)}
        title="Active alert limit reached"
        width={440}
        footer={<Button size="sm" onClick={() => setQuotaModal(false)}>Got it</Button>}
      >
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          You've reached your plan's limit of {ACTIVE_MONITORS_LIMIT} active alerts. Deactivate another
          alert or upgrade your plan to activate this one.
        </p>
      </Modal>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 10001,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 8,
          background: 'var(--text-primary)', color: 'var(--text-inverse)',
          fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
