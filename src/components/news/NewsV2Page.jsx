/**
 * NewsV2Page — "News V2" tab.
 *
 * Real-use-case rebuild: every event is grounded in an actual platform surface
 * (Signals, Alerts/Monitoring, AI Tasks, Compliance, Agent Evaluation, Reports,
 * Workflows, Customers, Daily Briefing) from the platform feature/value map, and
 * mapped to the chart that surface actually uses.
 *
 * NOTE: all numbers here are ILLUSTRATIVE placeholders (prototype). Real values
 * are a later pass — field/metric NAMES are real, values are mock.
 *
 * Color = priority (attention coral · positive green · neutral gray).
 */
import { useState, useEffect } from 'react'
import PageHeader from '../PageHeader.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import ChatInput from '../ChatInput.jsx'
import {
  TrendWidget, StackedBarsWidget, PassRateBarsWidget, StatusBarWidget,
  GaugeWidget, DonutWidget, BulletWidget, CompareLinesWidget, WidgetLegend,
} from './widgets/NewsV2Widgets.jsx'

const FONT = "'Byrd', sans-serif"

// type → { kicker label, tone }. Kicker names the platform surface.
const TYPE = {
  spike:      { label: 'Signals · Spike',    tone: 'attention' },
  storm:      { label: 'Monitoring · Storm', tone: 'attention' },
  approval:   { label: 'AI Tasks',           tone: 'attention' },
  compliance: { label: 'Compliance',         tone: 'attention' },
  anomaly:    { label: 'Anomaly',            tone: 'neutral' },
  emergent:   { label: 'Signals · Emerging', tone: 'neutral' },
  outlier:    { label: 'Outlier Call',       tone: 'neutral' },
  volume:     { label: 'Volume Mix',         tone: 'neutral' },
  benchmark:  { label: 'Agent Eval',         tone: 'neutral' },
  signal:     { label: 'Signals',            tone: 'neutral' },
  report:     { label: 'Reports',            tone: 'neutral' },
  cohort:     { label: 'Customers',          tone: 'neutral' },
  workflow:   { label: 'Workflows',          tone: 'neutral' },
  milestone:  { label: 'Agent Eval · Milestone', tone: 'positive' },
  sentiment:  { label: 'Sentiment',          tone: 'positive' },
  resolution: { label: 'Resolution',         tone: 'positive' },
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

// Widget framed in a section card (lighter than a hero card).
function WidgetSection({ type, title, meta, children }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '18px 20px' }}>
      <Kicker type={type} showDot />
      <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', margin: '9px 0 14px', lineHeight: 1.28, color: 'var(--text-primary)', fontFamily: FONT }}>{title}</h3>
      {children}
      {meta && <div style={{ marginTop: 14 }}><Meta items={meta} /></div>}
    </div>
  )
}

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

