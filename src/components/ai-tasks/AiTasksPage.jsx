import { useState } from 'react'
import {
  BsLightningChargeFill, BsGearFill, BsCalendarCheckFill,
  BsClockFill, BsXCircleFill, BsXLg, BsCpuFill, BsCheckCircleFill,
  BsPatchCheckFill, BsHandThumbsUpFill, BsHandThumbsDownFill, BsPencilFill,
  BsSearch, BsArrowRepeat, BsFunnel, BsChevronDown, BsChevronUp, BsLightbulbFill,
  BsCollectionFill, BsFileEarmarkBarGraphFill, BsMegaphoneFill, BsBellFill, BsClipboardFill,
  BsPlusLg, BsTrashFill, BsCheck2,
} from 'react-icons/bs'
import Badge from '../Badge.jsx'
import PageHeader from '../PageHeader.jsx'

// ── Icons (react-icons/bs) ──────────────────────────────────────────────────────

const SearchIcon  = () => <BsSearch size={13} />
const RefreshIcon = () => <BsArrowRepeat size={14} />
const FilterIcon  = () => <BsFunnel size={14} />
const ChevronDown = () => <BsChevronDown size={12} />
const ChevronUp   = () => <BsChevronUp size={12} />
const BulbIcon    = () => <BsLightbulbFill size={12} />

// ── Mock data ──────────────────────────────────────────────────────────────────

const PENDING_TASKS = [
  {
    id: 'task-1', title: 'Daily schedule fix', ops: 2,
    desc: 'AI detected a scheduling conflict in the Daily Alerts Report and proposed a revised execution time and updated query prompt.',
    entityType: 'report', entity: 'Report',
    user: 'Anouk', userInitial: 'A', ago: '2d ago',
    state: 'pending',
  },
  {
    id: 'task-2', title: 'KYC signal revision', ops: 1,
    desc: 'Suggested revision to the Interfering w/ KYC monitor query to reduce false positives significantly.',
    entityType: 'signal', entity: 'Signal',
    user: 'Yossi M.', userInitial: 'Y', ago: '5h ago',
    state: 'pending',
  },
  {
    id: 'task-3', title: 'Monthly report update', ops: 3,
    desc: 'Cadence and scope adjustments for the monthly trends report.',
    entityType: 'report', entity: 'Report',
    user: 'Anouk', userInitial: 'A', ago: '1h ago',
    state: 'processing',
  },
  {
    id: 'task-4', title: 'Escalation tracker fix', ops: 1,
    desc: 'Query correction for the escalation tracking signal.',
    entityType: 'signal', entity: 'Signal',
    user: 'Yossi M.', userInitial: 'Y', ago: '3d ago',
    state: 'failed',
  },
  {
    id: 'task-5', title: 'Churn alert threshold tune', ops: 2,
    desc: 'AI proposes raising the churn-risk alert threshold to cut noisy notifications during peak hours.',
    entityType: 'alert', entity: 'Alert',
    user: 'Anouk', userInitial: 'A', ago: '6h ago',
    state: 'pending',
  },
  {
    id: 'task-6', title: 'Workspace config sync', ops: 1,
    desc: 'Align project settings with the latest org defaults after the recent workspace migration.',
    entityType: 'general', entity: 'General',
    user: 'Yossi M.', userInitial: 'Y', ago: '1d ago',
    state: 'pending',
  },
]

