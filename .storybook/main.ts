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
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-onboarding',
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
