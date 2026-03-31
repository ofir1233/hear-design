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

// ── LogoUpload ─────────────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 12V4M9 4L6 7M9 4L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 13v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5A1 1 0 004.7 12h4.6a1 1 0 001-.93L11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const LOGO_MODES = ['Light', 'Dark']

function LogoUploadSlot({ mode, logo, onSet, onClear }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState(null)
  const inputRef = useRef(null)

  const ACCEPT = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  const MAX_MB = 2
  const isDark = mode === 'Dark'

  function processFile(file) {
    setError(null)
    if (!ACCEPT.includes(file.type)) { setError('Only PNG, JPG, SVG or WebP files are supported.'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB}MB.`); return }
    onSet({ url: URL.createObjectURL(file), name: file.name, size: (file.size / 1024).toFixed(0) + ' KB' })
  }

  function onFileInput(e) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  // Preview background: checkered pattern simulates transparency, tinted by mode
  const previewBg = isDark ? '#1a1c1e' : '#f5f5f7'
  const previewBorder = isDark ? '#2e3035' : '#e0e0e3'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* Preview box */}
      <div style={{
        width: 64, height: 64, borderRadius: 12, flexShrink: 0,
        background: logo ? previewBg : 'var(--bg-active)',
        border: `1px solid ${logo ? previewBorder : 'var(--border-default)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', transition: 'background 200ms ease, border-color 200ms ease',
      }}>
        {logo
          ? <img src={logo.url} alt={`${mode} logo`} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          : <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", letterSpacing: '0.03em' }}>
              {isDark ? '☾' : '☀︎'}
            </span>
        }
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          flex: 1,
          border: `1.5px dashed ${dragging ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
          background: dragging ? 'rgba(23,121,247,0.04)' : 'var(--bg-canvas)',
          transition: 'border-color 150ms ease, background 150ms ease',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><UploadIcon /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          {logo ? (
            <>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{logo.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>{logo.size} · Click to replace</p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>Click to upload or drag & drop</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>PNG, JPG, SVG or WebP · max {MAX_MB}MB</p>
            </>
          )}
        </div>
        {logo && (
          <button
            onClick={e => { e.stopPropagation(); onClear(); setError(null) }}
            title="Remove"
            style={{
              flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              padding: 4, borderRadius: 6,
              transition: 'color 120ms ease, background 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)'; e.currentTarget.style.background = 'var(--bg-active)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept={ACCEPT.join(',')} onChange={onFileInput} style={{ display: 'none' }} />

      {error && <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--c100)', fontFamily: "'Byrd', sans-serif" }}>{error}</p>}
    </div>
  )
}

function LogoUpload() {
  const [activeMode, setActiveMode] = useState('Light')
  const [logos, setLogos] = useState({ Light: null, Dark: null })

  function setLogo(mode, logo) { setLogos(prev => ({ ...prev, [mode]: logo })) }
  function clearLogo(mode)     { setLogos(prev => ({ ...prev, [mode]: null })) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Label row + mode tab switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
          Organization Logo
        </label>

        {/* Pill tab switcher */}
        <div style={{
          display: 'flex', gap: 2, padding: 3,
          background: 'var(--bg-active)', borderRadius: 8,
          border: '1px solid var(--border-input)',
        }}>
          {LOGO_MODES.map(mode => {
            const isActive = activeMode === mode
            const hasLogo  = !!logos[mode]
            return (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  height: 24, padding: '0 10px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Byrd', sans-serif",
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-canvas)' : 'none',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background 150ms ease, color 150ms ease, box-shadow 150ms ease',
                }}
              >
                <span style={{ fontSize: 10 }}>{mode === 'Light' ? '☀︎' : '☾'}</span>
                {mode}
                {hasLogo && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--g100)', flexShrink: 0,
                  }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active slot */}
      <LogoUploadSlot
        key={activeMode}
        mode={activeMode}
        logo={logos[activeMode]}
        onSet={logo => setLogo(activeMode, logo)}
        onClear={() => clearLogo(activeMode)}
      />

      {/* Hint if only one is set */}
      {(logos.Light || logos.Dark) && !(logos.Light && logos.Dark) && (
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {logos.Light
            ? '☾ Add a Dark mode version so your logo looks great on dark backgrounds.'
            : '☀︎ Add a Light mode version for use on light backgrounds.'}
        </p>
      )}
    </div>
  )
}

// ── UserManagement ─────────────────────────────────────────────────────────────

const ROLES = ['Admin', 'Manager', 'Agent']

const ROLE_DESC = {
  Admin:   'Full access — manage members, settings, and all data',
  Manager: 'Can view all calls, run reports, and manage agents',
  Agent:   'Access to own calls and assigned actions only',
}

const AVATAR_COLORS = [
  '#1779F7', '#4BA373', '#FF7056', '#9B6DD6',
  '#6E95A0', '#FF8D78', '#D799E2', '#E2A919',
]

function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length] }

function UserAvatar({ user, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: avatarColor(user.id),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff',
      fontFamily: "'Byrd', sans-serif", userSelect: 'none',
    }}>
      {user.initials}
    </div>
  )
}

// Compact inline role dropdown used in each user row
function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function outside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [open])

  function toggle() {
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, right: window.innerWidth - r.right })
    setOpen(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 30, padding: '0 10px',
          background: open ? 'var(--bg-active)' : 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 7, cursor: 'pointer',
          fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif",
          transition: 'border-color 150ms ease, background 150ms ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'var(--bg-active)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'var(--bg-canvas)' }}
      >
        {value}
        <ChevronIcon open={open} />
      </button>

      {open && anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: anchor.top, right: anchor.right,
          minWidth: 200,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          zIndex: 9999, padding: '6px 0',
        }}>
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => { onChange(role); setOpen(false) }}
              style={{
                display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'left',
                padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 100ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <span style={{
                fontSize: 13, fontWeight: role === value ? 600 : 400,
                color: role === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}>
                {role}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {ROLE_DESC[role]}
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

// Overlapping avatar stack for role group cards
function AvatarStack({ users, max = 6 }) {
  const visible = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((user, i) => (
        <div
          key={user.id}
          title={user.name}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            width: 30, height: 30, borderRadius: '50%',
            background: avatarColor(user.id),
            border: '2px solid var(--bg-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff',
            fontFamily: "'Byrd', sans-serif", userSelect: 'none',
            zIndex: visible.length - i,
            position: 'relative',
          }}
        >
          {user.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -8, width: 30, height: 30, borderRadius: '50%',
          background: 'var(--bg-active)', border: '2px solid var(--bg-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif", userSelect: 'none',
          position: 'relative', zIndex: 0,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

// Inner page panel (portal overlay) for managing a single role group
function GroupManagePanel({ role, users, pending, onChangeRole, onRemove, onRevokePending, onInvite, onClose }) {
  const [search, setSearch]       = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    searchRef.current?.focus()
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const q = search.trim().toLowerCase()
  const filtered = users.filter(u =>
    !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
  const filteredPending = pending.filter(p =>
    !q || p.email.toLowerCase().includes(q)
  )

  function sendInvite() {
    const email = inviteEmail.trim()
    if (!email) { setInviteError('Enter an email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteError('Enter a valid email address.'); return }
    onInvite(email, role)
    setInviteEmail('')
    setInviteError(null)
  }

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: 'rgba(0,0,0,0.32)',
      display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: 'min(560px, 100vw)',
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-12px 0 48px rgba(0,0,0,0.18)',
        animation: 'slideInRight 180ms ease',
      }}>

        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: 8,
              background: 'none', border: '1px solid var(--border-input)',
              cursor: 'pointer', color: 'var(--text-secondary)',
              flexShrink: 0, transition: 'background 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
          >
            <BackIcon />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              {role}s
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
              {ROLE_DESC[role]}
            </p>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '3px 10px',
            borderRadius: 20, background: 'var(--bg-active)',
            color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
          }}>
            {users.length} member{users.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Invite + search row */}
        <div style={{ padding: '14px 20px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Invite bar */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
              }}>
                <MailIcon />
              </span>
              <input
                value={inviteEmail}
                onChange={e => { setInviteEmail(e.target.value); setInviteError(null) }}
                onKeyDown={e => { if (e.key === 'Enter') sendInvite() }}
                placeholder={`Invite as ${role}…`}
                style={{ ...inputBase, paddingLeft: 34 }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
            <button
              onClick={sendInvite}
              style={{
                height: 36, padding: '0 14px', flexShrink: 0,
                background: 'var(--b100)', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: '#fff',
                fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
                transition: 'opacity 150ms ease', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              + Invite
            </button>
          </div>
          {inviteError && (
            <p style={{ margin: 0, fontSize: 11, color: 'var(--c100)', fontFamily: "'Byrd', sans-serif" }}>
              {inviteError}
            </p>
          )}

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
            }}>
              <SearchIcon />
            </span>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members…"
              style={{ ...inputBase, paddingLeft: 30, height: 32, fontSize: 12 }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
        </div>

        {/* Member list — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>

          {/* Pending in this role */}
          {filteredPending.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{
                margin: '8px 0 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
              }}>
                Pending ({filteredPending.length})
              </p>
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
                {filteredPending.map((p, i) => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
                    background: 'var(--bg-canvas)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      border: '1.5px dashed var(--border-input)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <MailIcon />
                    </div>
                    <p style={{ flex: 1, margin: 0, fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.email}
                    </p>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'var(--bg-active)', color: 'var(--text-muted)',
                      fontFamily: "'Byrd', sans-serif", flexShrink: 0,
                    }}>
                      Pending
                    </span>
                    <button
                      onClick={() => onRevokePending(p.id)}
                      title="Revoke"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                        padding: 4, borderRadius: 6,
                        transition: 'color 120ms ease, background 120ms ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)'; e.currentTarget.style.background = 'var(--bg-active)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active members */}
          {filtered.length === 0 && filteredPending.length === 0 ? (
            <div style={{
              padding: '32px 0', textAlign: 'center',
              fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
            }}>
              {q ? 'No results for this search.' : `No ${role.toLowerCase()}s yet.`}
            </div>
          ) : filtered.length > 0 && (
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
              {filtered.map((user, i) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
                    background: 'var(--bg-canvas)',
                    transition: 'background 100ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
                >
                  <UserAvatar user={user} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </p>
                    <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </p>
                  </div>
                  <RoleDropdown value={user.role} onChange={newRole => onChangeRole(user.id, newRole)} />
                  <button
                    onClick={() => onRemove(user.id)}
                    title="Remove member"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                      padding: 4, borderRadius: 6, flexShrink: 0,
                      transition: 'color 120ms ease, background 120ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)'; e.currentTarget.style.background = 'var(--bg-active)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

let nextId = 100

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1,  name: 'Alan Watts',     email: 'alan@hear.ai',      initials: 'AW', role: 'Admin'   },
    { id: 2,  name: 'Sarah Chen',     email: 'sarah@hear.ai',     initials: 'SC', role: 'Admin'   },
    { id: 3,  name: 'Robert Chen',    email: 'robert@hear.ai',    initials: 'RC', role: 'Manager' },
    { id: 4,  name: 'Priya Nair',     email: 'priya@hear.ai',     initials: 'PN', role: 'Manager' },
    { id: 5,  name: 'Marcus Webb',    email: 'marcus@hear.ai',    initials: 'MW', role: 'Manager' },
    { id: 6,  name: 'John Smith',     email: 'john@hear.ai',      initials: 'JS', role: 'Agent'   },
    { id: 7,  name: 'Lisa Chen',      email: 'lisa@hear.ai',      initials: 'LC', role: 'Agent'   },
    { id: 8,  name: 'Yossi Marouani', email: 'yossi@hear.ai',     initials: 'YM', role: 'Agent'   },
    { id: 9,  name: 'Noam Fine',      email: 'noam@hear.ai',      initials: 'NF', role: 'Agent'   },
    { id: 10, name: 'Tyron James',    email: 'tyron@hear.ai',     initials: 'TJ', role: 'Agent'   },
  ])

  const [pending, setPending] = useState([
    { id: 'p1', email: 'ofir@example.com',  role: 'Agent'   },
    { id: 'p2', email: 'user@example.com',  role: 'Manager' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState('Agent')
  const [inviteError, setInviteError] = useState(null)
  const [managingRole, setManagingRole] = useState(null) // which panel is open

  function changeRole(userId, newRole) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  function removeUser(userId) {
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  function revokePending(pid) {
    setPending(prev => prev.filter(p => p.id !== pid))
  }

  function sendInvite(email, role) {
    if (users.some(u => u.email === email) || pending.some(p => p.email === email)) return
    setPending(prev => [...prev, { id: 'p' + (++nextId), email, role }])
  }

  function sendTopInvite() {
    const email = inviteEmail.trim()
    if (!email) { setInviteError('Enter an email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteError('Enter a valid email address.'); return }
    if (users.some(u => u.email === email) || pending.some(p => p.email === email)) {
      setInviteError('This email already exists.'); return
    }
    setPending(prev => [...prev, { id: 'p' + (++nextId), email, role: inviteRole }])
    setInviteEmail('')
    setInviteError(null)
  }

  const grouped = ROLES.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role)
    return acc
  }, {})

  const pendingForRole = role => pending.filter(p => p.role === role)
  const totalPending = pending.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Section heading */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          Team Members
        </h3>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          Manage who has access to your organization and their permissions.
        </p>
      </div>

      {/* Invite bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: inviteError ? 8 : 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
          }}>
            <MailIcon />
          </span>
          <input
            value={inviteEmail}
            onChange={e => { setInviteEmail(e.target.value); setInviteError(null) }}
            onKeyDown={e => { if (e.key === 'Enter') sendTopInvite() }}
            placeholder="Enter email address…"
            style={{ ...inputBase, paddingLeft: 34 }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
        <div style={{ width: 120 }}>
          <Dropdown value={inviteRole} options={ROLES} onChange={setInviteRole} />
        </div>
        <button
          onClick={sendTopInvite}
          style={{
            height: 36, padding: '0 16px', flexShrink: 0,
            background: 'var(--b100)', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, color: '#fff',
            fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
            transition: 'opacity 150ms ease', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          + Invite
        </button>
      </div>

      {inviteError && (
        <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--c100)', fontFamily: "'Byrd', sans-serif" }}>
          {inviteError}
        </p>
      )}

      {/* Pending summary row */}
      {totalPending > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: 10,
          border: '1px solid var(--border-default)',
          background: 'var(--bg-canvas)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              border: '1.5px dashed var(--border-input)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <MailIcon />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                Pending Invitations
              </p>
              <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                {totalPending} invite{totalPending !== 1 ? 's' : ''} waiting to be accepted
              </p>
            </div>
          </div>
          <button
            onClick={() => setManagingRole('__pending__')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 30, padding: '0 12px',
              background: 'var(--bg-active)', border: '1px solid var(--border-input)',
              borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif", transition: 'background 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-input)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          >
            View all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Role group summary cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ROLES.map(role => {
          const members = grouped[role]
          const pCount  = pendingForRole(role).length
          return (
            <div
              key={role}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                border: '1px solid var(--border-default)', borderRadius: 12,
                background: 'var(--bg-canvas)',
                cursor: 'pointer', transition: 'background 120ms ease',
              }}
              onClick={() => setManagingRole(role)}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
            >
              {/* Avatar stack or empty placeholder */}
              <div style={{ width: members.length > 0 ? 'auto' : 30, flexShrink: 0 }}>
                {members.length > 0 ? (
                  <AvatarStack users={members} max={6} />
                ) : (
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'var(--bg-active)', border: '1px dashed var(--border-input)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: 'var(--text-muted)',
                  }}>
                    –
                  </div>
                )}
              </div>

              {/* Role info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                  {role}
                  <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>
                    {members.length} member{members.length !== 1 ? 's' : ''}
                    {pCount > 0 ? ` · ${pCount} pending` : ''}
                  </span>
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                  {ROLE_DESC[role]}
                </p>
              </div>

              {/* Manage arrow */}
              <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 3.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )
        })}
      </div>

      {/* Group manage panel */}
      {managingRole && managingRole !== '__pending__' && (
        <GroupManagePanel
          role={managingRole}
          users={grouped[managingRole]}
          pending={pendingForRole(managingRole)}
          onChangeRole={changeRole}
          onRemove={removeUser}
          onRevokePending={revokePending}
          onInvite={sendInvite}
          onClose={() => setManagingRole(null)}
        />
      )}

      {/* Pending-only panel */}
      {managingRole === '__pending__' && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 8000,
          background: 'rgba(0,0,0,0.32)',
          display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end',
        }}
          onClick={e => { if (e.target === e.currentTarget) setManagingRole(null) }}
        >
          <div style={{
            width: 'min(520px, 100vw)',
            background: 'var(--bg-canvas)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-12px 0 48px rgba(0,0,0,0.18)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '16px 20px', borderBottom: '1px solid var(--border-default)', flexShrink: 0,
            }}>
              <button
                onClick={() => setManagingRole(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 8,
                  background: 'none', border: '1px solid var(--border-input)',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
              >
                <BackIcon />
              </button>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                Pending Invitations
              </p>
              <span style={{
                marginLeft: 'auto', fontSize: 12, fontWeight: 600, padding: '3px 10px',
                borderRadius: 20, background: 'var(--bg-active)',
                color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
              }}>
                {pending.length}
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
              {pending.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                  No pending invitations.
                </p>
              ) : (
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
                  {pending.map((p, i) => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
                      background: 'var(--bg-canvas)',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        border: '1.5px dashed var(--border-input)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)',
                      }}>
                        <MailIcon />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.email}
                        </p>
                        <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                          Invited as {p.role}
                        </p>
                      </div>
                      <button
                        onClick={() => revokePending(p.id)}
                        title="Revoke"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                          padding: 4, borderRadius: 6,
                          transition: 'color 120ms ease, background 120ms ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)'; e.currentTarget.style.background = 'var(--bg-active)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ── SecuritySection ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--bg-active)',
        border: `1px solid ${checked ? 'var(--b100)' : 'var(--border-input)'}`,
        cursor: 'pointer', padding: 0, position: 'relative',
        transition: 'background 200ms ease, border-color 200ms ease',
        outline: 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 20 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: checked ? '#fff' : 'var(--text-muted)',
        transition: 'left 200ms ease, background 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function SecuritySection() {
  const [mfaEnabled, setMfaEnabled] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          Security
        </h3>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          Manage your organization security settings.
        </p>
      </div>

      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'var(--bg-canvas)',
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              MFA (Two Factor Authentication)
            </p>
            {mfaEnabled && (
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
                Required for all organization members
              </p>
            )}
          </div>
          <Toggle checked={mfaEnabled} onChange={setMfaEnabled} />
        </div>
      </div>
    </div>
  )
}

// ── Constants ──────────────────────────────────────────────────────────────────

const TIMEZONES = [
  'Asia/Jerusalem', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'UTC',
]

const RETENTION_DAYS = ['7 days', '14 days', '30 days', '60 days', '90 days', '180 days', '365 days']

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrganizationPage() {
  const [orgName, setOrgName]     = useState('Hear.AI')
  const [about, setAbout]         = useState('')
  const [timezone, setTimezone]   = useState('Asia/Jerusalem')
  const [retention, setRetention] = useState('30 days')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <LogoUpload />

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
          style={{ ...inputBase, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.6 }}
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

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />

      <UserManagement />

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />

      <SecuritySection />

    </div>
  )
}
