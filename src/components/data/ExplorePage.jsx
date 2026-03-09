import { useState, useRef } from 'react'

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5v10A1.5 1.5 0 0118.5 16H13l-4 4v-4H5.5A1.5 1.5 0 014 14.5v-10z" stroke="#9ca3af" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.0637 6.63346C13.3964 6.14544 14.0445 5.85642 14.6917 6.07286L14.8305 6.12727L15.0219 6.22141C15.9547 6.72081 16.5166 7.64658 16.5166 8.74691L16.5087 8.98533C16.4917 9.23887 16.4467 9.48335 16.384 9.71773C17.8917 9.79833 18.999 11.1995 18.704 12.7011L18.1129 15.7102C17.9398 16.5906 17.1676 17.2263 16.2696 17.2263L11.5084 17.2263C11.0742 17.2263 10.6754 17.0776 10.3573 16.8302C10.0222 17.1412 9.57489 17.3331 9.08198 17.3333L7.12627 17.3333C6.12119 17.3333 5.30103 16.5438 5.25064 15.5519L5.2482 15.4553L5.2482 10.9349C5.2482 9.8977 6.08904 9.05686 7.12627 9.05686L9.08198 9.05686C9.71988 9.05717 10.2832 9.37624 10.6226 9.86323C11.4507 9.43874 11.7342 9.04471 11.9627 8.60507L11.9706 8.58918L11.9792 8.57389L12.9977 6.74106L13.0637 6.63346ZM7.12627 10.3089C6.78052 10.3089 6.50024 10.5892 6.50024 10.9349L6.50024 15.4553C6.5004 15.8009 6.78062 16.0813 7.12627 16.0813L9.08137 16.0813C9.42687 16.0811 9.70724 15.8008 9.70739 15.4553L9.70739 10.9349C9.70739 10.5893 9.42697 10.3091 9.08137 10.3089L7.12627 10.3089ZM14.317 7.26927C14.2332 7.2316 14.1366 7.26908 14.092 7.34936L13.0735 9.18219C12.6916 9.91696 12.1654 10.5415 10.8824 11.1293L10.8824 15.3483C10.8825 15.6939 11.1627 15.9743 11.5084 15.9743L16.2696 15.9743C16.5688 15.9743 16.8263 15.7622 16.884 15.4687L17.4752 12.4596C17.6272 11.6862 17.0352 10.9663 16.247 10.9661L14.298 10.9661C14.7923 10.3875 15.2644 9.58937 15.2646 8.74691C15.2646 8.06638 14.9146 7.53815 14.317 7.26927Z" fill="#9ca3af"/></svg>
  )
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11.8665 9.33332C12.2289 9.33332 12.5411 9.3326 12.7969 9.3535C13.0604 9.37504 13.3227 9.42292 13.5749 9.55141C13.9506 9.74295 14.2567 10.0486 14.4486 10.4251C14.577 10.6772 14.625 10.9392 14.6465 11.2025C14.6674 11.458 14.6667 11.7698 14.6667 12.1315V15.8685C14.6667 16.23 14.6673 16.5415 14.6465 16.7969C14.625 17.0601 14.577 17.3221 14.4486 17.5742C14.257 17.9502 13.9512 18.2567 13.5749 18.4486C13.3228 18.577 13.0607 18.6249 12.7975 18.6465C12.5421 18.6673 12.2307 18.6666 11.8691 18.6666H8.13151C7.76987 18.6666 7.45799 18.6673 7.20247 18.6465C6.93925 18.6249 6.6772 18.577 6.42513 18.4486C6.0486 18.2567 5.74297 17.9506 5.55143 17.5749C5.42294 17.3227 5.37506 17.0604 5.35351 16.7969C5.34306 16.669 5.33842 16.5269 5.33594 16.3717L5.33333 15.8665V12.1334C5.33333 11.7711 5.33262 11.4589 5.35351 11.2031C5.37505 10.9396 5.42291 10.6773 5.55143 10.4251C5.74316 10.0489 6.04889 9.74315 6.42513 9.55141C6.67736 9.4229 6.93961 9.37503 7.20312 9.3535C7.45896 9.3326 7.77109 9.33332 8.13346 9.33332H11.8665ZM8.13346 10.6666C7.7491 10.6666 7.50082 10.6675 7.31185 10.6829C7.13065 10.6977 7.06352 10.7228 7.0306 10.7396C6.90519 10.8035 6.80349 10.9052 6.73958 11.0306C6.72281 11.0635 6.69774 11.1306 6.68294 11.3118C6.66751 11.5008 6.66666 11.7491 6.66666 12.1334V15.8665L6.66862 16.3509C6.67068 16.4845 6.67523 16.5937 6.68294 16.6881C6.69773 16.8691 6.72277 16.9364 6.73958 16.9694C6.80369 17.0951 6.9056 17.1974 7.0306 17.2611C7.06346 17.2778 7.13063 17.3029 7.3112 17.3177C7.49982 17.3331 7.74788 17.3333 8.13151 17.3333H11.8691C12.2527 17.3333 12.5003 17.3331 12.6888 17.3177C12.8694 17.3029 12.9365 17.2778 12.9694 17.2611C13.0946 17.1972 13.197 17.0944 13.2611 16.9687C13.2778 16.9358 13.303 16.8686 13.3177 16.6888C13.3331 16.5003 13.3333 16.2521 13.3333 15.8685V12.1315C13.3333 11.7479 13.3331 11.4998 13.3177 11.3112C13.3029 11.1306 13.2778 11.0635 13.2611 11.0306C13.1974 10.9056 13.0951 10.8037 12.9694 10.7396C12.9364 10.7228 12.8691 10.6977 12.6881 10.6829C12.4993 10.6675 12.2509 10.6666 11.8665 10.6666H8.13346ZM15.8665 5.33332C16.2289 5.33332 16.5411 5.3326 16.7969 5.3535C17.0604 5.37504 17.3227 5.42292 17.5749 5.55141C17.9506 5.74295 18.2567 6.04858 18.4486 6.42511C18.5771 6.67735 18.6249 6.93956 18.6465 7.20311C18.6674 7.45889 18.6667 7.77108 18.6667 8.13345V11.8665C18.6667 12.2289 18.6674 12.5411 18.6465 12.7969C18.6249 13.0603 18.577 13.3221 18.4486 13.5742C18.2567 13.9507 17.9504 14.2569 17.5742 14.4486C17.3222 14.577 17.0601 14.6249 16.7969 14.6465C16.755 14.6499 16.7117 14.6527 16.6668 14.655C16.299 14.6741 16 14.3672 16 13.9989C16 13.6309 16.2989 13.3463 16.6659 13.3195C16.6737 13.3189 16.6813 13.3183 16.6888 13.3177C16.8687 13.303 16.9358 13.2778 16.9687 13.2611C17.0943 13.1971 17.1972 13.0947 17.2611 12.9694C17.2779 12.9364 17.3029 12.8691 17.3177 12.6881C17.3331 12.4992 17.3333 12.2509 17.3333 11.8665V8.13345C17.3333 7.74916 17.3331 7.50071 17.3177 7.31183C17.3029 7.13102 17.2779 7.0636 17.2611 7.03058C17.1974 6.90559 17.0951 6.80368 16.9694 6.73957C16.9364 6.72276 16.8691 6.69772 16.6881 6.68293C16.4993 6.66749 16.2509 6.66665 15.8665 6.66665H12.1335C11.7491 6.66665 11.5008 6.66749 11.3118 6.68293C11.1307 6.69773 11.0635 6.72279 11.0306 6.73957C10.9052 6.80348 10.8035 6.90518 10.7396 7.03058C10.7228 7.0635 10.6977 7.13063 10.6829 7.31183C10.6823 7.31924 10.6818 7.32673 10.6812 7.33432C10.6542 7.70122 10.3691 7.99998 10.0012 7.99998C9.63288 7.99998 9.3259 7.70097 9.34495 7.33315C9.34728 7.28831 9.3501 7.24496 9.35351 7.20311C9.37505 6.93959 9.42291 6.67735 9.55143 6.42511C9.74316 6.04887 10.0489 5.74315 10.4251 5.55141C10.6774 5.4229 10.9396 5.37503 11.2031 5.3535C11.459 5.3326 11.7711 5.33332 12.1335 5.33332H15.8665Z" fill="#9ca3af"/></svg>
  )
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15.5 4.5l4 4L8 20H4v-4L15.5 4.5z" stroke="#9ca3af" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="11.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="11.5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="3.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.9 6.8l5.2-2.8M4.9 8.2l5.2 2.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.2" stroke="currentColor" strokeWidth="1.15" />
      <line x1="6.5" y1="5.5" x2="6.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6.5" cy="4" r="0.65" fill="currentColor" />
    </svg>
  )
}

function FeedbackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.15" />
      <path d="M4.5 5.2c0-.9.9-1.6 2-1.6s2 .7 2 1.6c0 .7-.5 1.3-1.3 1.5L7 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6.5" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

// ── Design tokens (local) ─────────────────────────────────────────────────────

const SHADOW = '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'
const SHADOW_HOVER = '0 2px 6px rgba(0,0,0,0.09), 0 6px 18px rgba(0,0,0,0.06)'
const CORAL = '#FF7056'
const COBALT = '#1779F7'
const GREEN = '#4BA373'
const AMBER = '#F59E0B'
const RED = '#EF4444'

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionCard({ children, style, accentColor, ...rest }) {
  return (
    <div {...rest} style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: SHADOW,
      borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ title, right, onCollapse, collapsed, divider = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: divider ? '1px solid var(--border-default)' : 'none',
    }}>
      <span style={{
        fontSize: 14, fontWeight: 600,
        color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {right}
        {onCollapse && (
          <button
            onClick={onCollapse}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: 6,
              background: 'var(--bg-active)', border: '1px solid var(--border-default)',
              cursor: 'pointer', color: 'var(--text-muted)',
              transition: 'background 140ms ease, color 140ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {collapsed ? <ChevronDown /> : <ChevronUp />}
          </button>
        )}
      </div>
    </div>
  )
}

