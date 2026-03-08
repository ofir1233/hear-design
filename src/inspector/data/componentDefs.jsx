/**
 * Static registry for the Design Inspector.
 * Keys match the data-inspector="..." attribute values on each component's root element.
 *
 * breakdown: deep DNA of each component —
 *   icons[]         — names of icons from src/components/icons/index.jsx used inside it
 *   colors[]        — { name, hex } pairs of colours referenced in the component source
 *   subComponents[] — atom/molecule names rendered as children
 *   notes[]         — flags, quirks, dev reminders
 */

import Button     from '../../components/Button.jsx'
import Modal      from '../../components/Modal.jsx'
import Badge      from '../../components/Badge.jsx'
import HearLogo   from '../../components/HearLogo.jsx'
import ChatBubble from '../../components/ChatBubble.jsx'
import ChatInput  from '../../components/ChatInput.jsx'
import Sidebar    from '../../components/Sidebar.jsx'
import SignIn     from '../../components/SignIn.jsx'
import SignInHero   from '../../components/sign-in/SignInHero.jsx'
import GoogleButton from '../../components/sign-in/GoogleButton.jsx'
import AuthDivider  from '../../components/sign-in/AuthDivider.jsx'
import EmailForm    from '../../components/sign-in/EmailForm.jsx'
import EventCard    from '../../components/data/EventCard.jsx'
import OmniBar      from '../../components/data/OmniBar.jsx'
import FilterDrawer from '../../components/data/FilterDrawer.jsx'
import DataPage     from '../../components/data/DataPage.jsx'
import ReportsPage  from '../../components/reports/ReportsPage.jsx'
import { SCHEMAS }  from '../../components/data/mockData.js'

// Raw source imports — Vite ?raw gives the file content as a plain string.
// Used in the handoff panel so developers can copy the full implementation.
import ButtonSrc     from '../../components/Button.jsx?raw'
import ModalSrc      from '../../components/Modal.jsx?raw'
import BadgeSrc      from '../../components/Badge.jsx?raw'
import HearLogoSrc   from '../../components/HearLogo.jsx?raw'
import ChatBubbleSrc from '../../components/ChatBubble.jsx?raw'
import ChatInputSrc  from '../../components/ChatInput.jsx?raw'
import SidebarSrc    from '../../components/Sidebar.jsx?raw'
import SignInSrc     from '../../components/SignIn.jsx?raw'
import IconsSrc     from '../../components/icons/index.jsx?raw'
import SignInHeroSrc    from '../../components/sign-in/SignInHero.jsx?raw'
import GoogleButtonSrc  from '../../components/sign-in/GoogleButton.jsx?raw'
import AuthDividerSrc   from '../../components/sign-in/AuthDivider.jsx?raw'
import EmailFormSrc     from '../../components/sign-in/EmailForm.jsx?raw'
import EventCardSrc     from '../../components/data/EventCard.jsx?raw'
import OmniBarSrc       from '../../components/data/OmniBar.jsx?raw'
import FilterDrawerSrc  from '../../components/data/FilterDrawer.jsx?raw'
import DataPageSrc      from '../../components/data/DataPage.jsx?raw'
import MockDataSrc      from '../../components/data/mockData.js?raw'
import ReportsPageSrc   from '../../components/reports/ReportsPage.jsx?raw'

// ─── Shared preview wrapper helpers ──────────────────────────────────────────

const center = (children, bg = 'transparent') => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 16px', background: bg, minHeight: 80 }}>
    {children}
  </div>
)

// For full-page organisms: use CSS `contain: paint` to capture position:fixed
// descendants and clip them to the preview box without escaping the inspector.
const containedPreview = (inner, height = 160) => (
  <div style={{ height, width: '100%', contain: 'paint', overflow: 'hidden', position: 'relative', borderRadius: 0 }}>
    {inner}
  </div>
)

