import { useState, useRef } from 'react'
import Button from '../Button'
import Modal from '../Modal'

// ── Shared primitives ────────────────────────────────────────────────────────────

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

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--border-default)',
        border: `1px solid ${checked ? 'var(--b100)' : 'var(--border-default)'}`,
        cursor: 'pointer', padding: 0, position: 'relative',
        transition: 'background 200ms ease, border-color 200ms ease', outline: 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 20 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        transition: 'left 200ms ease, background 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6 6l-3 3 3 3M12 6l3 3-3 3M10 4l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

// ── Field row ────────────────────────────────────────────────────────────────────

function FieldRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: 'var(--bg-active)', border: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  )
}

// ── ProfilePage ───────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [fullName, setFullName]         = useState('ofir nona')
  const [agentCodeTag, setAgentCodeTag] = useState('$agent_code')
  const [agentInput, setAgentInput]     = useState('')
  const [openInNewTab, setOpenInNewTab]   = useState(false)
  const [apiModalOpen, setApiModalOpen]   = useState(false)
  const [apiComment, setApiComment]       = useState('')
  const [internalKey, setInternalKey]     = useState(false)
  const fileRef = useRef(null)

  function removeTag() { setAgentCodeTag('') }

  function addAgentCode(e) {
    if ((e.key === 'Enter' || e.key === ',') && agentInput.trim()) {
      e.preventDefault()
      setAgentCodeTag(agentInput.trim())
      setAgentInput('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* User summary card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px',
        border: '1px solid var(--border-default)', borderRadius: 10,
        background: 'var(--bg-canvas)',
      }}>
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'var(--b100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: "'Byrd', sans-serif",
        }}>
          ON
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            ofir nona
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Account type: <strong style={{ color: 'var(--text-primary)' }}>Admin</strong>
          </p>
        </div>
      </div>

      {/* Upload profile image */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
      <button
        onClick={() => fileRef.current.click()}
        style={{
          width: '100%', padding: '28px 0',
          background: 'none', border: '1.5px dashed var(--border-input)',
          borderRadius: 10, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--text-muted)', transition: 'border-color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b100)'; e.currentTarget.style.background = 'rgba(23,121,247,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-input)'; e.currentTarget.style.background = 'none' }}
      >
        <CameraIcon />
        <span style={{ fontSize: 13, fontFamily: "'Byrd', sans-serif" }}>Upload Profile Image</span>
      </button>

      {/* Fields */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, padding: '0 20px', background: 'var(--bg-canvas)' }}>

        <FieldRow icon={<UserIcon />} label="Full Name">
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={inputBase}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </FieldRow>

        <Divider />

        <FieldRow icon={<MailIcon />} label="Email">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            ofirnona123@gmail.com
          </p>
        </FieldRow>

        <Divider />

        <FieldRow icon={<CodeIcon />} label="Agent Code">
          {/* Tag + input */}
          <div style={{
            minHeight: 36, padding: '4px 8px',
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            borderRadius: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
            transition: 'border-color 150ms ease',
          }}
            onFocus={() => {}}
          >
            {agentCodeTag && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 20,
                background: 'var(--bg-active)', border: '1px solid var(--border-default)',
                fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif",
              }}>
                {agentCodeTag}
                <button
                  onClick={removeTag}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1 }}
                >×</button>
              </span>
            )}
            {!agentCodeTag && (
              <input
                value={agentInput}
                onChange={e => setAgentInput(e.target.value)}
                onKeyDown={addAgentCode}
                placeholder="Enter agent code…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", minWidth: 120 }}
              />
            )}
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Agent Code — Is the unique code assigned to you as an agent in your organization
          </p>
        </FieldRow>
      </div>

      {/* API Keys */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-canvas)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              API Keys
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setApiModalOpen(true)}
              rightIcon={<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            >
              New API Key
            </Button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Here you can manage your project API keys
          </p>
        </div>

        {/* Empty state */}
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            No Rows To Show
          </p>
        </div>
      </div>

      {/* Personal Behavior */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid var(--border-default)', borderLeft: '3px solid var(--b100)',
        borderRadius: 10, background: 'var(--bg-canvas)',
      }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          Personal Behavior
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          Customize how the app behaves for you personally.
        </p>
      </div>

      {/* Behavior settings */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Open files in new tab
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
              When off, clicking a file name opens the explore page in the current window.
            </p>
          </div>
          <Toggle checked={openInNewTab} onChange={setOpenInNewTab} />
        </div>
      </div>

      {/* Version */}
      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textAlign: 'right' }}>
        v1.136.0 · unknown
      </p>

      {/* New API Key modal */}
      <Modal
        open={apiModalOpen}
        onClose={() => { setApiModalOpen(false); setApiComment(''); setInternalKey(false) }}
        title="New API Key"
        width={500}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="sm" onClick={() => { setApiModalOpen(false); setApiComment(''); setInternalKey(false) }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setApiModalOpen(false)}>
              Generate API Key
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Comment
            </p>
            <input
              value={apiComment}
              onChange={e => setApiComment(e.target.value)}
              placeholder="Comment"
              style={{ ...inputBase }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Toggle checked={internalKey} onChange={setInternalKey} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Create Internal Key (All Projects)
            </span>
          </div>
        </div>
      </Modal>

    </div>
  )
}
