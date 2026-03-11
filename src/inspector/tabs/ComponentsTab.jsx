import { useState, useEffect } from 'react'
import { T } from '../theme.js'
import { COMPONENT_DEFS } from '../data/componentDefs.jsx'
import { tokenize } from '../utils/syntaxHighlight.js'
import * as Icons from '../../components/icons/index.jsx'

// ── Syntax-highlighted code block ─────────────────────────────────────────────

const SYNTAX_COLOR = {
  keyword:   T.syntaxKeyword,
  component: T.syntaxComponent,
  prop:      T.syntaxProp,
  string:    T.syntaxString,
  brace:     T.syntaxBrace,
  comment:   T.textSubtle,
  plain:     T.syntaxPlain,
}

function CodeBlock({ code }) {
  const tokens = tokenize(code)
  return (
    <pre className="smooth-scroll" style={{
      margin:       0,
      padding:      '12px 14px',
      background:   T.bg,
      borderRadius: T.radiusSm,
      border:       `1px solid ${T.border}`,
      overflowX:    'auto',
      fontSize:     11,
      lineHeight:   1.7,
      fontFamily:   T.fontMono,
    }}>
      <code>
        {tokens.map((tok, i) => (
          <span key={i} style={{ color: SYNTAX_COLOR[tok.type] ?? T.syntaxPlain }}>
            {tok.value}
          </span>
        ))}
      </code>
    </pre>
  )
}

// ── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ title, count }) {
  return (
    <div style={{
      display:       'flex',
      alignItems:    'center',
      gap:           6,
      marginBottom:  8,
      marginTop:     16,
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textSubtle, fontFamily: T.fontMono }}>
        {title}
      </span>
      {count != null && (
        <span style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono, background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 99, padding: '0 5px', lineHeight: '16px' }}>
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  )
}

// ── Breakdown: icon cell ──────────────────────────────────────────────────────

function BreakdownIcon({ name }) {
  const Component = Icons[name]
  if (!Component) return null
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      gap:            5,
      padding:        '8px 4px 6px',
      background:     T.bgElevated,
      borderRadius:   T.radiusSm,
      border:         `1px solid ${T.border}`,
      minWidth:       56,
    }}>
      <div style={{ color: T.textDefault, display: 'flex' }}>
        <Component />
      </div>
      <span style={{ fontSize: 8, color: T.textSubtle, fontFamily: T.fontMono, textAlign: 'center', lineHeight: 1.2 }}>
        {name.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim()}
      </span>
    </div>
  )
}

// ── Breakdown: color swatch ───────────────────────────────────────────────────

