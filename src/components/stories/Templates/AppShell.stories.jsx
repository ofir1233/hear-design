/**
 * Templates/App Shell
 *
 * Tier: Templates — macro layout demonstrating how Organisms compose a full page.
 *
 * Full application layout: Sidebar organism (fixed 272px) +
 * main content region (margin-left: 272px).
 *
 * This story contains no application logic — it is a structural template
 * for verifying spatial relationships, responsive breakpoints, and
 * correct organism composition.
 *
 * Organisms composed:
 *   Organisms/Sidebar  (fixed left rail)
 */
import Sidebar from '../../Sidebar.jsx'

function ContentPlaceholder({ note = '272px sidebar offset · #EFEFED canvas' }) {
  return (
    <div style={{
      marginLeft: 272,
      minHeight: '100vh',
      background: '#EFEFED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF7056, #FF4785)',
        opacity: 0.3,
      }} />
      <p style={{ fontFamily: "'Byrd', sans-serif", fontSize: 16, color: '#9ca3af', fontWeight: 400 }}>
        Main content area
      </p>
      <p style={{ fontFamily: "'Byrd', sans-serif", fontSize: 12, color: '#c4c4c4' }}>
        {note}
      </p>
    </div>
  )
}

function MobileContent({ note }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#EFEFED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF7056, #FF4785)',
        opacity: 0.3,
      }} />
      <p style={{ fontFamily: "'Byrd', sans-serif", fontSize: 16, color: '#9ca3af' }}>
        Full-width content
      </p>
      <p style={{ fontFamily: "'Byrd', sans-serif", fontSize: 12, color: '#c4c4c4' }}>
        {note}
      </p>
    </div>
  )
}

export default {
  title: 'Templates/App Shell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Templates** — Macro layout shell. No application logic. ' +
          'Demonstrates how `Organisms/Sidebar` (fixed, 272px) composes with the main content region (`margin-left: 272px`). ' +
          '\n\n**Organisms composed:** `Organisms/Sidebar`. ' +
          '\n\nUse this story for layout QA, spatial validation, and responsive breakpoint inspection.',
      },
    },
  },
}

/** Desktop layout (1280px) — sidebar + content area at full resolution. */
export const Desktop = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder note="272px sidebar offset · #EFEFED canvas" />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
}

/** Wide layout (1440px) — content region expands, sidebar remains fixed at 272px. */
export const Wide = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder note="Wide (1440px) · sidebar fixed, content region expands" />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'wide' },
  },
}

/** Tablet (768px) — fixed sidebar leaves ~496px for content. Verify no overflow. */
export const Tablet = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder note="Tablet (768px) · 272px sidebar → ~496px content" />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: 'Fixed 272px sidebar on 768px viewport leaves ~496px content column. Verify no horizontal overflow.',
      },
    },
  },
}

/** Mobile (375px) — drawer closed, sidebar off-screen, content fills full width. */
export const MobileDrawerClosed = {
  render: () => (
    <>
      <Sidebar isMobile={true} mobileOpen={false} />
      <MobileContent note="Mobile · sidebar hidden · tap hamburger to reveal" />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: '`isMobile=true, mobileOpen=false` — sidebar is off-screen, content fills full viewport width.',
      },
    },
  },
}

/** Mobile (375px) — drawer open, sidebar slides in with backdrop. */
export const MobileDrawerOpen = {
  render: () => (
    <>
      <Sidebar isMobile={true} mobileOpen={true} />
      <MobileContent note="Mobile · drawer open · backdrop covers content" />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: '`isMobile=true, mobileOpen=true` — sidebar slides in, dark backdrop covers content. Backdrop click fires `onMobileClose`.',
      },
    },
  },
}
