/**
 * Modules/Sidebar
 *
 * Main application navigation panel. Uses `position: fixed; height: 100vh`
 * — requires `layout: 'fullscreen'` to render correctly in Storybook.
 *
 * States: desktop (expanded), desktop (collapsed), mobile open, mobile closed
 */
import Sidebar from '../../Sidebar.jsx'

export default {
  title: 'Modules/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    // REQUIRED: Sidebar uses position:fixed + 100vh. centered layout hides it.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main navigation sidebar (`272px` fixed width on desktop). ' +
          'Supports collapse toggle and mobile drawer mode via `isMobile` + `mobileOpen` props. ' +
          'Contains: project selector, 11 nav items, Storybook dev link, history section, user profile.',
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
  args: {
    isMobile: false,
    mobileOpen: false,
  },
}

/** Mobile — drawer open, full-width overlay with backdrop. */
export const MobileOpen = {
  args: {
    isMobile: true,
    mobileOpen: true,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'Mobile drawer in open state. Backdrop click fires `onMobileClose`.',
      },
    },
  },
}

/** Mobile — drawer closed, sidebar hidden off-screen. */
export const MobileClosed = {
  args: {
    isMobile: true,
    mobileOpen: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'Mobile drawer closed — sidebar is translated off-screen via transform.',
      },
    },
  },
}
