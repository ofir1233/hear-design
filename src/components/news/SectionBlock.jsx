/**
 * SectionBlock — a labeled "easy find" band (Ynet-style section header + cards).
 * Header: accent dot + surface label + accent rule + "More ›"; then the section's
 * article cards.
 */
import ArticleCard, { MiniCard } from './ArticleCard.jsx'
import { FONT } from './newsShared.jsx'

// Chart/prose stories lead the section (full width, stacked); the lighter items
// flow into a compact multi-across row of MiniCards below.
const RICH = new Set(['feature', 'standard', 'table', 'rootCause', 'recap', 'riskAlert'])

export default function SectionBlock({ section, articles, onOpen, onMore }) {
  if (!articles || !articles.length) return null
  const rich = articles.filter(a => RICH.has(a.template))
  const light = articles.filter(a => !RICH.has(a.template))
  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: section.accent, flex: '0 0 auto' }} />
        <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>{section.label}</h2>
        <span style={{ flex: 1, height: 2, background: section.accent, opacity: 0.22, borderRadius: 2 }} />
        <button onClick={onMore} style={{ flex: '0 0 auto', fontSize: 12, fontWeight: 600, color: 'var(--color-interactive)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>More ›</button>
      </div>

      {rich.map(a => <ArticleCard key={a.id} article={a} onOpen={onOpen} />)}

      {light.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, alignItems: 'stretch' }}>
          {light.map(a => <MiniCard key={a.id} article={a} onOpen={onOpen} />)}
        </div>
      )}
    </section>
  )
}
