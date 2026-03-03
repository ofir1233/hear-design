/**
 * Foundations/Colors
 *
 * The raw design token palette — Primary, Complementary, Accent, Neutrals.
 * These are the variables of the system. Nothing interactive lives here.
 *
 * Tier: Foundations — pure design tokens, no interactive UI.
 */

const PALETTE = [
  {
    group: 'Primary',
    colors: [
      {
        name: 'Pulse Coral', token: 'C', base: '#FF7056',
        description: 'The signature Hear colour — warm, human connection & innovative.',
        usage: 'Primary CTAs, key highlights, focus / active states, links, accent elements.',
        shades: [
          { label: 'C100', hex: '#FF7056' },
          { label: 'C80',  hex: '#FF8D78' },
          { label: 'C60',  hex: '#FFA99A' },
          { label: 'C50',  hex: '#FFB8AB' },
          { label: 'C40',  hex: '#FFC6BB' },
          { label: 'C30',  hex: '#FFD4CC' },
          { label: 'C20',  hex: '#FFE2DD' },
          { label: 'C10',  hex: '#FFF1EE' },
        ],
      },
      {
        name: 'Charcoal', token: 'D', base: '#181818',
        description: 'Deep neutral that grounds the system. Modern, confident, and legible across light or color backgrounds.',
        usage: 'Primary text, icons, navigation, and structural backgrounds.',
        shades: [
          { label: 'D100', hex: '#181818' },
          { label: 'D80',  hex: '#464646' },
          { label: 'D60',  hex: '#747474' },
          { label: 'D50',  hex: '#8C8C8C' },
          { label: 'D40',  hex: '#A3A3A3' },
          { label: 'D30',  hex: '#BABABA' },
          { label: 'D20',  hex: '#D1D1D1' },
          { label: 'D10',  hex: '#E8E8E8' },
        ],
      },
    ],
  },
  {
    group: 'Complementary',
    colors: [
      {
        name: 'Blue Cobalt', token: 'B', base: '#1779F7',
        description: 'Strong, trustworthy blue for interactive elements and data.',
        usage: 'Links, data visualisation, focus states. Component backgrounds.',
        shades: [
          { label: 'B100', hex: '#1779F7' },
          { label: 'B80',  hex: '#4594F9' },
          { label: 'B60',  hex: '#74AFFA' },
          { label: 'B50',  hex: '#8BBCFB' },
          { label: 'B40',  hex: '#A2C9FC' },
          { label: 'B30',  hex: '#B9D7FD' },
          { label: 'B20',  hex: '#D1E4FD' },
        ],
      },
      {
        name: 'Growth Green', token: 'G', base: '#4BA373',
        description: 'Calm, natural green for positive feedback.',
        usage: 'Success messages, positive metrics, "growth" or "improvement" states.',
        shades: [
          { label: 'G100', hex: '#4BA373' },
          { label: 'G80',  hex: '#6FB58F' },
          { label: 'G60',  hex: '#93C8AB' },
          { label: 'G50',  hex: '#A5D1B9' },
          { label: 'G40',  hex: '#B7DAC7' },
          { label: 'G30',  hex: '#C9E3D5' },
          { label: 'G20',  hex: '#DBEDE3' },
        ],
      },
      {
        name: 'Lilac Purple', token: 'L', base: '#D799E2',
        description: 'Soft, approachable purple for highlights and decoration.',
        usage: 'Highlights, onboarding moments, decorative accents, illustrations.',
        shades: [
          { label: 'L100', hex: '#D799E2' },
          { label: 'L80',  hex: '#DFADE8' },
          { label: 'L60',  hex: '#E7C2EE' },
          { label: 'L50',  hex: '#EBCCF1' },
          { label: 'L40',  hex: '#EFD6F3' },
          { label: 'L30',  hex: '#F3E0F6' },
          { label: 'L20',  hex: '#F7EBF9' },
        ],
      },
    ],
  },
  {
    group: 'Accent',
    colors: [
      {
        name: 'Deep Teal', token: 'T', base: '#455F61',
        description: 'Grounded, sophisticated teal for depth.',
        usage: 'Backgrounds, navigation hovers, or dark-mode accents and illustrations.',
        shades: [
          { label: 'T100', hex: '#455F61' },
          { label: 'T80',  hex: '#6A7F81' },
          { label: 'T60',  hex: '#8F9FA0' },
          { label: 'T50',  hex: '#A2AFB0' },
          { label: 'T40',  hex: '#B5BFC0' },
          { label: 'T30',  hex: '#C7CFD0' },
          { label: 'T20',  hex: '#DADFDF' },
        ],
      },
      {
        name: 'Sage Green', token: 'S', base: '#B09495',
        description: 'Muted, earthy tone for backgrounds and illustrations.',
        usage: 'Background fills, cards, icon backgrounds and illustrations.',
        shades: [
          { label: 'S100', hex: '#B09495' },
          { label: 'S80',  hex: '#C0A9AA' },
          { label: 'S60',  hex: '#D0BFBF' },
          { label: 'S50',  hex: '#D8CACA' },
          { label: 'S40',  hex: '#DFD4D5' },
          { label: 'S30',  hex: '#E7DFDF' },
          { label: 'S20',  hex: '#EFEAEA' },
        ],
      },
      {
        name: 'Horizon Blue', token: 'H', base: '#6E95A0',
        description: 'Airy, open blue-grey for secondary UI surfaces.',
        usage: 'Background fills, secondary UI elements, icons and illustrations.',
        shades: [
          { label: 'H100', hex: '#6E95A0' },
          { label: 'H80',  hex: '#8BAAB3' },
          { label: 'H60',  hex: '#A8BFC6' },
          { label: 'H50',  hex: '#B7CAD0' },
          { label: 'H40',  hex: '#C5D5D9' },
          { label: 'H30',  hex: '#D4DFE3' },
          { label: 'H20',  hex: '#E2EAEC' },
        ],
      },
    ],
  },
  {
    group: 'Neutrals',
    colors: [
      {
        name: 'Light Text', token: 'N', base: '#606060',
        description: 'Achromatic scale for text and UI chrome.',
        usage: 'Secondary text, icons, dividers, and disabled states.',
        shades: [
          { label: 'N100', hex: '#606060' },
          { label: 'N80',  hex: '#7D7D7D' },
          { label: 'N60',  hex: '#9B9B9B' },
          { label: 'N40',  hex: '#B9B9B9' },
          { label: 'N20',  hex: '#D6D6D6' },
        ],
      },
      {
        name: 'Near White', token: 'P', base: '#F4F3F1',
        description: 'Warm off-whites for backgrounds and canvas.',
        usage: 'App canvas, card surfaces, and page backgrounds.',
        shades: [
          { label: 'P100', hex: '#F4F3F1' },
          { label: 'P50',  hex: '#F9F9F7' },
          { label: 'P20',  hex: '#FFFFFF' },
        ],
      },
    ],
  },
]

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

