/**
 * BreakingStrip — compact "just detected" ticker (Ynet-style latest strip).
 * Newest events, timestamped, low-chrome; sits under the masthead.
 */
import { BREAKING } from './newsData.js'
import { FONT } from './newsShared.jsx'
import { useLang, t as tr, BREAKING_HE } from './newsI18n.js'

const TONE = { attention: 'var(--c100)', positive: 'var(--g100)', neutral: 'var(--n40)' }

export default function BreakingStrip() {
  const lang = useLang()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, marginBottom: 22, overflowX: 'auto' }}>
      <span style={{ flex: '0 0 auto', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c100)', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c100)' }} />{tr('breaking_label', lang)}
      </span>
      {BREAKING.map((b, i) => (
        <span key={i} style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: FONT, whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--text-muted)' }}>{b.time}</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: TONE[b.tone], flexShrink: 0 }} />
          {lang === 'he' ? (BREAKING_HE[i] || b.label) : b.label}
        </span>
      ))}
    </div>
  )
}
