import { useState, useEffect } from 'react'
import { T } from './theme.js'
import HearLogo from '../components/HearLogo.jsx'
import FoundationsTab from './tabs/FoundationsTab.jsx'
import IconsTab       from './tabs/IconsTab.jsx'
import ComponentsTab  from './tabs/ComponentsTab.jsx'

const TABS = ['Foundations', 'Icons', 'Components']

const NAV_PAGES = [
  { id: 'dashboard',   label: 'Dashboard'   },
  { id: 'data',        label: 'Data'        },
  { id: 'reports',     label: 'Reports'     },
  { id: 'signals',     label: 'Signals'     },
  { id: 'alerts',      label: 'Alerts'      },
  { id: 'compliance',  label: 'Compliance'  },
  { id: 'agent-eval',  label: 'Agent eval'  },
  { id: 'knowledge',   label: 'Knowledge'   },
  { id: 'ai-task',     label: 'AI task'     },
  { id: 'customers',   label: 'Customers'   },
  { id: 'settings',    label: 'Settings'    },
]

export default function InspectorDrawer({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Foundations')
  const [activePage, setActivePage] = useState(() => window.__hearActivePage || 'dashboard')

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Sync activePage with main app
  useEffect(() => {
    function handler(e) { setActivePage(e.detail) }
    window.addEventListener('hear:nav-changed', handler)
    return () => window.removeEventListener('hear:nav-changed', handler)
  }, [])

  // Re-scan components whenever drawer opens
  const [scanKey, setScanKey] = useState(0)
  useEffect(() => { if (open) setScanKey(k => k + 1) }, [open])

  function handlePageNav(pageId) {
    window.dispatchEvent(new CustomEvent('hear:nav', { detail: pageId }))
    setActiveTab('Components')
    // Re-scan after page renders
    setTimeout(() => setScanKey(k => k + 1), 200)
  }

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
        className="hear-inspector"
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

        {/* ── Page nav strip ── */}
        <div className="smooth-scroll" style={{
          display:       'flex',
          gap:           2,
          padding:       '6px 12px',
          borderBottom:  `1px solid ${T.border}`,
          flexShrink:    0,
          overflowX:     'auto',
          overflowY:     'hidden',
        }}>
          {NAV_PAGES.map(p => {
            const isActive = activePage === p.id
            return (
              <button
                key={p.id}
                onClick={() => handlePageNav(p.id)}
                style={{
                  padding:       '3px 9px',
                  fontSize:      11,
                  fontWeight:    isActive ? 600 : 400,
                  color:         isActive ? T.brand : T.textMuted,
                  background:    isActive ? `rgba(255,112,86,0.12)` : 'none',
                  border:        isActive ? `1px solid rgba(255,112,86,0.25)` : '1px solid transparent',
                  borderRadius:  99,
                  cursor:        'pointer',
                  whiteSpace:    'nowrap',
                  transition:    'color 120ms ease, background 120ms ease',
                  fontFamily:    T.fontMono,
                  flexShrink:    0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.textDefault }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.textMuted }}
              >
                {p.label}
              </button>
            )
          })}
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
        <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {activeTab === 'Foundations'  && <FoundationsTab />}
          {activeTab === 'Icons'        && <IconsTab />}
          {activeTab === 'Components'   && <ComponentsTab key={scanKey} />}
        </div>
      </div>
    </>
  )
}
