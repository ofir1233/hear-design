/**
 * NotificationsPopover — Design Lab only.
 * Rich actionable notifications: file downloads (CSV/PDF), mentions with
 * inline reply, plus passive info types. Full motion system via CSS keyframes.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = Date.now()

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Sarah Chen mentioned you',
    description: 'In "Q4 Agent Performance Review"',
    ts: NOW - 18 * 60 * 1000,
    read: false,
    meta: {
      mentionedBy: { name: 'Sarah Chen', initials: 'SC', color: '#FF7056' },
      snippet: 'Hey @ofir, can you double-check the sentiment scores for the ACME batch? Something looks off on the last column.',
      conversationId: 'conv-q4-review',
    },
  },
  {
    id: 'n2',
    type: 'csv_ready',
    title: 'Agent Report Export Ready',
    description: 'Your October agent performance report has been compiled.',
    ts: NOW - 2 * 60 * 60 * 1000,
    read: false,
    meta: {
      fileName: 'agent-report-oct-2025.csv',
      fileSize: '2.4 MB',
      rows: '4,821 rows',
    },
  },
  {
    id: 'n3',
    type: 'pdf_ready',
    title: 'Daily Trend Report Ready',
    description: 'AI-generated summary of today\'s call trends and sentiment shifts.',
    ts: NOW - 5 * 60 * 60 * 1000,
    read: false,
    meta: {
      fileName: 'daily-trends-oct-28-2025.pdf',
      fileSize: '840 KB',
      pages: '12 pages',
    },
  },
  {
    id: 'n4',
    type: 'processing',
    title: 'Audio Processing Complete',
    description: '48 new calls analyzed from the Oct 28 batch. Sentiment and topic data are ready.',
    ts: NOW - 26 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'n5',
    type: 'alert',
    title: 'Compliance Flag Detected',
    description: '3 calls in the Oct 27 batch were flagged for potential policy violations.',
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
        <path d="M8 21h8M12 17v4M9 8h6M9 12h4"/>
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
  csv_ready: {
    color: '#4BA373',
    bg: 'rgba(75,163,115,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  pdf_ready: {
    color: '#F97316',
    bg: 'rgba(249,115,22,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M9 13h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1H9v-3zM13 13h2M13 15.5h1.5M13 18h2"/>
      </svg>
    ),
  },
  mention: {
    color: '#5BA3FF',
    bg: 'rgba(91,163,255,0.10)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
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

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: 'notifSpin 700ms linear infinite', flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )
}

// ─── Download button — 3-state ────────────────────────────────────────────────

function DownloadButton({ notifId, fileType, dlState, onDownload }) {
  const state = dlState[notifId] || 'idle'
  const label = fileType === 'csv' ? 'CSV' : 'PDF'
  const isDone = state === 'done'
  const isLoading = state === 'downloading'

  return (
    <button
      onClick={e => { e.stopPropagation(); onDownload(notifId) }}
      disabled={isLoading || isDone}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 26,
        padding: '0 10px',
        borderRadius: 6,
        border: isDone
          ? '1px solid rgba(75,163,115,0.4)'
          : '1px solid rgba(91,163,255,0.35)',
        background: isDone
          ? 'rgba(75,163,115,0.12)'
          : isLoading
            ? 'rgba(91,163,255,0.08)'
            : 'rgba(91,163,255,0.12)',
        color: isDone ? '#4BA373' : '#5BA3FF',
        fontSize: 11.5,
        fontWeight: 600,
        cursor: isDone || isLoading ? 'default' : 'pointer',
        transition: 'all 200ms ease',
        transform: isLoading ? 'scale(0.97)' : 'scale(1)',
        whiteSpace: 'nowrap',
        minWidth: 110,
        justifyContent: 'center',
      }}
      onMouseEnter={e => { if (!isDone && !isLoading) e.currentTarget.style.background = 'rgba(91,163,255,0.20)' }}
      onMouseLeave={e => { if (!isDone && !isLoading) e.currentTarget.style.background = 'rgba(91,163,255,0.12)' }}
      onMouseDown={e => { if (!isDone && !isLoading) e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={e => { if (!isDone && !isLoading) e.currentTarget.style.transform = 'scale(1)' }}
    >
      {isLoading && <Spinner />}
      {isDone && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {!isLoading && !isDone && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )}
      {isLoading ? `Downloading…` : isDone ? `Downloaded` : `Download ${label}`}
    </button>
  )
}

// ─── Mention reply composer ────────────────────────────────────────────────────

function MentionReply({ notifId, replyState, onReplyChange, onSend, onCancel }) {
  const state = replyState[notifId] || { expanded: false, text: '', sending: false, sent: false }
  const textareaRef = useRef(null)

  useEffect(() => {
    if (state.expanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 230)
    }
  }, [state.expanded])

  if (state.sent) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11.5, color: '#4BA373', fontWeight: 500,
        animation: 'notifFadeIn 300ms ease both',
        padding: '4px 0',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Reply sent
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Reply button (collapsed state) */}
      {!state.expanded && (
        <button
          onClick={e => { e.stopPropagation(); onReplyChange(notifId, { expanded: true }) }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            height: 26, padding: '0 10px',
            borderRadius: 6,
            border: '1px solid rgba(91,163,255,0.35)',
            background: 'rgba(91,163,255,0.10)',
            color: '#5BA3FF',
            fontSize: 11.5, fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 150ms',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(91,163,255,0.20)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(91,163,255,0.10)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 17 4 12 9 7"/>
            <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
          </svg>
          Reply
        </button>
      )}

      {/* Expanded composer — CSS grid trick for height animation */}
      <div style={{
        display: 'grid',
        gridTemplateRows: state.expanded ? '1fr' : '0fr',
        transition: 'grid-template-rows 220ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            paddingTop: 2,
            opacity: state.expanded ? 1 : 0,
            transform: state.expanded ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 180ms ease, transform 180ms ease',
            transitionDelay: state.expanded ? '80ms' : '0ms',
          }}>
            <textarea
              ref={textareaRef}
              value={state.text}
              onChange={e => onReplyChange(notifId, { text: e.target.value })}
              onClick={e => e.stopPropagation()}
              placeholder="Write a reply…"
              rows={2}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid var(--border-input)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                fontSize: 12,
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 150ms',
              }}
              onFocus={e => e.target.style.borderColor = '#5BA3FF'}
              onBlur={e => e.target.style.borderColor = 'var(--border-input)'}
            />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                onClick={e => { e.stopPropagation(); onSend(notifId) }}
                disabled={!state.text.trim() || state.sending}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 26, padding: '0 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: state.text.trim() ? '#5BA3FF' : 'rgba(91,163,255,0.3)',
                  color: '#fff',
                  fontSize: 11.5, fontWeight: 600,
                  cursor: state.text.trim() && !state.sending ? 'pointer' : 'default',
                  transition: 'background 150ms, transform 100ms',
                }}
                onMouseDown={e => { if (state.text.trim()) e.currentTarget.style.transform = 'scale(0.95)' }}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {state.sending ? <Spinner /> : null}
                {state.sending ? 'Sending…' : 'Send'}
              </button>
              <button
                onClick={e => { e.stopPropagation(); onCancel(notifId) }}
                style={{
                  height: 26, padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border-default)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: 11.5, cursor: 'pointer',
                  transition: 'background 130ms, color 130ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Single notification item ─────────────────────────────────────────────────

function NotifItem({ notif, index, onDismiss, onMarkRead, entering, dlState, onDownload, replyState, onReplyChange, onSend, onCancel }) {
  const [dismissing, setDismissing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.processing

  const isActionable = ['csv_ready', 'pdf_ready', 'mention'].includes(notif.type)

  // Freeze animation string on mount — prevents re-firing when parent state updates (dlState/replyState)
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
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        gap: 11,
        padding: isActionable ? '11px 14px 13px 12px' : '11px 14px 11px 12px',
        background: hovered && !isActionable
          ? 'var(--bg-active)'
          : notif.read
            ? 'transparent'
            : cfg.bg,
        borderLeft: notif.read ? '3px solid transparent' : `3px solid ${cfg.color}`,
        cursor: isActionable ? 'default' : 'pointer',
        transition: 'background 140ms ease, opacity 220ms ease, transform 220ms ease',
        opacity: dismissing ? 0 : 1,
        transform: dismissing ? 'translateX(28px)' : 'none',
        animation: animationRef.current,
      }}
      onClick={!isActionable ? handleItemClick : undefined}
      onMouseEnter={() => !isActionable && setHovered(true)}
      onMouseLeave={() => !isActionable && setHovered(false)}
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
        {/* Title row */}
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
          marginBottom: 4,
        }}>
          {notif.description}
        </div>

        {/* ── Mention: avatar snippet + reply ──────────────── */}
        {notif.type === 'mention' && notif.meta && (
          <div style={{ marginBottom: 8 }}>
            {/* Who mentioned */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: notif.meta.mentionedBy.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {notif.meta.mentionedBy.initials}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {notif.meta.mentionedBy.name}
              </span>
            </div>
            {/* Snippet quote block */}
            <div style={{
              padding: '7px 10px',
              borderLeft: `2.5px solid ${cfg.color}`,
              background: 'rgba(91,163,255,0.06)',
              borderRadius: '0 6px 6px 0',
              fontSize: 11.5,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginBottom: 8,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              "{notif.meta.snippet}"
            </div>
            {/* Reply composer */}
            <MentionReply
              notifId={notif.id}
              replyState={replyState}
              onReplyChange={onReplyChange}
              onSend={onSend}
              onCancel={onCancel}
            />
          </div>
        )}

        {/* ── CSV ready: file meta + download ──────────────── */}
        {notif.type === 'csv_ready' && notif.meta && (
          <div style={{ marginBottom: 8 }}>
            {/* File chip */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', borderRadius: 5,
              background: 'rgba(75,163,115,0.10)',
              border: '1px solid rgba(75,163,115,0.2)',
              marginBottom: 8,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4BA373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 10.5, color: '#4BA373', fontWeight: 600 }}>{notif.meta.fileName}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {notif.meta.fileSize} · {notif.meta.rows}</span>
            </div>
            <div>
              <DownloadButton notifId={notif.id} fileType="csv" dlState={dlState} onDownload={onDownload} />
            </div>
          </div>
        )}

        {/* ── PDF ready: file meta + download ──────────────── */}
        {notif.type === 'pdf_ready' && notif.meta && (
          <div style={{ marginBottom: 8 }}>
            {/* File chip */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', borderRadius: 5,
              background: 'rgba(249,115,22,0.10)',
              border: '1px solid rgba(249,115,22,0.2)',
              marginBottom: 8,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 10.5, color: '#F97316', fontWeight: 600 }}>{notif.meta.fileName}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {notif.meta.fileSize} · {notif.meta.pages}</span>
            </div>
            <div>
              <DownloadButton notifId={notif.id} fileType="pdf" dlState={dlState} onDownload={onDownload} />
            </div>
          </div>
        )}

        {/* Timestamp + unread dot inline — keeps top-right clear for dismiss × */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 0 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', opacity: 0.7 }}>
            {relativeTime(notif.ts)}
          </span>
          {!notif.read && (
            <div style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: cfg.color,
              flexShrink: 0,
              opacity: 0.85,
            }} />
          )}
        </div>
      </div>

      {/* Dismiss × — shown on hover */}
      {hovered && !isActionable && (
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
            fontSize: 13, lineHeight: 1, padding: 0,
            transition: 'color 120ms, background 120ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-card)' }}
          title="Dismiss"
        >
          ×
        </button>
      )}

      {/* Actionable dismiss — always accessible as small × top-right */}
      {isActionable && (
        <button
          onClick={handleDismiss}
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
            opacity: 0.5,
            transition: 'opacity 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
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

export default function NotificationsPopover({ open, anchorRef, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [markingAll, setMarkingAll]       = useState(false)
  const [visible, setVisible]             = useState(false)
  const [closing, setClosing]             = useState(false)
  const [entering, setEntering]           = useState(false)
  const [pos, setPos]                     = useState({ top: 0, left: 0 })

  // Download state machine per notification id: 'idle' | 'downloading' | 'done'
  const [dlState, setDlState] = useState({})

  // Reply state per mention notification id
  const [replyState, setReplyState] = useState({})

  const popoverRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const todayItems  = notifications.filter(n => isToday(n.ts))
  const olderItems  = notifications.filter(n => !isToday(n.ts))

  // Position from anchor
  useEffect(() => {
    if (!open || !anchorRef?.current) return
    const r = anchorRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 8, left: r.left })
    setClosing(false)
    setVisible(true)
    setEntering(true)
    setTimeout(() => setEntering(false), 600)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Download flow
  function handleDownload(id) {
    if (dlState[id] && dlState[id] !== 'idle') return
    setDlState(prev => ({ ...prev, [id]: 'downloading' }))
    setTimeout(() => {
      setDlState(prev => ({ ...prev, [id]: 'done' }))
      handleMarkRead(id)
    }, 1600)
  }

  // Reply flow
  function handleReplyChange(id, patch) {
    setReplyState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }))
  }

  function handleSend(id) {
    handleReplyChange(id, { sending: true })
    setTimeout(() => {
      handleReplyChange(id, { sending: false, sent: true, expanded: false })
      handleMarkRead(id)
    }, 900)
  }

  function handleCancel(id) {
    handleReplyChange(id, { expanded: false, text: '' })
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
        @keyframes notifFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes notifSpin {
          to { transform: rotate(360deg); }
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
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '3px 6px', borderRadius: 5,
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
        <div className="notif-scroll" style={{ flex: 1, overflowY: 'auto' }}>
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
                      entering={entering}
                      dlState={dlState} onDownload={handleDownload}
                      replyState={replyState} onReplyChange={handleReplyChange}
                      onSend={handleSend} onCancel={handleCancel}
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
                      entering={entering}
                      dlState={dlState} onDownload={handleDownload}
                      replyState={replyState} onReplyChange={handleReplyChange}
                      onSend={handleSend} onCancel={handleCancel}
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
