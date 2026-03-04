import { useState, useEffect } from 'react'

// ── Modal ──────────────────────────────────────────────────────────────────────
//
// Slots:
//   title     — string shown in the header
//   children  — body content
//   footer    — ReactNode rendered in the footer row (right-aligned)
//   width     — card width in px (default 440)
//
// Behaviour:
//   • Backdrop click → onClose
//   • Escape key     → onClose
//   • Enter/scale animation on open

export default function Modal({ open, onClose, title, children, footer, width = 440 }) {
  const [entered, setEntered] = useState(false)

  // Trigger enter animation one rAF after mount so the transition fires
  useEffect(() => {
    if (!open) { setEntered(false); return }
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position:       'fixed', inset: 0, zIndex: 800,
        display:        'flex', alignItems: 'center', justifyContent: 'center',
        background:     'rgba(0,0,0,0.40)',
        opacity:        entered ? 1 : 0,
        transition:     'opacity 180ms ease',
      }}
    >
      <div
        data-inspector="Modal"
        style={{
          width,
          maxWidth:     'calc(100vw - 40px)',
          background:   'var(--bg-elevated)',
          border:       '1px solid var(--border-default)',
          borderRadius: 12,
          boxShadow:    '0 20px 60px rgba(0,0,0,0.22)',
          overflow:     'hidden',
          transform:    entered ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          transition:   'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display:         'flex', alignItems: 'center', justifyContent: 'space-between',
          padding:         '16px 20px',
          borderBottom:    '1px solid var(--border-default)',
        }}>
          <span style={{
            fontSize:    'var(--type-p11)', fontWeight: 600,
            color:       'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            lineHeight:  1,
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              display:        'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6,
              background:     'none', border: 'none',
              color:          'var(--text-muted)', cursor: 'pointer',
              fontSize:       18, lineHeight: 1,
              fontFamily:     'system-ui, sans-serif',
              transition:     'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none';             e.currentTarget.style.color = 'var(--text-muted)'   }}
            aria-label="Close"
          >×</button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div style={{
            display:         'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
            padding:         '12px 20px',
            borderTop:       '1px solid var(--border-default)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
