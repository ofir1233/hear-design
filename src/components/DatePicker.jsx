import { useState, useRef, useEffect } from 'react'
import { BsCalendar3, BsChevronLeft, BsChevronRight, BsChevronRight as BsChevR, BsCheck2 } from 'react-icons/bs'

/**
 * shared/DatePicker — unified single + range date picker (Hear design system).
 *
 * Trigger field → presets menu (Today / Last N days / … / Custom range…).
 * Picking "Custom range…" swaps the popover to a calendar with a Single/Range
 * segmented toggle, month grid (today ring, selected fill, range span tint) and
 * a range footer. Presets and calendar are toggled, never side-by-side.
 *
 * Props:
 *   value       { type:'preset', label } | { type:'range', from, to } | { type:'single', date }
 *   onChange    (value) => void
 *   presets     [{ label, days?:number, kind?:'today'|'days' }]  quick-select keys
 *   triggerStyle  optional style overrides for the trigger control (e.g. height)
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const DEFAULT_PRESETS = [
  { label: 'Today', kind: 'today' },
  { label: 'Last 7 days', kind: 'days', days: 7 },
  { label: 'Last 30 days', kind: 'days', days: 30 },
  { label: 'Last 90 days', kind: 'days', days: 90 },
]

const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const fmt = d => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
const fmtRange = (a, b) => {
  if (!a) return 'Select range'
  if (!b) return fmt(a)
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) return `${MONTHS_SHORT[a.getMonth()]} ${a.getDate()} – ${b.getDate()}, ${a.getFullYear()}`
  return `${MONTHS_SHORT[a.getMonth()]} ${a.getDate()} – ${MONTHS_SHORT[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`
}
function monthCells(year, month) {
  const startDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = startDow - 1; i >= 0; i--) cells.push({ date: new Date(year, month - 1, prevDays - i), inMonth: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), inMonth: true })
  let t = 1; while (cells.length % 7 !== 0) cells.push({ date: new Date(year, month + 1, t++), inMonth: false })
  return cells
}

function labelOf(value) {
  if (!value) return 'Select period'
  if (value.type === 'preset') return value.label
  if (value.type === 'single') return fmt(value.date)
  if (value.type === 'range') return fmtRange(value.from, value.to)
  return 'Select period'
}

export default function DatePicker({ value, onChange, presets = DEFAULT_PRESETS, triggerStyle }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('presets') // 'presets' | 'calendar'
  const [mode, setMode] = useState('range')    // 'single' | 'range'
  const today = stripTime(new Date())
  const [viewYM, setViewYM] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [single, setSingle] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const close = () => { setOpen(false); setView('presets') }
  const pickPreset = p => { onChange && onChange({ type: 'preset', label: p.label }); close() }
  const stepMonth = d => setViewYM(({ y, m }) => { const nm = m + d; return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 } })

  function pickDay(date) {
    const dt = stripTime(date)
    if (mode === 'single') { setSingle(dt); onChange && onChange({ type: 'single', date: dt }); close(); return }
    if (!from || (from && to)) { setFrom(dt); setTo(null) }
    else if (dt < from) { setFrom(dt) }
    else { setTo(dt); onChange && onChange({ type: 'range', from, to: dt }); /* keep open to show span */ }
  }

  const cells = monthCells(viewYM.y, viewYM.m)
  const seg = active => ({ border: 'none', background: active ? '#fff' : 'transparent', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: active ? 'var(--text-primary)' : 'var(--text-muted)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' })
  const navBtn = { width: 26, height: 26, border: 'none', background: 'transparent', borderRadius: 7, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }

  function dayStyle(c) {
    const d = stripTime(c.date)
    const base = { aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, color: c.inMonth ? 'var(--d80)' : 'var(--n40)', borderRadius: 7, cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'inherit' }
    if (mode === 'single') {
      if (sameDay(d, single)) return { ...base, background: 'var(--b100)', color: '#fff', fontWeight: 700 }
    } else {
      if (sameDay(d, from)) return { ...base, background: 'var(--b100)', color: '#fff', fontWeight: 700, borderRadius: to ? '7px 0 0 7px' : 7 }
      if (sameDay(d, to)) return { ...base, background: 'var(--b100)', color: '#fff', fontWeight: 700, borderRadius: '0 7px 7px 0' }
      if (from && to && d > from && d < to) return { ...base, background: 'var(--badge-cobalt-fill)', color: 'var(--badge-cobalt-text)', borderRadius: 0 }
    }
    if (sameDay(d, today)) return { ...base, fontWeight: 700, boxShadow: 'inset 0 0 0 2px var(--b100)' }
    return base
  }

  const popover = { background: 'var(--bg-card)', border: '1px solid var(--border-input)', borderRadius: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.14)' }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          height: 36, minWidth: 150, padding: '0 12px',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`, borderRadius: 8,
          background: 'var(--bg-card)', cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
          fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap',
          ...triggerStyle,
        }}
      >
        <span>{labelOf(value)}</span>
        <BsCalendar3 size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      </button>

      {open && view === 'presets' && (
        <div style={{ ...popover, position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 40, padding: 6, minWidth: 220 }}>
          {presets.map(p => {
            const on = value && value.type === 'preset' && value.label === p.label
            return (
              <button key={p.label} onClick={() => pickPreset(p)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, color: on ? 'var(--b100)' : 'var(--text-primary)', fontWeight: on ? 600 : 500, padding: '9px 11px', borderRadius: 7, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--badge-cobalt-fill)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                {p.label}
                {on && <BsCheck2 size={15} style={{ color: 'var(--b100)' }} />}
              </button>
            )
          })}
          <div style={{ height: 1, background: 'var(--border-default)', margin: '5px 4px' }} />
          <button onClick={() => { setView('calendar') }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, padding: '9px 11px', borderRadius: 7, cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--badge-cobalt-fill)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            Custom range… <BsChevR size={13} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      )}

      {open && view === 'calendar' && (
        <div style={{ ...popover, position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 40, padding: 14, minWidth: 305 }}>
          <div style={{ display: 'inline-flex', gap: 3, background: 'var(--p100)', borderRadius: 9, padding: 3, marginBottom: 10 }}>
            <button style={seg(mode === 'single')} onClick={() => setMode('single')}>Single</button>
            <button style={seg(mode === 'range')} onClick={() => setMode('range')}>Range</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button style={navBtn} title="Back to presets" onClick={() => setView('presets')}><BsChevronLeft size={14} /></button>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{MONTHS[viewYM.m]} {viewYM.y}</span>
            <button style={navBtn} onClick={() => stepMonth(1)}><BsChevronRight size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px 0' }}>
            {DOW.map((d, i) => <div key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--n60)', textAlign: 'center', padding: '4px 0' }}>{d}</div>)}
            {cells.map((c, i) => (
              <button key={i} style={dayStyle(c)} onClick={() => pickDay(c.date)}
                onMouseEnter={e => { if (e.currentTarget.style.background === 'transparent' || e.currentTarget.style.background === '') e.currentTarget.style.background = 'var(--badge-cobalt-fill)' }}
                onMouseLeave={e => { const s = dayStyle(c); e.currentTarget.style.background = s.background }}>
                {c.date.getDate()}
              </button>
            ))}
          </div>
          {mode === 'range' && from && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-default)', fontSize: 12, color: 'var(--n60)' }}>
              <BsCalendar3 size={13} />
              <b style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{MONTHS_SHORT[from.getMonth()]} {from.getDate()}</b>
              {to && <>→ <b style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{MONTHS_SHORT[to.getMonth()]} {to.getDate()}</b> · {Math.round((to - from) / 86400000) + 1} days</>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
