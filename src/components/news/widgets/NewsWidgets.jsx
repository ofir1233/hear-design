/**
 * NewsWidgets — reusable, DS-tokened chart widgets for the News feed.
 *
 * Each is a compact, News-legible version of a platform chart. They scale
 * (pass `height` / `w`) so the same widget serves an inline timeline chip or a
 * large lead card. All color via CSS vars so light/dark flips automatically.
 *
 *   <TrendWidget>       spikes / trends / sentiment-over-time
 *   <StackedBarsWidget> alert-storm / volume-mix
 *   <TreemapWidget>     topic composition (area = volume, tint = health)
 *   <GaugeWidget>       0–100 score (agent / compliance)
 *   <DonutWidget>       share / resolution ratio
 *   <HeatStripWidget>   compliance criteria × agents
 *   <BulletWidget>      metric vs target (handle time / SLA)
 *   <CompareLinesWidget>team-vs-team trend
 */

import { useRef, useState, useEffect } from 'react'

const FONT = "'Byrd', sans-serif"
const HEALTH = { good: 'var(--g100)', med: 'var(--c80)', poor: 'var(--red100)' }

// Measure the container's rendered width so SVG viewBox = px (fills full width,
// no letterboxing, stroke + circles stay undistorted).
function useWidth(fallback = 360) {
  const ref = useRef(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = () => { const cw = el.clientWidth; if (cw) setW(Math.round(cw)) }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}
const HEALTH_BG = {
  good: 'rgba(75,163,115,0.12)',
  med:  'rgba(255,141,120,0.13)',
  poor: 'rgba(229,72,77,0.12)',
}

// Catmull-Rom → cubic bezier for smooth lines
function smoothPath(pts) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`
  }
  return d
}

// ── Legend row (shared) ──────────────────────────────────────────────────────
export function WidgetLegend({ items }) {
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

// ── 1. Trend / Spike ─────────────────────────────────────────────────────────
export function TrendWidget({
  data = [30, 32, 28, 40, 44, 96, 74, 66, 80],
  labels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'],
  peakIndex = 5, baseline = 40, peakLabel, height = 128, w: wProp = 360,
  stroke = 'var(--c100)', gradId = 'trendFill',
}) {
  const [ref, w] = useWidth(wProp)
  const max = Math.max(...data), min = Math.min(...data)
  const range = (max - min) || 1
  const top = 20, bot = height - 16
  const x = i => Math.round((i / (data.length - 1)) * w)
  const y = v => Math.round(top + (1 - (v - min) / range) * (bot - top))
  const pts = data.map((v, i) => [x(i), y(v)])
  const line = smoothPath(pts)
  const area = `${line} L${w},${bot} L0,${bot} Z`
  const baseY = baseline != null ? y(baseline) : null
  const pk = pts[peakIndex]
  const uid = gradId + '-' + peakIndex
  return (
    <div ref={ref} style={{ width: '100%' }}>
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} style={{ display: 'block' }} fontFamily={FONT}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7056" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#FF7056" stopOpacity="0" />
        </linearGradient>
      </defs>
      {baseY != null && <>
        <line x1="0" y1={baseY} x2={w} y2={baseY} stroke="var(--n40)" strokeDasharray="2 4" opacity="0.7" />
        <text x="2" y={baseY - 5} fontSize="9" fill="var(--text-muted)">baseline</text>
      </>}
      {pk && <line x1={pk[0]} y1={pk[1]} x2={pk[0]} y2={bot} stroke={stroke} strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />}
      <path d={area} fill={`url(#${uid})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {pk && <>
        <circle cx={pk[0]} cy={pk[1]} r="6.5" fill={stroke} fillOpacity="0.18" />
        <circle cx={pk[0]} cy={pk[1]} r="3.5" fill={stroke} stroke="#fff" strokeWidth="1.5" />
        {peakLabel && <g transform={`translate(${Math.min(Math.max(pk[0], 40), w - 40)},12)`}>
          <rect x="-38" y="-8" width="76" height="17" rx="5" fill="var(--text-primary)" />
          <text x="0" y="4" fontSize="10" fill="var(--bg-card)" textAnchor="middle" fontWeight="600">{peakLabel}</text>
        </g>}
      </>}
      <g fontSize="9" fill="var(--text-muted)">
        {labels.map((l, i) => l ? (
          <text key={i} x={x(Math.round(i / (labels.length - 1) * (data.length - 1)))} y={height - 3}
                textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}>{l}</text>
        ) : null)}
      </g>
    </svg>
    </div>
  )
}

