import { useState, useMemo, useRef, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Button from '../Button.jsx'
import Modal from '../Modal.jsx'

// ── Utilities ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#FF7056', '#1779F7', '#4BA373', '#D799E2', '#455F61', '#6E95A0', '#F59E0B']

function strHash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff
  return h
}

function avatarColor(name) { return AVATAR_COLORS[strHash(name) % AVATAR_COLORS.length] }
function initials(name) { return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() }

function scoreColor(s) {
  if (s >= 70) return '#4BA373'
  if (s >= 40) return '#F59E0B'
  return '#E05252'
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_TEAMS = [
  { id: 'alpha', name: 'Alpha team',  lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:06:44', avgScore: 82 },
  { id: 'beta',  name: 'Beta team',   lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:05:13', avgScore: 74 },
  { id: 'delta', name: 'Delta team',  lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:05:05', avgScore: 68 },
  { id: 'gamma', name: 'Gamma team',  lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:04:05', avgScore: 71 },
]

const MOCK_AGENTS = [
  { id: 46191, name: 'Martha Kellett',       team: 'Alpha', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:06:44', avgScore: 86, stars: 4.5 },
  { id: 46210, name: 'Juan Wilson',          team: 'Beta',  lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:05:13', avgScore: 74, stars: 3.5 },
  { id: 46188, name: 'Laura Givens',         team: 'Alpha', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:05:05', avgScore: 62, stars: 3.0 },
  { id: 46199, name: 'Vicki Speheger',       team: 'Delta', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:04:05', avgScore: 71, stars: 3.5 },
  { id: 49681, name: 'Mackenzie Navarrette', team: 'Gamma', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:04:02', avgScore: 78, stars: 4.0 },
  { id: 50536, name: 'Jerome Price',         team: 'Beta',  lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:03:54', avgScore: 55, stars: 2.5 },
  { id: 46195, name: 'Diane ONeill',         team: 'Alpha', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:03:48', avgScore: 83, stars: 4.5 },
  { id: 46184, name: 'Capri Dawson',         team: 'Gamma', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:03:41', avgScore: 79, stars: 4.0 },
  { id: 46185, name: 'Neo Depeyster',        team: 'Delta', lastCallDate: '2/15/2024, 1:30:25 PM', avgHandleTime: '00:03:41', avgScore: 37, stars: 2.0 },
]

const CATEGORIES = [
  {
    name: 'Professionalism',
    skills: [
      { name: 'Customer Needs Assessment', score: 89, average: 82 },
      { name: 'Self-Introduction',         score: 19, average: 55 },
    ],
  },
  {
    name: 'Sales Techniques',
    skills: [
      { name: 'Identifying Sales Opportunities',      score: 90, average: 74 },
      { name: 'Handling Objections',                  score: 81, average: 68 },
      { name: 'Persuasion and Solution Presentation', score: 42, average: 63 },
      { name: 'Creating a Sense of Urgency',          score: 29, average: 58 },
    ],
  },
  {
    name: 'Communication',
    skills: [
      { name: 'Customer Needs Assessment',   score: 92, average: 79 },
      { name: 'Self-Introduction',           score: 75, average: 71 },
      { name: 'Call Summary and Reflection', score: 45, average: 66 },
    ],
  },
]

const SKILL_DETAILS = [
  {
    category: 'Sales Techniques',
    skills: [
      {
        name: 'Handling Objections', score: 72,
        summary: 'The agent consistently validates customer concerns before offering alternatives, reducing friction in 85% of difficult interactions.',
        calls: [
          { id: '402', desc: 'De-escalated pricing complaint.', score: 75 },
          { id: '905', desc: 'Validated user frustration regarding timeline.', score: 95 },
          { id: '112', desc: 'Pivot from objection to value proposition.', score: 66 },
        ],
      },
      {
        name: 'Identifying Sales Opportunities', score: 81,
        summary: 'The agent consistently validates customer concerns before offering alternatives, reducing friction in 85% of difficult interactions.',
        calls: [
          { id: '402', desc: 'De-escalated pricing complaint.', score: 75 },
          { id: '905', desc: 'Validated user frustration regarding timeline.', score: 95 },
          { id: '112', desc: 'Pivot from objection to value proposition.', score: 66 },
        ],
      },
      {
        name: 'Persuasion and Solution Presentation', score: 42,
        summary: 'The agent consistently validates customer concerns before offering alternatives, reducing friction in 85% of difficult interactions.',
        calls: [
          { id: '402', desc: 'De-escalated pricing complaint.', score: 75 },
          { id: '905', desc: 'Validated user frustration regarding timeline.', score: 95 },
          { id: '112', desc: 'Pivot from objection to value proposition.', score: 66 },
        ],
      },
      {
        name: 'Creating a Sense of Urgency', score: 29,
        summary: 'The agent consistently validates customer concerns before offering alternatives, reducing friction in 85% of difficult interactions.',
        calls: [
          { id: '402', desc: 'De-escalated pricing complaint.', score: 75 },
          { id: '905', desc: 'Validated user frustration regarding timeline.', score: 95 },
        ],
      },
    ],
  },
]

const CHART_LABELS = ['1/1','2/1','3/1','4/1','5/1','6/1','7/1','8/1','9/1','10/1','11/1','12/1','1/2','2/2','3/2','4/2']

function genChartData(seed = 75) {
  const pts = []
  let v = seed
  for (let i = 0; i < CHART_LABELS.length; i++) {
    v = Math.max(58, Math.min(94, v + Math.sin(i * 1.2) * 5 + (i % 5 === 0 ? 4 : -1)))
    pts.push({ date: CHART_LABELS[i], score: Math.round(v) })
  }
  return pts
}

const PRESETS = [
  { id: 'p1', label: 'Preset agent evaluation (3)', filters: [{ field: 'team', operator: 'equals', value: 'Alpha' }, { field: 'avgScore', operator: 'not_equal', value: '0' }, { field: 'callDate', operator: 'not_equal', value: '18/25/8' }] },
  { id: 'p2', label: 'High Performers',             filters: [{ field: 'avgScore', operator: 'not_equal', value: '70' }] },
  { id: 'p3', label: 'Needs Improvement',            filters: [{ field: 'avgScore', operator: 'not_equal', value: '80' }] },
]

const FILTER_FIELDS = [
  { value: 'agentName',   label: 'Agent name' },
  { value: 'team',        label: 'Team' },
  { value: 'callDate',    label: 'Call Date' },
  { value: 'avgScore',    label: 'Average score' },
  { value: 'handleTime',  label: 'Handle time' },
]

const OPERATORS = [
  { value: 'contains',     label: 'Contains' },
  { value: 'not_contains', label: 'Not contains' },
  { value: 'equals',       label: 'Equals' },
  { value: 'not_equal',    label: 'Not equal' },
]

const SEL = {
  height: 32, padding: '0 10px',
  background: 'var(--bg-canvas)',
  border: '1px solid var(--border-default)',
  borderRadius: 6,
  fontSize: 'var(--type-p14)',
  color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif",
  outline: 'none',
  cursor: 'pointer',
}

let _chipId = 1

// ── Micro components ──────────────────────────────────────────────────────────

function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, color: '#fff', flexShrink: 0,
      letterSpacing: '0.02em',
    }}>
      {initials(name)}
    </div>
  )
}

function Stars({ value, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,10.5 6,8.5 2.5,10.5 3.5,7 1,4.5 4.5,4.5"
            fill={i < Math.round(value) ? '#F59E0B' : 'var(--border-default)'}
          />
        </svg>
      ))}
    </div>
  )
}

function ScoreBar({ score, average, max = 100 }) {
  const pct    = Math.min(100, (score   / max) * 100)
  const avgPct = average != null ? Math.min(100, (average / max) * 100) : null
  const color  = scoreColor(score)
  return (
    <div style={{ position: 'relative', height: 5, background: 'var(--border-default)', borderRadius: 999, marginTop: 5 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
      {/* Average tick — distinct position per skill */}
      {avgPct != null && (
        <div style={{
          position: 'absolute', top: '-4px', left: `${avgPct}%`,
          transform: 'translateX(-50%)',
          width: 2, height: 13, background: 'var(--text-secondary)',
          borderRadius: 1, opacity: 0.5,
        }} />
      )}
      <div style={{
        position: 'absolute', top: '50%', left: `${pct}%`,
        transform: 'translate(-50%, -50%)',
        width: 9, height: 9, borderRadius: '50%',
        background: color, border: '1.5px solid var(--bg-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  )
}

function TotalScoreBar({ score, max = 100 }) {
  const pct = Math.min(100, (score / max) * 100)
  const color = scoreColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', minWidth: 90 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1.5" y="4" width="9" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 4V2.5a2 2 0 014 0V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        total score
      </div>
      <div style={{ flex: 1, position: 'relative', height: 6, background: 'var(--border-default)', borderRadius: 999 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: color, border: '2px solid var(--bg-card)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{score}/100</span>
    </div>
  )
}

// ── Performance chart (SVG) ───────────────────────────────────────────────────

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
      borderRadius: 8, padding: '8px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, fontFamily: "'Byrd', sans-serif" }}>
        {payload[0]?.payload?.date}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1779F7', lineHeight: 1.2, fontFamily: "'Byrd', sans-serif" }}>
        {payload[0]?.value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>score</div>
    </div>
  )
}

function PerformanceChart({ data }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Agent's Performance by score</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>(Time Unit :Day)</span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1779F7" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#1779F7" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--border-default)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9B9B9B', fontFamily: "'Byrd', sans-serif" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            domain={[50, 100]}
            ticks={[60, 70, 80, 90, 100]}
            tick={{ fontSize: 11, fill: '#9B9B9B', fontFamily: "'Byrd', sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: '#1779F7', strokeWidth: 1.5, strokeDasharray: '5 4', strokeOpacity: 0.5 }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#1779F7"
            strokeWidth={2.5}
            fill="url(#scoreGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#1779F7', stroke: 'var(--bg-card)', strokeWidth: 2.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Score panel ───────────────────────────────────────────────────────────────

function ScorePanel({ totalScore = 90, title = 'Overall score', collapsible = false }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsed ? 0 : 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        {collapsible && (
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
              <path d="M4 10L8 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          <TotalScoreBar score={totalScore} />
          <div style={{ height: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>{cat.name}</div>
                {cat.skills.map(skill => (
                  <div key={skill.name} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, flex: 1 }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="1.5" y="4" width="9" height="6.5" rx="1" stroke="var(--text-muted)" strokeWidth="1.1"/>
                          <path d="M4 4V2.5a2 2 0 014 0V4" stroke="var(--text-muted)" strokeWidth="1.1" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{skill.score}/100</span>
                    </div>
                    <ScoreBar score={skill.score} average={skill.average} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Preset dropdown — exact copy of DataPage PresetSelect ────────────────────

function ChevronDown({ open }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
      style={{ flexShrink: 0, transition: 'transform 160ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PresetSelect({ options, value, onChange, fullWidth }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, width: fullWidth ? '100%' : undefined }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 30, padding: '0 10px',
          background: open ? 'var(--bg-active)' : 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--border-default)' : 'var(--border-input)'}`,
          borderRadius: 6,
          fontSize: 'var(--type-p14)',
          color: selected?.value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
          cursor: 'pointer', whiteSpace: 'nowrap',
          minWidth: fullWidth ? undefined : 100,
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{selected?.label ?? 'None'}</span>
        <ChevronDown open={open} />
      </button>

      <div style={{
        position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 600,
        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
        borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        minWidth: '100%', overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 130ms ease, transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {options.map(opt => {
          const isActive = opt.value === value
          return (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                padding: '8px 12px',
                fontSize: 'var(--type-p14)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Byrd', sans-serif",
                cursor: 'pointer',
                background: isActive ? 'var(--bg-active)' : 'transparent',
                transition: 'background 120ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {opt.label}
              {isActive && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6l3 3 5-5" stroke="var(--color-brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Filter popover ────────────────────────────────────────────────────────────

function FilterPopover({ anchor, chip, onChange, onDone, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  const canDone = chip.field && chip.value.trim()

  return (
    <div ref={ref} style={{
      position: 'fixed', left: anchor.x, top: anchor.y, zIndex: 600,
      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
      borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
      padding: 12, display: 'flex', flexDirection: 'column', gap: 8, width: 250,
    }}>
      <PresetSelect
        fullWidth
        options={[{ value: '', label: 'Field…' }, ...FILTER_FIELDS.map(f => ({ value: f.value, label: f.label }))]}
        value={chip.field}
        onChange={v => onChange({ ...chip, field: v })}
      />
      <PresetSelect
        fullWidth
        options={OPERATORS.map(op => ({ value: op.value, label: op.label }))}
        value={chip.operator}
        onChange={v => onChange({ ...chip, operator: v })}
      />
      <input
        value={chip.value}
        onChange={e => onChange({ ...chip, value: e.target.value })}
        onKeyDown={e => { if (e.key === 'Enter' && canDone) onDone() }}
        placeholder="Value…"
        autoFocus
        style={{ ...SEL, width: '100%', boxSizing: 'border-box' }}
        onFocus={e  => { e.currentTarget.style.borderColor = 'var(--b100)' }}
        onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={onDone} disabled={!canDone}>Done</Button>
      </div>
    </div>
  )
}

// ── Filter bar ────────────────────────────────────────────────────────────────

function FilterBar() {
  const [selectedPreset,  setSelectedPreset]  = useState('')
  const [customPresets,   setCustomPresets]   = useState([])
  const [chips,           setChips]           = useState([])
  const [appliedChips,    setAppliedChips]    = useState([])
  const [activePopover,   setActivePopover]   = useState(null)
  const [editingChip,     setEditingChip]     = useState({ field: '', operator: 'contains', value: '' })
  const [saveModalOpen,   setSaveModalOpen]   = useState(false)
  const [presetNameDraft, setPresetNameDraft] = useState('')

  const allPresets = useMemo(() => [...PRESETS, ...customPresets], [customPresets])
  const isDirty    = JSON.stringify(chips) !== JSON.stringify(appliedChips)

  function loadPreset(id) {
    setSelectedPreset(id)
    const newChips = !id
      ? []
      : (allPresets.find(p => p.id === id)?.filters.map(f => ({ ...f, id: _chipId++ })) ?? [])
    setChips(newChips)
  }

  function savePreset() {
    if (!presetNameDraft.trim()) return
    const id = `custom_${Date.now()}`
    setCustomPresets(p => [...p, {
      id, label: presetNameDraft.trim(),
      filters: chips.map(({ id: _id, ...rest }) => rest),
    }])
    setSelectedPreset(id)
    setSaveModalOpen(false)
    setPresetNameDraft('')
  }

  function updatePreset() {
    setCustomPresets(p => p.map(p2 =>
      p2.id === selectedPreset
        ? { ...p2, filters: chips.map(({ id: _id, ...rest }) => rest) }
        : p2
    ))
    setAppliedChips(chips)
  }

  function openPopover(id, el) {
    const r = el.getBoundingClientRect()
    setActivePopover({ id, anchor: { x: r.left, y: r.bottom + 6 } })
    if (id === 'new') {
      setEditingChip({ field: '', operator: 'contains', value: '' })
    } else {
      const c = chips.find(x => x.id === id)
      if (c) setEditingChip({ field: c.field, operator: c.operator, value: c.value })
    }
  }

  function closePopover() { setActivePopover(null) }

  function donePopover() {
    if (!editingChip.field || !editingChip.value.trim()) { closePopover(); return }
    if (activePopover.id === 'new') {
      setChips(c => [...c, { id: _chipId++, ...editingChip }])
    } else {
      setChips(c => c.map(x => x.id === activePopover.id ? { ...x, ...editingChip } : x))
    }
    closePopover()
  }

  function chipLabel(chip) {
    const fieldLabel = FILTER_FIELDS.find(f => f.value === chip.field)?.label ?? chip.field
    const isNeg = chip.operator === 'not_contains' || chip.operator === 'not_equal'
    return `${fieldLabel}${isNeg ? ' ≠' : ':'} ${chip.value}`
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 48, flexShrink: 0,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
      }}>
        {/* Preset selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{
            fontSize: 'var(--type-p14)', fontWeight: 500, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
          }}>Preset:</span>
          <PresetSelect
            options={[{ value: '', label: 'None' }, ...allPresets.map(p => ({ value: p.id, label: p.label }))]}
            value={selectedPreset}
            onChange={loadPreset}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'var(--border-input)', flexShrink: 0 }} />

        {/* Chips + Add filter */}
        <div className="smooth-scroll" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          flex: 1, overflowX: 'auto', overflowY: 'hidden', minWidth: 0,
        }}>
          {chips.map(chip => (
            <div key={chip.id} data-chip style={{
              display: 'flex', alignItems: 'center', gap: 0,
              height: 26, borderRadius: 99,
              background: 'var(--b20)', border: '1px solid var(--b30)',
              fontSize: 12, color: 'var(--b100)',
              fontFamily: "'Byrd', sans-serif",
              whiteSpace: 'nowrap', flexShrink: 0, userSelect: 'none',
            }}>
              <span
                onClick={e => openPopover(chip.id, e.currentTarget.closest('[data-chip]') ?? e.currentTarget)}
                style={{ padding: '0 8px 0 10px', cursor: 'pointer', lineHeight: 1 }}
              >{chipLabel(chip)}</span>
              <button
                onClick={() => setChips(c => c.filter(x => x.id !== chip.id))}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20, marginRight: 3,
                  borderRadius: '50%', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--b100)', fontSize: 15, lineHeight: 1, flexShrink: 0,
                }}
              >×</button>
            </div>
          ))}
          <button
            onClick={e => openPopover('new', e.currentTarget)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              height: 28, padding: '0 11px',
              background: 'none', border: '1px solid var(--border-input)',
              borderRadius: 99, fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b100)'; e.currentTarget.style.color = 'var(--b100)'; e.currentTarget.style.background = 'var(--b20)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-input)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add filter
          </button>
        </div>

        {/* Save / Update preset */}
        {selectedPreset && customPresets.some(p => p.id === selectedPreset)
          ? <Button variant="secondary" size="sm" onClick={updatePreset}>Update preset</Button>
          : chips.length > 0
            ? <Button variant="secondary" size="sm" onClick={() => { setPresetNameDraft(''); setSaveModalOpen(true) }}>Save</Button>
            : null
        }

        {/* Apply */}
        <Button size="sm" variant="outline" onClick={() => setAppliedChips(chips)}>
          Apply
        </Button>
      </div>

      {/* Filter popover */}
      {activePopover && (
        <FilterPopover
          anchor={activePopover.anchor}
          chip={editingChip}
          onChange={setEditingChip}
          onDone={donePopover}
          onClose={closePopover}
        />
      )}

      {/* Save preset modal */}
      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save as preset"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={savePreset} disabled={!presetNameDraft.trim()}>Save preset</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            fontSize: 'var(--type-p14)', fontWeight: 500,
            color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
          }}>Preset name</label>
          <input
            value={presetNameDraft}
            onChange={e => setPresetNameDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') savePreset() }}
            placeholder="e.g. High performers this month"
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              height: 38, padding: '0 12px',
              background: 'var(--bg-canvas)',
              border: '1.5px solid var(--border-default)',
              borderRadius: 8, fontSize: 13,
              color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
              outline: 'none', transition: 'border-color 150ms ease',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--b100)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
          />
          {chips.length > 0 && (
            <p style={{
              margin: '4px 0 0', fontSize: 'var(--type-p14)',
              color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.5,
            }}>
              {chips.length} filter{chips.length > 1 ? 's' : ''} will be saved:&nbsp;
              {chips.map(c => {
                const fl = FILTER_FIELDS.find(f => f.value === c.field)?.label ?? c.field
                return `${fl}: ${c.value}`
              }).join(' · ')}
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}

// ── Searchable entity table ───────────────────────────────────────────────────

function EntityTable({ title, rows, onRowClick }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(r => r.name.toLowerCase().includes(q))
  }, [rows, search])

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{title}</div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
        }}>
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            width: '100%', boxSizing: 'border-box', padding: '7px 10px 7px 30px',
            border: '1px solid var(--border-default)', borderRadius: 8,
            background: 'var(--bg-canvas)', color: 'var(--text-primary)',
            fontSize: 13, fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['', 'ID', 'last call Date', 'Average Handle Time', 'average score'].map((h, i) => (
                <th key={i} style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{ borderBottom: '1px solid var(--border-default)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background 120ms' }}
                onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = 'var(--bg-canvas)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '' }}
              >
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)', width: 32 }}>{i + 1}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={row.name} size={28} />
                    <span style={{ color: '#1779F7', fontWeight: 500 }}>{row.name}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.lastCallDate}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.avgHandleTime}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontWeight: 600, color: scoreColor(row.avgScore) }}>{row.avgScore}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── AI Insight card ───────────────────────────────────────────────────────────

function InsightCard({ agent }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '24px' }}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
        {/* Left: avatar + role + rating + score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 108 }}>
          <Avatar name={agent.name} size={56} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {agent.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Agent Operati...
            </div>
            <Stars value={agent.stars} />
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1 }}>{agent.avgScore}</div>
          </div>
        </div>

        {/* Right: insight content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* AI insight */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ color: '#FF7056', fontSize: 13, lineHeight: 1 }}>✦</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Ai powered insight</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Meir demonstrates a solid trend in performance, showing consistent improvement in communication and technical knowledge over the recent period.
            </p>
          </div>

          {/* Strengths + Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { title: 'Top 3 Strengths', items: ['High-Level Communication Clarity', 'Proactive Issue Resolution', 'Expanded Product Knowledge in Feature X'] },
              { title: 'Areas for improvement', items: ['High-Level Communication Clarity', 'Proactive Issue Resolution', 'Expanded Product Knowledge in Feature X'] },
            ].map(section => (
              <div key={section.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: '#FF7056', fontSize: 11 }}>✦</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{section.title}</span>
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 14px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                  {section.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Skill section ─────────────────────────────────────────────────────────────

function SkillSection({ section, onOpenCall }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--border-default)' : 'none',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{section.category}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expanded ? 'none' : 'rotate(180deg)', transition: 'transform 200ms', color: 'var(--text-secondary)', flexShrink: 0 }}>
          <path d="M4 6L8 10l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {section.skills.map(skill => (
            <div key={skill.name} style={{
              display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24,
              padding: 16, background: 'var(--bg-canvas)',
              borderRadius: 10, border: '1px solid var(--border-default)',
            }}>
              {/* Left: summary */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {skill.name.length > 32 ? skill.name.slice(0, 32) + '…' : skill.name}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(skill.score), flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {skill.score}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>/100</span>
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{skill.summary}</p>
              </div>

              {/* Right: call evidence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {skill.calls.map(call => (
                  <div
                    key={call.id}
                    onClick={() => onOpenCall?.(call.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', borderRadius: 7,
                      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                      cursor: onOpenCall ? 'pointer' : 'default', transition: 'background 120ms',
                    }}
                    onMouseEnter={e => { if (onOpenCall) e.currentTarget.style.background = 'var(--bg-canvas)' }}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                      <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M3.5 4.5h5M3.5 6.5h5M3.5 8.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 12, flex: 1, minWidth: 0 }}>
                      <span style={{ color: '#1779F7', fontWeight: 500 }}>Call ID #{call.id}:</span>
                      <span style={{ color: 'var(--text-secondary)' }}> {call.desc}</span>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(call.score), flexShrink: 0 }}>{call.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Agent detail view ─────────────────────────────────────────────────────────

// ── Feedback modal ────────────────────────────────────────────────────────────

function FeedbackModal({ agent, onClose }) {
  // recipient picker
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedAgents, setSelectedAgents]   = useState(agent ? [agent] : [])
  const [notifyByMail,   setNotifyByMail]      = useState(false)

  const [schedType, setSchedType] = useState('one-time')
  const [frequency, setFrequency] = useState('weekly')
  const [sendDate,  setSendDate]  = useState('')
  const [message,   setMessage]   = useState('')
  const [sent,      setSent]      = useState(false)

  function toggleAgent(a) {
    setSelectedAgents(prev =>
      prev.find(x => x.id === a.id) ? prev.filter(x => x.id !== a.id) : [...prev, a]
    )
  }

  function handleSend() {
    setSent(true)
    setTimeout(onClose, 1400)
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    height: 36, padding: '0 10px',
    background: 'var(--bg-canvas)', border: '1.5px solid var(--border-default)',
    borderRadius: 7, fontSize: 13, color: 'var(--text-primary)',
    fontFamily: "'Byrd', sans-serif", outline: 'none',
    transition: 'border-color 150ms ease',
    colorScheme: 'dark',
  }

  // build alphabetically grouped agent list
  const filteredAgents = MOCK_AGENTS.filter(a =>
    a.name.toLowerCase().includes(recipientSearch.toLowerCase())
  )
  const grouped = filteredAgents.reduce((acc, a) => {
    const key = a.name[0].toUpperCase()
    ;(acc[key] = acc[key] || []).push(a)
    return acc
  }, {})

  return (
    <Modal
      open
      onClose={onClose}
      title="Send Feedback Form"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSend} disabled={sent || selectedAgents.length === 0}>
            {sent ? 'Sent ✓' : 'Confirm & Send'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Recipient picker */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", marginBottom: 6 }}>
            Recipients {selectedAgents.length > 0 && <span style={{ color: 'var(--text-muted)' }}>({selectedAgents.length} selected)</span>}
          </label>

          {/* Selected chips */}
          {selectedAgents.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {selectedAgents.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'var(--bg-active)', border: '1px solid var(--border-default)',
                  borderRadius: 20, padding: '3px 8px 3px 5px',
                  fontSize: 12, fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: avatarColor(a.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 600, color: '#fff', flexShrink: 0,
                  }}>{initials(a.name)}</div>
                  {a.name}
                  <button onClick={() => toggleAgent(a)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0, marginLeft: 2,
                  }}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              value={recipientSearch}
              onChange={e => setRecipientSearch(e.target.value)}
              placeholder="Search for agent…"
              style={{ ...inputStyle, paddingLeft: 30 }}
              onFocus={e  => { e.currentTarget.style.borderColor = 'var(--b100)' }}
              onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
            />
          </div>

          {/* Agent list */}
          <div className="smooth-scroll" style={{
            maxHeight: 220, overflowY: 'auto',
            border: '1px solid var(--border-default)', borderRadius: 8,
            background: 'var(--bg-canvas)',
          }}>
            {Object.keys(grouped).sort().map(letter => (
              <div key={letter}>
                <div style={{
                  padding: '6px 12px 3px',
                  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                  fontFamily: "'Byrd', sans-serif", letterSpacing: '0.04em',
                }}>{letter}</div>
                {grouped[letter].map((a, i) => {
                  const checked = !!selectedAgents.find(x => x.id === a.id)
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAgent(a)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', cursor: 'pointer',
                        borderTop: '1px solid var(--border-default)',
                        background: checked ? 'var(--bg-active)' : 'transparent',
                        transition: 'background 120ms ease',
                      }}
                      onMouseEnter={e => { if (!checked) e.currentTarget.style.background = 'var(--bg-hover)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = checked ? 'var(--bg-active)' : 'transparent' }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: avatarColor(a.name), flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600, color: '#fff',
                      }}>{initials(a.name)}</div>
                      <span style={{ flex: 1, fontSize: 13, fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)' }}>{a.name}</span>
                      {/* checkbox */}
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        border: `1.5px solid ${checked ? 'var(--b100)' : 'var(--n60, #888)'}`,
                        background: checked ? 'var(--b100)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 120ms ease',
                      }}>
                        {checked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            {filteredAgents.length === 0 && (
              <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                No agents found
              </div>
            )}
          </div>

          {/* Notify by mail */}
          <div
            onClick={() => setNotifyByMail(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 10, paddingTop: 10,
              borderTop: '1px solid var(--border-default)',
              cursor: 'pointer', userSelect: 'none',
            }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: `1.5px solid ${notifyByMail ? 'var(--b100)' : 'var(--n60, #888)'}`,
              background: notifyByMail ? 'var(--b100)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 120ms ease',
            }}>
              {notifyByMail && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 12, fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)' }}>Notify by mail</span>
          </div>
        </div>

        {/* Schedule type — segmented control */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", marginBottom: 6 }}>Schedule</label>
          <div style={{
            display: 'flex', gap: 3, padding: 3,
            background: 'var(--bg-active)', border: '1px solid var(--border-default)',
            borderRadius: 9,
          }}>
            {[
              { id: 'one-time',  label: 'One-time' },
              { id: 'recurring', label: 'Recurring' },
            ].map(opt => (
              <button key={opt.id} onClick={() => setSchedType(opt.id)} style={{
                flex: 1, height: 30, borderRadius: 6, fontSize: 12,
                fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
                border: 'none',
                background: schedType === opt.id ? 'var(--bg-card)' : 'transparent',
                color: schedType === opt.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: schedType === opt.id ? 500 : 400,
                boxShadow: schedType === opt.id ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
                transition: 'all 150ms ease',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Frequency (only for recurring) */}
        {schedType === 'recurring' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", marginBottom: 6 }}>Frequency</label>
            <PresetSelect
              fullWidth
              options={[
                { value: 'weekly',    label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly',  label: 'Monthly' },
                { value: 'quarterly',label: 'Quarterly' },
              ]}
              value={frequency}
              onChange={setFrequency}
            />
          </div>
        )}

        {/* Send date */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", marginBottom: 6 }}>
            {schedType === 'recurring' ? 'Start date' : 'Send date'}
          </label>
          <input
            type="date"
            value={sendDate}
            onChange={e => setSendDate(e.target.value)}
            style={inputStyle}
            onFocus={e  => { e.currentTarget.style.borderColor = 'var(--b100)' }}
            onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
          />
        </div>

        {/* Message */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", marginBottom: 6 }}>Message (optional)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Add a personal note to the feedback form…"
            rows={3}
            style={{
              ...inputStyle, height: 'auto', padding: '8px 10px',
              resize: 'vertical', lineHeight: 1.5,
            }}
            onFocus={e  => { e.currentTarget.style.borderColor = 'var(--b100)' }}
            onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
          />
        </div>
      </div>
    </Modal>
  )
}

// ── Agent detail view ─────────────────────────────────────────────────────────

function AgentDetailView({ agent, onBack, sidebarWidth, sidebarTransition, onOpenCall }) {
  const chartData       = useMemo(() => genChartData(agent.avgScore), [agent.id])
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <div style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
      transition: sidebarTransition, background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header — matches ExplorePage breadcrumb style */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid var(--border-input)', background: 'var(--bg-sidebar)',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            height: 28, padding: '0 10px',
            background: 'none', border: '1px solid var(--border-default)',
            borderRadius: 7, cursor: 'pointer',
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif",
            transition: 'background 130ms ease, color 130ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Agent evaluation
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: "'Byrd', sans-serif", userSelect: 'none' }}>›</span>
        <span style={{
          fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280,
        }}>
          {agent.name}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={() => setFeedbackOpen(true)}>Export</Button>
        </div>
      </div>

      {/* Filter bar for agent-specific filtering */}
      <FilterBar />

      {/* Scrollable content */}
      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InsightCard agent={agent} />
          <PerformanceChart data={chartData} />
          <ScorePanel totalScore={agent.avgScore} title="Agent evaluation" collapsible />
          {SKILL_DETAILS.map(section => (
            <SkillSection key={section.category} section={section} onOpenCall={onOpenCall} />
          ))}
        </div>
      </div>

      {feedbackOpen && <FeedbackModal agent={agent} onClose={() => setFeedbackOpen(false)} />}
    </div>
  )
}

// ── Main page (overview) ──────────────────────────────────────────────────────

export default function AgentEvalPage({ sidebarWidth, sidebarTransition }) {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const chartData = useMemo(() => genChartData(), [])

  if (selectedAgent) {
    return (
      <AgentDetailView
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
        sidebarWidth={sidebarWidth}
        sidebarTransition={sidebarTransition}
      />
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
      transition: sidebarTransition, background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-default)', background: 'var(--bg-canvas)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Agent evaluation</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', background: '#1779F715', border: '1px solid #1779F740',
            borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#1779F7',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5 3v4M3 5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Total Agents: 7,360
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary" size="sm">Upload</Button>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
            padding: '6px', borderRadius: 6,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3"  r="1.3" fill="currentColor"/>
              <circle cx="8" cy="8"  r="1.3" fill="currentColor"/>
              <circle cx="8" cy="13" r="1.3" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Scrollable content */}
      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PerformanceChart data={chartData} />
          <ScorePanel totalScore={90} />
          <EntityTable title="Teams" rows={MOCK_TEAMS} />
          <EntityTable title="Agent Performance" rows={MOCK_AGENTS} onRowClick={setSelectedAgent} />
        </div>
      </div>
    </div>
  )
}
