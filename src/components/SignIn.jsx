import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'


function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}



const ALLOWED_DOMAIN = 'hear.ai'

export default function SignIn({ onSignIn }) {
  const [googleError, setGoogleError] = useState('')


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()
        if (!userInfo.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
          setGoogleError(`Access is restricted to @${ALLOWED_DOMAIN} accounts.`)
          return
        }
        onSignIn()
      } catch {
        setGoogleError('Sign-in failed. Please try again.')
      }
    },
    onError: () => setGoogleError('Google sign-in failed. Please try again.'),
  })

  return (
    <div style={{
      height: '100vh',
      background: '#000000',
      fontFamily: "'Byrd', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Dev bypass button ── */}
      <button
        onClick={onSignIn}
        title="Enter platform"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 30,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.2,
          padding: 6,
          transition: 'opacity 200ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 0.6}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.2}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 17L15 12L10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Grain overlay ── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20, opacity: 0.4 }}
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Top arc ── */}
      <img
        src="/top-image.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          minWidth: 900,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Bottom image ── */}
      <img
        src="/bot.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          minWidth: 900,
          pointerEvents: 'none',
          zIndex: 1,
          display: 'block',
        }}
      />

      {/* ── Main content — pinned between the two decorative images ── */}
      {/* top-image.svg is 233px tall at top:-80 → visible bottom edge at 153px from top  */}
      {/* bot.svg       is 233px tall at bottom:-80 → visible top edge at 153px from bottom */}
      <div style={{
        position: 'absolute',
        top: 153,
        bottom: 153,
        left: 0,
        right: 0,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1160,
        height: '100%',
        padding: '0 60px',
        boxSizing: 'border-box',
        gap: 100,
      }}>

        {/* ── Left: logo + headline + form ── */}
        <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Logo — inverted to white */}
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
              Design Lab
            </span>
          </div>

          {/* Headline */}
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

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            <button
              onClick={() => googleLogin()}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 0',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.07)',
                fontSize: 13,
                fontWeight: 500,
                color: '#fff',
                cursor: 'pointer',
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {googleError && (
              <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.9)', margin: '0', textAlign: 'center' }}>{googleError}</p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              disabled
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
                fontSize: 13,
                color: 'rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.03)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "'Byrd', sans-serif",
                cursor: 'not-allowed',
              }}
            />

            <button
              disabled
              style={{
                width: '100%',
                padding: '11px 0',
                background: 'rgba(255,255,255,0.15)',
                color: 'rgba(0,0,0,0.35)',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'not-allowed',
                fontFamily: "'Byrd', sans-serif",
              }}
            >
              Continue with email
            </button>

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: 0 }}>
              By continuing, you acknowledge Hear's{' '}
              <a href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* ── Right: video ── */}
        <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: -1 }}
          />
        </div>

      </div>
      </div>
    </div>
  )
}
