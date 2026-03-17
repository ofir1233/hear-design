/**
 * NotificationsPopover — Design Lab only.
 * Completion/sharing event notifications mapped to the real platform sources:
 *   DATA            — File & Customer exports  (navigates to /data or /customers)
 *   SIGNALS         — Magic API v2 exports     (navigates to /magicapi-v2)
 *   MAGIC_API       — Magic API v1 exports     (tag display only)
 *   AGENT_EVALUATION— Evaluation sharing       (tag display only)
 *   CHAT            — Chat session events      (tag display only; filtered on active chat page)
 *
 * Delivery pipeline: Server Action → GCP Pub/Sub → MongoDB → PubNub → NotificationProvider → here
 * Scopes: USER · TEAM · PROJECT · ORGANIZATION · GLOBAL_USER
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = Date.now()

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    tag: 'DATA',
    title: 'File Export Ready',
    description: 'Your Q4 data export has completed and is ready to review.',
    ts: NOW - 18 * 60 * 1000,
    read: false,
    navTo: '/data',
  },
  {
    id: 'n2',
    tag: 'DATA',
    title: 'Customer Export Complete',
    description: '2,340 customer records exported successfully.',
    ts: NOW - 2 * 60 * 60 * 1000,
    read: false,
    navTo: '/customers',
  },
  {
    id: 'n3',
    tag: 'SIGNALS',
    title: 'Signal Export Complete',
    description: 'Your Magic API v2 signal export has finished processing.',
    ts: NOW - 5 * 60 * 60 * 1000,
    read: false,
    navTo: '/magicapi-v2',
  },
  {
    id: 'n4',
    tag: 'MAGIC_API',
    title: 'Magic API Export Done',
    description: 'Your Magic API v1 export completed successfully.',
    ts: NOW - 26 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'n5',
    tag: 'AGENT_EVALUATION',
    title: 'Evaluation Shared with You',
    description: 'Sarah Chen shared the "Q4 Agent Performance" evaluation with your team.',
    ts: NOW - 30 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'n6',
    tag: 'CHAT',
    title: 'New Chat Session Activity',
    description: 'A new session was added to your monitored conversations.',
    ts: NOW - 32 * 60 * 60 * 1000,
    read: true,
  },
]

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  DATA: {
    label: 'DATA',
    color: '#4BA373',
    bg: 'rgba(75,163,115,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
  },
  SIGNALS: {
    label: 'SIGNALS',
    color: '#5BA3FF',
    bg: 'rgba(91,163,255,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  MAGIC_API: {
    label: 'MAGIC_API',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  AGENT_EVALUATION: {
    label: 'AGENT_EVALUATION',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  CHAT: {
    label: 'CHAT',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
}

// ─── Theme-adaptive fill colors ───────────────────────────────────────────────
const FILL_BG       = 'color-mix(in srgb, var(--bg-active) 45%, var(--bg-card))'
const FILL_BG_HOVER = 'color-mix(in srgb, var(--bg-active) 70%, var(--bg-card))'
const ROW_HOVER_BG  = 'color-mix(in srgb, var(--bg-active) 32%, var(--bg-card))'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  return `${d}d ago`
}

function isToday(ts) {
  const d = new Date(ts)
  const today = new Date()
  return d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
}

// ─── Single notification item ─────────────────────────────────────────────────

function NotifItem({ notif, index, onDismiss, onMarkRead, onNavigate, entering }) {
  const [dismissing, setDismissing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CONFIG[notif.tag] ?? TYPE_CONFIG.DATA
  const hasNav = Boolean(notif.navTo)

  // Freeze animation string on mount — prevents re-firing when parent state updates
  const animationRef = useRef(
    entering ? `notifItemIn 240ms cubic-bezier(0.22,1,0.36,1) ${index * 35}ms both` : 'none'
  )

  function handleDismiss(e) {
    e.stopPropagation()
    setDismissing(true)
    setTimeout(() => onDismiss(notif.id), 220)
  }

  function handleItemClick() {
    if (!notif.read) onMarkRead(notif.id)
    if (hasNav) onNavigate?.(notif.navTo)
  }

  return (
    <div
      role="listitem"
      style={{
        position: 'relative',
        display: 'flex',
        gap: 11,
        padding: '11px 14px 12px 12px',
        background: hovered ? ROW_HOVER_BG : 'transparent',
        cursor: hasNav ? 'pointer' : 'default',
        transition: 'background 140ms ease, opacity 220ms ease, transform 220ms ease',
        opacity: dismissing ? 0 : 1,
        transform: dismissing ? 'translateX(28px)' : 'none',
        animation: animationRef.current,
      }}
      onClick={handleItemClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Type icon */}
      <div style={{
        flexShrink: 0,
        width: 28, height: 28,
        borderRadius: 7,
        background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: cfg.color,
        marginTop: 1,
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div style={{
          fontSize: 12.5,
          fontWeight: notif.read ? 400 : 600,
          color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)',
          lineHeight: 1.35,
          marginBottom: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingRight: 20,
        }}>
          {notif.title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 11.5,
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 7,
        }}>
          {notif.description}
        </div>

        {/* Tag chip + timestamp + unread dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 6px',
            borderRadius: 4,
            background: cfg.bg,
            color: cfg.color,
            fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.05em',
            fontFamily: 'monospace',
            flexShrink: 0,
          }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', opacity: 0.7 }}>
            {relativeTime(notif.ts)}
          </span>
          {!notif.read && (
            <div style={{
              width: 4, height: 4,
              borderRadius: '50%',
              background: 'var(--text-muted)',
              flexShrink: 0,
              opacity: 0.6,
            }}>
              <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Unread</span>
            </div>
          )}
          {/* Navigation path hint for navigable types */}
          {hasNav && (
            <span style={{
              marginLeft: 'auto',
              fontSize: 10, fontWeight: 500,
              color: hovered ? cfg.color : 'var(--text-muted)',
              opacity: hovered ? 0.9 : 0.45,
              fontFamily: 'monospace',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              paddingRight: hovered ? 14 : 0,
              transition: 'color 140ms, opacity 140ms, padding-right 140ms',
            }}>
              {notif.navTo}
            </span>
          )}
        </div>
      </div>

      {/* Chevron arrow — navigable items only, visible on hover */}
      {hasNav && hovered && (
        <div style={{
          position: 'absolute',
          top: '50%', right: 10,
          transform: 'translateY(-50%)',
          color: cfg.color,
          opacity: 0.7,
          display: 'flex', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      )}

      {/* Dismiss × — shown on hover for non-nav items */}
      {hovered && !hasNav && (
        <button
          onClick={handleDismiss}
          aria-label={`Dismiss: ${notif.title}`}
          style={{
            position: 'absolute',
            top: 8, right: 8,
            width: 20, height: 20,
            borderRadius: 5,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 13, lineHeight: 1, padding: 0,
            transition: 'color 120ms, background 120ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-card)' }}
        >
          ×
        </button>
      )}

      {/* Dismiss for navigable items — small × always accessible at top-right */}
      {hasNav && (
        <button
          onClick={handleDismiss}
          aria-label={`Dismiss: ${notif.title}`}
          style={{
            position: 'absolute',
            top: 8, right: 8,
            width: 18, height: 18,
            borderRadius: 4,
            border: 'none',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 13, lineHeight: 1, padding: 0,
            opacity: hovered ? 0.7 : 0.3,
            transition: 'opacity 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = hovered ? '0.7' : '0.3'}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ─── Group label ──────────────────────────────────────────────────────────────

function GroupLabel({ label }) {
  return (
    <div style={{
      padding: '8px 14px 4px',
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    }}>
      {label}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
      animation: 'notifEmptyIn 280ms cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <div style={{ marginBottom: 10, color: 'var(--text-muted)', opacity: 0.45 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 4.17-1.75 6.58-2.73 7.75A1 1 0 0 0 3 18.5h18a1 1 0 0 0 .73-1.75C20.75 15.58 19 13.17 19 9a7 7 0 0 0-7-7z"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="9 10 11 12 15 8" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
        You're all caught up
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        No new notifications
      </div>
    </div>
  )
}

// ─── Main popover ─────────────────────────────────────────────────────────────

export default function NotificationsPopover({ open, anchorRef, onClose, onNavigate }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [markingAll, setMarkingAll]       = useState(false)
  const [visible, setVisible]             = useState(false)
  const [closing, setClosing]             = useState(false)
  const [entering, setEntering]           = useState(false)
  const [pos, setPos]                     = useState({ top: 0, left: 0 })

  const popoverRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const todayItems  = notifications.filter(n => isToday(n.ts))
  const olderItems  = notifications.filter(n => !isToday(n.ts))

  // Position from anchor — clamped to viewport
  useEffect(() => {
    if (!open || !anchorRef?.current) return
    const r = anchorRef.current.getBoundingClientRect()
    const PANEL_W = 360, PANEL_H = 520, GAP = 8
    const rawLeft = Math.min(r.left, window.innerWidth - PANEL_W - GAP)
    const rawTop = r.bottom + GAP
    const top = rawTop + PANEL_H > window.innerHeight
      ? Math.max(GAP, r.top - PANEL_H - GAP)
      : rawTop
    setPos({ top, left: Math.max(GAP, rawLeft) })
    setClosing(false)
    setVisible(true)
    setEntering(true)
    setTimeout(() => setEntering(false), 600)
    setTimeout(() => popoverRef.current?.focus(), 50)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reposition on resize or scroll while open
  useEffect(() => {
    if (!visible || !anchorRef?.current) return
    function reposition() {
      const r = anchorRef.current?.getBoundingClientRect()
      if (!r) return
      const PANEL_W = 360, PANEL_H = 520, GAP = 8
      const rawLeft = Math.min(r.left, window.innerWidth - PANEL_W - GAP)
      const rawTop = r.bottom + GAP
      const top = rawTop + PANEL_H > window.innerHeight
        ? Math.max(GAP, r.top - PANEL_H - GAP)
        : rawTop
      setPos({ top, left: Math.max(GAP, rawLeft) })
    }
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [visible, anchorRef])

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => { setVisible(false); setClosing(false); onClose?.() }, 150)
  }, [onClose])

  useEffect(() => {
    if (!visible) return
    function handler(e) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) handleClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [visible, handleClose, anchorRef])

  useEffect(() => {
    if (!visible) return
    function handler(e) { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [visible, handleClose])

  function handleDismiss(id) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  function handleMarkRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function handleMarkAllRead() {
    setMarkingAll(true)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setTimeout(() => setMarkingAll(false), 400)
  }

  function handleNavigate(path) {
    onNavigate?.(path)
    handleClose()
  }

  if (!visible) return null

  return createPortal(
    <>
      <style>{`
        @keyframes notifPopoverIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notifPopoverOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-5px) scale(0.98); }
        }
        @keyframes notifItemIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes notifEmptyIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .notif-scroll::-webkit-scrollbar { width: 4px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 99px; }
        .notif-scroll { scrollbar-width: thin; scrollbar-color: var(--border-default) transparent; }
      `}</style>

      <div
        ref={popoverRef}
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
        tabIndex={-1}
        style={{
          outline: 'none',
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: 360,
          maxHeight: 520,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: closing
            ? 'notifPopoverOut 150ms cubic-bezier(0.4,0,1,1) both'
            : 'notifPopoverIn 200ms cubic-bezier(0.22,1,0.36,1) both',
          transformOrigin: 'top center',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 14px 11px',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: '#E8613A', color: '#fff',
                padding: '1px 6px', borderRadius: 999, lineHeight: 1.6,
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-secondary)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '3px 6px', borderRadius: 5,
                  transition: 'color 200ms ease, background 140ms ease',
                  fontWeight: 500,
                }}
                onMouseEnter={e => e.currentTarget.style.background = ROW_HOVER_BG}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={handleClose}
              style={{
                width: 24, height: 24, borderRadius: 6, border: 'none',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)',
                fontSize: 16, lineHeight: 1, padding: 0,
                transition: 'background 120ms, color 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
              aria-label="Close notifications"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="notif-scroll" role="list" style={{ flex: 1, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {todayItems.length > 0 && (
                <>
                  <GroupLabel label="Today" />
                  {todayItems.map((n, i) => (
                    <NotifItem
                      key={n.id} notif={n} index={i}
                      onDismiss={handleDismiss} onMarkRead={handleMarkRead}
                      onNavigate={handleNavigate}
                      entering={entering}
                    />
                  ))}
                </>
              )}
              {olderItems.length > 0 && (
                <>
                  <GroupLabel label="Earlier" />
                  {olderItems.map((n, i) => (
                    <NotifItem
                      key={n.id} notif={n} index={todayItems.length + i}
                      onDismiss={handleDismiss} onMarkRead={handleMarkRead}
                      onNavigate={handleNavigate}
                      entering={entering}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
