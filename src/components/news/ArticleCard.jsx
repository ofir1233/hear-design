/**
 * ArticleCard — feed card dispatcher. Renders an article by its `template`:
 *   feature · standard · brief · table · stat · quote · digest
 * The whole card is clickable (→ onOpen), with quick actions that stopPropagation.
 */
import Button from '../Button.jsx'
import { anchorId, articleWhen, evidenceOf } from './newsData.js'
import { FONT, SERIF, Kicker, Meta, N, StatGrid, DataTable, DeepDive, EvidenceLink, renderWidget } from './newsShared.jsx'
import { useLang, t as tr, whenLabel } from './newsI18n.js'

const card = {
  background: 'var(--bg-card)', border: '1px solid var(--border-default)',
  borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
  transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease',
}
function hoverOn(e) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.borderInlineStartColor = 'var(--c100)' }
function hoverOff(e) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderInlineStartColor = 'var(--border-default)' }

const Headline = ({ children, size = 20 }) => (
  <h3 style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.24, color: 'var(--text-primary)', margin: '10px 0 12px' }}>{children}</h3>
)
const Lede = ({ children, clamp }) => (
  <p style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0,
    ...(clamp ? { display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }}>{children}</p>
)

// Explicit call-to-action into the article page (the whole card is clickable too).
// Fill/underline is driven by `.news-card:hover` (see the <style> in NewsV2Page),
// so hovering anywhere on the card activates the CTA.
function ReadCTA({ onOpen, variant = 'button' }) {
  const lang = useLang()
  const arrow = lang === 'he' ? '←' : '→'
  const go = e => { e.stopPropagation(); onOpen && onOpen() }
  if (variant === 'link') {
    return (
      <button className="news-read-link" onClick={go} style={{ marginTop: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 600, fontSize: 12.5, fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {tr('expand', lang)} <span style={{ fontSize: 13 }}>{arrow}</span>
      </button>
    )
  }
  return (
    <button className="news-read-cta" onClick={go}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, fontFamily: FONT, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', transition: 'background 140ms ease, color 140ms ease' }}
    >{tr('expand', lang)} <span style={{ fontSize: 14 }}>{arrow}</span></button>
  )
}

// Card footer = evidence drill-through ("See N calls") + the Expand CTA. The full
// "why you're seeing this" provenance lives on the article page, not every card.
function CardFooter({ article, onOpen }) {
  const ev = evidenceOf(article)
  return (
    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
      <EvidenceLink evidence={ev} onOpen={onOpen} />
      <ReadCTA onOpen={onOpen} />
    </div>
  )
}

export default function ArticleCard({ article, onOpen, hero, gutter = true }) {
  const a = article
  const lang = useLang()
  const open = () => onOpen && onOpen(a)
  // The hero (lead) sits permanently elevated so the hierarchy reads at rest;
  // other cards are flat and lift only on hover.
  const restShadow = hero ? '0 12px 36px rgba(0,0,0,0.10)' : 'none'
  const hoverShadow = hero ? '0 18px 44px rgba(0,0,0,0.14)' : '0 10px 30px rgba(0,0,0,0.08)'
  // Left rail is grey at rest, turns coral on hover (fixed 3px width → no shift).
  const common = {
    id: anchorId(a.id), className: 'news-card', role: 'button', tabIndex: 0, onClick: open,
    onKeyDown: e => { if (e.key === 'Enter') open() },
    onMouseEnter: e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = hoverShadow; e.currentTarget.style.borderInlineStartColor = 'var(--c100)' },
    onMouseLeave: e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = restShadow; e.currentTarget.style.borderInlineStartColor = 'var(--border-default)' },
    style: { ...card, borderInlineStart: '3px solid var(--border-default)', boxShadow: restShadow, marginBottom: gutter ? 20 : 0 },
  }

  // ── feature ── big hero: kicker + serif headline + lede + widget + stat grid
  if (a.template === 'feature') {
    const head = (
      <>
        <Kicker type={a.type} featured={a.featured} showDot />
        <Headline size={hero ? 30 : 26}>{a.title}</Headline>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT, marginBottom: 2 }}>{tr('byline', lang)} · {whenLabel(articleWhen(a).label, lang)}</div>
        {a.lede && <p style={{ fontFamily: SERIF, fontSize: hero ? 19 : 18, lineHeight: 1.55, color: 'var(--text-secondary)', margin: '10px 0 2px', maxWidth: 760 }}>{a.lede}</p>}
      </>
    )
    const chart = a.widget && <div>{renderWidget(a.widget, hero ? { height: 200 } : {})}{a.legend && <Legend items={a.legend} />}</div>
    return (
      <article {...common}>
        {hero && a.widget ? (
          // 2-column hero: text beside the chart (news-lead style)
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, padding: '26px 28px 16px', alignItems: 'center' }}>
            <div>{head}</div>
            <div>{chart}</div>
          </div>
        ) : (
          <>
            <div style={{ padding: '24px 26px 8px' }}>{head}</div>
            {a.widget && <div style={{ padding: '14px 26px 10px' }}>{chart}</div>}
          </>
        )}
        <StatGrid stats={a.stats} />
        <div style={{ padding: '10px 26px 22px' }}><CardFooter article={a} onOpen={open} /></div>
      </article>
    )
  }

  // ── standard ── medium: headline + short lede + one contained widget
  if (a.template === 'standard') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          {a.lede && <Lede clamp={2}>{a.lede}</Lede>}
          {a.widget && (
            <div style={{ marginTop: 16 }}>
              {renderWidget(a.widget)}{a.legend && <Legend items={a.legend} />}
            </div>
          )}          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── table ── headline + lede + compact data table
  if (a.template === 'table') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          {a.lede && <Lede clamp={2}>{a.lede}</Lede>}
          <div style={{ marginTop: 14 }}><DataTable cols={a.table.cols} rows={a.table.rows} /></div>          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── stat ── one big number + delta
  if (a.template === 'stat') {
    const s = a.stat || {}
    const dtone = s.deltaTone === 'positive' ? 'var(--g100)' : s.deltaTone === 'attention' ? 'var(--c100)' : 'var(--text-muted)'
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '12px 0 4px' }}>
            <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}<small style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-muted)' }}>{s.unit}</small></span>
            {s.delta && <span style={{ fontSize: 13, fontWeight: 700, color: dtone }}>{s.delta}</span>}
          </div>
          <Meta items={[s.caption, ...(a.meta || [])].filter(Boolean)} />
          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── quote ── pulled transcript blockquote
  if (a.template === 'quote') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          <blockquote style={{ margin: '12px 0 4px', paddingInlineStart: 16, borderInlineStart: '3px solid var(--border-default)' }}>
            <p style={{ fontFamily: SERIF, fontSize: 19, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0 }}>“{a.quote.text}”</p>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT, marginTop: 8 }}>{a.quote.who}</div>
          </blockquote>          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── digest ── ranked list of minor items
  if (a.template === 'digest') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px 10px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          {a.lede && <Lede>{a.lede}</Lede>}
        </div>
        <div>
          {a.digest.map((r, i) => {
            const color = r.tone === 'attention' ? 'var(--c100)' : r.tone === 'positive' ? 'var(--g100)' : 'var(--text-muted)'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 24px', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ flex: '0 0 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT }}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', fontFamily: FONT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: FONT }}>{r.count}</span>
                <span style={{ flex: '0 0 auto', minWidth: 52, textAlign: 'right', fontSize: 12, fontWeight: 700, color, fontFamily: FONT }}>{r.delta}</span>
              </div>
            )
          })}
        </div>
        <div style={{ padding: '8px 24px 22px' }}><CardFooter article={a} onOpen={open} /></div>
      </article>
    )
  }

  // ── rootCause ── headline + lede + causal chain widget
  if (a.template === 'rootCause') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <Kicker type={a.type} showDot />
          <Headline>{a.title}</Headline>
          {a.lede && <Lede clamp={2}>{a.lede}</Lede>}
          {a.widget && <div style={{ marginTop: 16 }}>{renderWidget(a.widget)}</div>}          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── riskAlert ── forward-looking warning callout
  if (a.template === 'riskAlert') {
    return (
      <article {...common}>
        <div style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--c100)', fontSize: 15 }}>⚠</span>
            <Kicker type={a.type} showDot />
          </div>
          <Headline>{a.title}</Headline>
          {a.lede && <Lede clamp={3}>{a.lede}</Lede>}
          {a.widget && <div style={{ marginTop: 16 }}>{renderWidget(a.widget)}</div>}          <CardFooter article={a} onOpen={open} />
        </div>
      </article>
    )
  }

  // ── recap ── links the full Monthly Trends Report + infographic
  if (a.template === 'recap') {
    return (
      <article {...common}>
        <div style={{ display: 'flex', gap: 16, padding: '22px 24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Kicker type={a.type} showDot />
            <Headline>{a.title}</Headline>
            {a.lede && <Lede clamp={2}>{a.lede}</Lede>}
            {a.recap?.kpis && (
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 14 }}>
                {a.recap.kpis.map(([l, v], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: FONT }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: FONT }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
            <CardFooter article={a} onOpen={open} />
          </div>
          <div style={{ flex: '0 0 120px' }}><InfographicThumb /></div>
        </div>
      </article>
    )
  }

  // ── brief (default) ── headline + lede, no chart
  return (
    <article {...common}>
      <div style={{ padding: '22px 24px' }}>
        <Kicker type={a.type} showDot />
        <Headline>{a.title}</Headline>
        {a.lede && <Lede clamp={3}>{a.lede}</Lede>}
        <div style={{ marginTop: 12 }}><Meta items={a.meta} /></div>
        <CardFooter article={a} onOpen={open} />
      </div>
    </article>
  )
}

// Compact card for multi-across rows (light items: brief/stat/quote/digest).
export function MiniCard({ article, onOpen }) {
  const a = article
  const open = () => onOpen && onOpen(a)
  return (
    <article
      className="news-card"
      role="button" tabIndex={0} onClick={open}
      onKeyDown={e => { if (e.key === 'Enter') open() }}
      onMouseEnter={hoverOn} onMouseLeave={hoverOff}
      style={{ ...card, borderInlineStart: '3px solid var(--border-default)', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 18px' }}
    >
      <Kicker type={a.type} showDot />
      <h3 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.28, margin: '8px 0 6px', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</h3>
      {a.template === 'quote' ? (
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>“{a.quote?.text}”</p>
      ) : a.template === 'stat' ? (
        <div style={{ marginTop: 2 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: FONT }}>{a.stat?.value}<small style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{a.stat?.unit}</small></span>
          {a.stat?.delta && <span style={{ marginInlineStart: 8, fontSize: 12, fontWeight: 700, color: 'var(--g100)' }}>{a.stat.delta}</span>}
        </div>
      ) : (
        <div style={{ marginTop: 'auto' }}><Meta items={(a.meta || []).slice(0, 2)} /></div>
      )}
      <ReadCTA onOpen={open} variant="link" />
    </article>
  )
}

// Abstract thumbnail evoking the platform's report infographic (navy header + blocks).
function InfographicThumb() {
  const blk = { background: 'var(--bg-active)', borderRadius: 3 }
  return (
    <div style={{ width: '100%', minHeight: 128, borderRadius: 10, border: '1px solid var(--border-default)', overflow: 'hidden', background: 'var(--bg-card)' }}>
      <div style={{ height: 20, background: '#24425f' }} />
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ ...blk, flex: 1, height: 26 }} />)}</div>
        <div style={{ ...blk, height: 6, width: '80%' }} />
        <div style={{ ...blk, height: 6, width: '55%' }} />
        <div style={{ display: 'flex', gap: 4 }}><div style={{ ...blk, flex: 2, height: 20 }} /><div style={{ ...blk, flex: 1, height: 20 }} /></div>
      </div>
    </div>
  )
}

// Small legend row (used when an article widget carries series colors).
function Legend({ items }) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: FONT }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: it.color, display: 'inline-block' }} />{it.label}
        </span>
      ))}
    </div>
  )
}
