/**
 * Foundation/Hear Logo
 *
 * The primary Hear brand mark. Inline SVG — inherits color context,
 * scales cleanly at any dimension. The coral fill (#FF7056) is encoded
 * directly in the path; the `className` prop controls sizing via CSS.
 *
 * Taxonomy: Foundation → raw brand assets, design tokens, primitives
 */
import HearLogo from '../../HearLogo.jsx'

export default {
  title: 'Foundation/Hear Logo',
  component: HearLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Primary brand mark. Rendered as inline SVG (viewBox 0 0 69 60). ' +
          'The coral fill (`#FF7056`) is hardcoded — use `className` to size ' +
          'via Tailwind height utilities (`h-6`, `h-12`, etc.).',
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
 * Coral fill is self-contained in the SVG path — brand fidelity holds
 * on dark backgrounds without any CSS overrides.
 */
export const OnDark = {
  args: { className: 'h-12 w-auto' },
  parameters: {
    backgrounds: { default: 'hear-dark' },
    docs: {
      description: {
        story: 'The `#FF7056` fill is hardcoded — no CSS override needed for dark surfaces.',
      },
    },
  },
}

/** All canonical size variants side-by-side for design review. */
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
    docs: {
      description: {
        story: 'All canonical size variants for design review.',
      },
    },
  },
}
