import { useState, useEffect } from 'react'
import { T } from './theme.js'
import HearLogo from '../components/HearLogo.jsx'
import FoundationsTab from './tabs/FoundationsTab.jsx'
import IconsTab       from './tabs/IconsTab.jsx'
import ComponentsTab  from './tabs/ComponentsTab.jsx'

const TABS = ['Foundations', 'Icons', 'Components']

export default function InspectorDrawer({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Foundations')

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Re-scan components whenever drawer opens
  const [scanKey, setScanKey] = useState(0)
  useEffect(() => { if (open) setScanKey(k => k + 1) }, [open])

  return (
    <>
      {/* Backdrop scrim */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(0,0,0,0.45)',
          zIndex:     T.scrimZ,
          opacity:    open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position:    'fixed',
          top:         0,
          right:       0,
          bottom:      0,
          width:       `min(${T.drawerWidth}px, 100vw)`,
          zIndex:      T.drawerZ,
          background:  T.bg,
          borderLeft:  `1px solid ${T.border}`,
          boxShadow:   '-4px 0 40px rgba(0,0,0,0.5)',
          display:     'flex',
          flexDirection: 'column',
          transform:   open ? 'translateX(0)' : 'translateX(100%)',
          transition:  'transform 280ms cubic-bezier(0.22,1,0.36,1)',
          fontFamily:  T.fontMono,
          overflow:    'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          height:        48,
          borderBottom:  `1px solid ${T.border}`,
          display:       'flex',
          alignItems:    'center',
          gap:           10,
          padding:       '0 16px',
          flexShrink:    0,
        }}>
          <HearLogo className="w-5 h-4" style={{ flexShrink: 0 }} />
          <span style={{ color: T.textDefault, fontSize: 13, fontWeight: 600, letterSpacing: '0.01em' }}>
            Design Inspector
          </span>
          <span style={{
            marginLeft: 6,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: T.brand,
            background: `rgba(255,112,86,0.12)`,
            border: `1px solid rgba(255,112,86,0.25)`,
            borderRadius: 4,
            padding: '2px 6px',
          }}>
            DEV
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: T.textMuted,
              padding: 4,
              display: 'flex',
              borderRadius: T.radiusSm,
              transition: 'color 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.textDefault }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textMuted }}
            title="Close (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display:       'flex',
          borderBottom:  `1px solid ${T.border}`,
          padding:       '0 16px',
          flexShrink:    0,
          gap:           4,
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding:       '10px 10px',
                  fontSize:      12,
                  fontWeight:    isActive ? 600 : 400,
                  color:         isActive ? T.brand : T.textMuted,
                  background:    'none',
                  border:        'none',
                  borderBottom:  isActive ? `2px solid ${T.brand}` : '2px solid transparent',
                  marginBottom:  -1,
                  cursor:        'pointer',
                  transition:    'color 120ms ease',
                  fontFamily:    T.fontMono,
                  letterSpacing: '0.02em',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {activeTab === 'Foundations'  && <FoundationsTab />}
          {activeTab === 'Icons'        && <IconsTab />}
          {activeTab === 'Components'   && <ComponentsTab key={scanKey} />}
        </div>
      </div>
    </>
  )
}