const LOG_ROWS = [
  // kind: 'EVENT' = operational events · 'IMPROVEMENT' = decisions on AI system-improvement suggestions
  { id: 'log-1', kind: 'EVENT',       status: 'completed', title: 'Peak hour detection — weekly',       desc: 'Report updated with new peak hour window. Staffing recommendations attached.',    user: 'Anouk',    userInitial: 'A', ago: '1d ago',  ops: 2 },
  { id: 'log-2', kind: 'IMPROVEMENT', status: 'approved',  title: 'Distressed client signal update',    desc: 'Query prompt revised to catch new linguistic patterns.',                           user: 'Yossi M.', userInitial: 'Y', ago: '2d ago',  ops: 1 },
  { id: 'log-3', kind: 'IMPROVEMENT', status: 'rejected',  title: 'Legal & Regulatory schedule change', desc: 'Proposed schedule moved to off-hours — rejected, frequency kept as-is.',           user: 'Anouk',    userInitial: 'A', ago: '3d ago',  ops: 1 },
  { id: 'log-4', kind: 'EVENT',       status: 'completed', title: 'Information Violation threshold',    desc: 'Alert sensitivity increased from 0.7 to 0.82 based on false positive rate.',      user: 'Yossi M.', userInitial: 'Y', ago: '5d ago',  ops: 3 },
  { id: 'log-5', kind: 'EVENT',       status: 'approved',  title: 'Daily trends report revision',       desc: 'Added week-over-week comparison and updated cadence to include Fridays.',          user: 'Anouk',    userInitial: 'A', ago: '6d ago',  ops: 2, fromImprovement: true },
  { id: 'log-6', kind: 'EVENT',       status: 'completed', title: 'Third Party monitor tuning',         desc: 'Sensitivity threshold lowered after 2-week review period confirmed accuracy.',     user: 'Anouk',    userInitial: 'A', ago: '8d ago',  ops: 1 },
  { id: 'log-7', kind: 'IMPROVEMENT', status: 'completed', title: 'Sentiment model threshold tuning',   desc: 'Adjusted negative-sentiment cutoff after a 2-week accuracy review.',                user: 'Anouk',    userInitial: 'A', ago: '4d ago',  ops: 1 },
  { id: 'log-8', kind: 'IMPROVEMENT', status: 'approved',  title: 'Knowledge base prompt refinement',   desc: 'Retrieval prompt rewritten to cite source passages more reliably.',                user: 'Yossi M.', userInitial: 'Y', ago: '7d ago',  ops: 2 },
]

// Mode 2 — System Improvements: pending AI-proposed setup changes (≤5, 14-day lookback)
const SYSTEM_IMPROVEMENTS = [
  {
    id: 'imp-1', title: 'Refine escalation prompt', ops: 1,
    desc: 'AI proposes rewriting the escalation-detection prompt to cut false escalations after reviewing 2 weeks of misfires.',
    entityType: 'signal', entity: 'Signal',
    user: 'Anouk', userInitial: 'A', ago: '1d ago',
    state: 'pending',
  },
  {
    id: 'imp-2', title: 'Tune false-positive threshold', ops: 2,
    desc: 'Suggested raising the Compliance monitor threshold from 0.62 to 0.74 to suppress recurring false positives.',
    entityType: 'signal', entity: 'Signal',
    user: 'Yossi M.', userInitial: 'Y', ago: '3d ago',
    state: 'pending',
  },
  {
    id: 'imp-3', title: 'Consolidate duplicate reports', ops: 1,
    desc: 'AI detected two near-identical weekly reports and proposes merging them into a single scheduled run.',
    entityType: 'report', entity: 'Report',
    user: 'Anouk', userInitial: 'A', ago: '6d ago',
    state: 'processing',
  },
]

// Mode 3 — Scheduled Tasks: recurring AI tasks (read-only list)
const SCHEDULED_TASKS = [
  { id: 'sch-1', title: 'Daily Alerts Report',        cadence: 'Daily · 06:00',        nextRun: 'Tomorrow, 06:00',  entityType: 'report', enabled: true  },
  { id: 'sch-2', title: 'Weekly Trends Digest',       cadence: 'Weekly · Mon 08:00',   nextRun: 'Mon, 08:00',       entityType: 'report', enabled: true  },
  { id: 'sch-3', title: 'Monthly Compliance Review',  cadence: 'Monthly · 1st, 09:00', nextRun: 'Jul 1, 09:00',     entityType: 'report', enabled: true  },
  { id: 'sch-4', title: 'KYC Monitor Sweep',          cadence: 'Every 6 hours',        nextRun: 'Today, 18:00',     entityType: 'signal', enabled: false },
  { id: 'sch-5', title: 'Sentiment Drift Check',      cadence: 'Daily · 22:00',        nextRun: 'Today, 22:00',     entityType: 'signal', enabled: true  },
]

