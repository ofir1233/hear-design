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
import Sidebar    from '../../lab/components/Sidebar.jsx'
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
import ReportsPage        from '../../components/reports/ReportsPage.jsx'
import CreateReportPage, {
  Toggle        as CRToggle,
  ChoiceGroup   as CRChoiceGroup,
  Tag           as CRTag,
  Section       as CRSection,
  Field         as CRField,
  ToggleRow     as CRToggleRow,
} from '../../components/reports/CreateReportPage.jsx'
import AgentEvalPage from '../../components/agent-eval/AgentEvalPage.jsx'
import { SCHEMAS }   from '../../components/data/mockData.js'

// Raw source imports — Vite ?raw gives the file content as a plain string.
// Used in the handoff panel so developers can copy the full implementation.
import ButtonSrc     from '../../components/Button.jsx?raw'
import ModalSrc      from '../../components/Modal.jsx?raw'
import BadgeSrc      from '../../components/Badge.jsx?raw'
import HearLogoSrc   from '../../components/HearLogo.jsx?raw'
import ChatBubbleSrc from '../../components/ChatBubble.jsx?raw'
import ChatInputSrc  from '../../components/ChatInput.jsx?raw'
import SidebarSrc    from '../../lab/components/Sidebar.jsx?raw'
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
import ReportsPageSrc       from '../../components/reports/ReportsPage.jsx?raw'
import CreateReportPageSrc  from '../../components/reports/CreateReportPage.jsx?raw'
import AgentEvalPageSrc           from '../../components/agent-eval/AgentEvalPage.jsx?raw'
import NotificationsPopoverSrc    from '../../lab/components/NotificationsPopover.jsx?raw'

