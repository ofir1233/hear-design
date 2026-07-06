/**
 * SectionNav — sticky table-of-contents for the feed. The five platform surfaces
 * as jump links; highlights the section currently in view. No dates/times/dots —
 * pure orientation + navigation (the data is period-aggregated, so a per-item
 * "timeline" would imply precision the report doesn't have).
 */
import { SECTIONS, sectionOf } from './newsData.js'
import { FONT } from './newsShared.jsx'

export default function TimelineRail({ articles, activeId, onJump }) {
  const present = SECTIONS
    .map(s => ({ s, items: articles.filter(a => sectionOf(a) === s.key) }))
    .filter(g => g.items.length)
  const activeArticle = articles.find(a => a.id === activeId)
  const activeSection = activeArticle ? sectionOf(activeArticle) : null

  return (
    <nav aria-label="Sections" style={{ position: 'sticky', top: 88, alignSelf: 'flex-start', width: 168, flex: '0 0 168px', paddingTop: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, marginBottom: 10, paddingInlineStart: 16 }}>In this edition</div>
      {present.map(({ s, items }) => {
        const active = s.key === activeSection
        return (
          <button
            key={s.key}
            onClick={() => onJump(items[0].id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'start',
              background: 'none', border: 'none', cursor: 'pointer', padding: '9px 0 9px 16px',
              borderInlineStart: `2px solid ${active ? s.accent : 'var(--border-default)'}`,
              transition: 'border-color 140ms ease',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.accent, opacity: active ? 1 : 0.5, flex: '0 0 auto', transition: 'opacity 140ms ease' }} />
            <span style={{ fontSize: 13, fontFamily: FONT, lineHeight: 1.25, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 500 }}>{s.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
