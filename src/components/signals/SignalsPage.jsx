import { useState, useCallback, useMemo } from 'react'
import CreateSignalPage from './CreateSignalPage.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

import Badge from '../Badge.jsx'
import Button from '../Button.jsx'

// ── Icons ─────────────────────────────────────────────────────────────────────

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

function SparkleIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
      <path d="M5 0.5L5.9 3.8L9 5L5.9 6.2L5 9.5L4.1 6.2L1 5L4.1 3.8L5 0.5Z" fill="currentColor" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1.5L2 3.5v3c0 2.8 2 4.7 4.5 5.5C9 11.2 11 9.3 11 6.5v-3L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function RunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M3.5 2.5l7 4-7 4v-8z" fill="currentColor" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2 10.5V12h1.5l5-5L7 5.5l-5 5zM12.3 3.3a1 1 0 0 0 0-1.4l-.9-.9a1 1 0 0 0-1.4 0L9 2l2 2 1.3-1.3-.7.6z" fill="currentColor" />
    </svg>
  )
}

function CloneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ViewIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 7A5.5 5.5 0 1 0 4 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M1.5 3v3.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4.5V7l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG = {
  active:    { label: 'Active',    color: 'green'  },
  triggered: { label: 'Triggered', color: 'coral'  },
  paused:    { label: 'Paused',    color: 'horizon' },
  error:     { label: 'Error',     color: 'cobalt'  },
}

const STATUS_DOT_COLOR = {
  active:    'var(--g100)',
  triggered: 'var(--c100)',
  paused:    'var(--border-default)',
  error:     '#DC2626',
}

const STATUS_FILTERS = [
  { value: 'all',       label: 'All'       },
  { value: 'active',    label: 'Active'    },
  { value: 'triggered', label: 'Triggered' },
  { value: 'paused',    label: 'Paused'    },
  { value: 'error',     label: 'Error'     },
]

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_SIGNALS = [
  { id: '1f0254bf-00000000b4c5', name: 'Agent Introduction Engine',         context: 'Evaluates the communication style of an enterprise customer on a call in a commercial relationship', createdAt: '12/01/2025 11:36:26', autoProcess: true,  executions: 14, status: 'active',    source: 'ai'     },
  { id: '2a3b4c5d-00000000c6d7', name: 'Billing Dispute Classifier',        context: 'Detects billing-related complaints and routes them to the correct escalation path automatically',     createdAt: '12/02/2025 09:14:52', autoProcess: true,  executions: 31, status: 'triggered', source: 'ai'     },
  { id: '3c4d5e6f-00000000d8e9', name: 'Active Data Source Engine',         context: 'Monitors active data pipeline connections and alerts on unexpected latency or dropout events',         createdAt: '12/03/2025 14:07:33', autoProcess: false, executions: 8,  status: 'paused',   source: 'system' },
  { id: '4d5e6f70-00000000e9f0', name: 'Junk Filter Separator',             context: 'Isolates and quarantines non-productive call segments for downstream analytics cleansing',            createdAt: '12/04/2025 10:55:18', autoProcess: true,  executions: 22, status: 'active',   source: null     },
  { id: '5e6f7081-00000000f0a1', name: 'Escalation Spike Detector',         context: 'Surfaces abnormal escalation frequency within a 24-hour window against 30-day rolling baseline',     createdAt: '12/05/2025 08:22:44', autoProcess: true,  executions: 7,  status: 'triggered', source: 'ai'     },
  { id: '6f708192-000000000b1c', name: 'CSAT Drop Alert',                   context: 'Triggers when average CSAT score drops more than 8 percentage points in any rolling 7-day window',   createdAt: '12/06/2025 16:43:09', autoProcess: true,  executions: 5,  status: 'active',   source: 'system' },
  { id: '70819203-000000001c2d', name: 'Churn Risk Signal',                 context: 'Identifies high-value customers exhibiting churn-predictive language across recent call history',     createdAt: '12/07/2025 11:18:57', autoProcess: false, executions: 19, status: 'paused',   source: 'ai'     },
  { id: '819203a4-000000002d3e', name: 'Compliance Keyword Monitor',        context: 'Flags calls containing regulated terms that require mandatory disclosure or review under policy',     createdAt: '12/08/2025 13:36:21', autoProcess: true,  executions: 44, status: 'active',   source: 'system' },
  { id: '9203a4b5-000000003e4f', name: 'Peak Hour Staffing Signal',         context: 'Predicts understaffing risk 90 minutes in advance based on inbound volume trend and AHT patterns',  createdAt: '12/09/2025 07:51:30', autoProcess: true,  executions: 26, status: 'active',   source: null     },
  { id: 'a3b4c5d6-000000004f50', name: 'Agent Silence Pattern Detector',    context: 'Detects unusually long silence periods correlated with agent disengagement or knowledge gaps',       createdAt: '12/10/2025 15:09:44', autoProcess: false, executions: 11, status: 'error',    source: 'ai'     },
  { id: 'b4c5d6e7-000000005061', name: 'New Product Mention Tracker',       context: 'Captures unsolicited product mentions by customers to surface organic demand and feedback signals',   createdAt: '12/11/2025 09:27:16', autoProcess: true,  executions: 38, status: 'active',   source: 'system' },
  { id: 'c5d6e7f8-000000006172', name: 'Repeat Caller Identifier',          context: 'Surfaces customers who have contacted support more than three times in a 14-day rolling window',     createdAt: '12/12/2025 12:44:08', autoProcess: true,  executions: 17, status: 'triggered', source: null     },
  { id: 'd6e7f809-000000007283', name: 'Resolution Rate Anomaly',           context: 'Alerts when same-day resolution rate falls below the agreed SLA threshold for any queue',            createdAt: '12/13/2025 10:33:55', autoProcess: true,  executions: 9,  status: 'active',   source: 'ai'     },
  { id: 'e7f8091a-000000008394', name: 'Sentiment Reversal Signal',         context: 'Detects mid-call sentiment reversals (positive→negative) that correlate with agent script deviations', createdAt: '12/14/2025 14:22:39', autoProcess: false, executions: 6, status: 'paused',   source: 'system' },
  { id: 'f809102b-0000000094a5', name: 'Upsell Opportunity Detector',       context: 'Surfaces calls where customer intent signals indicate openness to upgrade or add-on product offers',  createdAt: '12/15/2025 08:47:22', autoProcess: true,  executions: 51, status: 'active',   source: null     },
]