import SignalsPage        from '../../components/signals/SignalsPage.jsx'
import CreateSignalPage   from '../../components/signals/CreateSignalPage.jsx'
import SignalsPageSrc       from '../../components/signals/SignalsPage.jsx?raw'
import CreateSignalPageSrc  from '../../components/signals/CreateSignalPage.jsx?raw'

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

  // ── NavItem ────────────────────────────────────────────────────────────────

  NavItem: {
    tier: 'Atom',
    description: 'Single navigation button in the Sidebar. Active state: cobalt tint bg + cobalt text. Inactive: transparent bg + text-secondary. 13 items total: Chat, Data, Reports, Signals, Alerts, Agent Evaluation, Knowledge, Magic API, AI Tasks, Customers, Actions, Marketplace, Settings.',
    props: [
      { name: 'label',    type: 'string',  default: 'required' },
      { name: 'active',   type: 'boolean', default: 'false' },
    ],
    states: [
      { label: 'Chat — active',            props: { _label: 'Chat',             _active: true  } },
      { label: 'Chat — inactive',          props: { _label: 'Chat',             _active: false } },
      { label: 'Data — active',            props: { _label: 'Data',             _active: true  } },
      { label: 'Reports — active',         props: { _label: 'Reports',          _active: true  } },
      { label: 'Signals — active',         props: { _label: 'Signals',          _active: true  } },
      { label: 'Alerts — active',          props: { _label: 'Alerts',           _active: true  } },
      { label: 'Agent Evaluation — active',props: { _label: 'Agent Evaluation', _active: true  } },
      { label: 'Knowledge — active',       props: { _label: 'Knowledge',        _active: true  } },
      { label: 'Magic API — active',       props: { _label: 'Magic API',        _active: true  } },
      { label: 'AI Tasks — active',        props: { _label: 'AI Tasks',         _active: true  } },
      { label: 'Customers — active',       props: { _label: 'Customers',        _active: true  } },
      { label: 'Settings — active',        props: { _label: 'Settings',         _active: true  } },
      { label: 'All items — inactive',     props: { _label: 'all',              _active: false } },
    ],
    render: (p) => {
      const NAV_LABELS = ['Chat', 'Data', 'Reports', 'Signals', 'Alerts', 'Agent Evaluation', 'Knowledge', 'Magic API', 'AI Tasks', 'Customers', 'Actions', 'Marketplace', 'Settings']
      const items = p._label === 'all' ? NAV_LABELS : [p._label]
      return (
        <div style={{ padding: '12px 16px', background: 'var(--bg-sidebar, #F5F5F3)', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map(label => {
            const active = p._label !== 'all' && p._active
            return (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                background: active ? 'rgba(91,163,255,0.12)' : 'transparent',
                color: active ? '#5BA3FF' : 'var(--text-secondary)',
                fontSize: 13.5, fontWeight: 400,
              }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, background: active ? 'rgba(91,163,255,0.3)' : 'rgba(96,96,96,0.2)', flexShrink: 0 }} />
                {label}
              </div>
            )
          })}
        </div>
      )
    },
    snippet: () => `// Internal to Sidebar — rendered via NAV_ITEMS.map()\n// Active state controlled by activeNav prop on Sidebar\nconst NAV_ITEMS = [\n  { id: 'dashboard',   label: 'Chat',             Icon: HomeIcon },\n  { id: 'data',        label: 'Data',             Icon: DataIcon },\n  { id: 'reports',     label: 'Reports',          Icon: ReportsIcon },\n  // ... 10 more\n]`,
    breakdown: {
      colors: [
        { name: 'Active bg',   hex: '#5BA3FF' },
        { name: 'Active text', hex: '#5BA3FF' },
      ],
      notes: [
        'Defined inline in Sidebar.jsx — not a standalone exported component',
        'Active: rgba(91,163,255,0.12) bg + #5BA3FF text',
        'Inactive: transparent bg + var(--text-secondary)',
        'Hover: var(--bg-active) background',
        '13 items rendered via NAV_ITEMS array — see Sidebar source',
      ],
    },
  },

  // ── SessionItem ────────────────────────────────────────────────────────────

  SessionItem: {
    tier: 'Molecule',
    description: 'Single chat history row in the Sidebar History section. Shows session title with a typewriter animation when newly named. 3-dot menu (Rename, Share, Delete) appears on hover. Rename mode replaces title with an inline input.',
    props: [
      { name: 'session',      type: 'object',  default: 'required' },
      { name: 'isActive',     type: 'boolean', default: 'false' },
      { name: 'isNewlyNamed', type: 'boolean', default: 'false' },
      { name: 'onSelect',     type: '() => void', default: 'required' },
      { name: 'onDelete',     type: '() => void', default: 'required' },
      { name: 'onRename',     type: '() => void', default: 'required' },
      { name: 'onShare',      type: '() => void', default: 'required' },
    ],
    states: [
      { label: 'Default',         props: { _state: 'default'  } },
      { label: 'Active',          props: { _state: 'active'   } },
      { label: 'Pending (new)',   props: { _state: 'pending'  } },
      { label: 'Menu open',       props: { _state: 'menu'     } },
      { label: 'Renaming',        props: { _state: 'renaming' } },
    ],
    render: (p) => {
      const state = p._state || 'default'
      const isActive  = state === 'active'
      const isPending = state === 'pending'
      const isMenu    = state === 'menu'
      const isRename  = state === 'renaming'
      const title = isPending ? '' : 'Q4 agent performance review'

      const row = (
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          padding: '7px 12px', borderRadius: 8, gap: 8,
          background: isActive ? 'rgba(91,163,255,0.10)' : 'transparent',
          color: isActive ? '#5BA3FF' : 'var(--text-secondary)',
        }}>
          {/* Title / input */}
          {isRename ? (
            <input
              readOnly
              defaultValue="Q4 agent performance review"
              style={{
                flex: 1, fontSize: 13, background: 'var(--bg-canvas)',
                border: '1px solid #5BA3FF', borderRadius: 6,
                padding: '2px 6px', color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          ) : (
            <span style={{
              flex: 1, fontSize: 13, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: isPending ? 'var(--text-muted)' : 'inherit',
              fontStyle: isPending ? 'italic' : 'normal',
            }}>
              {isPending ? 'Generating title…' : title}
            </span>
          )}
          {/* Dots button */}
          {(state === 'default' || isActive) && (
            <div style={{ opacity: 0.5, fontSize: 16, lineHeight: 1, letterSpacing: 2 }}>···</div>
          )}
          {/* Menu open */}
          {isMenu && (
            <div style={{ opacity: 1, fontSize: 16, lineHeight: 1, letterSpacing: 2, color: 'var(--text-primary)' }}>···</div>
          )}
        </div>
      )

      if (!isMenu) return (
        <div style={{ padding: '6px 8px', background: 'var(--bg-sidebar, #F5F5F3)' }}>
          {row}
        </div>
      )

      return (
        <div style={{ padding: '6px 8px', background: 'var(--bg-sidebar, #F5F5F3)', position: 'relative' }}>
          {row}
          <div style={{
            marginTop: 4, marginLeft: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          }}>
            {['Rename', 'Share', 'Delete'].map((action, i) => (
              <div key={action} style={{
                padding: '9px 12px', fontSize: 12.5, cursor: 'pointer',
                color: action === 'Delete' ? '#E05252' : 'var(--text-secondary)',
                borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {action}
              </div>
            ))}
          </div>
        </div>
      )
    },
    snippet: () => `// Internal to Sidebar — rendered in the History section\n<SessionItem\n  session={session}\n  isActive={session.id === activeSessionId}\n  isNewlyNamed={session.id === newlyNamedId}\n  onSelect={() => onSelectSession(session.id)}\n  onDelete={() => onDeleteSession(session.id)}\n  onRename={(id, title) => onRenameSession(id, title)}\n  onShare={onShareSession}\n/>`,
    breakdown: {
      notes: [
        'Defined inside Sidebar.jsx — not a standalone exported component',
        'Pending state: empty session.title → shows "Generating title…" italic',
        'Typewriter animation: useTypewriter hook activates when isNewlyNamed=true',
        '3-dot menu: position:fixed, anchored to dotsRef.getBoundingClientRect()',
        'Rename: inline <input> replaces title span, commits on blur/Enter',
        'Share: fires onShare(session.id) — wires into NotificationsPopover pipeline',
      ],
    },
  },

  // ── Sidebar ────────────────────────────────────────────────────────────────

  Sidebar: {
    tier: 'Organism',
    description: '13-item floating navigation sidebar (Lab). Floats 16px from top/left/bottom with 16px border radius and subtle outline. Draggable divider above History lets you clip nav items. Collapsible on desktop, full-screen drawer on mobile.',
    props: [
      { name: 'isMobile',      type: 'boolean',    default: 'false' },
      { name: 'mobileOpen',    type: 'boolean',    default: 'false' },
      { name: 'onMobileClose', type: '() => void', default: 'undefined' },
      { name: 'collapsed',     type: 'boolean',    default: 'false' },
    ],
    states: [
      { label: 'Desktop open',     props: { isMobile: false, collapsed: false } },
      { label: 'Desktop collapsed', props: { isMobile: false, collapsed: true } },
      { label: 'Mobile open',      props: { isMobile: true, mobileOpen: true } },
      { label: 'Mobile closed',    props: { isMobile: true, mobileOpen: false } },
    ],
    // contain:paint makes position:fixed children relative to this box
    render: (p) => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transform: 'scale(0.62)', transformOrigin: 'top left',
        width: 320, height: '100vh',
        pointerEvents: 'none',
      }}>
        <Sidebar {...p} onMobileClose={() => {}} />
      </div>,
      172,
    ),
    snippet: () =>
      `<Sidebar\n  isMobile={isMobile}\n  mobileOpen={sidebarOpen}\n  onMobileClose={() => setSidebarOpen(false)}\n  collapsed={sidebarCollapsed}\n  onToggleCollapse={() => setSidebarCollapsed(c => !c)}\n/>`,
    source: SidebarSrc,
    files: [
      { path: 'src/lab/components/Sidebar.jsx',  src: SidebarSrc },
      { path: 'src/components/HearLogo.jsx',     src: HearLogoSrc },
      { path: 'src/components/icons/index.jsx',  src: IconsSrc },
    ],
    npm: [],
    breakdown: {
      icons: [
        'HomeIcon (Chat)', 'DataIcon', 'ReportsIcon', 'SignalsIcon', 'AlertsIcon',
        'AgentIcon', 'KnowledgeIcon', 'MagicApiIcon (inline)', 'AiTaskIcon',
        'CustomersIcon', 'ActionsIcon (inline)', 'MarketplaceIcon (inline)',
        'SettingsIcon', 'BellIcon', 'ChevronIcon', 'CollapseArrow',
        'DotsIcon', 'MoonIcon', 'AccessibilityIcon', 'LogoutIcon',
      ],
      colors: [
        { name: '--bg-sidebar',      hex: '#F5F5F3' },
        { name: '--bg-active',       hex: '#E8E8E6' },
        { name: '--text-primary',    hex: '#181818' },
        { name: '--text-secondary',  hex: '#606060' },
        { name: '--border-default',  hex: '#E5E7EB' },
        { name: '--sidebar-outline', hex: 'rgba(0,0,0,0.08)' },
        { name: '--color-brand',     hex: '#FF7056' },
      ],
      subComponents: ['HearLogo', 'NavItem', 'SessionItem'],
      notes: [
        'LAB VERSION — lives in src/lab/components/Sidebar.jsx',
        'Floating: position fixed top:16 left:16 height:calc(100vh-32px)',
        'Panel: borderRadius:16 + boxShadow outline via --sidebar-outline token',
        'Nav: Chat, Data, Reports, Signals, Alerts, Agent Evaluation, Knowledge, Magic API, AI Tasks, Customers, Actions, Marketplace, Settings',
        'Draggable divider above History: drag up/down to clip visible nav items',
        'MagicApiIcon / ActionsIcon / MarketplaceIcon defined inline (not in icons/index.jsx)',
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
      subComponents: ['CallSummarySection', 'QuickStatsRow', 'CallMetricsSection', 'MetricCell', 'AgentEvaluationSection', 'ScoreBar', 'MonitoredEventsSection', 'TranscriptionSection', 'CustomerSection', 'SectionCard', 'SectionHeader', 'OutlineBtn', 'IconBtn'],
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
    description: 'AI-generated call summary with an animated Show/Hide tags toggle (grid-template-rows expand + opacity/translateY fade). Four ChatBubble-style action icons (no border/bg, hover → bg-active): Comment, Like, Copy, Edit. Text truncates at 200 chars with an inline "Show all / Show less" toggle.',
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
      {
        label: 'Tags visible',
        preview: () => center(
          <div style={{ width: 500, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Call summary</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 10px', background: 'rgba(23,121,247,0.08)', border: '1px solid rgba(23,121,247,0.3)', borderRadius: 7, fontSize: 11, color: '#1779F7', fontFamily: "'Byrd',sans-serif" }}>
                  Hide tags ▲
                </div>
              </div>
            </div>
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>
                Customer contacted enterprise support ahead of Q2 renewal…
              </p>
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif", textTransform: 'uppercase', marginBottom: 9 }}>TAGS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {[['Call_Type','Renewal Inquiry'],['Account_Tier','Enterprise'],['Region','EMEA'],['Renewal_Quarter','Q2 2023'],['Upsell_Flag','Premium Analytics']].map(([k,v],i) => (
                    <div key={i} style={{ display: 'inline-flex' }}>
                      <span style={{ height: 24, padding: '0 9px', borderRadius: '6px 0 0 6px', fontSize: 11, fontFamily: "'Byrd',sans-serif", border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>{k}</span>
                      <span style={{ height: 24, padding: '0 9px', borderRadius: '0 6px 6px 0', fontSize: 11, fontFamily: "'Byrd',sans-serif", border: '1px solid rgba(23,121,247,0.25)', background: 'rgba(23,121,247,0.07)', color: '#1779F7', display: 'inline-flex', alignItems: 'center' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
        'Tags panel: animated via grid-template-rows 0fr↔1fr (280ms spring) + opacity/translateY(-6px→0) fade',
        'Key pills: transparent bg + border only; value pills: cobalt tint at 7% opacity',
        'Action buttons (Comment/Like/Copy/Edit): ChatBubble style — background:none, border:none, padding:4px, hover→bg-active',
        'Truncation threshold: 200 chars — controlled by expanded state (separate from showTags)',
        '"Show all" / "Show less" inline toggle rendered at end of paragraph in cobalt',
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

  CallMetricsSection: {
    tier: 'Molecule',
    description: '2-column grid of MetricCells. Shows 6 primary metrics by default; "Show more" expands to 12. Collapsible via section header chevron. "Edit metrics" outline button in header.',
    props: [
      { name: 'call', type: 'object', default: 'row data from DataPage grid' },
    ],
    states: [
      {
        label: 'Default (6 metrics)',
        preview: () => center(
          <div style={{ width: 440 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['Relevant call?', 'Yes'],
                ['Requested Service', 'Volume discount & renewal'],
                ['Lead status', 'Active negotiation'],
                ['Direction', 'Inbound'],
                ['Deal size', '$5,364'],
                ['Handle time', '22 mins'],
              ].map(([l, v], i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 9 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5, fontFamily: "'Byrd',sans-serif" }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif", lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif", gap: 5 }}>
              Show more ▼
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to ExplorePage\n// data-inspector="CallMetricsSection"\n<CallMetricsSection call={call} />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      subComponents: ['SectionCard', 'SectionHeader', 'MetricCell', 'MetricTooltip', 'OutlineBtn'],
      notes: [
        'primaryMetrics (6 items) always shown; extraMetrics (6 more) revealed by "Show more"',
        '"Show more/less" button at bottom — no animation (no height transition currently)',
        'data-inspector="CallMetricsSection" on SectionCard root',
        'All metric values are static mock — wire to call.metrics object per call.id in production',
      ],
    },
  },

  ScoreBar: {
    tier: 'Atom',
    description: 'Labeled progress bar for a scored evaluation metric. Color-coded by threshold: ≥70 = cobalt, ≥40 = amber, <40 = red. Track uses matching color at low opacity. Width animates on mount.',
    props: [
      { name: 'label', type: 'string', default: '"Handling Objections"' },
      { name: 'score', type: 'number', default: '78' },
    ],
    states: [
      {
        label: 'All 3 thresholds',
        preview: () => center(
          <div style={{ width: 300 }}>
            {[['Identifying Opportunities', 91], ['Handling Objections', 78], ['Creating Urgency', 52], ['Call Reflection', 28]].map(([l, s]) => (
              <div key={l} style={{ marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{l}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s >= 70 ? '#1779F7' : s >= 40 ? '#F59E0B' : '#EF4444', fontFamily: "'Byrd',sans-serif", flexShrink: 0, marginLeft: 8 }}>
                    {s}<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 10 }}>/100</span>
                  </span>
                </div>
                <div style={{ height: 5, background: s >= 70 ? 'rgba(23,121,247,0.1)' : s >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s}%`, background: s >= 70 ? '#1779F7' : s >= 40 ? '#F59E0B' : '#EF4444', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    snippet: () => `<ScoreBar label="Identifying Sales Opportunities" score={91} />`,
    source: ExplorePageSrc,
    files: [{ path: 'src/components/data/ExplorePage.jsx', src: ExplorePageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (score ≥70)', hex: '#1779F7' },
        { name: 'Amber (score ≥40)',  hex: '#F59E0B' },
        { name: 'Red (score <40)',    hex: '#EF4444' },
      ],
      subComponents: [],
      notes: [
        'Bar width animates to score% on mount: 700ms cubic-bezier(0.22,1,0.36,1)',
        'Track bg: matching color at ~10–12% opacity',
        'Score suffix "/100" uses smaller muted text next to the colored score value',
        'Used in AgentEvaluationSection — SALES_METRICS and PROF_METRICS columns',
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
        'Sentiment badge: colored pill — Positive (green), Negative (red), Neutral (grey/muted)',
        'SENTIMENT_STYLE keys: Positive | Negative | Neutral — fallback not needed',
        'Row hover: background → --bg-active via onMouseEnter/Leave',
        'CUSTOMER_HISTORY is a module constant — replace with API customer call history',
      ],
    },
  },

  // ── ReportsPage ────────────────────────────────────────────────────────────

  ReportsPage: {
    tier: 'Organism',
    description: 'Full Reports page. Pinned preview strip (sparkline cards) + status filter tabs + search + AG Grid list view. 22 mock reports. Pin/unpin from 3-dot RowMenu (portal-positioned); pinned count badge updates live.',
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
    npm: ['ag-grid-community', 'ag-grid-react'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'AI Generated border', hex: '#FF7056' },
        { name: 'Running / Completed', hex: '#4BA373' },
        { name: 'Failed border',       hex: '#DC2626' },
        { name: 'AG Grid light bg',    hex: '#F5F5F3' },
        { name: 'AG Grid dark bg',     hex: '#242424' },
      ],
      subComponents: ['Badge', 'Button', 'ReportStatusBadge', 'ReportCard', 'ReportStatusTabs', 'PinnedReportCard', 'PinnedReportsStrip', 'RowMenu', 'Sparkline'],
      notes: [
        'List view now uses AG Grid (community edition, themeQuartz) — hand-rolled ReportRow + TableHeader removed',
        'AG Grid columns: # | Status | Report ID | Name | Trend | Schedule | (actions)',
        'RowMenu is portal-positioned via getBoundingClientRect on the ⋮ btn — never clips in overflow containers',
        'Dark/light AG Grid theme: lightTheme (bg #F5F5F3) / darkTheme (bg #242424) swapped via MutationObserver',
        'Pinned strip: 3 default pinned IDs driven by pinnedIds Set state',
        'Pin/unpin via RowMenu — strip count badge updates live; strip hides if all unpinned',
        'Grid card view still present: status-color border + glow box-shadow on hover',
        'Search filters across name, ID, and trend fields',
        'PinIcon: BsPinFill / BsPin from react-icons/bs',
      ],
    },
  },

  // ── ReportRow — DEPRECATED (replaced by AG Grid) ────────────────────────────

  ReportRow: {
    tier: 'Molecule',
    description: '⚠️ DEPRECATED — replaced by AG Grid rows in ReportsPage. Was a hand-rolled single row: Status badge + truncated ID + name + trend snippet + schedule pill. Pinned rows showed BsPinFill in coral instead of row number.',
    props: [
      { name: 'report',       type: 'Report',    default: 'required' },
      { name: 'index',        type: 'number',    default: 'required' },
      { name: 'isPinned',     type: 'boolean',   default: 'false'    },
      { name: 'onTogglePin',  type: '() => void', default: 'required' },
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
    snippet: () => `<ReportRow report={report} index={index} isPinned={isPinned} onTogglePin={() => togglePin(report.id)} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: ['BsPinFill', 'BsPin'],
      colors: [
        { name: 'AI Generated', hex: '#FF7056' },
        { name: 'Failed',       hex: '#DC2626' },
        { name: 'Running/Done', hex: '#4BA373' },
        { name: 'Pin coral',    hex: '#FF7056' },
      ],
      subComponents: ['ReportStatusBadge', 'SchedulePill', 'RowMenu'],
      notes: [
        'Row number cell shows BsPinFill (coral) when isPinned, row number otherwise',
        'borderLeft color transitions transparent → status color on hover',
        'RowMenu fades in (opacity 0→1) on hover; closes on outside mousedown',
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

  // ── Sparkline ────────────────────────────────────────────────────────────────

  Sparkline: {
    tier: 'Atom',
    description: 'SVG sparkline with area gradient fill. End-dot and pulsing halo are CSS divs positioned via % coordinates so they stay perfectly circular regardless of card width. preserveAspectRatio="none" stretches line only.',
    props: [
      { name: 'data',   type: 'number[]', default: 'required'  },
      { name: 'color',  type: 'string',   default: "'#FF7056'" },
      { name: 'height', type: 'number',   default: '56'        },
    ],
    states: [
      { label: 'Coral (uptrend)',  props: { data: [42,38,46,55,49,61,67], color: '#FF7056', height: 56 } },
      { label: 'Cobalt (flat)',    props: { data: [5.1,4.9,4.7,4.4,4.3,4.4,4.2], color: '#1779F7', height: 56 } },
      { label: 'Green (variable)', props: { data: [11,14,13,16,12,15,14], color: '#4BA373', height: 56 } },
    ],
    render: (p) => center(
      <div style={{ width: 240, background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ position: 'relative', height: p.height ?? 56 }}>
          <span style={{ fontSize: 11, color: p.color ?? '#FF7056', fontFamily: "'Byrd', sans-serif" }}>
            Live sparkline preview — see PinnedReportCard
          </span>
        </div>
      </div>
    ),
    snippet: (p) => `<Sparkline data={${JSON.stringify(p.data)}} color="${p.color}" height={${p.height}} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Coral',  hex: '#FF7056' },
        { name: 'Cobalt', hex: '#1779F7' },
        { name: 'Green',  hex: '#4BA373' },
      ],
      subComponents: [],
      notes: [
        'SVG viewBox 0 0 200 H with preserveAspectRatio="none" — stretches X only',
        'End-dot + pulsing halo are CSS divs, not SVG circles (avoids oval distortion)',
        'Halo animation: spark-pulse keyframe in index.css (scale + opacity)',
        'vectorEffect="non-scaling-stroke" keeps stroke width consistent',
        'Defined inline in ReportsPage.jsx',
      ],
    },
  },

  // ── PinnedReportCard ─────────────────────────────────────────────────────────

  PinnedReportCard: {
    tier: 'Molecule',
    description: 'Featured report preview card in the Pinned strip. Header (status + schedule + last-run + Open button) → title → Sparkline hero with label and delta → 3-column stat chips → footer with cadence + masked API key.',
    props: [
      { name: 'report', type: 'PinnedReport', default: 'required' },
    ],
    states: [
      { label: 'AI Generated (coral)', props: {} },
      { label: 'Running (cobalt)',      props: {} },
      { label: 'Completed (green)',     props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      200,
    ),
    snippet: () => `<PinnedReportCard report={report} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Coral sparkline',  hex: '#FF7056' },
        { name: 'Cobalt sparkline', hex: '#1779F7' },
        { name: 'Green sparkline',  hex: '#4BA373' },
        { name: 'Delta up',         hex: '#FF7056' },
        { name: 'Delta down',       hex: '#4BA373' },
      ],
      subComponents: ['StatusBadge', 'SchedulePill', 'Sparkline'],
      notes: [
        'sparkDelta color: coral when sparkUp=true, green when false',
        'border-color + box-shadow transitions on hover',
        'Stats row: 3 cells divided by 1px border-input separators',
        'API key shown masked — display only, not functional',
        'Defined inline in ReportsPage.jsx',
      ],
    },
  },

  // ── PinnedReportsStrip ───────────────────────────────────────────────────────

  PinnedReportsStrip: {
    tier: 'Organism',
    description: 'Horizontal strip above the report list showing pinned report preview cards. Driven by pinnedIds Set in ReportsPage. Renders null when no pins. Count badge updates live.',
    props: [
      { name: 'reports', type: 'PinnedReport[]', default: 'required' },
    ],
    states: [
      { label: '3 pinned (default)', props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      200,
    ),
    snippet: () => `<PinnedReportsStrip reports={pinnedReports} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: ['PinnedReportCard'],
      notes: [
        'Returns null when reports.length === 0 — strip disappears entirely',
        'Cards in a flex row with overflowX: auto for narrow viewports',
        'PREVIEW_DATA map provides sparkData + stats keyed by report ID',
        'DEFAULT_PINNED = 3 IDs; togglePin() adds/removes from Set',
        'Defined inline in ReportsPage.jsx',
      ],
    },
  },

  // ── RowMenu ──────────────────────────────────────────────────────────────────

  RowMenu: {
    tier: 'Molecule',
    description: '3-dot context menu for report rows. Options: Pin/Unpin (BsPinFill / BsPin, coral highlight when unpinned), Open report, Delete. Closes on outside mousedown via document event listener.',
    props: [
      { name: 'isPinned',     type: 'boolean',    default: 'false'    },
      { name: 'onTogglePin',  type: '() => void', default: 'required' },
    ],
    states: [
      { label: 'Not pinned', props: {} },
      { label: 'Pinned',     props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <ReportsPage isMobile={false} sidebarWidth={0} />
      </div>,
      160,
    ),
    snippet: () => `<RowMenu isPinned={isPinned} onTogglePin={() => togglePin(report.id)} />`,
    source: ReportsPageSrc,
    files: [{ path: 'src/components/reports/ReportsPage.jsx', src: ReportsPageSrc }],
    breakdown: {
      icons: ['BsPinFill', 'BsPin'],
      colors: [
        { name: 'Pin highlight', hex: '#FF7056' },
        { name: 'Delete danger', hex: '#DC2626'  },
      ],
      subComponents: [],
      notes: [
        'BsPinFill (filled) when isPinned, BsPin (outline) when not — both from react-icons/bs',
        'Pin label: "Pin to top" (coral) | "Unpin from top" (secondary)',
        'Dropdown: bg-card, border-default, 8px radius, 28px z-index 200',
        'Outside-click: document mousedown listener added/removed on open/close',
        'MenuRow uses onMouseDown={e => e.preventDefault()} to prevent blur-before-click',
        'Defined inline in ReportsPage.jsx',
      ],
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

  // ── Agent Eval — InsightCard ───────────────────────────────────────────────

  InsightCard: {
    tier: 'Molecule',
    description: 'AI-powered agent insight card. Left: bordered inset panel with avatar, full name, role label, star rating, and score. Right: AI insight heading + paragraph, horizontal divider, then 2-col strengths/improvements grid.',
    props: [
      { name: 'agent', type: 'object', default: '{ name, avgScore, stars, team }' },
    ],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ width: 500, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
              {/* Left inset panel */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 110, padding: '16px 14px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 10, flexShrink: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Byrd',sans-serif" }}>MK</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Martha Kellett</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2, fontFamily: "'Byrd',sans-serif" }}>Agent Operations</div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>{'★★★★☆'.split('').map((s, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 12 }}>{s}</span>)}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>86</div>
              </div>
              {/* Right content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ color: '#FF7056', fontSize: 12 }}>✦</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Ai powered insight</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: "'Byrd',sans-serif" }}>Martha demonstrates a solid trend in performance, showing consistent improvement in communication and technical knowledge.</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-default)', marginBottom: 12 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['Top 3 Strengths', ['Communication Clarity', 'Issue Resolution', 'Product Knowledge']], ['Areas to improve', ['Active Listening', 'Call Summary', 'Urgency Framing']]].map(([title, items]) => (
                    <div key={title}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}><span style={{ color: '#FF7056', fontSize: 10 }}>✦</span><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>{title}</span></div>
                      <ul style={{ margin: 0, padding: '0 0 0 13px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: "'Byrd',sans-serif" }}>{items.map(i => <li key={i}>{i}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to AgentEvalPage — agent detail view\n// data-inspector="InsightCard"\n<InsightCard agent={agent} />`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    breakdown: {
      colors: [
        { name: 'Pulse Coral (✦ icon)', hex: '#FF7056' },
        { name: 'Amber (stars)',        hex: '#F59E0B' },
        { name: '--bg-canvas (inset panel)', hex: '#F4F3F1' },
      ],
      subComponents: ['Avatar', 'Stars'],
      notes: [
        'Left panel is a bordered inset card (bg-canvas + border + borderRadius:10)',
        'Agent name uses ellipsis overflow — maxWidth: 100px',
        'Star rating is fractional — full/half/empty logic in Stars helper',
        'Divider between insight text and strengths/improvements grid',
        'Insight text uses agent first name dynamically',
      ],
    },
  },

  // ── Agent Eval — ScorePanel ────────────────────────────────────────────────

  AgentScorePanel: {
    tier: 'Molecule',
    description: 'Collapsible evaluation breakdown. Total score sits in a --bg-canvas inset card: label + "86/100" value on one row above the filled progress bar. Below: 3-column grid of skill categories (Professionalism, Sales Techniques, Communication). Each skill row has a ScoreBar with colored fill + average tick mark. Grid gap is 20px.',
    props: [
      { name: 'totalScore', type: 'number',  default: '86' },
      { name: 'title',      type: 'string',  default: '"Agent evaluation"' },
      { name: 'collapsible',type: 'boolean', default: 'false' },
    ],
    states: [
      {
        label: 'Expanded',
        preview: () => center(
          <div style={{ width: 500, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif", flex: 1 }}>Agent evaluation</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10l4-4" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            {/* Total score bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif", width: 80 }}>total score</span>
              <div style={{ flex: 1, position: 'relative', height: 5, background: 'var(--border-default)', borderRadius: 99 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '86%', background: '#4BA373', borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif", width: 42, textAlign: 'right' }}>86/100</span>
            </div>
            {/* 3-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
              {[['Professionalism', [['Customer Needs', 89, 82], ['Self-Introduction', 19, 55]]], ['Sales Techniques', [['Identifying Opps', 90, 74], ['Handling Objections', 81, 68]]], ['Communication', [['Needs Assessment', 92, 79], ['Call Summary', 45, 66]]]].map(([cat, skills]) => (
                <div key={cat}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif", marginBottom: 8 }}>{cat}</div>
                  {skills.map(([name, score, avg]) => {
                    const color = score >= 70 ? '#4BA373' : score >= 40 ? '#F59E0B' : '#E05252'
                    return (
                      <div key={name} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{name}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color, fontFamily: "'Byrd',sans-serif" }}>{score}/100</span>
                        </div>
                        <div style={{ position: 'relative', height: 5, background: 'var(--border-default)', borderRadius: 99 }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${score}%`, background: color, borderRadius: 99 }} />
                          <div style={{ position: 'absolute', top: -4, left: `${avg}%`, transform: 'translateX(-50%)', width: 2, height: 13, background: 'var(--text-secondary)', borderRadius: 1, opacity: 0.5 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to AgentEvalPage\n<ScorePanel totalScore={agent.avgScore} title="Agent evaluation" collapsible />`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    breakdown: {
      colors: [
        { name: 'Green (score ≥70)',  hex: '#4BA373' },
        { name: 'Amber (score ≥40)',  hex: '#F59E0B' },
        { name: 'Red (score <40)',    hex: '#E05252' },
      ],
      subComponents: ['ScoreBar'],
      notes: [
        'TotalScoreBar: label ("total score") + numeric ("86/100") on one flex row above the bar — not inline-left',
        'Total score bar lives inside a --bg-canvas inset card (borderRadius 10, --border-input border)',
        'Cursor dot on total score bar uses --bg-sidebar for its ring border (correct in light + dark)',
        'ScoreBar track uses --border-strong (#C8C8C8) for better contrast (was --border-default)',
        'ScoreBar average tick: thin 2px vertical line at avgPct%, opacity 0.5',
        'Skill lock icons removed from each skill row — just name + score',
        'Each skill has a distinct average value — not a shared constant',
        'Grid is always 3 columns, gap 20px regardless of category count',
        'collapsible prop adds chevron toggle button in header',
        'Uses --page-header-border + --page-header-shadow on panel root (token-driven chrome)',
      ],
    },
  },

  // ── Agent Eval — SkillSection ──────────────────────────────────────────────

  SkillSection: {
    tier: 'Molecule',
    description: 'Collapsible category card for the agent detail view. Header shows category name + chevron. Body has skill sub-cards (score, description, call evidence links). Each call row is clickable and navigates to the call detail.',
    props: [
      { name: 'section',    type: 'object',      default: '{ category, skills[] }' },
      { name: 'onOpenCall', type: '(id) => void', default: 'undefined' },
    ],
    states: [
      {
        label: 'Expanded',
        preview: () => center(
          <div style={{ width: 500, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Sales Techniques</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10l4-4" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ padding: '14px 20px', display: 'flex', gap: 12 }}>
              {/* Skill card */}
              <div style={{ flex: '0 0 200px', padding: '12px 14px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>Handling Objections</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#4BA373', fontFamily: "'Byrd',sans-serif" }}>72/100</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.55, fontFamily: "'Byrd',sans-serif" }}>Agent consistently validates customer concerns before offering alternatives.</p>
              </div>
              {/* Call evidence */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['Call ID #402', 'De-escalated pricing complaint.', 75], ['Call ID #905', 'Validated user frustration re: timeline.', 95], ['Call ID #112', 'Pivot from objection to value proposition.', 66]].map(([id, summary, score]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 7, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="#1779F7" strokeWidth="1.3"/><path d="M4 7h6M4 4.5h4M4 9.5h3" stroke="#1779F7" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span style={{ fontSize: 11, color: '#1779F7', fontWeight: 500, fontFamily: "'Byrd',sans-serif" }}>{id}:</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>{summary}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: score >= 70 ? '#4BA373' : '#F59E0B', fontFamily: "'Byrd',sans-serif", flexShrink: 0 }}>{score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to AgentEvalPage\n<SkillSection section={section} onOpenCall={(id) => navigate(id)} />`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (call ID link)',  hex: '#1779F7' },
        { name: 'Green (score ≥70)',      hex: '#4BA373' },
        { name: 'Amber (score ≥40)',      hex: '#F59E0B' },
        { name: 'Red (score <40)',        hex: '#E05252' },
      ],
      subComponents: [],
      notes: [
        'onOpenCall is optional — call row uses onOpenCall?.(id) to prevent crash if undefined',
        'Each skill card: score label + description paragraph in bg-canvas bordered box',
        'Call evidence rows are full-width clickable — hover shows bg-hover',
        'Section collapses to header only on chevron click',
      ],
    },
  },

  // ── Agent Eval — PersonPicker ──────────────────────────────────────────────

  PersonPicker: {
    tier: 'Molecule',
    description: 'Collapsible search-and-select picker for agents or leads. Collapsed state shows selected chips + "Add more" / "Minimize" toggle. Expanded: search input (autoFocus) + alphabetically grouped list with avatar circles, optional role subtitle, and checkbox per row.',
    props: [
      { name: 'label',       type: 'string',          default: '"Agents"' },
      { name: 'people',      type: 'object[]',        default: 'MOCK_AGENTS or MOCK_LEADS' },
      { name: 'selected',    type: 'object[]',        default: '[]' },
      { name: 'onToggle',    type: '(person) => void', default: 'required' },
      { name: 'placeholder', type: 'string',          default: '"Search agents…"' },
    ],
    states: [
      {
        label: 'Collapsed — 1 selected',
        preview: () => center(
          <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>Agents</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--b100, #1779F7)', fontWeight: 500, fontFamily: "'Byrd',sans-serif" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 3.5v4M3.5 5.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Add more
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-active)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '3px 8px 3px 5px', alignSelf: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: '#fff' }}>MK</div>
              <span style={{ fontSize: 12, fontFamily: "'Byrd',sans-serif", color: 'var(--text-primary)' }}>Martha Kellett</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer', marginLeft: 2 }}>×</span>
            </div>
          </div>
        ),
      },
      {
        label: 'Expanded — searching',
        preview: () => center(
          <div style={{ width: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif" }}>Agents</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, fontFamily: "'Byrd',sans-serif" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 5.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Minimize
              </button>
            </div>
            <div style={{ position: 'relative', marginBottom: 5 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              <div style={{ height: 34, paddingLeft: 28, display: 'flex', alignItems: 'center', background: 'var(--bg-canvas)', border: '1.5px solid var(--b100, #1779F7)', borderRadius: 7, fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif" }}>Search team leads…</div>
            </div>
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, background: 'var(--bg-canvas)', overflow: 'hidden' }}>
              {[['A', 'Anna Strickland', 'QA Manager', '#4BA373'], ['D', 'David Okafor', 'Team Lead · Beta', '#1779F7'], ['R', 'Rachel Kim', 'Team Lead · Alpha', '#D799E2']].map(([letter, name, role, color], i) => (
                <div key={name}>
                  <div style={{ padding: '5px 12px 2px', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif", letterSpacing: '0.05em', borderTop: i > 0 ? '1px solid var(--border-default)' : 'none' }}>{letter}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderTop: '1px solid var(--border-default)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#fff', flexShrink: 0, fontFamily: "'Byrd',sans-serif" }}>{name.split(' ').map(w => w[0]).join('')}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif" }}>{role}</div>
                    </div>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--n100, #606060)', background: 'transparent' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Internal to FeedbackModal in AgentEvalPage\n<PersonPicker\n  label="Agents"\n  people={MOCK_AGENTS}\n  selected={selectedAgents}\n  onToggle={toggleAgent}\n  placeholder="Search agents…"\n/>`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (Add more / focus border)', hex: '#1779F7' },
        { name: '--n100 (unchecked checkbox border)', hex: '#606060' },
        { name: 'Avatar colors from AVATAR_COLORS[]', hex: '#FF7056' },
      ],
      subComponents: [],
      notes: [
        'expanded state initializes based on selected.length === 0 (open if empty)',
        'autoFocus on search input when expanded for keyboard-first use',
        'Alphabetical grouping: first letter of name as section header',
        'Role subtitle shown below name when p.role exists (leads have role, agents do not)',
        '"Minimize" shows when expanded, "Add more"/"Select" when collapsed',
        'Checkbox border: --n100 (#606060) unchecked — visible in both light and dark mode',
      ],
    },
  },

  // ── Agent Eval — FeedbackModal ─────────────────────────────────────────────

  FeedbackModal: {
    tier: 'Molecule',
    description: 'Export Report modal. Single PersonPicker (Agents), segmented schedule control (One-time / Monthly), date input with theme-aware color-scheme. Report is automatically routed to the agent\'s supervised manager or team lead.',
    props: [
      { name: 'agent',   type: 'object',      default: 'current agent object' },
      { name: 'onClose', type: '() => void',  default: 'required' },
    ],
    states: [
      {
        label: 'Default',
        preview: () => center(
          <div style={{ width: 340, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px' }}>
            {/* Segmented control */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif", marginBottom: 6 }}>Schedule</div>
              <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--bg-active)', border: '1px solid var(--border-default)', borderRadius: 9 }}>
                {['One-time', 'Monthly'].map((opt, i) => (
                  <div key={opt} style={{ flex: 1, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: "'Byrd',sans-serif", background: i === 0 ? 'var(--bg-card)' : 'transparent', color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === 0 ? 500 : 400, boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.18)' : 'none' }}>{opt}</div>
                ))}
              </div>
            </div>
            {/* Date */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd',sans-serif", marginBottom: 6 }}>Send date</div>
              <div style={{ height: 36, background: 'var(--bg-canvas)', border: '1.5px solid var(--border-default)', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif" }}>dd/mm/yyyy</div>
            </div>
          </div>
        ),
      },
    ],
    snippet: () => `// Opened via Export button in AgentDetailView header\n{feedbackOpen && <FeedbackModal agent={agent} onClose={() => setFeedbackOpen(false)} />}`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    breakdown: {
      colors: [
        { name: 'Cobalt (active segment / focus)', hex: '#1779F7' },
        { name: 'Pulse Coral (Confirm & Send btn)', hex: '#FF7056' },
        { name: '--bg-active (segment track)',      hex: 'var(--bg-active)' },
      ],
      subComponents: ['Modal', 'Button', 'PersonPicker'],
      notes: [
        'Opened by the Export button in AgentDetailView header',
        'Confirm & Send disabled until Agents has ≥1 selection',
        'Report is auto-routed to the agent\'s team lead/manager — no recipient selection needed',
        'Schedule: One-time sends on selected date; Monthly recurs from start date',
        'Date label changes to "Start date" when Monthly is selected',
        'Date input: color-scheme CSS rule (index.css) — light by default, dark under [data-theme="dark"]',
        'Sent state: button shows "Sent ✓", modal auto-closes after 1.4s',
      ],
    },
  },

  // ── Agent Eval — Overview Page ─────────────────────────────────────────────

  AgentEvalPage: {
    tier: 'Organism',
    description: 'Full agent evaluation page. Two views: Overview (performance chart, score panel, teams table, agent performance table with search) and Agent Detail (InsightCard, PerformanceChart, ScorePanel, SkillSections, FilterBar). Nav via sidebar "Agent eval" item.',
    props: [
      { name: 'sidebarWidth',     type: 'number', default: '220' },
      { name: 'sidebarTransition',type: 'string', default: '"width 200ms ease"' },
    ],
    states: [
      {
        label: 'Overview',
        preview: () => containedPreview(
          <AgentEvalPage sidebarWidth={0} sidebarTransition="none" />,
          320,
        ),
      },
    ],
    snippet: () => `// Routed via activePage === 'agent-eval' in App.jsx\n<AgentEvalPage sidebarWidth={effectiveSidebarWidth} sidebarTransition={sidebarTransition} />`,
    source: AgentEvalPageSrc,
    files: [{ path: 'src/components/agent-eval/AgentEvalPage.jsx', src: AgentEvalPageSrc }],
    npm: ['react-apexcharts', 'apexcharts', 'ag-grid-community', 'ag-grid-react'],
    breakdown: {
      colors: [
        { name: 'Cobalt (chart line/gradient)', hex: '#1779F7' },
        { name: 'Green (score ≥70)',             hex: '#4BA373' },
        { name: 'Amber (score ≥40)',             hex: '#F59E0B' },
        { name: 'Red (score <40)',               hex: '#E05252' },
        { name: 'Pulse Coral (✦ AI icon)',       hex: '#FF7056' },
      ],
      subComponents: ['InsightCard', 'PerformanceChart', 'AgentScorePanel', 'SkillSection', 'PersonPicker', 'FeedbackModal', 'FilterBar', 'PresetSelect', 'Button', 'Modal'],
      notes: [
        'Overview → detail navigation via agent row click — no router, useState only',
        'Back button replicates ExplorePage breadcrumb style: bordered button + › separator',
        'Export button opens FeedbackModal (not a download)',
        'FilterBar in detail view is full DataPage parity: appliedChips, isDirty, presets, Save modal',
        'Chart uses ApexCharts (react-apexcharts) — migrated from Recharts. Gradient fill, straight stroke, custom tooltip via options.tooltip.custom.',
        'ApexCharts dark/light mode: MutationObserver on documentElement data-theme → re-renders with theme.mode "dark"/"light"',
        'Chart header shows actual date range (data[0].date – data[last].date) instead of static "(Time Unit: Day)" label',
        'Cards (chart, ScorePanel, InsightCard, SkillSection) use --page-header-border + --page-header-shadow tokens for consistent chrome in light/dark',
        'TotalScoreBar redesigned: label + numeric "86/100" sit on one flex row ABOVE the bar (no longer inline left of bar)',
        'Total score bar wrapped in --bg-canvas inset card (borderRadius 10, --border-input border)',
        'ScorePanel inner grid gap 12→20; skill lock icons removed from each skill row',
        'NameCell: optional showAvatar cellRendererParam (default true) — set false per column to suppress avatar circle',
        'MOCK_LEADS: 6 team leads/managers for Send-report-to picker',
        'All scroll containers use className="smooth-scroll" for blended scrollbars',
        'position:fixed layout — left offset = sidebarWidth prop (matches DataPage/ExplorePage)',
      ],
    },
  },

  // ── NotificationsPopover ───────────────────────────────────────────────────

  NotificationsPopover: {
    tier: 'Organism',
    description: 'Lab-only notification panel. Portal-rendered popover anchored to the bell button in Sidebar. 5 notification tags matching real platform sources (DATA, SIGNALS, MAGIC_API, AGENT_EVALUATION, CHAT). Navigable types (DATA → /data or /customers, SIGNALS → /magicapi-v2) close the popover and fire onNavigate. Tag-only types are passive. Delivered via GCP Pub/Sub → MongoDB → PubNub → NotificationProvider.',
    props: [
      { name: 'open',       type: 'boolean',          default: 'false' },
      { name: 'anchorRef',  type: 'React.RefObject',   default: 'required' },
      { name: 'onClose',    type: '() => void',         default: 'required' },
      { name: 'onNavigate', type: '(path: string) => void', default: 'undefined' },
    ],
    states: [
      { label: 'With unread', props: { _state: 'unread' } },
      { label: 'All tags',    props: { _state: 'tags' } },
      { label: 'Empty',       props: { _state: 'empty' } },
    ],
    render: (p) => {
      const state = p._state || 'unread'
      // Panel chrome — inlined as plain divs (no inline component functions).
      // Defining sub-components inside a render() function creates new references
      // on every call, causing React to remount DOM nodes which fires the
      // MutationObserver in ComponentsTab → infinite re-render loop.
      const panelShell = (inner) => (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{
            width: 360, background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
            fontFamily: "'Byrd', sans-serif",
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px 11px', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
                {state !== 'empty' && <span style={{ fontSize: 10, fontWeight: 700, background: '#E8613A', color: '#fff', padding: '1px 6px', borderRadius: 999, lineHeight: 1.6 }}>3</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {state !== 'empty' && <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>Mark all read</span>}
                <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>×</span>
              </div>
            </div>
            {inner}
          </div>
        </div>
      )

      // Helper: render a notification row
      const notifRow = ({ color, bg, iconPath, title, description, tag, navTo, time, unread }) => (
        <div style={{ display: 'flex', gap: 11, padding: '11px 14px 12px 12px', cursor: navTo ? 'pointer' : 'default' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `color-mix(in srgb, ${color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0, marginTop: 1 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: iconPath }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: unread ? 600 : 400, color: unread ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 20 }}>{title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 7, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 6px', borderRadius: 4, background: bg, color, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'monospace' }}>{tag}</span>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', opacity: 0.7 }}>{time}</span>
              {unread && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.6 }} />}
              {navTo && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', opacity: 0.45 }}>{navTo}</span>}
            </div>
          </div>
        </div>
      )

      if (state === 'empty') {
        return panelShell(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
            <div style={{ color: 'var(--text-muted)', opacity: 0.45, marginBottom: 10 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 4.17-1.75 6.58-2.73 7.75A1 1 0 0 0 3 18.5h18a1 1 0 0 0 .73-1.75C20.75 15.58 19 13.17 19 9a7 7 0 0 0-7-7z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" strokeWidth="1.5"/><polyline points="9 10 11 12 15 8" strokeWidth="1.5"/></svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>You're all caught up</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No new notifications</div>
          </div>
        )
      }

      if (state === 'tags') {
        // Show one row per tag type
        return panelShell(
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px 4px' }}>All tag types</div>
            {notifRow({ color: '#4BA373', bg: 'rgba(75,163,115,0.10)', iconPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>', title: 'File Export Ready', description: 'Your Q4 data export has completed.', tag: 'DATA', navTo: '/data', time: '18m ago', unread: true })}
            {notifRow({ color: '#5BA3FF', bg: 'rgba(91,163,255,0.10)', iconPath: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', title: 'Signal Export Complete', description: 'Magic API v2 signal export finished.', tag: 'SIGNALS', navTo: '/magicapi-v2', time: '2h ago', unread: true })}
            {notifRow({ color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', iconPath: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>', title: 'Magic API Export Done', description: 'Your Magic API v1 export completed.', tag: 'MAGIC_API', time: '5h ago', unread: false })}
            {notifRow({ color: '#F97316', bg: 'rgba(249,115,22,0.10)', iconPath: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>', title: 'Evaluation Shared with You', description: 'Sarah Chen shared "Q4 Agent Performance" with your team.', tag: 'AGENT_EVALUATION', time: '1d ago', unread: false })}
            {notifRow({ color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', iconPath: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', title: 'New Chat Session Activity', description: 'A new session was added to your monitored conversations.', tag: 'CHAT', time: '1d ago', unread: false })}
          </div>
        )
      }

      // Default: 3 unread (DATA file + DATA customer + SIGNALS)
      return panelShell(
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px 4px' }}>Today</div>
          {notifRow({ color: '#4BA373', bg: 'rgba(75,163,115,0.10)', iconPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>', title: 'File Export Ready', description: 'Your Q4 data export has completed and is ready to review.', tag: 'DATA', navTo: '/data', time: '18m ago', unread: true })}
          {notifRow({ color: '#4BA373', bg: 'rgba(75,163,115,0.10)', iconPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>', title: 'Customer Export Complete', description: '2,340 customer records exported successfully.', tag: 'DATA', navTo: '/customers', time: '2h ago', unread: true })}
          {notifRow({ color: '#5BA3FF', bg: 'rgba(91,163,255,0.10)', iconPath: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', title: 'Signal Export Complete', description: 'Your Magic API v2 signal export has finished processing.', tag: 'SIGNALS', navTo: '/magicapi-v2', time: '5h ago', unread: true })}
        </div>
      )
    },
    snippet: () =>
`// In Lab Sidebar — wire to bell button ref
const [notifOpen, setNotifOpen] = useState(false)
const bellRef = useRef(null)

<button ref={bellRef} onClick={() => setNotifOpen(v => !v)}>
  <BellIcon />
</button>

<NotificationsPopover
  open={notifOpen}
  anchorRef={bellRef}
  onClose={() => setNotifOpen(false)}
  onNavigate={(path) => router.push(path)}
/>`,
    source: NotificationsPopoverSrc,
    files: [
      { path: 'src/lab/components/NotificationsPopover.jsx', src: NotificationsPopoverSrc },
      { path: 'src/lab/components/Sidebar.jsx',              src: SidebarSrc },
    ],
    npm: [],
    breakdown: {
      icons: [
        'BellIcon (trigger — in Sidebar)',
        'Inline SVG: DATA (spreadsheet), SIGNALS (waveform), MAGIC_API (code brackets)',
        'Inline SVG: AGENT_EVALUATION (share/nodes), CHAT (message bubble)',
      ],
      colors: [
        { name: '--bg-card (panel bg)',          hex: '#FFFFFF' },
        { name: '--bg-active (chip/btn bg)',      hex: '#E8E8E6' },
        { name: '--border-default',               hex: '#E5E7EB' },
        { name: '--text-primary (unread title)',   hex: '#181818' },
        { name: '--text-secondary (read title)',   hex: '#606060' },
        { name: '--text-muted (desc/timestamp)',   hex: '#9B9B9B' },
        { name: 'Unread badge',                   hex: '#E8613A' },
        { name: 'DATA tag',                       hex: '#4BA373' },
        { name: 'SIGNALS tag',                    hex: '#5BA3FF' },
        { name: 'MAGIC_API tag',                  hex: '#A78BFA' },
        { name: 'AGENT_EVALUATION tag',           hex: '#F97316' },
        { name: 'CHAT tag',                       hex: '#F59E0B' },
      ],
      subComponents: [],
      notes: [
        'LAB ONLY — lives in src/lab/components/NotificationsPopover.jsx',
        'Uses createPortal(…, document.body) for z-index isolation',
        'Position computed from anchorRef.getBoundingClientRect() on open — top: anchor.bottom+8, left: anchor.left (viewport-clamped)',
        '5 tags: DATA · SIGNALS · MAGIC_API · AGENT_EVALUATION · CHAT',
        'Navigable tags: DATA (→ /data or /customers) and SIGNALS (→ /magicapi-v2) — row click fires onNavigate + closes',
        'Tag-only tags: MAGIC_API · AGENT_EVALUATION · CHAT — no navigation action',
        'CHAT notifications filtered by platform when user is on the active chat page/session',
        'Delivery pipeline: Server Action → GCP Pub/Sub → MongoDB → PubNub → NotificationProvider → here',
        'Scopes: USER · TEAM · PROJECT · ORGANIZATION · GLOBAL_USER (defined in src/mongo/types/notification.ts)',
        'Entrance animation frozen in useRef on mount — prevents re-fire on parent state updates',
        'Click outside + Escape closes; no focus trap (non-modal pattern)',
        'Grouping: Today / Earlier based on same calendar day vs earlier',
        'Stagger: items animate in at index × 35ms delay',
        'Popover enter: translateY(-8px)+scale(0.98) → identity (200ms); exit: reverse (150ms)',
        'Rows use hover bg (ROW_HOVER_BG = color-mix(--bg-active 32%, --bg-card)) — no border separators between items',
        'Type icon bg: color-mix(in srgb, tag-color 15%, transparent) — adapts to light/dark without fixed opacity values',
      ],
    },
  },

  // ── SignalsPage ─────────────────────────────────────────────────────────────

  SignalsPage: {
    tier: 'Organism',
    description: 'Full Signals list page. Fixed-position layout with AG Grid community table. Status filter tabs (All / Active / Triggered / Paused / Error), search input, CSV export, quota indicator badge, and Create button. 15 mock signals.',
    props: [
      { name: 'isMobile',          type: 'boolean', default: 'false' },
      { name: 'sidebarWidth',      type: 'number',  default: '272'   },
      { name: 'sidebarTransition', type: 'string',  default: '"left 280ms ease"' },
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
        <SignalsPage isMobile={false} sidebarWidth={0} />
      </div>,
      220,
    ),
    snippet: () => `<SignalsPage isMobile={isMobile} sidebarWidth={SIDEBAR_WIDTH} sidebarTransition={sidebarTransition} />`,
    source: SignalsPageSrc,
    files: [
      { path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc },
    ],
    npm: ['ag-grid-community', 'ag-grid-react'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Active badge',    hex: '#4BA373' },
        { name: 'Triggered badge', hex: '#F59E0B' },
        { name: 'Paused badge',    hex: '#9B9B9B' },
        { name: 'Error badge',     hex: '#EF4444' },
        { name: 'Quota bar',       hex: '#DC2626' },
        { name: 'AI Source tag',   hex: '#FF7056' },
        { name: 'System tag',      hex: '#1779F7' },
      ],
      subComponents: ['SignalsGrid', 'SignalsStatusTabs', 'SignalsStatusBadge', 'SignalsToggle', 'SignalsRowMenu', 'Badge', 'Button'],
      notes: [
        'Layout: position:fixed, left = sidebarWidth — same offset pattern as DataPage/ReportsPage',
        'Header uses --page-header-border + --page-header-shadow tokens (transparent/shadow in light, 1px border in dark)',
        'AG Grid: community edition with themeQuartz; light/dark theme swapped via MutationObserver on documentElement data-theme',
        'AG Grid light theme bg corrected to #F5F5F3 (--bg-canvas); grid wrapper bg = --bg-sidebar',
        'Column defs: # | Auto Process (Toggle) | ID | Name | Type | Context | Created At | Executions | Status | Actions',
        'Quota indicator: red pill (9/10) — wire to API for real usage',
        'StatusTabs count badges hidden when count === 0',
        'Export button calls gridRef.current.api.exportDataAsCsv()',
        'data-inspector="SignalsPage" on root, data-inspector="SignalsGrid" on grid wrapper',
      ],
    },
  },

  // ── SignalsGrid ──────────────────────────────────────────────────────────────

  SignalsGrid: {
    tier: 'Organism',
    description: 'AG Grid community table inside SignalsPage. 9 columns with custom cell renderers: Toggle (auto-process), IdCell (coral ID), SourceTagCell (AI/System pill), StatusCell (Badge), ExecutionsCell (icon + count), ActionsCell (RowMenu). Themed with themeQuartz; dark mode via MutationObserver.',
    props: [
      { name: 'rowData',    type: 'Signal[]', default: 'MOCK_SIGNALS (15 rows)' },
      { name: 'columnDefs', type: 'ColDef[]', default: 'internal COL_DEFS'      },
      { name: 'rowHeight',  type: 'number',   default: '44'                      },
      { name: 'headerHeight', type: 'number', default: '38'                      },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <SignalsPage isMobile={false} sidebarWidth={0} />
      </div>,
      200,
    ),
    snippet: () =>
`<AgGridReact
  ref={gridRef}
  theme={isDark ? darkTheme : lightTheme}
  className="hear-grid"
  rowData={filtered}
  columnDefs={colDefs}
  defaultColDef={DEFAULT_COL_DEF}
  rowHeight={44}
  headerHeight={38}
  context={gridContext}
  suppressCellFocus
/>`,
    source: SignalsPageSrc,
    files: [{ path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc }],
    npm: ['ag-grid-community', 'ag-grid-react'],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Light bg',        hex: '#F5F5F3' },
        { name: 'Dark bg',         hex: '#242424' },
        { name: 'Row hover light', hex: '#E8E8E6' },
        { name: 'Row hover dark',  hex: '#2A2A2A' },
        { name: 'Header text',     hex: '#606060' },
        { name: 'Border',          hex: '#E5E7EB' },
      ],
      subComponents: ['ToggleCellRenderer', 'IdCellRenderer', 'SourceTagCellRenderer', 'StatusCellRenderer', 'ExecutionsCellRenderer', 'ActionsCellRenderer'],
      notes: [
        'Theme params: fontFamily Byrd, fontSize 13, wrapperBorderRadius 0',
        'Light theme bg corrected to #F5F5F3 (--bg-canvas) — was #FFFFFF',
        'Grid wrapper uses --page-header-border + --page-header-shadow + --bg-sidebar background',
        'Grid context: { onToggleAutoProcess, onTogglePause, onDelete } passed via context prop',
        'gridRef.current.api.exportDataAsCsv() triggered by Export button in header',
        'suppressCellFocus prevents AG Grid default blue outline on cell click',
        'data-inspector="SignalsGrid" on the wrapper div',
      ],
    },
  },

  // ── SignalsStatusBadge ──────────────────────────────────────────────────────

  SignalsStatusBadge: {
    tier: 'Atom',
    description: '4-state signal status badge. Active (green), Triggered (amber), Paused (muted/grey), Error (red). Wraps the shared Badge component with tinted variant.',
    props: [
      { name: 'status', type: "'active'|'triggered'|'paused'|'error'", default: 'required' },
    ],
    states: [
      { label: 'Active',    props: { status: 'active'    } },
      { label: 'Triggered', props: { status: 'triggered' } },
      { label: 'Paused',    props: { status: 'paused'    } },
      { label: 'Error',     props: { status: 'error'     } },
    ],
    render: (p) => center(
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {p.status === 'active'    && <Badge variant="tinted" color="green">Active</Badge>}
        {p.status === 'triggered' && <Badge variant="tinted" color="amber">Triggered</Badge>}
        {p.status === 'paused'    && <Badge variant="tinted" color="teal">Paused</Badge>}
        {p.status === 'error'     && <Badge variant="tinted" color="coral">Error</Badge>}
      </div>
    ),
    snippet: (p) => `<StatusBadge status="${p.status}" />`,
    source: SignalsPageSrc,
    files: [{ path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Active',    hex: '#4BA373' },
        { name: 'Triggered', hex: '#F59E0B' },
        { name: 'Paused',    hex: '#9B9B9B' },
        { name: 'Error',     hex: '#EF4444' },
      ],
      subComponents: ['Badge'],
      notes: ['Wraps Badge with tinted variant — color mapped from STATUS_CFG constant', 'Defined inline in SignalsPage.jsx'],
    },
  },

  // ── SignalsToggle ───────────────────────────────────────────────────────────

  SignalsToggle: {
    tier: 'Atom',
    description: 'Auto-process toggle switch used in the AG Grid Auto Process column. Pill-shaped toggle: OFF = grey border, ON = cobalt background + blue glow ring. Thumb animates with spring cubic-bezier.',
    props: [
      { name: 'value',    type: 'boolean',             default: 'false'    },
      { name: 'onChange', type: '(next: boolean) => void', default: 'undefined' },
    ],
    states: [
      { label: 'Off', props: { value: false } },
      { label: 'On',  props: { value: true  } },
    ],
    render: (p) => center(
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, fontFamily: "'Byrd',sans-serif", color: 'var(--text-muted)' }}>{p.value ? 'ON' : 'OFF'}</span>
        <button style={{
          position: 'relative', width: 42, height: 24, borderRadius: 12,
          background: p.value ? 'var(--b100,#1779F7)' : 'var(--border-default)',
          border: 'none', cursor: 'pointer', flexShrink: 0, outline: 'none', padding: 0,
          transition: 'background 220ms ease',
          boxShadow: p.value ? '0 0 0 3px rgba(23,121,247,0.15)' : 'none',
        }}>
          <span style={{
            position: 'absolute', top: 3, left: p.value ? 21 : 3,
            width: 18, height: 18, borderRadius: '50%', background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </button>
      </div>
    ),
    snippet: (p) => `<Toggle value={${p.value}} onChange={next => updateSignal(id, { autoProcess: next })} />`,
    source: SignalsPageSrc,
    files: [{ path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'ON track',  hex: 'var(--b100) / #1779F7' },
        { name: 'OFF track', hex: 'var(--border-default)'  },
        { name: 'Thumb',     hex: '#FFFFFF'                },
        { name: 'Glow ring', hex: 'rgba(23,121,247,0.15)' },
      ],
      subComponents: [],
      notes: [
        'Thumb spring: cubic-bezier(0.34,1.56,0.64,1) — slight overshoot for tactile feel',
        'e.stopPropagation() on click prevents row selection',
        'Used inside ToggleCellRenderer AG Grid cell renderer',
        'Defined inline in SignalsPage.jsx',
      ],
    },
  },

  // ── SignalsStatusTabs ────────────────────────────────────────────────────────

  SignalsStatusTabs: {
    tier: 'Molecule',
    description: 'Filter tab bar for the Signals page. All / Active / Triggered / Paused / Error — each with a live count badge that hides when count is 0. Active tab: bg-active + border-default + bold text.',
    props: [
      { name: 'active',   type: 'string',     default: "'all'" },
      { name: 'onChange', type: '() => void', default: 'required' },
      { name: 'counts',   type: 'object',     default: 'required' },
    ],
    states: [
      { label: 'All active',     props: { active: 'all',       onChange: () => {}, counts: { all: 15, active: 7, triggered: 3, paused: 3, error: 1 } } },
      { label: 'Active active',  props: { active: 'active',    onChange: () => {}, counts: { all: 15, active: 7, triggered: 3, paused: 3, error: 1 } } },
      { label: 'Error active',   props: { active: 'error',     onChange: () => {}, counts: { all: 15, active: 7, triggered: 3, paused: 3, error: 1 } } },
    ],
    render: (p) => center(
      <div style={{ background: 'var(--bg-sidebar)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-input)', display: 'flex', gap: 2 }}>
        {['All', 'Active', 'Triggered', 'Paused', 'Error'].map(label => {
          const key = label.toLowerCase()
          const isActive = p.active === key
          const count = p.counts?.[key]
          return (
            <button key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 6, background: isActive ? 'var(--bg-active)' : 'transparent', border: isActive ? '1px solid var(--border-default)' : '1px solid transparent', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 12, fontWeight: isActive ? 600 : 400, fontFamily: "'Byrd', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {label}
              {count > 0 && <span style={{ minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99, background: isActive ? 'var(--border-default)' : 'var(--bg-active)', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{count}</span>}
            </button>
          )
        })}
      </div>
    ),
    snippet: () => `<StatusTabs active={statusFilter} onChange={setStatusFilter} counts={counts} />`,
    source: SignalsPageSrc,
    files: [{ path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc }],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: [],
      notes: [
        'Count badge hidden when count === 0',
        'Active tab: bg-active + border-default background',
        'Hover on inactive tabs: text-secondary + bg-active via onMouseEnter/Leave',
        'Defined inline in SignalsPage.jsx',
      ],
    },
  },

  // ── SignalsRowMenu ────────────────────────────────────────────────────────────

  SignalsRowMenu: {
    tier: 'Molecule',
    description: '3-dot context menu for signal grid rows. Options: Run Revision, Export, Export Configuration, Clone, Edit, Talk, History, View, then Delete (danger red). Portal-rendered fixed dropdown anchored to the ⋮ button via getBoundingClientRect.',
    props: [
      { name: 'onEdit',        type: '() => void', default: 'undefined' },
      { name: 'onDuplicate',   type: '() => void', default: 'undefined' },
      { name: 'onTogglePause', type: '() => void', default: 'undefined' },
      { name: 'isPaused',      type: 'boolean',    default: 'false'     },
      { name: 'onDelete',      type: '() => void', default: 'undefined' },
    ],
    states: [
      { label: 'Closed', props: {} },
    ],
    render: () => containedPreview(
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%', pointerEvents: 'none' }}>
        <SignalsPage isMobile={false} sidebarWidth={0} />
      </div>,
      160,
    ),
    snippet: () => `<RowMenu onEdit={onEdit} onTogglePause={onTogglePause} isPaused={isPaused} onDelete={onDelete} />`,
    source: SignalsPageSrc,
    files: [{ path: 'src/components/signals/SignalsPage.jsx', src: SignalsPageSrc }],
    breakdown: {
      icons: ['RunRevisionIcon', 'ExportIcon', 'CopyIcon', 'CloneIcon', 'EditIcon', 'TalkIcon', 'HistoryIcon', 'ViewIcon', 'TrashIcon'],
      colors: [
        { name: 'Delete danger',  hex: '#DC2626' },
        { name: 'Divider line',   hex: 'var(--border-input)' },
        { name: 'Dropdown bg',    hex: 'var(--bg-card)'      },
        { name: 'Dropdown border',hex: 'var(--border-default)'},
      ],
      subComponents: ['MenuRow'],
      notes: [
        '8 menu items: Run Revision | Export | Export Configuration | Clone | Edit | Talk | History | View',
        'Separator (1px border-input) before Delete',
        'Portal: createPortal(…, document.body) for z-index isolation',
        'Anchor: getBoundingClientRect() on ⋮ button — top: r.bottom+4, right: innerWidth-r.right',
        'Outside mousedown closes (document listener added/removed on open/close)',
        'Trigger button: 26×26 rounded square, bg-active + border on hover',
        'Defined inline in SignalsPage.jsx',
      ],
    },
  },

  // ── CreateSignalPage ─────────────────────────────────────────────────────────

  CreateSignalPage: {
    tier: 'Organism',
    description: 'Full Create/Edit Signal page. Fixed layout with rounded header bar (back button + editable signal name + History/Import buttons + Save CTA). Main content: single Card with signal name input, ModelDropdown, description textarea, and a dynamic list of expandable ItemRows.',
    props: [
      { name: 'sidebarWidth',      type: 'number', default: '0'   },
      { name: 'sidebarTransition', type: 'string', default: '"left 280ms ease"' },
    ],
    states: [
      { label: 'Default', props: { sidebarWidth: 0 } },
    ],
    render: () => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        transform: 'scale(0.55)', transformOrigin: 'top left',
        width: '182%', height: '182%',
        pointerEvents: 'none',
      }}>
        <CreateSignalPage sidebarWidth={0} />
      </div>,
      280,
    ),
    snippet: () => `<CreateSignalPage sidebarWidth={sidebarWidth} sidebarTransition={sidebarTransition} />`,
    source: CreateSignalPageSrc,
    files: [
      { path: 'src/components/signals/CreateSignalPage.jsx', src: CreateSignalPageSrc },
    ],
    npm: [],
    breakdown: {
      icons: ['BackIcon', 'PlayIcon', 'SparkleIcon', 'InfoIcon', 'DragHandle', 'TrashIcon', 'ChevronIcon', 'PlusIcon', 'HistoryIcon'],
      colors: [
        { name: 'Save button (coral)',       hex: '#FF7056'               },
        { name: 'History button border',     hex: 'var(--border-default)' },
        { name: 'Import button (purple)',    hex: 'rgba(215,153,226,0.12) → rgba(215,153,226,0.30) border' },
        { name: 'Import label',             hex: '#C178D4'               },
        { name: 'Model highlighted options',hex: '#C178D4'               },
        { name: 'Item row bg',              hex: 'var(--bg-canvas)'      },
        { name: 'Delete hover red',         hex: '#E53E3E'               },
      ],
      subComponents: ['SignalCard', 'ModelDropdown', 'TypeDropdown', 'SignalItemRow'],
      notes: [
        'Layout: position:fixed, left = sidebarWidth with transition — same pattern as SignalsPage',
        'Header: rounded card (borderRadius 16, bg-sidebar) uses --page-header-border + --page-header-shadow tokens',
        'Signal name: inline editable — placeholder "Untitled signal" via value/onChange pattern',
        'History button: ghost border style; Import button: purple sparkle pill',
        'Save button: coral (#FF7056) primary style in header right slot',
        'Items list: dynamic array with addItem / deleteItem — first item not deletable by design',
        'data-inspector="CreateSignalPage" on root div',
      ],
    },
  },

  // ── SignalCard ───────────────────────────────────────────────────────────────

  SignalCard: {
    tier: 'Molecule',
    description: 'Styled container card used inside CreateSignalPage. bg-sidebar background, 1px border-default border, borderRadius 16, padding 18/20px. Wraps signal name input, model dropdown, description field, and the items list.',
    props: [
      { name: 'children', type: 'ReactNode', default: 'required' },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: () => center(
      <div style={{ width: 340, background: 'var(--bg-sidebar)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '18px 20px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd',sans-serif" }}>
          Signal name · Model dropdown · Description textarea · Items list
        </div>
      </div>
    ),
    snippet: () => `<Card>\n  {/* signal name, model, description, items */}\n</Card>`,
    source: CreateSignalPageSrc,
    files: [{ path: 'src/components/signals/CreateSignalPage.jsx', src: CreateSignalPageSrc }],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Card bg',     hex: 'var(--bg-sidebar)'      },
        { name: 'Card border', hex: 'var(--border-default)'  },
      ],
      subComponents: [],
      notes: ['Simple wrapper — no logic, only layout and surface styling', 'Defined inline in CreateSignalPage.jsx'],
    },
  },

  // ── ModelDropdown ────────────────────────────────────────────────────────────

  ModelDropdown: {
    tier: 'Molecule',
    description: 'AI model selector pill in CreateSignalPage. Purple sparkle pill trigger; portal dropdown lists 15 model options. Highlighted models (Yoko-1-mini, Yoko-1, Llama-3.3-70B, Tomy-1, Tomy-Vanila) shown in purple. Selected model bold.',
    props: [
      { name: 'value',    type: 'string',             default: "'Yoko-1'" },
      { name: 'onChange', type: '(model) => void',    default: 'required' },
    ],
    states: [
      { label: 'Closed', props: { value: 'Yoko-1' } },
    ],
    render: (p) => center(
      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 32, padding: '0 12px', flexShrink: 0,
        background: 'rgba(215,153,226,0.12)',
        border: '1px solid rgba(215,153,226,0.30)',
        borderRadius: 20, cursor: 'pointer',
        fontSize: 12, fontWeight: 500, color: '#C178D4',
        fontFamily: "'Byrd', sans-serif",
      }}>
        <span style={{ fontSize: 10 }}>✦</span>
        {p.value ?? 'Yoko-1'}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    ),
    snippet: (p) => `<ModelDropdown value="${p.value}" onChange={setModel} />`,
    source: CreateSignalPageSrc,
    files: [{ path: 'src/components/signals/CreateSignalPage.jsx', src: CreateSignalPageSrc }],
    breakdown: {
      icons: ['SparkleIcon', 'ChevronIcon'],
      colors: [
        { name: 'Pill bg',              hex: 'rgba(215,153,226,0.12)' },
        { name: 'Pill border',          hex: 'rgba(215,153,226,0.30)' },
        { name: 'Pill text',            hex: '#C178D4'                },
        { name: 'Highlighted options',  hex: '#C178D4'                },
      ],
      subComponents: [],
      notes: [
        'MODEL_HIGHLIGHTED set: Yoko-1-mini, Yoko-1, Llama-3.3-70B, Tomy-1, Tomy-Vanila',
        'Dropdown: maxHeight 340px with scrollbarWidth:thin for long list',
        'Portal: createPortal(…, document.body) — fixed position, z-index 9999',
        'Outside click listener added/removed on open/close',
        'Defined inline in CreateSignalPage.jsx',
      ],
    },
  },

  // ── TypeDropdown ─────────────────────────────────────────────────────────────

  TypeDropdown: {
    tier: 'Atom',
    description: 'Data type selector for signal item fields. Options: String / Boolean / Number / List. Full-width compact dropdown with uppercase value display. Border highlights cobalt (--b100) on open.',
    props: [
      { name: 'value',    type: "'String'|'Boolean'|'Number'|'List'", default: "'String'" },
      { name: 'onChange', type: '(type) => void',                     default: 'required' },
    ],
    states: [
      { label: 'String',  props: { value: 'String'  } },
      { label: 'Boolean', props: { value: 'Boolean' } },
      { label: 'Number',  props: { value: 'Number'  } },
      { label: 'List',    props: { value: 'List'    } },
    ],
    render: (p) => center(
      <div style={{ width: 120 }}>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 34, padding: '0 10px',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
          borderRadius: 8, cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif", letterSpacing: '0.04em',
        }}>
          <span>{(p.value ?? 'String').toUpperCase()}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    ),
    snippet: (p) => `<TypeDropdown value="${p.value}" onChange={setItemType} />`,
    source: CreateSignalPageSrc,
    files: [{ path: 'src/components/signals/CreateSignalPage.jsx', src: CreateSignalPageSrc }],
    breakdown: {
      icons: ['ChevronIcon'],
      colors: [
        { name: 'Open border', hex: 'var(--b100) / #1779F7' },
        { name: 'Dropdown bg', hex: 'var(--bg-card)'        },
      ],
      subComponents: [],
      notes: [
        'TYPE_OPTIONS: [String, Boolean, Number, List]',
        'Value shown UPPERCASE — actual stored value is title-case (String, not STRING)',
        'Dropdown: fixed position via getBoundingClientRect — top/left/width',
        'Selected item: bold + text-primary; others: text-secondary',
        'Defined inline in CreateSignalPage.jsx',
      ],
    },
  },

  // ── SignalItemRow ────────────────────────────────────────────────────────────

  SignalItemRow: {
    tier: 'Molecule',
    description: 'Expandable configuration row in CreateSignalPage items list. Collapsed: drag handle + label + trash button + chevron. Expanded: 2-column grid — left (Name input + Key input + TypeDropdown) + right (Description textarea). Chevron animates 180° on expand.',
    props: [
      { name: 'label',    type: 'string',     default: "'Item 1'" },
      { name: 'onDelete', type: '() => void', default: 'required' },
    ],
    states: [
      { label: 'Collapsed', props: { label: 'Item 1' } },
      { label: 'Expanded',  props: { label: 'Item 1' } },
    ],
    render: (p) => center(
      <div style={{ width: 400, border: '1px solid var(--border-default)', borderRadius: 10, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0, opacity: 0.5 }}>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              <circle cx="4" cy="4"  r="1.2" fill="currentColor"/><circle cx="8" cy="4"  r="1.2" fill="currentColor"/>
              <circle cx="4" cy="8"  r="1.2" fill="currentColor"/><circle cx="8" cy="8"  r="1.2" fill="currentColor"/>
              <circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="8" cy="12" r="1.2" fill="currentColor"/>
            </svg>
          </span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd',sans-serif" }}>
            {p.label ?? 'Item 1'}
          </span>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10.5 3.5l-.7 7a1 1 0 0 1-1 .9H4.2a1 1 0 0 1-1-.9l-.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    ),
    snippet: (p) => `<ItemRow label="${p.label}" onDelete={() => deleteItem(item.id)} />`,
    source: CreateSignalPageSrc,
    files: [{ path: 'src/components/signals/CreateSignalPage.jsx', src: CreateSignalPageSrc }],
    breakdown: {
      icons: ['DragHandle', 'TrashIcon', 'ChevronIcon'],
      colors: [
        { name: 'Row bg',           hex: 'var(--bg-canvas)'          },
        { name: 'Row border',       hex: 'var(--border-default)'     },
        { name: 'Delete hover bg',  hex: 'rgba(229,62,62,0.08)'     },
        { name: 'Delete hover text',hex: '#E53E3E'                   },
        { name: 'Input focus',      hex: 'var(--b100) / #1779F7'     },
      ],
      subComponents: ['TypeDropdown'],
      notes: [
        'Expanded body: 2-col grid 1fr/1.8fr — left has Name+Key+TypeDropdown, right has Description textarea',
        'ChevronIcon rotates 180° via style.transform when open=true (200ms ease)',
        'TrashIcon hover: color → #E53E3E + background → rgba(229,62,62,0.08)',
        'inputBase shared style: bg-canvas, border-input, borderRadius 8, Byrd font',
        'focusBorder / blurBorder handlers on all inputs for interactive border color',
        'e.stopPropagation() on trash click to prevent row toggle',
        'Defined inline in CreateSignalPage.jsx',
      ],
    },
  },

  // ── CreateReportPage sub-components (defined inline in CreateReportPage.jsx) ─

  Section: {
    tier: 'Molecule',
    description: 'Collapsible form section card used in CreateReportPage. Header with uppercase title, optional active-values badge, and ChevronDown toggle. Content animates open/closed via maxHeight transition.',
    props: [
      { name: 'title',       type: 'string',  default: 'required' },
      { name: 'collapsible', type: 'boolean', default: 'false' },
      { name: 'defaultOpen', type: 'boolean', default: 'true' },
      { name: 'badge',       type: 'number',  default: 'undefined' },
    ],
    states: [
      { label: 'Open',            props: { collapsible: true,  defaultOpen: true,  badge: 0 } },
      { label: 'Collapsed',       props: { collapsible: true,  defaultOpen: false, badge: 0 } },
      { label: 'With badge',      props: { collapsible: true,  defaultOpen: true,  badge: 2 } },
      { label: 'Non-collapsible', props: { collapsible: false, defaultOpen: true,  badge: 0 } },
    ],
    render: (p) => center(
      <div style={{ width: 320 }}>
        <CRSection title="Configuration" {...p}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Field content goes here
          </div>
        </CRSection>
      </div>
    ),
    snippet: () => `<Section title="Configuration" collapsible defaultOpen badge={2}>\n  {/* fields */}\n</Section>`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [{ name: 'Active badge', hex: '#1779F7' }],
      subComponents: [],
      notes: ['Defined inline in CreateReportPage.jsx', 'maxHeight: 2000 when open, 0 when closed — 260ms cubic-bezier', 'badge > 0 shows cobalt pill with "N active"'],
    },
  },

  Field: {
    tier: 'Molecule',
    description: 'Form field wrapper with label, optional hint, required asterisk, and InfoTooltip. Stacks label row above children with consistent 7px gap.',
    props: [
      { name: 'label',    type: 'string',    default: 'required' },
      { name: 'hint',     type: 'string',    default: 'undefined' },
      { name: 'required', type: 'boolean',   default: 'false' },
      { name: 'tooltip',  type: 'string',    default: 'undefined' },
    ],
    states: [
      { label: 'Default',          props: { label: 'Report Title',  required: false, hint: undefined,       tooltip: undefined } },
      { label: 'Required',         props: { label: 'Report Title',  required: true,  hint: undefined,       tooltip: undefined } },
      { label: 'With hint',        props: { label: 'Lookback',      required: false, hint: '(optional)',    tooltip: undefined } },
      { label: 'With tooltip',     props: { label: 'Lookback',      required: false, hint: undefined,       tooltip: 'How far back the report should pull data.' } },
    ],
    render: (p) => center(
      <div style={{ width: 280 }}>
        <CRField {...p}>
          <input
            placeholder="Enter value…"
            style={{
              width: '100%', boxSizing: 'border-box', height: 36, padding: '0 12px',
              background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
              borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
              fontFamily: "'Byrd', sans-serif", outline: 'none',
            }}
          />
        </CRField>
      </div>
    ),
    snippet: () => `<Field label="Title" required tooltip="Used as the report heading">\n  <input ... />\n</Field>`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [{ name: 'Required asterisk', hex: '#FF7056' }],
      subComponents: ['InfoTooltip'],
      notes: ['Defined inline in CreateReportPage.jsx', 'Required asterisk uses --c100 (coral)', 'InfoTooltip appears when tooltip prop is passed'],
    },
  },

  Toggle: {
    tier: 'Atom',
    description: 'Animated toggle switch. Cobalt track when on, border-input color when off. Thumb slides with cubic-bezier transition.',
    props: [
      { name: 'checked',  type: 'boolean',  default: 'required' },
      { name: 'onChange', type: 'function', default: 'required' },
    ],
    states: [
      { label: 'On',  props: { checked: true  } },
      { label: 'Off', props: { checked: false } },
    ],
    render: (p) => center(
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CRToggle checked={p.checked} onChange={() => {}} />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
          {p.checked ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    ),
    snippet: () => `<Toggle checked={enabled} onChange={setEnabled} />`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [{ name: 'On state track', hex: '#1779F7' }],
      subComponents: [],
      notes: ['Defined inline in CreateReportPage.jsx', '36×20px pill track', 'Thumb: 16×16px white circle, left: 2→18px, 200ms cubic-bezier'],
    },
  },

  ChoiceGroup: {
    tier: 'Molecule',
    description: 'Unified segmented control + pill radio. variant="seg" renders a sliding pill selector; variant="pill" renders spaced toggle-pill buttons. Both use normalized { value, label } options.',
    props: [
      { name: 'variant', type: "'seg'|'pill'", default: "'seg'" },
      { name: 'options', type: 'Array<{value, label}>', default: 'required' },
      { name: 'value',   type: 'any',          default: 'required' },
      { name: 'onChange', type: 'function',    default: 'required' },
    ],
    states: [
      { label: 'Seg — Daily',   props: { variant: 'seg',  value: 'daily'   } },
      { label: 'Seg — Weekly',  props: { variant: 'seg',  value: 'weekly'  } },
      { label: 'Seg — Monthly', props: { variant: 'seg',  value: 'monthly' } },
      { label: 'Pill — 7d',     props: { variant: 'pill', value: 7         } },
      { label: 'Pill — 30d',    props: { variant: 'pill', value: 30        } },
    ],
    render: (p) => {
      const segOpts  = [
        { value: 'hourly', label: 'Hourly' }, { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' },
      ]
      const pillOpts = [1, 3, 5, 7, 30, 60, 90, 180, 365].map(n => ({ value: n, label: n < 365 ? `${n}d` : '1y' }))
      const opts  = p.variant === 'pill' ? pillOpts : segOpts
      const value = p.value ?? (p.variant === 'pill' ? 7 : 'daily')
      return center(
        <div style={{ width: p.variant === 'pill' ? 320 : 280 }}>
          <CRChoiceGroup variant={p.variant} options={opts} value={value} onChange={() => {}} />
        </div>
      )
    },
    snippet: () => `<ChoiceGroup variant="seg" options={[{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'}]} value={freq} onChange={setFreq} />`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [{ name: 'Active pill border', hex: '#1779F7' }, { name: 'Active pill bg', hex: 'rgba(23,121,247,0.08)' }],
      subComponents: [],
      notes: ['Defined inline in CreateReportPage.jsx', 'seg: sliding indicator via calc() + CSS left transition, 220ms', 'pill: 1.5px border, 30px height, 20px border-radius', 'Replaces both SegControl and PillRadio patterns'],
    },
  },

  Tag: {
    tier: 'Atom',
    description: 'Dismissible tag chip. Shows label text + × remove button. Coral hover on ×. Used for email recipients, prompt exclusions, and selected agent access tags.',
    props: [
      { name: 'label',    type: 'string',   default: 'required' },
      { name: 'onRemove', type: 'function', default: 'required' },
    ],
    states: [
      { label: 'Email',    props: { label: 'alice@example.com' } },
      { label: 'Short',    props: { label: 'Monthly'           } },
      { label: 'Multiple', props: { label: 'multiple'          } },
    ],
    render: (p) => center(
      p.label === 'multiple'
        ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['alice@example.com', 'bob@acme.io', 'Weekly'].map(l => (
              <CRTag key={l} label={l} onRemove={() => {}} />
            ))}
          </div>
        : <CRTag label={p.label} onRemove={() => {}} />
    ),
    snippet: () => `<Tag label="user@example.com" onRemove={() => removeEmail(email)} />`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [{ name: '× hover', hex: '#FF7056' }],
      subComponents: [],
      notes: ['Defined inline in CreateReportPage.jsx', 'maxWidth 260px with text-overflow: ellipsis', '× button: color transition to --c100 on hover'],
    },
  },

  ToggleRow: {
    tier: 'Molecule',
    description: 'Labeled toggle row for Options section. Label + optional subtext on the left, Toggle on the right. Optional InfoTooltip next to label. Bottom border unless noBorder is set.',
    props: [
      { name: 'label',    type: 'string',   default: 'required' },
      { name: 'subtext',  type: 'string',   default: 'undefined' },
      { name: 'checked',  type: 'boolean',  default: 'required' },
      { name: 'onChange', type: 'function', default: 'required' },
      { name: 'noBorder', type: 'boolean',  default: 'false' },
      { name: 'tooltip',  type: 'string',   default: 'undefined' },
    ],
    states: [
      { label: 'On',           props: { checked: true,  label: 'Stick to template?',   subtext: undefined,                        tooltip: undefined,                                   noBorder: false } },
      { label: 'Off',          props: { checked: false, label: 'Stick to template?',   subtext: undefined,                        tooltip: undefined,                                   noBorder: false } },
      { label: 'With subtext', props: { checked: true,  label: 'Experimental Mode',    subtext: 'Enable cutting-edge AI features', tooltip: undefined,                                   noBorder: true  } },
      { label: 'With tooltip', props: { checked: false, label: 'Is AI Accessible',     subtext: undefined,                        tooltip: 'Makes this report available via API.',       noBorder: false } },
    ],
    render: (p) => center(
      <div style={{ width: 300 }}>
        <CRToggleRow {...p} onChange={() => {}} />
      </div>
    ),
    snippet: () => `<ToggleRow label="Stick to template?" tooltip="Prevents AI from deviating from template structure." checked={stick} onChange={setStick} />`,
    source: CreateReportPageSrc,
    files: [{ path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc }],
    breakdown: {
      icons: [],
      colors: [],
      subComponents: ['Toggle', 'InfoTooltip'],
      notes: ['Defined inline in CreateReportPage.jsx', 'padding: 13px 0 with 1px bottom border (omitted when noBorder)', 'Last row in a group should set noBorder'],
    },
  },

  // ── CreateReportPage ────────────────────────────────────────────────────────

  CreateReportPage: {
    tier: 'Organism',
    description: 'Full "Create Report" form page. 3-tier collapsible section layout: Tier 1 (Critical, always open) — Basic Info + Prompts; Tier 2 (Standard, collapsible+open) — Configuration + Recipients; Tier 3 (Advanced, collapsed) — Options + Chart Setup. isDirty guard triggers discard-confirmation modal on back navigation.',
    props: [
      { name: 'sidebarWidth',      type: 'number', default: '272' },
      { name: 'sidebarTransition', type: 'string', default: "''" },
    ],
    states: [
      { label: 'Default', props: {} },
    ],
    render: () => containedPreview(
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        transform: 'scale(0.5)', transformOrigin: 'top left',
        width: '200%', height: '200%',
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <CreateReportPage sidebarWidth={0} />
      </div>,
      260,
    ),
    snippet: () => `<CreateReportPage sidebarWidth={sidebarWidth} sidebarTransition={sidebarTransition} />`,
    source: CreateReportPageSrc,
    files: [
      { path: 'src/components/reports/CreateReportPage.jsx', src: CreateReportPageSrc },
    ],
    breakdown: {
      icons: [],
      colors: [
        { name: 'Cobalt accent / focus ring', hex: '#1779F7' },
        { name: 'Avatar palette — coral',     hex: '#FF7056' },
        { name: 'Avatar palette — cobalt',    hex: '#1779F7' },
        { name: 'Avatar palette — green',     hex: '#4BA373' },
        { name: 'Avatar palette — lavender',  hex: '#D799E2' },
        { name: 'Char counter amber',         hex: '#D97706' },
        { name: 'Char counter red / error',   hex: '#E53E3E' },
      ],
      subComponents: [
        'Section', 'Field', 'ToggleRow', 'Toggle', 'ChoiceGroup',
        'Tag', 'InfoTooltip', 'Button', 'Modal',
      ],
      notes: [
        // ── Sections
        'Tier 1 (Critical, always open): Basic Info, Prompts',
        'Tier 2 (Standard, collapsible+open): Configuration, Recipients',
        'Tier 3 (Advanced, collapsible+closed, active badge): Options, Chart Setup',
        'Section badge = count of non-default values inside that section',

        // ── Basic Info
        'Title char counter: muted → amber at 90 % of 120 chars → red at 100 %; border mirrors the color state',
        'canSave: title.trim() && prompts.some(p => p.trim()) — drives Save Report button',

        // ── Prompts
        'Dynamic prompt rows: add via "+ Add prompt", remove via trash icon; first row cannot be removed',

        // ── Configuration
        'Frequency: Hourly / Daily / Weekly / Monthly — ChoiceGroup variant="seg"',
        'Execution Time: Toggle + time input; default "Midnight (default)"',
        'Lookback Period: [1,3,5,7,30,60,90,180,365] mapped to "Nd" / "1y" labels — ChoiceGroup variant="pill"',
        'Exclusions: Days-of-week multi-select dropdown (Sun–Sat); animated checkbox per row; no date picker',
        'Revisions: free-text input for revision instructions',

        // ── Recipients
        'Notify by Email: Enter / comma to add; EMAIL_RE validation; inline error; dismissible Tag chips',
        'Access Control: agent picker dropdown (max 5); shows avatar (colored initials circle) + name + team; selected agents shown as dismissible tag chips above trigger; trigger greys out + shows "Maximum 5 agents selected" at limit',
        'PROJECT_AGENTS: 9 mock agents with id, name, team — shared with AgentEvalPage MOCK_AGENTS',
        'Avatar: colored circle using avatarColor(name) — same AVATAR_COLORS palette as AgentEvalPage',

        // ── Options
        'Stick to template (tooltip), Is AI Accessible (tooltip), Use Agentic Method (tooltip), Experimental Mode (tooltip + subtext)',

        // ── Chart Setup
        'Chart Prompt: free-text input describing desired visualization',
        'Chart Type: Auto / Line / Bar / Pie — ChoiceGroup variant="seg"',
        'No ChartPreview widget; no Report Format dropdown',

        // ── UX / nav
        'isDirty tracked via d(setter) wrapper on every state change',
        'Back / Cancel trigger tryDiscard() — shows Modal if dirty, navigates directly if clean',
        'navigate() defined at module level using window.history.pushState + popstate event',
        'InfoTooltip: hover ⓘ button → absolute-positioned tooltip bubble (200px wide, z-index 10)',
        'ChoiceGroup unifies SegControl (variant="seg") and PillRadio (variant="pill") with normalized { value, label } options',
      ],
    },
  },
}
