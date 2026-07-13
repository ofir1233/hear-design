/**
 * SectionNav — sticky "In this edition" table-of-contents on the left.
 * Lists the surfaces present in the feed; highlights the section you're currently
 * scrolled into (tracked by section BLOCK position, so it stays accurate even
 * though featured stories at the top belong to lower sections). Click to jump.
 */
import { FONT } from './newsShared.jsx'
import { useLang, t as tr, sectionLabel } from './newsI18n.js'

export default function TimelineRail({ sections, activeKey, onJump }) {
  const lang = useLang()
  return (
    <nav aria-label="Sections" style={{ position: 'sticky', top: 20, alignSelf: 'flex-start', width: 172, flex: '0 0 172px', paddingTop: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, marginBottom: 12, paddingInlineStart: 16 }}>{tr('in_this_edition', lang)}</div>
      {sections.map(s => {
        const active = s.key === activeKey
        return (
          <button
            key={s.key}
            onClick={() => onJump(s.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'start',
              background: 'none', border: 'none', cursor: 'pointer', padding: '9px 0 9px 16px',
              borderInlineStart: `2px solid ${active ? s.accent : 'var(--border-default)'}`,
              transition: 'border-color 140ms ease',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.accent, opacity: active ? 1 : 0.5, flex: '0 0 auto', transition: 'opacity 140ms ease' }} />
            <span style={{ fontSize: 13, fontFamily: FONT, lineHeight: 1.25, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 500 }}>{sectionLabel(s.key, s.label, lang)}</span>
          </button>
        )
      })}
    </nav>
  )
}