function OutlineBtn({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 28, padding: '0 11px',
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-default)',
        borderRadius: 7,
        fontSize: 12, color: 'var(--text-secondary)',
        fontFamily: "'Byrd', sans-serif",
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background 130ms ease, border-color 130ms ease, color 130ms ease',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      {children}
    </button>
  )
}

function IconBtn({ children, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 4, borderRadius: 6,
        background: 'none', border: 'none',
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
    >
      {children}
    </button>
  )
}

function Chip({ children, color, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 22, padding: '0 9px',
      borderRadius: 99,
      fontSize: 11, fontWeight: 500, fontFamily: "'Byrd', sans-serif",
      background: bg || 'var(--bg-active)',
      color: color || 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
    }}>
      {children}
    </span>
  )
}

// ── Call Summary ──────────────────────────────────────────────────────────────

const MOCK_TAGS = [
  { key: 'Call_Type',        value: 'Renewal Inquiry'     },
  { key: 'Account_Tier',     value: 'Enterprise'          },
  { key: 'Region',           value: 'EMEA'                },
  { key: 'Renewal_Quarter',  value: 'Q2 2023'             },
  { key: 'Upsell_Flag',      value: 'Premium Analytics'   },
  { key: 'Escalation',       value: 'Sales Manager'       },
]

function TagPill({ text, variant }) {
  const isKey = variant === 'key'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 24, padding: '0 9px',
      borderRadius: isKey ? '6px 0 0 6px' : '0 6px 6px 0',
      fontSize: 11, fontFamily: "'Byrd', sans-serif",
      border: `1px solid ${isKey ? 'var(--border-default)' : 'rgba(23,121,247,0.25)'}`,
      background: isKey ? 'transparent' : 'rgba(23,121,247,0.07)',
      color: isKey ? 'var(--text-secondary)' : COBALT,
      fontWeight: isKey ? 500 : 400,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}

