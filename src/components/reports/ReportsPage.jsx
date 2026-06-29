import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { BsPinFill, BsPin } from 'react-icons/bs'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import PageHeader from '../PageHeader.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

  const dotLeft = `${(lx / W) * 100}%`
  const dotTop  = `${(ly / H) * 100}%`

  return (
    <div style={{ position: 'relative', height }}>
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
      <div style={{
        position: 'absolute', left: dotLeft, top: dotTop,
        width: 14, height: 14, borderRadius: '50%',
        background: color, opacity: 0.18,
        transform: 'translate(-50%, -50%)',
        animation: 'spark-pulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: dotLeft, top: dotTop,
        width: 8, height: 8, borderRadius: '50%',
        background: color, transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

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

const DEFAULT_PINNED = [
  '694d64ceefa95f9cc2ababdb3',
  '6942b63cfd8049b0c779c75b',
  '694265261dcb88436adfcac5',
]

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

// ── Status atoms ───────────────────────────────────────────────────────────────

const STATUS_DOT_COLOR = {
  'ai-generated': 'var(--c100)',
  'running':      '#3B82F6',
  'completed':    'var(--g100)',
  'failed':       '#DC2626',
  'not-executed': 'var(--border-default)',
}

function StatusDot({ status }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%',
      background: STATUS_DOT_COLOR[status] ?? 'var(--border-default)',
      flexShrink: 0, display: 'inline-block',
    }} />
  )
}

function AIBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(255,112,86,0.12)', border: '1px solid rgba(255,112,86,0.28)',
      color: 'var(--c100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
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
      letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
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
      letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
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

