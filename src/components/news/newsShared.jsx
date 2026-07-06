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

// ── Trust: provenance ("why you're seeing this") + evidence (drill-through) ───
function InfoDot() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }} aria-hidden>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <path d="M7 6.1v3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="4.25" r="0.85" fill="currentColor" />
    </svg>
  )
}
// Qualitative signal strength (illustrative — platform stores magnitude, not a score).
const STRENGTH = {
  strong:   { label: 'strong signal',   color: 'var(--c100)' },
  moderate: { label: 'moderate signal', color: 'var(--text-muted)' },
  watch:    { label: 'for your watch',  color: 'var(--text-muted)' },
}
// Compact provenance line for feed cards; the ⓘ tooltip carries the basis/method.
export function WhyLine({ trust }) {
  if (!trust) return null
  const s = STRENGTH[trust.strength] || STRENGTH.moderate
  return (
    <div title={trust.method ? `Basis · ${trust.method}` : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-muted)', fontFamily: FONT, lineHeight: 1.4, cursor: 'help' }}>
      <InfoDot />
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trust.trigger}</span>
      <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>·&nbsp;<span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span></span>
    </div>
  )
}
// "See N calls →" evidence drill-through (cobalt = interactive; visual in the lab).
export function EvidenceLink({ evidence, onOpen }) {
  const label = evidence && evidence.count ? `See ${evidence.count} ${evidence.noun || 'calls'}` : 'Open in Data'
  const go = e => { e.stopPropagation(); onOpen && onOpen() }
  return (
    <button onClick={go}
      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: FONT, color: 'var(--color-interactive)', whiteSpace: 'nowrap' }}>
      {label} <span style={{ fontSize: 13 }}>→</span>
    </button>
  )
}
// Full provenance panel for the article page: trigger + basis + strength + evidence.
export function WhyPanel({ trust, evidence }) {
  if (!trust) return null
  const s = STRENGTH[trust.strength] || STRENGTH.moderate
  const evLabel = evidence && evidence.count ? `See ${evidence.count} ${evidence.noun || 'calls'}` : 'Open in Data'
  return (
    <div style={{ border: '1px solid var(--border-default)', background: 'var(--bg-card)', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={{ color: 'var(--color-interactive)', display: 'inline-flex' }}><InfoDot /></span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: FONT }}>Why you’re seeing this</span>
        <span style={{ marginInlineStart: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: s.color, fontFamily: FONT, whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />{s.label}
        </span>
      </div>
      <div style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: FONT, lineHeight: 1.5 }}>{trust.trigger}</div>
      {trust.method && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: FONT, marginTop: 5 }}>Basis · {trust.method}</div>}
      <button
        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FONT, color: 'var(--color-interactive)' }}>
        {evLabel} <span style={{ fontSize: 14 }}>→</span>
      </button>
    </div>
  )
}

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
    <div style={{ padding: '16px 22px', borderRight: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
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
