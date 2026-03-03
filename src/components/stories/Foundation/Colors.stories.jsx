/**
 * Foundation/Colors
 *
 * Hear.ai brand color palette — the complete token set used across
 * Sidebar, ChatInput, App, and SignIn components.
 *
 * This story is a pure documentation artifact (no component import).
 */

const PALETTE = [
  {
    group: 'Brand',
    tokens: [
      { name: 'Brand Coral',    hex: '#FF7056', usage: 'HearLogo fill, active bar, CTA accent'   },
      { name: 'Brand Pink',     hex: '#FF4785', usage: 'Storybook icon, secondary accent'         },
    ],
  },
  {
    group: 'Text',
    tokens: [
      { name: 'Text Primary',   hex: '#111827', usage: 'Headings, active nav items, dark mode bg' },
      { name: 'Text Secondary', hex: '#374151', usage: 'Body copy, form labels'                   },
      { name: 'Text Muted',     hex: '#6b7280', usage: 'Inactive nav items, placeholder text'     },
      { name: 'Text Faint',     hex: '#9ca3af', usage: 'History section labels, timestamps'       },
    ],
  },
  {
    group: 'Backgrounds',
    tokens: [
      { name: 'Canvas',         hex: '#EFEFED', usage: 'Main app canvas, story preview background'},
      { name: 'Sidebar',        hex: '#f5f5f3', usage: 'Sidebar panel, Storybook Manager appBg'  },
      { name: 'Active Nav',     hex: '#e8e8e6', usage: 'Active navigation item fill'              },
      { name: 'White',          hex: '#ffffff', usage: 'Input backgrounds, dropdowns'             },
    ],
  },
  {
    group: 'Borders',
    tokens: [
      { name: 'Border Default', hex: '#e5e7eb', usage: 'Dividers, sidebar borders, card edges'   },
      { name: 'Border Input',   hex: '#c4c4c4', usage: 'Form input borders'                      },
    ],
  },
  {
    group: 'Interactive',
    tokens: [
      { name: 'Blue Action',    hex: '#007AFF', usage: 'Submit button (ChatInput), primary CTA'  },
      { name: 'Dev Violet',     hex: '#7c3aed', usage: 'Storybook nav link gradient start'       },
      { name: 'Dev Indigo',     hex: '#4f46e5', usage: 'Storybook nav link gradient end'         },
    ],
  },
]

function Swatch({ name, hex, usage }) {
  const isLight = ['#EFEFED', '#f5f5f3', '#e8e8e6', '#ffffff', '#e5e7eb', '#c4c4c4'].includes(hex)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        background: hex,
        border: isLight ? '1px solid #e5e7eb' : 'none',
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{hex}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{usage}</div>
      </div>
    </div>
  )
}

export default {
  title: 'Foundation/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete Hear.ai color token set. All values are hardcoded inline styles — ' +
          'no separate design token file exists yet. This story serves as the source of truth.',
      },
    },
  },
}

export const FullPalette = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      {PALETTE.map(({ group, tokens }) => (
        <div key={group} style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: 12,
          }}>
            {group}
          </div>
          {tokens.map(t => <Swatch key={t.hex} {...t} />)}
        </div>
      ))}
    </div>
  ),
  parameters: {
    backgrounds: { default: 'white' },
  },
}