const CHANGE_GROUPS = [
  {
    id: 'cg-1',
    entityType: 'REPORT',
    actionBadge: 'Update',
    entityName: 'Daily Alerts Report (Conversion)',
    added: 0, updated: 2, deleted: 0,
    reasoning: 'Duplicate entries were detected 3× in the past week due to the Monday overlap window. Deduplication via NOT EXISTS eliminates the root cause without changing report scope.',
    autoOps: ['Run the report immediately after approval', 'Send confirmation email to report owner'],
    changes: [
      { id: 'c1', type: 'updated', field: 'Scheduled Time Hour', expanded: false, oldVal: '07:00', newVal: '06:00' },
      { id: 'c2', type: 'updated', field: 'Query Prompt',        expanded: true,  oldVal: 'SELECT * FROM calls WHERE date = today AND monitor_id IN (…)', newVal: 'SELECT DISTINCT * FROM calls WHERE date = today AND monitor_id IN (…) AND NOT EXISTS (SELECT 1 FROM processed WHERE id = calls.id)' },
    ],
  },
]

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CFG = {
  completed: { label: 'Completed', bg: 'var(--badge-green-bg)',  bd: 'var(--badge-green-bd)',  color: 'var(--badge-green-text)',  dot: 'var(--g100)'  },
  approved:  { label: 'Approved',    bg: 'var(--badge-cobalt-bg)', bd: 'var(--badge-cobalt-bd)', color: 'var(--badge-cobalt-text)', dot: 'var(--b100)'  },
  rejected:  { label: 'Rejected',    bg: 'var(--badge-coral-bg)',  bd: 'var(--badge-coral-bd)',  color: 'var(--badge-coral-text)',  dot: 'var(--red100)' },
}

const ENTITY_CFG = {
  report:  { bg: 'var(--badge-green-bg)',   bd: 'var(--badge-green-bd)',   color: 'var(--badge-green-text)'   },
  signal:  { bg: 'var(--badge-lilac-bg)',   bd: 'var(--badge-lilac-bd)',   color: 'var(--badge-lilac-text)'   },
  alert:   { bg: 'var(--badge-cobalt-bg)',  bd: 'var(--badge-cobalt-bd)',  color: 'var(--badge-cobalt-text)'  },
  general: { bg: 'var(--badge-teal-bg)',    bd: 'var(--badge-teal-bd)',    color: 'var(--badge-teal-text)'    },
}

// Card icon per entity type — meaningful glyph instead of a generic mark
const ENTITY_ICON = {
  report:  { Icon: BsFileEarmarkBarGraphFill, bg: 'var(--badge-green-fill)',  bd: 'var(--badge-green-bd)',  color: 'var(--badge-green-text)'  },
  signal:  { Icon: BsMegaphoneFill,           bg: 'var(--badge-lilac-fill)',  bd: 'var(--badge-lilac-bd)',  color: 'var(--badge-lilac-text)'  },
  alert:   { Icon: BsBellFill,                bg: 'var(--badge-cobalt-fill)', bd: 'var(--badge-cobalt-bd)', color: 'var(--badge-cobalt-text)' },
  general: { Icon: BsClipboardFill,           bg: 'var(--badge-teal-fill)',   bd: 'var(--badge-teal-bd)',   color: 'var(--badge-teal-text)'   },
}

// Operation classification — create / update / delete, on foundation tokens
const CHANGE_TYPE_CFG = {
  added:   { Icon: BsPlusLg,     label: 'Added',   dot: 'var(--g100)', accent: 'var(--g100)', fill: 'var(--badge-green-fill)',  bd: 'var(--badge-green-bd)',  text: 'var(--badge-green-text)'  },
  updated: { Icon: BsPencilFill, label: 'Updated', dot: 'var(--b100)', accent: 'var(--b100)', fill: 'var(--badge-cobalt-fill)', bd: 'var(--badge-cobalt-bd)', text: 'var(--badge-cobalt-text)' },
  deleted: { Icon: BsTrashFill,  label: 'Deleted', dot: 'var(--c100)', accent: 'var(--c100)', fill: 'var(--badge-coral-fill)',  bd: 'var(--badge-coral-bd)',  text: 'var(--badge-coral-text)'  },
}

