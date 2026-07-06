/**
 * SectionBlock — a labeled "easy find" band (Ynet-style section header + cards).
 * Header: accent dot + surface label + accent rule + "More ›"; then the section's
 * article cards.
 */
import ArticleCard, { MiniCard } from './ArticleCard.jsx'
import { FONT, usePageBg } from './newsShared.jsx'

// Chart/prose stories lead the section (full width, stacked); the lighter items
// flow into a compact multi-across row of MiniCards below.
const RICH = new Set(['feature', 'standard', 'table', 'rootCause', 'recap', 'riskAlert'])

export default function SectionBlock({ section, articles, onOpen }) {
  const pageBg = usePageBg()
  if (!articles || !articles.length) return null
  const rich = articles.filter(a => RICH.has(a.template))
  const light = articles.filter(a => !RICH.has(a.template))
  return (
    <section id={`section-${section.key}`} style={{ marginTop: 46 }}>
      {/* Sticky header: labels where you are as you scroll through this section. */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: pageBg, display: 'flex', alignItems: 'center', padding: '14px 0 12px', marginBottom: 16, borderBottom: '1px solid var(--border-default)', boxShadow: `0 8px 12px -10px rgba(0,0,0,0.18)` }}>
        <h2 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>{section.label}</h2>
      </div>

      {rich.map(a => <ArticleCard key={a.id} article={a} onOpen={onOpen} />)}

      {light.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          {light.map(a => <MiniCard key={a.id} article={a} onOpen={onOpen} />)}
        </div>
      )}
    </section>
  )
}
