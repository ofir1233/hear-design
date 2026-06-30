import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import HearLogo from '../../components/HearLogo.jsx'
import { DEMO_INV_PROFILE } from '../../lib/demoConstants.js'
import NotificationsPopover from './NotificationsPopover.jsx'
import {
  SettingsIcon,
  BellIcon, ChevronIcon, CollapseArrow, DotsIcon,
  MoonIcon, AccessibilityIcon, LogoutIcon,
} from '../../components/icons'
import { BsGridFill, BsStars } from 'react-icons/bs'

// Sidebar nav icons — custom set (sidebar-icons), inline so currentColor follows active/muted state
const NAV_ICON_SIZE = 17
// Shared wrappers for the two icon families in the set
const Stroke = ({ vb = '0 0 24 24', children }) => (
  <svg width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} viewBox={vb} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">{children}</svg>
)
const Fill = ({ vb = '0 0 16 16', children }) => (
  <svg width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} viewBox={vb} fill="currentColor" xmlns="http://www.w3.org/2000/svg">{children}</svg>
)

const HomeIcon = () => <Stroke><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" /></Stroke>
const DataIcon = () => <Stroke><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" /><path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" /><path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" /></Stroke>
const DataV2Icon = DataIcon
const AiTaskIcon = () => <Fill vb="0 -960 960 960"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z" /></Fill>
const TopicsIcon = () => <BsGridFill size={NAV_ICON_SIZE} />
const ReportsIcon = () => <Stroke><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></Stroke>
const SignalsIcon = () => <Fill><path d="M12.3717 2.6696C12.5268 2.67208 12.669 2.67673 12.7968 2.68718C13.0602 2.70873 13.322 2.75665 13.5741 2.88509C13.9497 3.07645 14.2564 3.38183 14.4485 3.75879C14.5769 4.01087 14.6249 4.27292 14.6464 4.53614C14.6673 4.79166 14.6666 5.10353 14.6666 5.46517V10.5355C14.6666 10.897 14.6673 11.2085 14.6464 11.4639C14.6249 11.7271 14.5769 11.9892 14.4485 12.2412C14.2568 12.6175 13.9504 12.9238 13.5741 13.1156C13.3221 13.244 13.06 13.292 12.7968 13.3135C12.5414 13.3343 12.2299 13.3337 11.8684 13.3337H4.13143C3.76979 13.3337 3.45792 13.3344 3.2024 13.3135C2.93918 13.292 2.67713 13.244 2.42505 13.1156C2.04809 12.9234 1.74271 12.6168 1.55135 12.2412C1.42291 11.9891 1.37499 11.7273 1.35344 11.4639C1.33254 11.2082 1.33325 10.8959 1.33325 10.5335V5.46713C1.33325 5.10475 1.33254 4.79263 1.35344 4.53679C1.37497 4.27327 1.42283 4.01103 1.55135 3.75879C1.74309 3.38255 2.04881 3.07683 2.42505 2.88509C2.67729 2.75657 2.93953 2.70871 3.20305 2.68718C3.45889 2.66628 3.77101 2.667 4.13339 2.667H11.8665L12.3717 2.6696ZM4.13339 4.00033C3.74902 4.00033 3.50074 4.00117 3.31177 4.0166C3.13057 4.03141 3.06344 4.05647 3.03052 4.07325C2.90512 4.13715 2.80341 4.23886 2.73951 4.36426C2.72273 4.39718 2.69767 4.46431 2.68286 4.64551C2.66743 4.83448 2.66659 5.08276 2.66659 5.46713V10.5335C2.66659 10.9179 2.66678 11.1664 2.68221 11.3551C2.69699 11.5358 2.72268 11.6027 2.73951 11.6357C2.80379 11.7619 2.9058 11.8645 3.03052 11.9281C3.06339 11.9448 3.13055 11.9699 3.31112 11.9847C3.49975 12.0001 3.7478 12.0003 4.13143 12.0003H11.8684C12.2518 12.0003 12.4996 12.0001 12.6881 11.9847C12.8683 11.97 12.9357 11.9448 12.9687 11.9281C13.0941 11.8641 13.1971 11.7612 13.261 11.6357C13.2777 11.6028 13.3029 11.5353 13.3176 11.3551C13.333 11.1667 13.3333 10.9189 13.3333 10.5355V5.46517C13.3333 5.08154 13.333 4.83349 13.3176 4.64486C13.3029 4.46429 13.2777 4.39713 13.261 4.36426C13.1974 4.23954 13.0948 4.13753 12.9687 4.07325C12.9356 4.05642 12.8687 4.03073 12.6881 4.01595C12.5937 4.00824 12.4844 4.00434 12.3508 4.00228L11.8665 4.00033H4.13339ZM4.15422 6.23991C4.38994 5.95712 4.81084 5.91894 5.09367 6.15463L7.09367 7.82129C7.24563 7.94795 7.33325 8.13584 7.33326 8.33366C7.33326 8.53149 7.24563 8.71937 7.09367 8.84603L5.09367 10.5127C4.81084 10.7484 4.38994 10.7102 4.15422 10.4274C3.91853 10.1446 3.95671 9.72368 4.2395 9.48796L5.62427 8.33366L4.2395 7.17937C3.95671 6.94365 3.91853 6.52274 4.15422 6.23991ZM11.3333 9.33366C11.7014 9.33366 11.9999 9.63214 11.9999 10.0003C11.9999 10.3685 11.7014 10.667 11.3333 10.667H7.99992C7.63173 10.667 7.33326 10.3685 7.33326 10.0003C7.33326 9.63214 7.63173 9.33366 7.99992 9.33366H11.3333Z" /></Fill>
const AlertsIcon = () => <Stroke><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Stroke>
const AgentIcon = () => <Fill><path d="M11.1999 1.33334C11.5621 1.33334 11.8743 1.33309 12.1302 1.35418C12.3941 1.37594 12.6569 1.42363 12.9095 1.5534C13.2856 1.74665 13.5919 2.05487 13.7832 2.4336C13.9109 2.68642 13.9584 2.9495 13.9798 3.2142C14.0006 3.47129 14 3.78496 14 4.14975V6.81772C14 11.6395 10.3677 13.7887 8.89388 14.4616H8.89193L8.89258 14.4622C8.73095 14.536 8.5939 14.5992 8.33985 14.6432C8.2294 14.6624 8.09736 14.6667 8.00065 14.6667C7.90392 14.6667 7.77138 14.6624 7.66081 14.6432C7.40645 14.5992 7.26889 14.5362 7.10547 14.4616C5.65443 13.7991 2.11288 11.706 2.00261 7.04168L2 6.81772V4.1517C2 3.7862 1.99936 3.47225 2.02018 3.21485C2.04164 2.94986 2.08903 2.68657 2.2168 2.4336C2.40777 2.05559 2.71307 1.74702 3.08985 1.5534C3.3426 1.42353 3.6058 1.37592 3.86979 1.35418C4.12587 1.3331 4.43797 1.33334 4.80013 1.33334H11.1999ZM4.80013 2.66668C4.41578 2.66668 4.16784 2.66742 3.97917 2.68295C3.79839 2.69785 3.73164 2.72293 3.69922 2.73959C3.57429 2.80381 3.47159 2.90653 3.4069 3.03452C3.3894 3.06917 3.36448 3.13869 3.34961 3.32228C3.33414 3.51342 3.33334 3.76431 3.33334 4.1517V6.81772L3.3418 7.18751C3.51863 10.9408 6.36691 12.6586 7.65951 13.2487C7.73989 13.2854 7.76828 13.2977 7.79362 13.3067C7.81024 13.3125 7.83403 13.32 7.88867 13.3294C7.88019 13.328 7.88729 13.3291 7.91472 13.3307C7.93873 13.3321 7.96879 13.3333 8.00065 13.3333C8.03239 13.3333 8.06201 13.3321 8.08594 13.3307C8.11338 13.3291 8.12047 13.328 8.11198 13.3294C8.1662 13.3201 8.18963 13.313 8.20573 13.3073C8.23073 13.2985 8.25832 13.286 8.33854 13.2494L8.34571 13.2461C9.68271 12.6345 12.6667 10.8233 12.6667 6.81772V4.14975C12.6667 3.76303 12.6659 3.51244 12.6504 3.32162C12.6355 3.13839 12.6105 3.06905 12.5931 3.03452C12.5288 2.90726 12.4258 2.80417 12.3001 2.73959C12.2676 2.72287 12.2012 2.69782 12.0208 2.68295C11.8324 2.66741 11.5843 2.66668 11.1999 2.66668H4.80013ZM9.52669 5.56511C9.78593 5.30366 10.2079 5.30198 10.4694 5.56121C10.7307 5.82046 10.7325 6.24251 10.4733 6.50392L7.80664 9.19337C7.68147 9.31957 7.51109 9.39064 7.33334 9.39064C7.15558 9.39063 6.9852 9.31957 6.86003 9.19337L5.5267 7.84832C5.26751 7.58685 5.26916 7.16483 5.5306 6.90561C5.79201 6.64647 6.21407 6.64824 6.47331 6.90952L7.33334 7.7767L9.52669 5.56511Z" /></Fill>
const KnowledgeIcon = () => <Stroke><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Stroke>
const MagicApiIcon = () => <BsStars size={NAV_ICON_SIZE} />
const CustomersIcon = () => <Stroke><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Stroke>
const ActionsIcon = () => <Stroke><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Stroke>
const MarketplaceIcon = () => <Stroke><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></Stroke>

