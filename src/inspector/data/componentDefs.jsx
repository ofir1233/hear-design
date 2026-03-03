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

// Raw source imports — Vite ?raw gives the file content as a plain string.
// Used in the handoff panel so developers can copy the full implementation.
import ButtonSrc     from '../../components/Button.jsx?raw'
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
    description: '4 variants × 3 sizes. Loading spinner, disabled state, icon-only mode.',
    props: [
      { name: 'variant',   type: "'primary'|'secondary'|'ghost'|'danger'", default: "'primary'" },
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
        { name: 'Primary bg',  hex: '#007AFF' },
        { name: 'Danger bg',   hex: '#EF4444' },
        { name: 'Ghost text',  hex: '#374151' },
        { name: 'White text',  hex: '#FFFFFF' },
      ],
      subComponents: [],
      notes: [
        'Spinner uses btn-spin keyframe (border-top-color animation)',
        'Hover/active adjust background via onMouseEnter/Leave handlers directly',
      ],
    },
  },

  // ── Badge ──────────────────────────────────────────────────────────────────

  Badge: {
    tier: 'Atom',
    description: '3 variants × 2 shapes. Outline for @ mentions, subtle/solid for status tags.',
    props: [
      { name: 'variant',   type: "'outline'|'subtle'|'solid'", default: "'outline'" },
      { name: 'shape',     type: "'pill'|'rect'",               default: "'pill'" },
      { name: 'uppercase', type: 'boolean',                      default: 'auto (per variant)' },
      { name: 'style',     type: 'CSSProperties',                default: 'undefined' },
    ],
    states: [
      { label: 'Outline',       props: { variant: 'outline', children: 'mention' } },
      { label: 'Subtle',        props: { variant: 'subtle',  children: 'Beta',   style: { background: 'rgba(24,24,24,0.6)' } } },
      { label: 'Solid',         props: { variant: 'solid',   children: 'Dev',    style: { background: '#374151' } } },
      { label: 'Rect outline',  props: { variant: 'outline', shape: 'rect', children: 'Label' } },
      { label: 'No uppercase',  props: { variant: 'subtle',  uppercase: false, children: 'lowercase', style: { background: 'rgba(24,24,24,0.6)' } } },
    ],
    render: (p) => {
      const darkBg = p.variant === 'subtle' || p.variant === 'solid'
      return center(<Badge {...p} />, darkBg ? '#1C1C1C' : 'transparent')
    },
    snippet: (p) => {
      const attrs = [`variant="${p.variant}"`]
      if (p.shape && p.shape !== 'pill') attrs.push(`shape="${p.shape}"`)
      if (p.uppercase !== undefined) attrs.push(`uppercase={${p.uppercase}}`)
      return `<Badge ${attrs.join(' ')}>\n  ${p.children ?? ''}\n</Badge>`
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
        width: '100vw', height: '100vh',
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
      { label: 'Default',     props: {} },
      { label: 'Custom badge', props: { badge: 'Beta' } },
    ],
    render: (p) => (
      <div style={{ background: '#000', padding: '28px 24px', minHeight: 80 }}>
        <SignInHero {...p} />
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
}