function ShadeRamp({ shades }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
      {shades.map(({ label, hex }) => (
        <div key={label} style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            height: 32,
            borderRadius: 6,
            background: hex,
            border: isLightColor(hex) ? '1px solid #e5e7eb' : 'none',
          }} />
          <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginTop: 4, textAlign: 'center' }}>{label}</div>
          <div style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center', fontFamily: 'monospace' }}>{hex}</div>
        </div>
      ))}
    </div>
  )
}

function ColorCard({ name, token, base, description, usage, shades }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          background: base,
          border: isLightColor(base) ? '1px solid #e5e7eb' : 'none',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 8,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: isLightColor(base) ? '#606060' : 'rgba(255,255,255,0.7)',
            fontFamily: 'monospace',
          }}>{token}100</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>
            {token === 'C' ? 'Primary Brand' : token === 'D' ? 'Primary Text' : token === 'N' || token === 'P' ? 'Neutral' : 'Complementary'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#181818', lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af', marginBottom: 6 }}>{base}</div>
          <div style={{ fontSize: 12, color: '#606060', lineHeight: 1.5, marginBottom: 4 }}>{description}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: '#a3a3a3' }}>Usage: </span>{usage}
          </div>
        </div>
      </div>
      <ShadeRamp shades={shades} />
    </div>
  )
}

