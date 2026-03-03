/**
 * EmailForm — email input + "Continue with email" button.
 *
 * Props:
 *   disabled — true by default (email sign-in coming soon)
 */
export default function EmailForm({ disabled = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        type="email"
        placeholder="Enter your email"
        disabled={disabled}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          fontSize: 13,
          color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.03)',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: "'Byrd', sans-serif",
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      <button
        disabled={disabled}
        style={{
          width: '100%',
          padding: '11px 0',
          background: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
          color: disabled ? 'rgba(0,0,0,0.35)' : '#000',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: "'Byrd', sans-serif",
          transition: 'background 150ms ease',
        }}
      >
        Continue with email
      </button>
    </div>
  )
}
