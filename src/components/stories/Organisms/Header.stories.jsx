/**
 * Organisms/Header
 *
 * Tier: Organism — Floating page header (Lab).
 * Fixed top:16 left:16 right:16, height 52px, borderRadius 16.
 * Three named slots: left, center (optional), right (optional).
 */
import Header from '../../../lab/components/Header.jsx'

export default {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organisms** — Lab floating page header. ' +
          'Fixed `top:16 left:16 right:16 height:52` with `borderRadius:16`. ' +
          'Three named slots: `left` (flex:1), `center` (optional, shrink:0), `right` (optional, flex:1 justify-end). ' +
          '\n\nPage content needs `paddingTop ≥ 68px` to clear the header. ' +
          'Background, border, and shadow use `--bg-sidebar`, `--page-header-border`, `--page-header-shadow` tokens.',
      },
    },
  },
  argTypes: {
    left:   { control: false, description: 'Left slot — page title, breadcrumb, back button' },
    center: { control: false, description: 'Center slot — optional tab bar or label' },
    right:  { control: false, description: 'Right slot — actions, filters, user controls' },
  },
}

/** Left slot only — page title. */
export const LeftOnly = {
  render: () => (
    <Header left={<span style={{ fontSize: 14, fontWeight: 600 }}>Page Title</span>} />
  ),
}

/** Left + Right — title with action button. */
export const LeftAndRight = {
  render: () => (
    <Header
      left={<span style={{ fontSize: 14, fontWeight: 600 }}>Reports</span>}
      right={
        <span style={{
          fontSize: 12, padding: '4px 12px', borderRadius: 7,
          border: '1px solid var(--border-input)', cursor: 'pointer',
        }}>
          + New Report
        </span>
      }
    />
  ),
}

/** All three slots — title, center label, action. */
export const AllSlots = {
  render: () => (
    <Header
      left={<span style={{ fontSize: 14, fontWeight: 600 }}>Data</span>}
      center={<span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Acme Corp · Q1 2024</span>}
      right={
        <span style={{
          fontSize: 12, padding: '4px 12px', borderRadius: 7,
          border: '1px solid var(--border-input)', cursor: 'pointer',
        }}>
          Filters
        </span>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three slots filled. Center shrinks to content; left and right each take remaining flex space.',
      },
    },
  },
}
