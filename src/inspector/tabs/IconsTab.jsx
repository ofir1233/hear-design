import { useState } from 'react'
import { T } from '../theme.js'
import { downloadIconAsSvg } from '../utils/svgDownload.jsx'
import * as Icons from '../../components/icons/index.jsx'

// Build the registry once at module parse time
const ICON_REGISTRY = Object.entries(Icons).map(([name, Component]) => ({ name, Component }))

function IconCell({ name, Component }) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function handleDownload(e) {
    e.stopPropagation()
    setDownloading(true)
    try {
      await downloadIconAsSvg(Component, name)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 1800)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            6,
        padding:        '10px 8px 8px',
        borderRadius:   T.radius,
        border:         `1px solid ${T.border}`,
        background:     T.bgElevated,
        transition:     'border-color 150ms ease, background 150ms ease',
        cursor:         'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = T.borderMuted
        e.currentTarget.style.background  = T.bgHover
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = T.border
        e.currentTarget.style.background  = T.bgElevated
      }}
    >
      {/* Icon preview */}
      <div style={{
        width:          44,
        height:         44,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          T.textDefault,
        background:     T.bg,
        borderRadius:   T.radiusSm,
      }}>
        <Component />
      </div>

      {/* Name */}
      <span style={{
        fontSize:    9,
        color:       T.textMuted,
        fontFamily:  T.fontMono,
        textAlign:   'center',
        lineHeight:  1.3,
        wordBreak:   'break-all',
        maxWidth:    72,
      }}>
        {name.replace('Icon', '')}
      </span>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            3,
          padding:        '3px 7px',
          borderRadius:   T.radiusSm,
          border:         `1px solid ${T.border}`,
          background:     'none',
          color:          downloaded ? '#4BA373' : T.textMuted,
          fontSize:       9,
          fontFamily:     T.fontMono,
          cursor:         downloading ? 'wait' : 'pointer',
          transition:     'color 150ms ease, border-color 150ms ease',
          whiteSpace:     'nowrap',
        }}
        onMouseEnter={e => {
          if (!downloading) {
            e.currentTarget.style.color       = downloaded ? '#4BA373' : T.textDefault
            e.currentTarget.style.borderColor = T.borderMuted
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color       = downloaded ? '#4BA373' : T.textMuted
          e.currentTarget.style.borderColor = T.border
        }}
      >
        {downloaded ? '✓ saved' : downloading ? '…' : '↓ SVG'}
      </button>
    </div>
  )
}

export default function IconsTab() {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? ICON_REGISTRY.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    : ICON_REGISTRY

  return (
    <div style={{ padding: 16 }}>
      {/* Search */}
      <div style={{ marginBottom: 14, position: 'relative' }}>
        <span style={{
          position:  'absolute',
          left:      10,
          top:       '50%',
          transform: 'translateY(-50%)',
          color:     T.textSubtle,
          pointerEvents: 'none',
          fontSize:  12,
        }}>
          ⌕
        </span>
        <input
          type="text"
          placeholder="Filter icons…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width:        '100%',
            height:       32,
            paddingLeft:  28,
            paddingRight: 10,
            borderRadius: T.radiusSm,
            border:       `1px solid ${T.border}`,
            background:   T.bgElevated,
            color:        T.textDefault,
            fontSize:     12,
            fontFamily:   T.fontMono,
            outline:      'none',
            boxSizing:    'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = T.brand }}
          onBlur={e  => { e.currentTarget.style.borderColor = T.border }}
        />
      </div>

      {/* Count */}
      <p style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.fontMono, margin: '0 0 12px' }}>
        {filtered.length} icon{filtered.length !== 1 ? 's' : ''}
        {query ? ` matching "${query}"` : ' in registry'}
      </p>

      {/* Grid */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 8,
      }}>
        {filtered.map(({ name, Component }) => (
          <IconCell key={name} name={name} Component={Component} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: T.textMuted, fontSize: 12, fontFamily: T.fontMono, textAlign: 'center', paddingTop: 24 }}>
          No icons match "{query}"
        </p>
      )}
    </div>
  )
}
