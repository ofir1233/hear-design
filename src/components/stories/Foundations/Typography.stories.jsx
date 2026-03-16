/**
 * Foundations/Typography
 *
 * Complete Hear type scale — Byrd font family.
 * Titles H1–H8 and body paragraphs P1–P14.
 *
 * Tier: Foundations — pure design tokens, no interactive UI.
 * All sizes/weights/line-heights match the design spec.
 * Tokens are defined in src/index.css as --type-h1, --type-p1, etc.
 */

const TITLES = [
  { label: 'H1', size: 140, lh: 160, weight: 400, case: 'As typed'  },
  { label: 'H2', size: 100, lh: 140, weight: 400, case: 'As typed'  },
  { label: 'H3', size:  80, lh: 100, weight: 400, case: 'As typed'  },
  { label: 'H4', size:  64, lh:  88, weight: 400, case: 'As typed'  },
  { label: 'H5', size:  56, lh:  72, weight: 400, case: 'As typed'  },
  { label: 'H6', size:  48, lh:  68, weight: 400, case: 'As typed'  },
  { label: 'H7', size:  40, lh:  56, weight: 400, case: 'As typed'  },
  { label: 'H8', size:  32, lh:  48, weight: 400, case: 'As typed'  },
]

const BODY = [
  { label: 'P1',  size: 40, lh: 54, weight: 400, case: 'As typed'  },
  { label: 'P2',  size: 40, lh: 54, weight: 500, case: 'As typed'  },
  { label: 'P3',  size: 40, lh: 54, weight: 600, case: 'As typed'  },
  { label: 'P4',  size: 32, lh: 48, weight: 400, case: 'As typed'  },
  { label: 'P5',  size: 32, lh: 48, weight: 500, case: 'As typed'  },
  { label: 'P6',  size: 32, lh: 48, weight: 600, case: 'As typed'  },
  { label: 'P7',  size: 24, lh: 40, weight: 400, case: 'As typed'  },
  { label: 'P8',  size: 24, lh: 40, weight: 500, case: 'As typed'  },
  { label: 'P9',  size: 24, lh: 32, weight: 400, case: 'uppercase' },
  { label: 'P10', size: 18, lh: 24, weight: 500, case: 'As typed'  },
  { label: 'P11', size: 16, lh: 24, weight: 400, case: 'As typed'  },
  { label: 'P12', size: 16, lh: 24, weight: 500, case: 'As typed'  },
  { label: 'P13', size: 16, lh: 24, weight: 400, case: 'uppercase' },
  { label: 'P14', size: 12, lh: 16, weight: 500, case: 'As typed'  },
]

const weightLabel = (w) => ({ 400: 'Regular', 500: 'Medium', 600: 'Semi Bold' }[w])

const col = { fontSize: 11, color: '#9ca3af', fontWeight: 500, fontFamily: 'monospace', minWidth: 80 }

function TypeRow({ label, size, lh, weight, case: textCase }) {
  const text = textCase === 'uppercase' ? 'CREATE FASTER' : 'Create Faster'
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '48px 1fr 100px 100px 80px 80px',
      alignItems: 'center',
      gap: 16,
      padding: '20px 0',
      borderBottom: '1px solid #f0f0ee',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{label}</div>
      <div style={{
        fontFamily: "'Byrd', sans-serif",
        fontSize: size,
        lineHeight: `${lh}px`,
        fontWeight: weight,
        textTransform: textCase === 'uppercase' ? 'uppercase' : 'none',
        color: '#181818',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
      <div style={col}>{textCase === 'uppercase' ? 'All Caps' : 'As typed'}</div>
      <div style={col}>{weightLabel(weight)}</div>
      <div style={col}>{size}PX</div>
      <div style={col}>{lh}px</div>
    </div>
  )
}

function TableHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '48px 1fr 100px 100px 80px 80px',
      gap: 16,
      padding: '0 0 12px',
      borderBottom: '2px solid #e5e7eb',
      marginBottom: 4,
    }}>
      {['Style', '', 'Case', 'Weight', 'Font Size', 'Line Height'].map((h, i) => (
        <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#c4c4c4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
      ))}
    </div>
  )
}

export default {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component:
          '**Tier: Foundations** — Raw type scale tokens. Consumed by every tier above. ' +
          'Hear type scale using the **Byrd** font family. ' +
          'Titles H1–H8 are used for display and hero copy. ' +
          'Body P1–P14 cover every text use case from large callouts to legal-size captions. ' +
          'Scale tokens: `--type-h1` through `--type-p14` in `src/index.css`.',
      },
    },
  },
}

export const Titles = {
  render: () => (
    <div style={{ maxWidth: 900, fontFamily: "'Byrd', sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>Titles</div>
      <TableHeader />
      {TITLES.map(t => <TypeRow key={t.label} {...t} />)}
    </div>
  ),
}

export const Body = {
  render: () => (
    <div style={{ maxWidth: 900, fontFamily: "'Byrd', sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>Body / Paragraph</div>
      <TableHeader />
      {BODY.map(t => <TypeRow key={t.label} {...t} />)}
    </div>
  ),
}

export const AllStyles = {
  name: 'All Styles',
  render: () => (
    <div style={{ maxWidth: 900, fontFamily: "'Byrd', sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>Titles</div>
      <TableHeader />
      {TITLES.map(t => <TypeRow key={t.label} {...t} />)}

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', margin: '40px 0 20px' }}>Body / Paragraph</div>
      <TableHeader />
      {BODY.map(t => <TypeRow key={t.label} {...t} />)}
    </div>
  ),
}
