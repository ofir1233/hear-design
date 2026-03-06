import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ── Action button SVG icons ───────────────────────────────────────────────────

function ThumbUpIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.0637 6.63346C13.3964 6.14544 14.0445 5.85642 14.6917 6.07286L14.8305 6.12727L15.0219 6.22141C15.9547 6.72081 16.5166 7.64658 16.5166 8.74691L16.5087 8.98533C16.4917 9.23887 16.4467 9.48335 16.384 9.71773C17.8917 9.79833 18.999 11.1995 18.704 12.7011L18.1129 15.7102C17.9398 16.5906 17.1676 17.2263 16.2696 17.2263L11.5084 17.2263C11.0742 17.2263 10.6754 17.0776 10.3573 16.8302C10.0222 17.1412 9.57489 17.3331 9.08198 17.3333L7.12627 17.3333C6.12119 17.3333 5.30103 16.5438 5.25064 15.5519L5.2482 15.4553L5.2482 10.9349C5.2482 9.8977 6.08904 9.05686 7.12627 9.05686L9.08198 9.05686C9.71988 9.05717 10.2832 9.37624 10.6226 9.86323C11.4507 9.43874 11.7342 9.04471 11.9627 8.60507L11.9706 8.58918L11.9792 8.57389L12.9977 6.74106L13.0637 6.63346ZM7.12627 10.3089C6.78052 10.3089 6.50024 10.5892 6.50024 10.9349L6.50024 15.4553C6.5004 15.8009 6.78062 16.0813 7.12627 16.0813L9.08137 16.0813C9.42687 16.0811 9.70724 15.8008 9.70739 15.4553L9.70739 10.9349C9.70739 10.5893 9.42697 10.3091 9.08137 10.3089L7.12627 10.3089ZM14.317 7.26927C14.2332 7.2316 14.1366 7.26908 14.092 7.34936L13.0735 9.18219C12.6916 9.91696 12.1654 10.5415 10.8824 11.1293L10.8824 15.3483C10.8825 15.6939 11.1627 15.9743 11.5084 15.9743L16.2696 15.9743C16.5688 15.9743 16.8263 15.7622 16.884 15.4687L17.4752 12.4596C17.6272 11.6862 17.0352 10.9663 16.247 10.9661L14.298 10.9661C14.7923 10.3875 15.2644 9.58937 15.2646 8.74691C15.2646 8.06638 14.9146 7.53815 14.317 7.26927Z" fill="#9ca3af"/></svg> }
function ThumbDownIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.9363 17.3665C10.6036 17.8546 9.95554 18.1436 9.30826 17.9271L9.16949 17.8727L8.97813 17.7786C8.0453 17.2792 7.48338 16.3534 7.48338 15.2531L7.49133 15.0147C7.5083 14.7611 7.55333 14.5167 7.61604 14.2823C6.10831 14.2017 5.00101 12.8005 5.29597 11.2989L5.88714 8.2898C6.06017 7.40944 6.8324 6.77365 7.73037 6.77365L12.4916 6.77365C12.9258 6.77365 13.3246 6.92236 13.6427 7.16981C13.9778 6.85878 14.4251 6.66691 14.918 6.66667L16.8737 6.66667C17.8788 6.66667 18.699 7.45621 18.7494 8.44815L18.7518 8.54474L18.7518 13.0651C18.7518 14.1023 17.911 14.9431 16.8737 14.9431L14.918 14.9431C14.2801 14.9428 13.7168 14.6238 13.3774 14.1368C12.5493 14.5613 12.2658 14.9553 12.0373 15.3949L12.0294 15.4108L12.0208 15.4261L11.0023 17.2589L10.9363 17.3665ZM16.8737 13.6911C17.2195 13.6911 17.4998 13.4108 17.4998 13.0651L17.4998 8.54474C17.4996 8.19913 17.2194 7.91872 16.8737 7.91872L14.9186 7.91872C14.5731 7.91888 14.2928 8.19923 14.2926 8.54474L14.2926 13.0651C14.2926 13.4107 14.573 13.6909 14.9186 13.6911L16.8737 13.6911ZM9.68302 16.7307C9.76677 16.7684 9.8634 16.7309 9.908 16.6506L10.9265 14.8178C11.3084 14.083 11.8346 13.4585 13.1176 12.8707L13.1176 8.65173C13.1175 8.30605 12.8373 8.0257 12.4916 8.0257L7.73037 8.0257C7.4312 8.0257 7.17369 8.23775 7.11596 8.53129L6.52478 11.5404C6.37285 12.3138 6.96477 13.0337 7.75299 13.0339L9.70197 13.0339C9.20775 13.6125 8.73559 14.4106 8.73543 15.2531C8.73543 15.9336 9.0854 16.4618 9.68302 16.7307Z" fill="#9ca3af"/></svg> }
function RegenerateIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7.06984 12C7.06984 9.42265 9.21665 7.33331 11.8649 7.33331C14.5131 7.33331 16.6599 9.42265 16.6599 12C16.6599 14.5773 14.5131 16.6666 11.8649 16.6666C10.3202 16.6666 8.94594 15.9558 8.06898 14.8518M7.06984 12L8.93458 10.9522M7.06984 12L5.99324 10.1852" stroke="#9ca3af" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CopyIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11.8665 9.33332C12.2289 9.33332 12.5411 9.3326 12.7969 9.3535C13.0604 9.37504 13.3227 9.42292 13.5749 9.55141C13.9506 9.74295 14.2567 10.0486 14.4486 10.4251C14.577 10.6772 14.625 10.9392 14.6465 11.2025C14.6674 11.458 14.6667 11.7698 14.6667 12.1315V15.8685C14.6667 16.23 14.6673 16.5415 14.6465 16.7969C14.625 17.0601 14.577 17.3221 14.4486 17.5742C14.257 17.9502 13.9512 18.2567 13.5749 18.4486C13.3228 18.577 13.0607 18.6249 12.7975 18.6465C12.5421 18.6673 12.2307 18.6666 11.8691 18.6666H8.13151C7.76987 18.6666 7.45799 18.6673 7.20247 18.6465C6.93925 18.6249 6.6772 18.577 6.42513 18.4486C6.0486 18.2567 5.74297 17.9506 5.55143 17.5749C5.42294 17.3227 5.37506 17.0604 5.35351 16.7969C5.34306 16.669 5.33842 16.5269 5.33594 16.3717L5.33333 15.8665V12.1334C5.33333 11.7711 5.33262 11.4589 5.35351 11.2031C5.37505 10.9396 5.42291 10.6773 5.55143 10.4251C5.74316 10.0489 6.04889 9.74315 6.42513 9.55141C6.67736 9.4229 6.93961 9.37503 7.20312 9.3535C7.45896 9.3326 7.77109 9.33332 8.13346 9.33332H11.8665ZM8.13346 10.6666C7.7491 10.6666 7.50082 10.6675 7.31185 10.6829C7.13065 10.6977 7.06352 10.7228 7.0306 10.7396C6.90519 10.8035 6.80349 10.9052 6.73958 11.0306C6.72281 11.0635 6.69774 11.1306 6.68294 11.3118C6.66751 11.5008 6.66666 11.7491 6.66666 12.1334V15.8665L6.66862 16.3509C6.67068 16.4845 6.67523 16.5937 6.68294 16.6881C6.69773 16.8691 6.72277 16.9364 6.73958 16.9694C6.80369 17.0951 6.9056 17.1974 7.0306 17.2611C7.06346 17.2778 7.13063 17.3029 7.3112 17.3177C7.49982 17.3331 7.74788 17.3333 8.13151 17.3333H11.8691C12.2527 17.3333 12.5003 17.3331 12.6888 17.3177C12.8694 17.3029 12.9365 17.2778 12.9694 17.2611C13.0946 17.1972 13.197 17.0944 13.2611 16.9687C13.2778 16.9358 13.303 16.8686 13.3177 16.6888C13.3331 16.5003 13.3333 16.2521 13.3333 15.8685V12.1315C13.3333 11.7479 13.3331 11.4998 13.3177 11.3112C13.3029 11.1306 13.2778 11.0635 13.2611 11.0306C13.1974 10.9056 13.0951 10.8037 12.9694 10.7396C12.9364 10.7228 12.8691 10.6977 12.6881 10.6829C12.4993 10.6675 12.2509 10.6666 11.8665 10.6666H8.13346ZM15.8665 5.33332C16.2289 5.33332 16.5411 5.3326 16.7969 5.3535C17.0604 5.37504 17.3227 5.42292 17.5749 5.55141C17.9506 5.74295 18.2567 6.04858 18.4486 6.42511C18.5771 6.67735 18.6249 6.93956 18.6465 7.20311C18.6674 7.45889 18.6667 7.77108 18.6667 8.13345V11.8665C18.6667 12.2289 18.6674 12.5411 18.6465 12.7969C18.6249 13.0603 18.577 13.3221 18.4486 13.5742C18.2567 13.9507 17.9504 14.2569 17.5742 14.4486C17.3222 14.577 17.0601 14.6249 16.7969 14.6465C16.755 14.6499 16.7117 14.6527 16.6668 14.655C16.299 14.6741 16 14.3672 16 13.9989C16 13.6309 16.2989 13.3463 16.6659 13.3195C16.6737 13.3189 16.6813 13.3183 16.6888 13.3177C16.8687 13.303 16.9358 13.2778 16.9687 13.2611C17.0943 13.1971 17.1972 13.0947 17.2611 12.9694C17.2779 12.9364 17.3029 12.8691 17.3177 12.6881C17.3331 12.4992 17.3333 12.2509 17.3333 11.8665V8.13345C17.3333 7.74916 17.3331 7.50071 17.3177 7.31183C17.3029 7.13102 17.2779 7.0636 17.2611 7.03058C17.1974 6.90559 17.0951 6.80368 16.9694 6.73957C16.9364 6.72276 16.8691 6.69772 16.6881 6.68293C16.4993 6.66749 16.2509 6.66665 15.8665 6.66665H12.1335C11.7491 6.66665 11.5008 6.66749 11.3118 6.68293C11.1307 6.69773 11.0635 6.72279 11.0306 6.73957C10.9052 6.80348 10.8035 6.90518 10.7396 7.03058C10.7228 7.0635 10.6977 7.13063 10.6829 7.31183C10.6823 7.31924 10.6818 7.32673 10.6812 7.33432C10.6542 7.70122 10.3691 7.99998 10.0012 7.99998C9.63288 7.99998 9.3259 7.70097 9.34495 7.33315C9.34728 7.28831 9.3501 7.24496 9.35351 7.20311C9.37505 6.93959 9.42291 6.67735 9.55143 6.42511C9.74316 6.04887 10.0489 5.74315 10.4251 5.55141C10.6774 5.4229 10.9396 5.37503 11.2031 5.3535C11.459 5.3326 11.7711 5.33332 12.1335 5.33332H15.8665Z" fill="#9ca3af"/></svg> }
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