// ── Sub-components ─────────────────────────────────────────────────────────────

// Avatar — DS spec: solid color fill (hashed from name) + white initials
const AVATAR_COLORS = ['#1779F7', '#4BA373', '#FF7056', '#8E7CC3', '#E0923B']
function Avatar({ initial, name, size = 20 }) {
  const key = name || initial || '?'
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  const bg = AVATAR_COLORS[h % AVATAR_COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.max(8, Math.round(size * 0.42)), fontWeight: 700, color: '#fff',
    }}>{initial}</div>
  )
}

function EntityChip({ type, label }) {
  const cfg = ENTITY_CFG[type] || ENTITY_CFG.alert
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
      background: cfg.bg, border: `1px solid ${cfg.bd}`, color: cfg.color,
    }}>{label}</span>
  )
}

function PendingCard({ task, isSelected, onClick }) {
  const isProcessing = task.state === 'processing'
  const isFailed     = task.state === 'failed'

  return (
    <div
      onClick={() => task.state === 'pending' && onClick(task.id)}
      style={{
        background: isSelected ? 'var(--badge-cobalt-bg)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--b100)' : 'var(--border-default)'}`,
        borderRadius: 10, padding: '12px 14px',
        cursor: task.state === 'pending' ? 'pointer' : 'default',
        opacity: isProcessing ? 0.55 : 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        transition: 'border-color 150ms, background 150ms, box-shadow 150ms',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {(() => {
          const ent = ENTITY_ICON[task.entityType] || ENTITY_ICON.alert
          return <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: ent.bg, border: `1px solid ${ent.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ent.color }}><ent.Icon size={14} /></div>
        })()}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</span>
        {isFailed && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.2)', color: 'var(--red100)', flexShrink: 0 }}>
            <BsXCircleFill size={9} /> Failed · Retry
          </span>
        )}
        {isProcessing && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: 'var(--bg-active)', color: 'var(--text-muted)', flexShrink: 0 }}>
            <BsClockFill size={9} /> Processing
          </span>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{task.desc}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <EntityChip type={task.entityType} label={task.entity} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <Avatar initial={task.userInitial} name={task.user} size={18} />
            {task.user} · {task.ago}
          </div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{task.ops} operation{task.ops > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

function LogRow({ row }) {
  const cfg = STATUS_CFG[row.status]
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: cfg.bg, border: `1px solid ${cfg.bd}`, color: cfg.color }}>{cfg.label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.title}</span>
        {row.fromImprovement && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: 'var(--badge-teal-fill)', color: 'var(--t100)', whiteSpace: 'nowrap' }}>
            <BsGearFill size={9} /> From System Improvement
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{row.ago}</span>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>{row.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
          <Avatar initial={row.userInitial} name={row.user} size={18} /> {row.user}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{row.ops} operation{row.ops > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

// ── Scheduled Task row (Mode 3 — read-only) ─────────────────────────────────────

function ScheduledRow({ task }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: 'var(--badge-green-fill)', color: 'var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BsCalendarCheckFill size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <EntityChip type={task.entityType} label={task.entityType === 'report' ? 'Report' : 'Signal'} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <BsClockFill size={10} /> {task.cadence}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Next run</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{task.nextRun}</div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 999,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0, border: '1px solid currentColor',
        background: task.enabled ? 'var(--badge-green-fill)' : 'var(--bg-active)',
        color: task.enabled ? 'var(--badge-green-text)' : 'var(--text-muted)',
      }}>
        {task.enabled ? 'Enabled' : 'Paused'}
      </span>
    </div>
  )
}

