/**
 * NewsPage — "News" tab (placed after Chat).
 *
 * Editorial, restrained feed of auto-detected events: a curated front page,
 * a "this week at a glance" widget grid, a quiet list, then a long timeline
 * where notable events carry inline chart widgets.
 *
 * Design principles (v2 — decluttered):
 *   - COLOR ENCODES PRIORITY in the chrome (attention coral · positive green ·
 *     neutral gray) — one cue per row. Category = quiet text kicker.
 *   - Inside a chart, DS categorical hues are allowed (legitimate data-viz).
 *   - Meta is plain middot text; generous vertical rhythm.
 */
import { useState, useEffect } from 'react'
import PageHeader from '../PageHeader.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import ChatInput from '../ChatInput.jsx'
import { TrendWidget, StackedBarsWidget, PassRateBarsWidget, WidgetLegend } from './widgets/NewsWidgets.jsx'

const FONT = "'Byrd', sans-serif"

const TYPE = {
  spike:      { label: 'Topic Spike',     tone: 'attention' },
  compliance: { label: 'Compliance',      tone: 'attention' },
  storm:      { label: 'Alert Storm',     tone: 'attention' },
  anomaly:    { label: 'Anomaly',         tone: 'neutral' },
  emergent:   { label: 'Emergent Theme',  tone: 'neutral' },
  outlier:    { label: 'Outlier Call',    tone: 'neutral' },
  volume:     { label: 'Volume Mix',      tone: 'neutral' },
  benchmark:  { label: 'Benchmark',       tone: 'neutral' },
  milestone:  { label: 'Agent Milestone', tone: 'positive' },
  sentiment:  { label: 'Sentiment',       tone: 'positive' },
  resolution: { label: 'Resolution',      tone: 'positive' },
}
const TONE_COLOR = { attention: 'var(--c100)', positive: 'var(--g100)', neutral: 'var(--n40)' }

function usePageBg() {
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.dataset.theme === 'dark'))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark ? 'var(--bg-canvas)' : '#F9F9F7'
}

function Kicker({ type, featured, showDot }) {
  const t = TYPE[type]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 16 }}>
      {showDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: TONE_COLOR[t.tone], flexShrink: 0 }} />}
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: FONT }}>{t.label}</span>
      {featured && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--c100)', fontFamily: FONT }}>· Featured</span>}
    </div>
  )
}

function Meta({ items }) {
  return (
    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: FONT, lineHeight: 1.5 }}>
      {items.map((x, i) => <span key={i}>{i > 0 && <span style={{ margin: '0 8px', opacity: 0.6 }}>·</span>}{x}</span>)}
    </div>
  )
}
const N = ({ children }) => <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{children}</span>

function FilterPill({ children }) {
  return <button style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '6px 13px', cursor: 'pointer', fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{children}</button>
}

function SectionEyebrow({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, margin: '4px 0 18px' }}>
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
    </div>
  )
}

function Stat({ label, value, tone }) {
  const color = tone === 'up' ? 'var(--c100)' : tone === 'down' ? 'var(--g100)' : 'var(--text-primary)'
  return (
    <div style={{ padding: '14px 20px', borderRight: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, marginTop: 3, color, fontFamily: FONT }}>{value}</div>
    </div>
  )
}

// Compact KPI tile for the "at a glance" strip (numbers only — no charts).
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

const DeepDive = () => <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--color-interactive)', cursor: 'pointer' }}>Deep dive ›</span>

// Rich "front page" card — chart + stat grid + actions (the lead-card layout, reusable).
function FeaturedCard({ type, title, headerActions, widget, stats, footer }) {
  return (
    <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--c100)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 22px 8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Kicker type={type} featured showDot />
          <div style={{ fontSize: 27, lineHeight: 1.18, fontWeight: 700, letterSpacing: '-0.015em', marginTop: 10, color: 'var(--text-primary)' }}>{title}</div>
        </div>
        {headerActions && <div style={{ display: 'flex', gap: 8, flexShrink: 0, paddingTop: 2 }}>{headerActions}</div>}
      </div>
      {widget && <div style={{ padding: '12px 22px 6px' }}>{widget}</div>}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border-default)', marginTop: 8 }}>
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
      )}
      {footer && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px' }}>{footer}</div>}
    </article>
  )
}

