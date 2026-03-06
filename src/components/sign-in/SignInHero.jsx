import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { gsap } from 'gsap'

const TABS = ['Design Lab', 'Demo']

const TITLES = {
  'Design Lab': ['The AI for', 'enterprise', 'intelligence'],
  'Demo':       ['See Hear in', 'your world'],
}

// ── Sliding pill toggle ────────────────────────────────────────────
function EnvironmentToggle({ env, onEnvChange }) {
  const pillRef = useRef(null)
  const btnRefs = useRef([])
  const isFirst = useRef(true)

  useLayoutEffect(() => {
    const idx  = TABS.indexOf(env)
    const btn  = btnRefs.current[idx]
    const pill = pillRef.current
    if (!btn || !pill) return

    if (isFirst.current) {
      gsap.set(pill, { x: btn.offsetLeft, width: btn.offsetWidth })
      isFirst.current = false
    } else {
      gsap.to(pill, {
        x: btn.offsetLeft,
        width: btn.offsetWidth,
        duration: 0.5,
        ease: 'back.out(1.8)',
      })
    }
  }, [env])

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 999,
      padding: 3,
    }}>
      {/* Animated pill */}
      <div
        ref={pillRef}
        style={{
          position: 'absolute',
          top: 3,
          left: 0,
          height: 'calc(100% - 6px)',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.2)',
          pointerEvents: 'none',
        }}
      />
      {TABS.map((tab, i) => (
        <button
          key={tab}
          ref={el => (btnRefs.current[i] = el)}
          onClick={() => onEnvChange(tab)}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: env === tab ? '#fff' : 'rgba(255,255,255,0.4)',
            background: 'transparent',
            border: 'none',
            borderRadius: 999,
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'color 300ms ease',
            fontFamily: 'inherit',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────
export default function SignInHero({ env, onEnvChange }) {
  const logoRef      = useRef(null)
  const toggleRef    = useRef(null)
  const titleRef     = useRef(null)
  const [displayEnv, setDisplayEnv] = useState(env)
  const entranceDone = useRef(false)
  const prevEnv      = useRef(env)

  // ── Initial entrance ──────────────────────────────────────────────
  useEffect(() => {
    const logo   = logoRef.current
    const toggle = toggleRef.current
    const lines  = titleRef.current.querySelectorAll('.title-line-inner')

    gsap.set(logo,   { opacity: 0, y: 20, scale: 0.96 })
    gsap.set(toggle, { opacity: 0, y: 16 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    tl.to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0)

    tl.fromTo(
      lines,
      { opacity: 0, y: 44, filter: 'blur(16px)', scale: 0.97 },
      { opacity: 1, y: 0,  filter: 'blur(0px)',  scale: 1,
        duration: 0.75, stagger: 0.1 },
      0.18
    )

    tl.to(toggle, {
      opacity: 1, y: 0, duration: 0.5,
      onComplete: () => { entranceDone.current = true },
    }, 0.66)
  }, [])

  // ── Env-change transition ─────────────────────────────────────────
  useEffect(() => {
    if (env === prevEnv.current) return
    prevEnv.current = env
    if (!entranceDone.current) return

    const h1    = titleRef.current
    const lines = h1?.querySelectorAll('.title-line-inner')
    if (!lines?.length) return

    // Lock current height before exit so layout doesn't shift
    const lockedHeight = h1.offsetHeight
    gsap.set(h1, { height: lockedHeight })

    // Exit — decisive snap upward
    gsap.to(lines, {
      opacity: 0,
      y: -20,
      filter: 'blur(10px)',
      scale: 0.97,
      duration: 0.22,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => {
        // Commit new text synchronously
        flushSync(() => setDisplayEnv(env))

        // Measure new natural height
        const fresh = h1.querySelectorAll('.title-line-inner')
        gsap.set(h1, { height: 'auto' })
        const newHeight = h1.offsetHeight
        gsap.set(h1, { height: lockedHeight })

        // Animate height to new size, then release GSAP control
        gsap.to(h1, { height: newHeight, duration: 0.55, ease: 'expo.out', clearProps: 'height' })

        if (!fresh?.length) return

        // Entrance — rise from below, crisp and confident
        gsap.fromTo(
          fresh,
          { opacity: 0, y: 36, filter: 'blur(14px)', scale: 0.97 },
          { opacity: 1, y: 0,  filter: 'blur(0px)',  scale: 1,
            duration: 0.58, stagger: 0.09, ease: 'expo.out' }
        )
      },
    })
  }, [env])

  return (
    <div
      data-inspector="SignInHero"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%' }}
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
          width: '100%',
          minHeight: '3.24em',
        }}
      >
        {TITLES[displayEnv].map((line, i) => (
          <span key={i} className="title-line-inner" style={{ display: 'block', whiteSpace: 'nowrap' }}>{line}</span>
        ))}
      </h1>
    </div>
  )
}