// ── 2. Stacked volume bars ───────────────────────────────────────────────────
export function StackedBarsWidget({
  weeks = [
    { label: 'W23', segs: [{ v: 42, c: 'var(--c80)' }, { v: 9, c: 'var(--h100)' }] },
    { label: 'W24', segs: [{ v: 70, c: 'var(--c80)' }, { v: 11, c: 'var(--h100)' }] },
    { label: 'W25', segs: [{ v: 68, c: 'var(--c80)' }, { v: 9, c: 'var(--h100)' }] },
    { label: 'W26', segs: [{ v: 96, c: 'var(--c100)' }, { v: 11, c: 'var(--t100)' }], peak: true },
    { label: 'W27', segs: [{ v: 74, c: 'var(--c80)' }, { v: 9, c: 'var(--h100)' }] },
  ],
  height = 150, w: wProp = 360,
}) {
  const [ref, w] = useWidth(wProp)
  const totals = weeks.map(wk => wk.segs.reduce((s, g) => s + g.v, 0))
  const max = Math.max(...totals)
  const top = 26, base = height - 28
  const scale = (base - top) / max
  const bw = 46, gap = (w - weeks.length * bw) / (weeks.length + 1)
  return (
    <div ref={ref} style={{ width: '100%' }}>
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} style={{ display: 'block' }} fontFamily={FONT} textAnchor="middle">
      <line x1="0" y1={base + 2} x2={w} y2={base + 2} stroke="var(--border)" />
      {weeks.map((wk, i) => {
        const gx = gap + i * (bw + gap)
        let yCursor = base
        const total = totals[i]
        return (
          <g key={i}>
            {wk.segs.map((seg, j) => {
              const h = seg.v * scale
              yCursor -= h
              return <rect key={j} x={gx} y={yCursor} width={bw} height={h} fill={seg.c} rx={j === wk.segs.length - 1 ? 3 : 0} />
            })}
            {wk.peak && <rect x={gx - 3} y={yCursor - 3} width={bw + 6} height={base - yCursor + 6} rx="5" fill="none" stroke="var(--c100)" strokeOpacity="0.35" strokeWidth="1.5" />}
            <text x={gx + bw / 2} y={yCursor - 6} fontSize="10" fontWeight="700" fill={wk.peak ? 'var(--c100)' : 'var(--text-secondary)'}>{total}</text>
            <text x={gx + bw / 2} y={height - 8} fontSize="10" fill={wk.peak ? 'var(--text-secondary)' : 'var(--text-muted)'} fontWeight={wk.peak ? 600 : 400}>{wk.label}</text>
          </g>
        )
      })}
    </svg>
    </div>
  )
}

