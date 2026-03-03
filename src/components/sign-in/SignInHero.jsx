export default function SignInHero({ badge = 'Design Lab' }) {
  return (
    <div data-inspector="SignInHero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <img
          src="/Logo.svg"
          alt="Hear"
          style={{ height: 48, objectFit: 'contain', objectPosition: 'left' }}
        />
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          padding: '3px 10px',
        }}>
          {badge}
        </span>
      </div>

      <h1 style={{
        fontSize: 'clamp(30px, 3vw, 44px)',
        fontWeight: 800,
        color: '#ffffff',
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        The AI for<br />enterprise<br />intelligence
      </h1>
    </div>
  )
}
