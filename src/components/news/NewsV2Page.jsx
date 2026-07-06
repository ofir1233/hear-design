/**
 * NewsV2Page — newspaper-homepage feed.
 *
 * Layout: two columns — left "In this edition" section nav + feed. Wayfinding via
 *   BOTH the nav (jump + active highlight) and sticky section headers.
 *   Masthead → BreakingStrip → HERO (top featured) → Top stories →
 *   Daily-briefing KPI strip → SECTION BLOCKS by platform surface.
 *
 * Every card is clickable → onOpenArticle(article) → full ArticlePage.
 * Data comes from newsData.js; the nav syncs to scroll position by section block.
 */
import { useState, useEffect, useRef } from 'react'
import PageHeader from '../PageHeader.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import { ARTICLES, SECTIONS, sectionOf } from './newsData.js'
import { FONT, usePageBg, SectionEyebrow } from './newsShared.jsx'
import ArticleCard from './ArticleCard.jsx'
import BreakingStrip from './BreakingStrip.jsx'
import SectionBlock from './SectionBlock.jsx'
import TimelineRail from './TimelineRail.jsx'

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

// One connected KPI plate: cells share a single bordered panel, split by dividers.
function KpiTile({ label, value, delta, tone, idx = 0, total = 4, isMobile }) {
  const color = tone === 'attention' ? 'var(--c100)' : tone === 'positive' ? 'var(--g100)' : 'var(--text-muted)'
  const rightDiv = isMobile ? idx % 2 === 0 : idx < total - 1
  const bottomDiv = isMobile ? idx < 2 : false
  return (
    <div style={{ padding: '16px 20px', borderRight: rightDiv ? '1px solid var(--border-default)' : 'none', borderBottom: bottomDiv ? '1px solid var(--border-default)' : 'none' }}>
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

  const featured = ARTICLES.filter(a => a.featured)
  const hero = featured[0]
  const topStories = featured.slice(1)
  const feed = ARTICLES.filter(a => !a.featured)
  const sectionArticles = (key) => feed.filter(a => sectionOf(a) === key)
  const presentSections = SECTIONS.filter(s => feed.some(a => sectionOf(a) === s.key))

  // Highlight the section whose block is currently pinned at the top. Tracked by
  // section BLOCK (not article) so the featured hero/top-stories region above the
  // sections doesn't mis-point the nav — the old rail's core bug.
  const scrollRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const onScroll = () => {
      const base = root.getBoundingClientRect().top
      let current = null
      for (const s of presentSections) {
        const el = document.getElementById(`section-${s.key}`)
        if (el && el.getBoundingClientRect().top - base <= 80) current = s.key
      }
      setActiveSection(current)
    }
    root.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => root.removeEventListener('scroll', onScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const onJumpSection = (key) => {
    const el = document.getElementById(`section-${key}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
      <style>{`
        .news-read-cta { background: transparent; color: var(--c100); border: 1px solid var(--c100); }
        .news-card:hover .news-read-cta, .news-read-cta:hover { background: var(--c100); color: #fff; }
        .news-read-link { color: var(--c100); }
        .news-card:hover .news-read-link { text-decoration: underline; }
      `}</style>
      <div style={{ position: 'absolute', top: 0, insetInlineStart: sidebarWidth, insetInlineEnd: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        <PageHeader
          title="News"
          crumbs={['Demo inv']}
          badge={<Badge variant="tinted" color="coral" shape="soft" uppercase={false}>feed · illustrative data</Badge>}
          actions={<><FilterPill>📅 Last 7 days ▾</FilterPill><FilterPill>Surface ▾</FilterPill><Button variant="secondary" size="sm">Share</Button></>}
        />

        <div ref={scrollRef} className="smooth-scroll" style={{ flex: 1, marginTop: 1, overflowY: 'auto', padding: '0 24px 56px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', display: 'flex', gap: 28, alignItems: 'flex-start', paddingTop: 20 }}>
            {!isMobile && <TimelineRail sections={presentSections} activeKey={activeSection} onJump={onJumpSection} />}
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
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
                  {[
                    { label: 'Calls handled', value: '1,284', delta: '↑ 12% vs 7-day avg', tone: 'neutral' },
                    { label: 'Avg sentiment', value: '72%', delta: '↑ 3 pts', tone: 'positive' },
                    { label: 'Escalations', value: '23', delta: '↓ 8%', tone: 'positive' },
                    { label: 'Top agent CSAT', value: '94%', delta: 'Martha Kellett', tone: 'neutral' },
                  ].map((k, i, arr) => <KpiTile key={i} {...k} idx={i} total={arr.length} isMobile={isMobile} />)}
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
    </div>
  )
}
