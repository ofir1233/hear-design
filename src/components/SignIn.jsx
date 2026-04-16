import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGoogleLogin } from '@react-oauth/google'
import SignInHero from './sign-in/SignInHero.jsx'
import GoogleButton from './sign-in/GoogleButton.jsx'
import AuthDivider from './sign-in/AuthDivider.jsx'
import EmailForm from './sign-in/EmailForm.jsx'
import DemoFlow from './demo/DemoFlow.jsx'
import DevFlow from './dev/DevFlow.jsx'

const USER_CACHE_KEY = 'hear-user-v1'

function getCachedUser(sub) {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (cached.sub !== sub) return null
    return cached
  } catch { return null }
}

function setCachedUser(profile) {
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(profile))
  } catch {}
}

export default function SignIn({ onSignIn }) {
  const [env, setEnv] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('demoToken') ? 'Demo' : 'Design Lab'
  })

  // ── Google login ─────────────────────────────────────────────────
  const [googleError, setGoogleError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Name step ────────────────────────────────────────────────────
  const [step, setStep] = useState('auth') // 'auth' | 'name'
  const [pendingUser, setPendingUser] = useState(null) // Google userinfo
  const [nameValue, setNameValue] = useState('')
  const [nameError, setNameError] = useState('')
  const nameInputRef = useRef(null)

  // Focus name input when step switches
  useEffect(() => {
    if (step === 'name') {
      setTimeout(() => nameInputRef.current?.focus(), 350)
    }
  }, [step])

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()

        // Check if we already know this user
        const cached = getCachedUser(userInfo.sub)
        if (cached?.name) {
          onSignIn({ mode: 'lab', name: cached.name, email: userInfo.email, picture: userInfo.picture })
          return
        }

        // New user — show name step
        setPendingUser(userInfo)
        setNameValue(userInfo.name || '')
        setLoading(false)

        // Animate form out then switch step
        const form = formRef.current
        gsap.to(form, {
          opacity: 0, y: -14, filter: 'blur(8px)',
          duration: 0.3, ease: 'power2.in',
          onComplete: () => setStep('name'),
        })
      } catch {
        setGoogleError('Sign-in failed. Please try again.')
        setLoading(false)
      }
    },
    onError: () => {
      setGoogleError('Google sign-in failed. Please try again.')
      setLoading(false)
    },
  })

  function handleConfirmName() {
    const trimmed = nameValue.trim()
    if (!trimmed) {
      setNameError('Please enter your name.')
      return
    }
    const profile = {
      sub: pendingUser.sub,
      name: trimmed,
      email: pendingUser.email,
      picture: pendingUser.picture,
    }
    setCachedUser(profile)
    // Store for sidebar display
    localStorage.setItem('hear-user-name', trimmed)
    onSignIn({ mode: 'lab', ...profile })
  }

  // ── Demo Google login (any account) ─────────────────────────────
  const [demoUser, setDemoUser] = useState(null)
  const [demoAuthError, setDemoAuthError] = useState('')

  const demoGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()
        setDemoUser(userInfo)
      } catch {
        setDemoAuthError('Google sign-in failed. Please try again.')
      }
    },
    onError: () => {
      setDemoAuthError('Google sign-in failed. Please try again.')
    },
  })

  // ── Form entrance animation ──────────────────────────────────────
  const formRef    = useRef(null)
  const formReady  = useRef(false)
  useEffect(() => {
    const form = formRef.current
    gsap.set(form, { opacity: 0, y: 24, filter: 'blur(8px)' })
    gsap.to(form, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.6, ease: 'expo.out', delay: 0.66,
      onComplete: () => { formReady.current = true },
    })
  }, [])

  // Animate name step in after step switches
  useEffect(() => {
    if (step !== 'name') return
    const form = formRef.current
    gsap.fromTo(form,
      { opacity: 0, y: 20, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' }
    )
  }, [step])

  // ── Form re-entrance on tab switch ───────────────────────────────
  useLayoutEffect(() => {
    if (!formReady.current) return
    const form = formRef.current
    if (!form) return
    gsap.fromTo(form,
      { opacity: 0, y: 14, filter: 'blur(8px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' }
    )
  }, [env])

  // Reset demo auth error when switching away from Demo
  useEffect(() => {
    if (env !== 'Demo') {
      setDemoUser(null)
      setDemoAuthError('')
    }
  }, [env])

  return (
    <div
      data-inspector="SignIn"
      style={{
        height: '100vh',
        background: '#000000',
        fontFamily: "'Byrd', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

      {/* ── Grain overlay ── */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20, opacity: 0.4 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Decorative images ── */}
      <img src="/top-image.svg" alt="" aria-hidden="true" style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: '80vw', pointerEvents: 'none', zIndex: 1 }} />
      <img src="/bot.svg"       alt="" aria-hidden="true" style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', width: '80vw', pointerEvents: 'none', zIndex: 1, display: 'block' }} />

      {/* ── Main content ── */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', maxWidth: 1160, padding: '0 60px', boxSizing: 'border-box', gap: 100 }}>

          {/* Left panel */}
          <div style={{ flex: '0 0 340px', width: 340, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24, paddingBottom: 24, minHeight: 'clamp(420px, 65vh, 540px)' }}>
            <SignInHero env={env} onEnvChange={step === 'auth' ? setEnv : undefined} />

            <div
              ref={formRef}
              style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}
            >
              {/* ── Name step ── */}
              {step === 'name' ? (
                <>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 2px' }}>
                    What should we call you?
                  </p>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={nameValue}
                    onChange={e => { setNameValue(e.target.value); setNameError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      border: nameError
                        ? '1px solid rgba(255,100,100,0.6)'
                        : '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.9)',
                      background: 'rgba(255,255,255,0.06)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: "'Byrd', sans-serif",
                      transition: 'border-color 150ms ease',
                    }}
                    onFocus={e => { if (!nameError) e.target.style.borderColor = 'rgba(255,255,255,0.35)' }}
                    onBlur={e => { if (!nameError) e.target.style.borderColor = 'rgba(255,255,255,0.14)' }}
                  />
                  {nameError && (
                    <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.9)', margin: 0 }}>{nameError}</p>
                  )}
                  <button
                    onClick={handleConfirmName}
                    style={{
                      width: '100%',
                      padding: '11px 0',
                      background: 'rgba(255,255,255,0.9)',
                      color: '#000',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: "'Byrd', sans-serif",
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                  >
                    Continue
                  </button>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: 0 }}>
                    We'll remember you for next time.
                  </p>
                </>
              ) : env === 'Demo' ? (
                <>
                  <DemoFlow
                    googleUser={demoUser}
                    onGoogleLogin={() => demoGoogleLogin()}
                    onComplete={(profile) => onSignIn({ ...profile, mode: 'demo' })}
                  />
                  {demoAuthError && (
                    <p style={{ fontSize: 12, color: '#FF6B6B', textAlign: 'center', margin: 0 }}>{demoAuthError}</p>
                  )}
                </>
              ) : env === 'Dev' ? (
                <DevFlow onComplete={onSignIn} />
              ) : (
                <>
                  <GoogleButton
                    onClick={() => googleLogin()}
                    loading={loading}
                    error={googleError}
                  />
                  <AuthDivider />
                  <EmailForm />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: 0 }}>
                    By continuing, you acknowledge Hear's{' '}
                    <a href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Privacy Policy</a>.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: video */}
          <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <video src="/hero.mp4" autoPlay loop muted playsInline style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: -1 }} />
          </div>

        </div>
      </div>
    </div>
  )
}