export const COMPONENT_DEFS = {

  // ── Button ─────────────────────────────────────────────────────────────────

  Button: {
    tier: 'Atom',
    description: '5 variants × 3 sizes. Loading spinner, disabled state, icon-only mode.',
    props: [
      { name: 'variant',   type: "'primary'|'secondary'|'ghost'|'danger'|'outline'", default: "'primary'" },
      { name: 'size',      type: "'sm'|'md'|'lg'",                         default: "'md'" },
      { name: 'disabled',  type: 'boolean',                                 default: 'false' },
      { name: 'loading',   type: 'boolean',                                 default: 'false' },
      { name: 'fullWidth', type: 'boolean',                                 default: 'false' },
      { name: 'leftIcon',  type: 'ReactNode',                               default: 'undefined' },
      { name: 'rightIcon', type: 'ReactNode',                               default: 'undefined' },
      { name: 'type',      type: "'button'|'submit'|'reset'",               default: "'button'" },
    ],
    states: [
      { label: 'Primary',   props: { variant: 'primary',   size: 'md', children: 'Continue' } },
      { label: 'Secondary', props: { variant: 'secondary', size: 'md', children: 'Cancel' } },
      { label: 'Ghost',     props: { variant: 'ghost',     size: 'md', children: 'Learn more' } },
      { label: 'Danger',    props: { variant: 'danger',    size: 'md', children: 'Delete' } },
      { label: 'Outline',   props: { variant: 'outline',   size: 'md', children: 'Apply' } },
      { label: 'Loading',   props: { variant: 'primary',   loading: true,  children: 'Saving…' } },
      { label: 'Disabled',  props: { variant: 'primary',   disabled: true, children: 'Unavailable' } },
      { label: 'Small',     props: { variant: 'primary',   size: 'sm', children: 'Small' } },
      { label: 'Large',     props: { variant: 'primary',   size: 'lg', children: 'Large' } },
    ],
    render: (p) => center(<Button {...p} />),
    snippet: (p) => {
      const attrs = [`variant="${p.variant}"`, `size="${p.size}"`]
      if (p.loading)  attrs.push('loading')
      if (p.disabled) attrs.push('disabled')
      return `<Button ${attrs.join(' ')}>\n  ${p.children ?? ''}\n</Button>`
    },
    source: ButtonSrc,
    files: [
      { path: 'src/components/Button.jsx', src: ButtonSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Primary / Danger bg', hex: '#FF7056' },
        { name: 'Outline border/text', hex: '#FF7056' },
        { name: 'Secondary border',    hex: '#1779F7' },
        { name: 'White text',          hex: '#FFFFFF' },
      ],
      subComponents: [],
      notes: [
        'Spinner uses btn-spin keyframe (border-top-color animation)',
        'Hover/active adjust background via onMouseEnter/Leave handlers directly',
      ],
    },
  },

  // ── Modal ──────────────────────────────────────────────────────────────────

  Modal: {
    tier: 'Molecule',
    description: 'Centered overlay dialog. Backdrop click + Escape to close. Enter/scale open animation. Slots: title, children (body), footer (right-aligned actions).',
    props: [
      { name: 'open',    type: 'boolean',   default: 'false' },
      { name: 'onClose', type: 'function',  default: 'required' },
      { name: 'title',   type: 'string',    default: 'required' },
      { name: 'footer',  type: 'ReactNode', default: 'undefined' },
      { name: 'width',   type: 'number',    default: '440' },
    ],
    states: [
      {
        label: 'Default (open)',
        props: { open: true, onClose: () => {}, title: 'Save as preset', footer: <><Button variant="ghost" size="sm">Cancel</Button><Button size="sm">Save preset</Button></> },
      },
      {
        label: 'Narrow',
        props: { open: true, onClose: () => {}, title: 'Confirm action', width: 320, footer: <><Button variant="ghost" size="sm">No</Button><Button variant="danger" size="sm">Delete</Button></> },
      },
      {
        label: 'No footer',
        props: { open: true, onClose: () => {}, title: 'Information', footer: undefined },
      },
    ],
    render: (p) => (
      <div style={{ position: 'relative', height: 220, contain: 'paint', background: 'rgba(0,0,0,0.30)', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: p.width ?? 340, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>{p.title}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, fontFamily: 'system-ui' }}>×</span>
          </div>
          <div style={{ padding: '16px 18px', color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'Byrd', sans-serif" }}>Modal body content</div>
          {p.footer && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 18px', borderTop: '1px solid var(--border-default)' }}>
              {p.footer}
            </div>
          )}
        </div>
      </div>
    ),
    snippet: () =>
`<Modal
  open={isOpen}
  onClose={() => setOpen(false)}
  title="Save as preset"
  footer={
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      <Button size="sm" onClick={handleSave}>Save preset</Button>
    </>
  }
>
  {/* body */}
</Modal>`,
    source: ModalSrc,
    files: [
      { path: 'src/components/Modal.jsx', src: ModalSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: ['Button'],
      notes: [
        'requestAnimationFrame triggers the enter animation one frame after mount',
        'Backdrop mousedown (not click) to avoid false-positive closes during text selection',
        'Escape listener is scoped to when open=true to avoid conflicts',
      ],
    },
  },

  // ── Badge ──────────────────────────────────────────────────────────────────

  Badge: {
    tier: 'Atom',
    description: '3 variants × 2 shapes + 7 tinted colors. Each tinted color shown on light and dark backgrounds.',
    props: [
      { name: 'variant',   type: "'outline'|'subtle'|'solid'|'tinted'",                           default: "'outline'" },
      { name: 'color',     type: "'cobalt'|'green'|'coral'|'lilac'|'teal'|'horizon'|'sage'",      default: 'undefined (tinted only)' },
      { name: 'shape',     type: "'pill'|'rect'",                                                  default: "'pill'" },
      { name: 'uppercase', type: 'boolean',                                                         default: 'auto (per variant)' },
      { name: 'style',     type: 'CSSProperties',                                                   default: 'undefined' },
    ],
    states: [
      { label: 'Outline',         props: { variant: 'outline',  children: 'mention' } },
      { label: 'Subtle',          props: { variant: 'subtle',   children: 'Beta' } },
      { label: 'Solid',           props: { variant: 'solid',    children: 'Dev' } },
      { label: 'Rect outline',    props: { variant: 'outline',  shape: 'rect', children: 'Label' } },
      { label: 'Tinted — cobalt', props: { variant: 'tinted',   color: 'cobalt',  children: 'IN PROGRESS', _dual: true } },
      { label: 'Tinted — green',  props: { variant: 'tinted',   color: 'green',   children: 'DONE',        _dual: true } },
      { label: 'Tinted — coral',  props: { variant: 'tinted',   color: 'coral',   children: 'HIGH',        _dual: true } },
      { label: 'Tinted — lilac',  props: { variant: 'tinted',   color: 'lilac',   children: 'MEDIUM',      _dual: true } },
      { label: 'Tinted — teal',   props: { variant: 'tinted',   color: 'teal',    children: 'LOW',         _dual: true } },
      { label: 'Tinted — horizon',props: { variant: 'tinted',   color: 'horizon', children: 'HORIZON',     _dual: true } },
      { label: 'Tinted — sage',   props: { variant: 'tinted',   color: 'sage',    children: 'SAGE',        _dual: true } },
    ],
    render: (p) => {
      const { _dual, ...badgeProps } = p
      if (_dual) {
        // Show same badge on light bg + dark bg side by side
        return (
          <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #30363d' }}>
            <div style={{ background: '#FFFFFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Badge {...badgeProps} />
            </div>
            <div style={{ width: 1, background: '#30363d', flexShrink: 0 }} />
            <div style={{ background: '#181818', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }} data-theme="dark">
              <Badge {...badgeProps} />
            </div>
          </div>
        )
      }
      const darkBg = p.variant === 'subtle' || p.variant === 'solid'
      return center(<Badge {...badgeProps} />, darkBg ? '#1C1C1C' : 'transparent')
    },
    snippet: (p) => {
      const { _dual, ...badgeProps } = p
      const attrs = [`variant="${badgeProps.variant}"`]
      if (badgeProps.color)                       attrs.push(`color="${badgeProps.color}"`)
      if (badgeProps.shape && badgeProps.shape !== 'pill') attrs.push(`shape="${badgeProps.shape}"`)
      if (badgeProps.uppercase !== undefined)     attrs.push(`uppercase={${badgeProps.uppercase}}`)
      return `<Badge ${attrs.join(' ')}>\n  ${badgeProps.children ?? ''}\n</Badge>`
    },
    source: BadgeSrc,
    files: [
      { path: 'src/components/Badge.jsx', src: BadgeSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Outline border', hex: '#E5E7EB' },
        { name: 'Outline text',   hex: '#9CA3AF' },
        { name: 'Solid text',     hex: '#FFFFFF' },
      ],
      subComponents: [],
      notes: [
        'Tinted fills use --*20/--*30 tokens; dark mode overrides to rgba(color, 0.14/0.30)',
        'Subtle + Solid variants designed for dark/coloured backgrounds',
        'uppercase auto-derives from variant unless explicitly passed',
      ],
    },
  },

  // ── HearLogo ───────────────────────────────────────────────────────────────

  HearLogo: {
    tier: 'Atom',
    description: 'Brand SVG mark. Coral fill. Single className prop for sizing via Tailwind.',
    props: [
      { name: 'className', type: 'string', default: "''" },
    ],
    states: [
      { label: 'Default', props: { className: 'w-20 h-14' } },
      { label: 'Small',   props: { className: 'w-10 h-7'  } },
      { label: 'Large',   props: { className: 'w-40 h-28' } },
      { label: 'Inline',  props: { className: 'w-6 h-4'   } },
    ],
    render: (p) => center(<HearLogo {...p} />, '#EFEFED'),
    snippet: (p) => `<HearLogo className="${p.className}" />`,
    source: HearLogoSrc,
    files: [
      { path: 'src/components/HearLogo.jsx', src: HearLogoSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: '--color-brand', hex: '#FF7056' },
      ],
      subComponents: [],
      notes: [
        'SVG viewBox: 0 0 69 60',
        'Sized exclusively via Tailwind className (w-* h-*)',
        'No stroke — pure fill path',
      ],
    },
  },

  // ── ChatBubble ─────────────────────────────────────────────────────────────

  ChatBubble: {
    tier: 'Molecule',
    description: 'Chat message unit. User bubbles (coral, right) · AI bubbles (transparent, left, markdown) · Thinking indicator (3-dot bounce). Action row fades in on hover/last message.',
    props: [
      { name: 'role',        type: "'user'|'ai'|'thinking'", default: "'ai'" },
      { name: 'text',        type: 'string',                  default: "''" },
      { name: 'related',     type: 'string[]',                default: '[]' },
      { name: 'showActions', type: 'boolean',                  default: 'false' },
      { name: 'onCopy',      type: '() => void',              default: 'undefined' },
      { name: 'copied',      type: 'boolean',                  default: 'false' },
    ],
    states: [
      { label: 'User message', props: { role: 'user', text: 'Could you please clarify your request?' } },
      { label: 'AI response',  props: { role: 'ai',  text: 'I detected **3 signal anomalies** in the last 48 hours.\n\nTwo relate to `sentiment shifts` in inbound calls, one to an unusual spike in escalation keywords.', showActions: true } },
      { label: 'With related', props: { role: 'ai',  text: 'Signal detected in recent calls.', related: ['Call transcription analysis', 'Sentiment detection', 'Keyword extraction'], showActions: true } },
      { label: 'Thinking',     props: { role: 'thinking' } },
    ],
    render: (p) => (
      <div style={{ background: 'var(--bg-canvas)', padding: '20px 24px', minHeight: 80 }}>
        <ChatBubble {...p} onCopy={() => {}} />
      </div>
    ),
    snippet: (p) => {
      const attrs = [`role="${p.role}"`]
      if (p.text)        attrs.push(`text="..."`)
      if (p.showActions) attrs.push('showActions')
      if (p.related?.length) attrs.push(`related={[...]}`)
      return `<ChatBubble\n  ${attrs.join('\n  ')}\n  onCopy={handleCopy}\n/>`
    },
    source: ChatBubbleSrc,
    files: [
      { path: 'src/components/ChatBubble.jsx', src: ChatBubbleSrc },
    ],
    npm: ['react-markdown', 'remark-gfm'],
    breakdown: {
      icons: [],
      colors: [
        { name: '--color-brand (user bg)',  hex: '#FF7056' },
        { name: '--bg-canvas (AI bg)',      hex: '#F4F3F1' },
        { name: '--bg-card (thinking)',     hex: '#FFFFFF' },
        { name: '--text-primary',           hex: '#181818' },
        { name: 'Action icons',            hex: '#9CA3AF' },
      ],
      subComponents: [],
      notes: [
        'role="user"    → right-aligned, coral bubble, white text, no actions',
        'role="ai"      → left-aligned, transparent, ReactMarkdown, action row',
        'role="thinking"→ left-aligned, bg-card bubble, 3-dot dot-bounce animation',
        'showActions controls opacity of action row (0→1, transition 150ms)',
        'related[] renders slideInRight list below the bubble (AI only)',
        'Animations: msgIn (entrance) · dot-bounce (thinking) · slideInRight (related) — defined in index.css',
      ],
    },
  },

  // ── ChatInput ──────────────────────────────────────────────────────────────

  ChatInput: {
    tier: 'Organism',
    description: 'Multi-functional input bar. Mic, attach, @mention, thinking dots, submit.',
    props: [
      { name: 'onSubmit',            type: '(text: string) => void', default: 'required' },
      { name: 'onMentionChange',     type: '(open: boolean) => void', default: 'undefined' },
      { name: 'loading',             type: 'boolean',                  default: 'false' },
      { name: 'settled',             type: 'boolean',                  default: 'false' },
      { name: 'defaultText',         type: 'string',                   default: "''" },
      { name: 'initialUploadOpen',   type: 'boolean',                  default: 'false' },
      { name: 'initialMentionQuery', type: 'string|null',              default: 'null' },
    ],
    states: [
      { label: 'Empty',      props: { loading: false, defaultText: '' } },
      { label: 'With text',  props: { defaultText: 'Tell me about signal trends…' } },
      { label: 'Loading',    props: { loading: true } },
      { label: 'Attach',     props: { initialUploadOpen: true } },
      { label: 'Mention',    props: { initialMentionQuery: '' } },
    ],
    render: (p) => {
      const isMention = p.initialMentionQuery !== null && p.initialMentionQuery !== undefined
      // The mention dropdown renders as position:absolute, top:100% — below the input.
      // paddingBottom expands the wrapper's clipping region downward so the dropdown
      // renders inside the box rather than being cut off by overflow:hidden upstream.
      return (
        <div style={{
          background: '#EFEFED',
          padding: '12px 16px',
          paddingBottom: isMention ? 280 : 12,
        }}>
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '118%', pointerEvents: 'none' }}>
            <ChatInput onSubmit={() => {}} onMentionChange={() => {}} {...p} />
          </div>
        </div>
      )
    },
    snippet: () =>
      `<ChatInput\n  onSubmit={handleSubmit}\n  onMentionChange={setMentionActive}\n  loading={loading}\n  settled={settled}\n/>`,
    source: ChatInputSrc,
    files: [
      { path: 'src/components/ChatInput.jsx',      src: ChatInputSrc },
      { path: 'src/components/icons/index.jsx',    src: IconsSrc },
    ],
    npm: [],
    breakdown: {
      icons: ['MicIcon', 'AttachIcon', 'ReturnIcon', 'NavigateIcon', 'EscIcon'],
      colors: [
        { name: '--bg-card (input)',       hex: '#FFFFFF' },
        { name: '--border-default',        hex: '#E5E7EB' },
        { name: '--text-secondary',        hex: '#606060' },
        { name: '--color-interactive',     hex: '#1779F7' },
      ],
      subComponents: ['Badge'],
      notes: [
        'FLAG (Opacity): SubmitIcon, ThinkingDots defined inline — not from icons index',
        '@mention popup anchors above the textarea, triggered by typing "@"',
        'settled prop switches layout from inline → position:fixed (bottom bar mode)',
      ],
    },
  },

  // ── Sidebar ────────────────────────────────────────────────────────────────

  Sidebar: {
    tier: 'Organism',
    description: '11-item navigation sidebar. Collapsible on desktop, full-screen drawer on mobile.',
    props: [
      { name: 'isMobile',      type: 'boolean',    default: 'false' },
      { name: 'mobileOpen',    type: 'boolean',    default: 'false' },
      { name: 'onMobileClose', type: '() => void', default: 'undefined' },
    ],
    states: [
      { label: 'Desktop open',   props: { isMobile: false } },
      { label: 'Mobile closed',  props: { isMobile: true, mobileOpen: false } },
      { label: 'Mobile open',    props: { isMobile: true, mobileOpen: true } },
    ],
    // contain:paint makes position:fixed children relative to this box
    render: (p) => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transform: 'scale(0.62)', transformOrigin: 'top left',
        width: 272, height: '100vh',
        pointerEvents: 'none',
      }}>
        <Sidebar {...p} onMobileClose={() => {}} />
      </div>,
      172,
    ),
    snippet: () =>
      `<Sidebar\n  isMobile={isMobile}\n  mobileOpen={sidebarOpen}\n  onMobileClose={() => setSidebarOpen(false)}\n/>`,
    source: SidebarSrc,
    files: [
      { path: 'src/components/Sidebar.jsx',     src: SidebarSrc },
      { path: 'src/components/HearLogo.jsx',    src: HearLogoSrc },
      { path: 'src/components/icons/index.jsx', src: IconsSrc },
    ],
    npm: [],
    breakdown: {
      icons: [
        'HomeIcon', 'DataIcon', 'ReportsIcon', 'SignalsIcon', 'AlertsIcon',
        'ComplianceIcon', 'AgentIcon', 'KnowledgeIcon', 'AiTaskIcon',
        'CustomersIcon', 'SettingsIcon', 'BellIcon', 'ChevronIcon',
        'CollapseArrow', 'DotsIcon', 'MoonIcon', 'AccessibilityIcon', 'LogoutIcon',
      ],
      colors: [
        { name: '--bg-sidebar',    hex: '#F5F5F3' },
        { name: '--bg-active',     hex: '#E8E8E6' },
        { name: '--text-primary',  hex: '#181818' },
        { name: '--text-secondary',hex: '#606060' },
        { name: '--border-default',hex: '#E5E7EB' },
        { name: '--color-brand',   hex: '#FF7056' },
      ],
      subComponents: ['HearLogo'],
      notes: [
        'FLAG (Drift): renders own nav <button> markup — does NOT import Atoms/NavItem',
        'Uses 11 nav items + conversation history list + user profile strip',
        'Collapse width: 272px → 0px (transition 250ms ease)',
        'z-index: 100 (panel) / 200 (project dropdown)',
      ],
    },
  },

  // ── SignIn ─────────────────────────────────────────────────────────────────

  SignIn: {
    tier: 'Organism',
    description: 'Full-screen auth gate. Google OAuth + email form. Domain-restricted to @hear.ai.',
    props: [
      { name: 'onSignIn', type: '() => void', default: 'required' },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: (_p) => (
      <div style={{ height: 148, background: '#000', overflow: 'hidden', position: 'relative', display: 'flex' }}>
        {/* Static snapshot — avoids position:fixed grain SVG + GSAP + OAuth hooks firing in preview */}
        <div style={{ flex: '0 0 42%', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 18, background: 'var(--c100)', borderRadius: 4 }} />
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'Byrd', sans-serif" }}>Hear</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 7, width: '90%', background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
            <div style={{ height: 7, width: '70%', background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
            <div style={{ height: 7, width: '80%', background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
          </div>
          <div style={{ height: 22, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
            <div style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
            <div style={{ height: 4, width: 80, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: "'Byrd', sans-serif" }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <div style={{ height: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
          <div style={{ width: 80, height: 100, background: 'linear-gradient(135deg, rgba(255,112,86,0.3), rgba(23,121,247,0.2))', borderRadius: 8 }} />
        </div>
      </div>
    ),
    snippet: () => `<SignIn onSignIn={handleSignIn} />`,
    source: SignInSrc,
    files: [
      { path: 'src/components/SignIn.jsx',                src: SignInSrc },
      { path: 'src/components/sign-in/SignInHero.jsx',    src: SignInHeroSrc },
      { path: 'src/components/sign-in/GoogleButton.jsx',  src: GoogleButtonSrc },
      { path: 'src/components/sign-in/AuthDivider.jsx',   src: AuthDividerSrc },
      { path: 'src/components/sign-in/EmailForm.jsx',     src: EmailFormSrc },
      { path: 'src/components/HearLogo.jsx',              src: HearLogoSrc },
    ],
    npm: ['@react-oauth/google'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Canvas black',    hex: '#000000' },
        { name: '--color-brand',   hex: '#FF7056' },
        { name: 'White text/bg',   hex: '#FFFFFF' },
      ],
      subComponents: ['HearLogo', 'SignInHero', 'GoogleButton', 'AuthDivider', 'EmailForm'],
      notes: [
        'Domain-restricted: only @hear.ai Google accounts accepted',
        'Uses @react-oauth/google → GoogleOAuthProvider must wrap the tree',
        'Email form as fallback credential path',
      ],
    },
  },

  // ── SignInHero ─────────────────────────────────────────────────────────────

  SignInHero: {
    tier: 'Molecule',
    description: 'Left-panel hero block inside SignIn. Logo image + edition badge + headline.',
    props: [
      { name: 'badge', type: 'string', default: "'Design Lab'" },
    ],
    states: [
      { label: 'Design Lab', props: { env: 'Design Lab', onEnvChange: () => {} } },
      { label: 'Demo',       props: { env: 'Demo',       onEnvChange: () => {} } },
    ],
    render: (p) => (
      <div style={{ background: '#000', padding: '28px 24px', minHeight: 80 }}>
        <SignInHero env={p.env ?? 'Design Lab'} onEnvChange={p.onEnvChange ?? (() => {})} />
      </div>
    ),
    snippet: (p) => `<SignInHero${p.badge && p.badge !== 'Design Lab' ? ` badge="${p.badge}"` : ''} />`,
    source: SignInHeroSrc,
    files: [
      { path: 'src/components/sign-in/SignInHero.jsx', src: SignInHeroSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Headline white',   hex: '#FFFFFF' },
        { name: 'Badge border',     hex: 'rgba(255,255,255,0.15)' },
        { name: 'Badge text',       hex: 'rgba(255,255,255,0.6)' },
      ],
      subComponents: [],
      notes: [
        'Logo loaded from /Logo.svg (public/Logo.svg)',
        'Headline uses clamp(30px, 3vw, 44px) — fluid responsive type',
        'Badge is an inline <span> with glass-morphism style',
      ],
    },
  },

  // ── GoogleButton ───────────────────────────────────────────────────────────

  GoogleButton: {
    tier: 'Molecule',
    description: '"Continue with Google" OAuth button with loading and error states.',
    props: [
      { name: 'onClick',  type: '() => void', default: 'undefined' },
      { name: 'loading',  type: 'boolean',    default: 'false' },
      { name: 'error',    type: 'string',     default: "''" },
    ],
    states: [
      { label: 'Default', props: {} },
      { label: 'Loading', props: { loading: true } },
      { label: 'Error',   props: { error: 'Only @hear.ai accounts are allowed.' } },
    ],
    render: (p) => (
      <div style={{ background: '#000', padding: '24px 20px', maxWidth: 360 }}>
        <GoogleButton onClick={() => {}} {...p} />
      </div>
    ),
    snippet: (p) => {
      const attrs = ['onClick={handleGoogleSignIn}']
      if (p.loading) attrs.push('loading')
      if (p.error)   attrs.push(`error="${p.error}"`)
      return `<GoogleButton ${attrs.join(' ')} />`
    },
    source: GoogleButtonSrc,
    files: [
      { path: 'src/components/sign-in/GoogleButton.jsx', src: GoogleButtonSrc },
    ],
    npm: ['@react-oauth/google'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Button bg',        hex: 'rgba(255,255,255,0.07)' },
        { name: 'Button border',    hex: 'rgba(255,255,255,0.14)' },
        { name: 'Button text',      hex: '#FFFFFF' },
        { name: 'Error text',       hex: 'rgba(255,100,100,0.9)' },
        { name: 'Google Blue',      hex: '#4285F4' },
        { name: 'Google Green',     hex: '#34A853' },
        { name: 'Google Yellow',    hex: '#FBBC05' },
        { name: 'Google Red',       hex: '#EA4335' },
      ],
      subComponents: [],
      notes: [
        'GoogleIcon is an inline SVG — not from icons/index.jsx',
        'Hover lightens background to rgba(255,255,255,0.13) via onMouseEnter',
        'disabled + opacity:0.6 during loading',
      ],
    },
  },

  // ── AuthDivider ────────────────────────────────────────────────────────────

  AuthDivider: {
    tier: 'Atom',
    description: '"OR" horizontal rule separator between OAuth and email sign-in paths.',
    props: [],
    states: [
      { label: 'Default', props: {} },
    ],
    render: (_p) => (
      <div style={{ background: '#000', padding: '16px 20px', maxWidth: 360 }}>
        <AuthDivider />
      </div>
    ),
    snippet: () => `<AuthDivider />`,
    source: AuthDividerSrc,
    files: [
      { path: 'src/components/sign-in/AuthDivider.jsx', src: AuthDividerSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Rule line',    hex: 'rgba(255,255,255,0.06)' },
        { name: '"OR" label',   hex: 'rgba(255,255,255,0.2)' },
      ],
      subComponents: [],
      notes: [
        'No props — purely presentational',
        'Uses flex layout: line — OR — line',
      ],
    },
  },

  // ── EmailForm ──────────────────────────────────────────────────────────────

  EmailForm: {
    tier: 'Molecule',
    description: 'Email input + "Continue with email" submit button. Disabled by default (coming soon).',
    props: [
      { name: 'disabled', type: 'boolean', default: 'true' },
    ],
    states: [
      { label: 'Disabled', props: { disabled: true } },
      { label: 'Enabled',  props: { disabled: false } },
    ],
    render: (p) => (
      <div style={{ background: '#000', padding: '24px 20px', maxWidth: 360 }}>
        <EmailForm {...p} />
      </div>
    ),
    snippet: (p) => `<EmailForm${p.disabled === false ? ' disabled={false}' : ''} />`,
    source: EmailFormSrc,
    files: [
      { path: 'src/components/sign-in/EmailForm.jsx', src: EmailFormSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Input bg',       hex: 'rgba(255,255,255,0.03)' },
        { name: 'Input border',   hex: 'rgba(255,255,255,0.06)' },
        { name: 'Disabled text',  hex: 'rgba(255,255,255,0.2)' },
        { name: 'Button bg',      hex: 'rgba(255,255,255,0.15)' },
        { name: 'Enabled button', hex: 'rgba(255,255,255,0.9)' },
      ],
      subComponents: [],
      notes: [
        'disabled=true by default — email auth not yet implemented',
        'Enabled state ready for backend integration',
      ],
    },
  },

  // ── EventCard ──────────────────────────────────────────────────────────────

  EventCard: {
    tier: 'Organism',
    description: 'Schema-driven event card. Left border accent badges. Inline tab expansion (grid-rows collapse, 300ms). Quick actions on hover.',
    props: [
      { name: 'event',      type: 'EventObject', default: 'required' },
      { name: 'compact',    type: 'boolean',     default: 'false' },
      { name: 'animDelay',  type: 'number (ms)', default: '0' },
    ],
    states: [
      { label: 'Collapsed',  props: { event: SCHEMAS.acme.events[1], compact: false, animDelay: 0 } },
      { label: 'Compact',    props: { event: SCHEMAS.acme.events[3], compact: true,  animDelay: 0 } },
      { label: 'Flagged',    props: { event: SCHEMAS.acme.events[0], compact: false, animDelay: 0 } },
      { label: 'GlobalBank', props: { event: SCHEMAS.globalbank.events[0], compact: false, animDelay: 0 } },
      { label: 'MedCo',      props: { event: SCHEMAS.medco.events[0], compact: false, animDelay: 0 } },
    ],
    render: (p) => (
      <div style={{ background: 'var(--bg-canvas)', padding: '16px' }}>
        <EventCard {...p} />
      </div>
    ),
    snippet: () =>
      `<EventCard\n  event={event}\n  compact={compact}\n  animDelay={index * 40}\n/>`,
    source: EventCardSrc,
    files: [
      { path: 'src/components/data/EventCard.jsx', src: EventCardSrc },
      { path: 'src/components/data/mockData.js',   src: MockDataSrc  },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Status flagged',  hex: '#EF4444' },
        { name: 'Status clean',    hex: '#4BA373' },
        { name: 'Status pending',  hex: '#F59E0B' },
        { name: 'Status reviewed', hex: '#1779F7' },
        { name: '--bg-card',       hex: '#FFFFFF'  },
        { name: '--bg-active',     hex: '#E8E8E6'  },
      ],
      subComponents: [],
      notes: [
        'Card expansion: grid-template-rows 0fr → 1fr, 300ms ease',
        'Attribute badges: 3px left border + 8% tint background per color',
        'Quick actions appear on hover (stopPropagation to avoid expand toggle)',
        'Tab click also uses stopPropagation — does not toggle card expansion',
        'animDelay drives staggered msgIn entrance (i * 40ms)',
      ],
    },
  },

  // ── OmniBar ────────────────────────────────────────────────────────────────

  OmniBar: {
    tier: 'Molecule',
    description: 'Filter input bar with live field suggestions and animated token pills. Backspace removes last token when input is empty.',
    props: [
      { name: 'schema',          type: 'SchemaObject',       default: 'required' },
      { name: 'filters',         type: 'FilterToken[]',      default: '[]' },
      { name: 'onFiltersChange', type: '(tokens) => void',   default: 'required' },
      { name: 'onRemoveFilter',  type: '(index) => void',    default: 'required' },
    ],
    states: [
      { label: 'Empty',       props: { schema: SCHEMAS.acme,       filters: [],                                                                      onFiltersChange: () => {}, onRemoveFilter: () => {} } },
      { label: 'With tokens', props: { schema: SCHEMAS.acme,       filters: [{ key: 'Risk', value: 'High', color: '#EF4444' }, { key: 'Topic', value: 'Escalation', color: '#6E95A0' }], onFiltersChange: () => {}, onRemoveFilter: () => {} } },
      { label: 'GlobalBank',  props: { schema: SCHEMAS.globalbank, filters: [{ key: 'Regulation', value: 'GDPR', color: '#1779F7' }],               onFiltersChange: () => {}, onRemoveFilter: () => {} } },
    ],
    render: (p) => (
      <div style={{ background: 'var(--bg-canvas)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <OmniBar {...p} />
      </div>
    ),
    snippet: () =>
      `<OmniBar\n  schema={schema}\n  filters={filters}\n  onFiltersChange={setFilters}\n  onRemoveFilter={(i) => setFilters(prev => prev.filter((_, idx) => idx !== i))}\n/>`,
    source: OmniBarSrc,
    files: [
      { path: 'src/components/data/OmniBar.jsx', src: OmniBarSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Token border',    hex: 'attr.color + 40 alpha' },
        { name: 'Token bg',        hex: 'attr.color + 15 alpha' },
        { name: 'Dot indicator',   hex: 'attr.color (solid)'    },
      ],
      subComponents: [],
      notes: [
        'Suggestions dropdown: field names → then value names (2-step)',
        'onMouseDown on suggestions prevents blur race with onBlur (150ms delay)',
        'Tokens animate in with slideInRight keyframe',
        'Backspace on empty input removes last token',
        'Escape clears input and blurs',
      ],
    },
  },

  // ── DataPage ───────────────────────────────────────────────────────────────

  DataPage: {
    tier: 'Organism',
    description: 'Full Data page. Header + filter chip strip + AG Grid infinite-scroll table. Schema-aware, preset system, save-as-preset modal.',
    props: [
      { name: 'isMobile',     type: 'boolean', default: 'false' },
      { name: 'sidebarWidth', type: 'number',  default: '272'   },
    ],
    states: [
      { label: 'Default', props: { isMobile: false, sidebarWidth: 0 } },
    ],
    render: () => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        transform: 'scale(0.55)', transformOrigin: 'top left',
        width: '182%', height: '182%',
        pointerEvents: 'none',
      }}>
        <DataPage isMobile={false} sidebarWidth={0} />
      </div>,
      220,
    ),
    snippet: () => `<DataPage isMobile={isMobile} sidebarWidth={SIDEBAR_WIDTH} />`,
    source: DataPageSrc,
    files: [
      { path: 'src/components/data/DataPage.jsx',  src: DataPageSrc  },
      { path: 'src/components/data/mockData.js',   src: MockDataSrc  },
    ],
    npm: ['ag-grid-community', 'ag-grid-react'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'IN PROGRESS (status)',  hex: '#1779F7' },
        { name: 'DONE (status)',         hex: '#4BA373' },
        { name: 'HIGH (priority)',       hex: '#EF4444' },
        { name: 'MEDIUM (priority)',     hex: '#F59E0B' },
        { name: 'LOW (priority)',        hex: '#1779F7' },
        { name: '--bg-sidebar (header)', hex: '#F5F5F3' },
      ],
      subComponents: ['Badge', 'Button', 'Modal', 'FilterChip', 'FilterPopover', 'DataGrid'],
      notes: [
        'rowModelType="infinite" — datasource slices a 2 000-row pool on demand',
        'filteredPool = useMemo(runFilters, [appliedChips, searchText, rowPool])',
        'chips (draft) vs appliedChips (committed) — Apply button flushes draft to grid',
        'Preset system: built-in PRESETS[] + customPresets state (save-as-preset modal)',
        'Cell renderers: IdCell, StatusCell, PriorityCell, AssignedToCell (Badge-based)',
        'Alert warning: AlertTooltip uses position:fixed + getBoundingClientRect',
      ],
    },
  },

  // ── ReportsPage ────────────────────────────────────────────────────────────

  ReportsPage: {
    tier: 'Organism',
    description: 'Full Reports page. Header + status filter tabs + search. List view (rows with status-colored left border) and grid view (cards). 22 mock reports across AI Generated, Running, Completed, Failed, and Not Executed states.',
    props: [
      { name: 'isMobile',     type: 'boolean', default: 'false' },
      { name: 'sidebarWidth', type: 'number',  default: '272'   },
    ],
    states: [
      { label: 'List view',  props: { isMobile: false, sidebarWidth: 0 } },
    ],
    render: () => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        transform: 'scale(0.55)', transformOrigin: 'top left',
        width: '182%', height: '182%',
        pointerEvents: 'none',
      }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      220,
    ),
    snippet: () => `<ReportsPage isMobile={isMobile} sidebarWidth={SIDEBAR_WIDTH} />`,
    source: ReportsPageSrc,
    files: [
      { path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc },
    ],
    breakdown: {
      icons: [],
      colors: [
        { name: 'AI Generated border', hex: '#FF7056' },
        { name: 'Running / Completed', hex: '#4BA373' },
        { name: 'Failed border',       hex: '#DC2626' },
      ],
      subComponents: ['Badge', 'Button', 'StatusBadge', 'ReportRow', 'ReportCard', 'StatusTabs'],
      notes: [
        'List view: 3px left border animates in on hover, colored by status',
        'Grid view: borderTop 3px status color + glow box-shadow on hover',
        'Status filter tabs with per-status counts',
        'Search filters across name, ID, and trend fields',
      ],
    },
  },

  // ── FilterChip ─────────────────────────────────────────────────────────────

  FilterChip: {
    tier: 'Atom',
    description: 'Applied filter pill inside the Data page filter strip. Shows field + operator + value. Click label to edit, × to remove.',
    props: [
      { name: 'chip',     type: '{ field, operator, value }', default: 'required' },
      { name: 'onEdit',   type: '() => void',                  default: 'required' },
      { name: 'onRemove', type: '() => void',                  default: 'required' },
    ],
    states: [
      { label: 'Contains',     props: { chip: { id: 1, field: 'status',   operator: 'contains',     value: 'IN PROGRESS' }, onEdit: () => {}, onRemove: () => {} } },
      { label: 'Not contains', props: { chip: { id: 2, field: 'priority', operator: 'not_contains', value: 'LOW'         }, onEdit: () => {}, onRemove: () => {} } },
      { label: 'Equals',       props: { chip: { id: 3, field: 'destination', operator: 'equals',   value: 'Paris, France'}, onEdit: () => {}, onRemove: () => {} } },
    ],
    render: (p) => center(
      // FilterChip is inlined inside DataPage — recreate its JSX here for preview
      <div data-inspector="FilterChip" style={{
        display: 'flex', alignItems: 'center', gap: 0,
        height: 26, borderRadius: 99,
        background: 'var(--b20)', border: '1px solid var(--b30)',
        fontSize: 12, color: 'var(--b100)',
        fontFamily: "'Byrd', sans-serif",
        whiteSpace: 'nowrap', flexShrink: 0, userSelect: 'none',
      }}>
        <span style={{ padding: '0 8px 0 10px', cursor: 'pointer', lineHeight: 1 }}>
          {(() => {
            const fieldLabels = { status: 'Status', priority: 'Priority', destination: 'Destination' }
            const isNeg = p.chip.operator === 'not_contains' || p.chip.operator === 'not_equal'
            return `${fieldLabels[p.chip.field] ?? p.chip.field}${isNeg ? ' ≠' : ':'} ${p.chip.value}`
          })()}
        </span>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, marginRight: 3,
          borderRadius: '50%', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--b100)', fontSize: 15, lineHeight: 1, flexShrink: 0,
        }}>×</button>
      </div>
    ),
    snippet: () =>
