/**
 * Foundations/Iconography
 *
 * Tier: Foundations — the complete icon inventory of the Hear design system.
 *
 * All icons live in src/components/icons/index.jsx and are imported here.
 * Developers can copy the import snippet shown on each card directly into
 * their component:
 *
 *   import { MicIcon, HomeIcon } from './icons'
 *   (path is relative to src/components/ — adjust for your file location)
 */

import {
  HomeIcon, DataIcon, ReportsIcon, SignalsIcon, AlertsIcon, ComplianceIcon,
  AgentIcon, KnowledgeIcon, AiTaskIcon, CustomersIcon, SettingsIcon,
  BellIcon, ChevronIcon, CollapseArrow, DotsIcon,
  MoonIcon, AccessibilityIcon, LogoutIcon,
  MicIcon, SubmitIcon, AttachIcon, ReturnIcon, NavigateIcon, EscIcon,
} from '../../icons'

// ─── Google icon (third-party brand, not in our icons/) ───────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

// ─── Hear logo variants (own component file, not in icons/) ───────────────────
function HearLogoCoral() {
  return (
    <svg viewBox="0 0 69 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="#FF7056"/>
    </svg>
  )
}

// ─── Card & Section layout ────────────────────────────────────────────────────

const ICON_SIZE = 40

function IconCard({ name, exportName, colorNote, bg = 'transparent', thirdParty = false, children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '20px 12px 14px',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      minWidth: 130,
    }}>
      {/* Icon */}
      <div style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        borderRadius: bg !== 'transparent' ? 8 : 0,
        color: '#181818',
        padding: bg !== 'transparent' ? 6 : 0,
      }}>
        {children}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#181818', marginBottom: 2 }}>{name}</div>

        {/* Color badge */}
        {colorNote && (
          <div style={{
            marginBottom: 8,
            fontSize: 9,
            color: '#fff',
            background: colorNote === 'currentColor' ? '#6b7280' : '#FF7056',
            borderRadius: 4,
            padding: '1px 5px',
            display: 'inline-block',
          }}>
            {colorNote}
          </div>
        )}

        {/* Import snippet */}
        {exportName && (
          <div style={{
            marginTop: 4,
            fontSize: 9,
            fontFamily: 'monospace',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: 4,
            padding: '3px 6px',
            color: '#374151',
            textAlign: 'left',
            lineHeight: 1.5,
          }}>
            {'{ '}{exportName}{' }'}
          </div>
        )}
        {thirdParty && (
          <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 4 }}>third-party brand</div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #e5e7eb',
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {children}
      </div>
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Iconography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'hear-light' },
    docs: {
      description: {
        component:
          '**Tier: Foundations** — Complete icon inventory for the Hear design system. ' +
          'All icons are exported from `src/components/icons/index.jsx`. ' +
          '\n\n**How to use:** Copy the `{ ExportName }` snippet from any card, then:\n\n' +
          '```js\nimport { MicIcon, HomeIcon } from \'./icons\'\n// (path relative to src/components/ — adjust for your location)\n```' +
          '\n\n**Color convention:** ' +
          'Icons marked `currentColor` inherit the text color of their parent — tint freely with CSS `color`. ' +
          'Icons with a specific hex badge have that color hardcoded in the SVG path.',
      },
    },
  },
}