// Dense list section — a different rhythm from the hero cards.
function TrendingTopics() {
  const rows = [
    { name: 'Cancellation & churn', count: '312 calls', delta: '↑ 240%', tone: 'attention' },
    { name: 'Pricing complaints', count: '128 calls', delta: '↑ 34%', tone: 'attention' },
    { name: 'Refund status', count: '140 calls', delta: '↑ 12%', tone: 'neutral' },
    { name: 'Baggage fees', count: '88 calls', delta: '↑ 18%', tone: 'neutral' },
    { name: 'Competitor mentions', count: '41 calls', delta: 'new', tone: 'attention' },
  ]
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden' }}>
      {rows.map((r, i) => {
        const color = r.tone === 'attention' ? 'var(--c100)' : r.tone === 'positive' ? 'var(--g100)' : 'var(--text-muted)'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderTop: i > 0 ? '1px solid var(--border-default)' : 'none' }}>
            <span style={{ flex: '0 0 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT }}>{i + 1}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', fontFamily: FONT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: FONT }}>{r.count}</span>
            <span style={{ flex: '0 0 auto', minWidth: 52, textAlign: 'right', fontSize: 12, fontWeight: 700, color, fontFamily: FONT }}>{r.delta}</span>
          </div>
        )
      })}
    </div>
  )
}

function TimelineItem({ time, type, featured, title, meta, widget, actions, last }) {
  const tone = TYPE[type].tone
  const pageBg = usePageBg()
  return (
    <div style={{ position: 'relative', padding: '20px 0 24px', borderTop: last === 'first' ? 'none' : '1px solid var(--border-default)' }}>
      <div style={{ position: 'absolute', left: -104, width: 60, textAlign: 'right', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', top: 20, fontFamily: FONT }}>{time}</div>
      <div style={{
        position: 'absolute', left: -33, top: 23, width: 10, height: 10, borderRadius: '50%',
        background: tone === 'neutral' ? pageBg : TONE_COLOR[tone],
        border: `2px solid ${TONE_COLOR[tone]}`, boxShadow: `0 0 0 3px ${pageBg}`,
      }} />
      <Kicker type={type} featured={featured} />
      <h4 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '8px 0 8px', lineHeight: 1.32, color: 'var(--text-primary)', fontFamily: FONT }}>{title}</h4>
      <Meta items={meta} />
      {widget && <div style={{ maxWidth: 460, marginTop: 14, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '14px 16px' }}>{widget}</div>}
      {actions && <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>{actions}</div>}
    </div>
  )
}

