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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5v10A1.5 1.5 0 0118.5 16H13l-4 4v-4H5.5A1.5 1.5 0 014 14.5v-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10.0861 20.1592C9.55455 20.9387 8.51942 21.4004 7.48547 21.0547L7.26379 20.9678L6.95813 20.8174C5.46804 20.0196 4.57043 18.5408 4.57043 16.7832L4.58313 16.4023C4.61024 15.9973 4.68218 15.6068 4.78235 15.2324C2.37392 15.1037 0.605134 12.8654 1.07629 10.4668L2.02063 5.66014C2.29702 4.25386 3.53056 3.23827 4.96497 3.23827L12.5704 3.23827C13.2641 3.23827 13.9012 3.47581 14.4093 3.87108C14.9446 3.37424 15.659 3.06775 16.4464 3.06737L19.5704 3.06737C21.1759 3.06737 22.486 4.32857 22.5665 5.91307L22.5704 6.06737L22.5704 13.2881C22.5704 14.9449 21.2273 16.2881 19.5704 16.2881L16.4464 16.2881C15.4274 16.2876 14.5276 15.7779 13.9855 15C12.6627 15.6781 12.2098 16.3075 11.8448 17.0098L11.8322 17.0351L11.8185 17.0596L10.1915 19.9873L10.0861 20.1592ZM19.5704 14.2881C20.1227 14.2881 20.5704 13.8404 20.5704 13.2881L20.5704 6.06737C20.5702 5.5153 20.1226 5.06737 19.5704 5.06737L16.4474 5.06737C15.8955 5.06763 15.4476 5.51546 15.4474 6.06737L15.4474 13.2881C15.4474 13.8402 15.8953 14.2878 16.4474 14.2881L19.5704 14.2881ZM8.08411 19.1435C8.21789 19.2037 8.37224 19.1438 8.44348 19.0156L10.0704 16.0879C10.6804 14.9142 11.5211 13.9165 13.5704 12.9775L13.5704 6.23827C13.5703 5.6861 13.1226 5.23827 12.5704 5.23827L4.96497 5.23827C4.48707 5.23827 4.07574 5.577 3.98352 6.04588L3.03919 10.8525C2.79649 12.0881 3.74201 13.238 5.0011 13.2383L8.11438 13.2383C7.32491 14.1625 6.5707 15.4375 6.57043 16.7832C6.57043 17.8703 7.12947 18.714 8.08411 19.1435Z" fill="#9ca3af"/>
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13.4844 4.07927C14.0159 3.29971 15.051 2.83802 16.085 3.18376L16.3066 3.27067L16.6123 3.42106C18.1024 4.2188 19 5.6976 19 7.45524L18.9873 7.8361C18.9602 8.2411 18.8883 8.63162 18.7881 9.00602C21.1965 9.13477 22.9653 11.373 22.4941 13.7717L21.5498 18.5783C21.2734 19.9846 20.0399 21.0002 18.6055 21.0002H11C10.3064 21.0002 9.66927 20.7626 9.16113 20.3674C8.62588 20.8642 7.91139 21.1707 7.12402 21.1711H4C2.3945 21.1711 1.08439 19.9099 1.00391 18.3254L1 18.1711V10.9504C1 9.29351 2.34315 7.95036 4 7.95036H7.12402C8.143 7.95085 9.04286 8.46054 9.58496 9.23845C10.9077 8.56037 11.3606 7.93095 11.7256 7.22868L11.7383 7.20329L11.752 7.17888L13.3789 4.25114L13.4844 4.07927ZM4 9.95036C3.44772 9.95036 3 10.3981 3 10.9504V18.1711C3.00025 18.7231 3.44787 19.1711 4 19.1711H7.12305C7.67495 19.1708 8.1228 18.723 8.12305 18.1711V10.9504C8.12305 10.3982 7.67511 9.95062 7.12305 9.95036H4ZM15.4863 5.09489C15.3525 5.03472 15.1982 5.09459 15.127 5.22282L13.5 8.15056C12.89 9.32426 12.0494 10.3219 10 11.2609V18.0002C10.0001 18.5523 10.4478 19.0002 11 19.0002H18.6055C19.0834 19.0002 19.4947 18.6614 19.5869 18.1925L20.5312 13.3859C20.7739 12.1504 19.8284 11.0004 18.5693 11.0002H15.4561C16.2455 10.0759 16.9997 8.80098 17 7.45524C17 6.36818 16.441 5.5244 15.4863 5.09489Z" fill="#9ca3af"/>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M11.7998 8C12.3433 8 12.8117 7.99893 13.1953 8.03028C13.5906 8.06259 13.984 8.13442 14.3623 8.32715C14.926 8.61445 15.385 9.0729 15.6729 9.6377C15.8655 10.0158 15.9375 10.4089 15.9697 10.8037C16.0011 11.187 16 11.6548 16 12.1973V17.8027C16 18.345 16.001 18.8122 15.9697 19.1953C15.9374 19.5902 15.8655 19.9832 15.6729 20.3613C15.3855 20.9253 14.9269 21.3851 14.3623 21.6729C13.9843 21.8655 13.5911 21.9374 13.1963 21.9697C12.8132 22.0011 12.3461 22 11.8037 22H6.19727C5.65481 22 5.187 22.0011 4.80372 21.9697C4.40889 21.9375 4.01581 21.8655 3.6377 21.6729C3.07291 21.385 2.61446 20.926 2.32715 20.3623C2.13441 19.984 2.06259 19.5906 2.03028 19.1953C2.0146 19.0035 2.00763 18.7904 2.00391 18.5576L2 17.7998V12.2002C2 11.6566 1.99893 11.1884 2.03028 10.8047C2.06258 10.4094 2.13437 10.016 2.32715 9.6377C2.61475 9.07334 3.07334 8.61475 3.6377 8.32715C4.01605 8.13437 4.40942 8.06258 4.80469 8.03028C5.18845 7.99893 5.65664 8 6.2002 8H11.7998ZM6.2002 10C5.62366 10 5.25123 10.0013 4.96778 10.0244C4.69598 10.0466 4.59528 10.0842 4.5459 10.1094C4.3578 10.2052 4.20524 10.3578 4.10938 10.5459C4.08422 10.5953 4.04662 10.696 4.02442 10.9678C4.00127 11.2512 4 11.6237 4 12.2002V17.7998L4.00293 18.5264C4.00602 18.7268 4.01285 18.8906 4.02442 19.0322C4.04661 19.3037 4.08417 19.4046 4.10938 19.4541C4.20555 19.6427 4.35841 19.7961 4.5459 19.8916C4.5952 19.9167 4.69595 19.9544 4.9668 19.9766C5.24974 19.9997 5.62183 20 6.19727 20H11.8037C12.3791 20 12.7505 19.9997 13.0332 19.9766C13.3042 19.9544 13.4048 19.9167 13.4541 19.8916C13.642 19.7959 13.7956 19.6416 13.8916 19.4531C13.9167 19.4037 13.9545 19.303 13.9766 19.0332C13.9997 18.7504 14 18.3782 14 17.8027V12.1973C14 11.6218 13.9997 11.2497 13.9766 10.9668C13.9544 10.696 13.9167 10.5952 13.8916 10.5459C13.7961 10.3584 13.6427 10.2055 13.4541 10.1094C13.4046 10.0842 13.3037 10.0466 13.0322 10.0244C12.749 10.0013 12.3764 10 11.7998 10H6.2002ZM17.7998 2C18.3434 2 18.8117 1.99893 19.1953 2.03028C19.5906 2.06259 19.984 2.13442 20.3623 2.32715C20.926 2.61446 21.385 3.0729 21.6729 3.6377C21.8656 4.01606 21.9374 4.40937 21.9697 4.80469C22.0011 5.18836 22 5.65665 22 6.2002V11.7998C22 12.3434 22.0011 12.8116 21.9697 13.1953C21.9374 13.5904 21.8655 13.9832 21.6729 14.3613C21.3851 14.926 20.9256 15.3853 20.3613 15.6729C19.9832 15.8655 19.5902 15.9374 19.1953 15.9697C19.1325 15.9749 19.0675 15.9791 19.0003 15.9826C18.4485 16.0112 18 15.5509 18 14.9984C18 14.4464 18.4484 14.0195 18.9989 13.9792C19.0105 13.9784 19.0219 13.9775 19.0332 13.9766C19.303 13.9545 19.4037 13.9167 19.4531 13.8916C19.6415 13.7956 19.7958 13.642 19.8916 13.4541C19.9168 13.4047 19.9544 13.3037 19.9766 13.0322C19.9997 12.7489 20 12.3764 20 11.7998V6.2002C20 5.62377 19.9997 5.25109 19.9766 4.96778C19.9544 4.69656 19.9168 4.59543 19.8916 4.5459C19.7961 4.35842 19.6427 4.20555 19.4541 4.10938C19.4046 4.08417 19.3037 4.04661 19.0322 4.02442C18.749 4.00127 18.3764 4 17.7998 4H12.2002C11.6237 4 11.2512 4.00127 10.9678 4.02442C10.696 4.04662 10.5953 4.08422 10.5459 4.10938C10.3578 4.20524 10.2052 4.3578 10.1094 4.5459C10.0842 4.59528 10.0466 4.69598 10.0244 4.96778C10.0235 4.97888 10.0226 4.99012 10.0218 5.00151C9.98131 5.55186 9.55363 6 9.0018 6C8.44932 6 7.98885 5.55149 8.01744 4.99976C8.02092 4.9325 8.02515 4.86747 8.03028 4.80469C8.06258 4.40942 8.13437 4.01605 8.32715 3.6377C8.61475 3.07334 9.07334 2.61475 9.6377 2.32715C10.016 2.13437 10.4094 2.06258 10.8047 2.03028C11.1884 1.99893 11.6566 2 12.2002 2H17.7998Z" fill="#9ca3af"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 17.7996V8.19996C2 7.6564 1.99893 7.18821 2.03028 6.80445C2.06258 6.40918 2.13437 6.01581 2.32715 5.63746C2.61475 5.0731 3.07334 4.61451 3.6377 4.32691C4.01605 4.13413 4.40941 4.06234 4.80469 4.03004C5.18845 3.99869 5.65664 3.99977 6.2002 3.99977H9C9.55229 3.99977 10 4.44748 10 4.99977C10 5.55205 9.55229 5.99977 9 5.99977H6.2002C5.62366 5.99977 5.25124 6.00103 4.96778 6.02418C4.69598 6.04638 4.59528 6.08398 4.5459 6.10914C4.35779 6.205 4.20524 6.35755 4.10938 6.54566C4.08422 6.59505 4.04662 6.69574 4.02442 6.96754C4.00127 7.251 4 7.62342 4 8.19996V17.7996C4 18.3761 4.00127 18.7487 4.02442 19.032C4.04661 19.3035 4.08417 19.4044 4.10938 19.4539C4.20555 19.6424 4.35841 19.7958 4.5459 19.8914C4.59521 19.9164 4.69595 19.9542 4.9668 19.9763C5.24974 19.9994 5.62182 19.9998 6.19727 19.9998H15.8027C16.3779 19.9998 16.7496 19.9994 17.0322 19.9763C17.3025 19.9542 17.4037 19.9165 17.4531 19.8914C17.6415 19.7954 17.7958 19.6408 17.8916 19.4529C17.9167 19.4034 17.9545 19.3028 17.9766 19.033C17.9997 18.7502 18 18.378 18 17.8025V14.9998C18 14.4475 18.4477 13.9998 19 13.9998C19.5523 13.9998 20 14.4475 20 14.9998V17.8025C20 18.3447 20.001 18.812 19.9697 19.1951C19.9374 19.5899 19.8655 19.983 19.6729 20.3611C19.3851 20.9258 18.9256 21.3851 18.3613 21.6726C17.9833 21.8653 17.5902 21.9372 17.1953 21.9695C16.8123 22.0008 16.345 21.9998 15.8027 21.9998H6.19727C5.6548 21.9998 5.187 22.0008 4.80372 21.9695C4.40889 21.9372 4.01581 21.8653 3.6377 21.6726C3.0729 21.3848 2.61446 20.9257 2.32715 20.3621C2.13441 19.9838 2.06259 19.5903 2.03028 19.1951C1.99893 18.8115 2 18.3431 2 17.7996ZM17.3691 2.22437C17.7619 1.90402 18.3409 1.92662 18.707 2.29273L21.707 5.29273C22.0976 5.68326 22.0976 6.31627 21.707 6.7068L12.707 15.7068C12.5195 15.8943 12.2652 15.9998 12 15.9998H9C8.44772 15.9998 8 15.5521 8 14.9998V11.9998C8 11.7345 8.10544 11.4803 8.29297 11.2927L17.293 2.29273L17.3691 2.22437ZM10 12.4138V13.9998H11.5859L16.5859 8.99977L15 7.41383L10 12.4138ZM16.4141 5.99977L18 7.5857L19.5859 5.99977L18 4.41383L16.4141 5.99977Z" fill="#9ca3af"/>
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
              <IconBtn title="Dislike"><ThumbDownIcon /></IconBtn>
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
  Neutral:  { color: 'var(--text-secondary)', bg: 'var(--bg-active)', label: 'Neutral' },
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
