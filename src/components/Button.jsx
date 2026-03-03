import { useState } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────

const VARIANTS = {
  primary: {
    bg:       '#007AFF',
    bgHover:  '#0066CC',
    bgActive: '#0052A3',
    color:    '#FFFFFF',
    border:   'none',
    spinTrack: 'rgba(255,255,255,0.30)',
    spinArc:   '#FFFFFF',
  },
  secondary: {
    bg:       'transparent',
    bgHover:  'rgba(0,122,255,0.06)',
    bgActive: 'rgba(0,122,255,0.12)',
    color:    '#007AFF',
    border:   '1.5px solid #007AFF',
    spinTrack: 'rgba(0,122,255,0.25)',
    spinArc:   '#007AFF',
  },
  ghost: {
    bg:       'transparent',
    bgHover:  'rgba(0,0,0,0.05)',
    bgActive: 'rgba(0,0,0,0.10)',
    color:    '#374151',
    border:   'none',
    spinTrack: 'rgba(55,65,81,0.25)',
    spinArc:   '#374151',
  },
  danger: {
    bg:       '#EF4444',
    bgHover:  '#DC2626',
    bgActive: '#B91C1C',
    color:    '#FFFFFF',
    border:   'none',
    spinTrack: 'rgba(255,255,255,0.30)',
    spinArc:   '#FFFFFF',
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