function CallSummarySection({ call }) {
  const [showTags, setShowTags] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const summaryText = call.summary || 'The customer contacted enterprise support ahead of their Q2 contract renewal to discuss volume discount tiers for a 500+ seat license expansion. The agent reviewed current tier pricing, confirmed eligibility for a 15% volume discount, and identified an upsell opportunity for the Premium Analytics add-on. The call was escalated to the regional sales manager to approve a custom pricing package. A follow-up proposal is scheduled for next Wednesday. The customer expressed strong intent to expand across two additional subsidiaries by Q3.'
  const truncated = summaryText.length > 200 && !expanded

  return (
    <SectionCard data-inspector="CallSummarySection">
      <SectionHeader
        title="Call summary"
        divider={false}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setShowTags(t => !t)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 26, padding: '0 10px',
                background: showTags ? 'rgba(23,121,247,0.08)' : 'var(--bg-canvas)',
                border: `1px solid ${showTags ? 'rgba(23,121,247,0.3)' : 'var(--border-default)'}`,
                borderRadius: 7,
                fontSize: 11, color: showTags ? COBALT : 'var(--text-secondary)',
                fontFamily: "'Byrd', sans-serif",
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {showTags ? 'Hide tags' : 'Show tags'}
              {showTags ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              <IconBtn title="Comment"><CommentIcon /></IconBtn>
              <IconBtn title="Like"><ThumbUpIcon /></IconBtn>
              <IconBtn title="Copy"><CopyIcon /></IconBtn>
              <IconBtn title="Edit"><EditIcon /></IconBtn>
            </div>
          </div>
        }
      />

      <div style={{ padding: '0 20px 18px' }}>
        <p style={{
          margin: 0, fontSize: 13.5, lineHeight: 1.7,
          color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
        }}>
          {truncated ? summaryText.slice(0, 200) + '… ' : summaryText + ' '}
          <span
            onClick={() => setExpanded(e => !e)}
            style={{ color: COBALT, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {truncated ? 'Show all.' : 'Show less.'}
          </span>
        </p>

        <div style={{
          display: 'grid',
          gridTemplateRows: showTags ? '1fr' : '0fr',
          transition: 'grid-template-rows 280ms cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              marginTop: 10,
              paddingTop: 12,
              borderTop: '1px solid var(--border-default)',
              opacity: showTags ? 1 : 0,
              transform: showTags ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 220ms ease, transform 280ms cubic-bezier(0.22,1,0.36,1)',
            }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                textTransform: 'uppercase', marginBottom: 9,
              }}>
                TAGS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {MOCK_TAGS.map((tag, i) => (
                  <div key={i} style={{ display: 'inline-flex' }}>
                    <TagPill text={tag.key} variant="key" />
                    <TagPill text={tag.value} variant="value" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ── Quick Stats Row ───────────────────────────────────────────────────────────

function StopwatchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="12.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 8.5V12.5l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 2.5h5M11 2.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SentimentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 13.5c.8 1.5 5.7 1.5 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="13.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2.5L3.5 5.5v5c0 4.5 3.5 7.5 7.5 8.5 4-1 7.5-4 7.5-8.5v-5L11 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.5 11l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3l2.09 4.26L18 8.07l-3.5 3.41.83 4.82L11 14l-4.33 2.3.83-4.82L4 8.07l4.91-.81L11 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const SENTIMENT_COLOR = {
  Positive: GREEN, Negative: RED, Neutral: 'var(--text-secondary)', Natural: 'var(--text-secondary)',
}

function QuickStatsRow({ call }) {
  const sentimentColor = SENTIMENT_COLOR['Neutral'] // mock

  const stats = [
    {
      icon: <StopwatchIcon />,
      label: 'Handle Time',
      value: '22 mins',
      color: COBALT,
      bg: `${COBALT}0E`,
    },
    {
      icon: <SentimentIcon />,
      label: 'Overall Sentiment',
      value: 'Neutral',
      color: sentimentColor,
      bg: 'var(--bg-active)',
    },
    {
      icon: <ShieldIcon />,
      label: 'Compliance',
      value: '91/100',
      color: GREEN,
      bg: `${GREEN}0E`,
    },
    {
      icon: <StarIcon />,
      label: 'Agent Score',
      value: '76/100',
      color: AMBER,
      bg: `${AMBER}0E`,
    },
  ]

  return (
    <div data-inspector="QuickStatsRow" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          boxShadow: SHADOW,
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* Icon bubble */}
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: s.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.color === 'var(--text-secondary)' || s.color === 'var(--text-muted)' ? 'var(--text-secondary)' : s.color,
          }}>
            {s.icon}
          </div>
          {/* Label */}
          <div>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em',
              color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
              textTransform: 'uppercase', marginBottom: 4,
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700,
              color: s.color,
              fontFamily: "'Byrd', sans-serif",
              lineHeight: 1,
            }}>
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Call Metrics ──────────────────────────────────────────────────────────────

function MetricTooltip({ text }) {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => {
          const r = ref.current?.getBoundingClientRect()
          if (r) setPos({ x: r.left + r.width / 2, y: r.top })
        }}
        onMouseLeave={() => setPos(null)}
        style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'default', opacity: 0.6, transition: 'opacity 120ms ease' }}
        onMouseOver={e => { e.currentTarget.style.opacity = '1' }}
        onMouseOut={e => { e.currentTarget.style.opacity = '0.6' }}
      >
        <InfoIcon />
      </span>
      {pos && (
        <div style={{
          position: 'fixed', left: pos.x, top: pos.y - 10,
          transform: 'translate(-50%, -100%)',
          background: 'var(--d100)', color: 'var(--p100)',
          fontSize: 11, fontWeight: 450, fontFamily: "'Byrd', sans-serif",
          lineHeight: 1.5, padding: '7px 11px', borderRadius: 7,
          whiteSpace: 'normal', pointerEvents: 'none', zIndex: 9999,
          boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
          maxWidth: 220,
        }}>
          {text}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--d100)',
          }} />
        </div>
      )}
    </>
  )
}

