/**
 * Static mirror of all design tokens from src/index.css.
 * Defined as plain JS arrays so the Foundations tab needs no DOM access.
 */

export const COLOR_FAMILIES = [
  {
    family: 'Coral — Primary',
    swatches: [
      { name: '--c100', label: 'C100', hex: '#FF7056' },
      { name: '--c80',  label: 'C80',  hex: '#FF8D78' },
      { name: '--c60',  label: 'C60',  hex: '#FFA99A' },
      { name: '--c50',  label: 'C50',  hex: '#FFB8AB' },
      { name: '--c40',  label: 'C40',  hex: '#FFC6BB' },
      { name: '--c30',  label: 'C30',  hex: '#FFD4CC' },
      { name: '--c20',  label: 'C20',  hex: '#FFE2DD' },
      { name: '--c10',  label: 'C10',  hex: '#FFF1EE' },
    ],
  },
  {
    family: 'Charcoal — Primary',
    swatches: [
      { name: '--d100', label: 'D100', hex: '#181818' },
      { name: '--d80',  label: 'D80',  hex: '#363636' },
      { name: '--d60',  label: 'D60',  hex: '#545454' },
      { name: '--d50',  label: 'D50',  hex: '#636363' },
      { name: '--d40',  label: 'D40',  hex: '#727272' },
      { name: '--d30',  label: 'D30',  hex: '#909090' },
      { name: '--d20',  label: 'D20',  hex: '#C4C4C4' },
      { name: '--d10',  label: 'D10',  hex: '#E8E8E8' },
    ],
  },
  {
    family: 'Blue Cobalt — Complementary',
    swatches: [
      { name: '--b100', label: 'B100', hex: '#1779F7' },
      { name: '--b80',  label: 'B80',  hex: '#4594F9' },
      { name: '--b60',  label: 'B60',  hex: '#74AFFB' },
      { name: '--b40',  label: 'B40',  hex: '#A2CAFC' },
      { name: '--b20',  label: 'B20',  hex: '#D1E4FD' },
    ],
  },
  {
    family: 'Growth Green — Complementary',
    swatches: [
      { name: '--g100', label: 'G100', hex: '#4BA373' },
      { name: '--g80',  label: 'G80',  hex: '#6FB58F' },
      { name: '--g60',  label: 'G60',  hex: '#93C7AB' },
      { name: '--g40',  label: 'G40',  hex: '#B7DAC7' },
      { name: '--g20',  label: 'G20',  hex: '#DBEDE3' },
    ],
  },
  {
    family: 'Lilac Purple — Complementary',
    swatches: [
      { name: '--l100', label: 'L100', hex: '#D799E2' },
      { name: '--l80',  label: 'L80',  hex: '#DFA9E8' },
      { name: '--l60',  label: 'L60',  hex: '#E7BAEE' },
      { name: '--l40',  label: 'L40',  hex: '#EFCAF3' },
      { name: '--l20',  label: 'L20',  hex: '#F7EBF9' },
    ],
  },
  {
    family: 'Deep Teal — Accent',
    swatches: [
      { name: '--t100', label: 'T100', hex: '#455F61' },
      { name: '--t80',  label: 'T80',  hex: '#678082' },
      { name: '--t60',  label: 'T60',  hex: '#89A0A2' },
      { name: '--t40',  label: 'T40',  hex: '#ABBFC1' },
      { name: '--t20',  label: 'T20',  hex: '#DADFDF' },
    ],
  },
  {
    family: 'Sage Green — Accent',
    swatches: [
      { name: '--s100', label: 'S100', hex: '#B09495' },
      { name: '--s80',  label: 'S80',  hex: '#BFA9AA' },
      { name: '--s60',  label: 'S60',  hex: '#CFBDBE' },
      { name: '--s40',  label: 'S40',  hex: '#DFD2D2' },
      { name: '--s20',  label: 'S20',  hex: '#EFEAEA' },
    ],
  },
  {
    family: 'Horizon Blue — Accent',
    swatches: [
      { name: '--h100', label: 'H100', hex: '#6E95A0' },
      { name: '--h80',  label: 'H80',  hex: '#8BABB5' },
      { name: '--h60',  label: 'H60',  hex: '#A8C0CA' },
      { name: '--h40',  label: 'H40',  hex: '#C5D5DA' },
      { name: '--h20',  label: 'H20',  hex: '#E2EAEC' },
    ],
  },
  {
    family: 'Neutrals',
    swatches: [
      { name: '--n100', label: 'N100', hex: '#606060' },
      { name: '--n80',  label: 'N80',  hex: '#808080' },
      { name: '--n60',  label: 'N60',  hex: '#9B9B9B' },
      { name: '--n40',  label: 'N40',  hex: '#BABABA' },
      { name: '--n20',  label: 'N20',  hex: '#D6D6D6' },
    ],
  },
  {
    family: 'Paper',
    swatches: [
      { name: '--p100', label: 'P100', hex: '#F4F3F1' },
      { name: '--p50',  label: 'P50',  hex: '#F9F8F7' },
      { name: '--p20',  label: 'P20',  hex: '#FFFFFF' },
    ],
  },
  {
    family: 'Semantic',
    swatches: [
      { name: '--bg-canvas',          label: 'bg-canvas',         hex: '#EFEFED' },
      { name: '--bg-sidebar',         label: 'bg-sidebar',        hex: '#F5F5F3' },
      { name: '--bg-active',          label: 'bg-active',         hex: '#E8E8E6' },
      { name: '--bg-card',            label: 'bg-card',           hex: '#FFFFFF' },
      { name: '--bg-elevated',        label: 'bg-elevated',       hex: '#FFFFFF' },
      { name: '--text-primary',       label: 'text-primary',      hex: '#181818' },
      { name: '--text-secondary',     label: 'text-secondary',    hex: '#606060' },
      { name: '--text-muted',         label: 'text-muted',        hex: '#9B9B9B' },
      { name: '--text-inverse',       label: 'text-inverse',      hex: '#F4F3F1' },
      { name: '--border-default',     label: 'border-default',    hex: '#E5E7EB' },
      { name: '--border-input',       label: 'border-input',      hex: '#C4C4C4' },
      { name: '--color-brand',        label: 'color-brand',       hex: '#FF7056' },
      { name: '--color-interactive',  label: 'color-interactive', hex: '#1779F7' },
    ],
  },
]

