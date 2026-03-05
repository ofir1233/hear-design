import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { apiFetch } from '../../lib/api.js'

const S = { EMAIL: 'EMAIL', SENT: 'SENT', SETUP: 'SETUP', PROCESSING: 'PROCESSING' }

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
        border: `1px dashed ${dragging ? '#1779F7' : 'rgba(255,255,255,0.18)'}`,
        borderRadius: 10,
        padding: '18px 16px',
        cursor: 'pointer',
        background: dragging ? 'rgba(23,121,247,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'border-color 180ms ease, background 180ms ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.txt,.docx,.zip"
        style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />
      {file ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#1779F7' }}>
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
            Drop a file or <span style={{ color: '#1779F7', textDecoration: 'underline' }}>browse</span>
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>PDF, CSV, TXT, DOCX, ZIP</span>
        </>
      )}
    </div>
  )
}

// ── DevFlow ───────────────────────────────────────────────────────
export default function DevFlow({ onComplete }) {
  // Check if we arrived via a magic link (?devToken=...)
  const urlToken = new URLSearchParams(window.location.search).get('devToken')

  const [screen, setScreen]     = useState(urlToken ? S.SETUP : S.EMAIL)
  const [email, setEmail]       = useState('')
  const [token, setToken]       = useState(urlToken ?? '')
  const [sending, setSending]   = useState(false)
  const [error, setError]       = useState('')
  // Setup form
  const [url, setUrl]               = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile]             = useState(null)
  const [saving, setSaving]         = useState(false)
  const [statusMsg, setStatusMsg]   = useState('')

  const containerRef = useRef(null)

  // Animate on screen change
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: 10, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out' }
    )
  }, [screen])

  // If arrived via magic link, validate the token and pre-fill email
  useEffect(() => {
    if (!urlToken) return
    apiFetch(`/api/dev/token/${urlToken}`)
      .then(r => r.json())
      .then(data => {
        if (data.email) setEmail(data.email)
        else setError('This link has expired. Please request a new one.')
      })
      .catch(() => setError('Could not validate link.'))
  }, [urlToken])

  async function handleSendLink(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setError('')
    try {
      await apiFetch('/api/dev/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setScreen(S.SENT)
    } catch {
      setError('Failed to send link. Please try again.')
    }
    setSending(false)
  }

  async function handleSave() {
    if (!url.trim() && !description.trim() && !file) return
    setSaving(true)
    setStatusMsg('Scraping your site…')

    try {
      const body = new FormData()
      body.append('token', token)
      body.append('email', email)
      body.append('url', url.trim())
      body.append('description', description.trim())
      if (file) body.append('file', file)

      setStatusMsg('Analysing content…')
      const res  = await apiFetch('/api/dev/activate', { method: 'POST', body })
      const data = await res.json()

      if (data.config) {
        // Store token so every chat request uses this environment's config
        if (token) localStorage.setItem('hear-dev-token', token)
        // Store suggested prompts so the dashboard can show them
        if (data.config.suggestedPrompts?.length) {
          localStorage.setItem('hear-suggested-prompts', JSON.stringify(data.config.suggestedPrompts))
        }
        if (data.config.companyName) {
          localStorage.setItem('hear-company-name', data.config.companyName)
        }
      }

      // Clean the token from the URL so refresh doesn't re-trigger
      window.history.replaceState({}, '', window.location.pathname)

      onComplete()
    } catch {
      setError('Setup failed. Please try again.')
      setSaving(false)
      setStatusMsg('')
    }
  }

  const canSave = url.trim() || description.trim() || file

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── EMAIL ── */}
      {screen === S.EMAIL && (
        <form onSubmit={handleSendLink} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Developer access
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(23,121,247,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          {error && <p style={{ fontSize: 12, color: '#FF6B6B', margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={!email.trim() || sending}
            style={{
              width: '100%', padding: '12px 20px',
              background: email.trim() ? '#1779F7' : 'rgba(255,255,255,0.07)',
              border: 'none', borderRadius: 10,
              color: email.trim() ? '#fff' : 'rgba(255,255,255,0.22)',
              fontSize: 14, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
              cursor: email.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 200ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {sending
              ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'btn-spin 0.7s linear infinite', display: 'block' }} />
              : <>Send setup link <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></>
            }
          </button>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0 }}>
            We'll email you a one-time setup link
          </p>
        </form>
      )}

      {/* ── SENT ── */}
      {screen === S.SENT && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0 8px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(23,121,247,0.12)', border: '1px solid rgba(23,121,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: '#1779F7' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 5 }}>Check your inbox</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>
                Sent a setup link to<br/>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{email}</span>
              </div>
            </div>
          </div>
          {/* Dev shortcut — simulate clicking the link */}
          <button
            onClick={() => setScreen(S.SETUP)}
            style={{
              width: '100%', padding: '11px 20px',
              background: 'rgba(23,121,247,0.12)', border: '1px solid rgba(23,121,247,0.3)',
              borderRadius: 10, color: '#5BA3F9',
              fontSize: 13, fontWeight: 500, fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer', transition: 'background 180ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(23,121,247,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(23,121,247,0.12)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Open setup page
          </button>
          <button
            onClick={() => setScreen(S.EMAIL)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0, textAlign: 'center', textDecoration: 'underline' }}
          >
            ← Use a different email
          </button>
        </div>
      )}

      {/* ── SETUP ── */}
      {screen === S.SETUP && !saving && (
        <>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Configure your environment
          </p>
          {error && <p style={{ fontSize: 12, color: '#FF6B6B', margin: 0 }}>{error}</p>}
          <input
            type="url" placeholder="Your platform URL"
            value={url} onChange={e => setUrl(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(23,121,247,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          <textarea
            placeholder="Describe your environment or add context…"
            value={description} onChange={e => setDescription(e.target.value)}
            rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.55 }}
            onFocus={e => e.target.style.borderColor = 'rgba(23,121,247,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          <FileDropzone file={file} onFile={setFile} />
          <button
            onClick={handleSave} disabled={!canSave}
            style={{
              width: '100%', padding: '12px 20px',
              background: canSave ? '#1779F7' : 'rgba(255,255,255,0.07)',
              border: 'none', borderRadius: 10,
              color: canSave ? '#fff' : 'rgba(255,255,255,0.22)',
              fontSize: 14, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
              cursor: canSave ? 'pointer' : 'not-allowed',
              transition: 'background 200ms ease', marginTop: 2,
            }}
          >
            Save & enter →
          </button>
        </>
      )}

      {/* ── PROCESSING ── */}
      {saving && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
          <span style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#1779F7', borderRadius: '50%', animation: 'btn-spin 0.75s linear infinite', display: 'block' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Setting up your environment</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{statusMsg}</div>
          </div>
        </div>
      )}

    </div>
  )
}
