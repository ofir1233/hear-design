import { useState, useRef, useEffect } from 'react'
import Button from '../Button.jsx'

// ── Icons ────────────────────────────────────────────────────────────────────

function ChevronDown({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 160ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DoubleChevron({ up }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
      style={{ transition: 'transform 180ms ease', transform: up ? 'rotate(180deg)' : 'none' }}>
      <path d="M4 7l5 4 5-4M4 11l5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SparkleIcon({ color = 'var(--c100)' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.4 3.9L13 6l-3.6 1.1L8 11 6.6 7.1 3 6l3.6-1.1L8 1z" fill={color} />
      <path d="M13 10.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z" fill={color} opacity="0.55" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ── Options ──────────────────────────────────────────────────────────────────

const FIELDS = [
  { value: 'call_date',    label: 'Call Date',    type: 'date' },
  { value: 'audio_length', label: 'Audio Length', type: 'number' },
  { value: 'agent_name',   label: 'Agent Name',   type: 'text' },
  { value: 'agent_code',   label: 'Agent Code',   type: 'text' },
]

const OPERATORS = [
  { value: 'gte',      label: 'Greater Than or Equals' },
  { value: 'lte',      label: 'Less Than or Equals' },
  { value: 'eq',       label: 'Equals' },
  { value: 'contains', label: 'Contains' },
]

const PRESETS = [
  { value: 'high_risk',   label: 'High-risk calls' },
  { value: 'long_calls',  label: 'Long calls (>5m)' },
  { value: 'today',       label: "Today's alerts" },
]

let _rowId = 100

// ── Styled select (button + menu) ─────────────────────────────────────────────

function MiniSelect({ options, value, onChange, placeholder = 'Select', width, minWidth = 150 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} style={{ position: 'relative', width, flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: width ? '100%' : undefined, minWidth,
          height: 40, padding: '0 12px', boxSizing: 'border-box',
          background: 'var(--bg-card)',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
          fontSize: 14, fontFamily: "'Byrd', sans-serif",
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          transition: 'border-color 150ms ease',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected?.label ?? placeholder}</span>
        <span style={{ color: 'var(--text-muted)', display: 'flex' }}><ChevronDown open={open} /></span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 700, minWidth: '100%',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.16)', overflow: 'hidden', padding: 4,
        }}>
          {options.map(opt => {
            const active = opt.value === value
            return (
              <div key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: 14, fontFamily: "'Byrd', sans-serif",
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 400,
                  background: active ? 'var(--bg-active)' : 'transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-active)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Applied-filter chip ───────────────────────────────────────────────────────

function Chip({ label, value, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 30, padding: onRemove ? '0 6px 0 12px' : '0 12px', borderRadius: 99,
      background: 'var(--b20)', fontSize: 13, color: 'var(--badge-cobalt-text)', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span><b style={{ fontWeight: 700 }}>{label}</b> : {value}</span>
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${label}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          width: 18, height: 18, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'var(--b100)', color: '#fff',
        }}>
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      )}
    </span>
  )
}

// ── Circular remove button (filter rows) ───────────────────────────────────────

function RemoveCircle({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Remove filter" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
      border: '1px solid var(--border-input)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
      transition: 'background 120ms ease, border-color 120ms ease, color 120ms ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </button>
  )
}

const FIELD_STYLE = {
  display: 'flex', alignItems: 'center', gap: 8,
  height: 40, padding: '0 12px', boxSizing: 'border-box',
  background: 'var(--bg-card)', border: '1px solid var(--border-input)', borderRadius: 8,
  fontSize: 14, fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function MonitoringFilters({ onApply }) {
  const [expanded, setExpanded] = useState(false)
  const [preset, setPreset] = useState('')
  const [query, setQuery] = useState('')
  const [queryFocus, setQueryFocus] = useState(false)
  const [presetOpen, setPresetOpen] = useState(false)
  const presetRef = useRef(null)

  const [rows, setRows] = useState([
    { id: 1, field: 'call_date',    op: 'gte', from: '2026-06-02', to: '2026-07-02' },
    { id: 2, field: 'audio_length', op: 'gte', value: '30' },
  ])
  const [chips, setChips] = useState([
    { id: 1, label: 'Call Date',    value: '2026-06-02 - 2026-07-02' },
    { id: 2, label: 'Audio Length', value: 'Greater Than or Equals : 30' },
  ])

  useEffect(() => {
    if (!presetOpen) return
    const h = e => { if (presetRef.current && !presetRef.current.contains(e.target)) setPresetOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [presetOpen])

  const selectedPreset = PRESETS.find(p => p.value === preset)

  const setRow = (id, patch) => setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r))
  const removeRow = (id) => setRows(rs => rs.filter(r => r.id !== id))
  const addRow = () => setRows(rs => [...rs, { id: ++_rowId, field: 'agent_name', op: 'contains', value: '' }])

  const fmtDate = (iso) => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  function apply() {
    const next = rows.map(r => {
      const f = FIELDS.find(x => x.value === r.field)
      if (f?.type === 'date') return { id: r.id, label: f.label, value: `${r.from} - ${r.to}` }
      const opLabel = OPERATORS.find(o => o.value === r.op)?.label ?? ''
      return { id: r.id, label: f?.label ?? r.field, value: `${opLabel} : ${r.value}` }
    })
    setChips(next)
    onApply?.(rows)
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12,
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* ── Preset row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>Preset</span>

        {/* preset dropdown */}
        <div ref={presetRef} style={{ position: 'relative', width: 360, flexShrink: 0 }}>
          <button onClick={() => setPresetOpen(o => !o)} style={{
            ...FIELD_STYLE, width: '100%', cursor: 'pointer',
            borderColor: presetOpen ? 'var(--b100)' : 'var(--border-input)',
            color: selectedPreset ? 'var(--text-primary)' : 'var(--text-muted)',
          }}>
            <span style={{ flex: 1, textAlign: 'left' }}>{selectedPreset?.label ?? 'Select a preset'}</span>
            <span style={{ color: 'var(--text-muted)', display: 'flex' }}><ChevronDown open={presetOpen} /></span>
          </button>
          {presetOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 700, width: '100%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.16)', overflow: 'hidden', padding: 4,
            }}>
              {PRESETS.map(p => (
                <div key={p.value} onClick={() => { setPreset(p.value); setPresetOpen(false) }} style={{
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 14,
                  fontFamily: "'Byrd', sans-serif", color: 'var(--text-secondary)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >{p.label}</div>
              ))}
            </div>
          )}
        </div>

        {/* clear preset */}
        <button
          onClick={() => setPreset('')}
          disabled={!preset}
          style={{
            border: 'none', background: 'none', cursor: preset ? 'pointer' : 'default',
            fontSize: 14, fontFamily: "'Byrd', sans-serif",
            color: preset ? 'var(--b100)' : 'var(--text-muted)', opacity: preset ? 1 : 0.6, flexShrink: 0,
          }}
        >Clear preset</button>

        {/* applied chips */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {chips.map((c, i) => (
            <Chip key={c.id} label={c.label} value={c.value}
              onRemove={i === chips.length - 1 ? () => setChips(cs => cs.filter(x => x.id !== c.id)) : undefined} />
          ))}
        </div>

        {/* collapse toggle */}
        <button onClick={() => setExpanded(e => !e)} aria-label={expanded ? 'Collapse filters' : 'Expand filters'} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          width: 32, height: 32, borderRadius: 6, border: 'none', background: 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <DoubleChevron up={expanded} />
        </button>
      </div>

      {/* ── Expanded editor ── */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 940 }}>
          {/* AI query box */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 44, padding: '0 14px', borderRadius: 8,
            border: `1.5px solid ${queryFocus ? 'var(--b100)' : 'var(--border-input)'}`,
            background: 'var(--bg-card)', transition: 'border-color 150ms ease',
            boxShadow: queryFocus ? '0 0 0 3px rgba(23,121,247,0.12)' : 'none',
          }}>
            <SparkleIcon />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setQueryFocus(true)}
              onBlur={() => setQueryFocus(false)}
              placeholder="Describe the data you want to filter…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
              }}
            />
            <span style={{ width: 1, height: 22, background: 'var(--border-input)', flexShrink: 0 }} />
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none',
              color: 'var(--b100)', fontSize: 14, fontWeight: 600, fontFamily: "'Byrd', sans-serif", cursor: 'pointer', flexShrink: 0,
            }}>
              <SparkleIcon color="var(--b100)" /> Generate query
            </button>
          </div>

          {/* Filter rows */}
          {rows.map((r, i) => {
            const field = FIELDS.find(f => f.value === r.field)
            return (
              <div key={r.id}>
                {i > 0 && (
                  <div style={{ position: 'relative', textAlign: 'center', margin: '4px 0' }}>
                    <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border-default)' }} />
                    <span style={{ position: 'relative', background: 'var(--bg-card)', padding: '0 12px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--g100)' }}>AND</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MiniSelect options={FIELDS} value={r.field} onChange={v => {
                    const nf = FIELDS.find(f => f.value === v)
                    setRow(r.id, nf?.type === 'date'
                      ? { field: v, from: '2026-06-02', to: '2026-07-02', op: 'gte' }
                      : { field: v, op: 'gte', value: '' })
                  }} width={190} />

                  {field?.type === 'date' ? (
                    <div style={{ ...FIELD_STYLE, flex: 1, maxWidth: 380, cursor: 'pointer', color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex' }}><CalendarIcon /></span>
                      <span style={{ flex: 1 }}>{fmtDate(r.from)} - {fmtDate(r.to)}</span>
                      <span style={{ color: 'var(--text-muted)', display: 'flex' }}><ChevronDown /></span>
                    </div>
                  ) : (
                    <>
                      <MiniSelect options={OPERATORS} value={r.op} onChange={v => setRow(r.id, { op: v })} width={230} />
                      <input
                        value={r.value ?? ''}
                        onChange={e => setRow(r.id, { value: e.target.value })}
                        placeholder="Value"
                        style={{ ...FIELD_STYLE, flex: 1, maxWidth: 280, outline: 'none' }}
                      />
                    </>
                  )}

                  <RemoveCircle onClick={() => removeRow(r.id)} />
                </div>
              </div>
            )
          })}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <button onClick={addRow} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 40, padding: '0 16px', borderRadius: 8,
              border: '1px solid var(--border-input)', background: 'var(--bg-card)',
              fontSize: 14, fontWeight: 600, fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)' }}
            >
              Add Filter <PlusIcon />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: "'Byrd', sans-serif", color: 'var(--b100)',
              }}>Reset to defaults</button>
              <Button variant="secondary" size="md">Save</Button>
              <Button variant="primary" size="md" onClick={apply}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
