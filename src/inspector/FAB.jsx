import { useState, useEffect } from 'react'
import { T } from './theme.js'

export default function FAB({ open, onClick }) {
  const [pulse, setPulse] = useState(true)

  // Stop the idle pulse after 3 cycles (~6 s)
  useEffect(() => {
    const id = setTimeout(() => setPulse(false), 6000)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      {/* Pulse keyframe injected once */}
      <style>{`
        @keyframes inspector-fab-pulse {
          0%,100% { box-shadow: 0 4px 16px ${T.brandGlow}, 0 0 0 0 ${T.brandGlow}; }
          50%      { box-shadow: 0 4px 16px ${T.brandGlow}, 0 0 0 10px rgba(255,112,86,0); }
        }
      `}</style>

      <button
        title={open ? 'Close Inspector' : 'Open Design Inspector'}
        onClick={onClick}
        style={{
          position:     'fixed',
          bottom:       24,
          right:        24,
          zIndex:       T.fabZ,
          width:        44,
          height:       44,
          borderRadius: 12,
          background:   T.brand,
          border:       'none',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          boxShadow:    `0 4px 16px ${T.brandGlow}`,
          transition:   'transform 150ms ease, box-shadow 150ms ease',
          animation:    (!open && pulse) ? 'inspector-fab-pulse 2s ease-in-out 3' : 'none',
          outline:      'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {open ? <CloseIcon /> : <LayersIcon />}
      </button>
    </>
  )
}

// ── Inline icons (self-contained, no import) ──────────────────────────────────

function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/>
      <polyline points="2 15 12 21.5 22 15"/>
      <polyline points="2 11.5 12 18 22 11.5"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
