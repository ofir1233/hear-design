/**
 * Atoms/Nav Item
 *
 * Tier: Atoms — the smallest interactive navigation unit.
 *
 * The atomic nav button used in the Sidebar. Isolated here for
 * granular state testing and Controls without loading the full organism.
 *
 * ⚠️ ARCHITECTURAL DRIFT — see Organisms/Sidebar docs.
 * This atom documents the canonical NavItem pattern.
 * However, Sidebar.jsx currently renders its own inline nav button markup
 * instead of importing this component. Style changes made here will NOT
 * automatically propagate to Sidebar. This is flagged for resolution.
 *
 * Consumed by (intended):
 *   Organisms/Sidebar  (currently uses duplicated inline implementation)
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
  title: 'Atoms/Nav Item',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Tier: Atoms** — Smallest interactive navigation unit. ' +
          'Base pattern for all navigation buttons in the sidebar. ' +
          'Uses inline styles — no CSS class dependencies. ' +
          'Active state: `#e8e8e6` bg + `#111827` text. ' +
          'Inactive state: transparent bg + `#6b7280` text. ' +
          '\n\n**Consumed by (intended):** `Organisms/Sidebar`' +
          '\n\n> ⚠️ **ARCHITECTURAL DRIFT** — `Organisms/Sidebar` currently renders its own inline ' +
          'nav button markup instead of importing this atom. ' +
          'Style changes here will NOT propagate to the sidebar until this is resolved. ' +
          '**Resolution:** Replace Sidebar\'s internal button markup with this `NavItem` atom.',
      },
    },
  },
  argTypes: {
    label:    { control: 'text',    description: 'Button label text' },
    active:   { control: 'boolean', description: 'Active/selected state — `#e8e8e6` fill + dark text' },
    disabled: { control: 'boolean', description: 'Disabled state — reduced opacity, pointer-events off' },
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

/**
 * Long label — tests text overflow at the fixed 224px item width.
 * Currently wraps. Add `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`
 * if single-line truncation is the desired production behaviour.
 */
export const WithLongLabel = {
  args: {
    label: 'Enterprise Account Intelligence Overview',
    active: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Overflow test at 224px fixed width. Item currently wraps. ' +
          'Flag for design review if >28-char labels are expected in production.',
      },
    },
  },
}

/** Long label in active state. */
export const WithLongLabelActive = {
  args: {
    label: 'Enterprise Account Intelligence Overview',
    active: true,
    disabled: false,
  },
}

/** All navigable states on the sidebar background — most realistic preview. */
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
    docs: { description: { story: 'All navigable states on the sidebar background (`#f5f5f3`) for realistic preview.' } },
  },
}
