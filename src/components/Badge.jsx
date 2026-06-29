/**
 * Atoms/Badge
 *
 * Tier: Atom — formalizes the four badge patterns in the product.
 *
 * Variants:
 *   outline — gray border chip (@ mention handle in ChatInput)
 *   subtle  — semi-transparent white pill (SignInHero "Design Lab" badge)
 *   solid   — more opaque white tag (Sidebar "DEV" badge)
 *   tinted  — color-tinted status chip (DataPage status / priority labels)
 *             requires `color` prop: 'cobalt'|'green'|'coral'|'lilac'|'teal'|'horizon'|'sage'
 *
 * Shapes: pill (borderRadius 999) · rect (borderRadius 4)
 */

// ─── Design tokens (values taken directly from source files) ──────────────────

const VARIANTS = {
  outline: {
    bg:               'transparent',
    border:           '1px solid #e5e7eb',
    color:            '#9ca3af',
    fontSize:         12,
    fontWeight:       500,
    paddingH:         8,
    paddingV:         2,
    lineHeight:       1.4,
    defaultUppercase: false,
  },
  subtle: {
    bg:               'rgba(255,255,255,0.08)',
    border:           '1px solid rgba(255,255,255,0.15)',
    color:            'rgba(255,255,255,0.6)',
    fontSize:         11,
    fontWeight:       600,
    paddingH:         10,
    paddingV:         3,
    lineHeight:       1.4,
    defaultUppercase: true,
  },
  solid: {
    bg:               'rgba(255,255,255,0.20)',
    border:           '1px solid rgba(255,255,255,0.35)',
    color:            '#ffffff',
    fontSize:         9,
    fontWeight:       700,
    paddingH:         5,
    paddingV:         2,
    lineHeight:       1.4,
    defaultUppercase: true,
  },
}

// Maps color name → design-system token prefix (--X100 / --X20 / --X30)
const COLOR_PREFIXES = {
  cobalt:  'b',
  green:   'g',
  coral:   'c',
  lilac:   'l',
  teal:    't',
  horizon: 'h',
  sage:    's',
}

// Maps color name → badge-specific tokens (theme-adaptive via CSS vars)
const BADGE_NAMES = ['cobalt', 'green', 'coral', 'lilac', 'teal', 'horizon', 'sage']

const SHAPES = {
  pill: 999,
  rect: 4,
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export default function Badge({
  variant   = 'outline',
  color,
  shape     = 'pill',
  uppercase,
  children,
  style: styleProp,
}) {
  let V = VARIANTS[variant] ?? VARIANTS.outline

  if (variant === 'tinted') {
    // Foundation "Pill badge — filled" spec (DS components_badges.html):
    // h22 · 12% tone fill · 1px solid currentColor · 12/500/lh1 · not uppercase
    const name = BADGE_NAMES.includes(color) ? color : 'cobalt'
    V = {
      bg:               `var(--badge-${name}-fill)`,
      border:           '1px solid currentColor',
      color:            `var(--badge-${name}-text)`,
      fontSize:         12,
      fontWeight:       500,
      paddingH:         8,
      paddingV:         0,
      height:           22,
      lineHeight:       1,
      defaultUppercase: false,
    }
  }

  const radius = SHAPES[shape] ?? SHAPES.pill
  const isUppercase = uppercase !== undefined ? uppercase : V.defaultUppercase

  return (
    <span
      data-inspector="Badge"
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            6,
        height:         V.height,
        padding:        `${V.paddingV}px ${V.paddingH}px`,
        background:     V.bg,
        border:         V.border,
        borderRadius:   radius,
        color:          V.color,
        fontSize:       V.fontSize,
        fontFamily:     "'Byrd', sans-serif",
        fontWeight:     V.fontWeight,
        lineHeight:     V.lineHeight ?? 1.4,
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
