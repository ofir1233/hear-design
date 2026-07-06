/**
 * NewsV2Page — newspaper-homepage feed.
 *
 * Layout: [ sticky section-aware TimelineRail ] [ feed column ]
 *   Masthead → BreakingStrip → HERO (top featured) → Top stories →
 *   Daily-briefing KPI strip → SECTION BLOCKS by platform surface.
 *
 * Every card is clickable → onOpenArticle(article) → full ArticlePage.
 * Data comes from newsData.js; the rail syncs to scroll position by section.
 */
import { useState, useEffect, useRef } from 'react'
import PageHeader from '../PageHeader.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import ChatInput from '../ChatInput.jsx'
import { ARTICLES, SECTIONS, sectionOf, anchorId } from './newsData.js'
import { FONT, usePageBg, SectionEyebrow } from './newsShared.jsx'
import TimelineRail from './TimelineRail.jsx'
import ArticleCard from './ArticleCard.jsx'
import BreakingStrip from './BreakingStrip.jsx'
import SectionBlock from './SectionBlock.jsx'

function Masthead({ count = `${ARTICLES.length} stories` }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, borderBottom: '1px solid var(--text-primary)', paddingBottom: 14, marginBottom: 22 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, marginBottom: 8 }}>Conversation Intelligence</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--text-primary)' }}>The Daily Signal</div>
      </div>
      <div style={{ textAlign: 'end', flexShrink: 0, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, lineHeight: 1.7 }}>
        <div>Daily edition</div>
        <div>Jul 2 · covers Jun 25 – Jul 2</div>
        <div>Demo inv · {count}</div>
      </div>
    </div>
  )
}

function KpiTile({ label, value, delta, tone }) {
  const color = tone === 'attention' ? 'var(--c100)' : tone === 'positive' ? 'var(--g100)' : 'var(--text-muted)'
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', margin: '6px 0 5px', fontFamily: FONT }}>{value}</div>
      {delta && <div style={{ fontSize: 12, fontWeight: 600, color, fontFamily: FONT }}>{delta}</div>}
    </div>
  )
}

function FilterPill({ children }) {
  return <button style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '6px 13px', cursor: 'pointer', fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{children}</button>
}

export default function NewsV2Page({ isMobile = false, sidebarWidth = 272, sidebarTransition = 'none', onOpenArticle }) {
  const pageBg = usePageBg()
  const scrollRef = useRef(null)
  const [activeId, setActiveId] = useState(ARTICLES[0]?.id ?? null)
  const askLeft = isMobile ? '50%' : `calc(50% + ${sidebarWidth / 2}px)`
  const askWidth = isMobile ? 'calc(100% - 3rem)' : `min(720px, calc(100% - ${sidebarWidth}px - 3rem))`

  // Sync the rail's active marker to the article currently near the top of view.
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const els = ARTICLES.map(a => document.getElementById(anchorId(a.id))).filter(Boolean)
    if (!els.length) return
    const tops = new Map()
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) tops.set(e.target.id, e.boundingClientRect.top)
        else tops.delete(e.target.id)
      })
      let best = null, bestTop = Infinity
      tops.forEach((top, id) => { if (top < bestTop) { bestTop = top; best = id } })
      if (best) setActiveId(best.replace('article-', ''))
    }, { root, rootMargin: '-80px 0px -55% 0px', threshold: 0 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const onJump = (id) => {
    const el = document.getElementById(anchorId(id))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const featured = ARTICLES.filter(a => a.featured)
  const hero = featured[0]
  const topStories = featured.slice(1)
  const feed = ARTICLES.filter(a => !a.featured)
  const sectionArticles = (key) => feed.filter(a => sectionOf(a) === key)

  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
      <div style={{ position: 'absolute', top: 0, insetInlineStart: sidebarWidth, insetInlineEnd: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        <PageHeader
          title="News"
          crumbs={['Demo inv']}
          badge={<Badge variant="tinted" color="coral" shape="soft" uppercase={false}>feed · illustrative data</Badge>}
          actions={<><FilterPill>📅 Last 7 days ▾</FilterPill><FilterPill>Surface ▾</FilterPill><Button variant="secondary" size="sm">Share</Button></>}
        />

        <div ref={scrollRef} className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 160px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

            {!isMobile && <TimelineRail articles={ARTICLES} activeId={activeId} onJump={onJump} />}

            <div style={{ flex: 1, minWidth: 0 }}>
              <Masthead />
              <BreakingStrip />

              {hero && <ArticleCard article={hero} onOpen={onOpenArticle} hero />}

              {topStories.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <SectionEyebrow>Top stories</SectionEyebrow>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16, alignItems: 'start' }}>
                    {topStories.map(a => <ArticleCard key={a.id} article={a} onOpen={onOpenArticle} gutter={false} />)}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 26 }}>
                <SectionEyebrow>Daily briefing · at a glance</SectionEyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
                  <KpiTile label="Calls handled" value="1,284" delta="↑ 12% vs 7-day avg" tone="neutral" />
                  <KpiTile label="Avg sentiment" value="72%" delta="↑ 3 pts" tone="positive" />
                  <KpiTile label="Escalations" value="23" delta="↓ 8%" tone="positive" />
                  <KpiTile label="Top agent CSAT" value="94%" delta="Martha Kellett" tone="neutral" />
                </div>
              </div>

              {SECTIONS.map(s => (
                <SectionBlock key={s.key} section={s} articles={sectionArticles(s.key)} onOpen={onOpenArticle} onMore={() => {}} />
              ))}

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '34px 0 4px' }}>You're all caught up.</div>
            </div>
          </div>
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
