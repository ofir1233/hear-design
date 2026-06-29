import { Fragment } from 'react'

/**
 * Navigation/PageHeader — the canonical floating top bar.
 *
 * Design-system spec (components_header.html):
 *   - Floats: 12px gutters (never edge-to-edge), 16px radius, 1px border
 *   - Height 56px · padding 0 13px · background var(--bg-card) (white)
 *   - Breadcrumb: 13.5px · page title 600 / current · muted links · chevron separators
 *   - Actions portal on the right
 *
 * Usage:
 *   <PageHeader title="Data" crumbs={['Demo inv']} badge={<Badge…/>} actions={<…/>} />
 *   <PageHeader left={<custom/>} actions={<…/>} />            // escape hatch
 *   <PageHeader … secondary={<TabsRow/>} />                    // two-row header
 */

function Chevron() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 1.5 5 6 1.5 10.5" stroke="var(--n40)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PageHeader({ title, crumbs = [], badge, actions, left, secondary }) {
  return (
    <div style={{ flexShrink: 0, margin: '16px 16px 0' }}>
      <div
        data-inspector="PageHeader"
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          height: 56, padding: '0 13px',
          background: 'var(--bg-card)',
          border: 'var(--page-header-border)',
          boxShadow: 'var(--page-header-shadow)',
          borderRadius: 16,
          ...(secondary ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : null),
          fontFamily: "'Byrd', sans-serif",
        }}
      >
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {left ?? (
            <>
              {title && (
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {title}
                </span>
              )}
              {crumbs.map((c, i) => (
                <Fragment key={i}>
                  <Chevron />
                  <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>
                    {c}
                  </span>
                </Fragment>
              ))}
              {badge != null && (
                <>
                  <Chevron />
                  {badge}
                </>
              )}
            </>
          )}
        </nav>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>

      {secondary}
    </div>
  )
}
