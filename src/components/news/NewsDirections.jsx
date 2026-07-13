/**
 * NewsDirections — four LOW-FIDELITY explorations of the News screen, switchable
 * in one place. Each is a different PRIMARY METAPHOR over the same §10 spine
 * (compliance/QA risk-owner · typed "developments" · ranked under restraint ·
 * hybrid time · lean-forward + evidence + action). Only the metaphor differs.
 *
 *   v2 · Edition   — editorial front page ("read what changed")
 *   v3 · Radar     — situation board ("see the whole operation at once")
 *   v4 · Inbox     — triage worklist ("work the queue")
 *   v5 · Briefing  — answer-first ("tell me, then let me dig")
 *
 * Wireframe fidelity on purpose: grey skeletons + annotated placeholders, DS-tokened.
 */
import PageHeader from '../PageHeader.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import SegmentedTabs from '../SegmentedTabs.jsx'
import { FONT, usePageBg } from './newsShared.jsx'

// ── low-fidelity primitives ──────────────────────────────────────────────────
const cardBase = { background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12 }
const sevColor = (s) => (s === 'high' ? 'var(--c100)' : s === 'med' ? 'rgba(255,112,86,0.5)' : 'var(--border-default)')

function Bar({ w = '100%', h = 8, mt = 0, tone = 'soft' }) {
  const bg = tone === 'title' ? 'var(--text-muted)' : tone === 'mid' ? 'var(--n40)' : 'var(--border-default)'
  const op = tone === 'title' ? 0.5 : tone === 'mid' ? 0.6 : 1
  return <div style={{ width: w, height: h, borderRadius: 4, background: bg, opacity: op, marginTop: mt }} />
}
function Lines({ n = 3, gap = 7, widths }) {
  const ws = widths || Array.from({ length: n }, (_, i) => (i === n - 1 ? '70%' : '100%'))
  return <div style={{ display: 'grid', gap }}>{ws.map((w, i) => <Bar key={i} w={w} h={7} />)}</div>
}
function Ph({ h = 90, label }) {
  return <div style={{ height: h, borderRadius: 8, border: '1px dashed var(--border-default)', background: 'var(--bg-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONT }}>{label}</div>
}
function Chip({ children, tone = 'grey' }) {
  const map = {
    coral: ['rgba(255,112,86,0.12)', 'var(--c100)'],
    green: ['rgba(34,168,83,0.12)', 'var(--g100)'],
    cobalt: ['rgba(23,121,247,0.10)', 'var(--b100)'],
    grey: ['var(--bg-active)', 'var(--text-muted)'],
  }
  const [bg, fg] = map[tone] || map.grey
  return <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: fg, background: bg, borderRadius: 5, padding: '2px 7px', fontFamily: FONT, whiteSpace: 'nowrap' }}>{children}</span>
}
function Dot({ sev = 'high' }) {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: sev === 'low' ? 'var(--border-default)' : 'var(--c100)', opacity: sev === 'med' ? 0.5 : 1, flex: '0 0 auto' }} />
}
function Tag({ children }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT }}>{children}</span>
}
function Ann({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', opacity: 0.75, fontFamily: FONT, margin: '0 0 9px' }}>{children}</div>
}
function Spark({ up, color = 'var(--text-muted)' }) {
  const pts = up ? '0,20 15,17 30,18 45,12 60,13 75,6 90,2' : '0,9 15,12 30,8 45,14 60,11 75,15 90,18'
  return <svg width="92" height="24" viewBox="0 0 92 24" style={{ display: 'block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" /></svg>
}
function VHead({ title, tagline, best }) {
  return (
    <div style={{ marginBottom: 22, paddingBottom: 15, borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
        <Chip tone="grey">low-fi wireframe</Chip>
      </div>
      <p style={{ margin: '7px 0 0', fontSize: 14, color: 'var(--text-secondary)', fontFamily: FONT }}>{tagline} <span style={{ color: 'var(--text-muted)' }}>· best at: {best}</span></p>
    </div>
  )
}

// ── v2 · Edition — editorial front page ───────────────────────────────────────
function Edition() {
  return (
    <>
      <VHead title="v2 · The Edition" tagline="Editorial front page — read what changed." best="orientation, narrative, exec-shareable" />
      <div style={{ ...cardBase, padding: '16px 18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Bar w={200} h={17} tone="title" /><div style={{ marginTop: 8 }}><Bar w={130} h={7} /></div></div>
        <Tag>daily edition · Jul 2</Tag>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip tone="coral">just detected</Chip>
        {[0, 1, 2].map(i => <div key={i} style={{ ...cardBase, padding: '6px 10px', display: 'flex', gap: 7, alignItems: 'center' }}><Dot sev={i === 1 ? 'med' : 'high'} /><Bar w={90} h={6} /></div>)}
      </div>

      <Ann>Hero · single lead development — coral = highest-impact, unresolved</Ann>
      <div style={{ ...cardBase, borderInlineStart: '3px solid var(--c100)', padding: '22px 24px', marginBottom: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'center' }}>
        <div>
          <Chip tone="coral">Monitoring · spike</Chip>
          <div style={{ marginTop: 12 }}><Bar w="94%" h={18} tone="title" /><Bar w="66%" h={18} tone="title" mt={9} /></div>
          <div style={{ marginTop: 15 }}><Lines n={3} /></div>
          <div style={{ display: 'flex', gap: 9, marginTop: 17, flexWrap: 'wrap' }}><Chip tone="cobalt">See 312 calls →</Chip><Chip tone="grey">+ Signal</Chip><Chip tone="grey">Assign</Chip></div>
        </div>
        <Ph h={158} label="trend chart" />
      </div>

      <Ann>Ranked stories · the few that cleared the bar</Ann>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
        {['Compliance', 'Agents', 'Customers', 'Signals'].map((s, i) => (
          <div key={i} style={{ ...cardBase, padding: '16px 18px' }}>
            <Chip tone={i < 2 ? 'coral' : 'grey'}>{s}</Chip>
            <div style={{ marginTop: 11 }}><Bar w="95%" h={12} tone="title" /><Bar w="58%" h={12} tone="title" mt={6} /></div>
            <div style={{ marginTop: 11 }}><Lines n={2} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 }}><Chip tone="cobalt">See N calls →</Chip><Chip tone="grey">Expand →</Chip></div>
          </div>
        ))}
      </div>

      <Ann>Sections by surface · lighter items below the fold</Ann>
      <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 15 }}>
        <Bar w={170} h={12} tone="title" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 14 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ ...cardBase, padding: '13px 15px' }}><Bar w="78%" h={9} tone="title" /><div style={{ marginTop: 9 }}><Lines n={2} /></div></div>)}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 20 }}><Tag>· the rest collapses into a digest — restraint cap ·</Tag></div>
    </>
  )
}

