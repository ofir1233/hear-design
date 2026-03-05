import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const TABS = ['Design Lab', 'Demo']

function EnvironmentToggle({ env, onEnvChange }) {
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
          onClick={() => onEnvChange(tab)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: env === tab ? '#fff' : 'rgba(255,255,255,0.4)',
            background: env === tab ? 'rgba(255,255,255,0.14)' : 'transparent',
            border: env === tab ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
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

const TITLE_LINES = ['The AI for', 'enterprise', 'intelligence']

export default function SignInHero({ env, onEnvChange }) {
  const logoRef    = useRef(null)
  const toggleRef  = useRef(null)
  const titleRef   = useRef(null)

  useEffect(() => {
    const logo   = logoRef.current
    const toggle = toggleRef.current
    const lines  = titleRef.current.querySelectorAll('.title-line-inner')

    // ── Set invisible initial states ──────────────────────────────
    gsap.set(logo,   { opacity: 0, y: 20,  scale: 0.96 })
    gsap.set(toggle, { opacity: 0, y: 16 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // 1. Logo snaps in — fast, confident
    tl.to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0)

    // 2. Title lines — large blur-to-focus + rise, tight stagger
    tl.fromTo(
      lines,
      { opacity: 0, y: 44, filter: 'blur(16px)', scale: 0.97 },
      { opacity: 1, y: 0,  filter: 'blur(0px)',  scale: 1,
        duration: 0.75, stagger: 0.1 },
      0.18
    )

    // 3. Toggle strikes in — snappy
    tl.to(toggle, { opacity: 1, y: 0, duration: 0.5 }, 0.66)

  }, [])

  return (
    <div
      data-inspector="SignInHero"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <img
          ref={logoRef}
          src="/Logo.svg"
          alt="Hear"
          style={{ height: 48, objectFit: 'contain', objectPosition: 'left' }}
        />
        <div ref={toggleRef}>
          <EnvironmentToggle env={env} onEnvChange={onEnvChange} />
        </div>
      </div>

      <h1
        ref={titleRef}
        style={{
          fontSize: 'clamp(34px, 3.5vw, 52px)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {TITLE_LINES.map((line, i) => (
          <span key={i} className="title-line-inner" style={{ display: 'block' }}>{line}</span>
        ))}
      </h1>
    </div>
  )
}