export const TYPE_SCALE = [
  // ── Titles ──────────────────────────────────────────────────
  { token: '--type-h1', label: 'H1', size: '140px', lh: '160px', weight: 400, use: 'Display hero' },
  { token: '--type-h2', label: 'H2', size: '100px', lh: '140px', weight: 400, use: 'Display section' },
  { token: '--type-h3', label: 'H3', size: '80px',  lh: '100px', weight: 400, use: 'Display' },
  { token: '--type-h4', label: 'H4', size: '64px',  lh: '88px',  weight: 400, use: 'Display' },
  { token: '--type-h5', label: 'H5', size: '56px',  lh: '72px',  weight: 400, use: 'Display' },
  { token: '--type-h6', label: 'H6', size: '48px',  lh: '68px',  weight: 400, use: 'Display' },
  { token: '--type-h7', label: 'H7', size: '40px',  lh: '56px',  weight: 400, use: 'Display' },
  { token: '--type-h8', label: 'H8', size: '32px',  lh: '48px',  weight: 400, use: 'Display' },
  // ── Body ────────────────────────────────────────────────────
  { token: '--type-p1',  label: 'P1',  size: '40px', lh: '54px', weight: 400, use: 'Body large' },
  { token: '--type-p2',  label: 'P2',  size: '40px', lh: '54px', weight: 500, use: 'Body large medium' },
  { token: '--type-p3',  label: 'P3',  size: '40px', lh: '54px', weight: 600, use: 'Body large semibold' },
  { token: '--type-p4',  label: 'P4',  size: '32px', lh: '44px', weight: 400, use: 'Body' },
  { token: '--type-p5',  label: 'P5',  size: '32px', lh: '44px', weight: 500, use: 'Body medium' },
  { token: '--type-p6',  label: 'P6',  size: '32px', lh: '44px', weight: 600, use: 'Body semibold' },
  { token: '--type-p7',  label: 'P7',  size: '24px', lh: '32px', weight: 400, use: 'Body small' },
  { token: '--type-p8',  label: 'P8',  size: '24px', lh: '32px', weight: 500, use: 'Body small medium' },
  { token: '--type-p9',  label: 'P9',  size: '24px', lh: '32px', weight: 400, use: 'Body small — ALL CAPS', caps: true },
  { token: '--type-p10', label: 'P10', size: '18px', lh: '24px', weight: 500, use: 'Body default' },
  { token: '--type-p11', label: 'P11', size: '16px', lh: '24px', weight: 400, use: 'Body default small' },
  { token: '--type-p12', label: 'P12', size: '16px', lh: '24px', weight: 500, use: 'Body default medium' },
  { token: '--type-p13', label: 'P13', size: '16px', lh: '24px', weight: 400, use: 'Body small — ALL CAPS', caps: true },
  { token: '--type-p14', label: 'P14', size: '12px', lh: '16px', weight: 500, use: 'Caption' },
]

export const KEYFRAMES = [
  { name: 'msgIn',        description: 'Chat message entrance — fade + slide up 8px' },
  { name: 'dot-bounce',   description: 'Thinking indicator — vertical bounce loop' },
  { name: 'slideInRight', description: 'Related topic row — slide from right' },
  { name: 'btn-spin',     description: 'Button loading spinner — continuous 360° rotation' },
]
