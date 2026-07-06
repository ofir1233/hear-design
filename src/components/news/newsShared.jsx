/**
 * newsShared.jsx — presentational helpers shared by the News V2 feed
 * (NewsV2Page), the article cards (ArticleCard), and the detail view (ArticlePage).
 */
import { useState, useEffect } from 'react'
import { TYPE, TONE_COLOR } from './newsData.js'
import {
  TrendWidget, StackedBarsWidget, TreemapWidget, GaugeWidget, DonutWidget,
  HeatStripWidget, PassRateBarsWidget, StatusBarWidget, BulletWidget, CompareLinesWidget,
  CausalChainWidget,
} from './widgets/NewsV2Widgets.jsx'

export const FONT = "'Byrd', sans-serif"
// Editorial serif — News body text only (deliberate, scoped DS deviation).
export const SERIF = "'Iowan Old Style', Georgia, 'Times New Roman', serif"

// Renders a widget from a { kind, props } spec. `override` merges (e.g. height).
export function renderWidget(spec, override = {}) {
  if (!spec) return null
  const p = { ...(spec.props || {}), ...override }
  switch (spec.kind) {
    case 'trend':        return <TrendWidget {...p} />
    case 'stackedBars':  return <StackedBarsWidget {...p} />
    case 'treemap':      return <TreemapWidget {...p} />
    case 'gauge':        return <GaugeWidget {...p} />
    case 'donut':        return <DonutWidget {...p} />
    case 'heatStrip':    return <HeatStripWidget {...p} />
    case 'passRateBars': return <PassRateBarsWidget {...p} />
    case 'statusBar':    return <StatusBarWidget {...p} />
    case 'bullet':       return <BulletWidget {...p} />
    case 'compareLines': return <CompareLinesWidget {...p} />
    case 'causalChain':  return <CausalChainWidget {...p} />
    default:             return null
  }
}

// Page canvas: lighter warm off-white in light mode; unchanged in dark.
export function usePageBg() {
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.dataset.theme === 'dark'))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark ? 'var(--bg-canvas)' : '#F9F9F7'
}

export function Kicker({ type, featured, showDot }) {
  const t = TYPE[type] || { label: type, tone: 'neutral' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 16 }}>
      {showDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: TONE_COLOR[t.tone], flexShrink: 0 }} />}
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: FONT }}>{t.label}</span>
      {featured && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--c100)', fontFamily: FONT }}>· Featured</span>}
    </div>
  )
}

export const N = ({ children }) => <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{children}</span>

export function Meta({ items }) {
  if (!items || !items.length) return null
  return (
    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: FONT, lineHeight: 1.5 }}>
      {items.map((x, i) => <span key={i}>{i > 0 && <span style={{ margin: '0 8px', opacity: 0.6 }}>·</span>}{x}</span>)}
    </div>
  )
}

export function Stat({ label, value, tone }) {
  const color = tone === 'up' ? 'var(--c100)' : tone === 'down' ? 'var(--g100)' : 'var(--text-primary)'
  return (
    <div style={{ padding: '14px 20px', borderRight: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, marginTop: 3, color, fontFamily: FONT }}>{value}</div>
    </div>
  )
}

export function StatGrid({ stats }) {
  if (!stats || !stats.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border-default)' }}>
      {stats.map((s, i) => <Stat key={i} {...s} />)}
    </div>
  )
}

export function SectionEyebrow({ children, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT, margin: '4px 0 18px', ...style }}>
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
    </div>
  )
}

export const DeepDive = ({ label = 'Read story ›' }) => (
  <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--color-interactive)', cursor: 'pointer' }}>{label}</span>
)

// Small compact table used by the 'table' template + article bodies.
// Mirrors the semantic <table> pattern from ExplorePage's CustomerSection.
export function DataTable({ cols, rows }) {
  const th = { fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left', padding: '8px 12px', fontFamily: FONT }
  const td = { fontSize: 13, color: 'var(--text-primary)', padding: '10px 12px', borderTop: '1px solid var(--border-default)', fontFamily: FONT }
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: 'var(--bg-active)' }}>{cols.map((c, i) => <th key={i} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>{r.map((cell, ci) => <td key={ci} style={{ ...td, textAlign: ci === 0 ? 'left' : 'right', fontWeight: ci === 0 ? 600 : 400, color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