export default {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component:
          '**Tier: Foundations** — Raw design token palette. ' +
          'These variables are consumed by every tier above (Atoms → Molecules → Organisms → Templates). ' +
          'Defined as CSS custom properties in `src/index.css` and exposed as Tailwind v4 `@theme` utilities. ' +
          '\n\n**Rule:** Always prefer semantic tokens (`--bg-canvas`, `--text-primary`) in components. ' +
          'Use raw palette tokens (`--c100`, `--b80`) only for one-off overrides or design explorations.',
      },
    },
  },
}

export const FullPalette = {
  render: () => (
    <div style={{ maxWidth: 800, fontFamily: "'Byrd', sans-serif" }}>
      {PALETTE.map(({ group, colors }) => (
        <div key={group} style={{ marginBottom: 40 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: '1px solid #e5e7eb',
          }}>
            {group}
          </div>
          {colors.map(c => <ColorCard key={c.token} {...c} />)}
        </div>
      ))}
    </div>
  ),
}

export const SemanticTokens = {
  render: () => (
    <div style={{ maxWidth: 640, fontFamily: "'Byrd', sans-serif" }}>
      {[
        { label: 'Semantic — Light Mode', tokens: [
          { name: '--bg-canvas',        hex: '#EFEFED', usage: 'Main app canvas background'       },
          { name: '--bg-sidebar',       hex: '#F5F5F3', usage: 'Sidebar panel background'         },
          { name: '--bg-active',        hex: '#E8E8E6', usage: 'Active nav item fill'             },
          { name: '--bg-card',          hex: '#FFFFFF', usage: 'Card and elevated surfaces'       },
          { name: '--text-primary',     hex: '#181818', usage: 'Body copy, headings'              },
          { name: '--text-secondary',   hex: '#606060', usage: 'Secondary / muted text'           },
          { name: '--text-muted',       hex: '#9B9B9B', usage: 'Placeholder, timestamps'          },
          { name: '--border-default',   hex: '#E5E7EB', usage: 'Dividers, card edges'             },
          { name: '--color-brand',      hex: '#FF7056', usage: 'CTAs, active states, logo fill'   },
          { name: '--color-interactive',hex: '#1779F7', usage: 'Links, focus rings, buttons'      },
        ]},
        { label: 'Semantic — Dark Mode', tokens: [
          { name: '--bg-canvas',        hex: '#181818', usage: 'Dark canvas'                      },
          { name: '--bg-sidebar',       hex: '#1C1C1C', usage: 'Dark sidebar'                     },
          { name: '--bg-active',        hex: '#2A2A2A', usage: 'Dark active nav item'             },
          { name: '--bg-card',          hex: '#242424', usage: 'Dark card surface'                },
          { name: '--text-primary',     hex: '#F4F3F1', usage: 'Light text on dark'               },
          { name: '--text-secondary',   hex: '#9B9B9B', usage: 'Muted text on dark'               },
          { name: '--border-default',   hex: '#333333', usage: 'Subtle dividers on dark'          },
          { name: '--color-interactive',hex: '#4594F9', usage: 'Lighter interactive on dark'      },
        ]},
      ].map(({ label, tokens }) => (
        <div key={label} style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>{label}</div>
          {tokens.map(({ name, hex, usage }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: '8px 12px', background: '#f9f9f7', borderRadius: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: hex, border: isLightColor(hex) ? '1px solid #e5e7eb' : 'none', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#181818', fontFamily: 'monospace' }}>{name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{hex} · {usage}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { backgrounds: { default: 'hear-light' } },
}
