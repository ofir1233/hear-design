import { useState, useMemo } from 'react'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'

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
    <span style={{
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
    <span style={{
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
    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
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

// ── Table header ───────────────────────────────────────────────────────────────

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }

function TableHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      height: 36, flexShrink: 0,
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-input)',
      borderLeft: '3px solid transparent',
      paddingLeft: 17,
    }}>
      <span style={{ ...TH, width: 32, flexShrink: 0 }}>#</span>
      <span style={{ ...TH, width: 148, flexShrink: 0, paddingRight: 12 }}>Status</span>
      <span style={{ ...TH, width: 176, flexShrink: 0, paddingRight: 16 }}>Report ID</span>
      <span style={{ ...TH, flex: 1, minWidth: 0, paddingRight: 16 }}>Name</span>
      <span style={{ ...TH, width: 280, flexShrink: 0, paddingRight: 16 }}>Trend</span>
      <span style={{ ...TH, width: 96, flexShrink: 0, paddingRight: 8 }}>Schedule</span>
      <span style={{ width: 40, flexShrink: 0 }} />
    </div>
  )
}

// ── ReportRow (list view) ──────────────────────────────────────────────────────

function ReportRow({ report, index }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATUS_CFG[report.status] ?? STATUS_CFG['not-executed']

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center',
        height: 52, position: 'relative',
        borderBottom: '1px solid var(--border-input)',
        borderLeft: `3px solid ${hovered ? cfg.border : 'transparent'}`,
        background: hovered ? 'var(--bg-active)' : 'transparent',
        transition: 'background 120ms ease, border-left-color 120ms ease',
        cursor: 'pointer',
        paddingLeft: 17,
      }}
    >
      {/* Row # */}
      <span style={{ width: 32, flexShrink: 0, fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
        {index + 1}
      </span>

      {/* Status */}
      <div style={{ width: 148, flexShrink: 0, paddingRight: 12 }}>
        <StatusBadge status={report.status} />
      </div>

      {/* Report ID */}
      <span style={{
        width: 176, flexShrink: 0, paddingRight: 16,
        fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {report.id.slice(0, 22)}…
      </span>

      {/* Name */}
      <span style={{
        flex: 1, minWidth: 0, paddingRight: 16,
        fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {report.name}
      </span>

      {/* Trend */}
      <span style={{
        width: 280, flexShrink: 0, paddingRight: 16,
        fontSize: 12, color: report.trend ? 'var(--text-secondary)' : 'var(--text-muted)',
        fontFamily: "'Byrd', sans-serif",
        fontStyle: report.trend ? 'normal' : 'italic',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {report.trend ?? 'No data yet'}
      </span>

      {/* Schedule */}
      <div style={{ width: 96, flexShrink: 0, paddingRight: 8 }}>
        <SchedulePill label={report.schedule} />
      </div>

      {/* More */}
      <div style={{
        width: 40, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 120ms ease',
      }}>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 5,
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}
        >
          <MoreIcon />
        </button>
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
        borderTop: `3px solid ${cfg.border}`,
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

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>No reports found</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6, fontFamily: "'Byrd', sans-serif" }}>Try adjusting your filters</span>
    </div>
  )
}

// ── ReportsPage ────────────────────────────────────────────────────────────────

export default function ReportsPage({ isMobile = false, sidebarWidth = 272, sidebarTransition, companyConfig = null }) {
  const [view, setView]             = useState('list')
  const [statusFilter, setStatus]   = useState('all')
  const [search, setSearch]         = useState('')

  const left = isMobile ? 0 : sidebarWidth

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
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
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
          <Button size="sm" leftIcon={<PlusIcon />}>Create Report</Button>
        </div>
      </div>

      {/* ── Filter Strip ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 48, flexShrink: 0,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
        overflowX: 'auto',
      }}>
        <StatusTabs active={statusFilter} onChange={setStatus} counts={counts} />

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 30, padding: '0 10px',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
          borderRadius: 6, flexShrink: 0, width: 200,
        }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 'var(--type-p14)', color: 'var(--text-primary)',
              fontFamily: "'Byrd', sans-serif",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                display: 'flex', alignItems: 'center', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, fontSize: 15, lineHeight: 1,
              }}
            >×</button>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {view === 'list' ? (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TableHeader />
          <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filtered.length === 0
              ? <EmptyState />
              : filtered.map((r, i) => <ReportRow key={r.id} report={r} index={i} />)
            }
          </div>
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
