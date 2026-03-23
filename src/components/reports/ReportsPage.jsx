import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
import { BsPinFill, BsPin } from 'react-icons/bs'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'

// ── AG Grid themes ─────────────────────────────────────────────────────────────
const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 13,
  cellHorizontalPaddingScale: 1.1,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#F5F5F3',
  foregroundColor:            '#181818',
  headerBackgroundColor:      '#F5F5F3',
  headerTextColor:            '#606060',
  borderColor:                '#E5E7EB',
  rowHoverColor:              '#E8E8E6',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:      '#F5F5F3',
  headerColumnResizeHandleColor: '#D1D5DB',
})
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#242424',
  foregroundColor:            '#F4F3F1',
  headerBackgroundColor:      '#181818',
  headerTextColor:            '#9B9B9B',
  borderColor:                '#333333',
  rowHoverColor:              '#2A2A2A',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.12)',
  oddRowBackgroundColor:      '#242424',
  headerColumnResizeHandleColor: '#444444',
})

const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  suppressMovable: false,
  cellStyle: { display: 'flex', alignItems: 'center' },
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ListViewIcon({ active }) {
  const col = active ? 'var(--c100)' : 'currentColor'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3"  width="12" height="2" rx="1" fill={col} />
      <rect x="2" y="7"  width="12" height="2" rx="1" fill={col} />
      <rect x="2" y="11" width="12" height="2" rx="1" fill={col} />
    </svg>
  )
}

function GridViewIcon({ active }) {
  const col = active ? 'var(--c100)' : 'currentColor'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.5" fill={col} />
      <rect x="9" y="2" width="5" height="5" rx="1.5" fill={col} />
      <rect x="2" y="9" width="5" height="5" rx="1.5" fill={col} />
      <rect x="9" y="9" width="5" height="5" rx="1.5" fill={col} />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="8"    r="1.2" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  )
}


function SparkleIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
      <path d="M5 0.5L5.9 3.8L9 5L5.9 6.2L5 9.5L4.1 6.2L1 5L4.1 3.8L5 0.5Z" fill="currentColor" />
    </svg>
  )
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ data, color = '#FF7056', height = 56 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 200, H = height, pX = 2, pY = 6

  const pts = data.map((v, i) => [
    pX + (i / (data.length - 1)) * (W - pX * 2),
    pY + (H - pY * 2) - ((v - min) / range) * (H - pY * 2),
  ])

  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M${pts[0][0]},${H} ` + pts.map(([x, y]) => `L${x},${y}`).join(' ') + ` L${pts.at(-1)[0]},${H} Z`
  const [lx, ly] = pts.at(-1)
  const gid = `sg${color.replace('#', '')}`

  // Convert SVG-space coordinates to % so dots stay perfectly round
  // even when the SVG is stretched via preserveAspectRatio="none"
  const dotLeft = `${(lx / W) * 100}%`
  const dotTop  = `${(ly / H) * 100}%`

  return (
    <div style={{ position: 'relative', height }}>
      {/* Line + area — stretched to fill card width */}
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none"
        style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <polyline points={line} stroke={color} strokeWidth="1.8" strokeLinecap="round"
          strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Pulsing halo — CSS div, always a perfect circle */}
      <div style={{
        position: 'absolute',
        left: dotLeft, top: dotTop,
        width: 14, height: 14,
        borderRadius: '50%',
        background: color,
        opacity: 0.18,
        transform: 'translate(-50%, -50%)',
        animation: 'spark-pulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Solid dot — CSS div, always a perfect circle */}
      <div style={{
        position: 'absolute',
        left: dotLeft, top: dotTop,
        width: 8, height: 8,
        borderRadius: '50%',
        background: color,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── Preview data map (keyed by report ID) ────────────────────────────────────
// Provides sparkline + stat data for any report that can be pinned.

const PREVIEW_DATA = {
  '694d64ceefa95f9cc2ababdb3': {
    lastRun: 'Today · 07:09', apiKey: 'hear_sk_••••3f9a',
    sparkData: [42, 38, 46, 55, 49, 61, 67], sparkColor: '#FF7056',
    sparkLabel: 'Billing complaints / 7d', sparkDelta: '+12%', sparkUp: true,
    stats: [
      { label: 'Calls analyzed', value: '1,247' },
      { label: 'Avg handle time', value: '4m 36s' },
      { label: 'CSAT avg', value: '87%' },
    ],
  },
  '6942b63cfd8049b0c779c75b': {
    lastRun: 'Running now', apiKey: 'hear_sk_••••8c2d',
    sparkData: [5.1, 4.9, 4.7, 4.4, 4.3, 4.4, 4.2], sparkColor: '#1779F7',
    sparkLabel: 'Escalation rate / 7d', sparkDelta: '−0.9pp', sparkUp: false,
    stats: [
      { label: 'Escalation rate', value: '4.2%' },
      { label: 'Avg wait time', value: '2m 11s' },
      { label: 'Same-day resolved', value: '91%' },
    ],
  },
  '694265261dcb88436adfcac5': {
    lastRun: 'Mar 14 · 06:00', apiKey: 'hear_sk_••••a7e1',
    sparkData: [11, 14, 13, 16, 12, 15, 14], sparkColor: '#4BA373',
    sparkLabel: 'Peak hour calls / 7d', sparkDelta: '+3 slots', sparkUp: true,
    stats: [
      { label: 'Peak: 10–11 AM', value: '14 calls' },
      { label: '2–3 PM peak', value: '11 calls' },
      { label: 'Staff target', value: '94%' },
    ],
  },
}

// Default pinned IDs — first 3 have full preview data
const DEFAULT_PINNED = [
  '694d64ceefa95f9cc2ababdb3',
  '6942b63cfd8049b0c779c75b',
  '694265261dcb88436adfcac5',
]

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_CFG = {
  'ai-generated': { label: 'AI Generated', border: 'var(--c100)' },
  'running':      { label: 'Running',      border: 'var(--g100)' },
  'completed':    { label: 'Completed',    border: 'var(--g100)' },
  'failed':       { label: 'Failed',       border: '#DC2626'     },
  'not-executed': { label: 'Not Executed', border: 'var(--border-default)' },
}

const STATUS_FILTERS = [
  { value: 'all',          label: 'All' },
  { value: 'ai-generated', label: 'AI Generated' },
  { value: 'running',      label: 'Running' },
  { value: 'completed',    label: 'Completed' },
  { value: 'failed',       label: 'Failed' },
  { value: 'not-executed', label: 'Not Executed' },
]

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_REPORTS = [
  { id: '694d64ceefa95f9cc2ababdb3', name: 'Daily trends report',                                    status: 'ai-generated', schedule: 'Daily',     createdAt: '2026-03-08', trend: 'Billing complaints up 12%, resolution time improved 8% vs. last week.' },
  { id: '695ba722efa95f9cc2abae07',  name: 'Monthly trends report',                                  status: 'ai-generated', schedule: 'Monthly',   createdAt: '2026-03-07', trend: 'Monthly report not yet executed for the current period.' },
  { id: '695ba702efa95f9cc2abae06',  name: 'Weekly trends report',                                   status: 'ai-generated', schedule: 'Weekly',    createdAt: '2026-03-07', trend: 'Weekly report not yet executed for the current period.' },
  { id: '6942b608aa54410857420f45',  name: 'Call closure rate — 7 days',                             status: 'failed',       schedule: 'Daily',     createdAt: '2026-03-06', trend: 'Missing data for yesterday prevented anomaly detection from running.' },
  { id: '6942b63cfd8049b0c779c75b',  name: 'Escalation tracking report',                             status: 'running',      schedule: 'Weekly',    createdAt: '2026-03-06', trend: 'Escalation rate stable at 4.2%. High-volume periods: Mon & Thu afternoons.' },
  { id: '694265261dcb88436adfcac5',  name: 'Peak hour detection — weekly',                           status: 'completed',    schedule: 'Weekly',    createdAt: '2026-03-05', trend: 'Peak hours: 10–11 AM and 2–3 PM. Staffing recommendations attached.' },
  { id: '6852ce3f2e71d4df0f611c6b',  name: 'Anomaly report by agent',                               status: 'completed',    schedule: 'On demand', createdAt: '2026-03-05', trend: '3 agents flagged for unusual silence patterns. Data gaps resolved.' },
  { id: '6942b65037dbc5b2b07a3fee',  name: 'Open interactions — 7 days',                            status: 'failed',       schedule: 'Daily',     createdAt: '2026-03-04', trend: 'Cannot compare without two comparable input datasets. Manual review required.' },
  { id: '6947a86c068a8c032426eac0',  name: 'Avg. handle time — weekly',                             status: 'completed',    schedule: 'Weekly',    createdAt: '2026-03-04', trend: 'Week of 21–27 Mar: avg 4m 36s, down 18s vs. prior week.' },
  { id: '6942653a1dcb88436adfcac8',  name: 'Live interaction audit — daily',                        status: 'completed',    schedule: 'Daily',     createdAt: '2026-03-03', trend: 'No critical compliance flags. 2 borderline interactions flagged for review.' },
  { id: '685be8d47b919e47fa5d959d',  name: 'Agent performance: staffing & personal breakdown',      status: 'completed',    schedule: 'Monthly',   createdAt: '2026-03-03', trend: 'Top 5 agents exceeded CSAT target. Bottom 3 agents recommended for coaching.' },
  { id: '685be91a8774d22c95d77ed8',  name: 'Agent performance: follow-up & ticket creation',        status: 'failed',       schedule: 'Weekly',    createdAt: '2026-03-02', trend: 'CRM integration returned empty dataset. Retry scheduled for next cycle.' },
  { id: '685be92d7b919e47fa5d95e2',  name: 'Agent performance: portal access & knowledge',          status: 'failed',       schedule: 'Weekly',    createdAt: '2026-03-02', trend: 'Knowledge base sync failed. Report will re-run once sync is restored.' },
  { id: '685be9067b919e47fa5d95ce',  name: 'Agent performance: behavior & compliance',              status: 'failed',       schedule: 'Weekly',    createdAt: '2026-03-01', trend: 'Compliance module offline during scheduled run. Escalated to IT.' },
  { id: '685be8e57b919e47fa5d95ac',  name: 'Agent performance: interview quality assessment',       status: 'failed',       schedule: 'On demand', createdAt: '2026-03-01', trend: 'No interview data found for the requested period. Report skipped.' },
  { id: '685be8c08774d22c95d77ec8',  name: 'Agent performance: call topics',                        status: 'failed',       schedule: 'Daily',     createdAt: '2026-02-28', trend: 'Topic classification model returned null for this batch. Retrying.' },
  { id: '6852cdbbe139c8454f7a8252',  name: 'Agent performance: portal access & knowledge',          status: 'not-executed', schedule: 'Weekly',    createdAt: '2026-02-28', trend: null },
  { id: '6852cda72e71d4df0f611c46',  name: 'Agent performance: follow-up & ticket creation',        status: 'not-executed', schedule: 'Weekly',    createdAt: '2026-02-27', trend: null },
  { id: '6852cd97e139c8454f7a8239',  name: 'Agent performance: behavior & compliance',              status: 'not-executed', schedule: 'Weekly',    createdAt: '2026-02-27', trend: null },
  { id: '6852cd882e71d4df0f611c44',  name: 'Agent performance: interview quality assessment',       status: 'not-executed', schedule: 'On demand', createdAt: '2026-02-26', trend: null },
  { id: '6852cd75e139c8454f7a8236',  name: 'Agent performance: staffing & personal breakdown',      status: 'not-executed', schedule: 'Monthly',   createdAt: '2026-02-26', trend: null },
  { id: '6852ccbc2e71d4df0f611a30',  name: 'Agent performance: call topics',                        status: 'not-executed', schedule: 'Daily',     createdAt: '2026-02-25', trend: null },
]

// ── Status badge atoms ─────────────────────────────────────────────────────────

function AIBadge() {
  return (
    <span data-inspector="ReportStatusBadge" style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(255,112,86,0.12)', border: '1px solid rgba(255,112,86,0.28)',
      color: 'var(--c100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
    }}>
      <SparkleIcon /> AI Generated
    </span>
  )
}

function FailedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.28)',
      color: '#DC2626', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif",
      letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      Failed
    </span>
  )
}

function NotExecutedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'var(--bg-active)', border: '1px solid var(--border-input)',
      color: 'var(--text-muted)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif",
      letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      Not Executed
    </span>
  )
}

function StatusBadge({ status }) {
  if (status === 'ai-generated') return <AIBadge />
  if (status === 'failed')       return <FailedBadge />
  if (status === 'not-executed') return <NotExecutedBadge />
  if (status === 'running')      return <Badge variant="tinted" color="green">Running</Badge>
  if (status === 'completed')    return <Badge variant="tinted" color="green">Completed</Badge>
  return null
}

// ── Schedule pill ──────────────────────────────────────────────────────────────

function SchedulePill({ label }) {
  return (
    <span data-inspector="SchedulePill" style={{
      display: 'inline-flex', alignItems: 'center',
      height: 20, padding: '0 8px', borderRadius: 4,
      background: 'var(--bg-active)', border: '1px solid var(--border-input)',
      color: 'var(--text-muted)', fontSize: 10, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif",
      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ── Status filter tabs ─────────────────────────────────────────────────────────

function StatusTabs({ active, onChange, counts }) {
  return (
    <div data-inspector="ReportStatusTabs" style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
      {STATUS_FILTERS.map(f => {
        const isActive = active === f.value
        const count = counts[f.value]
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 28, padding: '0 10px', borderRadius: 6,
              background: isActive ? 'var(--bg-active)' : 'transparent',
              border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-active)' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' } }}
          >
            {f.label}
            {count != null && count > 0 && (
              <span style={{
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99,
                background: isActive ? 'var(--border-default)' : 'var(--bg-active)',
                fontSize: 10, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}


// ── RowMenu ───────────────────────────────────────────────────────────────────

function MenuRow({ icon, label, onClick, danger, highlight }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '7px 12px',
        background: hov ? 'var(--bg-active)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        color: danger ? '#DC2626' : highlight ? 'var(--c100)' : 'var(--text-secondary)',
        fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        transition: 'background 100ms ease',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function RowMenu({ isPinned, onTogglePin }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function handleOpen(e) {
    e.stopPropagation()
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    setOpen(o => !o)
  }

  return (
    <div ref={btnRef}>
      <button
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: 5,
          background: open ? 'var(--bg-active)' : 'var(--bg-canvas)',
          border: '1px solid var(--border-input)',
          cursor: 'pointer', color: 'var(--text-secondary)',
        }}
      >
        <MoreIcon />
      </button>

      {open && createPortal(
        <div style={{
          position: 'fixed', top: pos.top, right: pos.right,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
          zIndex: 9999, minWidth: 168, padding: '4px 0',
        }}>
          <MenuRow
            icon={isPinned ? <BsPinFill size={13} /> : <BsPin size={13} />}
            label={isPinned ? 'Unpin from top' : 'Pin to top'}
            onClick={() => { onTogglePin(); setOpen(false) }}
            highlight={!isPinned}
          />
          <MenuRow icon={
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M9 1h4v4M13 1L7.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          } label="Open report" onClick={() => setOpen(false)} />
          <div style={{ height: 1, background: 'var(--border-input)', margin: '4px 0' }} />
          <MenuRow icon={
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M11 4l-.7 7.5a.5.5 0 0 1-.5.5H4.2a.5.5 0 0 1-.5-.5L3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          } label="Delete" onClick={() => setOpen(false)} danger />
        </div>,
        document.body
      )}
    </div>
  )
}


// ── ReportCard (grid view) ─────────────────────────────────────────────────────

function ReportCard({ report }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATUS_CFG[report.status] ?? STATUS_CFG['not-executed']

  return (
    <div
      data-inspector="ReportCard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? cfg.border : 'var(--border-input)'}`,
        borderRadius: 12,
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 180ms ease, box-shadow 180ms ease',
        boxShadow: hovered ? `0 0 0 3px ${cfg.border}20` : 'none',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <StatusBadge status={report.status} />
        <SchedulePill label={report.schedule} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif", lineHeight: 1.45,
        }}>
          {report.name}
        </p>
        <p style={{
          margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
        }}>
          {report.id.slice(0, 20)}…
        </p>
      </div>

      {report.trend ? (
        <p style={{
          margin: 0, fontSize: 12, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif", lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {report.trend}
        </p>
      ) : (
        <p style={{
          margin: 0, fontSize: 12, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif", fontStyle: 'italic',
        }}>
          No data yet
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {report.createdAt}
        </span>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 4,
            background: hovered ? 'var(--bg-active)' : 'transparent',
            border: hovered ? '1px solid var(--border-input)' : '1px solid transparent',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
        >
          <MoreIcon />
        </button>
      </div>
    </div>
  )
}

// ── PinnedReportCard ──────────────────────────────────────────────────────────

function PinnedReportCard({ report }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATUS_CFG[report.status] ?? STATUS_CFG['not-executed']

  return (
    <div
      data-inspector="PinnedReportCard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 340px',
        minWidth: 320,
        maxWidth: 540,
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? cfg.border : 'var(--border-input)'}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 180ms ease, box-shadow 180ms ease',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {/* ─ Header ─ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 14px 0', flexWrap: 'wrap' }}>
        <StatusBadge status={report.status} />
        <SchedulePill label={report.schedule} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap' }}>
          {report.lastRun}
        </span>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            height: 22, padding: '0 8px', borderRadius: 5,
            background: hovered ? 'var(--bg-active)' : 'transparent',
            border: '1px solid var(--border-input)',
            color: 'var(--text-secondary)', fontSize: 10.5, fontWeight: 600,
            fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
            transition: 'background 150ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          Open ↗
        </button>
      </div>

      {/* ─ Title ─ */}
      <div style={{ padding: '5px 14px 0' }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {report.name}
        </p>
      </div>

      {/* ─ Sparkline zone ─ */}
      <div style={{ padding: '8px 14px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {report.sparkLabel}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: report.sparkUp ? '#FF7056' : '#4BA373',
            fontFamily: "'Byrd', sans-serif",
          }}>
            {report.sparkDelta}&nbsp;
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', transform: report.sparkUp ? 'none' : 'rotate(180deg)' }}>
              <path d="M4 7V1M1 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <Sparkline data={report.sparkData} color={report.sparkColor} height={54} />
      </div>

      {/* ─ Stats row ─ */}
      <div style={{ display: 'flex', padding: '6px 8px' }}>
        {report.stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '4px 6px',
            borderRight: i < report.stats.length - 1 ? '1px solid var(--border-input)' : 'none',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
              fontFamily: "'Byrd', sans-serif", lineHeight: 1.2,
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: 9.5, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
              letterSpacing: '0.03em', marginTop: 2, whiteSpace: 'nowrap',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ─ Footer ─ */}
      <div style={{
        borderTop: '1px solid var(--border-input)',
        padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {report.schedule}
        </span>
        <span style={{ color: 'var(--border-default)', fontSize: 11, lineHeight: 1 }}>·</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
          <rect x="1.5" y="5" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span style={{
          fontSize: 10.5, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
          fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
        }}>
          {report.apiKey}
        </span>
      </div>
    </div>
  )
}

// ── PinnedReportsStrip ────────────────────────────────────────────────────────

function PinnedReportsStrip({ reports }) {
  if (!reports.length) return null
  return (
    <div style={{
      padding: '14px 20px 14px',
      background: 'var(--bg-canvas)',
      flexShrink: 0,
    }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{
          fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif", letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          Pinned
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: 4,
          background: 'var(--bg-active)', border: '1px solid var(--border-input)',
          fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
        }}>
          {reports.length}
        </span>
      </div>

      {/* Cards */}
      <div className="pinned-cards-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '6px 4px 10px', margin: '-6px -4px -10px' }}>
        {reports.map(r => <PinnedReportCard key={r.id} report={r} />)}
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '60px 0', flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>No reports found</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6, fontFamily: "'Byrd', sans-serif" }}>Try adjusting your filters</span>
    </div>
  )
}

