/**
 * Atoms/Badge
 *
 * Tier: Atom — formalizes the three badge patterns already used in the product.
 *
 * Variants:
 *   outline — gray border chip (@ mention handle in ChatInput)
 *   subtle  — semi-transparent white pill (SignInHero "Design Lab" badge)
 *   solid   — more opaque white tag (Sidebar "DEV" badge)
 *
 * Shapes: pill (borderRadius 999) · rect (borderRadius 4)
 */

// ─── Design tokens (values taken directly from source files) ──────────────────

const VARIANTS = {
  outline: {
    bg:             'transparent',
    border:         '1px solid #e5e7eb',
    color:          '#9ca3af',
    fontSize:       12,
    fontWeight:     500,
    paddingH:       8,
    paddingV:       2,
    defaultUppercase: false,
  },
  subtle: {
    bg:             'rgba(255,255,255,0.08)',
    border:         '1px solid rgba(255,255,255,0.15)',
    color:          'rgba(255,255,255,0.6)',
    fontSize:       11,
    fontWeight:     600,
    paddingH:       10,
    paddingV:       3,
    defaultUppercase: true,
  },
  solid: {
    bg:             'rgba(255,255,255,0.20)',
    border:         '1px solid rgba(255,255,255,0.35)',
    color:          '#ffffff',
    fontSize:       9,
    fontWeight:     700,
    paddingH:       5,
    paddingV:       2,
    defaultUppercase: true,
  },
}

const SHAPES = {
  pill: 999,
  rect: 4,
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export default function Badge({
  variant   = 'outline',
  shape     = 'pill',
  uppercase,
  children,
  style: styleProp,
}) {
  const V = VARIANTS[variant] ?? VARIANTS.outline
  const radius = SHAPES[shape] ?? SHAPES.pill
  const isUppercase = uppercase !== undefined ? uppercase : V.defaultUppercase

  return (
    <span
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        `${V.paddingV}px ${V.paddingH}px`,
        background:     V.bg,
        border:         V.border,
        borderRadius:   radius,
        color:          V.color,
        fontSize:       V.fontSize,
        fontFamily:     "'Byrd', sans-serif",
        fontWeight:     V.fontWeight,
        lineHeight:     1.4,
        letterSpacing:  isUppercase ? '0.08em' : undefined,
        textTransform:  isUppercase ? 'uppercase' : undefined,
        whiteSpace:     'nowrap',
        flexShrink:     0,
        boxSizing:      'border-box',
        ...styleProp,
      }}
    >
      {children}
    </span>
  )
}
