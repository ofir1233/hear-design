// Canonical floating segmented tab control (the "Flow / Landscape" style).
// Single source of truth for its height/look — use this everywhere instead of
// re-implementing the control inline, so every instance stays identical.

export const SEG_HEIGHT = 36
// Full rendered height of the control (inner button + 4px padding top/bottom),
// so sibling controls (e.g. checkbox pills) can match the card's height exactly.
export const SEG_OUTER = SEG_HEIGHT + 8

/**
 * items: [{ id, label, Icon?, color?, tint?, bd? }]
 *   - Icon: optional react-icons component (rendered at 14px)
 *   - color/tint/bd: optional active colours (default cobalt)
 * value: currently-selected id
 * onChange: (id) => void
 */
export default function SegmentedTabs({ items, value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4,
      background: 'var(--bg-card)', border: 'var(--page-header-border)',
      borderRadius: 12, boxShadow: 'var(--page-header-shadow)',
    }}>
      {items.map(m => {
        const active = value === m.id
        const color = m.color || 'var(--b100)'
        const tint = m.tint || 'var(--badge-cobalt-fill)'
        const bd = m.bd || 'var(--badge-cobalt-bd)'
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              height: SEG_HEIGHT, padding: '0 14px',
              fontSize: 13, fontWeight: active ? 600 : 500, fontFamily: "'Byrd', sans-serif",
              border: `1px solid ${active ? bd : 'transparent'}`, borderRadius: 8,
              background: active ? tint : 'transparent',
              color: active ? color : 'var(--text-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 160ms ease, color 160ms ease',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {m.Icon && <m.Icon size={14} style={{ flexShrink: 0 }} />}
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