// ── Atoms ─────────────────────────────────────────────────────────────────────

function StatusDot({ status }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%',
      background: STATUS_DOT_COLOR[status] ?? 'var(--border-default)',
      flexShrink: 0, display: 'inline-block',
    }} />
  )
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status]
  if (!cfg) return null
  return <Badge variant="tinted" color={cfg.color}>{cfg.label}</Badge>
}

function SourceBadge({ source }) {
  if (source === 'ai') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(255,112,86,0.12)', border: '1px solid rgba(255,112,86,0.28)',
      color: 'var(--c100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <SparkleIcon /> AI
    </span>
  )
  if (source === 'system') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(23,121,247,0.10)', border: '1px solid rgba(23,121,247,0.25)',
      color: 'var(--b100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <ShieldIcon /> System
    </span>
  )
  return null
}

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
      title={on ? 'Auto Process: ON' : 'Auto Process: OFF'}
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
              fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
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

// ── SignalRow (accordion item) ─────────────────────────────────────────────────

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

function ActionBtn({ onClick, children, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 28, padding: '0 10px', borderRadius: 6,
        background: danger
          ? (hov ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.06)')
          : (hov ? 'var(--bg-active)' : 'transparent'),
        border: danger ? '1px solid rgba(220,38,38,0.22)' : '1px solid var(--border-input)',
        color: danger ? '#DC2626' : 'var(--text-secondary)',
        fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        cursor: 'pointer', transition: 'background 120ms ease',
      }}
    >
      {children}
    </button>
  )
}