function BreakdownSwatch({ name, hex }) {
  const [copied, setCopied] = useState(false)

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const textOnSwatch = lum > 0.45 ? '#181818' : '#ffffff'

  return (
    <div
      title={`${name} · ${hex}`}
      onClick={() => { navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1400) }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', minWidth: 44 }}
    >
      <div style={{
        width: 36, height: 36,
        borderRadius: T.radiusSm,
        background: hex,
        border: (hex === '#FFFFFF' || hex.toLowerCase() === '#ffffff') ? `1px solid ${T.borderMuted}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: textOnSwatch,
        fontWeight: 700,
      }}>
        {copied ? '✓' : ''}
      </div>
      <span style={{ fontSize: 8, color: T.textSubtle, fontFamily: T.fontMono, textAlign: 'center', lineHeight: 1.2, maxWidth: 52 }}>
        {name}
      </span>
      <span style={{ fontSize: 8, color: T.textSubtle, fontFamily: T.fontMono, opacity: 0.7 }}>
        {hex.toUpperCase()}
      </span>
    </div>
  )
}

// ── Breakdown: sub-component pill (clickable → navigate) ─────────────────────

function SubComponentPill({ name, onNavigate }) {
  const known = !!COMPONENT_DEFS[name]
  return (
    <button
      onClick={() => known && onNavigate(name)}
      style={{
        padding:      '4px 10px',
        borderRadius: 99,
        border:       `1px solid ${known ? T.brand : T.border}`,
        background:   known ? 'rgba(255,112,86,0.08)' : 'none',
        color:        known ? T.brand : T.textMuted,
        fontSize:     10,
        fontFamily:   T.fontMono,
        cursor:       known ? 'pointer' : 'default',
        display:      'flex',
        alignItems:   'center',
        gap:          4,
        transition:   'background 120ms ease',
      }}
      title={known ? `Navigate to ${name}` : `${name} is not in the inspector registry`}
    >
      {name}
      {known && (
        <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 3h8v8M3 13l10-10"/>
        </svg>
      )}
    </button>
  )
}

// ── Props table ────────────────────────────────────────────────────────────────

function PropsTable({ propDefs }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: T.textMuted, fontSize: 9, fontFamily: T.fontMono,
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: 0, marginTop: 16, marginBottom: open ? 8 : 0,
        }}
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor"
          style={{ transition: 'transform 150ms ease', transform: open ? 'rotate(0)' : 'rotate(-90deg)' }}>
          <path d="M5 7L1 3h8L5 7z"/>
        </svg>
        Props ({propDefs.length})
      </button>
      {open && (
        <div className="smooth-scroll" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: T.fontMono }}>
            <thead>
              <tr>
                {['Prop', 'Type', 'Default'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', color: T.textSubtle, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propDefs.map(p => (
                <tr key={p.name}>
                  <td style={{ padding: '4px 8px', color: T.syntaxProp,      borderBottom: `1px solid ${T.border}` }}>{p.name}</td>
                  <td style={{ padding: '4px 8px', color: T.syntaxComponent,  borderBottom: `1px solid ${T.border}` }}>{p.type}</td>
                  <td style={{ padding: '4px 8px', color: T.syntaxString,     borderBottom: `1px solid ${T.border}` }}>{p.default}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Handoff panel ─────────────────────────────────────────────────────────────

function HandoffPanel({ def }) {
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied]         = useState(false)
  const [copiedInstall, setCopiedInstall] = useState(false)

  if (!def.files?.length) return null

  const file = def.files[activeFile]

  function copySource() {
    navigator.clipboard.writeText(file.src)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyInstall() {
    const cmd = `npm install ${def.npm.join(' ')}`
    navigator.clipboard.writeText(cmd)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  return (
    <div style={{ marginTop: 16 }}>
      <SectionLabel title="Handoff" />

      {/* npm install banner */}
      {def.npm?.length > 0 && (
        <div style={{
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
          gap:          10,
          padding:      '8px 12px',
          marginBottom: 10,
          background:   'rgba(23,121,247,0.08)',
          border:       `1px solid rgba(23,121,247,0.2)`,
          borderRadius: T.radiusSm,
        }}>
          <div>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#4594F9', fontFamily: T.fontMono, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              npm install required
            </span>
            <div style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fontMono, marginTop: 2 }}>
              {def.npm.join('  ')}
            </div>
          </div>
          <button
            onClick={copyInstall}
            style={{
              padding: '4px 10px', borderRadius: T.radiusSm, fontSize: 10,
              fontFamily: T.fontMono, cursor: 'pointer', flexShrink: 0,
              border: `1px solid rgba(23,121,247,0.3)`,
              background: copiedInstall ? 'rgba(75,163,115,0.15)' : 'rgba(23,121,247,0.12)',
              color: copiedInstall ? '#4BA373' : '#4594F9',
              transition: 'all 120ms ease',
            }}
          >
            {copiedInstall ? '✓ copied' : 'Copy install'}
          </button>
        </div>
      )}

      {/* File tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
        {def.files.map((f, i) => {
          const isActive = i === activeFile
          const filename = f.path.split('/').pop()
          return (
            <button
              key={f.path}
              onClick={() => { setActiveFile(i); setCopied(false) }}
              style={{
                padding: '4px 10px', borderRadius: `${T.radiusSm}px ${T.radiusSm}px 0 0`,
                fontSize: 10, fontFamily: T.fontMono, cursor: 'pointer',
                border:      `1px solid ${isActive ? T.borderMuted : T.border}`,
                borderBottom: isActive ? `1px solid ${T.bgElevated}` : `1px solid ${T.border}`,
                background:  isActive ? T.bgElevated : T.bg,
                color:       isActive ? T.textDefault : T.textSubtle,
                transition:  'all 120ms ease',
                marginBottom: -1,
                position:    'relative',
                zIndex:      isActive ? 1 : 0,
              }}
            >
              {filename}
            </button>
          )
        })}
      </div>

      {/* Source code box */}
      <div style={{
        border:       `1px solid ${T.borderMuted}`,
        borderRadius: `0 ${T.radius}px ${T.radius}px ${T.radius}px`,
        overflow:     'hidden',
        position:     'relative',
      }}>
        {/* Toolbar */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '6px 12px',
          background:     T.bgElevated,
          borderBottom:   `1px solid ${T.border}`,
        }}>
          <span style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.fontMono }}>
            {file.path}
          </span>
          <button
            onClick={copySource}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: T.radiusSm,
              fontSize: 10, fontFamily: T.fontMono, cursor: 'pointer',
              border:     `1px solid ${copied ? 'rgba(75,163,115,0.4)' : T.border}`,
              background: copied ? 'rgba(75,163,115,0.12)' : T.bg,
              color:      copied ? '#4BA373' : T.textMuted,
              transition: 'all 150ms ease',
            }}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy source
              </>
            )}
          </button>
        </div>

        {/* Code */}
        <div className="smooth-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
          <CodeBlock code={file.src} />
        </div>
      </div>

      {/* File checklist */}
      {def.files.length > 1 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textSubtle, fontFamily: T.fontMono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Files to copy into your project
          </div>
          {def.files.map((f, i) => (
            <div key={f.path} style={{
              display:     'flex',
              alignItems:  'center',
              gap:         8,
              padding:     '5px 8px',
              borderRadius: T.radiusSm,
              background:  i === activeFile ? 'rgba(255,112,86,0.06)' : 'none',
              cursor:      'pointer',
            }} onClick={() => setActiveFile(i)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i === activeFile ? T.brand : T.textSubtle} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 10, color: i === activeFile ? T.brand : T.textMuted, fontFamily: T.fontMono }}>
                {f.path}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Full component detail panel ────────────────────────────────────────────────

function ShareComponentButton({ name }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    // Build URL with current page/tab params preserved, but component fixed to this one
    const p = new URLSearchParams(window.location.hash.slice(1))
    p.set('tab', 'Components')
    p.set('component', name)
    p.set('state', '0')
    const url = window.location.origin + window.location.pathname + '#' + p.toString()
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copyLink}
      title={`Copy direct link to ${name}`}
      style={{
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding:    '3px 5px',
        borderRadius: T.radiusSm,
        border:     `1px solid ${copied ? 'rgba(75,163,115,0.4)' : T.border}`,
        background: copied ? 'rgba(75,163,115,0.1)' : 'none',
        color:      copied ? '#4BA373' : T.textSubtle,
        cursor:     'pointer',
        transition: 'all 150ms ease',
        lineHeight: 1,
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = T.borderMuted; e.currentTarget.style.color = T.textDefault } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSubtle } }}
    >
      {copied ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      )}
    </button>
  )
}

function ComponentDetail({ name, def, onNavigate, stateIdx, onStateChange }) {
  const [previewKey, setPreviewKey] = useState(0)

  const activeState = def.states[stateIdx] ?? def.states[0]
  const bd = def.breakdown ?? {}

  function selectState(i) {
    if (i === stateIdx) return
    onStateChange(i)
    setPreviewKey(k => k + 1)
  }

  return (
    <div style={{ paddingBottom: 24 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.textDefault, fontFamily: T.fontMono }}>
            {name}
          </span>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: T.brand, background: 'rgba(255,112,86,0.1)', border: `1px solid rgba(255,112,86,0.2)`,
            borderRadius: T.radiusSm, padding: '2px 6px',
          }}>
            {def.tier}
          </span>
          <ShareComponentButton name={name} />
        </div>
        <p style={{ margin: 0, fontSize: 11, color: T.textMuted, fontFamily: T.fontMono, lineHeight: 1.5 }}>
          {def.description}
        </p>
      </div>

      {/* ── State pills ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {def.states.map((s, i) => {
          const isActive = i === stateIdx
          return (
            <button
              key={s.label}
              onClick={() => selectState(i)}
              style={{
                padding: '3px 9px', borderRadius: 99, fontSize: 10, fontFamily: T.fontMono,
                border:      `1px solid ${isActive ? T.brand : T.border}`,
                background:  isActive ? 'rgba(255,112,86,0.15)' : 'none',
                color:       isActive ? T.brand : T.textMuted,
                cursor:      'pointer', transition: 'all 120ms ease',
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* ── Live preview — grows to fit the component's rendered state ── */}
      <div key={previewKey} style={{
        border:       `1px solid ${T.border}`,
        borderRadius: T.radius,
        overflow:     'hidden',
        marginBottom: 4,
        animation:    'inspector-preview-flash 180ms ease',
      }}>
        {activeState.preview
          ? activeState.preview()
          : def.render
            ? def.render(activeState.props)
            : null}
      </div>
      <style>{`
        @keyframes inspector-preview-flash { from { opacity: 0.4 } to { opacity: 1 } }
      `}</style>
      <p style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono, margin: '4px 0 0 2px' }}>
        {activeState.label} state · pointer events disabled in preview
      </p>

      {/* ── Breakdown: Icons ── */}
      {bd.icons?.length > 0 && (
        <>
          <SectionLabel title="Icons in use" count={bd.icons.length} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bd.icons.map(n => <BreakdownIcon key={n} name={n} />)}
          </div>
        </>
      )}

      {/* ── Breakdown: Colors ── */}
      {bd.colors?.length > 0 && (
        <>
          <SectionLabel title="Colors" count={bd.colors.length} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {bd.colors.map(c => <BreakdownSwatch key={c.name} {...c} />)}
          </div>
          <p style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono, margin: '6px 0 0' }}>
            Click any swatch to copy hex.
          </p>
        </>
      )}

      {/* ── Breakdown: Sub-components ── */}
      {bd.subComponents?.length > 0 && (
        <>
          <SectionLabel title="Sub-components" count={bd.subComponents.length} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bd.subComponents.map(n => (
              <SubComponentPill key={n} name={n} onNavigate={onNavigate} />
            ))}
          </div>
        </>
      )}

      {/* ── Breakdown: Notes / flags ── */}
      {bd.notes?.length > 0 && (
        <>
          <SectionLabel title="Notes" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bd.notes.map((note, i) => (
              <div key={i} style={{
                display: 'flex', gap: 6, alignItems: 'flex-start',
                padding: '6px 8px',
                background: note.startsWith('FLAG') ? 'rgba(240,136,62,0.06)' : T.bgElevated,
                border: `1px solid ${note.startsWith('FLAG') ? 'rgba(240,136,62,0.2)' : T.border}`,
                borderRadius: T.radiusSm,
              }}>
                <span style={{ color: note.startsWith('FLAG') ? T.syntaxBrace : T.textSubtle, flexShrink: 0, fontSize: 10 }}>
                  {note.startsWith('FLAG') ? '⚠' : '›'}
                </span>
                <span style={{ fontSize: 10, color: note.startsWith('FLAG') ? '#F0C674' : T.textMuted, fontFamily: T.fontMono, lineHeight: 1.5 }}>
                  {note}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Handoff panel ── */}
      <HandoffPanel def={def} />

      {/* ── Props table (collapsible) ── */}
      {def.props && <PropsTable propDefs={def.props} />}

    </div>
  )
}

// ── Hash utilities (local to ComponentsTab) ───────────────────────────────────

function readHashComponent() {
  try {
    const p = new URLSearchParams(window.location.hash.slice(1))
    return {
      component: p.get('component') || null,
      state:     parseInt(p.get('state') || '0', 10),
    }
  } catch { return { component: null, state: 0 } }
}

function writeHashComponentParams(updates) {
  try {
    const p = new URLSearchParams(window.location.hash.slice(1))
    // Make sure tab=Components is always present when we set a component
    p.set('tab', 'Components')
    Object.entries(updates).forEach(([k, v]) => {
      if (v != null) p.set(k, String(v)); else p.delete(k)
    })
    history.replaceState(null, '', '#' + p.toString())
  } catch {}
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export default function ComponentsTab() {
  const [discovered, setDiscovered] = useState([])
  const [selected, setSelected]     = useState(() => readHashComponent().component)
  const [stateIdx,  setStateIdx]    = useState(() => readHashComponent().state)

  function scan() {
    const nodes = document.querySelectorAll('[data-inspector]')
    const names = [...new Set([...nodes].map(n => n.getAttribute('data-inspector')))]
    const valid  = names.filter(name => COMPONENT_DEFS[name])
    setDiscovered(valid)
    setSelected(prev => prev ?? (valid.length > 0 ? valid[0] : null))
  }

  function handleSelect(name) {
    setSelected(name)
    setStateIdx(0)
    writeHashComponentParams({ component: name, state: 0 })
  }

  function handleStateChange(i) {
    setStateIdx(i)
    writeHashComponentParams({ state: i })
  }

  useEffect(() => {
    scan()
    // Re-scan whenever DOM nodes are added/removed (e.g. modals opening via portals)
    const obs = new MutationObserver(scan)
    obs.observe(document.body, { childList: true, subtree: true, attributeFilter: ['data-inspector'] })
    return () => obs.disconnect()
  }, [])

  if (discovered.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: T.textMuted, fontSize: 12, fontFamily: T.fontMono, lineHeight: 1.7 }}>
          No inspectable components found on this screen.
          <br />
          Components need a <span style={{ color: T.syntaxProp }}>data-inspector</span> attribute on their root element.
        </p>
      </div>
    )
  }

  const def = selected ? COMPONENT_DEFS[selected] : null

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Left column — component list ── */}
      <div className="smooth-scroll" style={{
        width:       156,
        flexShrink:  0,
        borderRight: `1px solid ${T.border}`,
        overflowY:   'auto',
        padding:     '12px 0',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textSubtle, fontFamily: T.fontMono, padding: '0 12px 8px' }}>
          On screen ({discovered.length})
        </div>

        {discovered.map(name => {
          const isActive = name === selected
          const d = COMPONENT_DEFS[name]
          return (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'flex-start',
                gap:           2,
                width:         '100%',
                padding:       '8px 12px',
                background:    isActive ? 'rgba(255,112,86,0.08)' : 'none',
                borderLeft:    isActive ? `2px solid ${T.brand}` : '2px solid transparent',
                border:        'none',
                cursor:        'pointer',
                textAlign:     'left',
                transition:    'background 120ms ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bgHover }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
            >
              <span style={{ fontSize: 12, fontFamily: T.fontMono, color: isActive ? T.textDefault : T.textMuted, fontWeight: isActive ? 600 : 400 }}>
                {name}
              </span>
              {d && (
                <span style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono }}>
                  {d.tier}
                  {d.breakdown?.icons?.length > 0 && ` · ${d.breakdown.icons.length} icons`}
                </span>
              )}
            </button>
          )
        })}

        {/* Divider: show all defined components even if not on current screen */}
        {Object.keys(COMPONENT_DEFS).filter(n => !discovered.includes(n)).length > 0 && (
          <>
            <div style={{ height: 1, background: T.border, margin: '8px 12px' }} />
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textSubtle, fontFamily: T.fontMono, padding: '0 12px 6px', opacity: 0.6 }}>
              Off screen
            </div>
            {Object.keys(COMPONENT_DEFS).filter(n => !discovered.includes(n)).map(name => {
              const isActive = name === selected
              const d = COMPONENT_DEFS[name]
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  style={{
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'flex-start',
                    gap:           2,
                    width:         '100%',
                    padding:       '7px 12px',
                    background:    isActive ? 'rgba(255,112,86,0.08)' : 'none',
                    borderLeft:    isActive ? `2px solid ${T.brand}` : '2px solid transparent',
                    border:        'none',
                    cursor:        'pointer',
                    textAlign:     'left',
                    opacity:       0.65,
                    transition:    'background 120ms ease, opacity 120ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; if (!isActive) e.currentTarget.style.background = T.bgHover }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.65'; if (!isActive) e.currentTarget.style.background = 'none' }}
                >
                  <span style={{ fontSize: 11, fontFamily: T.fontMono, color: isActive ? T.textDefault : T.textMuted, fontWeight: isActive ? 600 : 400 }}>
                    {name}
                  </span>
                  {d && (
                    <span style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono }}>
                      {d.tier}
                    </span>
                  )}
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* ── Right panel ── */}
      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', minWidth: 0 }}>
        {def ? (
          <ComponentDetail
            key={selected}
            name={selected}
            def={def}
            onNavigate={handleSelect}
            stateIdx={stateIdx}
            onStateChange={handleStateChange}
          />
        ) : (
          <p style={{ color: T.textMuted, fontSize: 12, fontFamily: T.fontMono }}>
            Select a component from the list.
          </p>
        )}
      </div>

    </div>
  )
}