// ── v3 · Radar — situation board ──────────────────────────────────────────────
function Radar() {
  const surfaces = [
    ['Monitoring & Alerts', 'high', '3 open', '24'],
    ['Compliance', 'high', '2 open', '82%'],
    ['Agent Performance', 'low', 'clear', '3.8′'],
    ['Customer Voice', 'med', '1 open', '16%'],
    ['Signals & Trends', 'med', '2 open', '+240%'],
  ]
  return (
    <>
      <VHead title="v3 · The Radar" tagline="Situation board — the whole operation at a glance." best="monitoring, at-a-glance triage, wall displays" />
      <Ann>Surface tiles · severity stripe + trend + open count — color encodes severity, not category</Ann>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 24 }}>
        {surfaces.map(([name, sev, open, val], i) => (
          <div key={i} style={{ ...cardBase, padding: '16px 18px', borderTop: `3px solid ${sevColor(sev)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', fontFamily: FONT }}>{name}</span><Dot sev={sev} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', fontFamily: FONT, margin: '10px 0 4px', letterSpacing: '-0.02em' }}>{val}</div>
            <Spark up={i === 4} color={sev === 'high' ? 'var(--c100)' : 'var(--text-muted)'} />
            <div style={{ marginTop: 9 }}><Chip tone={sev === 'high' ? 'coral' : 'grey'}>{open}</Chip></div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div>
          <Ann>Top unresolved developments · ranked</Ann>
          <div style={{ ...cardBase, overflow: 'hidden' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i ? '1px solid var(--border-default)' : 'none' }}>
                <Dot sev={i < 2 ? 'high' : 'med'} />
                <div style={{ flex: 1, minWidth: 0 }}><Bar w={i % 2 ? '70%' : '88%'} h={10} tone="title" /><div style={{ marginTop: 6 }}><Bar w="45%" h={6} /></div></div>
                <Chip tone="cobalt">open →</Chip>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Ann>Live · just detected (real moments)</Ann>
          <div style={{ ...cardBase, overflow: 'hidden' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: i ? '1px solid var(--border-default)' : 'none' }}><Tag>{`${9 - i}:${i}0${i}`.slice(0, 4)}</Tag><Bar w="62%" h={6} /></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ── v4 · Triage Inbox — worklist ──────────────────────────────────────────────
function Inbox() {
  const rows = [
    ['high', 'Cancellation intent spiking past baseline', 'Signals', 'New', '—'],
    ['high', 'Cooling-off disclosures below QA target', 'Compliance', 'Investigating', 'PN'],
    ['med', 'Team B handle time +40% this afternoon', 'Agents', 'New', '—'],
    ['med', 'Wait times trending past SLA', 'Monitoring', 'Investigating', 'TO'],
    ['low', 'First-contact resolution up on Team A', 'Agents', 'Resolved', 'MK'],
    ['low', 'New competitor mentions surfacing', 'Customers', 'New', '—'],
  ]
  const views = [['All developments', 6], ['Mine', 2], ['Unassigned', 3], ['High risk', 2], ['Resolved', 1]]
  return (
    <>
      <VHead title="v4 · The Triage Inbox" tagline="A worklist — work the queue." best="the risk-owner: accountability, status, throughput" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 190px) 1fr', gap: 16 }}>
        <div>
          <Ann>Views</Ann>
          <div style={{ display: 'grid', gap: 4 }}>
            {views.map(([f, n], i) => (
              <div key={i} style={{ ...cardBase, padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: i === 0 ? 'var(--bg-active)' : 'var(--bg-card)', fontFamily: FONT, fontSize: 13, color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: i === 0 ? 600 : 500 }}>{f}<Tag>{n}</Tag></div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}><Chip tone="coral">New 3</Chip><Chip tone="cobalt">Investigating 2</Chip><Chip tone="green">Resolved 1</Chip></div>
          <div style={{ ...cardBase, overflow: 'hidden' }}>
            {rows.map(([sev, title, surface, status, owner], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderTop: i ? '1px solid var(--border-default)' : 'none', borderInlineStart: `3px solid ${sevColor(sev)}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: FONT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}><Chip tone="grey">{surface}</Chip><Bar w={120} h={6} /></div>
                </div>
                <Chip tone={status === 'New' ? 'coral' : status === 'Resolved' ? 'green' : 'cobalt'}>{status}</Chip>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-active)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', fontFamily: FONT, flex: '0 0 auto' }}>{owner}</span>
                <div style={{ display: 'flex', gap: 6, flex: '0 0 auto' }}><Chip tone="grey">Assign</Chip><Chip tone="cobalt">Open →</Chip></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 11 }}><Tag>select a row → detail opens in a side panel (why · evidence · actions)</Tag></div>
        </div>
      </div>
    </>
  )
}

