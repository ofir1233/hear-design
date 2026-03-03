/**
 * Elements/Nav Item
 *
 * Atomic navigation button — the base pattern used for all 11 items
 * in Sidebar.jsx. Isolated here for granular state testing and Controls
 * without loading the full sidebar.
 *
 * States: default (inactive), active, hover, disabled
 */

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}

function NavItem({ label = 'Dashboard', active = false, disabled = false }) {
  return (
    <button
      disabled={disabled}
      style={{
        width: 224,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        background: active ? '#e8e8e6' : 'transparent',
        color: disabled ? '#c4c4c4' : active ? '#111827' : '#6b7280',
        fontSize: 13.5,
        fontWeight: 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'Byrd', sans-serif",
        transition: 'background 150ms ease, color 150ms ease',
      }}
    >
      <DashboardIcon />
      {label}
    </button>
  )
}

export default {
  title: 'Elements/Nav Item',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Base navigation button pattern from `Sidebar.jsx`. ' +
          'Uses inline styles — no CSS class dependencies. ' +
          'Active state: `#e8e8e6` bg + `#111827` text. ' +
          'Inactive state: transparent bg + `#6b7280` text.',
      },
    },
  },
  argTypes: {
    label:    { control: 'text',    description: 'Button label text' },
    active:   { control: 'boolean', description: 'Active/selected state' },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
}

/** Default inactive state — transparent background, muted text. */
export const Inactive = {
  args: { label: 'Dashboard', active: false, disabled: false },
}

/** Active state — `#e8e8e6` fill, dark text, matches sidebar selection. */
export const Active = {
  args: { label: 'Dashboard', active: true, disabled: false },
}

/** Disabled state — reduced opacity, pointer-events off. */
export const Disabled = {
  args: { label: 'Dashboard', active: false, disabled: true },
}

/** All navigable states rendered simultaneously for design review. */
export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, background: '#f5f5f3', borderRadius: 12 }}>
      <NavItem label="Inactive"  active={false} disabled={false} />
      <NavItem label="Active"    active={true}  disabled={false} />
      <NavItem label="Disabled"  active={false} disabled={true}  />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'All navigable states on the sidebar background color for realistic preview.',
      },
    },
  },
}