// ── Approval Modal ─────────────────────────────────────────────────────────────

function ApprovalModal({ task, onClose }) {
  const [expandedChanges, setExpanded]  = useState(new Set(['c2']))
  const [groupActions, setGroupActions] = useState({})

  function toggleChange(id) {
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function setAction(groupId, action) {
    setGroupActions(prev => ({ ...prev, [groupId]: prev[groupId] === action ? null : action }))
  }

  const allDecided = CHANGE_GROUPS.every(g => groupActions[g.id])

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, transition: 'opacity 200ms' }} />

      {/* Sheet */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 700, maxWidth: '90vw',
        background: 'var(--bg-card)', display: 'flex', flexDirection: 'column',
        zIndex: 201, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        animation: 'slideIn 280ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--badge-cobalt-fill)', border: '1px solid var(--badge-cobalt-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--b100)' }}><BsCpuFill size={15} /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Waiting for your approval</span>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-active)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><BsXLg size={13} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* User row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Avatar initial="A" name="Anouk" size={24} />
            <span><strong>Anouk</strong> · Mar 10, 01:37 PM</span>
          </div>

          {/* Triggered event */}
          <div>
            <div style={sectionLabelStyle}>Triggered Event</div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Daily Alerts Report ran and detected a scheduling conflict causing overlapping executions on Monday mornings.</p>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--badge-cobalt-bg)', border: '1px solid var(--badge-cobalt-bd)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ ...sectionLabelStyle, color: 'var(--badge-cobalt-text)' }}>Summary</div>
            <p style={{ fontSize: 12, color: 'var(--badge-cobalt-text)', lineHeight: 1.6 }}>Reschedule daily report to 06:00 and update query prompt to exclude duplicate entries.</p>
          </div>

          {/* Metadata */}
          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Related User', 'Anouk'], ['Event ID', 'evt_8f3a2c…'], ['Entity ID', 'rpt_4d1b9e…']].map(([label, val]) => (
              <div key={label}>
                <div style={sectionLabelStyle}>{label}</div>
                <span style={{ fontSize: 11, fontFamily: "'SF Mono', monospace", color: 'var(--text-secondary)' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Change groups */}
          {CHANGE_GROUPS.map(group => (
            <div key={group.id} style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-default)', cursor: 'pointer' }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{group.entityType}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: 'var(--badge-cobalt-bg)', border: '1px solid var(--badge-cobalt-bd)', color: 'var(--badge-cobalt-text)' }}>{group.actionBadge}</span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{group.entityName}</span>
                <ChevronDown />
              </div>

              {/* Count chips */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['added', group.added], ['updated', group.updated], ['deleted', group.deleted]].map(([type, n]) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: CHANGE_TYPE_CFG[type].dot, flexShrink: 0 }} />{n} {CHANGE_TYPE_CFG[type].label}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{group.added + group.updated + group.deleted} Total</span>
              </div>

              {/* Change rows */}
              <div style={{ background: 'var(--bg-card)' }}>
                {group.changes.map((ch, ci) => {
                  const cfg = CHANGE_TYPE_CFG[ch.type]
                  const isExp = expandedChanges.has(ch.id)
                  return (
                    <div key={ch.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <div onClick={() => toggleChange(ch.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ width: 3, alignSelf: 'stretch', background: cfg.accent, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
                          <span style={{ flex: 1, fontSize: 11, fontFamily: "'SF Mono', monospace", color: 'var(--text-secondary)' }}>{ch.field}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 99, background: cfg.fill, border: `1px solid ${cfg.bd}`, color: cfg.text }}>{cfg.label}</span>
                          {isExp ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </div>
                      {isExp && (
                        <div style={{ padding: '10px 12px 12px 23px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-default)', display: 'flex', flexDirection: 'row', gap: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ ...sectionLabelStyle, color: 'var(--badge-coral-text)' }}>Old Value</div>
                            <div style={{ ...diffValStyle, background: 'var(--badge-coral-bg)', border: '1px solid var(--badge-coral-bd)', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{ch.oldVal}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ ...sectionLabelStyle, color: 'var(--badge-green-text)' }}>New Value</div>
                            <div style={{ ...diffValStyle, background: 'var(--badge-green-bg)', border: '1px solid var(--badge-green-bd)', color: 'var(--text-primary)' }}>{ch.newVal}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* AI Reasoning */}
              <div style={{ margin: '12px 12px 12px', background: 'var(--badge-cobalt-bg)', border: '1px solid var(--badge-cobalt-bd)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--b100)', marginBottom: 4 }}>
                  <BulbIcon /> AI Reasoning
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{group.reasoning}</p>
              </div>

              {/* Automatic operations */}
              {group.autoOps && (
                <div style={{ margin: '0 12px 12px', background: 'var(--badge-green-bg)', border: '1px solid var(--badge-green-bd)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--badge-green-text)', marginBottom: 4 }}><BsCheckCircleFill size={10} /> Automatic Operations</div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>These operations do not require approval</p>
                  {group.autoOps.map(op => (
                    <div key={op} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>
                      <BsCheck2 size={13} style={{ color: 'var(--g100)', flexShrink: 0 }} />{op}
                    </div>
                  ))}
                </div>
              )}

              {/* Per-group action buttons */}
              <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
                {[['approve', 'Approve', BsHandThumbsUpFill, 'var(--badge-green-fill)', 'var(--badge-green-bd)', 'var(--badge-green-text)'],
                  ['modify', 'Modify', BsPencilFill, 'var(--badge-cobalt-fill)', 'var(--badge-cobalt-bd)', 'var(--badge-cobalt-text)'],
                  ['decline', 'Decline', BsHandThumbsDownFill, 'var(--badge-coral-fill)', 'var(--badge-coral-bd)', 'var(--badge-coral-text)']].map(([action, label, Icon, bg, bd, color]) => {
                    const isActive = groupActions[group.id] === action
                    return (
                      <button key={action} onClick={() => setAction(group.id, action)} style={{ flex: 1, fontSize: 11, fontWeight: 600, padding: '7px 10px', borderRadius: 7, cursor: 'pointer', border: `1px solid ${isActive ? bd : 'var(--border-default)'}`, background: isActive ? bg : 'var(--bg-canvas)', color: isActive ? color : 'var(--text-secondary)', transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Icon size={12} /> {label}
                      </button>
                    )
                })}
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-default)', padding: '12px 20px', background: 'var(--bg-canvas)', flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>Select an action for each change to submit</p>
          <button style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', cursor: allDecided ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600, background: allDecided ? 'var(--b100)' : 'var(--border-default)', color: allDecided ? '#fff' : 'var(--text-muted)', transition: 'background 200ms' }}>
            Submit decisions
          </button>
        </div>
      </div>
    </>
  )
}

// ── Style constants ────────────────────────────────────────────────────────────

const sectionLabelStyle = {
  fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--text-muted)', marginBottom: 4,
}

const diffValStyle = {
  fontSize: 11, fontFamily: "'SF Mono', monospace",
  background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
  borderRadius: 6, padding: '6px 8px', color: 'var(--text-secondary)',
  whiteSpace: 'pre-wrap', lineHeight: 1.5,
}

// ── Main page ──────────────────────────────────────────────────────────────────

const VIEW_MODES = [
  { id: 'operation-requests', label: 'Operation Requests', Icon: BsLightningChargeFill, color: 'var(--b100)', tint: 'var(--badge-cobalt-fill)', bd: 'var(--badge-cobalt-bd)' },
  { id: 'system-improvements', label: 'System Improvements', Icon: BsGearFill, color: 'var(--t100)', tint: 'var(--badge-teal-fill)', bd: 'var(--badge-teal-bd)' },
  { id: 'scheduled-tasks', label: 'Scheduled Tasks', Icon: BsCalendarCheckFill, color: 'var(--g100)', tint: 'var(--badge-green-fill)', bd: 'var(--badge-green-bd)' },
]

export default function AiTasksPage({ sidebarWidth = 272, sidebarTransition = 'none' }) {
  const [viewMode, setViewMode]       = useState('operation-requests')
  const [logFilter, setLogFilter]     = useState('All')
  const [selectedTask, setSelectedTask] = useState(null)
  const [search, setSearch]           = useState('')

  // ── viewMode is the primary axis — it re-slices left list + right log + stat cards ──
  const isScheduled    = viewMode === 'scheduled-tasks'
  const isImprovements = viewMode === 'system-improvements'

  const q = search.toLowerCase()

  // Left panel — pending source swaps per mode
  const pendingSource = isImprovements ? SYSTEM_IMPROVEMENTS : PENDING_TASKS
  const pendingCount  = pendingSource.filter(t => t.state === 'pending').length
  const filteredPending = pendingSource.filter(t =>
    !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
  )
  const leftTitle = isImprovements ? 'System Improvements' : 'Awaiting Approval'
  const leftSub   = isImprovements
    ? 'AI-proposed setup changes waiting for your review.'
    : 'Operational tasks waiting for your decision.'
  const emptyPending = isImprovements ? 'No system improvements to review.' : 'No operation requests awaiting your decision.'

  // Right panel — log filtered by kind for the active mode
  const logKind = isImprovements ? 'IMPROVEMENT' : 'EVENT'
  const logSource = LOG_ROWS.filter(r => r.kind === logKind)
  const filteredLog = logSource.filter(r => {
    if (q && !r.title.toLowerCase().includes(q)) return false
    if (logFilter === 'Approved')  return r.status === 'approved'
    if (logFilter === 'Rejected')  return r.status === 'rejected'
    if (logFilter === 'Done')      return r.status === 'completed'
    return true
  })

  // Log filter cards — mini stat-cards that double as the log filter (counts re-slice per mode)
  const logFilterCards = [
    { id: 'All',      label: 'All',       Icon: BsCollectionFill,  count: logSource.length,                                        iconBg: 'var(--badge-cobalt-fill)', iconColor: 'var(--b100)'   },
    { id: 'Approved', label: 'Approved',  Icon: BsCheckCircleFill, count: logSource.filter(r => r.status === 'approved').length,   iconBg: 'var(--badge-green-fill)',  iconColor: 'var(--g100)'   },
    { id: 'Done',     label: 'Completed', Icon: BsPatchCheckFill,  count: logSource.filter(r => r.status === 'completed').length,  iconBg: 'var(--badge-teal-fill)',   iconColor: 'var(--t100)'   },
    { id: 'Rejected', label: 'Rejected',  Icon: BsXCircleFill,     count: logSource.filter(r => r.status === 'rejected').length,   iconBg: 'var(--badge-coral-fill)',  iconColor: 'var(--red100)' },
  ]

  // Scheduled tasks (Mode 3)
  const filteredScheduled = SCHEDULED_TASKS.filter(t => !q || t.title.toLowerCase().includes(q))

  const headerBadge = isScheduled
    ? `${SCHEDULED_TASKS.length} scheduled`
    : `${pendingCount} awaiting approval`

  return (
    <div style={{
      position: 'fixed', top: 0,
      left: sidebarWidth, right: 0, bottom: 0,
      transition: sidebarTransition,
      background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Page Header ── */}
      <PageHeader
        title="AI Tasks"
        crumbs={['Demo inv']}
        badge={<Badge variant="tinted" color="cobalt" shape="pill">{headerBadge}</Badge>}
        actions={
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 10px', width: 220, background: 'var(--bg-canvas)', border: '1px solid var(--border-input)', borderRadius: 6 }}>
              <SearchIcon />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks, events, users…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--type-p14)', color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, height: 30, padding: '0 10px', borderRadius: 6, border: '1px solid var(--border-input)', background: 'var(--bg-canvas)', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <RefreshIcon /> Refresh
            </button>
          </>
        }
      />

      {/* ── View mode tabs — floating segmented control ── */}
      <div style={{ padding: '12px 16px', flexShrink: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: 4,
          background: 'var(--bg-card)',
          border: 'var(--page-header-border)',
          borderRadius: 12,
          boxShadow: 'var(--page-header-shadow)',
        }}>
          {VIEW_MODES.map(m => {
            const active = viewMode === m.id
            return (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  height: 34, padding: '0 14px',
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  fontFamily: "'Byrd', sans-serif",
                  border: `1px solid ${active ? m.bd : 'transparent'}`, borderRadius: 8,
                  background: active ? m.tint : 'transparent',
                  color: active ? m.color : 'var(--text-muted)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background 160ms ease, color 160ms ease, box-shadow 160ms ease',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <m.Icon size={14} style={{ flexShrink: 0 }} />
                {m.label}
              </button>
            )
          })}
        </div>
      </div>


      {/* ── Mode 3: Scheduled Tasks — full-width, read-only, no panels/cards ── */}
      {isScheduled ? (
        <div style={{ padding: '0 16px 16px', flex: 1, minHeight: 0 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            <div style={{ padding: '13px 16px 10px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Scheduled Tasks</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{filteredScheduled.length} task{filteredScheduled.length === 1 ? '' : 's'}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recurring AI tasks — cadence and next run.</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredScheduled.length === 0 ? (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>No scheduled tasks.</div>
              ) : filteredScheduled.map(task => <ScheduledRow key={task.id} task={task} />)}
            </div>
          </div>
        </div>
      ) : (
      /* ── Modes 1 & 2: two-panel split ── */
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 12, padding: '0 16px 16px', flex: 1, minHeight: 0 }}>

        {/* Left — pending (operation requests OR system improvements) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px 10px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {leftTitle}
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: 'var(--badge-cobalt-fill)', border: '1px solid var(--badge-cobalt-bd)', color: 'var(--badge-cobalt-text)' }}>{pendingCount}</span>
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{leftSub}</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredPending.length === 0 ? (
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-muted)', padding: 24, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--badge-green-fill)', color: 'var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BsCheckCircleFill size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>All clear</div>
                <div style={{ fontSize: 12 }}>{emptyPending}</div>
              </div>
            ) : filteredPending.map(task => (
              <PendingCard key={task.id} task={task} isSelected={selectedTask === task.id} onClick={setSelectedTask} />
            ))}
          </div>
        </div>

        {/* Right — AI Tasks Log (kind-filtered per mode) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px 10px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>AI Tasks Log</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{logSource.length} events</span>
                <FilterIcon />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resolved history — what's already been actioned.</p>
              {/* Trust accelerator — the AI's track record builds confidence to grant more autonomy */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color: 'var(--badge-green-text)' }}>
                <BsPatchCheckFill size={11} /> 94% approval rate · 312 actions this month
              </span>
            </div>
          </div>
          {/* Filter mini-cards — icon + count + label, grey by default, colored when active */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, padding: '10px 16px', flexShrink: 0 }}>
            {logFilterCards.map(({ id, label, Icon, count, iconBg, iconColor }) => {
              const active = logFilter === id
              return (
                <button
                  key={id}
                  onClick={() => setLogFilter(id)}
                  style={{
                    textAlign: 'left', font: 'inherit', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 10px', borderRadius: 10,
                    background: 'var(--bg-card)',
                    border: `1px solid ${active ? 'var(--color-interactive)' : 'var(--border-default)'}`,
                    transition: 'border-color 150ms, background 150ms, color 150ms',
                  }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'var(--badge-cobalt-fill)' : 'var(--bg-active)', color: active ? 'var(--color-interactive)' : 'var(--text-muted)', transition: 'background 150ms, color 150ms' }}>
                    <Icon size={13} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{count}</div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
                  </div>
                </button>
              )
            })}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredLog.length === 0 ? (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>No results</div>
            ) : filteredLog.map(row => <LogRow key={row.id} row={row} />)}
          </div>
        </div>
      </div>
      )}

      {/* ── Approval modal ── */}
      {selectedTask && (
        <ApprovalModal
          task={PENDING_TASKS.find(t => t.id === selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}
