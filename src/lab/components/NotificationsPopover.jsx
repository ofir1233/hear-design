/**
 * NotificationsPopover — Design Lab only.
 * Full-featured notification panel with motion, type icons,
 * read/unread state, grouping, per-item dismiss, and empty state.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = Date.now()

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'processing',
    title: 'Audio Processing Complete',
    description: '48 new calls analyzed from the Oct 28 batch. Sentiment and topic data are ready to explore.',
    ts: NOW - 2 * 60 * 60 * 1000,
    read: false,
  },
  {
    id: 'n2',
    type: 'insight',
    title: 'Daily Insight Report · Consciousness Lab',
    description: 'Our AI analyzed your last 24 hours of focus sessions. A 15% increase in deep work was identified during morning hours. Full breakdown ready.',
    ts: NOW - 5 * 60 * 60 * 1000,
    read: false,
  },
  {
    id: 'n3',
    type: 'download',
    title: 'Agent Performance Report Ready',
    description: 'Your monthly agent evaluation export is ready for download.',
    ts: NOW - 26 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Compliance Flag Detected',
    description: '3 calls in the Oct 27 batch were flagged for potential policy violations. Review recommended.',
    ts: NOW - 30 * 60 * 60 * 1000,
    read: true,
  },
]

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  processing: {
    color: '#5BA3FF',
    bg: 'rgba(91,163,255,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 8h6M9 12h4"/>
      </svg>
    ),
  },
  insight: {
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z"/>
      </svg>
    ),
  },
  download: {
    color: '#4BA373',
    bg: 'rgba(75,163,115,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  alert: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
}

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

function NotifItem({ notif, index, onDismiss, onMarkRead, entering }) {
  const [dismissing, setDismissing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.processing

  function handleDismiss(e) {
    e.stopPropagation()
    setDismissing(true)
    setTimeout(() => onDismiss(notif.id), 220)
  }

  const entranceDelay = entering ? index * 35 : 0

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        gap: 11,
        padding: '11px 14px 11px 12px',
        background: hovered
          ? 'var(--bg-active)'
          : notif.read
            ? 'transparent'
            : cfg.bg,
        borderLeft: notif.read ? '3px solid transparent' : `3px solid ${cfg.color}`,
        cursor: 'pointer',
        transition: 'background 140ms ease',
        opacity: dismissing ? 0 : 1,
        transform: dismissing ? 'translateX(24px)' : 'none',
        animation: entering ? `notifItemIn 240ms cubic-bezier(0.22,1,0.36,1) ${entranceDelay}ms both` : 'none',
      }}
      onClick={() => !notif.read && onMarkRead(notif.id)}
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
        <div style={{
          fontSize: 12.5,
          fontWeight: notif.read ? 400 : 600,
          color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)',
          lineHeight: 1.35,
          marginBottom: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {notif.title}
        </div>
        <div style={{
          fontSize: 11.5,
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {notif.description}
        </div>
        <div style={{
          fontSize: 10.5,
          color: 'var(--text-muted)',
          marginTop: 5,
          opacity: 0.7,
        }}>
          {relativeTime(notif.ts)}
        </div>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          flexShrink: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: cfg.color,
          marginTop: 5,
          alignSelf: 'flex-start',
        }} />
      )}

      {/* Dismiss × — shown on hover */}
      {hovered && (
        <button
          onClick={handleDismiss}
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
            fontSize: 13,
            lineHeight: 1,
            padding: 0,
            transition: 'color 120ms, background 120ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'var(--bg-active)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.background = 'var(--bg-card)'
          }}
          title="Dismiss"
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
      fontSize: 10,
      fontWeight: 700,
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
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" fill="none" strokeWidth="1.5" strokeLinecap="round"/>
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

export default function NotificationsPopover({ open, anchorRef, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [markingAll, setMarkingAll] = useState(false)
  const [visible, setVisible] = useState(false)       // controls CSS animation class
  const [closing, setClosing] = useState(false)       // triggers exit animation
  const [entering, setEntering] = useState(false)     // stagger items on open
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const popoverRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const todayItems  = notifications.filter(n => isToday(n.ts))
  const olderItems  = notifications.filter(n => !isToday(n.ts))

  // Calculate position from anchor
  useEffect(() => {
    if (!open || !anchorRef?.current) return
    const r = anchorRef.current.getBoundingClientRect()
    setPos({
      top:  r.bottom + 8,
      left: Math.max(8, r.right - 360),
    })
    setClosing(false)
    setVisible(true)
    setEntering(true)
    setTimeout(() => setEntering(false), 600)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close with exit animation
  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      onClose?.()
    }, 150)
  }, [onClose])

  // Click outside
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

  // Escape key
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
        style={{
          position: 'fixed',
          top:  pos.top,
          left: pos.left,
          width: 360,
          maxHeight: 480,
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
          transformOrigin: 'top right',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 14px 11px',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                background: '#E8613A',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: 999,
                lineHeight: 1.6,
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  fontSize: 11.5,
                  color: markingAll ? 'var(--text-muted)' : 'var(--color-brand)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 6px',
                  borderRadius: 5,
                  transition: 'color 200ms ease, background 140ms ease',
                  fontWeight: 500,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={handleClose}
              style={{
                width: 24, height: 24,
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 16, lineHeight: 1, padding: 0,
                transition: 'background 120ms, color 120ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-active)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
              aria-label="Close notifications"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className="notif-scroll"
          style={{ flex: 1, overflowY: 'auto' }}
        >
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {todayItems.length > 0 && (
                <>
                  <GroupLabel label="Today" />
                  {todayItems.map((n, i) => (
                    <NotifItem
                      key={n.id}
                      notif={n}
                      index={i}
                      onDismiss={handleDismiss}
                      onMarkRead={handleMarkRead}
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
                      key={n.id}
                      notif={n}
                      index={todayItems.length + i}
                      onDismiss={handleDismiss}
                      onMarkRead={handleMarkRead}
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
