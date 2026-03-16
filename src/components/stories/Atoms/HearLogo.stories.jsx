/**
 * Atoms/Hear Logo
 *
 * Tier: Atoms — the smallest indivisible brand unit.
 *
 * The primary Hear brand mark. Inline SVG — inherits no external
 * component dependencies. The coral fill (#FF7056) is encoded
 * directly in the SVG path; sizing is controlled via the `className` prop.
 *
 * Consumed by:
 *   Molecules/Sign In/Hero  (injected as the hero badge logotype)
 *   Organisms/Sidebar       (injected in the sidebar header)
 */
import HearLogo from '../../HearLogo.jsx'

export default {
  title: 'Atoms/Hear Logo',
  component: HearLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Tier: Atoms** — Indivisible brand mark. No sub-component dependencies. ' +
          'Rendered as inline SVG (viewBox 0 0 69 60). ' +
          'The coral fill (`#FF7056`) is hardcoded in the path — no CSS override is needed on dark surfaces. ' +
          'Use `className` with Tailwind height utilities (`h-6`, `h-12`, etc.) to control size. ' +
          '\n\n**Consumed by:** `Molecules/Sign In/Hero`, `Organisms/Sidebar`',
      },
    },
  },
  argTypes: {
    className: {
      description: 'CSS class applied to the root `<svg>`. Use Tailwind for sizing.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
  },
}

/** Natural dimensions — no class applied. Baseline reference size. */
export const Default = {
  args: { className: '' },
}

/** 24px — compact form for tight header bars and collapsed sidebar. */
export const Small = {
  args: { className: 'h-6 w-auto' },
}

/** 48px — standard placement in headers and sign-in screens. */
export const Medium = {
  args: { className: 'h-12 w-auto' },
}

/** 96px — hero and marketing contexts, loading screens. */
export const Large = {
  args: { className: 'h-24 w-auto' },
}

/**
 * Logo on the sidebar background (`#F5F5F3`).
 * `h-8` (32px) matches the current Sidebar header placement.
 */
export const OnSidebar = {
  args: { className: 'h-8 w-auto' },
  parameters: {
    backgrounds: { default: 'hear-sidebar' },
    docs: {
      description: {
        story:
          'Placement context: top-left of `Organisms/Sidebar`. ' +
          '`h-8` (32px) matches the current sidebar header sizing.',
      },
    },
  },
}

/**
 * Logo on dark canvas — coral fill is self-contained.
 * No CSS override required.
 */
export const OnDark = {
  args: { className: 'h-12 w-auto' },
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: 'The `#FF7056` fill is hardcoded in SVG — no CSS override needed for dark surfaces.',
      },
    },
  },
}

/** All canonical size variants side-by-side on a light background. */
export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, padding: 16 }}>
      {[
        { label: 'xs (16px)',  cls: 'h-4 w-auto'  },
        { label: 'sm (24px)',  cls: 'h-6 w-auto'  },
        { label: 'md (48px)',  cls: 'h-12 w-auto' },
        { label: 'lg (96px)',  cls: 'h-24 w-auto' },
        { label: 'xl (128px)', cls: 'h-32 w-auto' },
      ].map(({ label, cls }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <HearLogo className={cls} />
          <span style={{ fontSize: 10, color: '#6b7280' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'All canonical size variants for design review.' } },
  },
}

/** All size variants on the dark canvas — confirms no inversion needed at any scale. */
export const AllSizesOnDark = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, padding: 16 }}>
      {[
        { label: 'xs (16px)',  cls: 'h-4 w-auto'  },
        { label: 'sm (24px)',  cls: 'h-6 w-auto'  },
        { label: 'md (48px)',  cls: 'h-12 w-auto' },
        { label: 'lg (96px)',  cls: 'h-24 w-auto' },
        { label: 'xl (128px)', cls: 'h-32 w-auto' },
      ].map(({ label, cls }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <HearLogo className={cls} />
          <span style={{ fontSize: 10, color: '#6b7280' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-dark' },
    docs: { description: { story: 'All size variants on `#181818` — hardcoded fill holds at every scale.' } },
  },
}
