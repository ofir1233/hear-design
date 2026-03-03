import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  // Glob pattern automatically indexes every story — living document, no manual registry
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    // ── Core (Storybook 10 bundled) ─────────────────────────────────────────
    '@storybook/addon-docs',          // Auto-generated API documentation
    '@storybook/addon-a11y',          // Accessibility audit (axe-core)
    '@storybook/addon-themes',        // Background / theme switching
    '@storybook/addon-onboarding',    // First-run onboarding tour
    '@chromatic-com/storybook',       // Chromatic visual regression CI
    '@storybook/addon-vitest',        // Vitest integration (must precede interactions)
    // ── Interaction & measurement (must follow addon-vitest) ────────────────
    '@storybook/addon-interactions',  // User event visualization
    '@storybook/addon-measure',       // Box-model / spacing overlay
    '@storybook/addon-outline',       // Grid alignment overlay
    // ── Developer experience ────────────────────────────────────────────────
    '@storybook/addon-storysource',   // Shows raw story source in panel
  ],

  framework: '@storybook/react-vite',

  // Serves public/ at root — critical for /fonts/Byrd-*.woff2 @font-face resolution
  staticDirs: ['../public'],

  docs: {},

  /**
   * Tailwind CSS v4 ONLY valid integration path.
   * Do NOT create postcss.config.js — that is the v3 approach.
   * mergeConfig() deduplicates plugins so @vitejs/plugin-react is not registered twice.
   */
  viteFinal: async (viteConfig) => {
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
    })
  },
}

export default config
