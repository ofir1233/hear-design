/**
 * Layout/App Shell
 *
 * Full application layout composition: Sidebar + main content area.
 * Demonstrates the spatial relationship between the fixed 272px sidebar
 * and the main content region that must account for it via margin-left.
 *
 * Used for: layout QA, spacing validation, responsive breakpoint testing.
 */
import Sidebar from '../../Sidebar.jsx'

function ContentPlaceholder() {
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
      <p style={{
        fontFamily: "'Byrd', sans-serif",
        fontSize: 16,
        color: '#9ca3af',
        fontWeight: 400,
      }}>
        Main content area
      </p>
      <p style={{
        fontFamily: "'Byrd', sans-serif",
        fontSize: 12,
        color: '#c4c4c4',
      }}>
        272px sidebar offset · #EFEFED canvas
      </p>
    </div>
  )
}

export default {
  title: 'Layout/App Shell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full shell composition: `Sidebar` (fixed, 272px) + main content region (`margin-left: 272px`). ' +
          'Use this story for layout QA, spatial validation, and responsive breakpoint inspection.',
      },
    },
  },
}

/** Desktop full layout — sidebar + content area. */
export const Desktop = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
}

/** Wide layout — content region expands, sidebar remains fixed. */
export const Wide = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'wide' },
  },
}

/** Tablet — sidebar still fixed but content region is tighter. */
export const Tablet = {
  render: () => (
    <>
      <Sidebar isMobile={false} mobileOpen={false} />
      <ContentPlaceholder />
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}