// ── v5 · Briefing — answer-first ──────────────────────────────────────────────
function Briefing() {
  return (
    <>
      <VHead title="v5 · The Briefing" tagline="Answer-first — tell me, then let me dig." best="scarce attention: a 60-second read, then drill by asking" />
      <div style={{ ...cardBase, padding: '26px 28px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--c100)', flex: '0 0 auto' }} />
          <div><div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: FONT }}>Your briefing · Jul 2</div><Tag>authored by Hear Intelligence · 3 things changed</Tag></div>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--c100)', fontFamily: FONT }}>{i + 1}</span>
              <div>
                <Bar w="95%" h={11} tone="title" /><Bar w="80%" h={11} tone="title" mt={6} />
                <div style={{ marginTop: 9 }}><Lines n={2} /></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 11, flexWrap: 'wrap' }}><Chip tone="cobalt">See 312 calls →</Chip><Chip tone="grey">why ⓘ</Chip><Chip tone="grey">+ Signal</Chip></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Ann>Ask a follow-up · drill by conversation, grounded in the briefing</Ann>
      <div style={{ ...cardBase, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <span style={{ color: 'var(--text-muted)', fontFamily: FONT, fontSize: 14 }}>Ask about today's developments…</span>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--b100)', flex: '0 0 auto' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {['Which teams drove the spike?', 'Compare to last week', 'What should I action first?'].map((q, i) => <Chip key={i} tone="grey">{q}</Chip>)}
      </div>
    </>
  )
}

// ── container + switcher ──────────────────────────────────────────────────────
const VARIANTS = [
  { id: 'edition', label: 'v2 · Edition', C: Edition },
  { id: 'radar', label: 'v3 · Radar', C: Radar },
  { id: 'inbox', label: 'v4 · Inbox', C: Inbox },
  { id: 'briefing', label: 'v5 · Briefing', C: Briefing },
]

export default function NewsDirections({ isMobile = false, sidebarWidth = 272, sidebarTransition = 'none', variant = 'edition', onVariant }) {
  const pageBg = usePageBg()
  const active = VARIANTS.find(v => v.id === variant) || VARIANTS[0]
  const Active = active.C
  return (
    <div style={{ position: 'fixed', inset: 0, background: pageBg, transition: sidebarTransition }}>
      <div style={{ position: 'absolute', top: 0, insetInlineStart: sidebarWidth, insetInlineEnd: 0, bottom: 0, transition: sidebarTransition, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        <PageHeader
          title="News · Directions"
          crumbs={['Low-fi explorations']}
          badge={<Badge variant="tinted" color="coral" shape="soft" uppercase={false}>wireframes</Badge>}
          actions={<Button variant="secondary" size="sm">Notes</Button>}
        />
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 24px 4px', flexWrap: 'wrap' }}>
          <SegmentedTabs items={VARIANTS.map(v => ({ id: v.id, label: v.label }))} value={active.id} onChange={id => onVariant && onVariant(id)} />
          {!isMobile && <Tag>all four share the §10 spine — only the metaphor differs</Tag>}
        </div>
        <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 80px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
            <Active />
          </div>
        </div>
      </div>
    </div>
  )
}
