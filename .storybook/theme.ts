import { create } from 'storybook/theming/create'

/**
 * Custom Storybook Manager UI theme — Hear.ai brand palette.
 * Applied in manager.ts via addons.setConfig({ theme: hearTheme }).
 */
const hearTheme = create({
  base: 'light',

  // ── Brand identity ───────────────────────────────────────────────────────
  brandTitle: 'Hear Design System',
  brandUrl:   'https://hear.ai',
  brandTarget: '_self',

  // ── Color palette ────────────────────────────────────────────────────────
  colorPrimary:   '#FF7056',   // Pulse Coral C100 — brand primary
  colorSecondary: '#181818',   // Charcoal D100 — primary text / dark bg

  // ── UI chrome ────────────────────────────────────────────────────────────
  appBg:          '#f5f5f3',   // Sidebar background — mirrors Sidebar.jsx
  appContentBg:   '#EFEFED',   // Story canvas background
  appPreviewBg:   '#EFEFED',   // Preview iframe background
  appBorderColor: '#e5e7eb',   // Divider color — mirrors Sidebar dividers
  appBorderRadius: 8,

  // ── Typography ───────────────────────────────────────────────────────────
  fontBase: "'Byrd', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontCode: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",

  // ── Text ─────────────────────────────────────────────────────────────────
  textColor:        '#111827',
  textInverseColor: '#f9fafb',
  textMutedColor:   '#6b7280',   // Nav inactive text color

  // ── Toolbar ──────────────────────────────────────────────────────────────
  barTextColor:     '#6b7280',
  barHoverColor:    '#111827',
  barSelectedColor: '#FF7056',   // Active story — brand coral
  barBg:            '#f5f5f3',

  // ── Form elements ────────────────────────────────────────────────────────
  inputBg:          '#ffffff',
  inputBorder:      '#c4c4c4',
  inputTextColor:   '#374151',
  inputBorderRadius: 8,
})

export default hearTheme