// ── 3. Treemap (slice & dice, proportional) ──────────────────────────────────
export function TreemapWidget({
  items = [
    { name: 'Flight Booking', value: 4879, health: 'med' },
    { name: 'Ticket Confirmation', value: 2689, health: 'good' },
    { name: 'Existing Details', value: 2594, health: 'good' },
    { name: 'Refunds & Payments', value: 1761, health: 'med' },
    { name: 'Customer Relations', value: 619, health: 'poor' },
  ],
  height = 190,
}) {
  const [first, ...rest] = items
  const restTotal = rest.reduce((s, it) => s + it.value, 0) || 1
  const rows = []
  for (let i = 0; i < rest.length; i += 2) rows.push(rest.slice(i, i + 2))
  const Tile = ({ it, style }) => (
    <div style={{
      background: HEALTH_BG[it.health], borderRadius: 8, padding: '10px 12px', position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, minHeight: 0, ...style,
    }}>
      <span style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: HEALTH[it.health] }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.22, paddingRight: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: FONT }}>{it.name}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: FONT }}>{it.value.toLocaleString()}</span>
    </div>
  )
  return (
    <div style={{ display: 'flex', gap: 5, height }}>
      <Tile it={first} style={{ flex: `${first.value} 1 0` }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: `${restTotal} 1 0`, minWidth: 0, minHeight: 0 }}>
        {rows.map((row, ri) => {
          const rowSum = row.reduce((s, it) => s + it.value, 0)
          return (
            <div key={ri} style={{ display: 'flex', gap: 5, flex: `${rowSum} 1 0`, minWidth: 0, minHeight: 0 }}>
              {row.map((it, ci) => <Tile key={ci} it={it} style={{ flex: `${it.value} 1 0` }} />)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 4. Gauge (0–100) ─────────────────────────────────────────────────────────
export function GaugeWidget({ value = 90, max = 100, label = 'Empathy', delta = '+6 pts', color = 'var(--g100)' }) {
  const frac = Math.max(0, Math.min(1, value / max))
  // semicircle from (10,64) to (100,64), radius 45, center (55,64)
  const a = Math.PI * (1 - frac)
  const ex = 55 + 45 * Math.cos(a), ey = 64 - 45 * Math.sin(a)
  // Semicircular gauge: the value arc never exceeds 180°, so large-arc-flag is always 0.
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="110" height="70" viewBox="0 0 110 70">
        <path d="M10,64 A45,45 0 0,1 100,64" fill="none" stroke="var(--bg-active)" strokeWidth="10" strokeLinecap="round" />
        <path d={`M10,64 A45,45 0 0,1 ${ex.toFixed(1)},${ey.toFixed(1)}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: FONT }}>{value}<small style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>/{max}</small></div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4, fontFamily: FONT }}>{label}{delta && <> · <span style={{ color }}>{delta}</span></>}</div>
      </div>
    </div>
  )
}

// ── 5. Donut / share ─────────────────────────────────────────────────────────
export function DonutWidget({ value = 72, label = '312 of 433', sub = 'unresolved this week', color = 'var(--c100)' }) {
  const r = 34, circ = 2 * Math.PI * r
  const off = circ * (1 - value / 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--bg-active)" strokeWidth="11" />
        <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 42 42)" />
        <text x="42" y="47" textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--text-primary)" fontFamily={FONT}>{value}%</text>
      </svg>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: FONT }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 5, fontFamily: FONT }}>{sub}</div>
      </div>
    </div>
  )
}

// ── 6. Criteria heat strip ───────────────────────────────────────────────────
export function HeatStripWidget({
  rows = [
    { name: 'Agent 214', cells: ['good', 'good', 'poor', 'good', 'med', 'good'] },
    { name: 'Agent 118', cells: ['good', 'poor', 'poor', 'good', 'good', 'med'] },
    { name: 'Agent 073', cells: ['med', 'good', 'poor', 'good', 'good', 'good'] },
  ],
  colsLabel = 'KYC · cooling-off · risk · mandate · fees · vuln.',
}) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: '0 0 92px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>{r.name}</span>
            <span style={{ display: 'flex', gap: 3 }}>
              {r.cells.map((c, j) => <i key={j} style={{ width: 15, height: 15, borderRadius: 3, background: HEALTH[c] }} />)}
            </span>
          </div>
        ))}
      </div>
      {colsLabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 12, fontFamily: FONT }}>columns = {colsLabel}</div>}
    </div>
  )
}

// ── 6b. Pass-rate bars (compliance by criterion) ─────────────────────────────
export function PassRateBarsWidget({
  rows = [
    { label: 'KYC', pct: 98 },
    { label: 'Cooling-off', pct: 82, flagged: true },
    { label: 'Risk', pct: 95 },
    { label: 'Mandate', pct: 91 },
    { label: 'Vulnerable pop.', pct: 96 },
  ],
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {rows.map((r, i) => {
        const color = r.flagged ? 'var(--c100)' : 'var(--g100)'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: '0 0 104px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: FONT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
            <div style={{ flex: 1, height: 8, background: 'var(--bg-active)', borderRadius: 6, overflow: 'hidden', minWidth: 0 }}>
              <div style={{ width: `${r.pct}%`, height: '100%', background: color, borderRadius: 6 }} />
            </div>
            <span style={{ flex: '0 0 auto', minWidth: 32, textAlign: 'right', fontSize: 12, fontWeight: 700, color: r.flagged ? 'var(--c100)' : 'var(--text-secondary)', fontFamily: FONT }}>{r.pct}%</span>
            {r.flagged && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--c100)', fontFamily: FONT }}>flagged</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── 7. Bullet (metric vs target) ─────────────────────────────────────────────
export function BulletWidget({ metric = '6.4′', delta = '↑ 40%', fillPct = 82, targetPct = 58, sub = 'avg handle time · target 4.5′ · deviation 2.3σ' }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: FONT }}>{metric}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: 'var(--c100)', background: 'var(--c10)', padding: '2px 8px', borderRadius: 99 }}>{delta}</span>
      </div>
      <div style={{ position: 'relative', height: 14, background: 'var(--bg-active)', borderRadius: 7, overflow: 'hidden', margin: '10px 0 6px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fillPct}%`, background: 'var(--c100)', borderRadius: 7 }} />
        <div style={{ position: 'absolute', top: -3, bottom: -3, left: `${targetPct}%`, width: 2, background: 'var(--text-primary)' }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{sub}</div>
    </div>
  )
}

// ── 8. Compare lines (team vs team) ──────────────────────────────────────────
export function CompareLinesWidget({
  series = [
    { name: 'Team A', color: 'var(--t100)', data: [60, 54, 58, 40, 44, 30] },
    { name: 'Team B', color: 'var(--h100)', data: [66, 62, 50, 54, 48, 52] },
    { name: 'Team C', color: 'var(--s100)', data: [74, 70, 72, 66, 70, 64] },
  ],
  height = 90, w: wProp = 360,
}) {
  const [ref, w] = useWidth(wProp)
  const all = series.flatMap(s => s.data)
  const max = Math.max(...all), min = Math.min(...all), range = (max - min) || 1
  const x = i => (i / (series[0].data.length - 1)) * w
  const y = v => 8 + (1 - (v - min) / range) * (height - 16)
  return (
    <>
      <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} style={{ display: 'block' }}>
        {series.map((s, i) => (
          <path key={i} d={smoothPath(s.data.map((v, j) => [x(j), y(v)]))} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      </div>
      <WidgetLegend items={series.map(s => ({ color: s.color, label: s.name }))} />
    </>
  )
}
