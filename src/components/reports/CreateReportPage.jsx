import { useState } from 'react'
import { MdRepeat } from 'react-icons/md'
import Button from '../Button.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

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
      <path d="M1.5 3h9M4.5 3V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10 3l-.7 6.5a1 1 0 0 1-1 .9H3.7a1 1 0 0 1-1-.9L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

// ── Design primitives ────────────────────────────────────────────────────────

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  height: 36, padding: '0 12px',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}

function focusBorder(e)  { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e)   { e.currentTarget.style.borderColor = 'var(--border-input)' }

// ── Reusable atoms ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--border-input)',
        cursor: 'pointer', position: 'relative',
        transition: 'background 200ms ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 2,
        left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
        transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

function SegControl({ options, value, onChange, fullWidth = true }) {
  const n = options.length
  const activeIdx = options.findIndex(o => o.value === value)
  return (
    <div style={{
      position: 'relative', display: 'flex', padding: 3,
      background: 'var(--bg-active)', border: '1px solid var(--border-default)',
      borderRadius: 9, width: fullWidth ? '100%' : 'fit-content',
    }}>
      {/* Sliding pill */}
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

function PillRadio({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              height: 30, padding: '0 14px', borderRadius: 20,
              fontSize: 12, fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer',
              border: `1.5px solid ${active ? 'var(--b100)' : 'var(--border-default)'}`,
              background: active ? 'rgba(23,121,247,0.08)' : 'transparent',
              color: active ? 'var(--b100)' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
              transition: 'all 150ms ease',
            }}
          >
            {opt === 1 ? '1 day' : `${opt}d`}
          </button>
        )
      })}
    </div>
  )
}

function Tag({ label, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px 3px 10px', borderRadius: 20,
      background: 'var(--bg-active)', border: '1px solid var(--border-default)',
      fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
      maxWidth: 240,
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

// ── Layout components ────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-sidebar)',
      }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, hint, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <label style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif",
        }}>
          {label}
          {required && <span style={{ color: 'var(--c100)', marginLeft: 2 }}>*</span>}
        </label>
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

