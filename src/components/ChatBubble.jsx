import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ── Action button SVG icons ───────────────────────────────────────────────────

function ThumbUpIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.4844 4.07927C14.0159 3.29971 15.051 2.83802 16.085 3.18376L16.3066 3.27067L16.6123 3.42106C18.1024 4.2188 19 5.6976 19 7.45524L18.9873 7.8361C18.9602 8.2411 18.8883 8.63162 18.7881 9.00602C21.1965 9.13477 22.9653 11.373 22.4941 13.7717L21.5498 18.5783C21.2734 19.9846 20.0399 21.0002 18.6055 21.0002H11C10.3064 21.0002 9.66927 20.7626 9.16113 20.3674C8.62588 20.8642 7.91139 21.1707 7.12402 21.1711H4C2.3945 21.1711 1.08439 19.9099 1.00391 18.3254L1 18.1711V10.9504C1 9.29351 2.34315 7.95036 4 7.95036H7.12402C8.143 7.95085 9.04286 8.46054 9.58496 9.23845C10.9077 8.56037 11.3606 7.93095 11.7256 7.22868L11.7383 7.20329L11.752 7.17888L13.3789 4.25114L13.4844 4.07927ZM4 9.95036C3.44772 9.95036 3 10.3981 3 10.9504V18.1711C3.00025 18.7231 3.44787 19.1711 4 19.1711H7.12305C7.67495 19.1708 8.1228 18.723 8.12305 18.1711V10.9504C8.12305 10.3982 7.67511 9.95062 7.12305 9.95036H4ZM15.4863 5.09489C15.3525 5.03472 15.1982 5.09459 15.127 5.22282L13.5 8.15056C12.89 9.32426 12.0494 10.3219 10 11.2609V18.0002C10.0001 18.5523 10.4478 19.0002 11 19.0002H18.6055C19.0834 19.0002 19.4947 18.6614 19.5869 18.1925L20.5312 13.3859C20.7739 12.1504 19.8284 11.0004 18.5693 11.0002H15.4561C16.2455 10.0759 16.9997 8.80098 17 7.45524C17 6.36818 16.441 5.5244 15.4863 5.09489Z" fill="#9ca3af"/></svg> }
function ThumbDownIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.0861 20.1592C9.55455 20.9387 8.51942 21.4004 7.48547 21.0547L7.26379 20.9678L6.95813 20.8174C5.46804 20.0196 4.57043 18.5408 4.57043 16.7832L4.58313 16.4023C4.61024 15.9973 4.68218 15.6068 4.78235 15.2324C2.37392 15.1037 0.605134 12.8654 1.07629 10.4668L2.02063 5.66014C2.29702 4.25386 3.53056 3.23827 4.96497 3.23827L12.5704 3.23827C13.2641 3.23827 13.9012 3.47581 14.4093 3.87108C14.9446 3.37424 15.659 3.06775 16.4464 3.06737L19.5704 3.06737C21.1759 3.06737 22.486 4.32857 22.5665 5.91307L22.5704 6.06737L22.5704 13.2881C22.5704 14.9449 21.2273 16.2881 19.5704 16.2881L16.4464 16.2881C15.4274 16.2876 14.5276 15.7779 13.9855 15C12.6627 15.6781 12.2098 16.3075 11.8448 17.0098L11.8322 17.0351L11.8185 17.0596L10.1915 19.9873L10.0861 20.1592ZM19.5704 14.2881C20.1227 14.2881 20.5704 13.8404 20.5704 13.2881L20.5704 6.06737C20.5702 5.5153 20.1226 5.06737 19.5704 5.06737L16.4474 5.06737C15.8955 5.06763 15.4476 5.51546 15.4474 6.06737L15.4474 13.2881C15.4474 13.8402 15.8953 14.2878 16.4474 14.2881L19.5704 14.2881ZM8.08411 19.1435C8.21789 19.2037 8.37224 19.1438 8.44348 19.0156L10.0704 16.0879C10.6804 14.9142 11.5211 13.9165 13.5704 12.9775L13.5704 6.23827C13.5703 5.6861 13.1226 5.23827 12.5704 5.23827L4.96497 5.23827C4.48707 5.23827 4.07574 5.577 3.98352 6.04588L3.03919 10.8525C2.79649 12.0881 3.74201 13.238 5.0011 13.2383L8.11438 13.2383C7.32491 14.1625 6.5707 15.4375 6.57043 16.7832C6.57043 17.8703 7.12947 18.714 8.08411 19.1435Z" fill="#9ca3af"/></svg> }
function RegenerateIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7.06984 12C7.06984 9.42265 9.21665 7.33331 11.8649 7.33331C14.5131 7.33331 16.6599 9.42265 16.6599 12C16.6599 14.5773 14.5131 16.6666 11.8649 16.6666C10.3202 16.6666 8.94594 15.9558 8.06898 14.8518M7.06984 12L8.93458 10.9522M7.06984 12L5.99324 10.1852" stroke="#9ca3af" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CopyIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11.7998 8C12.3433 8 12.8117 7.99893 13.1953 8.03028C13.5906 8.06259 13.984 8.13442 14.3623 8.32715C14.926 8.61445 15.385 9.0729 15.6729 9.6377C15.8655 10.0158 15.9375 10.4089 15.9697 10.8037C16.0011 11.187 16 11.6548 16 12.1973V17.8027C16 18.345 16.001 18.8122 15.9697 19.1953C15.9374 19.5902 15.8655 19.9832 15.6729 20.3613C15.3855 20.9253 14.9269 21.3851 14.3623 21.6729C13.9843 21.8655 13.5911 21.9374 13.1963 21.9697C12.8132 22.0011 12.3461 22 11.8037 22H6.19727C5.65481 22 5.187 22.0011 4.80372 21.9697C4.40889 21.9375 4.01581 21.8655 3.6377 21.6729C3.07291 21.385 2.61446 20.926 2.32715 20.3623C2.13441 19.984 2.06259 19.5906 2.03028 19.1953C2.0146 19.0035 2.00763 18.7904 2.00391 18.5576L2 17.7998V12.2002C2 11.6566 1.99893 11.1884 2.03028 10.8047C2.06258 10.4094 2.13437 10.016 2.32715 9.6377C2.61475 9.07334 3.07334 8.61475 3.6377 8.32715C4.01605 8.13437 4.40942 8.06258 4.80469 8.03028C5.18845 7.99893 5.65664 8 6.2002 8H11.7998ZM6.2002 10C5.62366 10 5.25123 10.0013 4.96778 10.0244C4.69598 10.0466 4.59528 10.0842 4.5459 10.1094C4.3578 10.2052 4.20524 10.3578 4.10938 10.5459C4.08422 10.5953 4.04662 10.696 4.02442 10.9678C4.00127 11.2512 4 11.6237 4 12.2002V17.7998L4.00293 18.5264C4.00602 18.7268 4.01285 18.8906 4.02442 19.0322C4.04661 19.3037 4.08417 19.4046 4.10938 19.4541C4.20555 19.6427 4.35841 19.7961 4.5459 19.8916C4.5952 19.9167 4.69595 19.9544 4.9668 19.9766C5.24974 19.9997 5.62183 20 6.19727 20H11.8037C12.3791 20 12.7505 19.9997 13.0332 19.9766C13.3042 19.9544 13.4048 19.9167 13.4541 19.8916C13.642 19.7959 13.7956 19.6416 13.8916 19.4531C13.9167 19.4037 13.9545 19.303 13.9766 19.0332C13.9997 18.7504 14 18.3782 14 17.8027V12.1973C14 11.6218 13.9997 11.2497 13.9766 10.9668C13.9544 10.696 13.9167 10.5952 13.8916 10.5459C13.7961 10.3584 13.6427 10.2055 13.4541 10.1094C13.4046 10.0842 13.3037 10.0466 13.0322 10.0244C12.749 10.0013 12.3764 10 11.7998 10H6.2002ZM17.7998 2C18.3434 2 18.8117 1.99893 19.1953 2.03028C19.5906 2.06259 19.984 2.13442 20.3623 2.32715C20.926 2.61446 21.385 3.0729 21.6729 3.6377C21.8656 4.01606 21.9374 4.40937 21.9697 4.80469C22.0011 5.18836 22 5.65665 22 6.2002V11.7998C22 12.3434 22.0011 12.8116 21.9697 13.1953C21.9374 13.5904 21.8655 13.9832 21.6729 14.3613C21.3851 14.926 20.9256 15.3853 20.3613 15.6729C19.9832 15.8655 19.5902 15.9374 19.1953 15.9697C19.1325 15.9749 19.0675 15.9791 19.0003 15.9826C18.4485 16.0112 18 15.5509 18 14.9984C18 14.4464 18.4484 14.0195 18.9989 13.9792C19.0105 13.9784 19.0219 13.9775 19.0332 13.9766C19.303 13.9545 19.4037 13.9167 19.4531 13.8916C19.6415 13.7956 19.7958 13.642 19.8916 13.4541C19.9168 13.4047 19.9544 13.3037 19.9766 13.0322C19.9997 12.7489 20 12.3764 20 11.7998V6.2002C20 5.62377 19.9997 5.25109 19.9766 4.96778C19.9544 4.69656 19.9168 4.59543 19.8916 4.5459C19.7961 4.35842 19.6427 4.20555 19.4541 4.10938C19.4046 4.08417 19.3037 4.04661 19.0322 4.02442C18.749 4.00127 18.3764 4 17.7998 4H12.2002C11.6237 4 11.2512 4.00127 10.9678 4.02442C10.696 4.04662 10.5953 4.08422 10.5459 4.10938C10.3578 4.20524 10.2052 4.3578 10.1094 4.5459C10.0842 4.59528 10.0466 4.69598 10.0244 4.96778C10.0235 4.97888 10.0226 4.99012 10.0218 5.00151C9.98131 5.55186 9.55363 6 9.0018 6C8.44932 6 7.98885 5.55149 8.01744 4.99976C8.02092 4.9325 8.02515 4.86747 8.03028 4.80469C8.06258 4.40942 8.13437 4.01605 8.32715 3.6377C8.61475 3.07334 9.07334 2.61475 9.6377 2.32715C10.016 2.13437 10.4094 2.06258 10.8047 2.03028C11.1884 1.99893 11.6566 2 12.2002 2H17.7998Z" fill="#9ca3af"/></svg> }
function CheckIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function MoreIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14.3337C12.5523 14.3337 13 14.7814 13 15.3337C12.9998 15.8858 12.5522 16.3337 12 16.3337C11.4478 16.3337 11.0002 15.8858 11 15.3337C11 14.7814 11.4477 14.3337 12 14.3337ZM12 10.9997C12.5522 10.9997 12.9998 11.4476 13 11.9997C13 12.552 12.5523 12.9997 12 12.9997C11.4477 12.9997 11 12.552 11 11.9997C11.0002 11.4476 11.4478 10.9997 12 10.9997ZM12 7.66669C12.5523 7.66669 13 8.1144 13 8.66669C13 9.21897 12.5523 9.66669 12 9.66669C11.4477 9.66669 11 9.21897 11 8.66669C11 8.1144 11.4477 7.66669 12 7.66669Z" fill="#9ca3af"/></svg> }

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