export default function NewsV2Page({ isMobile = false, sidebarWidth = 272, sidebarTransition = 'none' }) {
  const pageBg = usePageBg()
  const askLeft = isMobile ? '50%' : `calc(50% + ${sidebarWidth / 2}px)`
  const askWidth = isMobile ? 'calc(100% - 3rem)' : `min(720px, calc(100% - ${sidebarWidth}px - 3rem))`

  const TIMELINE = [
    {
      day: 'Thursday · Jul 2',
      items: [
        { time: '4:12pm', type: 'milestone', title: 'Agent Dana crossed 90 on the Empathy evaluation category', meta: ['Agent Evaluation', 'first time'],
          widget: <GaugeWidget value={90} label="Empathy" delta="+6 pts" /> },
        { time: '2:30pm', type: 'workflow', title: 'Callback ticket cycle time rose past the 48h SLA', meta: ['Workflows', <>avg <N>61h</N></>],
          widget: <BulletWidget metric="61h" delta="↑ 27%" fillPct={82} targetPct={58} sub="avg cycle time · SLA 48h · velocity ↓" /> },
        { time: '11:05am', type: 'outlier', title: 'One 47-minute escalation flagged by the transcript summarizer', meta: ['single call', 'sentiment −0.7'] },
      ],
    },
    {
      day: 'Wednesday · Jul 1',
      items: [
        { time: '3:40pm', type: 'signal', title: 'Tommy generated a new signal: “Refund escalation risk”', meta: ['Signals', 'AI-generated', 'review to activate'],
          actions: [['secondary', 'Review signal'], ['ghost', 'Edit']] },
        { time: '1:10pm', type: 'resolution', title: 'First-contact resolution climbed to 72% on Team A', meta: ['+5 pts', 'week over week'],
          widget: <DonutWidget value={72} label="312 of 433" sub="resolved first-contact" color="var(--g100)" /> },
        { time: '9:15am', type: 'report', title: 'Weekly Trend Report ran — pricing complaints called out as top driver', meta: ['Reports', 'scheduled', 'emailed to 4'],
          actions: [['secondary', 'Open report'], ['ghost', 'View infographic']] },
      ],
    },
    {
      day: 'Tuesday · Jun 30',
      items: [
        { time: '2:05pm', type: 'sentiment', title: 'Frustration language dropped 9% after the script update', meta: ['Sentiment signal', 'week over week'] },
        { time: '10:40am', type: 'cohort', title: '12 repeat-complaint customers surfaced this week', meta: ['Customers', <><N>3+</N> interactions</>, 'churn watch'],
          actions: [['secondary', 'Open cohort'], ['ghost', 'Export']] },
        { time: '8:05am', type: 'anomaly', title: 'Silence time on Refunds calls rose to 10%', meta: ['deviation 1.8σ', 'target 6%'] },
      ],
    },
    {
      day: 'Monday · Jun 29',
      items: [
        { time: '5:02pm', type: 'emergent', title: 'Customers naming a competitor by name — no signal captures it yet', meta: [<><N>41</N> calls</>, 'first seen this week'],
          actions: [['secondary', '+ Create Signal'], ['ghost', 'Share']] },
        { time: '11:20am', type: 'storm', title: '“Distressed Client” monitor triggered for the first time', meta: ['Monitoring', 'new monitor', 'Slack + email'] },
        { time: '9:00am', type: 'compliance', title: 'KYC adherence held at 98% — no new flags', meta: ['Compliance', 'stable'] },
      ],
    },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
    <div style={{ position: 'absolute', top: 0, left: sidebarWidth, right: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
      <PageHeader
        title="News V2"
        crumbs={['Demo inv']}
        badge={<Badge variant="tinted" color="coral" shape="soft" uppercase={false}>real use cases · illustrative data</Badge>}
        actions={<><FilterPill>📅 Last 7 days ▾</FilterPill><FilterPill>Surface ▾</FilterPill><Button variant="secondary" size="sm">Share</Button></>}
      />

      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 160px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', width: '100%' }}>

          <SectionEyebrow>Highlights · Jun 26 – Jul 2, 2026</SectionEyebrow>

          {/* SIGNALS — a signal's hit-rate spiking (Signals engine, execution-count) */}
          <FeaturedCard
            type="spike"
            title="“Cancellation intent” signal is firing on 240% more calls than its 30-day average"
            headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">Edit signal</Button></>}
            widget={<TrendWidget height={150} peakLabel="Fri · peak" data={[30, 32, 28, 40, 44, 96, 74, 66, 80]} labels={['Mon', '', 'Wed', '', 'Fri', '', 'Sun']} peakIndex={5} baseline={40} />}
            stats={[
              { label: 'Signal', value: 'Cancellation intent' },
              { label: 'Hit rate', value: '12% of calls', tone: 'up' },
              { label: 'vs 30-day avg', value: '↑ 240%', tone: 'up' },
              { label: 'Runs this week', value: '2,540' },
              { label: 'Top segment', value: 'Teams B, C' },
              { label: 'Report template', value: 'Churn brief' },
            ]}
            footer={<><Button variant="ghost" size="sm">Open in Data</Button><Button variant="ghost" size="sm">Run report</Button><DeepDive /></>}
          />

          <p style={{ fontSize: 16, lineHeight: 1.62, color: 'var(--text-secondary)', margin: '18px 0 28px' }}>
            A sharp cluster of churn-intent extractions concentrated Wednesday afternoon, largely{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Teams B and C</span>. Phrasing references
            the new pricing tier and support wait times — no dedicated Signal captures the competitor angle yet.
          </p>

          {/* DAILY BRIEFING → KPI strip */}
          <div style={{ marginTop: 8 }}>
            <SectionEyebrow>Daily briefing · at a glance</SectionEyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
              <KpiTile label="Calls handled" value="1,284" delta="↑ 12% vs 7-day avg" tone="neutral" />
              <KpiTile label="Avg sentiment" value="72%" delta="↑ 3 pts" tone="positive" />
              <KpiTile label="Escalations" value="23" delta="↓ 8%" tone="positive" />
              <KpiTile label="Top agent CSAT" value="94%" delta="Martha Kellett" tone="neutral" />
            </div>
          </div>

          {/* MONITORING — alert storm (over-time bar chart) */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Monitoring</SectionEyebrow>
            <FeaturedCard
              type="storm"
              title="“Third Party” monitor triggered 18× in two hours"
              headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">Adjust triggers</Button></>}
              widget={<><StackedBarsWidget /><WidgetLegend items={[{ color: 'var(--c80)', label: 'Third Party' }, { color: 'var(--h100)', label: 'Info Violation' }, { color: 'var(--t100)', label: 'Legal & Regulatory' }]} /></>}
              stats={[
                { label: 'Monitor', value: 'Third Party' },
                { label: 'Triggered (24h)', value: '47', tone: 'up' },
                { label: 'vs daily avg', value: '↑ 3×', tone: 'up' },
                { label: 'Channels', value: 'Slack · Email' },
                { label: 'On-alert action', value: 'Create task' },
                { label: 'Last fired', value: '12m ago' },
              ]}
              footer={<><Button variant="ghost" size="sm">Open in Monitoring</Button><Button variant="ghost" size="sm">Assign to ticket</Button><DeepDive /></>}
            />
          </div>

          {/* TRENDING TOPICS — dense list */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Trending topics</SectionEyebrow>
            <TrendingTopics />
          </div>

          {/* AI TASKS — approval backlog (awaiting/approved/completed/rejected) → NEW StatusBar */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>AI Tasks</SectionEyebrow>
            <FeaturedCard
              type="approval"
              title="393 AI-suggested actions are awaiting your approval"
              headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">Review in AI Tasks</Button></>}
              widget={<StatusBarWidget />}
              stats={[
                { label: 'Awaiting', value: '393', tone: 'up' },
                { label: 'Approved (wk)', value: '210' },
                { label: 'Completed', value: '176' },
                { label: 'Rejected', value: '24' },
                { label: 'Oldest pending', value: '3 days' },
                { label: 'Auto-verify', value: 'On' },
              ]}
              footer={<><Button variant="ghost" size="sm">Bulk approve</Button><Button variant="ghost" size="sm">View audit trail</Button><DeepDive /></>}
            />
          </div>

          {/* AGENT EVALUATION — multi-agent time-series (benchmark) */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Agent performance</SectionEyebrow>
            <WidgetSection type="benchmark" title="Team A is pulling ahead of B and C on handle time" meta={['Agent Evaluation', 'trailing 30 days']}>
              <CompareLinesWidget />
            </WidgetSection>
          </div>

          {/* COMPLIANCE — agent × criteria (PassRateBars) */}
          <div style={{ marginTop: 44 }}>
            <SectionEyebrow>Compliance watch</SectionEyebrow>
            <FeaturedCard
              type="compliance"
              title="Cooling-off disclosures slipped to 82% — three agents driving it"
              headerActions={<><Button variant="secondary" size="sm">☆ Follow</Button><Button variant="primary" size="sm">Assign owner</Button></>}
              widget={<PassRateBarsWidget />}
              stats={[
                { label: 'Worst criterion', value: 'Cooling-off' },
                { label: 'Criterion rate', value: '82%', tone: 'up' },
                { label: 'Flags this week', value: '5', tone: 'up' },
                { label: 'Agents', value: '3' },
                { label: 'Overall risk', value: 'High', tone: 'up' },
                { label: '30-day trend', value: '↓ 4 pts', tone: 'up' },
              ]}
              footer={<><Button variant="ghost" size="sm">Open Compliance</Button><Button variant="ghost" size="sm">Assign workflow</Button><DeepDive /></>}
            />
          </div>

          {/* FULL TIMELINE — real cross-surface events */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '48px 0 4px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Full timeline · across surfaces</span>
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

      {!isMobile && (
        <div style={{ position: 'fixed', bottom: 24, left: askLeft, transform: 'translateX(-50%)', width: askWidth, zIndex: 50, transition: sidebarTransition }}>
          <ChatInput onSubmit={() => {}} settled />
        </div>
      )}
    </div>
  )
}
