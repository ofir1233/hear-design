import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { apiFetch } from '../../lib/api.js'

// ── Screen IDs ────────────────────────────────────────────────────
const S = { GATE: 'GATE', CHECKING: 'CHECKING', SELECT: 'SELECT', CREATE: 'CREATE', WAITING: 'WAITING' }

// ── Shared style helpers ──────────────────────────────────────────
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

// ── Google Button (demo variant) ──────────────────────────────────
function DemoGoogleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 12,
        padding: '12px 20px',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'Byrd', sans-serif",
        cursor: 'pointer',
        transition: 'background 180ms ease, border-color 180ms ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  )
}

// ── Profile Card ──────────────────────────────────────────────────
function ProfileCard({ profile, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [removing, setRemoving] = useState(false)
  const isReady = !profile.status || profile.status === 'ready'

  function handleDelete(e) {
    e.stopPropagation()
    setRemoving(true)
    onDelete(profile.id)
  }

  return (
    <div
      onClick={isReady && !removing ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: hovered && isReady ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered && isReady ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 14,
        padding: '14px 16px',
        cursor: isReady && !removing ? 'pointer' : 'default',
        opacity: removing ? 0 : (isReady ? 1 : 0.6),
        transform: removing ? 'scale(0.97)' : (hovered && isReady ? 'translateY(-1px)' : 'translateY(0)'),
        transition: removing
          ? 'opacity 200ms ease, transform 200ms ease'
          : 'background 180ms ease, border-color 180ms ease, transform 120ms ease, opacity 200ms ease',
        textAlign: 'left',
        fontFamily: "'Byrd', sans-serif",
        boxSizing: 'border-box',
        pointerEvents: removing ? 'none' : 'auto',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${profile.color}22`,
        border: `1px solid ${profile.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, color: profile.color, flexShrink: 0,
      }}>
        {profile.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{profile.name}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.subtitle}</div>
      </div>

      {/* Delete button — reveals on hover */}
      <button
        onClick={handleDelete}
        style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28,
          borderRadius: 8,
          background: hovered ? 'rgba(239,68,68,0.12)' : 'transparent',
          border: hovered ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
          cursor: 'pointer',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 150ms ease, transform 150ms ease, background 150ms ease, border-color 150ms ease',
          color: '#EF4444',
        }}
        title="Remove demo"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isReady ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, opacity: hovered ? 0 : 1, transition: 'opacity 150ms ease', marginLeft: -42 }}>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <span style={{ fontSize: 11, color: '#F59E0B', whiteSpace: 'nowrap', flexShrink: 0 }}>Building…</span>
      )}
    </div>
  )
}

// ── File Dropzone ─────────────────────────────────────────────────
function FileDropzone({ file, onFile }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `1px dashed ${dragging ? '#FF7056' : 'rgba(255,255,255,0.18)'}`,
        borderRadius: 10,
        padding: '18px 16px',
        cursor: 'pointer',
        background: dragging ? 'rgba(255,112,86,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'border-color 180ms ease, background 180ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.txt,.docx"
        style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />
      {file ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#FF7056' }}>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{file.name}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Click to replace</span>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
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

// ── Spinner ───────────────────────────────────────────────────────
function Spinner({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `${Math.max(2, size / 12)}px solid rgba(255,255,255,0.1)`,
      borderTopColor: '#FF7056',
      borderRadius: '50%',
      animation: 'btn-spin 0.75s linear infinite',
    }} />
  )
}