// Sun icon — shown when dark mode is active (click to return to light)
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Chen',    email: 'sarah.chen@acmecorp.com',    avatar: 'SC', role: 'Admin' },
  { id: 'u2', name: 'Marcus Reid',   email: 'marcus.reid@acmecorp.com',   avatar: 'MR', role: 'Agent' },
  { id: 'u3', name: 'Priya Nair',    email: 'priya.nair@globalbank.io',   avatar: 'PN', role: 'Manager' },
  { id: 'u4', name: 'Tom Okafor',    email: 'tom.okafor@globalbank.io',   avatar: 'TO', role: 'Agent' },
  { id: 'u5', name: 'Lisa Yamamoto', email: 'lisa.y@medco.health',        avatar: 'LY', role: 'Admin' },
  { id: 'u6', name: 'Dev Kapoor',    email: 'dev.kapoor@medco.health',    avatar: 'DK', role: 'Agent' },
]

const AVATAR_COLORS = ['#FF7056', '#1779F7', '#4BA373', '#D799E2', '#455F61', '#6E95A0']

function ImpersonateButton() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(null)
  const btnRef = useRef(null)
  const dropRef = useRef(null)
  const searchRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        !btnRef.current?.contains(e.target) &&
        !dropRef.current?.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearch('')
  }, [open])

  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  // Position dropdown above the button
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  useEffect(() => {
    if (!open || !btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.top - 8, left: r.left, width: Math.max(r.width, 240) })
  }, [open])

  return (
    <>
      <div className="with-tooltip" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <span className="tooltip">{active ? `Impersonating: ${active.name}` : 'Impersonate user'}</span>
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: active ? 'var(--color-brand)' : open ? 'var(--text-primary)' : 'var(--text-muted)',
          padding: '6px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 150ms ease',
          position: 'relative',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = open ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        <AccessibilityIcon />
        {active && (
          <span style={{
            position: 'absolute', top: 2, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-brand)',
            border: '1.5px solid var(--bg-sidebar)',
          }} />
        )}
      </button>
      </div>

      {open && createPortal(
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            bottom: `calc(100vh - ${pos.top}px)`,
            left: pos.left,
            width: 260,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 9999,
            overflow: 'hidden',
            transform: 'translateY(0)',
            animation: 'dropIn 150ms ease',
          }}
        >
          <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } } .imp-list::-webkit-scrollbar { display: none }`}</style>

          {/* Header */}
          <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Impersonate User
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
                style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-input, var(--border-default))',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* User list */}
          <div style={{
            position: 'relative',
            maxHeight: 220,
            overflowY: 'auto',
            padding: '6px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18px, black calc(100% - 18px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18px, black calc(100% - 18px), transparent 100%)',
          }} className="imp-list">
            {active && (
              <button
                onClick={() => { setActive(null); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12,
                  borderBottom: '1px solid var(--border-default)', marginBottom: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-canvas)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16 }}>↩</span>
                <span>Exit impersonation</span>
              </button>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 13 }}>No users found</div>
            )}
            {filtered.map((u, i) => {
              const isActive = active?.id === u.id
              return (
                <button
                  key={u.id}
                  onClick={() => { setActive(u); setOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 14px', background: isActive ? 'color-mix(in srgb, var(--color-brand) 12%, transparent)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 100ms',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-canvas)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    outline: isActive ? `2px solid var(--color-brand)` : 'none',
                    outlineOffset: 1,
                  }}>
                    {u.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: isActive ? 'var(--color-brand)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.role} · {u.email}
                    </div>
                  </div>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </>
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

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
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
function SessionItem({ session, isActive, isNewlyNamed, onSelect, onDelete, onRename, onShare }) {
  const [hovered, setHovered]       = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [menuOpenKey, setMenuOpenKey] = useState(0)
  const [menuPos, setMenuPos]       = useState({ top: 0, right: 0 })
  const [renaming, setRenaming]     = useState(false)
  const [renameVal, setRenameVal]   = useState(session.title)
  const dotsRef     = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef    = useRef(null)

  const isPending    = !session.title && session.pending === true
  const displayTitle = useTypewriter(session.title || 'New conversation', isNewlyNamed && !isPending)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (
        dotsRef.current && !dotsRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function openMenu(e) {
    e.stopPropagation()
    if (!menuOpen) {
      setMenuOpenKey(k => k + 1)
      const rect = dotsRef.current?.getBoundingClientRect()
      if (rect) setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setMenuOpen(o => !o)
  }

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
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            ref={dotsRef}
            onClick={openMenu}
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

          {/* Dropdown — portaled to body to escape overflow clipping */}
          {createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: menuPos.top,
                right: menuPos.right,
                zIndex: 9999,
                pointerEvents: menuOpen ? 'auto' : 'none',
              }}
            >
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                minWidth: 130,
                overflow: 'hidden',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'opacity 130ms ease, transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: menuOpen ? '10ms' : '0ms',
              }}>
                <div key={menuOpenKey}>
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpen(false); setRenaming(true) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px', background: 'transparent', border: 'none',
                      cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13,
                      textAlign: 'left', transition: 'background 120ms ease',
                      animation: `dropdownItemIn 140ms cubic-bezier(0.22,1,0.36,1) 20ms both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <PencilIcon /> Rename
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpen(false); onShare && onShare(session.id) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px', background: 'transparent', border: 'none',
                      cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13,
                      textAlign: 'left', transition: 'background 120ms ease',
                      animation: `dropdownItemIn 140ms cubic-bezier(0.22,1,0.36,1) 35ms both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <ShareIcon /> Share
                  </button>
                  <div style={{ height: 1, background: 'var(--border-input)', margin: '0 8px' }} />
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete(session.id) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px', background: 'transparent', border: 'none',
                      cursor: 'pointer', color: '#e05252', fontSize: 13,
                      textAlign: 'left', transition: 'background 120ms ease',
                      animation: `dropdownItemIn 140ms cubic-bezier(0.22,1,0.36,1) 50ms both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,82,82,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body
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
  { id: 'dashboard',   label: 'Chat',             Icon: HomeIcon,        group: 'MAIN'         },
  { id: 'data-v2',     label: 'Data V2',          Icon: DataV2Icon,      group: 'MAIN'         },
  { id: 'ai-task',     label: 'AI Tasks',         Icon: AiTaskIcon,      group: 'MAIN'         },
  { id: 'topics',      label: 'Topics',           Icon: TopicsIcon,      group: 'MAIN' },
  { id: 'reports',     label: 'Reports',          Icon: ReportsIcon,     group: 'MAIN'         },
  { id: 'signals',     label: 'Signals',          Icon: SignalsIcon,     group: 'INTELLIGENCE' },
  { id: 'alerts',      label: 'Alerts',           Icon: AlertsIcon,      group: 'INTELLIGENCE' },
  { id: 'agent-eval',  label: 'Agent Evaluation', Icon: AgentIcon,       group: 'INTELLIGENCE' },
  { id: 'knowledge',   label: 'Knowledge',        Icon: KnowledgeIcon,   group: 'INTELLIGENCE' },
  { id: 'magic-api',   label: 'Magic API',        Icon: MagicApiIcon,    group: 'INTELLIGENCE' },
  { id: 'customers',   label: 'Customers',        Icon: CustomersIcon,   group: 'OPERATIONS'   },
  { id: 'actions',     label: 'Actions',          Icon: ActionsIcon,     group: 'OPERATIONS'   },
  { id: 'marketplace', label: 'Marketplace',      Icon: MarketplaceIcon, group: 'OPERATIONS'   },
]