/** All icons grouped by category. Each card shows the named export to copy. */
export const AllIcons = {
  render: () => (
    <div style={{ maxWidth: 960, fontFamily: "'Byrd', sans-serif" }}>

      <Section title="Brand">
        <IconCard name="Hear Logo (Coral)" colorNote="#FF7056">
          <HearLogoCoral />
        </IconCard>
        <IconCard name="Hear Logo (White)" colorNote="#FFFFFF" bg="#181818">
          {/* Exported from HearLogo.jsx as default — use <HearLogo className="..." /> */}
          <svg viewBox="0 0 69 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="white"/>
          </svg>
        </IconCard>
      </Section>

      <Section title="Navigation — Sidebar">
        <IconCard name="Dashboard" exportName="HomeIcon" colorNote="currentColor"><HomeIcon /></IconCard>
        <IconCard name="Data" exportName="DataIcon" colorNote="currentColor"><DataIcon /></IconCard>
        <IconCard name="Reports" exportName="ReportsIcon" colorNote="currentColor"><ReportsIcon /></IconCard>
        <IconCard name="Signals" exportName="SignalsIcon" colorNote="currentColor"><SignalsIcon /></IconCard>
        <IconCard name="Alerts" exportName="AlertsIcon" colorNote="currentColor"><AlertsIcon /></IconCard>
        <IconCard name="Compliance" exportName="ComplianceIcon" colorNote="currentColor"><ComplianceIcon /></IconCard>
        <IconCard name="Agent Eval" exportName="AgentIcon" colorNote="currentColor"><AgentIcon /></IconCard>
        <IconCard name="Knowledge" exportName="KnowledgeIcon" colorNote="currentColor"><KnowledgeIcon /></IconCard>
        <IconCard name="AI Task" exportName="AiTaskIcon" colorNote="currentColor"><AiTaskIcon /></IconCard>
        <IconCard name="Customers" exportName="CustomersIcon" colorNote="currentColor"><CustomersIcon /></IconCard>
        <IconCard name="Settings" exportName="SettingsIcon" colorNote="currentColor"><SettingsIcon /></IconCard>
      </Section>

      <Section title="UI Controls">
        <IconCard name="Bell" exportName="BellIcon" colorNote="#383838"><BellIcon /></IconCard>
        <IconCard name="Chevron" exportName="ChevronIcon" colorNote="currentColor"><ChevronIcon open={false} /></IconCard>
        <IconCard name="Collapse" exportName="CollapseArrow" colorNote="currentColor"><CollapseArrow collapsed={false} /></IconCard>
        <IconCard name="More (Dots)" exportName="DotsIcon" colorNote="currentColor"><DotsIcon /></IconCard>
      </Section>

      <Section title="User Actions">
        <IconCard name="Dark Mode" exportName="MoonIcon" colorNote="#A6A6A6"><MoonIcon /></IconCard>
        <IconCard name="Accessibility" exportName="AccessibilityIcon" colorNote="#A6A6A6"><AccessibilityIcon /></IconCard>
        <IconCard name="Logout" exportName="LogoutIcon" colorNote="#A6A6A6"><LogoutIcon /></IconCard>
      </Section>

      <Section title="Chat Input">
        <IconCard name="Microphone" exportName="MicIcon" colorNote="currentColor"><MicIcon /></IconCard>
        <IconCard name="Submit" exportName="SubmitIcon" colorNote="#007AFF"><SubmitIcon /></IconCard>
        <IconCard name="Attach" exportName="AttachIcon" colorNote="#3C3C3C"><AttachIcon /></IconCard>
        <IconCard name="Return ↵" exportName="ReturnIcon" colorNote="currentColor"><ReturnIcon /></IconCard>
        <IconCard name="Navigate ↑↓" exportName="NavigateIcon" colorNote="currentColor"><NavigateIcon /></IconCard>
        <IconCard name="ESC" exportName="EscIcon" colorNote="currentColor"><EscIcon /></IconCard>
      </Section>

      <Section title="Third-party">
        <IconCard name="Google" thirdParty={true}>
          <div style={{ width: ICON_SIZE, height: ICON_SIZE }}><GoogleIcon /></div>
        </IconCard>
      </Section>

    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Every icon in the system. Grey badge = `currentColor` (tints freely). Coral badge = hardcoded color in SVG path.',
      },
    },
  },
}

/** Navigation icons only — useful for sidebar design review. */
export const Navigation = {
  render: () => (
    <div style={{ fontFamily: "'Byrd', sans-serif" }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <IconCard name="Dashboard" exportName="HomeIcon" colorNote="currentColor"><HomeIcon /></IconCard>
        <IconCard name="Data" exportName="DataIcon" colorNote="currentColor"><DataIcon /></IconCard>
        <IconCard name="Reports" exportName="ReportsIcon" colorNote="currentColor"><ReportsIcon /></IconCard>
        <IconCard name="Signals" exportName="SignalsIcon" colorNote="currentColor"><SignalsIcon /></IconCard>
        <IconCard name="Alerts" exportName="AlertsIcon" colorNote="currentColor"><AlertsIcon /></IconCard>
        <IconCard name="Compliance" exportName="ComplianceIcon" colorNote="currentColor"><ComplianceIcon /></IconCard>
        <IconCard name="Agent Eval" exportName="AgentIcon" colorNote="currentColor"><AgentIcon /></IconCard>
        <IconCard name="Knowledge" exportName="KnowledgeIcon" colorNote="currentColor"><KnowledgeIcon /></IconCard>
        <IconCard name="AI Task" exportName="AiTaskIcon" colorNote="currentColor"><AiTaskIcon /></IconCard>
        <IconCard name="Customers" exportName="CustomersIcon" colorNote="currentColor"><CustomersIcon /></IconCard>
        <IconCard name="Settings" exportName="SettingsIcon" colorNote="currentColor"><SettingsIcon /></IconCard>
      </div>
    </div>
  ),
}

/** currentColor icons on brand Coral — confirms they tint correctly. */
export const OnBrandColor = {
  render: () => (
    <div style={{ background: '#FF7056', padding: 24, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 16, fontFamily: "'Byrd', sans-serif" }}>
      {[
        ['Dashboard', <HomeIcon />],
        ['Data', <DataIcon />],
        ['Reports', <ReportsIcon />],
        ['Alerts', <AlertsIcon />],
        ['Compliance', <ComplianceIcon />],
        ['Knowledge', <KnowledgeIcon />],
        ['Customers', <CustomersIcon />],
        ['Settings', <SettingsIcon />],
        ['Mic', <MicIcon />],
        ['Return', <ReturnIcon />],
        ['Navigate', <NavigateIcon />],
        ['ESC', <EscIcon />],
      ].map(([name, icon]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 32, height: 32, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`currentColor` icons inherit white when placed on Coral `#FF7056` — no overrides needed. Icons with hardcoded fills (BellIcon, MoonIcon, AttachIcon, SubmitIcon) are excluded.',
      },
    },
  },
}