function MetricCell({ label, value, tooltip }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      data-inspector="MetricCell"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '13px 15px',
        background: hovered ? 'var(--bg-active)' : 'var(--bg-canvas)',
        border: `1px solid ${hovered ? 'var(--border-default)' : 'var(--border-default)'}`,
        borderRadius: 9,
        transition: 'background 140ms ease, box-shadow 140ms ease',
        boxShadow: hovered ? '0 1px 4px rgba(0,0,0,0.07)' : 'none',
        cursor: 'default',
      }}
    >
      <div style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
        color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
        textTransform: 'uppercase', marginBottom: 5,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{
          fontSize: 14, fontWeight: 600,
          color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
          lineHeight: 1,
        }}>
          {value}
        </span>
        <MetricTooltip text={tooltip} />
      </div>
    </div>
  )
}

function CallMetricsSection({ call }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const primaryMetrics = [
    { label: 'Relevant call?',        value: 'Yes',                                                tooltip: 'Whether this call was relevant to an active opportunity or case' },
    { label: 'Requested Service',     value: 'Volume discount & renewal',                          tooltip: 'The type of service the customer requested during this call' },
    { label: 'Lead status',           value: 'Active negotiation',                                 tooltip: 'The lead status outcome associated with this call' },
    { label: 'Direction',             value: call.callType === 'inbound' ? 'Inbound' : 'Outbound', tooltip: 'Whether the call was initiated by the customer or the agent' },
    { label: 'Deal size',             value: call.proposedPrice ? `$${call.proposedPrice.toLocaleString()}` : '$5,364', tooltip: 'Estimated deal value associated with this opportunity' },
    { label: 'Handle time',           value: '22 mins',                                            tooltip: 'Total duration from call start to resolution, including hold and wrap-up time' },
  ]
  const extraMetrics = [
    { label: 'Call date',        value: call.callDate,          tooltip: 'The date this call took place' },
    { label: 'Account region',   value: call.destination || 'EMEA', tooltip: 'Location or region associated with this account' },
    { label: 'Priority',         value: call.priority || 'N/A', tooltip: 'Urgency level assigned to this call record' },
    { label: 'Status',           value: call.status || 'N/A',   tooltip: 'Current processing status of this call record' },
    { label: 'Next action',      value: 'Send pricing proposal', tooltip: 'Agreed follow-up action coming out of this call' },
    { label: 'Follow-up date',   value: 'March 22, 2023',       tooltip: 'Scheduled date for the next touchpoint with this account' },
  ]

  const visibleMetrics = showMore ? [...primaryMetrics, ...extraMetrics] : primaryMetrics

  return (
    <SectionCard data-inspector="CallMetricsSection">
      <SectionHeader
        title="Call metrics"
        right={<OutlineBtn>Edit metrics</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '16px 20px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {visibleMetrics.map((m, i) => (
              <MetricCell key={i} label={m.label} value={m.value} tooltip={m.tooltip} />
            ))}
          </div>
          <button
            onClick={() => setShowMore(s => !s)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              width: '100%', height: 32,
              background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
              borderRadius: 8, cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
              transition: 'background 130ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
          >
            {showMore ? 'Show less' : 'Show more'} {showMore ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      )}
    </SectionCard>
  )
}

// ── Agent Evaluation ──────────────────────────────────────────────────────────

const SALES_METRICS = [
  { label: 'Identifying Sales Opportunities',      score: 91 },
  { label: 'Handling Objections',                  score: 78 },
  { label: 'Persuasion and Solution Presentation', score: 84 },
  { label: 'Creating a Sense of Urgency',          score: 52 },
]
const PROF_METRICS = [
  { label: 'Customer Needs Assessment',  score: 88 },
  { label: 'Self-Introduction',          score: 95 },
  { label: 'Positive Engagement',        score: 81 },
  { label: 'Call Summary and Reflection',score: 44 },
]

function ScoreBar({ label, score }) {
  const barColor = score >= 70 ? COBALT : score >= 40 ? AMBER : RED
  const trackBg  = score >= 70 ? 'rgba(23,121,247,0.1)' : score >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.1)'

  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1 }}>
          {label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
          color: barColor, flexShrink: 0, marginLeft: 8,
        }}>
          {score}<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 10 }}>/100</span>
        </span>
      </div>
      <div style={{ height: 5, background: trackBg, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: barColor, borderRadius: 99,
          transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </div>
  )
}

const AVATAR_COLORS = {
  blue: '#418FF4', peach: '#F3AC9E', orange: '#FF7056',
  lilac: '#D799E2', green: '#6AB18A', teal: '#5FA8A0',
  sage: '#8FA882', horizon: '#7AAAB8',
}