function ToggleRow({ label, subtext, checked, onChange, noBorder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0',
      borderBottom: noBorder ? 'none' : '1px solid var(--border-default)',
    }}>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
        }}>{label}</div>
        {subtext && (
          <div style={{
            fontSize: 11, color: 'var(--text-muted)',
            fontFamily: "'Byrd', sans-serif", marginTop: 2,
          }}>{subtext}</div>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function CreateReportPage({ sidebarWidth = 272, sidebarTransition }) {

  // § Basic Info
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')

  // § Prompts — array of strings
  const [prompts, setPrompts] = useState([''])

  // § Configuration
  const [frequency,       setFrequency]       = useState('daily')
  const [execEnabled,     setExecEnabled]     = useState(false)
  const [execTime,        setExecTime]        = useState('00:00')
  const [lookback,        setLookback]        = useState(7)
  const [exclusionInput,  setExclusionInput]  = useState('')
  const [exclusions,      setExclusions]      = useState([])
  const [revisions,       setRevisions]       = useState('')

  // § Options
  const [stickToTemplate,   setStickToTemplate]   = useState(false)
  const [isAIAccessible,    setIsAIAccessible]    = useState(true)
  const [useAgenticMethod,  setUseAgenticMethod]  = useState(false)
  const [experimentalMode,  setExperimentalMode]  = useState(false)

  // § Chart Setup
  const [chartPrompt,       setChartPrompt]       = useState('')
  const [chartType,         setChartType]         = useState('auto')
  const [reportFormatOpen,  setReportFormatOpen]  = useState(false)
  const [reportFormat,      setReportFormat]      = useState('')

  // § Recipients
  const [emailInput,    setEmailInput]    = useState('')
  const [emails,        setEmails]        = useState([])
  const [accessControl, setAccessControl] = useState('')

  // ── Prompt helpers ─────────────────────────────────────────────────────────

  function addPrompt()       { setPrompts(p => [...p, '']) }
  function removePrompt(i)   { setPrompts(p => p.filter((_, idx) => idx !== i)) }
  function updatePrompt(i,v) { setPrompts(p => p.map((x, idx) => idx === i ? v : x)) }

  // ── Exclusion date helpers ─────────────────────────────────────────────────

  function addExclusion() {
    if (exclusionInput && !exclusions.includes(exclusionInput))
      setExclusions(p => [...p, exclusionInput])
    setExclusionInput('')
  }

  // ── Email tag helpers ──────────────────────────────────────────────────────

  function addEmail() {
    const v = emailInput.trim()
    const valid = v && v.includes('@') && !emails.includes(v)
    if (valid) setEmails(p => [...p, v])
    setEmailInput('')
  }

  const canSave = title.trim().length > 0

  return (
    <div style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
      transition: sidebarTransition,
      background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
      }}>
        <button
          onClick={() => navigate('/reports')}
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

        <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>Cancel</Button>
        <Button size="sm" disabled={!canSave}>Save Report</Button>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* ── 1. Basic Info ────────────────────────────────────────────────── */}
          <Section title="Basic Info">
            <Field label="Title" required>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your report a name…"
                style={inputBase}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of what this report covers…"
                rows={3}
                style={{
                  ...inputBase, height: 'auto', padding: '10px 12px',
                  resize: 'vertical', lineHeight: 1.6,
                }}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </Field>
          </Section>

          {/* ── 2. Prompts ───────────────────────────────────────────────────── */}
          <Section title="Prompts">
            {prompts.map((p, i) => (
              <Field key={i} label={prompts.length > 1 ? `Prompt ${i + 1}` : 'Report Prompt'}>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={p}
                    onChange={e => updatePrompt(i, e.target.value)}
                    maxLength={5000}
                    placeholder="Describe what this prompt should analyze or generate…"
                    rows={4}
                    style={{
                      ...inputBase, height: 'auto', padding: '10px 12px 30px',
                      resize: 'vertical', lineHeight: 1.6,
                    }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                  {/* Counter + remove */}
                  <div style={{
                    position: 'absolute', bottom: 8, left: 10, right: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    pointerEvents: 'none',
                  }}>
                    <span style={{
                      fontSize: 10, fontFamily: "'Byrd', sans-serif",
                      color: p.length > 4500 ? 'var(--c100)' : 'var(--text-muted)',
                      transition: 'color 150ms ease',
                    }}>
                      {p.length.toLocaleString()} / 5,000
                    </span>
                    {prompts.length > 1 && (
                      <button
                        onClick={() => removePrompt(i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'all',
                          fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
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
            ))}

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

          {/* ── 3. Configuration ─────────────────────────────────────────────── */}
          <Section title="Configuration">

            <Field label="Frequency">
              <SegControl
                options={[
                  { value: 'hourly',  label: 'Hourly'  },
                  { value: 'daily',   label: 'Daily'   },
                  { value: 'weekly',  label: 'Weekly'  },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                value={frequency}
                onChange={setFrequency}
              />
            </Field>

            <Field label="Execution Time">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle checked={execEnabled} onChange={setExecEnabled} />
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
                    onChange={e => setExecTime(e.target.value)}
                    style={{ ...inputBase, width: 130, accentColor: 'var(--b100)' }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                )}
              </div>
            </Field>

            <Field label="Lookback Period">
              <PillRadio
                options={[1, 3, 5, 7, 30, 60, 90, 180, 365]}
                value={lookback}
                onChange={setLookback}
              />
            </Field>

            <Field label="Exclusions" hint="— skip report on specific dates (optional)">
              {exclusions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {exclusions.map(d => (
                    <Tag key={d} label={d} onRemove={() => setExclusions(p => p.filter(x => x !== d))} />
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="date"
                  value={exclusionInput}
                  onChange={e => setExclusionInput(e.target.value)}
                  style={{ ...inputBase, width: 180, accentColor: 'var(--text-secondary)' }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                <button
                  onClick={addExclusion}
                  disabled={!exclusionInput}
                  style={{
                    height: 36, padding: '0 14px', borderRadius: 8,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-active)', cursor: exclusionInput ? 'pointer' : 'default',
                    fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                    opacity: exclusionInput ? 1 : 0.4, transition: 'opacity 150ms ease',
                  }}
                >
                  Add date
                </button>
              </div>
            </Field>

            <Field label="Revisions" hint="(optional)">
              <input
                value={revisions}
                onChange={e => setRevisions(e.target.value)}
                placeholder="Search or describe revision instructions…"
                style={inputBase}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </Field>
          </Section>

          {/* ── 4. Options ───────────────────────────────────────────────────── */}
          <Section title="Options">
            <div style={{ margin: '-8px 0' }}>
              <ToggleRow label="Stick to template?"   checked={stickToTemplate}  onChange={setStickToTemplate} />
              <ToggleRow label="Is AI Accessible"     checked={isAIAccessible}   onChange={setIsAIAccessible} />
              <ToggleRow label="Use Agentic Method?"  checked={useAgenticMethod} onChange={setUseAgenticMethod} />
              <ToggleRow
                label="Experimental Mode"
                subtext="Enable cutting-edge AI features"
                checked={experimentalMode}
                onChange={setExperimentalMode}
                noBorder
              />
            </div>
          </Section>

          {/* ── 5. Chart Setup ───────────────────────────────────────────────── */}
          <Section title="Chart Setup">

            <Field label="Chart Prompt">
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={chartPrompt}
                  onChange={e => setChartPrompt(e.target.value)}
                  placeholder="Describe how the chart should visualize the data…"
                  style={{ ...inputBase, flex: 1 }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                <Button variant="ghost" size="sm" disabled={!chartPrompt.trim()}>
                  Preview
                </Button>
              </div>
            </Field>

            <Field label="Chart Type">
              <SegControl
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'line', label: 'Line' },
                  { value: 'bar',  label: 'Bar'  },
                  { value: 'pie',  label: 'Pie'  },
                ]}
                value={chartType}
                onChange={setChartType}
              />
            </Field>

            <Field label="Report Format" hint="(optional)">
              <div style={{
                border: '1px solid var(--border-input)',
                borderRadius: 8, overflow: 'hidden',
              }}>
                {/* Trigger */}
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

                {/* Dropdown options */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: reportFormatOpen ? 160 : 0,
                  transition: 'max-height 200ms ease',
                  borderTop: reportFormatOpen ? '1px solid var(--border-default)' : 'none',
                }}>
                  {['pdf', 'csv', 'json', 'html'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => { setReportFormat(fmt); setReportFormatOpen(false) }}
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

          {/* ── 6. Recipients ────────────────────────────────────────────────── */}
          <Section title="Recipients">

            <Field label="Notify by Email">
              {emails.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {emails.map(e => (
                    <Tag key={e} label={e} onRemove={() => setEmails(p => p.filter(x => x !== e))} />
                  ))}
                </div>
              )}
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addEmail() }
                }}
                placeholder="name@company.com — press Enter to add"
                style={inputBase}
                onFocus={focusBorder} onBlur={blurBorder}
              />
              <span style={{
                fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                marginTop: -2,
              }}>
                Press Enter or comma to add multiple addresses
              </span>
            </Field>

            <Field label="Access Control" hint="— who can see and edit this report (optional)">
              <input
                value={accessControl}
                onChange={e => setAccessControl(e.target.value)}
                placeholder="Search people or teams…"
                style={inputBase}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </Field>
          </Section>

          {/* Bottom breathing room */}
          <div style={{ height: 48 }} />
        </div>
      </div>
    </div>
  )
}