`<FilterChip
  chip={{ field: 'status', operator: 'contains', value: 'IN PROGRESS' }}
  onEdit={() => openPopover(chip.id, el)}
  onRemove={() => removeChip(chip.id)}
/>`,
    source: DataPageSrc,
    files: [{ path: 'src/components/data/DataPage.jsx', src: DataPageSrc }],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Chip bg',     hex: 'var(--b20) — cobalt 20%' },
        { name: 'Chip border', hex: 'var(--b30) — cobalt 30%' },
        { name: 'Chip text',   hex: 'var(--b100) — #1779F7'  },
      ],
      subComponents: [],
      notes: [
        'Defined inline in DataPage.jsx — not a separate file',
        'isNeg flag: "not_contains" / "not_equal" operators show ≠ instead of :',
        'onEdit opens FilterPopover anchored to the chip element',
      ],
    },
  },

  // ── FilterPopover ──────────────────────────────────────────────────────────

  FilterPopover: {
    tier: 'Molecule',
    description: 'Popover for adding/editing a filter chip. Field + operator + value selects. position:fixed anchored via getBoundingClientRect to escape overflow clipping.',
    props: [
      { name: 'anchor',   type: '{ x: number, y: number }',         default: 'required' },
      { name: 'chip',     type: '{ field, operator, value }',        default: 'required' },
      { name: 'onChange', type: '(chip) => void',                    default: 'required' },
      { name: 'onDone',   type: '() => void',                        default: 'required' },
      { name: 'onClose',  type: '() => void',                        default: 'required' },
    ],
    states: [
      { label: 'Empty',    props: {} },
      { label: 'Filled',   props: {} },
    ],
    render: () => (
      <div style={{ position: 'relative', height: 180, contain: 'paint' }}>
        <div data-inspector="FilterPopover" style={{
          position: 'absolute', left: 16, top: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
          padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          width: 250,
          fontFamily: "'Byrd', sans-serif",
          fontSize: 13,
        }}>
          <select style={{ height: 32, padding: '0 10px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", outline: 'none', width: '100%' }}>
            <option>Status</option>
          </select>
          <select style={{ height: 32, padding: '0 10px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", outline: 'none', width: '100%' }}>
            <option>Contains</option>
          </select>
          <input placeholder="Value…" style={{ height: 32, padding: '0 10px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' }} readOnly />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm">Done</Button>
          </div>
        </div>
      </div>
    ),
    snippet: () =>
`{activePopover && (
  <FilterPopover
    anchor={activePopover.anchor}
    chip={editingChip}
    onChange={setEditingChip}
    onDone={donePopover}
    onClose={closePopover}
  />
)}`,
    source: DataPageSrc,
    files: [{ path: 'src/components/data/DataPage.jsx', src: DataPageSrc }],
    npm: [],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: ['Button'],
      notes: [
        'position:fixed + getBoundingClientRect() — same pattern as AlertTooltip',
        'mousedown outside closes (not click) to avoid false-positive race conditions',
        'Enter key submits when canDone = field && value.trim()',
        'Defined inline in DataPage.jsx — not a separate file',
      ],
    },
  },

  // ── DataGrid ───────────────────────────────────────────────────────────────

  DataGrid: {
    tier: 'Organism',
    description: 'AG Grid Infinite Row Model table. 8 columns, custom cell renderers for status/priority/assignee. Themed via CSS variables — dark mode automatic.',
    props: [
      { name: 'columnDefs',              type: 'ColDef[]',  default: 'COL_DEFS'       },
      { name: 'rowModelType',            type: 'string',    default: '"infinite"'      },
      { name: 'cacheBlockSize',          type: 'number',    default: '100'             },
      { name: 'infiniteInitialRowCount', type: 'number',    default: '100'             },
      { name: 'rowHeight',               type: 'number',    default: '44'              },
      { name: 'headerHeight',            type: 'number',    default: '38'              },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: () => (
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header row mock */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '180px 130px 130px 140px 1fr 110px 90px 130px',
          height: 38, alignItems: 'center',
          borderBottom: '1px solid var(--border-default)',
          paddingLeft: 14,
        }}>
          {['ID', 'CALL DATE', 'PROPOSED PRICE', 'DESTINATION', 'SUMMERY', 'STATUS', 'PRIORITY', 'ASSIGNED TO'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>
        {/* Sample rows */}
        {[
          { id: '170254bf-0000…', date: 'March 1, 2023',  price: '2,682',  dest: 'Paris, France',    status: 'IN PROGRESS', priority: 'HIGH'   },
          { id: '2a3b4c5d-0001…', date: 'March 2, 2023',  price: '6,755',  dest: 'London, UK',       status: 'DONE',        priority: 'LOW'    },
          { id: '3c4d5e6f-0002…', date: 'March 3, 2023',  price: '4,174',  dest: 'Berlin, Germany',  status: null,          priority: 'MEDIUM' },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '180px 130px 130px 140px 1fr 110px 90px 130px',
            height: 44, alignItems: 'center',
            paddingLeft: 14,
            borderBottom: '1px solid var(--border-default)',
            fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{row.id}</span>
            <span>{row.date}</span>
            <span>{row.price}</span>
            <span>{row.dest}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8, color: 'var(--text-secondary)' }}>Customer inquiry about enterprise licensing…</span>
            <span>{row.status && <Badge variant="tinted" color={row.status === 'IN PROGRESS' ? 'cobalt' : 'green'} shape="pill">{row.status}</Badge>}</span>
            <span>{row.priority && <Badge variant="tinted" color={row.priority === 'HIGH' ? 'coral' : row.priority === 'MEDIUM' ? 'lilac' : 'teal'} shape="pill">{row.priority}</Badge>}</span>
            <span style={{ color: 'var(--text-muted)' }}>—</span>
          </div>
        ))}
      </div>
    ),
    snippet: () =>
`<AgGridReact
  className="ag-theme-quartz hear-grid"
  rowModelType="infinite"
  cacheBlockSize={100}
  maxBlocksInCache={10}
  infiniteInitialRowCount={100}
  onGridReady={e => setGridApi(e.api)}
  columnDefs={COL_DEFS}
  defaultColDef={{ resizable: true, sortable: true }}
  rowHeight={44}
  headerHeight={38}
/>`,
    source: DataPageSrc,
    files: [
      { path: 'src/components/data/DataPage.jsx', src: DataPageSrc },
    ],
    npm: ['ag-grid-community', 'ag-grid-react'],
    breakdown: {
      icons: [],
      colors: [
        { name: '--ag-background-color',        hex: 'var(--bg-card)'    },
        { name: '--ag-header-background-color', hex: 'var(--bg-canvas)'  },
        { name: '--ag-row-hover-color',         hex: 'var(--bg-active)'  },
        { name: '--ag-selected-row-background', hex: '#1779F718'         },
      ],
      subComponents: ['Badge'],
      notes: [
        'Theme class: ag-theme-quartz hear-grid — CSS vars in index.css override defaults',
        'Dark mode: all --ag-* vars reference design tokens → automatic via [data-theme="dark"]',
        'COL_DEFS: ID(210) | Call Date(160) | Price(155) | Destination(165) | Summary(flex:1) | Status(135) | Priority(110) | Assigned To(160)',
        'IdCell: shows WarningIcon (AlertTooltip) when data.hasWarning=true',
        'statusCell / PriorityCell: render Badge tinted; null value → renders nothing',
        'AssignedToCell: AvatarIcon (SVG initials circle) + truncated name',
      ],
    },
  },

  // ── FilterDrawer ───────────────────────────────────────────────────────────

  FilterDrawer: {
    tier: 'Organism',
    description: 'Advanced multi-condition filter panel. Slides in from right (translateX, 280ms spring). Up to 3 filter rows with AND/OR toggle. Schema-aware value dropdowns.',
    props: [
      { name: 'open',     type: 'boolean',           default: 'false' },
      { name: 'onClose',  type: '() => void',        default: 'required' },
      { name: 'schema',   type: 'SchemaObject',      default: 'required' },
      { name: 'onApply',  type: '(tokens) => void',  default: 'required' },
    ],
    states: [
      { label: 'Closed',      props: { open: false, schema: SCHEMAS.acme,       onClose: () => {}, onApply: () => {} } },
      { label: 'Open 1 row',  props: { open: true,  schema: SCHEMAS.acme,       onClose: () => {}, onApply: () => {} } },
      { label: 'Open GlobalBank', props: { open: true, schema: SCHEMAS.globalbank, onClose: () => {}, onApply: () => {} } },
    ],
    render: (p) => containedPreview(
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <FilterDrawer {...p} />
      </div>,
      260,
    ),
    snippet: () =>
      `<FilterDrawer\n  open={drawerOpen}\n  onClose={() => setDrawerOpen(false)}\n  schema={schema}\n  onApply={(newFilters) => {\n    setFilters(prev => [...prev, ...newFilters])\n    setDrawerOpen(false)\n  }}\n/>`,
    source: FilterDrawerSrc,
    files: [
      { path: 'src/components/data/FilterDrawer.jsx', src: FilterDrawerSrc },
    ],
    npm: [],
    breakdown: {
      icons: [],
      colors: [
        { name: '--bg-elevated (drawer)',  hex: '#FFFFFF'  },
        { name: '--color-brand (AND/OR)',  hex: '#FF7056'  },
        { name: 'Apply button',           hex: '#FF7056'  },
        { name: 'Backdrop overlay',       hex: 'rgba(0,0,0,0.2)' },
      ],
      subComponents: [],
      notes: [
        'Slide: translateX(100%) → translateX(0), 280ms cubic-bezier(0.22,1,0.36,1)',
        'Backdrop fades independently (opacity transition) — drawer slides independently',
        'Value <select> auto-populates from schema.events attribute values',
        'Max 3 rows — "+ Add condition" button hidden at limit',
        'Reset restores single empty row; Apply closes drawer and pushes tokens',
      ],
    },
  },
}
