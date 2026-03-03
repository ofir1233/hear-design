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
import Sidebar from '../../Sidebar.jsx'

export default {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organisms** — Main navigation panel. ' +
          'Fixed `272px` sidebar on desktop; full-width drawer overlay on mobile. ' +
          'Contains: project selector, 11 nav items, Storybook dev link, history section, user profile. ' +
          '\n\n**Atoms composed:** `Atoms/Hear Logo` (injected correctly). ' +
          '\n\n> ⚠️ **ARCHITECTURAL DRIFT** — `Sidebar.jsx` renders its own `<button>` markup ' +
          'with duplicated inline styles instead of importing `Atoms/Nav Item`. ' +
          'Style changes to `Atoms/Nav Item` will NOT propagate to this organism silently. ' +
          '**Resolution required:** Replace the internal button markup in `Sidebar.jsx` ' +
          'with the exported `NavItem` component from `src/components/NavItem.jsx` (to be created).',
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
    onMobileClose: {
      action: 'onMobileClose',
      description: 'Callback fired when the mobile backdrop or close button is clicked',
    },
  },
}

/** Desktop full sidebar — default rendering context. */
export const Desktop = {
  args: { isMobile: false, mobileOpen: false },
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
