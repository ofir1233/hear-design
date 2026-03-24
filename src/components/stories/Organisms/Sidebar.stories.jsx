/**
 * Organisms/Sidebar
 *
 * Tier: Organisms — a complex, distinct section of the interface.
 *
 * Main application navigation panel. Fixed 272px left rail on desktop,
 * drawer overlay on mobile. Contains: project selector, 11 nav items,
 * Storybook dev link, history section, and user profile.
 *
 * ⚠️ ARCHITECTURAL DRIFT — see flag below.
 *
 * Intended atom composition:
 *   Atoms/Nav Item   (the base navigation button — 11 instances in this organism)
 *   Atoms/Hear Logo  (the brand mark in the sidebar header)
 *
 * Actual state:
 *   Sidebar.jsx renders its own <button> markup with duplicated inline styles
 *   instead of importing Atoms/Nav Item. Hear Logo IS imported correctly.
 */
import Sidebar from '../../../lab/components/Sidebar.jsx'

export default {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organisms** — Lab floating navigation sidebar. ' +
          'Floats `16px` from edges, `borderRadius: 16`, subtle outline. 13 nav items. ' +
          '\n\n**Scope toggle (Project | Org)** sits above the project selector. ' +
          'Switching to Org crossfades the project dropdown out and shows an "All Projects" display with a blue Org badge. ' +
          'Seed the initial state via `defaultOrgScope` prop (`"project"` | `"org"`).' +
          '\n\n**Atoms composed:** `Atoms/Hear Logo` (injected correctly). ' +
          '\n\n> ⚠️ **ARCHITECTURAL DRIFT** — `Sidebar.jsx` renders its own `<button>` markup ' +
          'with duplicated inline styles instead of importing `Atoms/Nav Item`. ' +
          'Style changes to `Atoms/Nav Item` will NOT propagate to this organism silently.',
      },
    },
  },
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: 'Activates mobile drawer mode (full-width overlay)',
    },
    mobileOpen: {
      control: 'boolean',
      description: 'Controls mobile drawer visibility (only relevant when `isMobile` is true)',
    },
    defaultOrgScope: {
      control: { type: 'radio' },
      options: ['project', 'org'],
      description: 'Seeds the initial scope toggle state. "project" = normal project selector; "org" = All Projects display.',
    },
    onMobileClose: {
      action: 'onMobileClose',
      description: 'Callback fired when the mobile backdrop or close button is clicked',
    },
  },
}

/** Desktop full sidebar — default rendering context, project scope active. */
export const Desktop = {
  args: { isMobile: false, mobileOpen: false, defaultOrgScope: 'project' },
}

/** Org scope active — project selector is replaced by "All Projects" display with blue Org badge. */
export const ScopeOrg = {
  args: { isMobile: false, mobileOpen: false, defaultOrgScope: 'org' },
  parameters: {
    docs: {
      description: {
        story:
          'Org scope active. The `Project | Org` toggle is set to Org: ' +
          'the project selector crossfades out (200ms opacity) and an "All Projects" ' +
          'row with a grid icon and blue `ORG` badge fades in via absolute positioning. ' +
          'Available to Super Admins and Internal Users only (feature flag: `show_all_org_calls`).',
      },
    },
  },
}

/**
 * Tablet — sidebar still fixed at 272px but content column is tighter.
 * Verify no horizontal overflow at ~768px viewport.
 */
export const Tablet = {
  args: { isMobile: false, mobileOpen: false },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: 'Fixed 272px sidebar on a 768px viewport leaves ~496px for content.',
      },
    },
  },
}

/** Mobile — drawer open, full-width overlay with backdrop. */
export const MobileOpen = {
  args: { isMobile: true, mobileOpen: true },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'Mobile drawer in open state. Backdrop click fires `onMobileClose`.',
      },
    },
  },
}

/** Mobile — drawer closed, sidebar hidden off-screen via transform. */
export const MobileClosed = {
  args: { isMobile: true, mobileOpen: false },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'Mobile drawer closed — sidebar is translated off-screen.',
      },
    },
  },
}
