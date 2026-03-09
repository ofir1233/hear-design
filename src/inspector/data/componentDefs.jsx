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
import ExplorePage  from '../../components/data/ExplorePage.jsx'
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
import ExplorePageSrc   from '../../components/data/ExplorePage.jsx?raw'
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
    render: (_p) => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transform: 'scale(0.2)', transformOrigin: 'top left',
        width: 2400, height: 1400,
        pointerEvents: 'none',
      }}>
        <SignIn onSignIn={() => {}} />
      </div>,
      148,
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

  // ── ExplorePage & sub-components ───────────────────────────────────────────

  ExplorePage: {
    tier: 'Organism',
    description: 'Full call detail page — navigated to via /data/explore/:id. Stacks: topic hero card, CallSummarySection, QuickStatsRow, CallMetricsSection, AgentEvaluationSection, MonitoredEventsSection, TranscriptionSection, CustomerSection. URL persists on refresh via sessionStorage.',
    props: [
      { name: 'call',              type: 'object',   default: 'row data from DataPage grid' },
      { name: 'onBack',            type: 'function', default: '() => navigate("/data")' },
      { name: 'isMobile',          type: 'boolean',  default: 'false' },
      { name: 'sidebarWidth',      type: 'number',   default: '272'   },
      { name: 'sidebarTransition', type: 'string',   default: '""'    },
    ],
    states: [
      {
        label: 'In Progress — High priority',
        preview: () => containedPreview(
          <ExplorePage
            call={{ id: '170254bf', callDate: 'March 15, 2023', destination: 'Paris, France', summary: 'Customer inquired about enterprise licensing options and volume discount tiers for Q2 renewal.', status: 'IN PROGRESS', priority: 'HIGH', callType: 'inbound', proposedPrice: 5364, assignedTo: { name: 'Sarah Chen', initials: 'SC', color: 'blue' } }}
            onBack={() => {}} isMobile={false} sidebarWidth={0}
          />, 500,
        ),
      },
      {
        label: 'Done — No agent',
        preview: () => containedPreview(
          <ExplorePage
            call={{ id: 'gb-b2c3d4e5', callDate: 'January 11, 2023', destination: 'London, UK', summary: 'PCI DSS Level 1 audit preparation. Reviewed card tokenization and vault access control procedures.', status: 'DONE', priority: 'MEDIUM', callType: 'outbound', proposedPrice: 18900, assignedTo: null }}
            onBack={() => {}} isMobile={false} sidebarWidth={0}
          />, 500,
        ),
      },
    ],
    snippet: () => `// Navigated to automatically via openCall() in App.jsx
// URL: /data/explore/:id — call data persisted in sessionStorage
<ExplorePage
  call={selectedCall}
  onBack={() => navigate('/data')}
  isMobile={isMobile}
  sidebarWidth={SIDEBAR_WIDTH}
/>`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Cobalt (handle time, inbound, score bars)', hex: '#1779F7' },
        { name: 'Green (compliance, done, positive sentiment)', hex: '#4BA373' },
        { name: 'Amber (warning events, medium priority, low scores)', hex: '#F59E0B' },
        { name: 'Red (alert events, negative sentiment, low scores)', hex: '#EF4444' },
        { name: 'Coral (brand, comments badge)', hex: '#FF7056' },
      ],
      subComponents: ['CallSummarySection', 'QuickStatsRow', 'MetricCell', 'CallMetricsSection', 'AgentEvaluationSection', 'MonitoredEventsSection', 'TranscriptionSection', 'CustomerSection', 'SectionCard', 'SectionHeader', 'OutlineBtn', 'IconBtn'],
      notes: [
        'Topic title derived from first 6 words of call.summary',
        'URL routing: /data/explore/:id — App.jsx saves call to sessionStorage on navigate',
        'Back button calls onBack() → navigate("/data") via history.pushState',
        'All sections are independently collapsible',
        'Tags, transcript, metrics, events — all static mock; connect to API per call.id',
      ],
    },
  },

  CallSummarySection: {
    tier: 'Molecule',
    description: 'AI-generated summary of the call with a Show/Hide tags toggle revealing key→value tag pairs. Four action icons: Comment, Like, Copy, Edit. Text truncates at 200 chars with "Show all" expand.',
    props: [
      { name: 'call', type: 'object', default: '{ summary: string, …}' },
    ],
    states: [
      {
        label: 'Tags hidden',
        preview: () => containedPreview(
          <div style={{ padding: 16, background: 'var(--bg-canvas)' }}>
            <ExplorePage call={{ id: 'x', callDate: 'Mar 15, 2023', summary: 'Customer contacted enterprise support ahead of Q2 renewal to discuss volume discount tiers.', status: 'IN PROGRESS', priority: 'HIGH', callType: 'inbound', assignedTo: { name: 'Sarah Chen', initials: 'SC', color: 'blue' } }} onBack={() => {}} isMobile={false} sidebarWidth={0} />
          </div>, 500,
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage — no standalone usage
// Tags toggled via showTags state (useState)
// data-inspector="CallSummarySection"`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [{ name: 'Cobalt (Show tags active, Show all link)', hex: '#1779F7' }],
      subComponents: ['SectionCard', 'SectionHeader', 'IconBtn', 'TagPill'],
      notes: [
        'Tags: key pill (neutral bg) + value pill (blue tint) rendered as adjacent spans',
        'Truncation threshold: 200 chars — controlled by expanded state',
        '"Show all" / "Show less" inline toggle at end of paragraph',
      ],
    },
  },

  QuickStatsRow: {
    tier: 'Molecule',
    description: '4-up stat card strip sitting between CallSummarySection and CallMetricsSection. Cards: Handle Time (blue), Overall Sentiment (neutral), Compliance (green), Agent Score (amber/green). Each has a colored icon bubble, uppercase label, bold value.',
    props: [
      { name: 'call', type: 'object', default: 'row data' },
    ],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, width: 440 }}>
            {[
              { icon: '⏱', label: 'Handle Time',      value: '22 mins',  color: '#1779F7', bg: 'rgba(23,121,247,0.08)' },
              { icon: '🙂', label: 'Overall Sentiment',value: 'Neutral',  color: '#606060', bg: 'var(--bg-active)' },
              { icon: '🛡', label: 'Compliance',       value: '91/100',   color: '#4BA373', bg: 'rgba(75,163,115,0.08)' },
              { icon: '⭐', label: 'Agent Score',      value: '76/100',   color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Byrd',sans-serif" }}>{s.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: s.color, fontFamily: "'Byrd',sans-serif", lineHeight: 1 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage
// data-inspector="QuickStatsRow"
<QuickStatsRow call={call} />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (handle time)',    hex: '#1779F7' },
        { name: 'Green (compliance)',      hex: '#4BA373' },
        { name: 'Amber (agent score mid)', hex: '#F59E0B' },
      ],
      subComponents: [],
      notes: ['Icon bubble tint matches value color at 8% opacity', 'Values are static mock — wire to call.metrics in production'],
    },
  },

  MetricCell: {
    tier: 'Atom',
    description: 'Single metric cell used inside CallMetricsSection. Uppercase label, bold value, info ⓘ icon with a fixed-position tooltip. Hover fades background to --bg-active with a subtle box-shadow lift.',
    props: [
      { name: 'label',   type: 'string', default: '"Handle time"' },
      { name: 'value',   type: 'string', default: '"22 mins"'     },
      { name: 'tooltip', type: 'string', default: '"Description…"'},
    ],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 340 }}>
            {[
              { label: 'Relevant call?',   value: 'Yes',                   tip: 'Whether this call was relevant to an active opportunity' },
              { label: 'Requested Service',value: 'Volume discount',        tip: 'The type of service the customer requested' },
              { label: 'Lead status',      value: 'Active negotiation',     tip: 'The lead status outcome associated with this call' },
              { label: 'Handle time',      value: '22 mins',                tip: 'Total duration from call start to resolution' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 9 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5, fontFamily: "'Byrd',sans-serif" }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>{m.value}</div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    snippet: () => `<MetricCell label="Handle time" value="22 mins" tooltip="Total duration from call start to resolution" />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      subComponents: ['MetricTooltip'],
      notes: [
        'Hover: background → --bg-active + box-shadow 0 1px 4px rgba(0,0,0,0.07)',
        'Tooltip: position:fixed anchored to ⓘ icon via getBoundingClientRect',
        'data-inspector="MetricCell"',
      ],
    },
  },

  AgentEvaluationSection: {
    tier: 'Molecule',
    description: 'Agent card (avatar, name, role, avg score pill) flanked by two columns of ScoreBars — Sales Techniques and Professionalism. Bars use color-tinted tracks: blue ≥70, amber ≥40, red <40. Score shown in matching color.',
    props: [
      { name: 'call', type: 'object', default: '{ assignedTo: { name, initials, color } }' },
    ],
    states: [
      {
        label: 'High scores',
        preview: () => center(
          <div style={{ display: 'flex', gap: 14, width: 440, padding: 4 }}>
            <div style={{ width: 100, background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 10px' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#418FF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Byrd',sans-serif", boxShadow: '0 0 0 3px #418FF430' }}>SC</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Sarah Chen</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif", marginTop: 2 }}>Agent operating</div>
              </div>
              <div style={{ padding: '2px 9px', borderRadius: 99, background: 'rgba(75,163,115,0.15)', border: '1px solid rgba(75,163,115,0.35)', fontSize: 11, fontWeight: 700, color: '#4BA373', fontFamily: "'Byrd',sans-serif" }}>82/100</div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              {[['Identifying Opps', 91], ['Handling Objections', 78], ['Persuasion', 84], ['Sense of Urgency', 52]].map(([l, s]) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{l}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: s >= 70 ? '#1779F7' : s >= 40 ? '#F59E0B' : '#EF4444', fontFamily: "'Byrd',sans-serif" }}>{s}</span>
                  </div>
                  <div style={{ height: 5, background: s >= 70 ? 'rgba(23,121,247,0.1)' : 'rgba(245,158,11,0.12)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${s}%`, background: s >= 70 ? '#1779F7' : '#F59E0B', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage
// data-inspector="AgentEvaluationSection"
<AgentEvaluationSection call={call} />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (score ≥70)', hex: '#1779F7' },
        { name: 'Amber (score ≥40)',  hex: '#F59E0B' },
        { name: 'Red (score <40)',    hex: '#EF4444' },
      ],
      subComponents: ['SectionCard', 'SectionHeader', 'ScoreBar', 'OutlineBtn'],
      notes: [
        'Average score computed from all 8 metrics — shown as pill in agent card',
        'Agent card bg: flat --bg-canvas (gradient was removed)',
        'SALES_METRICS and PROF_METRICS are module-level constants — replace with API data',
      ],
    },
  },

  MonitoredEventsSection: {
    tier: 'Molecule',
    description: 'List of AI-detected alert events for the call. Each row has a severity-coded left border (amber = warning, red = alert), icon, description text, and a "Give feedback" button. Collapsible.',
    props: [],
    states: [
      {
        label: 'Default (3 events)',
        preview: () => center(
          <div style={{ width: 440, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Agent did not confirm next steps before closing the call.', sev: 'warning' },
              { text: 'Customer mentioned a competitor — CompetitorAlert triggered.', sev: 'warning' },
              { text: 'Call duration exceeded 20-minute SLA threshold.', sev: 'alert' },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: ev.sev === 'alert' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)', border: `1px solid ${ev.sev === 'alert' ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.22)'}`, borderLeft: `3px solid ${ev.sev === 'alert' ? '#EF4444' : '#F59E0B'}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 13 }}>⚠</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{ev.text}</span>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage
// data-inspector="MonitoredEventsSection"
<MonitoredEventsSection />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [
        { name: 'Amber (warning severity)', hex: '#F59E0B' },
        { name: 'Red (alert severity)',     hex: '#EF4444' },
      ],
      subComponents: ['SectionCard', 'SectionHeader', 'OutlineBtn'],
      notes: [
        'severity: "warning" → amber left-border + amber bg tint',
        'severity: "alert" → red left-border + red bg tint',
        'MOCK_EVENTS is a module constant — replace with call.events from API',
      ],
    },
  },

  TranscriptionSection: {
    tier: 'Molecule',
    description: 'Chat-bubble transcript view. Agent lines align left (neutral bg), customer lines align right (blue-tinted bg). Mini avatar dots distinguish speakers. Timestamps shown below each bubble. Scrollable, max-height 300px.',
    props: [],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { speaker: 'Agent',    time: '0:08', text: 'Good morning, this is Sarah from enterprise support. How can I help you?' },
              { speaker: 'Customer', time: '0:15', text: "Hi, I'm calling about our Q2 renewal — we're looking to expand to 500 seats." },
              { speaker: 'Agent',    time: '0:38', text: 'Congratulations on the growth! For 500+ seats you qualify for the Enterprise tier with a 15% volume discount.' },
            ].map((line, i) => {
              const isAgent = line.speaker === 'Agent'
              return (
                <div key={i} style={{ display: 'flex', flexDirection: isAgent ? 'row' : 'row-reverse', gap: 9, alignItems: 'flex-end' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: isAgent ? '#1779F7' : 'var(--bg-active)', border: `1px solid ${isAgent ? 'transparent' : 'var(--border-default)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: isAgent ? '#fff' : 'var(--text-muted)', fontFamily: "'Byrd',sans-serif" }}>{isAgent ? 'A' : 'C'}</div>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ padding: '8px 12px', background: isAgent ? 'var(--bg-active)' : 'rgba(23,121,247,0.07)', border: `1px solid ${isAgent ? 'var(--border-default)' : 'rgba(23,121,247,0.2)'}`, borderRadius: isAgent ? '11px 11px 11px 3px' : '11px 11px 3px 11px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif", lineHeight: 1.5 }}>{line.text}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3, textAlign: isAgent ? 'left' : 'right', paddingLeft: isAgent ? 4 : 0, paddingRight: isAgent ? 0 : 4, fontFamily: "'Byrd',sans-serif" }}>{line.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage
// data-inspector="TranscriptionSection"
<TranscriptionSection />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [{ name: 'Cobalt (customer bubble tint)', hex: '#1779F7' }],
      subComponents: ['SectionCard', 'SectionHeader'],
      notes: [
        'Agent: left-aligned, neutral bg, blue avatar dot',
        'Customer: right-aligned, blue-tinted bg, grey avatar dot',
        'Border radius: tail corner is 3px, rest 11–12px to create chat-bubble shape',
        'TRANSCRIPT_LINES is a module constant — replace with call.transcript from API',
      ],
    },
  },

  CustomerSection: {
    tier: 'Molecule',
    description: 'Call history table for the customer. Columns: Agent (avatar + name), Sentiment (colored badge), Topic, Call Date, Call (Open link). Current call highlighted in blue. Rows have hover background. Collapsible.',
    props: [],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ width: 460, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Customer</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Agent', 'Sentiment', 'Topic', 'Date', 'Call'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'left', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-canvas)', fontFamily: "'Byrd',sans-serif", whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sarah Chen', initials: 'SC', color: '#418FF4', sentiment: 'Positive', sentColor: '#4BA373', sentBg: 'rgba(75,163,115,0.12)', topic: 'Enterprise renewal — Q2', date: 'Mar 15', current: true },
                  { name: 'Marcus Webb', initials: 'MW', color: '#6AB18A', sentiment: 'Neutral', sentColor: '#606060', sentBg: 'var(--bg-active)', topic: 'Onboarding follow-up', date: 'Jan 22', current: false },
                ].map((row, i) => (
                  <tr key={i} style={{ background: row.current ? 'rgba(23,121,247,0.05)' : 'transparent' }}>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 25, height: 25, borderRadius: '50%', background: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: "'Byrd',sans-serif" }}>{row.initials}</div>
                        <span style={{ fontSize: 12, color: row.current ? '#1779F7' : 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 99, fontSize: 11, fontWeight: 500, background: row.sentBg, color: row.sentColor, fontFamily: "'Byrd',sans-serif" }}>{row.sentiment}</span>
                    </td>
                    <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif", borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>{row.topic}</td>
                    <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif", borderBottom: '1px solid var(--border-default)' }}>{row.date}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)' }}>
                      <span style={{ fontSize: 12, fontWeight: row.current ? 600 : 400, color: row.current ? '#1779F7' : 'var(--text-muted)', textDecoration: row.current ? 'underline' : 'none', fontFamily: "'Byrd',sans-serif" }}>Open</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage
// data-inspector="CustomerSection"
<CustomerSection />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (current row, Open link)', hex: '#1779F7' },
        { name: 'Green (positive sentiment)',      hex: '#4BA373' },
        { name: 'Red (negative sentiment)',        hex: '#EF4444' },
      ],
      subComponents: ['SectionCard', 'SectionHeader', 'OutlineBtn'],
      notes: [
        'current: true row → blue highlight bg + blue agent name + underlined Open link',
        'Sentiment badge: colored pill — Positive (green), Negative (red), Neutral (grey)',
        'Row hover: background → --bg-active via onMouseEnter/Leave',
        'CUSTOMER_HISTORY is a module constant — replace with API customer call history',
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

  // ── ReportRow ───────────────────────────────────────────────────────────────

  ReportRow: {
    tier: 'Molecule',
    description: 'Single row in the Reports list view. Status badge + truncated ID + name + trend snippet + schedule pill. 3px left border slides in on hover, colored by status.',
    props: [
      { name: 'report', type: 'Report', default: 'required' },
      { name: 'index',  type: 'number', default: 'required' },
    ],
    states: [
      { label: 'AI Generated', props: {} },
      { label: 'Completed',    props: {} },
      { label: 'Failed',       props: {} },
      { label: 'Running',      props: {} },
      { label: 'Not Executed', props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      180,
    ),
    snippet: () => `<ReportRow report={report} index={index} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'AI Generated', hex: '#FF7056' },
        { name: 'Failed',       hex: '#DC2626' },
        { name: 'Running/Done', hex: '#4BA373' },
      ],
      subComponents: ['ReportStatusBadge', 'SchedulePill'],
      notes: [
        'borderLeft color transitions transparent → status color on hover',
        'More button fades in (opacity 0→1) on hover',
        'Defined inline in ReportsPage.jsx',
      ],
    },
  },

  // ── ReportCard ──────────────────────────────────────────────────────────────

  ReportCard: {
    tier: 'Molecule',
    description: 'Grid view card for a single report. Status-colored top border, glow box-shadow on hover, 2-line clamped trend text.',
    props: [
      { name: 'report', type: 'Report', default: 'required' },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      180,
    ),
    snippet: () => `<ReportCard report={report} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'AI Generated', hex: '#FF7056' },
        { name: 'Failed',       hex: '#DC2626' },
        { name: 'Running/Done', hex: '#4BA373' },
      ],
      subComponents: ['ReportStatusBadge', 'SchedulePill'],
      notes: [
        'borderTop always shows status color',
        'border-color + box-shadow glow transitions on hover',
        'trend text clamped to 2 lines via -webkit-line-clamp',
        'Defined inline in ReportsPage.jsx',
      ],
    },
  },

  // ── ReportStatusBadge ───────────────────────────────────────────────────────

  ReportStatusBadge: {
    tier: 'Atom',
    description: '5-state report status badge. AI Generated (coral + sparkle icon), Running / Completed (green tinted), Failed (red), Not Executed (muted).',
    props: [
      { name: 'status', type: "'ai-generated'|'running'|'completed'|'failed'|'not-executed'", default: 'required' },
    ],
    states: [
      { label: 'AI Generated', props: { status: 'ai-generated' } },
      { label: 'Running',      props: { status: 'running'      } },
      { label: 'Completed',    props: { status: 'completed'    } },
      { label: 'Failed',       props: { status: 'failed'       } },
      { label: 'Not Executed', props: { status: 'not-executed' } },
    ],
    render: (p) => center((() => {
      const STATUS_STYLES = {
        'ai-generated': { bg: 'rgba(255,112,86,0.12)', border: 'rgba(255,112,86,0.28)', color: 'var(--c100)', label: '✦ AI Generated' },
        'running':      null,
        'completed':    null,
        'failed':       { bg: 'rgba(220,38,38,0.10)',  border: 'rgba(220,38,38,0.28)',  color: '#DC2626',      label: 'FAILED' },
        'not-executed': { bg: 'var(--bg-active)',       border: 'var(--border-input)',   color: 'var(--text-muted)', label: 'NOT EXECUTED' },
      }
      const s = STATUS_STYLES[p.status]
      if (!s) return <Badge variant="tinted" color={p.status === 'running' ? 'green' : 'green'}>{p.status === 'running' ? 'Running' : 'Completed'}</Badge>
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 999, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 11, fontWeight: 600, fontFamily: "'Byrd', sans-serif", letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
          {s.label}
        </span>
      )
    })()),
    snippet: (p) => `<StatusBadge status="${p.status}" />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'AI Generated bg', hex: 'rgba(255,112,86,0.12)' },
        { name: 'Failed bg',       hex: 'rgba(220,38,38,0.10)'  },
        { name: 'Failed text',     hex: '#DC2626'               },
      ],
      subComponents: [],
      notes: ['Defined inline in ReportsPage.jsx — not a standalone file'],
    },
  },

  // ── SchedulePill ────────────────────────────────────────────────────────────

  SchedulePill: {
    tier: 'Atom',
    description: 'Small uppercase rect pill showing report recurrence. Daily / Weekly / Monthly / On demand.',
    props: [
      { name: 'label', type: 'string', default: "'Daily'" },
    ],
    states: [
      { label: 'Daily',     props: { label: 'Daily'     } },
      { label: 'Weekly',    props: { label: 'Weekly'    } },
      { label: 'Monthly',   props: { label: 'Monthly'   } },
      { label: 'On demand', props: { label: 'On demand' } },
    ],
    render: (p) => center(
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 4, background: 'var(--bg-active)', border: '1px solid var(--border-input)', color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, fontFamily: "'Byrd', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {p.label}
      </span>
    ),
    snippet: (p) => `<SchedulePill label="${p.label}" />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: [],
      notes: ['Defined inline in ReportsPage.jsx — not a standalone file'],
    },
  },

  // ── ReportStatusTabs ────────────────────────────────────────────────────────

  ReportStatusTabs: {
    tier: 'Molecule',
    description: 'Filter tab bar for the Reports page. All / AI Generated / Running / Completed / Failed / Not Executed — each with a live count badge.',
    props: [
      { name: 'active',   type: 'string',     default: "'all'" },
      { name: 'onChange', type: '() => void', default: 'required' },
      { name: 'counts',   type: 'object',     default: 'required' },
    ],
    states: [
      { label: 'All active',    props: { active: 'all',    onChange: () => {}, counts: { all: 22, 'ai-generated': 3, running: 1, completed: 5, failed: 7, 'not-executed': 6 } } },
      { label: 'Failed active', props: { active: 'failed', onChange: () => {}, counts: { all: 22, 'ai-generated': 3, running: 1, completed: 5, failed: 7, 'not-executed': 6 } } },
    ],
    render: (p) => center(
      <div style={{ background: 'var(--bg-sidebar)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-input)', display: 'flex', gap: 2 }}>
        {['All', 'AI Generated', 'Running', 'Completed', 'Failed', 'Not Executed'].map(label => {
          const key = label.toLowerCase().replace(/ /g, '-')
          const isActive = p.active === (key === 'all' ? 'all' : key)
          const count = p.counts[key === 'all' ? 'all' : key]
          return (
            <button key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 6, background: isActive ? 'var(--bg-active)' : 'transparent', border: isActive ? '1px solid var(--border-default)' : '1px solid transparent', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 12, fontWeight: isActive ? 600 : 400, fontFamily: "'Byrd', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {label}
              {count > 0 && <span style={{ minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99, background: isActive ? 'var(--border-default)' : 'var(--bg-active)', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{count}</span>}
            </button>
          )
        })}
      </div>
    ),
    snippet: () => `<StatusTabs active={statusFilter} onChange={setStatus} counts={counts} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: [],
      notes: ['Count badge hidden when count is 0', 'Active tab: bg-active + border-default'],
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