// ── AG Grid column definitions ────────────────────────────────────────────────
const COL_DEFS = [
  {
    headerName: '#', width: 52, sortable: false, resizable: false,
    cellRenderer: ({ node, context }) => {
      const pinned = context.pinnedIds.has(node.data.id)
      return pinned
        ? <span style={{ color: 'var(--c100)', display: 'flex', alignItems: 'center' }}><BsPinFill size={12} /></span>
        : <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>{node.rowIndex + 1}</span>
    },
  },
  {
    headerName: 'Status', field: 'status', width: 160,
    cellRenderer: ({ value }) => <StatusBadge status={value === 'ai-generated' ? 'completed' : value} />,
  },
  {
    headerName: 'Report ID', field: 'id', width: 180,
    cellRenderer: ({ value }) => (
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
        {value.slice(0, 22)}…
      </span>
    ),
  },
  {
    headerName: 'Name', field: 'name', flex: 1,
    cellRenderer: ({ value, data }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
        {data?.status === 'ai-generated' && <AIBadge />}
      </div>
    ),
  },
  {
    headerName: 'Trend', field: 'trend', width: 300,
    cellRenderer: ({ value }) => (
      <span style={{ fontSize: 12, fontFamily: "'Byrd', sans-serif",
        color: value ? 'var(--text-secondary)' : 'var(--text-muted)',
        fontStyle: value ? 'normal' : 'italic',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value ?? 'No data yet'}
      </span>
    ),
  },
  {
    headerName: 'Schedule', field: 'schedule', width: 110,
    cellRenderer: ({ value }) => <SchedulePill label={value} />,
  },
  {
    headerName: '', width: 52, sortable: false, resizable: false,
    cellRenderer: ({ data, context }) => (
      <RowMenu isPinned={context.pinnedIds.has(data.id)} onTogglePin={() => context.togglePin(data.id)} />
    ),
  },
]

// ── ReportsPage ────────────────────────────────────────────────────────────────

export default function ReportsPage({ isMobile = false, sidebarWidth = 272, sidebarTransition, companyConfig = null }) {
  const gridRef = useRef(null)
  const [view, setView]             = useState('list')
  const [statusFilter, setStatus]   = useState('all')
  const [search, setSearch]         = useState('')
  const [pinnedIds, setPinnedIds]   = useState(new Set(DEFAULT_PINNED))
  const [isDark, setIsDark]         = useState(() => document.documentElement.dataset.theme === 'dark')

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.dataset.theme === 'dark')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const left = isMobile ? 0 : sidebarWidth

  const togglePin = useCallback((id) => {
    setPinnedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const gridContext = useMemo(() => ({ pinnedIds, togglePin }), [pinnedIds, togglePin])

  // Build pinned card objects — merge MOCK_REPORTS base data with PREVIEW_DATA
  const pinnedReports = useMemo(() =>
    [...pinnedIds]
      .map(id => {
        const base    = MOCK_REPORTS.find(r => r.id === id)
        const preview = PREVIEW_DATA[id]
        if (!base || !preview) return null
        return { ...base, ...preview }
      })
      .filter(Boolean),
  [pinnedIds])

  const counts = useMemo(() => {
    const c = { all: MOCK_REPORTS.length }
    STATUS_FILTERS.slice(1).forEach(f => {
      c[f.value] = MOCK_REPORTS.filter(r => r.status === f.value).length
    })
    return c
  }, [])

  const filtered = useMemo(() => {
    let data = MOCK_REPORTS
    if (statusFilter !== 'all') data = data.filter(r => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.id.includes(q) ||
        (r.trend ?? '').toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, search])

  return (
    <div
      data-inspector="ReportsPage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page Header — floating pill ──────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 52, flexShrink: 0,
        margin: '16px 16px 0',
        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 16,
        boxShadow: 'var(--page-header-shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>Reports</span>
          {companyConfig?.companyName && (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
              <span style={{ fontSize: 'var(--type-p13)', color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>{companyConfig.companyName}</span>
            </>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          <Badge variant="tinted" color="coral" shape="pill">
            Total Reports&nbsp;{filtered.length}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 1, padding: 3,
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            borderRadius: 8,
          }}>
            {[{ id: 'list', Icon: ListViewIcon }, { id: 'grid', Icon: GridViewIcon }].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: 5,
                  background: view === id ? 'var(--bg-active)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: view === id ? 'var(--c100)' : 'var(--text-muted)',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                <Icon active={view === id} />
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" leftIcon={<MoreIcon />} />
          <Button size="sm" leftIcon={<PlusIcon />} onClick={() => navigate('/reports/create')}>Create Report</Button>
        </div>
      </div>

      {/* ── Pinned previews ─────────────────────────────────────────────── */}
      <div style={{ marginTop: 8 }}>
        <PinnedReportsStrip reports={pinnedReports} />
      </div>

      {pinnedReports.length > 0 && (
        <div style={{ height: 1, background: 'var(--border-input)', margin: '0 16px' }} />
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {view === 'list' ? (
        <div style={{ flex: 1, overflow: 'hidden', margin: '16px 16px 16px', borderRadius: 16, border: 'var(--page-header-border)', boxShadow: 'var(--page-header-shadow)', background: 'var(--bg-sidebar)' }}>
          <AgGridReact
            ref={gridRef}
            theme={isDark ? darkTheme : lightTheme}
            className="hear-grid"
            rowData={filtered}
            columnDefs={COL_DEFS}
            defaultColDef={DEFAULT_COL_DEF}
            rowHeight={44}
            headerHeight={38}
            suppressCellFocus
            context={gridContext}
            getRowId={p => p.data.id}
            noRowsOverlayComponent={EmptyState}
          />
        </div>
      ) : (
        <div className="smooth-scroll" style={{
          flex: 1, overflowY: 'auto',
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
          alignContent: 'start',
        }}>
          {filtered.length === 0
            ? <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}><EmptyState /></div>
            : filtered.map(r => <ReportCard key={r.id} report={r} />)
          }
        </div>
      )}
    </div>
  )
}