function SignalRow({ signal, isOpen, onToggle, onEdit, onDelete, onToggleAutoProcess }) {
  const showStatusBadge = signal.status === 'error' || signal.status === 'paused'

  return (
    <div style={{
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
          padding: '0 14px', height: 44,
          cursor: 'pointer',
          background: isOpen ? 'var(--bg-active)' : 'transparent',
          transition: 'background 120ms ease',
          userSelect: 'none',
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--bg-active)' }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ChevronIcon open={isOpen} />
        </span>
        <StatusDot status={signal.status} />
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 600,
          color: signal.status === 'paused' ? 'var(--text-muted)' : 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {signal.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {signal.source && <SourceBadge source={signal.source} />}
          {showStatusBadge && <StatusBadge status={signal.status} />}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap' }}>
            {signal.executions} runs
          </span>
          <Toggle
            value={signal.autoProcess}
            onChange={next => onToggleAutoProcess?.(signal.id, next)}
          />
        </div>
      </div>

      {/* ── Expanded body ── */}
      <div style={{
        maxHeight: isOpen ? 500 : 0,
        overflow: 'hidden',
        transition: 'max-height 260ms ease',
      }}>
        <div style={{
          padding: '14px 16px 16px',
          borderTop: '1px solid var(--border-input)',
          background: 'var(--bg-canvas)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Context */}
          <p style={{
            margin: 0, fontSize: 13, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif", lineHeight: 1.55,
          }}>
            {signal.context}
          </p>

          {/* Fields */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Status</FieldLabel>
              <StatusBadge status={signal.status} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Created</FieldLabel>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
                {signal.createdAt}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>Executions</FieldLabel>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", fontWeight: 600 }}>
                {signal.executions}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel>ID</FieldLabel>
              <span style={{ fontSize: 11, color: 'var(--b100)', fontFamily: "'Byrd', sans-serif", fontWeight: 500, letterSpacing: '0.01em' }}>
                {signal.id}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            paddingTop: 12, borderTop: '1px solid var(--border-input)',
            flexWrap: 'wrap',
          }}>
            <Button size="sm" leftIcon={<RunIcon />}>Run</Button>
            <ActionBtn onClick={onEdit}><EditIcon /> Edit</ActionBtn>
            <ActionBtn><CloneIcon /> Clone</ActionBtn>
            <ActionBtn><ViewIcon /> View</ActionBtn>
            <ActionBtn><HistoryIcon /> History</ActionBtn>
            <div style={{ flex: 1 }} />
            <ActionBtn danger onClick={() => onDelete?.(signal.id)}>Delete</ActionBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>No signals found</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6, fontFamily: "'Byrd', sans-serif" }}>Try adjusting your filters</span>
    </div>
  )
}

// ── SignalsPage ────────────────────────────────────────────────────────────────

export default function SignalsPage({ isMobile, sidebarWidth = 272, sidebarTransition }) {
  const [editingSignal, setEditingSignal] = useState(null)
  const [signals, setSignals]             = useState(MOCK_SIGNALS)
  const [statusFilter, setStatusFilter]   = useState('all')
  const [searchText, setSearchText]       = useState('')
  const [openId, setOpenId]               = useState(null)

  const left = isMobile ? 0 : sidebarWidth

  const onToggleAutoProcess = useCallback((id, next) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, autoProcess: next } : s))
  }, [])

  const onDelete = useCallback((id) => {
    setSignals(prev => prev.filter(s => s.id !== id))
    setOpenId(prev => prev === id ? null : prev)
  }, [])

  const counts = useMemo(() => ({
    all:       signals.length,
    active:    signals.filter(s => s.status === 'active').length,
    triggered: signals.filter(s => s.status === 'triggered').length,
    paused:    signals.filter(s => s.status === 'paused').length,
    error:     signals.filter(s => s.status === 'error').length,
  }), [signals])

  const filtered = useMemo(() => signals.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (searchText) {
      const q = searchText.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.context.toLowerCase().includes(q) || s.id.includes(q)
    }
    return true
  }), [signals, statusFilter, searchText])

  function handleToggleOpen(id) {
    setOpenId(prev => prev === id ? null : id)
  }

  if (editingSignal) {
    return (
      <CreateSignalPage
        sidebarWidth={sidebarWidth}
        sidebarTransition={sidebarTransition}
        editSignal={editingSignal}
        onBack={() => setEditingSignal(null)}
      />
    )
  }

  return (
    <div
      data-inspector="SignalsPage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page Header ── */}
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
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Signals
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          <Badge variant="tinted" color="teal" shape="pill">
            Total signals&nbsp;{signals.length}
          </Badge>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          {/* Quota indicator */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 22, padding: '0 8px', borderRadius: 999,
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.28)',
            flexShrink: 0,
          }}>
            <span style={{ width: 28, height: 3, borderRadius: 99, background: 'rgba(220,38,38,0.25)', overflow: 'hidden', flexShrink: 0 }}>
              <span style={{ display: 'block', height: '100%', width: '90%', background: '#DC2626', borderRadius: 99 }} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap' }}>
              9 / 10
            </span>
          </span>
        </div>
        <Button variant="primary" size="sm" leftIcon={<PlusIcon />} onClick={() => navigate('/signals/create')}>
          Create
        </Button>
      </div>

      {/* ── Content panel ── */}
      <div style={{
        flex: 1, overflow: 'hidden',
        margin: '16px 16px 16px',
        borderRadius: 16,
        border: 'var(--page-header-border)',
        boxShadow: 'var(--page-header-shadow)',
        background: 'var(--bg-sidebar)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-input)',
          flexShrink: 0, flexWrap: 'wrap', gap: 8,
        }}>
          <StatusTabs active={statusFilter} onChange={setStatusFilter} counts={counts} />
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 30, padding: '0 10px',
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            borderRadius: 8,
          }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex' }}><SearchIcon /></span>
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search signals…"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                width: 160,
              }}
            />
          </div>
        </div>

        {/* Accordion list */}
        <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map(s => (
              <SignalRow
                key={s.id}
                signal={s}
                isOpen={openId === s.id}
                onToggle={() => handleToggleOpen(s.id)}
                onEdit={() => setEditingSignal(s)}
                onDelete={onDelete}
                onToggleAutoProcess={onToggleAutoProcess}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
