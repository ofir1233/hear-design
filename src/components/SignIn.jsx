import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGoogleLogin } from '@react-oauth/google'
import { apiFetch } from '../lib/api.js'
import SignInHero from './sign-in/SignInHero.jsx'
import GoogleButton from './sign-in/GoogleButton.jsx'
import AuthDivider from './sign-in/AuthDivider.jsx'
import EmailForm from './sign-in/EmailForm.jsx'
import DemoFlow from './demo/DemoFlow.jsx'
import DevFlow from './dev/DevFlow.jsx'

// ── Persistence helpers ───────────────────────────────────────────
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

// ── Local fallback config (when backend unreachable) ─────────────
function makeLocalConfig(url, name) {
  const company = name || (() => {
    try {
      const raw = url.startsWith('http') ? url : `https://${url}`
      const base = new URL(raw).hostname.replace(/^www\./, '').split('.')[0]
      return base.charAt(0).toUpperCase() + base.slice(1)
    } catch { return 'My Workspace' }
  })()
  return {
    companyName: company,
    industry: 'Enterprise',
    keyProducts: [company],
    commonTopics: ['Pricing', 'Support', 'Product Inquiry', 'Complaint', 'Onboarding', 'Renewal'],
    suggestedPrompts: [
      `Show me trending topics from ${company} customer calls this week`,
      `Which agents handled ${company} inquiries best this month?`,
      `What are the most common complaints from ${company} customers?`,
      `Summarize customer sentiment from today's ${company} calls`,
    ],
  }
}

// ── Shared input style ────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 13,
  fontFamily: "'Byrd', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 180ms ease',
}

