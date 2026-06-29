import { useRef } from 'react'
import Badge from '../Badge.jsx'
import PageHeader from '../PageHeader.jsx'

export default function TopicsPage({ isMobile, sidebarWidth = 272, sidebarTransition }) {
  const left = isMobile ? 0 : sidebarWidth
  const iframeRef = useRef(null)

  return (
    <div
      data-inspector="TopicsPage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page Header ── */}
      <PageHeader
        title="Topics"
        crumbs={['Demo inv']}
        badge={<Badge variant="tinted" color="cobalt" shape="pill">13 topics · 23,109 calls</Badge>}
      />

      {/* iframe fills remaining space below the header */}
      <iframe
        ref={iframeRef}
        src="/topics/index.html?v=6"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          display: 'block',
          minHeight: 0,
          marginTop: 4,
        }}
        title="Topics"
        allowFullScreen
      />
    </div>
  )
}
