import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGoogleLogin } from '@react-oauth/google'
import SignInHero from './sign-in/SignInHero.jsx'
import GoogleButton from './sign-in/GoogleButton.jsx'
import AuthDivider from './sign-in/AuthDivider.jsx'
import EmailForm from './sign-in/EmailForm.jsx'
import DemoFlow from './demo/DemoFlow.jsx'
import DevFlow from './dev/DevFlow.jsx'

const ALLOWED_DOMAIN = 'hear.ai'

export default function SignIn({ onSignIn }) {
  const [env, setEnv] = useState('Design Lab')

  // ── Regular (hear.ai) Google login ───────────────────────────────
  const [googleError, setGoogleError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()
        if (!userInfo.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
          setGoogleError(`Access is restricted to @${ALLOWED_DOMAIN} accounts.`)
          setLoading(false)
          return
        }
        onSignIn()
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
  const formRef = useRef(null)
  useEffect(() => {
    const form = formRef.current
    gsap.set(form, { opacity: 0, y: 24, filter: 'blur(8px)' })
    gsap.to(form, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out', delay: 0.66 })
  }, [])

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

      {/* ── Dev bypass ── */}
      <button
        onClick={onSignIn}
        title="Enter platform"
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 30, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.2, padding: 6, transition: 'opacity 200ms ease' }}
        onMouseEnter={e => e.currentTarget.style.opacity = 0.6}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.2}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 17L15 12L10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Grain overlay ── */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20, opacity: 0.4 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Decorative images ── */}
      <img src="/top-image.svg" alt="" aria-hidden="true" style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: '100%', minWidth: 900, pointerEvents: 'none', zIndex: 1 }} />
      <img src="/bot.svg"       alt="" aria-hidden="true" style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', width: '100%', minWidth: 900, pointerEvents: 'none', zIndex: 1, display: 'block' }} />

      {/* ── Main content ── */}
      <div style={{ position: 'absolute', top: 153, bottom: 153, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1160, height: '100%', padding: '0 60px', boxSizing: 'border-box', gap: 100 }}>

          {/* Left panel */}
          <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SignInHero env={env} onEnvChange={setEnv} />

            <div
              ref={formRef}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {env === 'Demo' ? (
                <>
                  <DemoFlow
                    googleUser={demoUser}
                    onGoogleLogin={() => demoGoogleLogin()}
                    onComplete={() => onSignIn()}
                  />
                  {demoAuthError && (
                    <p style={{ fontSize: 12, color: '#FF6B6B', textAlign: 'center', margin: 0 }}>{demoAuthError}</p>
                  )}
                </>
              ) : env === 'Dev' ? (
                <DevFlow onComplete={() => onSignIn()} />
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
