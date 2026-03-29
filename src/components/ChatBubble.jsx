import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ThumbUpIcon, ThumbDownIcon, RegenerateIcon, CopyIcon, CheckIcon, ChatMoreIcon as MoreIcon } from './icons'

// ── Markdown render config (shared for all AI messages) ───────────────────────

const MD_COMPONENTS = {
  table:      ({ node, ...p }) => <table      style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, marginBottom: 8 }} {...p} />,
  th:         ({ node, ...p }) => <th         style={{ border: '1px solid var(--border-default)', padding: '6px 10px', background: 'var(--bg-active)', fontWeight: 600, textAlign: 'left', color: 'var(--text-primary)' }} {...p} />,
  td:         ({ node, ...p }) => <td         style={{ border: '1px solid var(--border-default)', padding: '6px 10px', color: 'var(--text-primary)' }} {...p} />,
  blockquote: ({ node, ...p }) => <blockquote style={{ borderLeft: '3px solid var(--border-default)', margin: '8px 0', padding: '4px 12px', color: 'var(--text-muted)', fontStyle: 'italic' }} {...p} />,
  code:       ({ node, inline, ...p }) => inline
    ? <code style={{ background: 'var(--bg-active)', borderRadius: 4, padding: '1px 5px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)' }} {...p} />
    : <pre  className="smooth-scroll" style={{ background: 'var(--bg-active)', borderRadius: 8, padding: '10px 14px', overflowX: 'auto', fontSize: 12, fontFamily: 'monospace', margin: '8px 0', color: 'var(--text-primary)' }}><code {...p} /></pre>,
  p:  ({ node, ...p }) => <p  style={{ margin: '0 0 6px 0', lineHeight: 1.6 }} {...p} />,
  h1: ({ node, ...p }) => <h1 style={{ fontSize: 16, fontWeight: 700, margin: '10px 0 6px', color: 'var(--text-primary)' }} {...p} />,
  h2: ({ node, ...p }) => <h2 style={{ fontSize: 14, fontWeight: 700, margin: '10px 0 6px', color: 'var(--text-primary)' }} {...p} />,
  h3: ({ node, ...p }) => <h3 style={{ fontSize: 13, fontWeight: 600, margin: '8px 0 4px', color: 'var(--text-primary)' }} {...p} />,
  ul: ({ node, ...p }) => <ul style={{ paddingLeft: 18, margin: '4px 0' }} {...p} />,
  ol: ({ node, ...p }) => <ol style={{ paddingLeft: 18, margin: '4px 0' }} {...p} />,
  li: ({ node, ...p }) => <li style={{ marginBottom: 2 }} {...p} />,
}

// ── ChatBubble ────────────────────────────────────────────────────────────────
//
// Props:
//   role        'user' | 'ai' | 'thinking'
//   text        string — message content
//   related     string[] — follow-up suggestions (AI only)
//   showActions boolean — whether the action row is visible
//   onCopy      () => void
//   copied      boolean — shows checkmark instead of copy icon
//   onMouseEnter/onMouseLeave — forwarded from parent for hover tracking

export default function ChatBubble({
  role = 'ai',
  text = '',
  related = [],
  showActions = false,
  onCopy,
  copied = false,
  onRelatedClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isAI       = role === 'ai'
  const isThinking = role === 'thinking'
  const [hoveredRelated, setHoveredRelated] = useState(null)

  // ── Thinking indicator ──────────────────────────────────────────────────────
  if (isThinking) {
    return (
      <div
        data-inspector="ChatBubble"
        style={{ display: 'flex', justifyContent: 'flex-start', animation: 'msgIn 250ms ease forwards', opacity: 0 }}
      >
        <div style={{
          padding: '12px 16px',
          borderRadius: '18px 18px 18px 4px',
          background: 'var(--bg-card)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {[0, 160, 320].map(delay => (
            <span key={delay} style={{
              width: 6, height: 6, borderRadius: '50%', background: '#9ca3af',
              animation: 'dot-bounce 1.1s ease-in-out infinite',
              animationDelay: `${delay}ms`,
              display: 'inline-block',
            }} />
          ))}
        </div>
      </div>
    )
  }

  // ── User / AI bubble ────────────────────────────────────────────────────────
  return (
    <div
      data-inspector="ChatBubble"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAI ? 'flex-start' : 'flex-end',
        opacity: 0,
        animation: 'msgIn 250ms ease forwards',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Bubble body ── */}
      <div style={{
        maxWidth: '75%',
        padding: isAI ? '8px 10px' : '12px 16px',
        borderRadius: isAI ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
        background: isAI ? 'transparent' : 'var(--color-brand)',
        color: isAI ? 'var(--text-primary)' : '#fff',
        opacity: isAI ? 0.8 : 1,
        fontSize: 14,
        lineHeight: 1.55,
        boxShadow: isAI ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        {isAI
          ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>{text}</ReactMarkdown>
          : text
        }
      </div>

      {/* ── AI action row ── */}
      {isAI && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginTop: 4,
          paddingLeft: 4,
          opacity: showActions ? 1 : 0,
          transition: 'opacity 150ms ease',
          pointerEvents: showActions ? 'auto' : 'none',
        }}>
          {[
            { title: 'Helpful',     icon: <ThumbUpIcon />,   onClick: undefined },
            { title: 'Not helpful', icon: <ThumbDownIcon />, onClick: undefined },
            { title: 'Regenerate',  icon: <RegenerateIcon />,onClick: undefined },
            { title: 'Copy',        icon: copied ? <CheckIcon /> : <CopyIcon />, onClick: onCopy },
            { title: 'More',        icon: <MoreIcon />,      onClick: undefined },
          ].map(({ title, icon, onClick }) => (
            <button
              key={title}
              title={title}
              onClick={onClick}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                transition: 'background 120ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              {icon}
            </button>
          ))}
        </div>
      )}

      {/* ── Related topics ── */}
      {isAI && related?.length > 0 && (
        <div style={{ marginTop: 20, width: '100%', maxWidth: '75%' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>Related</p>
          {related.map((topic, ri) => {
            const isHovered = hoveredRelated === ri
            return (
              <div
                key={ri}
                onClick={() => onRelatedClick?.(topic)}
                onMouseEnter={() => setHoveredRelated(ri)}
                onMouseLeave={() => setHoveredRelated(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 8px',
                  cursor: 'pointer',
                  opacity: 0,
                  animation: `slideInRight 220ms cubic-bezier(0.22,1,0.36,1) forwards`,
                  animationDelay: `${ri * 60}ms`,
                  borderBottom: isHovered ? '1px solid var(--text-secondary)' : '1px solid var(--border-default)',
                  transition: 'border-color 220ms ease',
                }}
              >
                <span style={{
                  fontSize: 13,
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  lineHeight: 1.4,
                  transition: 'color 180ms ease',
                }}>{topic}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                  flexShrink: 0,
                  marginLeft: 12,
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={isHovered ? 'var(--text-primary)' : '#9ca3af'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