function IcOrg()          { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function IcTeams()        { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-2.209 1.791-4 4-4s4 1.791 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M14 13c0-1.657-1-3-2-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> }
function IcProjects()     { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/><path d="M9 11.5h5M11.5 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function IcProfile()      { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function IcActions()      { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2L5 9h4l-2 5 6-7H9l2-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> }
function IcBilling()      { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.5"/><rect x="3.5" y="9.5" width="4" height="1.5" rx="0.5" fill="currentColor"/></svg> }
function IcUsage()        { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13V9M6 13V6M10 13V4M14 13V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function IcUserAnalytics(){ return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.209 1.791-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 10.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcIntegrations() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2h4M8 2v3M4 5h8a1 1 0 011 1v1H3V6a1 1 0 011-1zM3 7h10v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> }
function IcITAdmin()      { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1 2.5 2.5.5-1.8 1.8.4 2.7L8 8.2l-2.1 1.3.4-2.7L4.5 5l2.5-.5L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M4 13h8M8 10v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function IcMarketplace()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 6h11M3 6l1.5-4h7L13 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="6" width="12" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }
function IcPrompts()      { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 5.5h6M5 8h6M5 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }

const SETTINGS_TABS = [
  { id: 'organization',   label: 'Organization',   Icon: IcOrg           },
  { id: 'teams',          label: 'Teams',          Icon: IcTeams         },
  { id: 'projects',       label: 'Projects',       Icon: IcProjects      },
  { id: 'prompts',        label: 'Prompts',        Icon: IcPrompts       },
  { id: 'profile',        label: 'Profile',        Icon: IcProfile       },
  { id: 'actions',        label: 'Actions',        Icon: IcActions       },
  { id: 'billing',        label: 'Billing',        Icon: IcBilling       },
  { id: 'usage',          label: 'Usage',          Icon: IcUsage         },
  { id: 'user-analytics', label: 'User Analytics', Icon: IcUserAnalytics },
  { id: 'integrations',   label: 'Integrations',   Icon: IcIntegrations  },
  { id: 'it-admin',       label: 'IT Admin',       Icon: IcITAdmin       },
  { id: 'marketplace',    label: 'Marketplace',    Icon: IcMarketplace   },
]

const DESIGN_LAB_PROJECTS = [
  { id: '__audi__',          label: 'Audi',            color: '#FF7056', admin: true },
  { id: '__sales_support__', label: 'Sales & Support', color: '#1779F7' },
  { id: '__finance__',       label: 'Finance',         color: '#7C5CFC' },
  { id: '__it_ops__',        label: 'IT Operations',   color: '#0AB884' },
]

export default function Sidebar({ isMobile = false, mobileOpen = false, onMobileClose, isDark = false, onThemeToggle, activeNav = 'dashboard', onNavChange, collapsed = false, onToggleCollapse, onSignOut, companyConfig = null, userId = '', onProjectChange, sessions = [], activeSessionId = null, newlyNamedId = null, onSelectSession, onDeleteSession, onRenameSession, onShareSession, onNewChat, defaultOrgScope = 'project', settingsTab = 'organization', onSettingsTabChange }) {
  const [historyOpen, setHistoryOpen]   = useState(true)
  const [historyAnim, setHistoryAnim]   = useState(null) // null | 'in' | 'out'
  const [allHistoryOpen, setAllHistoryOpen] = useState(false)
  const historyTimerRef = useRef(null)

  // ── Draggable nav divider ────────────────────────────────────────────────
  const [navHeight, setNavHeight]   = useState(null) // null = show all
  const navRef                      = useRef(null)
  const dragState                   = useRef(null) // { startY, startH }

  function onDividerMouseDown(e) {
    e.preventDefault()
    const currentH = navRef.current?.offsetHeight ?? 400
    dragState.current = { startY: e.clientY, startH: currentH }

    let rafId = null
    function onMove(ev) {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (!dragState.current) return
        const delta = ev.clientY - dragState.current.startY
        setNavHeight(Math.max(36, dragState.current.startH + delta))
      })
    }
    function onUp() {
      dragState.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
  const [projectOpen, setProjectOpen]   = useState(false)
  const [projectOpenKey, setProjectOpenKey] = useState(0)
  const [selectedLabProjectId, setSelectedLabProjectId] = useState(DESIGN_LAB_PROJECTS[0].id)
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState({ code: 'HE', label: 'Hebrew' })
  const langRef = useRef(null)
  const projectRef = useRef(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifUnseen, setNotifUnseen] = useState(true)
  const bellRef = useRef(null)
  const [orgScope, setOrgScope] = useState(defaultOrgScope) // 'project' | 'org'

  const isDemo = !!(userId?.includes('@') && companyConfig)

  // Build project list — always includes Demo inv, refreshes when profiles change
  const readProjects = useCallback(() => {
    if (!isDemo) return DESIGN_LAB_PROJECTS
    try {
      const cached = JSON.parse(localStorage.getItem(`hear-demo-profiles-${userId}`) || '[]')
      const custom = cached.filter(p => p.id !== 'demo-company').map(p => ({ id: p.id, label: p.name, profile: p }))
      return [{ id: 'demo-company', label: 'Demo inv', profile: DEMO_INV_PROFILE }, ...custom]
    } catch { return [{ id: 'demo-company', label: 'Demo inv', profile: DEMO_INV_PROFILE }] }
  }, [isDemo, userId])

  const [projects, setProjects] = useState(readProjects)

  useEffect(() => {
    setProjects(readProjects())
    const onUpdate = () => setProjects(readProjects())
    window.addEventListener('hear:profiles-updated', onUpdate)
    return () => window.removeEventListener('hear:profiles-updated', onUpdate)
  }, [readProjects])

  const currentProfileId = typeof window !== 'undefined' ? localStorage.getItem('hear-demo-profile-id') : null
  const selectedProject = isDemo
    ? (projects.find(p => String(p.id) === String(currentProfileId)) ?? projects.find(p => p.label === (companyConfig?.companyName || '')) ?? projects[0])
    : (projects.find(p => p.id === selectedLabProjectId) ?? projects[0])

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

  useEffect(() => {
    if (!langOpen) return
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [langOpen])

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

    <div data-inspector="Sidebar" style={{ display: 'flex', alignItems: 'stretch', position: 'fixed', top: 16, left: 16, height: 'calc(100vh - 32px)', zIndex: 100 }}>

      {/* ── Mini icon rail (collapsed) ───────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          width: isOpen ? 0 : 56, flexShrink: 0,
          border: 'var(--page-header-border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'var(--bg-card)',
          borderRadius: 16, height: '100%',
          border: isOpen ? 'none' : 'var(--page-header-border)',
          boxShadow: isOpen ? 'none' : 'var(--page-header-shadow)',
          padding: '16px 0 12px',
          overflow: 'hidden',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease, opacity 200ms ease',
          opacity: isOpen ? 0 : 1,
        }}>
          {/* Logo mark — inline SVG so we can size it precisely */}
          <div style={{ marginBottom: 16, width: 22, height: 19, flexShrink: 0 }}>
            <svg viewBox="0 0 69 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="19">
              <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="#FF7056"/>
            </svg>
          </div>

          {/* Nav icons */}
          <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, overflowY: 'auto', padding: '0 6px' }}>
            {NAV_ITEMS.map(({ id, label, Icon, group, disabled }, i) => {
              const active = activeNav === id
              const isFirstInGroup = i === 0 || NAV_ITEMS[i - 1].group !== group
              return (
                <div key={id} className={disabled ? 'with-tooltip' : ''} style={{ width: '100%' }}>
                  {disabled && <span className="tooltip">Under construction</span>}
                  {isFirstInGroup && i !== 0 && (
                    <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 4px 6px', opacity: 0.5 }} />
                  )}
                  <button
                    title={disabled ? undefined : label}
                    onClick={disabled ? undefined : () => onNavChange?.(id)}
                    style={{
                      width: '100%', height: 38,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', borderRadius: 9,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      background: active ? 'rgba(91,163,255,0.14)' : 'transparent',
                      color: disabled ? 'var(--text-muted)' : active ? '#5BA3FF' : 'var(--text-muted)',
                      opacity: disabled ? 0.35 : 1,
                      transition: 'background 140ms ease, color 140ms ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!active && !disabled) { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                    onMouseLeave={e => { if (!active && !disabled) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
                  >
                    <Icon />
                    {active && (
                      <span style={{
                        position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#5BA3FF',
                      }} />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Settings icon — pinned above expand button */}
          <div style={{ width: '100%', padding: '0 6px' }}>
            <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 4px 8px' }} />
            <button
              title="Settings"
              onClick={() => onNavChange?.('settings')}
              style={{
                width: '100%', height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: 9, cursor: 'pointer',
                background: activeNav === 'settings' ? 'rgba(91,163,255,0.14)' : 'transparent',
                color: activeNav === 'settings' ? '#5BA3FF' : 'var(--text-muted)',
                transition: 'background 140ms ease, color 140ms ease',
              }}
              onMouseEnter={e => { if (activeNav !== 'settings') { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
              onMouseLeave={e => { if (activeNav !== 'settings') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <SettingsIcon />
            </button>
          </div>

          {/* Expand button */}
          <button
            onClick={() => onToggleCollapse?.()}
            title="Expand sidebar"
            style={{
              marginTop: 8,
              width: 36, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid var(--border-default)',
              borderRadius: 7, cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'background 130ms ease, color 130ms ease, border-color 130ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
          >
            <CollapseArrow collapsed={false} />
          </button>
        </div>
      )}

      {/* Sidebar panel */}
      <div
        style={{
          width: isOpen ? 272 : 0,
          overflow: 'hidden',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 16,
          height: '100%',
          border: isOpen ? 'var(--page-header-border)' : 'none',
          boxShadow: isOpen ? 'var(--page-header-shadow)' : 'none',
        }}
      >
        <div style={{ position: 'relative', width: 272, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: 16 }}>

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

          {/* Co-branded header + scope toggle — one card, separated by a stroke */}
          {(() => {
            const company = companyConfig?.companyName || 'Hear'
            const initials = company.split(/[\s/]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
            const COMPANY_LOGOS = { 'demo inv': '/audi.svg', 'audi': '/audi.svg' }
            const logoSrc = COMPANY_LOGOS[company.toLowerCase()]
            const showToggle = activeNav !== 'settings'
            return (
              <div style={{ padding: '20px 16px 16px' }}>
                <div style={{
                  borderRadius: 14, overflow: 'hidden',
                  border: '1px solid var(--border-default)', background: 'var(--bg-card, #fff)',
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                    {/* Logo box — company logo, or monogram fallback */}
                    <div style={{
                      width: 60, height: 40, flexShrink: 0, borderRadius: 9,
                      border: '1px solid var(--border-default)', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
                      fontFamily: "'Byrd', sans-serif", overflow: 'hidden',
                    }}>
                      {logoSrc
                        ? <img src={logoSrc} alt={company} style={{ width: 32, height: 'auto' }} />
                        : initials}
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-default)', flexShrink: 0 }} />

                    {/* Name + powered by */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
                        fontFamily: "'Byrd', sans-serif",
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{company}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>Powered by</span>
                        <img src={isDark ? '/hear-logo-dark.svg' : '/hear-logo.svg'} alt="Hear" style={{ height: 12 }} />
                      </div>
                    </div>
                  </div>

                  {/* Separator + scope toggle */}
                  {showToggle && (
                    <>
                      <div style={{ height: 1, background: 'var(--border-default)', margin: '0 14px' }} />
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 8, padding: 3, gap: 2 }}>
                          {[{ id: 'project', label: 'Project' }, { id: 'org', label: 'Org' }].map(({ id, label }) => (
                            <button
                              key={id}
                              onClick={() => { setOrgScope(id); if (id === 'org') setProjectOpen(false) }}
                              style={{
                                flex: 1, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer',
                                fontSize: 12, fontWeight: orgScope === id ? 600 : 400,
                                background: orgScope === id ? '#fff' : 'transparent',
                                color: orgScope === id ? 'var(--text-primary)' : 'var(--text-muted)',
                                boxShadow: orgScope === id ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                                transition: 'background 160ms ease, color 160ms ease, box-shadow 160ms ease',
                                userSelect: 'none',
                              }}
                            >{label}</button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Project selector + bell */}
          <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div ref={projectRef} style={{ flex: 1, minWidth: 0, position: 'relative' }}>

              {/* Org mode: all-projects display */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                opacity: orgScope === 'org' ? 1 : 0,
                pointerEvents: orgScope === 'org' ? 'auto' : 'none',
                transition: 'opacity 200ms ease',
                display: 'flex', alignItems: 'center', height: 40,
                padding: '0 12px',
                border: '1.5px solid var(--border-input)',
                borderRadius: 8,
                gap: 8,
                fontSize: 13,
                color: 'var(--text-primary)',
              }}>
                {/* Stacked project avatars */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {DESIGN_LAB_PROJECTS.map((p, i) => (
                    <div key={p.id} title={p.label} style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: p.color,
                      border: '1.5px solid var(--bg-sidebar)',
                      marginLeft: i === 0 ? 0 : -6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: '#fff',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: DESIGN_LAB_PROJECTS.length - i,
                    }}>
                      {p.label[0]}
                    </div>
                  ))}
                </div>
                <span style={{ flex: 1, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  All Projects
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                  background: 'rgba(23,121,247,0.12)', color: '#1779F7',
                  lineHeight: 1.4, flexShrink: 0,
                }}>Org</span>
              </div>

              {/* Project mode: normal selector */}
              <div style={{
                opacity: orgScope === 'project' ? 1 : 0,
                pointerEvents: orgScope === 'project' ? 'auto' : 'none',
                transition: 'opacity 200ms ease',
              }}>
              <div
                onClick={() => { if (!projectOpen) setProjectOpenKey(k => k + 1); setProjectOpen(o => !o) }}
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
                {selectedProject?.color && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: selectedProject.color, flexShrink: 0,
                  }} />
                )}
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
              {/* Dropdown — always mounted, animated in/out */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0, right: 0,
                zIndex: 200,
                display: 'grid',
                gridTemplateRows: projectOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                pointerEvents: projectOpen ? 'auto' : 'none',
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    overflow: 'hidden',
                    opacity: projectOpen ? 1 : 0,
                    transform: projectOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: 'opacity 130ms ease, transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: projectOpen ? '10ms' : '0ms',
                  }}>
                    <div key={projectOpenKey}>
                      {projects.map((project, pi) => {
                        const isCurrent = project.id === selectedProject?.id
                        return (
                          <div
                            key={project.id}
                            onClick={() => { setProjectOpen(false); if (!isCurrent) { if (project.profile) onProjectChange?.(project.profile); else setSelectedLabProjectId(project.id) } }}
                            style={{
                              padding: '9px 12px',
                              fontSize: 13,
                              color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontWeight: isCurrent ? 600 : 400,
                              background: isCurrent ? 'var(--bg-active)' : 'transparent',
                              cursor: isCurrent ? 'default' : 'pointer',
                              transition: 'background 120ms ease',
                              display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8,
                              animation: `dropdownItemIn 140ms cubic-bezier(0.22,1,0.36,1) ${20 + pi * 30}ms both`,
                            }}
                            onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-active)' }}
                            onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
                          >
                            {project.color && (
                              <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: project.color, flexShrink: 0,
                              }} />
                            )}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{project.label}</span>
                            {project.admin && (
                              <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                                textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                                background: 'rgba(255,112,86,0.12)', color: 'var(--color-brand)',
                                lineHeight: 1.4, flexShrink: 0, marginLeft: 'auto',
                              }}>Admin</span>
                            )}
                            {isDemo && (
                              <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                                textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                                background: isCurrent ? 'rgba(255,112,86,0.12)' : 'var(--bg-active)',
                                color: isCurrent ? 'var(--color-brand)' : 'var(--text-muted)',
                                lineHeight: 1.4, flexShrink: 0,
                              }}>{isCurrent ? 'Active' : 'Demo'}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              </div>{/* end project-mode wrapper */}
            </div>
            {/* Bell — hidden in settings */}
            {activeNav !== 'settings' && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  ref={bellRef}
                  onClick={() => { setNotifOpen(v => !v); setNotifUnseen(false) }}
                  style={{
                    position: 'relative', width: 40, height: 40,
                    background: notifOpen ? 'var(--bg-active)' : 'transparent',
                    border: `1.5px solid ${notifOpen ? 'var(--border-default)' : 'var(--border-input)'}`,
                    borderRadius: 9.6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: notifOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'background 140ms ease, color 140ms ease, border-color 140ms ease',
                  }}
                >
                  <BellIcon />
                  {notifUnseen && (
                    <span style={{
                      position: 'absolute', top: -3, right: -3,
                      background: '#E8613A', color: '#fff',
                      fontSize: 9, fontWeight: 700,
                      minWidth: 16, height: 16, padding: '0 3px',
                      borderRadius: 999,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      outline: '2px solid var(--bg-sidebar)',
                      animation: 'notif-pulse 2s ease-out infinite',
                    }}>2</span>
                  )}
                </button>
                <NotificationsPopover
                  open={notifOpen}
                  anchorRef={bellRef}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border-input)', margin: '0 24px 8px', flexShrink: 0 }} />

          {/* ── Scrollable middle: nav + history ───────────────────────────── */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Nav items — main nav or settings sub-nav */}
          {activeNav === 'settings' ? (
            <nav className="smooth-scroll" style={{ padding: '0 24px', overflowY: 'auto', flex: '0 1 auto', minHeight: 80 }}>
              {SETTINGS_TABS.map(({ id, label, Icon }) => {
                const active = id === settingsTab
                return (
                  <button
                    key={id}
                    onClick={() => onSettingsTabChange?.(id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: active ? 'rgba(23,121,247,0.12)' : 'transparent',
                      color: active ? '#1779F7' : 'var(--text-secondary)',
                      fontSize: 13.5,
                      fontWeight: active ? 500 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: 2,
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
              <div style={{ marginTop: 8, paddingBottom: 4 }}>
                <button
                  onClick={() => onNavChange?.('dashboard')}
                  style={{
                    width: '100%', height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#1779F7', color: '#fff',
                    border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
                  }}
                >
                  Back
                </button>
              </div>
            </nav>
          ) : (
            <nav ref={navRef} className="smooth-scroll" style={{ padding: '0 24px', overflowY: 'auto', flex: '0 1 auto', minHeight: 80, height: navHeight ?? undefined }}>
              {NAV_ITEMS.map(({ id, label, Icon, group, disabled }, i) => {
                const active = activeNav === id
                const isFirstInGroup = i === 0 || NAV_ITEMS[i - 1].group !== group
                return (
                  <div key={id}>
                    {isFirstInGroup && (
                      <div style={{
                        padding: '10px 12px 4px',
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: 'var(--text-muted)',
                        fontFamily: "'Byrd', sans-serif",
                        marginTop: i === 0 ? 0 : 4,
                      }}>
                        {group}
                      </div>
                    )}
                    <button
                      onClick={disabled ? undefined : () => onNavChange?.(id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: active ? 'rgba(91,163,255,0.12)' : 'transparent',
                        color: disabled ? 'var(--text-muted)' : active ? '#5BA3FF' : 'var(--text-secondary)',
                        fontSize: 13.5,
                        fontWeight: 400,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        marginBottom: 1,
                        opacity: disabled ? 0.35 : 1,
                        transition: 'background 150ms ease, color 150ms ease',
                      }}
                      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'var(--bg-active)' }}
                      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent' }}
                    >
                      <Icon />
                      {label}
                      {disabled && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                          textTransform: 'uppercase', padding: '2px 5px', borderRadius: 4,
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4, flexShrink: 0,
                        }}>Soon</span>
                      )}
                    </button>
                  </div>
                )
              })}
            </nav>
          )}

          {/* ── Storybook Dev Link — hidden in settings ──────────────────────────── */}
          {activeNav !== 'settings' && (
            <div style={{ padding: '6px 24px 4px', position: 'relative' }}>
              <StorybookDisabledButton />
            </div>
          )}
          {/* ── end Storybook Dev Link ─────────────────────────────────────────── */}

          {activeNav === 'dashboard' && (
            <div
              onMouseDown={onDividerMouseDown}
              style={{
                margin: '8px 16px',
                height: 9,
                display: 'flex',
                alignItems: 'center',
                cursor: 'ns-resize',
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              <div style={{ width: '100%', height: 1, background: 'var(--border-input)' }} />
            </div>
          )}

          {/* History section — dashboard only, always visible */}
          {activeNav === 'dashboard' && (() => {
            const todayStr = new Date().toDateString()
            const todaySessions  = sessions.filter(s => new Date(s.updated_at).toDateString() === todayStr)
            const olderSessions  = sessions.filter(s => new Date(s.updated_at).toDateString() !== todayStr)

            return (
              <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 0', flexShrink: 0 }}>
                  <button
                    onClick={toggleHistory}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px 6px 24px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'left',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: historyOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    History
                  </button>
                  <button
                    onClick={onNewChat}
                    title="New chat"
                    style={{
                      flexShrink: 0, width: 28, height: 28,
                      background: 'transparent', border: 'none', borderRadius: 6,
                      cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 150ms ease, background 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>

                {/* Scrollable sessions */}
                {historyOpen && <div className="smooth-scroll" style={{ overflowY: 'auto', padding: '0 24px 8px' }}>
                  {sessions.length === 0 && (
                    <div style={{ padding: '4px 12px', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No conversations yet
                    </div>
                  )}

                  {/* Today's sessions */}
                  {todaySessions.map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      isNewlyNamed={session.id === newlyNamedId}
                      onSelect={onSelectSession}
                      onDelete={onDeleteSession}
                      onRename={onRenameSession}
                      onShare={onShareSession}
                    />
                  ))}

                  {/* Older sessions — shown flat */}
                  {olderSessions.map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      isNewlyNamed={session.id === newlyNamedId}
                      onSelect={onSelectSession}
                      onDelete={onDeleteSession}
                      onRename={onRenameSession}
                      onShare={onShareSession}
                    />
                  ))}
                </div>}
              </div>
            )
          })()}

          </div>{/* end scrollable middle */}

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
              }}>{(localStorage.getItem('hear-user-name') || 'U').slice(0, 2).toUpperCase()}</div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{localStorage.getItem('hear-user-name') || 'You'}</span>
              <div ref={langRef} style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  onClick={() => setLangOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 10px',
                    background: langOpen ? 'var(--bg-active)' : 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 6, fontSize: 13,
                    color: 'var(--text-primary)', cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <path d="M22.4219 20.325L18.2032 10.1062C18.1253 9.9175 17.9931 9.75616 17.8234 9.64263C17.6537 9.52911 17.4541 9.46851 17.25 9.46851C17.0458 9.46851 16.8463 9.52911 16.6766 9.64263C16.5069 9.75616 16.3747 9.9175 16.2968 10.1062L12.078 20.325C12.0256 20.4503 11.9984 20.5847 11.9981 20.7206C11.9977 20.8564 12.0242 20.991 12.076 21.1166C12.1279 21.2422 12.204 21.3563 12.3001 21.4523C12.3961 21.5484 12.5102 21.6245 12.6358 21.6764C12.7613 21.7282 12.8959 21.7547 13.0318 21.7544C13.1676 21.7541 13.3021 21.7269 13.4274 21.6745C13.5527 21.622 13.6665 21.5453 13.762 21.4488C13.8576 21.3523 13.9332 21.2378 13.9844 21.112L14.8437 19.0312H19.6563L20.5155 21.112C20.5934 21.3008 20.7256 21.4622 20.8954 21.5758C21.0651 21.6894 21.2647 21.75 21.469 21.75C21.6384 21.7499 21.8052 21.708 21.9547 21.6281C22.1041 21.5482 22.2315 21.4327 22.3257 21.2918C22.4199 21.1509 22.4779 20.989 22.4946 20.8204C22.5113 20.6517 22.4862 20.4816 22.4215 20.325H22.4219ZM15.6954 16.9687L17.2502 13.2023L18.8051 16.9687H15.6954Z" fill="currentColor"/>
                    <path d="M12.555 16.0744C12.7152 15.8531 12.7811 15.5772 12.7381 15.3074C12.6951 15.0376 12.5468 14.7959 12.3258 14.6353C12.3164 14.6283 11.6227 14.1136 10.6153 13.0073C12.4739 10.4911 13.5267 7.62844 13.9561 6.28125H15.4688C15.7423 6.28125 16.0046 6.1726 16.198 5.9792C16.3913 5.78581 16.5 5.5235 16.5 5.25C16.5 4.9765 16.3913 4.71419 16.198 4.5208C16.0046 4.3274 15.7423 4.21875 15.4688 4.21875H10.0312V3.28125C10.0312 3.00775 9.9226 2.74544 9.7292 2.55205C9.53581 2.35865 9.2735 2.25 9 2.25C8.7265 2.25 8.46419 2.35865 8.2708 2.55205C8.0774 2.74544 7.96875 3.00775 7.96875 3.28125V4.21875H2.53125C2.25775 4.21875 1.99544 4.3274 1.80205 4.5208C1.60865 4.71419 1.5 4.9765 1.5 5.25C1.5 5.5235 1.60865 5.78581 1.80205 5.9792C1.99544 6.1726 2.25775 6.28125 2.53125 6.28125H11.7773C11.3311 7.54453 10.5094 9.53906 9.25594 11.3606C7.78359 9.40688 7.23656 8.14266 7.23234 8.13234C7.12456 7.88324 6.92291 7.68668 6.67114 7.58529C6.41937 7.4839 6.13778 7.48585 5.88743 7.59072C5.63709 7.6956 5.43819 7.89494 5.33387 8.14551C5.22954 8.39608 5.22821 8.67767 5.33016 8.92922C5.35734 8.99391 6.01219 10.5338 7.80797 12.8634C7.85109 12.9192 7.89375 12.9736 7.93641 13.028C6.09703 15.1069 4.29234 16.3964 3.53719 16.8127C3.29706 16.9436 3.1188 17.1646 3.04162 17.427C2.96444 17.6894 2.99465 17.9718 3.12563 18.2119C3.2566 18.452 3.47759 18.6303 3.74 18.7074C4.0024 18.7846 4.28472 18.7544 4.52484 18.6234C4.62609 18.5681 6.80297 17.363 9.28875 14.6114C10.3444 15.7402 11.07 16.2727 11.1136 16.3036C11.2233 16.3833 11.3476 16.4405 11.4794 16.4721C11.6113 16.5037 11.748 16.509 11.8819 16.4876C12.0158 16.4663 12.1442 16.4188 12.2597 16.3478C12.3751 16.2768 12.4755 16.1837 12.555 16.0739V16.0744Z" fill="currentColor"/>
                  </svg>
                  {selectedLang.code} <ChevronIcon open={langOpen} />
                </div>
                {/* Language dropdown */}
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 12px)', right: 0,
                  zIndex: 300,
                  display: 'grid',
                  gridTemplateRows: langOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                  pointerEvents: langOpen ? 'auto' : 'none',
                  minWidth: 160,
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                      overflow: 'hidden',
                      opacity: langOpen ? 1 : 0,
                      transform: langOpen ? 'translateY(0)' : 'translateY(4px)',
                      transition: 'opacity 130ms ease, transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}>
                      {[
                        { code: 'HE', label: 'Hebrew',     flag: '🇮🇱' },
                        { code: 'EN', label: 'English',    flag: '🇺🇸' },
                        { code: 'AR', label: 'Arabic',     flag: '🇸🇦' },
                        { code: 'FR', label: 'French',     flag: '🇫🇷' },
                        { code: 'DE', label: 'German',     flag: '🇩🇪' },
                        { code: 'ES', label: 'Spanish',    flag: '🇪🇸' },
                        { code: 'PT', label: 'Portuguese', flag: '🇵🇹' },
                        { code: 'RU', label: 'Russian',    flag: '🇷🇺' },
                        { code: 'ZH', label: 'Chinese',    flag: '🇨🇳' },
                        { code: 'JA', label: 'Japanese',   flag: '🇯🇵' },
                      ].map((lang, i) => {
                        const isCurrent = lang.code === selectedLang.code
                        return (
                          <div
                            key={lang.code}
                            onClick={() => { setSelectedLang(lang); setLangOpen(false) }}
                            style={{
                              padding: '8px 12px',
                              fontSize: 13,
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                              color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontWeight: isCurrent ? 600 : 400,
                              background: isCurrent ? 'var(--bg-active)' : 'transparent',
                              cursor: isCurrent ? 'default' : 'pointer',
                              transition: 'background 120ms ease',
                              animation: `dropdownItemIn 140ms cubic-bezier(0.22,1,0.36,1) ${i * 20}ms both`,
                            }}
                            onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-active)' }}
                            onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 16, lineHeight: 1 }}>{lang.flag}</span>
                              {lang.label}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{lang.code}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action icons — Settings + Moon/Sun toggle + Impersonate + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Settings */}
              <div className="with-tooltip" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span className="tooltip">Settings</span>
                <button
                  onClick={() => onNavChange?.('settings')}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: activeNav === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)',
                    padding: '6px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = activeNav === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  <SettingsIcon />
                </button>
              </div>
              <div style={{ width: 1, height: 20, background: 'var(--border-input)', flexShrink: 0 }} />

              {/* Theme toggle */}
              <div className="with-tooltip" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span className="tooltip">{isDark ? 'Light mode' : 'Dark mode'}</span>
                <button
                  onClick={onThemeToggle}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '6px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>

              {/* Impersonate */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 1, height: 20, background: 'var(--border-input)', flexShrink: 0 }} />
                <ImpersonateButton />
              </div>

              {/* Logout */}
              <div className="with-tooltip" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span className="tooltip">Sign out</span>
                <div style={{ width: 1, height: 20, background: 'var(--border-input)', flexShrink: 0 }} />
                <button
                  onClick={onSignOut}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '6px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <LogoutIcon />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Collapse tab — desktop only, shown only when expanded */}
      {!isMobile && isOpen && (
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
