import { useState } from 'react'

const TABS = ['Design Lab', 'Dev', 'Demo']

function EnvironmentToggle() {
  const [active, setActive] = useState('Design Lab')

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 999,
      padding: 3,
      gap: 2,
    }}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: active === tab ? '#fff' : 'rgba(255,255,255,0.4)',
            background: active === tab ? 'rgba(255,255,255,0.14)' : 'transparent',
            border: active === tab ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
            borderRadius: 999,
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
            fontFamily: 'inherit',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default function SignInHero() {
  return (
    <div data-inspector="SignInHero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <img
          src="/Logo.svg"
          alt="Hear"
          style={{ height: 48, objectFit: 'contain', objectPosition: 'left' }}
        />
        <EnvironmentToggle />
      </div>

      <h1 style={{
        fontSize: 'clamp(40px, 4vw, 64px)',
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