function AgentEvaluationSection({ call }) {
  const [collapsed, setCollapsed] = useState(false)
  const agent = call.assignedTo || { name: 'John Smith', initials: 'JS', color: 'orange' }
  const avatarColor = AVATAR_COLORS[agent.color] || CORAL

  // Overall score average
  const allScores = [...SALES_METRICS, ...PROF_METRICS].map(m => m.score)
  const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
  const avgColor = avg >= 70 ? GREEN : avg >= 40 ? AMBER : RED

  return (
    <SectionCard data-inspector="AgentEvaluationSection">
      <SectionHeader
        title="Agent evaluation"
        right={<OutlineBtn>Edit metrics</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
            {/* Agent card */}
            <div style={{
              flexShrink: 0, width: 118,
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              padding: '20px 12px',
            }}>
              {/* Avatar ring */}
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 700, color: '#fff',
                fontFamily: "'Byrd', sans-serif",
                boxShadow: `0 0 0 3px ${avatarColor}30`,
              }}>
                {agent.initials}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.3 }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginTop: 3 }}>
                  Agent operating
                </div>
              </div>
              {/* Score pill */}
              <div style={{
                padding: '3px 10px', borderRadius: 99,
                background: `${avgColor}18`,
                border: `1px solid ${avgColor}40`,
                fontSize: 12, fontWeight: 700, color: avgColor,
                fontFamily: "'Byrd', sans-serif",
              }}>
                {avg}/100
              </div>
            </div>

            {/* Score columns */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
              <div>
                <div style={{
                  fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)',
                  fontFamily: "'Byrd', sans-serif", marginBottom: 12,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Sales Techniques
                </div>
                {SALES_METRICS.map(m => <ScoreBar key={m.label} label={m.label} score={m.score} />)}
              </div>
              <div>
                <div style={{
                  fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)',
                  fontFamily: "'Byrd', sans-serif", marginBottom: 12,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Professionalism
                </div>
                {PROF_METRICS.map(m => <ScoreBar key={m.label} label={m.label} score={m.score} />)}
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ── Monitored Events ──────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  { text: 'Agent did not confirm next steps before closing the call.',     severity: 'warning' },
  { text: 'Customer mentioned a competitor — CompetitorAlert triggered.',  severity: 'warning' },
  { text: 'Call duration exceeded 20-minute SLA threshold.',               severity: 'alert'   },
]

const SEV = {
  warning: { icon: '⚠', color: AMBER,  bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.22)' },
  alert:   { icon: '⚠', color: RED,    bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.22)'  },
}

function MonitoredEventsSection() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SectionCard data-inspector="MonitoredEventsSection">
      <SectionHeader
        title="Monitored events detected"
        right={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <OutlineBtn>Go to Alerts</OutlineBtn>
          </div>
        }
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {MOCK_EVENTS.map((ev, i) => {
            const s = SEV[ev.severity]
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderLeft: `3px solid ${s.color}`,
                borderRadius: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 13, lineHeight: 1 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
                    {ev.text}
                  </span>
                </div>
                <OutlineBtn style={{ fontSize: 11 }}>
                  <FeedbackIcon /> Give feedback
                </OutlineBtn>
              </div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}

// ── Transcription ─────────────────────────────────────────────────────────────

const TRANSCRIPT_LINES = [
  { speaker: 'Agent',    time: '0:08',  text: "Good morning, this is Sarah from enterprise support. How can I help you today?" },
  { speaker: 'Customer', time: '0:15',  text: "Hi Sarah, I'm calling about our upcoming renewal. We're looking to expand to 500 seats and wanted to understand what discount tiers are available." },
  { speaker: 'Agent',    time: '0:38',  text: "Absolutely, congratulations on the growth. For 500+ seats you'd qualify for our Enterprise tier — that includes a 15% volume discount off the standard rate and priority SLA coverage." },
  { speaker: 'Customer', time: '1:02',  text: "That's helpful. We've also been looking at your Premium Analytics add-on — what does that run at enterprise pricing?" },
  { speaker: 'Agent',    time: '1:18',  text: "Premium Analytics at your tier is $12 per seat per month. Given the volume, I can flag this to your account manager to bundle it into the renewal proposal." },
  { speaker: 'Customer', time: '1:44',  text: "One thing — we've been evaluating a competitor as well. Their bundle pricing is coming in around 20% lower." },
  { speaker: 'Agent',    time: '2:01',  text: "I appreciate you sharing that. I want to make sure we're putting together something compelling. Let me escalate this to our regional sales manager so we can put together a custom package for you." },
  { speaker: 'Customer', time: '2:28',  text: "That sounds good. We'd need the proposal by end of next week to stay on our procurement timeline." },
  { speaker: 'Agent',    time: '2:42',  text: "Noted — I'll get that across by Wednesday. I'll also include a case study on the analytics ROI from a similar EMEA account." },
]

function TranscriptionSection() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SectionCard data-inspector="TranscriptionSection">
      <SectionHeader
        title="Transcription"
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '14px 20px 20px' }}>
          <div className="smooth-scroll" style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            maxHeight: 300, overflowY: 'auto',
          }}>
            {TRANSCRIPT_LINES.map((line, i) => {
              const isAgent = line.speaker === 'Agent'
              return (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: isAgent ? 'row' : 'row-reverse',
                  gap: 10, alignItems: 'flex-end',
                }}>
                  {/* Avatar dot */}
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: isAgent ? COBALT : 'var(--bg-active)',
                    border: `1px solid ${isAgent ? 'transparent' : 'var(--border-default)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: isAgent ? '#fff' : 'var(--text-muted)',
                    fontFamily: "'Byrd', sans-serif",
                  }}>
                    {isAgent ? 'A' : 'C'}
                  </div>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{
                      padding: '9px 13px',
                      background: isAgent ? 'var(--bg-active)' : `${COBALT}0E`,
                      border: `1px solid ${isAgent ? 'var(--border-default)' : `${COBALT}25`}`,
                      borderRadius: isAgent ? '12px 12px 12px 3px' : '12px 12px 3px 12px',
                      fontSize: 13, color: 'var(--text-secondary)',
                      fontFamily: "'Byrd', sans-serif", lineHeight: 1.55,
                    }}>
                      {line.text}
                    </div>
                    <div style={{
                      fontSize: 10, color: 'var(--text-muted)', marginTop: 3,
                      fontFamily: "'Byrd', sans-serif",
                      textAlign: isAgent ? 'left' : 'right',
                      paddingLeft: isAgent ? 4 : 0,
                      paddingRight: isAgent ? 0 : 4,
                    }}>
                      {line.time}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ── Customer Section ──────────────────────────────────────────────────────────

const CUSTOMER_HISTORY = [
  { agent: { name: 'Sarah Chen',    initials: 'SC', color: '#418FF4' }, sentiment: 'Positive', topic: 'Enterprise renewal — Q2',        date: 'Mar 15, 2023', current: true  },
  { agent: { name: 'Marcus Webb',   initials: 'MW', color: '#6AB18A' }, sentiment: 'Neutral',  topic: 'Onboarding follow-up',           date: 'Jan 22, 2023', current: false },
  { agent: { name: 'Sarah Chen',    initials: 'SC', color: '#418FF4' }, sentiment: 'Positive', topic: 'Q1 business review',             date: 'Jan 05, 2023', current: false },
  { agent: { name: 'Layla Torres',  initials: 'LT', color: '#F3AC9E' }, sentiment: 'Negative', topic: 'SSO integration escalation',     date: 'Nov 18, 2022', current: false },
  { agent: { name: 'Marcus Webb',   initials: 'MW', color: '#6AB18A' }, sentiment: 'Positive', topic: 'Initial contract signing',       date: 'Oct 03, 2022', current: false },
]

const SENTIMENT_STYLE = {
  Positive: { color: GREEN,  bg: `${GREEN}15`,  label: 'Positive' },
  Negative: { color: RED,    bg: `${RED}12`,    label: 'Negative' },
  Natural:  { color: 'var(--text-muted)', bg: 'var(--bg-active)', label: 'Natural' },
}

function CustomerSection() {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)

  const thStyle = {
    padding: '9px 14px',
    fontSize: 10.5, fontWeight: 700,
    color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
    textTransform: 'uppercase', letterSpacing: '0.07em',
    textAlign: 'left', borderBottom: '1px solid var(--border-default)',
    background: 'var(--bg-canvas)',
    whiteSpace: 'nowrap',
  }

  return (
    <SectionCard data-inspector="CustomerSection">
      <SectionHeader
        title="Customer"
        right={<OutlineBtn>Go to Customer page</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Agent', 'Sentiment', 'Topic', 'Call Date', 'Call'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CUSTOMER_HISTORY.map((row, i) => {
                const sent = SENTIMENT_STYLE[row.sentiment] || SENTIMENT_STYLE.Natural
                const isHovered = hoveredRow === i
                return (
                  <tr
                    key={i}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: row.current
                        ? `${COBALT}07`
                        : isHovered ? 'var(--bg-active)' : 'transparent',
                      transition: 'background 120ms ease',
                    }}
                  >
                    {/* Agent */}
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 27, height: 27, borderRadius: '50%',
                          background: row.agent.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9.5, fontWeight: 700, color: '#fff',
                          fontFamily: "'Byrd', sans-serif", flexShrink: 0,
                          boxShadow: `0 0 0 2px ${row.agent.color}30`,
                        }}>
                          {row.agent.initials}
                        </div>
                        <span style={{ color: row.current ? COBALT : 'var(--text-secondary)', fontWeight: row.current ? 500 : 400 }}>
                          {row.agent.name}
                        </span>
                      </div>
                    </td>
                    {/* Sentiment badge */}
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        height: 22, padding: '0 9px', borderRadius: 99,
                        fontSize: 11.5, fontWeight: 500, fontFamily: "'Byrd', sans-serif",
                        background: sent.bg, color: sent.color,
                      }}>
                        {sent.label}
                      </span>
                    </td>
                    {/* Topic */}
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                      {row.topic}
                    </td>
                    {/* Date */}
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                      {row.date}
                    </td>
                    {/* Call link */}
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: 12.5, fontWeight: row.current ? 600 : 400,
                        color: row.current ? COBALT : 'var(--text-muted)',
                        cursor: row.current ? 'pointer' : 'default',
                        textDecoration: row.current ? 'underline' : 'none',
                        textDecorationColor: `${COBALT}60`,
                        fontFamily: "'Byrd', sans-serif",
                      }}>
                        Open
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}

// ── ExplorePage ───────────────────────────────────────────────────────────────

const STATUS_META = {
  'IN PROGRESS': { color: COBALT,  bg: `${COBALT}15`,  label: 'In Progress' },
  'DONE':        { color: GREEN,   bg: `${GREEN}15`,   label: 'Done'        },
}
const PRIORITY_META = {
  HIGH:   { color: CORAL,  bg: `${CORAL}15`  },
  MEDIUM: { color: AMBER,  bg: `${AMBER}15`  },
  LOW:    { color: GREEN,  bg: `${GREEN}15`  },
}

export default function ExplorePage({ call, onBack, isMobile = false, sidebarWidth = 272, sidebarTransition }) {
  const left = isMobile ? 0 : sidebarWidth
  const topicWords = call.summary ? call.summary.split(' ').slice(0, 6).join(' ').replace(/[.,]/g, '') : 'Enterprise Licensing Inquiry — Q2 Renewal'
  const topic = topicWords
  const statusMeta   = STATUS_META[call.status]
  const priorityMeta = PRIORITY_META[call.priority]

  return (
    <div
      data-inspector="ExplorePage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Top header bar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            height: 28, padding: '0 10px',
            background: 'none', border: '1px solid var(--border-default)',
            borderRadius: 7, cursor: 'pointer',
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif",
            transition: 'background 130ms ease, color 130ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <BackIcon /> Data
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: "'Byrd', sans-serif", userSelect: 'none' }}>›</span>
        <span style={{
          fontSize: 12, color: 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: 280,
        }}>
          {call.id}
        </span>
      </div>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 48px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Hero topic card ────────────────────────────────────────── */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: SHADOW,
          }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em',
                  color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                  textTransform: 'uppercase', marginBottom: 6,
                }}>
                  TOPIC
                </div>
                <h1 style={{
                  margin: '0 0 12px', fontSize: 20, fontWeight: 700,
                  color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                  lineHeight: 1.2, letterSpacing: '-0.02em',
                }}>
                  {topic}
                </h1>
                {/* Meta chips row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {statusMeta && (
                    <Chip color={statusMeta.color} bg={statusMeta.bg}>{statusMeta.label}</Chip>
                  )}
                  {priorityMeta && call.priority && (
                    <Chip color={priorityMeta.color} bg={priorityMeta.bg}>{call.priority}</Chip>
                  )}
                  {call.callDate && (
                    <Chip>{call.callDate}</Chip>
                  )}
                  {call.callType && (
                    <Chip>{call.callType === 'inbound' ? '↙ Inbound' : '↗ Outbound'}</Chip>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, paddingTop: 2 }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 32, padding: '0 13px',
                  background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                  position: 'relative',
                  transition: 'background 130ms ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
                >
                  <CommentIcon /> Comments
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    width: 17, height: 17, borderRadius: '50%',
                    background: CORAL, color: '#fff',
                    fontSize: 9, fontWeight: 700, fontFamily: "'Byrd', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>3</span>
                </button>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 32, padding: '0 13px',
                  background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                  transition: 'background 130ms ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
                >
                  <ShareIcon /> Share
                </button>
              </div>
            </div>
          </div>

          <CallSummarySection call={call} />
          <QuickStatsRow call={call} />
          <CallMetricsSection call={call} />
          <AgentEvaluationSection call={call} />
          <MonitoredEventsSection />
          <TranscriptionSection />
          <CustomerSection />

        </div>
      </div>
    </div>
  )
}
