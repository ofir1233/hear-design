import { useState } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────

const VARIANTS = {
  primary: {
    bg:       'var(--c100)',
    bgHover:  'var(--c80)',
    bgActive: 'var(--c60)',
    color:    '#FFFFFF',
    border:   'none',
    spinTrack: 'rgba(255,255,255,0.30)',
    spinArc:   '#FFFFFF',
  },
  secondary: {
    bg:       'transparent',
    bgHover:  'var(--b20)',
    bgActive: 'var(--b20)',
    color:    'var(--b100)',
    border:   '1.5px solid var(--b100)',
    spinTrack: 'var(--b30)',
    spinArc:   'var(--b100)',
  },
  ghost: {
    bg:       'transparent',
    bgHover:  'var(--bg-active)',
    bgActive: 'var(--bg-active)',
    color:    'var(--text-secondary)',
    border:   'none',
    spinTrack: 'var(--border-default)',
    spinArc:   'var(--text-secondary)',
  },
  danger: {
    bg:       'var(--c100)',
    bgHover:  'var(--c80)',
    bgActive: 'var(--c60)',
    color:    '#FFFFFF',
    border:   'none',
    spinTrack: 'rgba(255,255,255,0.30)',
    spinArc:   '#FFFFFF',
  },
  outline: {
    bg:       'transparent',
    bgHover:  'rgba(255,112,86,0.08)',
    bgActive: 'rgba(255,112,86,0.14)',
    color:    'var(--c100)',
    border:   '1.5px solid var(--c100)',
    spinTrack: 'rgba(255,112,86,0.30)',
    spinArc:   'var(--c100)',
  },
}

const SIZES = {
  sm: { height: 32, paddingH: 12, fontSize: 12, borderRadius: 6,  gap: 6,  iconSize: 14 },
  md: { height: 40, paddingH: 16, fontSize: 13, borderRadius: 8,  gap: 8,  iconSize: 16 },
  lg: { height: 48, paddingH: 20, fontSize: 14, borderRadius: 10, gap: 8,  iconSize: 18 },
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ track, arc }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display:      'inline-block',
        width:        16,
        height:       16,
        borderRadius: '50%',
        border:       `2px solid ${track}`,
        borderTopColor: arc,
        animation:    'btn-spin 0.7s linear infinite',
        flexShrink:   0,
      }}
    />
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

export default function Button({
  variant   = 'primary',
  size      = 'md',
  disabled  = false,
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type      = 'button',
  children,
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const V = VARIANTS[variant] ?? VARIANTS.primary
  const S = SIZES[size]       ?? SIZES.md

  const frozen   = disabled || loading
  const iconOnly = !children && (leftIcon != null)

  const bg = frozen
    ? V.bg
    : pressed ? V.bgActive
    : hovered ? V.bgHover
    : V.bg

  return (
    <button
      data-inspector="Button"
      type={type}
      disabled={disabled}
      onClick={!frozen ? onClick : undefined}
      aria-busy={loading || undefined}
      onMouseEnter={() => { if (!frozen) setHovered(true)  }}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={()  => { if (!frozen) setPressed(true)  }}
      onMouseUp={()    => { setPressed(false) }}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            S.gap,
        height:         S.height,
        width:          fullWidth ? '100%' : iconOnly ? S.height : 'auto',
        padding:        iconOnly  ? 0 : `0 ${S.paddingH}px`,
        fontFamily:     "'Byrd', sans-serif",
        fontSize:       S.fontSize,
        fontWeight:     500,
        lineHeight:     1,
        letterSpacing:  '0.01em',
        color:          V.color,
        background:     bg,
        border:         V.border,
        borderRadius:   S.borderRadius,
        cursor:         frozen ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.4 : 1,
        pointerEvents:  loading ? 'none' : undefined,
        transition:     'background 150ms ease, opacity 150ms ease',
        whiteSpace:     'nowrap',
        userSelect:     'none',
        outline:        'none',
        boxSizing:      'border-box',
        flexShrink:     0,
      }}
    >
      {loading ? (
        <Spinner track={V.spinTrack} arc={V.spinArc} />
      ) : (
        <>
          {leftIcon  && <span style={{ display: 'flex', alignItems: 'center', width: S.iconSize, height: S.iconSize, flexShrink: 0 }}>{leftIcon}</span>}
          {children  && <span>{children}</span>}
          {rightIcon && <span style={{ display: 'flex', alignItems: 'center', width: S.iconSize, height: S.iconSize, flexShrink: 0 }}>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
