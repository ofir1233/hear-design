/**
 * Atoms/Button
 *
 * Tier: Atom — the primary interactive control of the Hear design system.
 *
 * Import:
 *   import Button from '../Button'
 *   (path relative to src/components/ — adjust for your location)
 *
 * Variants: primary · secondary · ghost · danger
 * Sizes:    sm (32px) · md (40px) · lg (48px)
 */

import Button from '../../Button'
import { MicIcon, AttachIcon, SettingsIcon } from '../../icons'

// ─── Shared decorator — adds breathing room around centered stories ────────────

const pad = (Story) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', padding: 32 }}>
    <Story />
  </div>
)

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title:     'Atoms/Button',
  component: Button,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-light' },
    docs: {
      description: {
        component:
          '**Tier: Atom** — First-class reusable button for the Hear design system. ' +
          '\n\n**Variants:** `primary` (blue fill) · `secondary` (blue outline) · `ghost` (transparent) · `danger` (red fill)' +
          '\n\n**Sizes:** `sm` 32px · `md` 40px (default) · `lg` 48px' +
          '\n\n**States:** default · hover · active · `disabled` · `loading`' +
          '\n\n**Icons:** Pass any icon component to `leftIcon` or `rightIcon`. Omit `children` with only `leftIcon` for a square icon-only button.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style of the button',
      table: { defaultValue: { summary: "'primary'" } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height and padding scale',
      table: { defaultValue: { summary: "'md'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and reduces opacity to 40%',
    },
    loading: {
      control: 'boolean',
      description: 'Replaces content with a spinner; blocks interaction',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches the button to fill its container',
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
    onClick: { action: 'clicked' },
  },
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default state — tweak all props live via the Controls panel. */
export const Default = {
  args: {
    variant:  'primary',
    size:     'md',
    children: 'Save changes',
    disabled: false,
    loading:  false,
    fullWidth: false,
  },
}

/** All four variants side-by-side. */
export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`primary` for the main CTA · `secondary` for supporting actions · `ghost` for low-emphasis actions · `danger` for destructive operations.',
      },
    },
  },
}

/** Three sizes in a row. */
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`sm` 32px — compact toolbars & table rows · `md` 40px — default forms & dialogs · `lg` 48px — prominent page CTAs.',
      },
    },
  },
}

/** Loading state — spinner replaces content, button stays the same size. */
export const Loading = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary"   loading>Primary</Button>
      <Button variant="secondary" loading>Secondary</Button>
      <Button variant="ghost"     loading>Ghost</Button>
      <Button variant="danger"    loading>Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The spinner inherits the button\'s text color. Button dimensions are frozen — no layout shift.',
      },
    },
  },
}

/** Disabled state across all variants. */
export const Disabled = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary"   disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost"     disabled>Ghost</Button>
      <Button variant="danger"    disabled>Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`opacity: 0.4`, `cursor: not-allowed`. Hover and active states are suppressed.',
      },
    },
  },
}

/** Icon support — left icon, right icon, and icon-only (square). */
export const WithIcons = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary"   leftIcon={<MicIcon />}>Record</Button>
      <Button variant="secondary" rightIcon={<AttachIcon />}>Attach</Button>
      <Button variant="ghost"     leftIcon={<SettingsIcon />}>Settings</Button>
      <Button variant="primary"   leftIcon={<MicIcon />} size="sm" />
      <Button variant="secondary" leftIcon={<AttachIcon />} size="md" />
      <Button variant="ghost"     leftIcon={<SettingsIcon />} size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pass any icon to `leftIcon` or `rightIcon`. Omit `children` with only `leftIcon` to get a square icon-only button that matches the size\'s height.',
      },
    },
  },
}

/** Full-width button — stretches to fill its container. */
export const FullWidth = {
  render: () => (
    <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Button variant="primary"   fullWidth>Continue</Button>
      <Button variant="secondary" fullWidth>Cancel</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`fullWidth={true}` — useful inside forms, dialogs, and mobile drawers.',
      },
    },
  },
}

/** All variants on the dark canvas — confirm contrast and spinner colours. */
export const OnDark = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: 'On the dark canvas. `ghost` text colour (`#374151`) is intentionally dark — if the button appears on a dark surface in the product, pass a custom `style` or use `secondary` instead.',
      },
    },
  },
}

/** All sizes × all variants — full reference grid. */
export const ReferenceGrid = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {['primary', 'secondary', 'ghost', 'danger'].map(variant => (
        <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 80, fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{variant}</span>
          <Button variant={variant} size="sm">Small</Button>
          <Button variant={variant} size="md">Medium</Button>
          <Button variant={variant} size="lg">Large</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full 4 × 3 reference grid — every variant at every size.',
      },
    },
  },
}