export default function NewsPage({ isMobile = false, sidebarWidth = 272, sidebarTransition = 'none' }) {
  const pageBg = usePageBg()
  const askLeft = isMobile ? '50%' : `calc(50% + ${sidebarWidth / 2}px)`
  const askWidth = isMobile ? 'calc(100% - 3rem)' : `min(720px, calc(100% - ${sidebarWidth}px - 3rem))`
  const btn = (v, l) => <Button variant={v} size="sm">{l}</Button>

  const TIMELINE = [
    {
      day: 'Thursday · Jul 2',
      items: [
        { time: '4:12pm', type: 'spike', featured: true, title: 'Cancellation mentions surged 240% vs. baseline', meta: [<><N>312</N> calls</>, 'Teams B, C', 'peak Wed 2pm'],
          actions: [['secondary', '+ Create Signal'], ['ghost', 'Open in Data']] },
        { time: '2:30pm', type: 'anomaly', title: 'Team B average handle time jumped 40%', meta: [<>deviation <N>2.3σ</N></>, 'afternoon'] },
        { time: '11:05am', type: 'outlier', title: 'One 47-minute escalation worth reading', meta: ['single call', 'sentiment −0.7'] },
      ],
    },
    {
      day: 'Wednesday · Jul 1',
      items: [
        { time: '3:40pm', type: 'emergent', featured: true, title: 'Customers naming a competitor by name — new', meta: [<><N>41</N> calls</>, 'no matching Signal'],
          actions: [['secondary', '+ Create Signal'], ['ghost', 'Share']] },
        { time: '1:10pm', type: 'resolution', title: 'First-contact resolution climbed to 72% on Team A', meta: ['week over week', '+5 pts'] },
        { time: '9:15am', type: 'milestone', title: 'Agent Dana crossed 90 on empathy — first time', meta: ['Agent Evaluation', '+6 pts'] },
      ],
    },
    {
      day: 'Tuesday · Jun 30',
      items: [
        { time: '10:20am', type: 'storm', featured: true, title: 'Fraud-pattern alerts spiked to 18× in two hours', meta: ['9–11am', 'high severity', <><N>3</N> agents</>],
          actions: [['secondary', 'Review alert rule'], ['ghost', 'Open in Data']] },
        { time: '8:05am', type: 'sentiment', title: 'Positive sentiment up 12% on Team A', meta: ['week over week'] },
      ],
    },
    {
      day: 'Monday · Jun 29',
      items: [
        { time: '5:02pm', type: 'compliance', featured: true, title: 'Five missed cooling-off disclosures across three agents', meta: ['High risk', <><N>5</N> flags</>],
          actions: [['secondary', 'Open in Data'], ['ghost', 'Assign workflow']] },
        { time: '11:40am', type: 'benchmark', title: 'Team A now resolves 20% faster than Team C', meta: ['handle time', 'trailing 30 days'] },
        { time: '9:00am', type: 'anomaly', title: 'Silence time on Refunds calls rose to 10%', meta: [<>deviation <N>1.8σ</N></>, 'target 6%'] },
      ],
    },
    {
      day: 'Sunday · Jun 28',
      items: [
        { time: '4:20pm', type: 'volume', title: 'Booking-status calls made up 31% of weekend volume', meta: [<><N>3,832</N> calls</>] },
        { time: '10:15am', type: 'emergent', title: 'A cluster of baggage-fee confusion appeared overnight', meta: [<><N>28</N> calls</>, 'new'] },
      ],
    },
    {
      day: 'Saturday · Jun 27',
      items: [
        { time: '3:05pm', type: 'milestone', title: 'Team C average CSAT reached its 90-day high', meta: ['4.3 / 5', '90-day high'] },
        { time: '12:30pm', type: 'sentiment', title: 'Frustration language dropped after the script update', meta: ['−9% vs last week'] },
        { time: '8:45am', type: 'outlier', title: 'A single call drove a 5-star follow-up review', meta: ['single call'] },
      ],
    },
    {
      day: 'Friday · Jun 26',
      items: [
        { time: '6:10pm', type: 'compliance', title: 'KYC adherence held at 98% for the week', meta: ['stable', 'no new flags'] },
        { time: '2:00pm', type: 'spike', title: 'Refund-status questions ticked up 18%', meta: [<><N>140</N> calls</>, 'watch'] },
      ],
    },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
    <div style={{ position: 'absolute', top: 0, left: sidebarWidth, right: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
      <PageHeader
        title="News"
        crumbs={['Demo inv']}
        badge={<Badge variant="tinted" color="coral" shape="soft" uppercase={false}>18 events · this week</Badge>}
        actions={<><FilterPill>📅 Last 7 days ▾</FilterPill><FilterPill>Type ▾</FilterPill><Button variant="secondary" size="sm">Share</Button></>}
      />

      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 160px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', width: '100%' }}>

          <SectionEyebrow>Highlights · Jun 26 – Jul 2, 2026</SectionEyebrow>

          <FeaturedCard
            type="spike"
            title="Cancellation mentions surged 240% over the 30-day baseline"
            headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">+ Create Signal</Button></>}
            widget={<TrendWidget height={150} peakLabel="Fri · 312" data={[30, 32, 28, 40, 44, 96, 74, 66, 80]} labels={['Mon', '', 'Wed', '', 'Fri', '', 'Sun']} peakIndex={5} baseline={40} />}
            stats={[
              { label: 'Calls affected', value: '312' },
              { label: 'vs baseline', value: '↑ 240%', tone: 'up' },
              { label: 'Peak', value: 'Wed 2:00pm' },
              { label: 'Top teams', value: 'B, C' },
              { label: 'Avg sentiment', value: '−0.4', tone: 'down' },
              { label: 'Matching signal', value: 'None yet' },
            ]}
            footer={<><Button variant="ghost" size="sm">Open 312 calls in Data</Button><Button variant="ghost" size="sm">Assign workflow</Button><DeepDive /></>}
          />

          <p style={{ fontSize: 16, lineHeight: 1.62, color: 'var(--text-secondary)', margin: '18px 0 28px' }}>
            A sharp cluster of churn-intent language concentrated Wednesday afternoon, driven largely by{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Teams B and C</span>. The most common phrasing
            references the new pricing tier and difficulty reaching support. No existing Signal captures this pattern yet.
          </p>

          {/* ── THIS WEEK AT A GLANCE — calm KPI strip ── */}
          <div style={{ marginTop: 40 }}>
            <SectionEyebrow>This week at a glance</SectionEyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
              <KpiTile label="Alerts this week" value="107" delta="↑ 31% vs last week" tone="attention" />
              <KpiTile label="Call volume" value="12,540" delta="↑ 4% vs last week" tone="neutral" />
              <KpiTile label="Compliance flags" value="5" delta="high risk · 3 agents" tone="attention" />
              <KpiTile label="First-contact resolution" value="72%" delta="↑ 5 pts" tone="positive" />
            </div>
          </div>

          {/* ── MONITORING — a hero card, separated from the lead by the KPI strip ── */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Monitoring</SectionEyebrow>
            <FeaturedCard
              type="storm"
              title="Fraud-pattern alerts spiked to 18× in two hours"
              headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">+ Create Alert</Button></>}
              widget={<><StackedBarsWidget /><WidgetLegend items={[{ color: 'var(--c80)', label: 'Third Party' }, { color: 'var(--h100)', label: 'Info Violation' }, { color: 'var(--t100)', label: 'Legal' }]} /></>}
              stats={[
                { label: 'Alerts fired', value: '18' },
                { label: 'Window', value: '9–11am' },
                { label: 'Severity', value: 'High', tone: 'up' },
                { label: 'Agents', value: '3' },
                { label: 'Top pattern', value: 'Third Party' },
                { label: 'vs last week', value: '↑ 31%', tone: 'up' },
              ]}
              footer={<><Button variant="ghost" size="sm">Open in Data</Button><Button variant="ghost" size="sm">Review alert rule</Button><DeepDive /></>}
            />
          </div>

          {/* ── TRENDING TOPICS — dense list, different rhythm ── */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Trending topics</SectionEyebrow>
            <TrendingTopics />
          </div>

          {/* ── COMPLIANCE WATCH — hero card, separated by the list above ── */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Compliance watch</SectionEyebrow>
            <FeaturedCard
              type="compliance"
              title="Five missed cooling-off disclosures across three agents"
              headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">Assign owner</Button></>}
              widget={<PassRateBarsWidget />}
              stats={[
                { label: 'Missed flags', value: '5', tone: 'up' },
                { label: 'Agents', value: '3' },
                { label: 'Worst criterion', value: 'Cooling-off' },
                { label: 'Criterion rate', value: '82%', tone: 'up' },
                { label: 'Overall risk', value: 'High', tone: 'up' },
                { label: 'Reviewer', value: 'Anouk' },
              ]}
              footer={<><Button variant="ghost" size="sm">Open in Data</Button><Button variant="ghost" size="sm">Assign workflow</Button><DeepDive /></>}
            />
          </div>

          {/* ── ALSO THIS WEEK ── */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Also this week</SectionEyebrow>
            {[
              { type: 'emergent', title: 'Customers are naming a competitor by name — first seen this week', meta: [<><N>41</N> calls</>, 'brand-new, no matching Signal', 'Wed'] },
              { type: 'milestone', title: 'Agent Dana crossed 90 on empathy for the first time', meta: ['Agent Evaluation', 'Wed'] },
              { type: 'resolution', title: 'First-contact resolution climbed to 72% on Team A', meta: ['+5 pts', 'Wed'] },
              { type: 'anomaly', title: 'Silence time on Refunds calls rose to 10%', meta: ['deviation 1.8σ', 'Mon'] },
              { type: 'outlier', title: 'A single 5-star follow-up review traced to one Saturday call', meta: ['single call', 'Sat'] },
            ].map((m, i) => (
              <div key={i} style={{ padding: '20px 0 22px', borderTop: '1px solid var(--border-default)' }}>
                <Kicker type={m.type} showDot />
                <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '8px 0 8px', lineHeight: 1.3, color: 'var(--text-primary)' }}>{m.title}</h3>
                <Meta items={m.meta} />
              </div>
            ))}
          </div>

          {/* ── FULL TIMELINE ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '48px 0 4px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Full timeline · all 18 events</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          </div>

          {TIMELINE.map((group, gi) => (
            <div key={gi}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '32px 0 4px' }}>{group.day}</div>
              <div style={{ position: 'relative', marginLeft: 80, paddingLeft: 28, borderLeft: '1px solid var(--border-default)' }}>
                {group.items.map((it, ii) => (
                  <TimelineItem key={ii} {...it} last={ii === 0 ? 'first' : undefined} actions={it.actions?.map(([v, l], j) => <Button key={j} variant={v} size="sm">{l}</Button>)} />
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '28px 0 4px' }}>↓ scroll for earlier events…</div>
        </div>
      </div>
    </div>

      {/* floating chat box — reuse the platform ChatInput from the chat screen */}
      {!isMobile && (
        <div style={{ position: 'fixed', bottom: 24, left: askLeft, transform: 'translateX(-50%)', width: askWidth, zIndex: 50, transition: sidebarTransition }}>
          <ChatInput onSubmit={() => {}} settled />
        </div>
      )}
    </div>
  )
}