// ── File Dropzone ─────────────────────────────────────────────────
function FileDropzone({ file, onFile }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
      style={{
        border: `1px dashed ${dragging ? '#FF7056' : 'rgba(255,255,255,0.18)'}`,
        borderRadius: 10, padding: '16px',
        cursor: 'pointer',
        background: dragging ? 'rgba(255,112,86,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'border-color 180ms ease, background 180ms ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.csv,.txt,.docx" style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      {file ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#FF7056' }}>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{file.name}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Click to replace</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Drop a file or <span style={{ color: '#FF7056', textDecoration: 'underline' }}>browse</span>
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>PDF, CSV, TXT, DOCX</span>
        </>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function SignIn({ onSignIn }) {
  const [env, setEnv] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('demoToken') ? 'Demo' : 'Design Lab'
  })

  // step: 'auth' | 'name' | 'workspace' | 'generating'
  const [step, setStep]             = useState('auth')
  const [pendingUser, setPendingUser] = useState(null)
  const [googleError, setGoogleError] = useState('')
  const [loading, setLoading]         = useState(false)

  // Name step
  const [nameValue, setNameValue] = useState('')
  const [nameError, setNameError] = useState('')
  const nameInputRef = useRef(null)

  // Workspace step
  const [wsUrl, setWsUrl]               = useState('')
  const [wsDescription, setWsDescription] = useState('')
  const [wsFile, setWsFile]             = useState(null)

  // Focus name input when step switches
  useEffect(() => {
    if (step === 'name') setTimeout(() => nameInputRef.current?.focus(), 350)
  }, [step])

  function animateStep(nextStep) {
    const form = formRef.current
    gsap.to(form, {
      opacity: 0, y: -14, filter: 'blur(8px)',
      duration: 0.28, ease: 'power2.in',
      onComplete: () => {
        setStep(nextStep)
        gsap.fromTo(form,
          { opacity: 0, y: 18, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.42, ease: 'expo.out' }
        )
      },
    })
  }

  // ── Google login ─────────────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()

        // After Google auth → show environment picker (DemoFlow SELECT)
        const name = userInfo.given_name || userInfo.name?.split(' ')[0] || 'there'
        localStorage.setItem('hear-user-name', name)
        setDemoUser(userInfo)
        setLoading(false)
        animateStep('env-select')
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

  // ── Name confirm — skip workspace setup, enter with Demo inv default ──
  function handleConfirmName() {
    const trimmed = nameValue.trim()
    if (!trimmed) { setNameError('Please enter your name.'); return }
    localStorage.setItem('hear-user-name', trimmed)
    const config = {
      companyName: 'Demo inv',
      industry: 'Enterprise SaaS',
      keyProducts: ['Platform', 'Analytics', 'Integrations'],
      commonTopics: ['Pricing', 'Support', 'Onboarding', 'Compliance', 'Performance', 'Escalations', 'Sentiment', 'Agent Evaluation'],
      suggestedPrompts: [
        'Who are my top performing agents this month?',
        'Show me trending topics from the last 24 hours',
        'Which calls had the highest risk score this week?',
        'Summarize customer sentiment from today\'s calls',
        'What are the most common complaints in the last 7 days?',
        'Which agent has the lowest CSAT score this month?',
        'Show me all calls flagged for compliance review',
        'What topics are spiking in enterprise accounts?',
      ],
    }
    const profile = { sub: pendingUser?.sub, name: trimmed, email: pendingUser?.email, picture: pendingUser?.picture, config }
    setCachedUser(profile)
    onSignIn({ mode: 'lab', ...profile })
  }

  // ── Workspace generate ────────────────────────────────────────────
  async function handleGenerateWorkspace() {
    animateStep('generating')
    let config = null

    try {
      const body = new FormData()
      body.append('userEmail', pendingUser?.email ?? '')
      body.append('url', wsUrl.trim())
      body.append('description', wsDescription.trim())
      if (wsFile) body.append('file', wsFile)

      const res  = await apiFetch('/api/demo/generate', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      config = data.config || data.profile?.config || null
    } catch { /* fall through to local fallback */ }

    if (!config) config = makeLocalConfig(wsUrl.trim(), nameValue.trim())

    const profile = {
      sub:     pendingUser?.sub,
      name:    localStorage.getItem('hear-user-name') || nameValue.trim(),
      email:   pendingUser?.email,
      picture: pendingUser?.picture,
      config,
    }
    setCachedUser(profile)
    localStorage.setItem('hear-workspace-config', JSON.stringify(config))

    // Brief pause so the animation breathes
    setTimeout(() => {
      onSignIn({ mode: 'lab', ...profile })
    }, 1200)
  }

  function handleSkipWorkspace() {
    const name = localStorage.getItem('hear-user-name') || nameValue.trim()
    const config = makeLocalConfig('', name)
    const profile = {
      sub:     pendingUser?.sub,
      name,
      email:   pendingUser?.email,
      picture: pendingUser?.picture,
      config,
    }
    setCachedUser(profile)
    onSignIn({ mode: 'lab', ...profile })
  }

  // ── Demo login ───────────────────────────────────────────────────
  const [demoUser, setDemoUser]         = useState(null)
  const [demoAuthError, setDemoAuthError] = useState('')

  const demoGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()
        setDemoUser(userInfo)
      } catch { setDemoAuthError('Google sign-in failed. Please try again.') }
    },
    onError: () => setDemoAuthError('Google sign-in failed. Please try again.'),
  })

  useEffect(() => {
    if (env !== 'Demo') { setDemoUser(null); setDemoAuthError('') }
  }, [env])

  // ── Entrance animation ───────────────────────────────────────────
  const formRef   = useRef(null)
  const formReady = useRef(false)

  useEffect(() => {
    const form = formRef.current
    gsap.set(form, { opacity: 0, y: 24, filter: 'blur(8px)' })
    gsap.to(form, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.6, ease: 'expo.out', delay: 0.66,
      onComplete: () => { formReady.current = true },
    })
  }, [])

  useLayoutEffect(() => {
    if (!formReady.current) return
    const form = formRef.current
    if (!form) return
    gsap.fromTo(form,
      { opacity: 0, y: 14, filter: 'blur(8px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' }
    )
  }, [env])

  const canSubmitWorkspace = wsUrl.trim() || wsDescription.trim() || wsFile

  return (
    <div
      data-inspector="SignIn"
      style={{
        height: '100vh', background: '#000000',
        fontFamily: "'Byrd', sans-serif", position: 'relative',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20, opacity: 0.4 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <img src="/top-image.svg" alt="" aria-hidden="true" style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: '80vw', pointerEvents: 'none', zIndex: 1 }} />
      <img src="/bot.svg"       alt="" aria-hidden="true" style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', width: '80vw', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1160, padding: '0 60px', boxSizing: 'border-box', gap: 100 }}>

          <div style={{ flex: '0 0 340px', width: 340, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24, paddingBottom: 24, minHeight: 'clamp(420px, 65vh, 540px)' }}>
            <SignInHero env={env} onEnvChange={step === 'auth' ? setEnv : undefined} />

            <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>

              {/* ── Auth step — Design Lab ── */}
              {step === 'auth' && env !== 'Demo' && env !== 'Dev' && (
                <>
                  <GoogleButton onClick={() => googleLogin()} loading={loading} error={googleError} />
                  <AuthDivider />
                  <EmailForm />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: 0 }}>
                    By continuing, you acknowledge Hear's{' '}
                    <a href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Privacy Policy</a>.
                  </p>
                </>
              )}

              {/* ── Environment picker (after Google auth) ── */}
              {step === 'env-select' && (
                <DemoFlow
                  googleUser={demoUser}
                  onGoogleLogin={() => {}}
                  onComplete={(profile) => onSignIn({ ...profile, mode: 'lab' })}
                />
              )}

              {/* ── Demo ── */}
              {step === 'auth' && env === 'Demo' && (
                <>
                  <DemoFlow
                    googleUser={demoUser}
                    onGoogleLogin={() => demoGoogleLogin()}
                    onComplete={(profile) => onSignIn({ ...profile, mode: 'demo' })}
                  />
                  {demoAuthError && <p style={{ fontSize: 12, color: '#FF6B6B', textAlign: 'center', margin: 0 }}>{demoAuthError}</p>}
                </>
              )}

              {/* ── Dev ── */}
              {step === 'auth' && env === 'Dev' && <DevFlow onComplete={onSignIn} />}

              {/* ── Name step ── */}
              {step === 'name' && (
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
                      ...inputStyle,
                      border: nameError ? '1px solid rgba(255,100,100,0.6)' : inputStyle.border,
                    }}
                    onFocus={e => { if (!nameError) e.target.style.borderColor = 'rgba(255,112,86,0.55)' }}
                    onBlur={e => { if (!nameError) e.target.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  />
                  {nameError && <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.9)', margin: 0 }}>{nameError}</p>}
                  <button
                    onClick={handleConfirmName}
                    style={{
                      width: '100%', padding: '11px 0',
                      background: 'rgba(255,255,255,0.9)', color: '#000',
                      border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                  >
                    Continue →
                  </button>
                </>
              )}

              {/* ── Workspace step ── */}
              {step === 'workspace' && (
                <>
                  <p style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '0 0 2px',
                    letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    Set up your workspace
                  </p>

                  <input
                    type="url"
                    placeholder="Your company website URL"
                    value={wsUrl}
                    onChange={e => setWsUrl(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,112,86,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />

                  <textarea
                    placeholder="Describe your company in a few sentences…"
                    value={wsDescription}
                    onChange={e => setWsDescription(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.55 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,112,86,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />

                  <FileDropzone file={wsFile} onFile={setWsFile} />

                  <button
                    onClick={handleGenerateWorkspace}
                    disabled={!canSubmitWorkspace}
                    style={{
                      width: '100%', padding: '12px 20px',
                      background: canSubmitWorkspace ? '#FF7056' : 'rgba(255,255,255,0.07)',
                      border: 'none', borderRadius: 10,
                      color: canSubmitWorkspace ? '#fff' : 'rgba(255,255,255,0.22)',
                      fontSize: 14, fontWeight: 600,
                      fontFamily: "'Byrd', sans-serif",
                      cursor: canSubmitWorkspace ? 'pointer' : 'not-allowed',
                      transition: 'background 200ms ease, color 200ms ease',
                      marginTop: 2,
                    }}
                  >
                    Set up my workspace →
                  </button>

                  <button
                    onClick={handleSkipWorkspace}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.3)', fontSize: 12,
                      cursor: 'pointer', fontFamily: 'inherit',
                      padding: 0, textAlign: 'center',
                    }}
                  >
                    Skip for now
                  </button>
                </>
              )}

              {/* ── Generating step ── */}
              {step === 'generating' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '26px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 38 }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        width: 4, borderRadius: 3,
                        background: '#FF7056',
                        animation: `bar-bounce 1.1s ease-in-out ${i * 0.13}s infinite`,
                      }} />
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 5 }}>
                      Setting up your workspace
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                      This takes about 30 seconds.<br />
                      We're personalizing the platform for you.
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <video src="/hero.mp4" autoPlay loop muted playsInline style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: -1 }} />
          </div>

        </div>
      </div>
    </div>
  )
}