function SchedulePill({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 20, padding: '0 8px', borderRadius: 4,
      background: 'var(--bg-active)', border: '1px solid var(--border-input)',
      color: 'var(--text-muted)', fontSize: 10, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif",
      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  const [on, setOn] = useState(value ?? true)
  function handleClick(e) {
    e.stopPropagation()
    const next = !on
    setOn(next)
    onChange?.(next)
  }
  return (
    <button
      onClick={handleClick}
      style={{
        position: 'relative',
        width: 32, height: 18, borderRadius: 9,
        background: on ? 'var(--b100)' : 'var(--border-default)',
        border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
        transition: 'background 200ms ease',
        boxShadow: on ? '0 0 0 3px rgba(23,121,247,0.12)' : 'none',
        outline: 'none',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2, left: on ? 14 : 2,
        width: 14, height: 14, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        transition: 'left 180ms cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </button>
  )
}

// ── Status filter tabs ─────────────────────────────────────────────────────────

function StatusTabs({ active, onChange, counts }) {
  return (
    <div className="smooth-scroll" style={{ display: 'flex', gap: 2, flexShrink: 1, overflowX: 'auto', minWidth: 0 }}>
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

// ── ReportRow (accordion item) ────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--text-muted)',
      fontFamily: "'Byrd', sans-serif",
    }}>
      {children}
    </span>
  )
}

function ReportRow({ report, isOpen, onToggle, isPinned, onTogglePin }) {
  const showStatusBadge = report.status === 'failed' || report.status === 'not-executed'
  const defaultOn = report.status !== 'failed' && report.status !== 'not-executed'

  return (
    <div data-report-id={report.id} style={{
      background: 'var(--bg-card)',
      border: `1px solid ${isOpen ? 'var(--border-default)' : 'var(--border-input)'}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
      boxShadow: isOpen ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
    }}>
      {/* ── Collapsed header ── */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 14px', height: 44, minWidth: 0,
          cursor: 'pointer', flexWrap: 'nowrap', overflow: 'hidden',
          background: 'transparent',
          transition: 'background 120ms ease',
          userSelect: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ChevronIcon open={isOpen} />
        </span>
        <StatusDot status={report.status} />
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: report.status === 'not-executed' ? 'var(--text-muted)' : 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          flexShrink: 1, minWidth: 0,
        }}>
          {report.name}
        </span>
        {report.status === 'ai-generated' && <AIBadge />}
        <SchedulePill label={report.schedule} />
        <span style={{
          fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {report.createdAt}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {showStatusBadge && <StatusBadge status={report.status} />}
          <Toggle value={defaultOn} />
        </div>
      </div>

      {/* ── Expanded body — grid-rows animation never clips content once open ── */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 260ms ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px 16px',
          borderTop: '1px solid var(--border-input)',
          background: 'var(--bg-card)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Trend text */}
          {report.trend ? (
            <p style={{
              margin: 0, fontSize: 13, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif", lineHeight: 1.55,
            }}>
              {report.trend}
            </p>
          ) : (
            <p style={{
              margin: 0, fontSize: 12, color: 'var(--text-muted)',
              fontFamily: "'Byrd', sans-serif", fontStyle: 'italic',
            }}>
              No data yet — this report hasn't been executed.
            </p>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Schedule</FieldLabel>
              <SchedulePill label={report.schedule} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Created</FieldLabel>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
                {report.createdAt}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Status</FieldLabel>
              <StatusBadge status={report.status} />
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            paddingTop: 12, borderTop: '1px solid var(--border-input)',
            flexWrap: 'wrap',
          }}>
            <Button size="sm" onClick={() => navigate(`/reports/${report.id}`)}>
              ↗ Open Report
            </Button>
            <Button variant="ghost" size="sm">↻ Re-run</Button>
            <Button variant="ghost" size="sm">⧉ Duplicate</Button>
            <button
              onClick={e => { e.stopPropagation(); onTogglePin() }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 10px', borderRadius: 6,
                background: isPinned ? 'rgba(23,121,247,0.07)' : 'transparent',
                border: `1px solid ${isPinned ? 'rgba(23,121,247,0.22)' : 'var(--border-input)'}`,
                color: isPinned ? 'var(--b100)' : 'var(--text-secondary)',
                fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
                cursor: 'pointer', transition: 'all 150ms ease',
              }}
            >
              {isPinned ? <BsPinFill size={11} /> : <BsPin size={11} />}
              {isPinned ? 'Pinned' : 'Pin'}
            </button>
            <div style={{ flex: 1 }} />
            <button style={{
              display: 'inline-flex', alignItems: 'center',
              height: 28, padding: '0 10px', borderRadius: 6,
              background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)',
              color: '#DC2626', fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
              cursor: 'pointer',
            }}>
              Delete
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

// ── ReportCard (grid view) ─────────────────────────────────────────────────────

function ReportCard({ report }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATUS_CFG[report.status] ?? STATUS_CFG['not-executed']

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? cfg.border : 'var(--border-input)'}`,
        borderRadius: 12, padding: '16px', cursor: 'pointer',
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
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.45 }}>
          {report.name}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {report.id.slice(0, 20)}…
        </p>
      </div>
      {report.trend ? (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {report.trend}
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", fontStyle: 'italic' }}>
          No data yet
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>{report.createdAt}</span>
        <button onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 4, background: hovered ? 'var(--bg-active)' : 'transparent', border: hovered ? '1px solid var(--border-input)' : '1px solid transparent', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'background 150ms ease, border-color 150ms ease' }}>
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 340px', minWidth: 320, maxWidth: 540,
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? cfg.border : 'var(--border-input)'}`,
        borderRadius: 12, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'border-color 180ms ease, box-shadow 180ms ease',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 14px 0' }}>
        <StatusBadge status={report.status} />
        <SchedulePill label={report.schedule} />
        <div style={{ flex: 1 }} />
        <button onClick={e => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 22, padding: '0 8px', borderRadius: 5, background: hovered ? 'var(--bg-active)' : 'transparent', border: '1px solid var(--border-input)', color: 'var(--text-secondary)', fontSize: 10.5, fontWeight: 600, fontFamily: "'Byrd', sans-serif", cursor: 'pointer', transition: 'background 150ms ease' }}>
          Open ↗
        </button>
      </div>
      <div style={{ padding: '8px 14px 0' }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {report.name}
        </p>
      </div>
      <div style={{ padding: '10px 14px 6px' }}>
        <Sparkline data={report.sparkData} color={report.sparkColor} height={52} />
      </div>
      <div style={{ display: 'flex', padding: '4px 8px 14px' }}>
        {report.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '6px 8px', borderRight: i < report.stats.length - 1 ? '1px solid var(--border-input)' : 'none' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.2 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginTop: 3, whiteSpace: 'nowrap' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PinnedReportsStrip({ reports }) {
  if (!reports.length) return null
  return (
    <div style={{ padding: '14px 20px 14px', background: 'var(--bg-canvas)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", letterSpacing: '0.07em', textTransform: 'uppercase' }}>Pinned</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, background: 'var(--bg-active)', border: '1px solid var(--border-input)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {reports.length}
        </span>
      </div>
      <div className="pinned-cards-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '6px 4px 10px', margin: '-6px -4px -10px' }}>
        {reports.map(r => <PinnedReportCard key={r.id} report={r} />)}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>No reports found</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6, fontFamily: "'Byrd', sans-serif" }}>Try adjusting your filters</span>
    </div>
  )
}

// ── ReportsPage ────────────────────────────────────────────────────────────────

export default function ReportsPage({ isMobile = false, sidebarWidth = 272, sidebarTransition, companyConfig = null }) {
  const [view, setView]           = useState('list')
  const [statusFilter, setStatus] = useState('all')
  const [search, setSearch]       = useState('')
  const [pinnedIds, setPinnedIds] = useState(new Set(DEFAULT_PINNED))
  const [openId, setOpenId]       = useState(null)
  const listRef                   = useRef(null)

  const left = isMobile ? 0 : sidebarWidth

  const togglePin = useCallback((id) => {
    setPinnedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

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

  function handleToggleOpen(id) {
    setOpenId(prev => prev === id ? null : id)
  }

  // After expand animation completes, scroll container so the full expanded row is visible
  useEffect(() => {
    if (!openId || !listRef.current) return
    const timer = setTimeout(() => {
      const container = listRef.current
      const el = container.querySelector(`[data-report-id="${openId}"]`)
      if (!el) return
      const elBottom = el.getBoundingClientRect().bottom
      const containerBottom = container.getBoundingClientRect().bottom
      if (elBottom > containerBottom) {
        container.scrollBy({ top: elBottom - containerBottom + 24, behavior: 'smooth' })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [openId])

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
      {/* ── Page Header ── */}
      <PageHeader
        title="Reports"
        crumbs={companyConfig?.companyName ? [companyConfig.companyName] : []}
        badge={<Badge variant="tinted" color="coral" shape="pill">Total Reports&nbsp;{filtered.length}</Badge>}
        actions={
          <>
            <div style={{ display: 'flex', gap: 1, padding: 3, background: 'var(--bg-canvas)', border: '1px solid var(--border-input)', borderRadius: 8 }}>
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
            <Button size="sm" leftIcon={<PlusIcon />} onClick={() => navigate('/reports/create')}>Create Report</Button>
          </>
        }
      />


      {/* ── Content ── */}
      {view === 'list' ? (
        <div style={{
          flex: 1, overflow: 'hidden', minHeight: 0,
          margin: '16px 16px 16px',
          borderRadius: 16,
          border: 'var(--page-header-border)',
          boxShadow: 'var(--page-header-shadow)',
          background: 'var(--bg-sidebar)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-input)',
            flexShrink: 0, flexWrap: 'nowrap', overflow: 'hidden',
          }}>
            <StatusTabs active={statusFilter} onChange={setStatus} counts={counts} />
            <div style={{ flex: 1 }} />
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 30, padding: '0 10px',
              background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
              borderRadius: 8,
            }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}><SearchIcon /></span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reports…"
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                  width: 160,
                }}
              />
            </div>
          </div>

          {/* Accordion list */}
          <div ref={listRef} className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '12px 14px 32px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map(r => (
                <ReportRow
                  key={r.id}
                  report={r}
                  isOpen={openId === r.id}
                  onToggle={() => handleToggleOpen(r.id)}
                  isPinned={pinnedIds.has(r.id)}
                  onTogglePin={() => togglePin(r.id)}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="smooth-scroll" style={{
          flex: 1, overflowY: 'auto', padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12, alignContent: 'start',
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
