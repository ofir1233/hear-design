import { useState, useMemo } from 'react'
import Button from '../Button.jsx'
import Modal from '../Modal.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Keyframes injected once ───────────────────────────────────────────────────
const SHIMMER_CSS = `
  @keyframes crShimmer {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.9;  }
  }
  .cr-shimmer { animation: crShimmer 1.3s ease-in-out infinite; }
`

// ── Icons ────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 3h9M4.5 3V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10 3l-.7 6.5a1 1 0 0 1-1 .9H3.7a1 1 0 0 1-1-.9L2 3"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusSmIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 5v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="9" r="0.6" fill="currentColor" />
    </svg>
  )
}

// ── InfoTooltip ───────────────────────────────────────────────────────────────

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          color: 'var(--text-muted)', cursor: 'help', fontSize: 11,
          userSelect: 'none', lineHeight: 1,
        }}
      >ⓘ</span>
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 7, padding: '7px 10px',
          fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
          whiteSpace: 'normal', width: 230, lineHeight: 1.55,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          zIndex: 200, pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </span>
  )
}

// ── Design primitives ────────────────────────────────────────────────────────

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  height: 36, padding: '0 12px',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}

function focusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e, hasError) {
  e.currentTarget.style.borderColor = hasError ? '#E53E3E' : 'var(--border-input)'
}

// ── Atoms ─────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      role="switch" aria-checked={checked}
      style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--border-input)',
        cursor: 'pointer', position: 'relative',
        transition: 'background 200ms ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
        transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

// ── ChoiceGroup — unified seg + pill control (replaces SegControl + PillRadio) ─

function ChoiceGroup({ variant = 'seg', options, value, onChange }) {
  if (variant === 'seg') {
    const n = options.length
    const activeIdx = options.findIndex(o => o.value === value)
    return (
      <div style={{
        position: 'relative', display: 'flex', padding: 3,
        background: 'var(--bg-active)', border: '1px solid var(--border-default)',
        borderRadius: 9, width: '100%',
      }}>
        <div style={{
          position: 'absolute', top: 3, bottom: 3,
          left: `calc(3px + ${activeIdx} * ((100% - 6px) / ${n}))`,
          width: `calc((100% - 6px) / ${n})`,
          background: 'var(--bg-card)', borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: 'left 220ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        }} />
        {options.map(opt => (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex: 1, height: 30, borderRadius: 6, fontSize: 12,
            fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
            border: 'none', background: 'transparent', position: 'relative', zIndex: 1,
            color: value === opt.value ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: value === opt.value ? 500 : 400,
            transition: 'color 220ms ease', whiteSpace: 'nowrap', padding: '0 4px',
          }}>{opt.label}</button>
        ))}
      </div>
    )
  }

  // variant === 'pill'
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            height: 30, padding: '0 14px', borderRadius: 20,
            fontSize: 12, fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
            border: `1.5px solid ${active ? 'var(--b100)' : 'var(--border-default)'}`,
            background: active ? 'rgba(23,121,247,0.08)' : 'transparent',
            color: active ? 'var(--b100)' : 'var(--text-secondary)',
            fontWeight: active ? 600 : 400,
            transition: 'all 150ms ease',
          }}>{opt.label}</button>
        )
      })}
    </div>
  )
}

const LOOKBACK_OPTIONS = [1, 3, 5, 7, 30, 60, 90, 180, 365].map(n => ({
  value: n,
  label: n < 365 ? `${n}d` : '1y',
}))

function Tag({ label, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px 3px 10px', borderRadius: 20,
      background: 'var(--bg-active)', border: '1px solid var(--border-default)',
      fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
      maxWidth: 260,
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 15, lineHeight: 1, flexShrink: 0,
          transition: 'color 120ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >×</button>
    </div>
  )
}

// ── Chart preview area ────────────────────────────────────────────────────────