// ── DemoFlow ──────────────────────────────────────────────────────
export default function DemoFlow({ googleUser, onGoogleLogin, onComplete }) {
  const [screen, setScreen] = useState(googleUser ? S.CHECKING : S.GATE)
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  // Create form
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const containerRef = useRef(null)

  // On mount: if ?demoToken= in URL, skip Google auth and load profiles directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demoToken = params.get('demoToken')
    if (!demoToken) return
    setScreen(S.CHECKING)
    apiFetch(`/api/demo/token/${encodeURIComponent(demoToken)}`)
      .then(r => r.json())
      .then(data => {
        const list = data.profiles || []
        setProfiles(list)
        setScreen(list.length > 0 ? S.SELECT : S.GATE)
        // Clean the token from the URL so it doesn't persist on refresh
        window.history.replaceState({}, '', window.location.pathname)
      })
      .catch(() => setScreen(S.GATE))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Animate in on screen change
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: 10, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out' }
    )
  }, [screen])

  // When googleUser arrives (from GATE), start checking
  useEffect(() => {
    if (!googleUser) return
    if (screen === S.GATE || screen === S.CHECKING) {
      setScreen(S.CHECKING)
      apiFetch('/api/demo/profiles', {
        headers: { 'X-User-Email': googleUser.email },
      })
        .then(r => r.json())
        .then(data => {
          const list = data.profiles || []
          setProfiles(list)
          setScreen(list.length > 0 ? S.SELECT : S.CREATE)
        })
        .catch(() => setScreen(S.CREATE))
    }
  }, [googleUser]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDeleteProfile(id) {
    try {
      await apiFetch(`/api/demo/profiles/${id}`, { method: 'DELETE' })
    } catch { /* silent */ }
    // Wait for the fade-out animation, then remove from list
    setTimeout(() => {
      setProfiles(prev => {
        const next = prev.filter(p => p.id !== id)
        if (next.length === 0) setScreen(S.CREATE)
        return next
      })
    }, 220)
  }

  async function handleCreate() {
    if (!url.trim() && !description.trim() && !file) return
    setScreen(S.WAITING)
    let resultProfile = null
    try {
      const body = new FormData()
      body.append('userEmail', googleUser?.email ?? '')
      body.append('url', url.trim())
      body.append('description', description.trim())
      if (file) body.append('file', file)

      const res  = await apiFetch('/api/demo/generate', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))

      if (data.profile?.id) {
        localStorage.setItem('hear-demo-profile-id', String(data.profile.id))
      }
      if (data.config) {
        localStorage.setItem('hear-demo-config', JSON.stringify(data.config))
        if (data.config.suggestedPrompts) {
          localStorage.setItem('hear-suggested-prompts', JSON.stringify(data.config.suggestedPrompts))
        }
      }
      resultProfile = data.profile || null
    } catch {
      // even on error, proceed — stub environment
    }
    // brief pause to let the WAITING animation breathe, then complete
    setTimeout(() => onComplete(resultProfile), 1200)
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── GATE ── */}
      {screen === S.GATE && (
        <>
          <DemoGoogleButton onClick={onGoogleLogin} />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: 0 }}>
            Demo access — any Google account works
          </p>
          {error && (
            <p style={{ fontSize: 12, color: '#FF6B6B', textAlign: 'center', margin: 0 }}>{error}</p>
          )}
        </>
      )}

      {/* ── CHECKING ── */}
      {screen === S.CHECKING && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '22px 0' }}>
          <Spinner size={30} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Checking your demo workspace…</span>
        </div>
      )}

      {/* ── SELECT ── */}
      {screen === S.SELECT && (
        <>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '0 0 2px',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            Your demo environments
          </p>
          {profiles.map(p => (
            <ProfileCard
              key={p.id}
              profile={p}
              onClick={() => {
                localStorage.setItem('hear-demo-profile-id', String(p.id))
                if (p.config) localStorage.setItem('hear-demo-config', JSON.stringify(p.config))
                onComplete(p)
              }}
              onDelete={handleDeleteProfile}
            />
          ))}
          <button
            onClick={() => setScreen(S.CREATE)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.14)',
              borderRadius: 14,
              padding: '11px 16px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 500,
              fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer',
              transition: 'border-color 180ms ease, color 180ms ease',
              marginTop: 2,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,112,86,0.5)'; e.currentTarget.style.color = '#FF7056' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create new demo environment
          </button>
        </>
      )}

      {/* ── CREATE ── */}
      {screen === S.CREATE && (
        <>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '0 0 2px',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            Set up your demo
          </p>

          <input
            type="url"
            placeholder="Your company website URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(255,112,86,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />

          <textarea
            placeholder="Describe your company in a few sentences…"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.55 }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,112,86,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />

          <FileDropzone file={file} onFile={setFile} />

          <button
            onClick={handleCreate}
            disabled={!url.trim() && !description.trim() && !file}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: (url.trim() || description.trim() || file) ? '#FF7056' : 'rgba(255,255,255,0.07)',
              border: 'none',
              borderRadius: 10,
              color: (url.trim() || description.trim() || file) ? '#fff' : 'rgba(255,255,255,0.22)',
              fontSize: 14, fontWeight: 600,
              fontFamily: "'Byrd', sans-serif",
              cursor: (url.trim() || description.trim() || file) ? 'pointer' : 'not-allowed',
              transition: 'background 200ms ease, color 200ms ease',
              letterSpacing: '0.01em',
              marginTop: 2,
            }}
          >
            Start demo →
          </button>

          {profiles.length > 0 && (
            <button
              onClick={() => setScreen(S.SELECT)}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.3)', fontSize: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                padding: 0, textAlign: 'center', textDecoration: 'underline',
              }}
            >
              ← Back to my environments
            </button>
          )}
        </>
      )}

      {/* ── WAITING ── */}
      {screen === S.WAITING && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '26px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 38 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  width: 4, borderRadius: 3,
                  background: '#FF7056',
                  animation: `bar-bounce 1.1s ease-in-out ${i * 0.13}s infinite`,
                }}
              />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 5 }}>
              Building your demo environment
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
              This takes about 30 seconds.<br />
              We'll email you a link to come back anytime.
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
