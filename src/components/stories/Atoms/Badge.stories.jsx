/**
 * Atoms/Badge
 *
 * Tier: Atom — formalizes three badge patterns already used in the product.
 *
 * Import:
 *   import Badge from '../Badge'
 *   (path relative to src/components/ — adjust for your location)
 *
 * Variants: outline · subtle · solid
 * Shapes:   pill · rect
 */

import Badge from '../../Badge'

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title:     'Atoms/Badge',
  component: Badge,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-light' },
    docs: {
      description: {
        component:
          '**Tier: Atom** — Formalizes the three badge patterns already in the product.' +
          '\n\n**Variants:** `outline` (@ mention chip) · `subtle` (login hero label) · `solid` (Sidebar DEV tag)' +
          '\n\n**Shapes:** `pill` borderRadius 999 · `rect` borderRadius 4' +
          '\n\n**`uppercase`** defaults to `true` for `subtle` and `solid`, `false` for `outline`. Override with the prop.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'subtle', 'solid'],
      description: 'Visual style of the badge',
      table: { defaultValue: { summary: "'outline'" } },
    },
    shape: {
      control: 'select',
      options: ['pill', 'rect'],
      description: 'Border-radius shape',
      table: { defaultValue: { summary: "'pill'" } },
    },
    uppercase: {
      control: 'boolean',
      description: 'Force uppercase text + letter-spacing. Defaults to variant setting.',
    },
    children: {
      control: 'text',
      description: 'Badge label text',
    },
  },
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default state — tweak all props live via the Controls panel. */
export const Default = {
  args: {
    variant:  'outline',
    shape:    'pill',
    children: 'Tommy@',
  },
}

/** Exact style used for @ mention handle chips in ChatInput. */
export const MentionHandle = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge variant="outline" shape="pill">Tommy@</Badge>
      <Badge variant="outline" shape="pill">Whatever@</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Matches the handle chip in the **@ mention** dropdown (`ChatInput.jsx`). `outline` + `pill`, gray border, no fill.',
      },
    },
  },
}

/** Exact style used below the Hear logo on the sign-in screen. */
export const SignInHeroBadge = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge variant="subtle" shape="pill">Design Lab</Badge>
      <Badge variant="subtle" shape="pill">Beta</Badge>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: 'Matches the label below the logo in **SignInHero** (`SignInHero.jsx`). `subtle` + `pill`, semi-transparent white — use on dark surfaces.',
      },
    },
  },
}

/** Exact style used on the Storybook link in the Sidebar. */
export const SidebarDevBadge = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge variant="solid" shape="rect">DEV</Badge>
      <Badge variant="solid" shape="rect">New</Badge>
      <Badge variant="solid" shape="rect">Beta</Badge>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: 'Matches the **DEV** tag on the Storybook nav link (`Sidebar.jsx`). `solid` + `rect`, more opaque white — use on dark surfaces.',
      },
    },
  },
}

/** All three variants on the light canvas. */
export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="solid">Solid</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three variants on the light canvas. Note: `subtle` and `solid` are designed for dark backgrounds — their white treatment is less visible here.',
      },
    },
  },
}

/** All three variants on the dark canvas — their intended context. */
export const AllVariantsDark = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="solid">Solid</Badge>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: '`subtle` and `solid` on their intended dark canvas. `outline` in gray is intentionally neutral — if it needs to be visible on dark, pass a custom `style` override.',
      },
    },
  },
}

/** Both shapes side-by-side. */
export const Shapes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Badge variant="outline" shape="pill">Pill</Badge>
      <Badge variant="outline" shape="rect">Rect</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`pill` (borderRadius 999) for handle chips and hero labels · `rect` (borderRadius 4) for tags and dev labels.',
      },
    },
  },
}