function ChartPreview({ state, onRetry }) {
  // Empty state — no prompt yet
  if (state === 'idle') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, height: 120,
        border: '1.5px dashed var(--border-default)', borderRadius: 10,
        background: 'var(--bg-canvas)',
      }}>
        {/* Ghost bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, opacity: 0.18 }}>
          {[40, 70, 50, 85, 60, 75, 45].map((h, i) => (
            <div key={i} style={{
              width: 12, height: h * 0.7, borderRadius: '3px 3px 0 0',
              background: 'var(--text-secondary)',
            }} />
          ))}
        </div>
        <span style={{
          fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
        }}>
          Add a chart prompt to preview
        </span>
      </div>
    )
  }

  // Loading skeleton
  if (state === 'loading') {
    return (
      <div style={{
        height: 120, borderRadius: 10,
        border: '1px solid var(--border-default)',
        background: 'var(--bg-canvas)',
        padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center',
      }}>
        {[80, 55, 70].map((w, i) => (
          <div key={i} className="cr-shimmer" style={{
            height: 12, width: `${w}%`, borderRadius: 6,
            background: 'var(--bg-active)',
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    )
  }

  // Ready state — placeholder chart
  if (state === 'ready') {
    return (
      <div style={{
        height: 120, borderRadius: 10,
        border: '1px solid var(--border-default)',
        background: 'var(--bg-canvas)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'flex-end', gap: 6,
        animation: 'crFadeIn 300ms ease forwards',
        opacity: 0,
      }}>
        {[55, 80, 45, 90, 65, 75, 40, 85].map((h, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: '3px 3px 0 0',
            height: `${h}%`,
            background: `rgba(23,121,247,${0.4 + i * 0.06})`,
            transition: `height 400ms cubic-bezier(0.4,0,0.2,1) ${i * 40}ms`,
          }} />
        ))}
      </div>
    )
  }

  // Error state
  if (state === 'error') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 8,
        border: '1px solid rgba(229,62,62,0.3)',
        background: 'rgba(229,62,62,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: '#E53E3E' }}><WarnIcon /></span>
          <span style={{
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif",
          }}>Could not generate preview</span>
        </div>
        <button
          onClick={onRetry}
          style={{
            fontSize: 12, color: 'var(--b100)', fontFamily: "'Byrd', sans-serif",
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            textDecoration: 'underline',
          }}
        >Retry</button>
      </div>
    )
  }

  return null
}

// ── Layout components ─────────────────────────────────────────────────────────

function Section({ title, children, collapsible = false, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
        style={{
          padding: '12px 20px',
          borderBottom: open ? '1px solid var(--border-default)' : 'none',
          background: 'var(--bg-sidebar)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: collapsible ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            fontFamily: "'Byrd', sans-serif",
          }}>
            {title}
          </span>
          {badge != null && badge > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
              background: 'rgba(23,121,247,0.12)', color: 'var(--b100)',
              border: '1px solid rgba(23,121,247,0.2)',
              borderRadius: 20, padding: '1px 7px',
            }}>
              {badge} active
            </span>
          )}
        </div>
        {collapsible && (
          <ChevronDownIcon open={open} />
        )}
      </div>

      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 2000 : 0,
        transition: 'max-height 260ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, required, tooltip, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <label style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif",
        }}>
          {label}
          {required && <span style={{ color: 'var(--c100)', marginLeft: 2 }}>*</span>}
        </label>
        {tooltip && <InfoTooltip text={tooltip} />}
        {hint && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, subtext, checked, onChange, noBorder, tooltip }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0',
      borderBottom: noBorder ? 'none' : '1px solid var(--border-default)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
            fontFamily: "'Byrd', sans-serif",
          }}>{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        {subtext && (
          <span style={{
            fontSize: 11, color: 'var(--text-muted)',
            fontFamily: "'Byrd', sans-serif",
          }}>{subtext}</span>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CreateReportPage({ sidebarWidth = 272, sidebarTransition }) {

  // § Basic Info
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')

  // § Prompts
  const [prompts, setPrompts] = useState([''])

  // § Configuration
  const [frequency,      setFrequency]      = useState('daily')
  const [execEnabled,    setExecEnabled]    = useState(false)
  const [execTime,       setExecTime]       = useState('00:00')
  const [lookback,       setLookback]       = useState(7)
  const [exclusionInput, setExclusionInput] = useState('')
  const [exclusions,     setExclusions]     = useState([])
  const [revisions,      setRevisions]      = useState('')

  // § Options
  const [stickToTemplate,  setStickToTemplate]  = useState(false)
  const [isAIAccessible,   setIsAIAccessible]   = useState(true)
  const [useAgenticMethod, setUseAgenticMethod] = useState(false)
  const [experimentalMode, setExperimentalMode] = useState(false)

  // § Chart Setup
  const [chartPrompt,      setChartPrompt]      = useState('')
  const [chartType,        setChartType]        = useState('auto')
  const [reportFormatOpen, setReportFormatOpen] = useState(false)
  const [reportFormat,     setReportFormat]     = useState('')
  const [previewState,     setPreviewState]     = useState('idle')  // idle|loading|ready|error

  // § Recipients
  const [emailInput,    setEmailInput]    = useState('')
  const [emailError,    setEmailError]    = useState('')
  const [emails,        setEmails]        = useState([])
  const [accessControl, setAccessControl] = useState('')

  // § Meta
  const [isDirty,        setIsDirty]        = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  // ── Dirty tracking ─────────────────────────────────────────────────────────
  function d(setter) { return v => { setIsDirty(true); setter(v) } }

  // ── Prompt helpers ─────────────────────────────────────────────────────────
  function addPrompt()       { setIsDirty(true); setPrompts(p => [...p, '']) }
  function removePrompt(i)   { setIsDirty(true); setPrompts(p => p.filter((_, idx) => idx !== i)) }
  function updatePrompt(i,v) { setIsDirty(true); setPrompts(p => p.map((x, idx) => idx === i ? v : x)) }

  // ── Exclusion helpers ──────────────────────────────────────────────────────
  function addExclusion() {
    if (exclusionInput && !exclusions.includes(exclusionInput)) {
      setIsDirty(true)
      setExclusions(p => [...p, exclusionInput])
    }
    setExclusionInput('')
  }

  // ── Email helpers ──────────────────────────────────────────────────────────
  function addEmail() {
    const v = emailInput.trim()
    if (!v) return
    if (!EMAIL_RE.test(v)) { setEmailError('Enter a valid email address'); return }
    if (emails.includes(v)) { setEmailError('Already added'); return }
    setIsDirty(true)
    setEmails(p => [...p, v])
    setEmailInput('')
    setEmailError('')
  }

  // ── Chart preview ──────────────────────────────────────────────────────────
  function runPreview() {
    setPreviewState('loading')
    setTimeout(() => {
      // Simulate: 90% success, 10% error
      setPreviewState(Math.random() > 0.1 ? 'ready' : 'error')
    }, 1500)
  }

  // ── Navigation guard ───────────────────────────────────────────────────────
  function tryDiscard() {
    if (isDirty) { setConfirmDiscard(true) } else { navigate('/reports') }
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const canSave = title.trim().length > 0 && prompts.some(p => p.trim().length > 0)

  const warnings = useMemo(() => {
    const w = []
    if (emails.length === 0) w.push('No email recipients set')
    if (!reportFormat)       w.push('No report format chosen')
    return w
  }, [emails, reportFormat])

  // Badge counts for collapsible advanced sections
  const optionsBadge = [stickToTemplate, !isAIAccessible, useAgenticMethod, experimentalMode].filter(Boolean).length
  const chartBadge   = [chartPrompt, chartType !== 'auto', reportFormat].filter(Boolean).length

  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <style>{`@keyframes crFadeIn { to { opacity: 1; } }`}</style>

      {/* ── Discard confirmation modal ─────────────────────────────────────── */}
      <Modal
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        title="Discard changes?"
        width={360}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
            <Button variant="danger" size="sm" onClick={() => navigate('/reports')}>Discard</Button>
          </>
        }
      >
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif", lineHeight: 1.6, margin: 0,
        }}>
          You have unsaved changes. Leaving this page will permanently discard them.
        </p>
      </Modal>

      {/* ── Page shell ────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
        transition: sidebarTransition,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 20px', height: 52,
          borderBottom: '1px solid var(--border-input)',
          background: 'var(--bg-sidebar)',
        }}>
          <button
            onClick={tryDiscard}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              height: 28, padding: '0 10px',
              background: 'none', border: '1px solid var(--border-default)',
              borderRadius: 7, cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif",
              transition: 'background 130ms ease, color 130ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none';             e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <BackIcon /> Reports
          </button>

          <svg width="5" height="9" viewBox="0 0 5 9" fill="none" style={{ color: 'var(--text-muted)' }}>
            <path d="M1 1l3 3.5L1 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <span style={{
            fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
            fontFamily: "'Byrd', sans-serif",
          }}>Create Report</span>

          <div style={{ flex: 1 }} />

          {/* Warnings badge */}
          {warnings.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: 'var(--c100)', fontFamily: "'Byrd', sans-serif",
            }}>
              <WarnIcon />
              {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={tryDiscard}>Cancel</Button>
          <Button size="sm" disabled={!canSave}>
            Save Report
          </Button>
        </div>

        {/* ── Scrollable body ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
          <div style={{
            maxWidth: 720, margin: '0 auto',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>

            {/* ── TIER 1: Critical — always open ──────────────────────────── */}

            <Section title="Basic Info">
              <Field label="Title" required>
                <input
                  value={title}
                  onChange={e => { setIsDirty(true); setTitle(e.target.value) }}
                  placeholder="Give your report a name…"
                  style={inputBase}
                  onFocus={focusBorder}
                  onBlur={e => blurBorder(e, false)}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={e => { setIsDirty(true); setDescription(e.target.value) }}
                  placeholder="Brief description of what this report covers…"
                  rows={3}
                  style={{
                    ...inputBase, height: 'auto', padding: '10px 12px',
                    resize: 'vertical', lineHeight: 1.6,
                  }}
                  onFocus={focusBorder}
                  onBlur={e => blurBorder(e, false)}
                />
              </Field>
            </Section>

            <Section title="Prompts">
              {prompts.map((p, i) => {
                const pct        = p.length / 5000
                const atLimit    = pct >= 1
                const nearLimit  = pct >= 0.9
                const counterClr = atLimit ? '#E53E3E' : nearLimit ? 'var(--c100)' : 'var(--text-muted)'
                const borderClr  = atLimit ? '#E53E3E' : nearLimit ? 'var(--c100)' : undefined

                return (
                  <Field key={i} label={prompts.length > 1 ? `Prompt ${i + 1}` : 'Report Prompt'}>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={p}
                        onChange={e => updatePrompt(i, e.target.value)}
                        placeholder="Describe what this prompt should analyze or generate…"
                        rows={4}
                        style={{
                          ...inputBase, height: 'auto', padding: '10px 12px 30px',
                          resize: 'vertical', lineHeight: 1.6,
                          borderColor: borderClr || 'var(--border-input)',
                          transition: 'border-color 150ms ease',
                        }}
                        onFocus={focusBorder}
                        onBlur={e => blurBorder(e, atLimit || nearLimit)}
                      />

                      <div style={{
                        position: 'absolute', bottom: 8, left: 10, right: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        pointerEvents: 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{
                            fontSize: 10, fontFamily: "'Byrd', sans-serif",
                            color: counterClr, transition: 'color 150ms ease',
                          }}>
                            {p.length.toLocaleString()} / 5,000
                          </span>
                          {atLimit && (
                            <span style={{
                              fontSize: 10, color: '#E53E3E',
                              fontFamily: "'Byrd', sans-serif",
                            }}>
                              — Character limit reached
                            </span>
                          )}
                        </div>

                        {prompts.length > 1 && (
                          <button
                            onClick={() => removePrompt(i)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              pointerEvents: 'all', fontSize: 11, color: 'var(--text-muted)',
                              fontFamily: "'Byrd', sans-serif",
                              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                              transition: 'color 120ms ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                          >
                            <TrashIcon /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </Field>
                )
              })}

              <button
                onClick={addPrompt}
                style={{
                  alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
                  height: 30, padding: '0 12px',
                  background: 'none', border: '1.5px dashed var(--border-default)',
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b100)'; e.currentTarget.style.color = 'var(--b100)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <PlusSmIcon /> Add Prompt
              </button>
            </Section>

            {/* ── TIER 2: Standard — open by default, collapsible ─────────── */}

            <Section title="Configuration" collapsible defaultOpen>

              <Field label="Frequency">
                <ChoiceGroup
                  variant="seg"
                  options={[
                    { value: 'hourly',  label: 'Hourly'  },
                    { value: 'daily',   label: 'Daily'   },
                    { value: 'weekly',  label: 'Weekly'  },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                  value={frequency}
                  onChange={d(setFrequency)}
                />
              </Field>

              <Field label="Execution Time">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Toggle checked={execEnabled} onChange={d(setExecEnabled)} />
                  <span style={{
                    fontSize: 12, color: 'var(--text-secondary)',
                    fontFamily: "'Byrd', sans-serif",
                  }}>
                    {execEnabled ? 'Custom time' : 'Midnight (default)'}
                  </span>
                  {execEnabled && (
                    <input
                      type="time"
                      value={execTime}
                      onChange={e => { setIsDirty(true); setExecTime(e.target.value) }}
                      style={{ ...inputBase, width: 130, accentColor: 'var(--b100)' }}
                      onFocus={focusBorder}
                      onBlur={e => blurBorder(e, false)}
                    />
                  )}
                </div>
              </Field>

              <Field
                label="Lookback Period"
                tooltip="How far back the report should pull data. Larger windows increase generation time."
              >
                <ChoiceGroup
                  variant="pill"
                  options={LOOKBACK_OPTIONS}
                  value={lookback}
                  onChange={d(setLookback)}
                />
              </Field>

              <Field label="Exclusions" hint="— skip report on specific dates (optional)">
                {exclusions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    {exclusions.map(d => (
                      <Tag key={d} label={d} onRemove={() => {
                        setIsDirty(true)
                        setExclusions(p => p.filter(x => x !== d))
                      }} />
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="date"
                    value={exclusionInput}
                    onChange={e => setExclusionInput(e.target.value)}
                    style={{ ...inputBase, width: 180, accentColor: 'var(--text-secondary)' }}
                    onFocus={focusBorder}
                    onBlur={e => blurBorder(e, false)}
                  />
                  <Button variant="ghost" size="sm" disabled={!exclusionInput} onClick={addExclusion}>
                    Add date
                  </Button>
                </div>
              </Field>

              <Field label="Revisions" hint="(optional)">
                <input
                  value={revisions}
                  onChange={e => { setIsDirty(true); setRevisions(e.target.value) }}
                  placeholder="Search or describe revision instructions…"
                  style={inputBase}
                  onFocus={focusBorder}
                  onBlur={e => blurBorder(e, false)}
                />
              </Field>
            </Section>

            <Section title="Recipients" collapsible defaultOpen>

              <Field label="Notify by Email">
                {emails.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {emails.map(e => (
                      <Tag key={e} label={e} onRemove={() => {
                        setIsDirty(true)
                        setEmails(p => p.filter(x => x !== e))
                      }} />
                    ))}
                  </div>
                )}
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => {
                    setEmailInput(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addEmail() }
                  }}
                  placeholder="name@company.com — press Enter to add"
                  style={{
                    ...inputBase,
                    borderColor: emailError ? '#E53E3E' : 'var(--border-input)',
                  }}
                  onFocus={focusBorder}
                  onBlur={e => blurBorder(e, !!emailError)}
                />
                {emailError ? (
                  <span style={{
                    fontSize: 11, color: '#E53E3E',
                    fontFamily: "'Byrd', sans-serif", marginTop: -2,
                  }}>
                    {emailError}
                  </span>
                ) : (
                  <span style={{
                    fontSize: 11, color: 'var(--text-muted)',
                    fontFamily: "'Byrd', sans-serif", marginTop: -2,
                  }}>
                    Press Enter or comma to add multiple addresses
                  </span>
                )}
              </Field>

              <Field label="Access Control" hint="— who can see and edit this report (optional)">
                <input
                  value={accessControl}
                  onChange={e => { setIsDirty(true); setAccessControl(e.target.value) }}
                  placeholder="Search people or teams…"
                  style={inputBase}
                  onFocus={focusBorder}
                  onBlur={e => blurBorder(e, false)}
                />
              </Field>
            </Section>

            {/* ── TIER 3: Advanced — collapsed by default ──────────────────── */}

            <Section title="Options" collapsible defaultOpen={false} badge={optionsBadge}>
              <div style={{ margin: '-8px 0' }}>
                <ToggleRow
                  label="Stick to template?"
                  tooltip="Prevents the AI from deviating from the report structure defined in your template."
                  checked={stickToTemplate}
                  onChange={d(setStickToTemplate)}
                />
                <ToggleRow
                  label="Is AI Accessible"
                  tooltip="Makes this report available to AI agents and automation pipelines via API."
                  checked={isAIAccessible}
                  onChange={d(setIsAIAccessible)}
                />
                <ToggleRow
                  label="Use Agentic Method?"
                  tooltip="Allows the AI to iteratively refine the report using tool calls and self-correction loops. May increase generation time."
                  checked={useAgenticMethod}
                  onChange={d(setUseAgenticMethod)}
                />
                <ToggleRow
                  label="Experimental Mode"
                  subtext="Enable cutting-edge AI features"
                  tooltip="Opt in to unreleased AI capabilities. Results may be less stable or predictable."
                  checked={experimentalMode}
                  onChange={d(setExperimentalMode)}
                  noBorder
                />
              </div>
            </Section>

            <Section title="Chart Setup" collapsible defaultOpen={false} badge={chartBadge}>

              <Field label="Chart Prompt">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={chartPrompt}
                    onChange={e => {
                      setIsDirty(true)
                      setChartPrompt(e.target.value)
                      if (previewState !== 'idle') setPreviewState('idle')
                    }}
                    placeholder="Describe how the chart should visualize the data…"
                    style={{ ...inputBase, flex: 1 }}
                    onFocus={focusBorder}
                    onBlur={e => blurBorder(e, false)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!chartPrompt.trim() || previewState === 'loading'}
                    onClick={runPreview}
                  >
                    {previewState === 'loading' ? 'Generating…' : 'Preview'}
                  </Button>
                </div>
                <ChartPreview state={previewState === 'idle' && !chartPrompt.trim() ? 'idle' : previewState} onRetry={runPreview} />
              </Field>

              <Field label="Chart Type">
                <ChoiceGroup
                  variant="seg"
                  options={[
                    { value: 'auto', label: 'Auto' },
                    { value: 'line', label: 'Line' },
                    { value: 'bar',  label: 'Bar'  },
                    { value: 'pie',  label: 'Pie'  },
                  ]}
                  value={chartType}
                  onChange={d(setChartType)}
                />
              </Field>

              <Field label="Report Format" hint="(optional)">
                <div style={{
                  border: '1px solid var(--border-input)',
                  borderRadius: 8, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setReportFormatOpen(v => !v)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 8,
                      padding: '0 12px', height: 36,
                      background: 'var(--bg-canvas)', border: 'none', cursor: 'pointer',
                      fontSize: 13, fontFamily: "'Byrd', sans-serif",
                      color: reportFormat ? 'var(--text-primary)' : 'var(--text-muted)',
                      textAlign: 'left',
                    }}
                  >
                    <span>{reportFormat ? reportFormat.toUpperCase() : 'Select format…'}</span>
                    <ChevronDownIcon open={reportFormatOpen} />
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: reportFormatOpen ? 160 : 0,
                    transition: 'max-height 200ms ease',
                    borderTop: reportFormatOpen ? '1px solid var(--border-default)' : 'none',
                  }}>
                    {['pdf', 'csv', 'json', 'html'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => { setIsDirty(true); setReportFormat(fmt); setReportFormatOpen(false) }}
                        style={{
                          display: 'block', width: '100%', padding: '9px 12px',
                          textAlign: 'left', border: 'none', cursor: 'pointer',
                          background: reportFormat === fmt ? 'var(--bg-active)' : 'var(--bg-canvas)',
                          fontSize: 13, fontFamily: "'Byrd', sans-serif",
                          color: reportFormat === fmt ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: reportFormat === fmt ? 500 : 400,
                          transition: 'background 100ms ease',
                        }}
                        onMouseEnter={e => { if (reportFormat !== fmt) e.currentTarget.style.background = 'var(--bg-active)' }}
                        onMouseLeave={e => { if (reportFormat !== fmt) e.currentTarget.style.background = 'var(--bg-canvas)' }}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            </Section>

            <div style={{ height: 48 }} />
          </div>
        </div>
      </div>
    </>
  )
}
