import { addons } from 'storybook/manager-api'
import hearTheme from './theme'

/**
 * Configures the Storybook Manager UI shell (outer chrome).
 * This is separate from preview.tsx — changes here affect the sidebar,
 * toolbar, and addons panel, NOT the story preview iframe.
 */
addons.setConfig({
  theme: hearTheme,
  sidebar: {
    showRoots: true,   // Shows top-level category names (Foundation, Elements, etc.)
  },
  panelPosition: 'bottom',
  enableShortcuts: true,
})
