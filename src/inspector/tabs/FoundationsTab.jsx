import { useState } from 'react'
import { T } from '../theme.js'
import { COLOR_FAMILIES, TYPE_SCALE, KEYFRAMES } from '../data/tokenData.js'

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, children }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:         6,
          background:  'none',
          border:      'none',
          cursor:      'pointer',
          color:       T.textMuted,
          fontSize:    10,
          fontWeight:  600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily:  T.fontMono,
          padding:     '0 0 8px 0',
          width:       '100%',
          textAlign:   'left',
        }}
      >
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
          style={{ transition: 'transform 160ms ease', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <path d="M5 7L1 3h8L5 7z"/>
        </svg>
        {title}
      </button>
      {!collapsed && children}
    </div>
  )
}

// ── Color swatch ──────────────────────────────────────────────────────────────

function Swatch({ name, label, hex }) {
  const [copied, setCopied] = useState(false)

  function copyHex() {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  // Decide if label text should be light or dark based on luminance
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const textColor = lum > 0.5 ? '#181818' : '#ffffff'

  return (
    <div
      title={`${name} · ${hex}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}
      onClick={copyHex}
    >
      <div style={{
        width: 36, height: 36,
        borderRadius: T.radiusSm,
        background: hex,
        border: hex === '#FFFFFF' || hex === '#F4F3F1' || hex === '#FFFFFF' ? `1px solid ${T.borderMuted}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 100ms ease',
        fontSize: 8, color: textColor, fontWeight: 700,
      }}>
        {copied ? '✓' : ''}
      </div>
      <span style={{ fontSize: 9, color: T.textSubtle, fontFamily: T.fontMono, lineHeight: 1.2, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}

// ── Typography row ─────────────────────────────────────────────────────────────

function TypeRow({ token, label, size, lh, weight, use, caps }) {
  const displaySize = parseInt(size)
  // Clamp preview size so it doesn't overflow the panel
  const previewSize = Math.min(displaySize, 28)

  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          12,
      padding:      '8px 0',
      borderBottom: `1px solid ${T.border}`,
    }}>
      {/* Live text preview */}
      <div style={{
        width:       56,
        flexShrink:  0,
        fontSize:    previewSize,
        fontFamily:  "'Byrd', sans-serif",
        fontWeight:  weight,
        color:       T.textDefault,
        lineHeight:  1,
        textTransform: caps ? 'uppercase' : 'none',
        overflow:    'hidden',
        whiteSpace:  'nowrap',
      }}>
        Aa
      </div>
      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.brand, fontFamily: T.fontMono }}>{label}</span>
          <span style={{ fontSize: 9,  color: T.textSubtle, fontFamily: T.fontMono }}>{token}</span>
        </div>
        <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fontMono, marginTop: 2 }}>
          {size} / {lh} · w{weight}{caps ? ' · CAPS' : ''}
          <span style={{ marginLeft: 6, color: T.textSubtle }}>{use}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export default function FoundationsTab() {
  return (
    <div style={{ padding: 16 }}>

      {/* Colors */}
      <Section title="Colors">
        {COLOR_FAMILIES.map(family => (
          <div key={family.family} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.fontMono, marginBottom: 6 }}>
              {family.family}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {family.swatches.map(s => (
                <Swatch key={s.name} {...s} />
              ))}
            </div>
          </div>
        ))}
        <p style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.fontMono, marginTop: 4 }}>
          Click any swatch to copy its hex value.
        </p>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div style={{ marginBottom: 8 }}>
          {TYPE_SCALE.map(row => (
            <TypeRow key={row.token} {...row} />
          ))}
        </div>
        <p style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.fontMono, marginTop: 8 }}>
          All sizes use <strong style={{ color: T.textMuted }}>Byrd</strong> typeface. Previews are clamped to 28px for readability.
        </p>
      </Section>

      {/* Animations */}
      <Section title="Keyframes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {KEYFRAMES.map(kf => (
            <div key={kf.name} style={{
              display:      'flex',
              alignItems:   'center',
              gap:          10,
              padding:      '8px 10px',
              background:   T.bgElevated,
              borderRadius: T.radiusSm,
              border:       `1px solid ${T.border}`,
            }}>
              <span style={{ fontSize: 11, fontFamily: T.fontMono, color: T.syntaxProp, minWidth: 110, flexShrink: 0 }}>
                @{kf.name}
              </span>
              <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fontMono }}>
                {kf.description}
              </span>
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}
