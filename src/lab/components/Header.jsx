/**
 * Header — Lab component
 * Floating page header: 16px inset from each side, 16px border-radius, light outline stroke.
 */

export default function Header({ left, center, right, style }) {
  return (
    <div
      data-inspector="Header"
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        right: 16,
        height: 52,
        zIndex: 80,

        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',

        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 16,
        boxShadow: 'var(--page-header-shadow)',

        fontFamily: "'Byrd', sans-serif",
        ...style,
      }}
    >
      {/* Left slot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {left}
      </div>

      {/* Center slot */}
      {center && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {center}
        </div>
      )}

      {/* Right slot */}
      {right && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          {right}
        </div>
      )}
    </div>
  )
}
