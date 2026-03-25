import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  height: 36, padding: '0 12px',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}

function focusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e)  { e.currentTarget.style.borderColor = 'var(--border-input)' }

function ChevronIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function toggle() {
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left, width: r.width })
    setOpen(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 36, padding: '0 12px',
          background: 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 8, cursor: 'pointer',
          fontSize: 13, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          transition: 'border-color 150ms ease',
        }}
      >
        <span>{value}</span>
        <ChevronIcon open={open} />
      </button>

      {open && anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: anchor.top, left: anchor.left, width: anchor.width,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999, padding: '4px 0',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13,
                color: opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: opt === value ? 600 : 400,
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 100ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const TIMEZONES = [
  'Asia/Jerusalem', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'UTC',
]

const RETENTION_DAYS = ['7 days', '14 days', '30 days', '60 days', '90 days', '180 days', '365 days']

export default function OrganizationPage() {
  const [orgName, setOrgName]     = useState('Hear.AI')
  const [about, setAbout]         = useState('')
  const [timezone, setTimezone]   = useState('Asia/Jerusalem')
  const [retention, setRetention] = useState('30 days')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

<Field label="Organization Name">
        <input
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          style={inputBase}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </Field>

      <Field label="About the organization">
        <textarea
          value={about}
          onChange={e => setAbout(e.target.value)}
          placeholder="Describe your organization…"
          rows={5}
          style={{
            ...inputBase, height: 'auto', padding: '10px 12px',
            resize: 'vertical', lineHeight: 1.6,
          }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </Field>

      <Field label="Timezone">
        <Dropdown value={timezone} options={TIMEZONES} onChange={setTimezone} />
      </Field>

      <Field label="Recording retention">
        <Dropdown value={retention} options={RETENTION_DAYS} onChange={setRetention} />
      </Field>

    </div>
  )
}
