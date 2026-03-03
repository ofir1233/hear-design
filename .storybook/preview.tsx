import type { Preview, Decorator } from '@storybook/react-vite'
import '../src/index.css'

/**
 * Global decorator — wraps every story with the Byrd font family
 * and a background that matches the Hear.ai canvas color.
 *
 * Storybook renders stories inside <div id="storybook-root">, which does
 * not inherit body-level font-family from index.css. This decorator ensures
 * the Byrd font is active in every story without per-story boilerplate.
 */
const DARK_BG = '#181818'

const withByrdFont: Decorator = (Story, context) => {
  const bg = context.globals?.backgrounds?.value
  const isDark = bg === DARK_BG || bg === '#111827'
  return (
    <div
      data-theme={isDark ? 'dark' : 'light'}
      style={{
        fontFamily: "'Byrd', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: isDark ? DARK_BG : 'transparent',
        color: isDark ? '#F4F3F1' : 'inherit',
      }}
    >
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    // ── Background presets — Hear.ai palette ──────────────────────────────
    backgrounds: {
      default: 'hear-light',
      values: [
        { name: 'hear-light',   value: '#EFEFED' },
        { name: 'hear-sidebar', value: '#F5F5F3' },
        { name: 'hear-dark',    value: '#181818' },
        { name: 'white',        value: '#FFFFFF' },
      ],
    },

    // ── Viewport presets ─────────────────────────────────────────────────
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile (375)',   styles: { width: '375px',  height: '812px'  }, type: 'mobile'  },
        tablet:  { name: 'Tablet (768)',   styles: { width: '768px',  height: '1024px' }, type: 'tablet'  },
        desktop: { name: 'Desktop (1280)', styles: { width: '1280px', height: '900px'  }, type: 'desktop' },
        wide:    { name: 'Wide (1440)',    styles: { width: '1440px', height: '900px'  }, type: 'desktop' },
      },
      defaultViewport: 'desktop',
    },

    // ── Controls ─────────────────────────────────────────────────────────
    controls: {
      matchers: {
        color: /(background|color|fill|stroke|border)$/i,
        date:  /date$/i,
      },
      sort: 'alpha',
    },

    // ── A11y ─────────────────────────────────────────────────────────────
    a11y: {
      test: 'todo',   // Flag violations in test UI without failing CI
    },

    // ── Default layout ────────────────────────────────────────────────────
    layout: 'centered',

    // ── Sidebar ordering — enforces Atomic Design taxonomy ────────────────
    options: {
      storySort: {
        order: ['Foundations', 'Atoms', 'Molecules', 'Organisms', 'Templates', '*'],
      },
    },
  },

  decorators: [withByrdFont],
}

export default preview
