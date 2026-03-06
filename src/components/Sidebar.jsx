import { useState, useEffect, useRef, useMemo } from 'react'
import HearLogo from './HearLogo.jsx'
import {
  HomeIcon, DataIcon, ReportsIcon, SignalsIcon, AlertsIcon, ComplianceIcon,
  AgentIcon, KnowledgeIcon, AiTaskIcon, CustomersIcon, SettingsIcon,
  BellIcon, ChevronIcon, CollapseArrow, DotsIcon,
  MoonIcon, AccessibilityIcon, LogoutIcon,
} from './icons'

// Sun icon — shown when dark mode is active (click to return to light)
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 2v10M2 7h10"/>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}

// Typewriter hook — types text character-by-character when active
function useTypewriter(text, active, speed = 72) {
  const [displayed, setDisplayed] = useState(active ? '' : text)
  useEffect(() => {
    if (!active) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed])
  return displayed
}

// Single session history item with 3-dot menu + rename
function SessionItem({ session, isActive, isNewlyNamed, onSelect, onDelete, onRename }) {
  const [hovered, setHovered]       = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [renaming, setRenaming]     = useState(false)
  const [renameVal, setRenameVal]   = useState(session.title)
  const menuRef  = useRef(null)
  const inputRef = useRef(null)

  const isPending    = !session.title  // empty title = waiting for LLM
  const displayTitle = useTypewriter(session.title, isNewlyNamed && !isPending)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Focus rename input
  useEffect(() => {
    if (renaming) {
      setRenameVal(session.title)
      setTimeout(() => { inputRef.current?.select() }, 0)
    }
  }, [renaming, session.title])

  function commitRename() {
    const trimmed = renameVal.trim()
    if (trimmed && trimmed !== session.title) onRename(session.id, trimmed)
    setRenaming(false)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        position:   'relative',
        display:    'flex',
        alignItems: 'center',
        padding:    '7px 12px',
        borderRadius: 8,
        background: isActive
          ? 'var(--bg-active)'
          : hovered ? 'var(--bg-active)' : 'transparent',
        cursor: 'pointer',
        marginBottom: 1,
        transition: 'background 150ms ease',
        gap: 6,
      }}
      onClick={() => { if (!renaming) onSelect(session.id) }}
    >
      {/* Title or rename input */}
      {renaming ? (
        <input
          ref={inputRef}
          value={renameVal}
          onChange={e => setRenameVal(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') setRenaming(false)
          }}
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1,
            fontSize: 13,
            color: 'var(--text-primary)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--color-brand)',
            borderRadius: 4,
            padding: '2px 6px',
            outline: 'none',
            userSelect: 'text',
            WebkitUserSelect: 'text',
          }}
        />
      ) : isPending ? (
        /* Pulsing dots while waiting for LLM title */
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'var(--text-muted)',
              display: 'inline-block',
              animation: `pending-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </span>
      ) : (
        <span style={{
          flex: 1,
          fontSize: 13,
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: session.is_welcome ? 500 : 400,
        }}>
          {displayTitle}
        </span>
      )}

      {/* 3-dot button — shows on hover or when menu open */}
      {!renaming && (hovered || menuOpen) && (
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '2px 2px',
              display: 'flex', alignItems: 'center', borderRadius: 4,
              transition: 'color 120ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <DotsIcon />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div style={{
              position:     'absolute',
              top:          'calc(100% + 4px)',
              right:        0,
              background:   'var(--bg-elevated)',
              border:       '1px solid var(--border-default)',
              borderRadius: 8,
              boxShadow:    '0 8px 24px rgba(0,0,0,0.18)',
              minWidth:     130,
              zIndex:       400,
              overflow:     'hidden',
            }}>
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(false); setRenaming(true) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 12px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13,
                  textAlign: 'left', transition: 'background 120ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <PencilIcon /> Rename
              </button>
              <div style={{ height: 1, background: 'var(--border-input)', margin: '0 8px' }} />
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete(session.id) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 12px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: '#e05252', fontSize: 13,
                  textAlign: 'left', transition: 'background 120ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,82,82,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <TrashIcon /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StorybookDisabledButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <a
        href={import.meta.env.DEV ? 'http://localhost:6006' : '/storybook/'}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          gap:            10,
          padding:        '8px 12px',
          borderRadius:   8,
          background:     'transparent',
          color:          'var(--text-muted)',
          fontSize:       13.5,
          fontWeight:     400,
          textDecoration: 'none',
          userSelect:     'none',
        }}
      >
        {/* Hear wave mark — same size as other nav icons */}
        <svg width="16" height="16" viewBox="0 0 69 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="currentColor"/>
        </svg>
        <span>Storybook</span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
          background: 'var(--bg-active)', color: 'var(--text-muted)',
          lineHeight: 1.4, flexShrink: 0, marginLeft: 'auto',
        }}>
          DEV
        </span>
      </a>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position:     'absolute',
          bottom:       'calc(100% + 6px)',
          left:         '50%',
          transform:    'translateX(-50%)',
          background:   'var(--text-primary)',
          color:        'var(--bg-canvas)',
          fontSize:     12,
          fontWeight:   400,
          lineHeight:   1.4,
          padding:      '6px 10px',
          borderRadius: 6,
          whiteSpace:   'nowrap',
          boxShadow:    '0 4px 16px rgba(0,0,0,0.35)',
          pointerEvents:'none',
          zIndex:       300,
        }}>
          {import.meta.env.DEV ? 'Open Storybook on localhost:6006' : 'Open Storybook'}
          <div style={{
            position:        'absolute',
            top:             '100%',
            left:            '50%',
            transform:       'translateX(-50%)',
            width:           0, height: 0,
            borderLeft:      '5px solid transparent',
            borderRight:     '5px solid transparent',
            borderTopColor:  'var(--text-primary)',
            borderTopWidth:  '5px',
            borderTopStyle:  'solid',
          }} />
        </div>
      )}
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',        Icon: HomeIcon       },
  { id: 'data',        label: 'Data',              Icon: DataIcon       },
  { id: 'reports',     label: 'Reports',           Icon: ReportsIcon    },
  { id: 'signals',     label: 'Signals',           Icon: SignalsIcon    },
  { id: 'alerts',      label: 'Alerts',            Icon: AlertsIcon     },
  { id: 'compliance',  label: 'Compliance',        Icon: ComplianceIcon },
  { id: 'agent-eval',  label: 'Agent evaluation',  Icon: AgentIcon      },
  { id: 'knowledge',   label: 'Knowledge',         Icon: KnowledgeIcon  },
  { id: 'ai-task',     label: 'Ai task',           Icon: AiTaskIcon     },
  { id: 'customers',   label: 'Customers',         Icon: CustomersIcon  },
  { id: 'settings',    label: 'Settings',          Icon: SettingsIcon   },
]

const DESIGN_LAB = { id: '__design_lab__', label: 'Design Lab' }

export default function Sidebar({ isMobile = false, mobileOpen = false, onMobileClose, isDark = false, onThemeToggle, activeNav = 'dashboard', onNavChange, collapsed = false, onToggleCollapse, onSignOut, companyConfig = null, userId = '', onProjectChange, sessions = [], activeSessionId = null, newlyNamedId = null, onSelectSession, onDeleteSession, onRenameSession, onNewChat }) {
  const [historyOpen, setHistoryOpen]   = useState(true)
  const [historyAnim, setHistoryAnim]   = useState(null) // null | 'in' | 'out'
  const historyTimerRef = useRef(null)
  const [projectOpen, setProjectOpen]   = useState(false)
  const projectRef = useRef(null)

  const isDemo = !!(userId?.includes('@') && companyConfig)

  // Build project list from localStorage demo profiles, or fallback to Design Lab
  const projects = useMemo(() => {
    if (isDemo) {
      try {
        const cached = JSON.parse(localStorage.getItem(`hear-demo-profiles-${userId}`) || '[]')
        if (cached.length > 0) return cached.map(p => ({ id: p.id, label: p.name, profile: p }))
      } catch { /* fall through */ }
    }
    return [DESIGN_LAB]
  }, [isDemo, userId])

  const currentLabel = companyConfig?.companyName || 'Design Lab'
  const selectedProject = projects.find(p => p.label === currentLabel) ?? projects[0]

  useEffect(() => {
    if (!projectOpen) return
    function handleClick(e) {
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setProjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [projectOpen])

  function toggleHistory() {
    clearTimeout(historyTimerRef.current)
    if (historyOpen) {
      setHistoryAnim('out')
      const exitMs = Math.min(sessions.length * 35, 180) + 180
      historyTimerRef.current = setTimeout(() => { setHistoryOpen(false); setHistoryAnim(null) }, exitMs)
    } else {
      setHistoryOpen(true)
      setHistoryAnim('in')
      const enterMs = Math.min(sessions.length * 40, 200) + 220
      historyTimerRef.current = setTimeout(() => setHistoryAnim(null), enterMs)
    }
  }

  const isOpen = isMobile ? mobileOpen : !collapsed

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
          }}
        />
      )}

    <div data-inspector="Sidebar" style={{ display: 'flex', alignItems: 'stretch', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>

      {/* Sidebar panel */}
      <div
        style={{
          width: isOpen ? 272 : 0,
          overflow: 'hidden',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-input)',
          height: '100vh',
        }}
      >
        <div className="smooth-scroll" style={{ position: 'relative', width: 272, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onMobileClose}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32,
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: 20,
                lineHeight: 1,
              }}
            >×</button>
          )}

          {/* Logo */}
          <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <img src={isDark ? '/hear-logo-dark.svg' : '/hear-logo.svg'} alt="Hear" style={{ height: 34 }} />
            <img src={isDark ? '/powered-by-hear-dark.svg' : '/powered-by-hear.svg'} alt="Powered by Hear" style={{ height: 17, opacity: 0.7 }} />
          </div>

          {/* Project selector + bell */}
          <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div ref={projectRef} style={{ flex: 1, position: 'relative' }}>
              <div
                onClick={() => setProjectOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 40,
                  padding: '0 12px',
                  background: 'transparent',
                  border: '1.5px solid var(--border-input)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  userSelect: 'none',
                  gap: 6,
                }}
              >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedProject?.label}</span>
                {isDemo && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                    background: 'rgba(255,112,86,0.12)', color: 'var(--color-brand)',
                    lineHeight: 1.4, flexShrink: 0,
                  }}>Demo</span>
                )}
                <ChevronIcon open={projectOpen} />
              </div>
              {projectOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  {projects.map(project => {
                    const isCurrent = project.id === selectedProject?.id
                    return (
                      <div
                        key={project.id}
                        onClick={() => { setProjectOpen(false); if (!isCurrent && project.profile) onProjectChange?.(project.profile) }}
                        style={{
                          padding: '9px 12px',
                          fontSize: 13,
                          color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: isCurrent ? 600 : 400,
                          background: isCurrent ? 'var(--bg-active)' : 'transparent',
                          cursor: isCurrent ? 'default' : 'pointer',
                          transition: 'background 120ms ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        }}
                        onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-active)' }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span>{project.label}</span>
                        {isCurrent && isDemo && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                            background: 'rgba(255,112,86,0.12)', color: 'var(--color-brand)',
                            lineHeight: 1.4, flexShrink: 0,
                          }}>Active</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button style={{
                position: 'relative',
                width: 40, height: 40,
                background: 'transparent',
                border: '1.5px solid var(--border-input)',
                borderRadius: 9.6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}>
                <BellIcon />
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  background: '#E8613A',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  minWidth: 16, height: 16,
                  padding: '0 3px',
                  borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  outline: '2px solid var(--bg-sidebar)',
                  animation: 'notif-pulse 2s ease-out infinite',
                }}>7</span>
              </button>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-input)', margin: '0 24px 8px' }} />

          {/* Nav items */}
          <nav style={{ padding: '0 24px' }}>
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const active = activeNav === id
              return (
                <button
                  key={id}
                  onClick={() => onNavChange?.(id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: active ? 'rgba(255,112,86,0.12)' : 'transparent',
                    color: active ? 'var(--color-brand)' : 'var(--text-secondary)',
                    fontSize: 13.5,
                    fontWeight: 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 1,
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon />
                  {label}
                </button>
              )
            })}
          </nav>

          {/* ── Storybook Dev Link (disabled) ───────────────────────────────────── */}
          <div style={{ padding: '6px 24px 4px', position: 'relative' }}>
            <StorybookDisabledButton />
          </div>
          {/* ── end Storybook Dev Link ─────────────────────────────────────────── */}

          {activeNav === 'dashboard' && <div style={{ height: 1, background: 'var(--border-input)', margin: '8px 24px' }} />}

          {/* History section — dashboard only */}
          {activeNav === 'dashboard' && (
            <div style={{ padding: '0 24px 8px' }}>
              {/* Header row: label + collapse chevron + new-chat button */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <button
                  onClick={toggleHistory}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  History
                  <ChevronIcon open={historyOpen} />
                </button>
                <button
                  onClick={onNewChat}
                  title="New chat"
                  style={{
                    flexShrink: 0,
                    width: 28, height: 28,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 150ms ease, background 150ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <PlusIcon />
                </button>
              </div>

              {historyOpen && sessions.length === 0 && (
                <div style={{
                  padding: '6px 12px', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic',
                  animation: historyAnim === 'in' ? 'historyItemIn 220ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
                }}>
                  No conversations yet
                </div>
              )}

              {historyOpen && sessions.map((session, i) => {
                const delay = historyAnim === 'in'
                  ? `${i * 40}ms`
                  : historyAnim === 'out'
                  ? `${(sessions.length - 1 - i) * 35}ms`
                  : '0ms'
                const anim = historyAnim === 'in'
                  ? `historyItemIn 220ms cubic-bezier(0.22,1,0.36,1) ${delay} both`
                  : historyAnim === 'out'
                  ? `historyItemOut 160ms ease ${delay} both`
                  : undefined
                return (
                  <div key={session.id} style={{ animation: anim }}>
                    <SessionItem
                      session={session}
                      isActive={session.id === activeSessionId}
                      isNewlyNamed={session.id === newlyNamedId}
                      onSelect={onSelectSession}
                      onDelete={onDeleteSession}
                      onRename={onRenameSession}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* User row — pill container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: 16,
              background: 'var(--bg-card)',
            }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: '50%',
                background: '#e05252',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9,
                fontWeight: 700,
                flexShrink: 0,
                outline: '2px solid rgba(0,0,0,0.15)',
              }}>RG</div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>John Smith</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                fontSize: 12,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                flexShrink: 0,
              }}>
                HE <ChevronIcon open={false} />
              </div>
            </div>

            {/* Bottom action icons — Moon/Sun toggle + Accessibility + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[
                { Icon: isDark ? SunIcon : MoonIcon, onClick: onThemeToggle },
                { Icon: AccessibilityIcon,            onClick: null },
                { Icon: LogoutIcon,                   onClick: onSignOut },
              ].map(({ Icon, onClick }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {i > 0 && <div style={{ width: 1, height: 20, background: 'var(--border-input)', flexShrink: 0 }} />}
                  <button
                    onClick={onClick ?? undefined}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      cursor: onClick ? 'pointer' : 'default',
                      color: 'var(--text-muted)',
                      padding: '6px 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => { if (onClick) e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <Icon />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Collapse tab — desktop only */}
      {!isMobile && (
        <button
          onClick={() => onToggleCollapse?.()}
          style={{
            alignSelf: 'center',
            width: 20,
            height: 48,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseArrow collapsed={!collapsed} />
        </button>
      )}
    </div>
    </>
  )
}
