/**
 * ArticlePage — full-page article detail (the "dive in" view).
 * Modeled on ExplorePage: fixed canvas offset by the sidebar, PageHeader with a
 * back button in the left slot, centered reading column. Perplexity-style:
 * narrative + hero figure + sources (calls behind it) + stats + actions +
 * "ask about this article" chat + prev/next navigation.
 */
import PageHeader from '../PageHeader.jsx'
import Button from '../Button.jsx'
import ChatInput from '../ChatInput.jsx'
import { TYPE, articleWhen } from './newsData.js'
import { FONT, SERIF, usePageBg, Kicker, StatGrid, DataTable, renderWidget } from './newsShared.jsx'

function BackBar({ onBack, type }) {
  const label = (TYPE[type] || {}).label || 'News'
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13.5, fontWeight: 600, padding: 0 }}>
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M5.5 1.5 2 6l3.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to News
      </button>
      <span style={{ color: 'var(--n40)' }}>›</span>
      <span style={{ fontSize: 13.5, color: 'var(--c100)', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  )
}

function SourceCard({ who, quote }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: FONT }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--badge-coral-fill)', border: '1px solid var(--badge-coral-text)' }} />{who}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 14, fontStyle: 'italic', lineHeight: 1.45, color: 'var(--text-secondary)' }}>“{quote}”</div>
    </div>
  )
}

export default function ArticlePage({ article, onBack, onPrev, onNext, prevTitle, nextTitle, isMobile = false, sidebarWidth = 272, sidebarTransition = 'none' }) {
  const pageBg = usePageBg()
  const a = article
  const askLeft = isMobile ? '50%' : `calc(50% + ${sidebarWidth / 2}px)`
  const askWidth = isMobile ? 'calc(100% - 3rem)' : `min(720px, calc(100% - ${sidebarWidth}px - 3rem))`

  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
      <div style={{ position: 'absolute', top: 0, left: sidebarWidth, right: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        <PageHeader left={<BackBar onBack={onBack} type={a.type} />} actions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="secondary" size="sm">Share</Button></>} />

        <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 160px' }}>
          <article style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>

            <Kicker type={a.type} showDot />
            <h1 style={{ fontFamily: FONT, fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12, color: 'var(--text-primary)', margin: '12px 0 10px' }}>{a.title}</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: FONT, paddingBottom: 18, marginBottom: 22, borderBottom: '1px solid var(--border-default)' }}>
              By Hear Intelligence · {articleWhen(a).label}
            </div>

            {a.template === 'riskAlert' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--badge-coral-bg)', border: '1px solid var(--badge-coral-bd)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <span style={{ color: 'var(--c100)', fontSize: 16, lineHeight: 1.4 }}>⚠</span>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: FONT, lineHeight: 1.5 }}>Forward-looking risk — this flags a <b>projected</b> breach based on the current trend, not a past event.</div>
              </div>
            )}

            {/* Narrative (serif body) */}
            {(a.body || [a.lede]).map((p, i) => (
              <p key={i} style={{ fontFamily: SERIF, fontSize: 18, lineHeight: 1.62, color: 'var(--text-primary)', margin: '0 0 18px' }}>{p}</p>
            ))}

            {/* Hero figure */}
            {a.widget && (
              <figure style={{ margin: '10px 0 6px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, padding: '18px 20px' }}>
                {renderWidget(a.widget, { height: 190 })}
                {a.legend && (
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
                    {a.legend.map((it, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: FONT }}><i style={{ width: 8, height: 8, borderRadius: 2, background: it.color, display: 'inline-block' }} />{it.label}</span>)}
                  </div>
                )}
              </figure>
            )}

            {/* Recap → report preview panel */}
            {a.template === 'recap' && a.recap && (
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden', margin: '10px 0 6px' }}>
                <div style={{ height: 32, background: '#24425f' }} />
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>{a.recap.headline}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12 }}>
                    {a.recap.kpis.map(([l, v], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: FONT }}>{v}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: FONT }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT, marginTop: 14 }}>The full report and infographic open in Reports.</div>
                </div>
              </div>
            )}

            {/* Stat grid */}
            {a.stats && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden', margin: '14px 0 6px' }}>
                <StatGrid stats={a.stats} />
              </div>
            )}

            {/* Table */}
            {a.table && <div style={{ margin: '18px 0 6px' }}><DataTable cols={a.table.cols} rows={a.table.rows} /></div>}

            {/* Quote */}
            {a.quote && (
              <blockquote style={{ margin: '18px 0', paddingLeft: 18, borderLeft: '3px solid var(--c100)' }}>
                <p style={{ fontFamily: SERIF, fontSize: 22, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0 }}>“{a.quote.text}”</p>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT, marginTop: 10 }}>{a.quote.who}</div>
              </blockquote>
            )}

            {/* Sources */}
            {a.sources && a.sources.length > 0 && (
              <div style={{ marginTop: 26 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, marginBottom: 14 }}>
                  <span>Sources · calls behind this</span><span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                  {a.sources.map((s, i) => <SourceCard key={i} who={s.who} quote={s.quote} />)}
                </div>
              </div>
            )}

            {/* Actions */}
            {a.actions && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--border-default)' }}>
                {a.actions.map((act, i) => <Button key={i} variant={i === 0 ? 'primary' : 'secondary'} size="sm">{act}</Button>)}
              </div>
            )}

            {/* Prev / next */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <NavCard dir="prev" title={prevTitle} onClick={onPrev} />
              <NavCard dir="next" title={nextTitle} onClick={onNext} />
            </div>
          </article>
        </div>
      </div>

      {!isMobile && (
        <div style={{ position: 'fixed', bottom: 24, left: askLeft, transform: 'translateX(-50%)', width: askWidth, zIndex: 50, transition: sidebarTransition }}>
          <ChatInput onSubmit={() => {}} settled />
        </div>
      )}
    </div>
  )
}

function NavCard({ dir, title, onClick }) {
  const isNext = dir === 'next'
  if (!title) return <div style={{ flex: 1 }} />
  return (
    <button onClick={onClick} style={{
      flex: 1, textAlign: isNext ? 'right' : 'left', background: 'var(--bg-card)', border: '1px solid var(--border-default)',
      borderRadius: 12, padding: '14px 16px', cursor: 'pointer', minWidth: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FONT }}>{isNext ? 'Next story ›' : '‹ Previous story'}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: FONT, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
    </button>
  )
}
