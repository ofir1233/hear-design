import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { MicIcon, ReturnIcon, NavigateIcon, EscIcon, AttachIcon } from './icons'

const PROMPTS = [
  'Who are my top performing agents this month?',
  'Show me trending topics from the last 24 hours',
  'Which calls had the highest risk score this week?',
  'Summarize customer sentiment from today\'s calls',
  'What are the most common complaints in the last 7 days?',
  'Which agent has the lowest CSAT score this month?',
  'Show me all calls flagged for compliance review',
  'What topics are spiking in enterprise accounts?',
  'Compare agent performance across all regions',
  'How many escalations happened in the last 48 hours?',
]

function useTypewriter(active, prompts = PROMPTS) {
  const [display, setDisplay]   = useState('')
  const [blink,   setBlink]     = useState(true)
  const promptIdx  = useRef(0)
  const charIdx    = useRef(0)
  const phase      = useRef('typing') // typing | hold | deleting | gap
  const timer      = useRef(null)
  const promptsRef = useRef(prompts)
  promptsRef.current = prompts // always current without restarting the effect

  useEffect(() => {
    if (!active) {
      clearTimeout(timer.current)
      setDisplay('')
      charIdx.current = 0
      phase.current   = 'typing'
      return
    }

    function tick() {
      const pool   = promptsRef.current
      const prompt = pool[promptIdx.current % pool.length]
      if (phase.current === 'typing') {
        charIdx.current++
        setDisplay(prompt.slice(0, charIdx.current))
        if (charIdx.current >= prompt.length) {
          phase.current = 'hold'
          timer.current = setTimeout(tick, 2000)
        } else {
          // slight speed variation for natural feel
          const speed = 44 + Math.random() * 24
          timer.current = setTimeout(tick, speed)
        }
      } else if (phase.current === 'hold') {
        phase.current = 'deleting'
        tick()
      } else if (phase.current === 'deleting') {
        charIdx.current--
        setDisplay(prompt.slice(0, charIdx.current))
        if (charIdx.current <= 0) {
          phase.current   = 'gap'
          promptIdx.current = (promptIdx.current + 1) % promptsRef.current.length
          timer.current   = setTimeout(tick, 380)
        } else {
          timer.current = setTimeout(tick, 18)
        }
      } else {
        phase.current = 'typing'
        tick()
      }
    }

    timer.current = setTimeout(tick, 900)
    return () => clearTimeout(timer.current)
  }, [active])

  // blinking cursor
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(id)
  }, [])

  return { display, blink }
}

const MENTION_ITEMS = [
  { id: 1, name: 'Ai assistant',                  handle: 'Tommy@'    },
  { id: 2, name: 'Another something makes seance', handle: 'Whatever@' },
  { id: 3, name: 'Something makes seance',          handle: 'Whatever@' },
]

function WaveAnimation() {
  const delays = ['0ms', '120ms', '240ms', '80ms', '200ms']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 14 }}>
      {delays.map((delay, i) => (
        <span key={i} style={{
          display: 'inline-block',
          width: 2,
          height: 2,
          borderRadius: 1,
          background: '#1779F7',
          animation: 'wave-bar 900ms ease-in-out infinite',
          animationDelay: delay,
        }} />
      ))}
    </div>
  )
}

function ThinkingDots() {
  const base = {
    display: 'inline-block',
    width: 3.5,
    height: 3.5,
    borderRadius: '50%',
    background: 'white',
    animation: 'dot-bounce 1.1s ease-in-out infinite',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
      <span style={{ ...base, animationDelay: '0ms'   }} />
      <span style={{ ...base, animationDelay: '160ms' }} />
      <span style={{ ...base, animationDelay: '320ms' }} />
    </div>
  )
}

// Finds an active @mention being typed: returns { query, start } or null
function getActiveMention(text, cursorPos) {
  const before = text.slice(0, cursorPos)
  const match = before.match(/@(\w*)$/)
  if (!match) return null
  return { query: match[1], start: match.index }
}

export default function ChatInput({ onSubmit, onMentionChange, onUploadChange, onFocusChange, onKeystroke, loading = false, settled = false, defaultText = '', initialUploadOpen = false, initialMentionQuery = null, suggestedPrompts = null }) {
  const [text, setText]           = useState(defaultText)
  const [hovered, setHovered]     = useState(false)
  const [focused, setFocused]     = useState(false)
  const [mentionQuery, setMentionQuery] = useState(initialMentionQuery)
  const [mentionStart, setMentionStart] = useState(0)
  const [activeIndex, setActiveIndex]   = useState(0)
  const [uploadOpen, setUploadOpen]     = useState(initialUploadOpen)
  const [listening, setListening] = useState(false)
  const textareaRef          = useRef(null)
  const recognitionRef       = useRef(null)
  const glowWrapperRef       = useRef(null)
  const glowLayer1Ref        = useRef(null)
  const settledPlaceholderRef  = useRef(null)
  const typewriterRef          = useRef(null)
  const focusedRef             = useRef(false)
  const blurTimerRef           = useRef(null)
  const textRef                = useRef('')
  const listeningRef           = useRef(false)
  const hoveringIconsRef       = useRef(false)
  const iconBlendRef           = useRef(0)
  const iconLeaveTimerRef      = useRef(null)
  const beamRef                = useRef(null)
  const beamTweensRef          = useRef([])
  const micContainerRef        = useRef(null)
  const outerRef               = useRef(null)

  const GLOW_PROXIMITY = 120 // px from edge to start showing

  // Direct DOM manipulation — no React state, no re-renders on mouse move
  useEffect(() => {
    let rafId = null
    function handleGlobalMouseMove(e) {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const wrapper = glowWrapperRef.current
        const layer1  = glowLayer1Ref.current
        if (!wrapper || !layer1) return
        const rect = wrapper.getBoundingClientRect()
        const dx   = Math.max(0, rect.left - e.clientX, e.clientX - rect.right)
        const dy   = Math.max(0, rect.top  - e.clientY, e.clientY - rect.bottom)
        const dist = Math.sqrt(dx * dx + dy * dy)

        const isBlue = focusedRef.current || listeningRef.current
        if (dist > GLOW_PROXIMITY || isBlue) {
          wrapper.style.boxShadow = isBlue
            ? '0 0 0 3px rgba(23,121,247,0.1), 0 4px 28px rgba(23,121,247,0.18)'
            : '0 2px 8px 0 rgba(0,0,0,0.06)'
          if (!isBlue) layer1.style.background = 'var(--border-input)'
          return
        }
        const intensity = hoveringIconsRef.current ? 1 : 1 - dist / GLOW_PROXIMITY
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const t  = listeningRef.current ? 1 : iconBlendRef.current
        const cr = Math.round(255 - 232 * t)
        const cg = Math.round(112 +   9 * t)
        const cb = Math.round( 86 + 161 * t)
        const r  = `${cr},${cg},${cb}`
        layer1.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(${r},${intensity}) 0%, rgba(${r},${intensity * 0.35}) 30%, var(--border-default) 60%)`
        wrapper.style.boxShadow = `0 0 ${24 * intensity}px rgba(${r},${0.15 * intensity})`
      })
    }
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    return () => { window.removeEventListener('mousemove', handleGlobalMouseMove); if (rafId) cancelAnimationFrame(rafId) }
  }, [])

  const activePrompts    = (suggestedPrompts?.length >= 3) ? suggestedPrompts : PROMPTS
  const typewriterActive = !text && !focused && !settled && !loading
  const typewriterVisible = !settled && !loading
  const { display: typedHint, blink } = useTypewriter(typewriterActive, activePrompts)

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition

  function startRecognition() {
    if (!SR) return
    const rec = new SR()
    rec.continuous     = true
    rec.interimResults = true
    rec.lang           = 'en-US'
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setText(transcript)
    }
    rec.onend = () => {
      // Always restart a fresh instance while user hasn't clicked to stop
      if (listeningRef.current) {
        setTimeout(() => {
          if (listeningRef.current) startRecognition()
        }, 80)
      } else {
        setListening(false)
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed') {
        setListening(false); listeningRef.current = false
        alert('Microphone access was blocked. Please allow microphone permission for this site in your browser settings.')
      }
      // Other errors (aborted, network) are transient — onend will restart
    }
    recognitionRef.current = rec
    rec.start()
  }

  function toggleListening() {
    if (listening) {
      listeningRef.current = false
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    if (!SR) return
    setListening(true); listeningRef.current = true
    startRecognition()
  }

  // Sync externally-set defaultText (e.g. from Related click)
  useEffect(() => {
    if (!defaultText) return
    setText(defaultText)
    const el = textareaRef.current
    if (!el) return
    el.focus()
    setTimeout(() => el.setSelectionRange(defaultText.length, defaultText.length), 0)
  }, [defaultText])

  useEffect(() => {
    onMentionChange?.(mentionQuery !== null)
  }, [mentionQuery])

  useEffect(() => {
    onUploadChange?.(uploadOpen)
  }, [uploadOpen])

  // Auto-resize textarea — when empty, use 'auto' so minHeight controls visually
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    if (text) el.style.height = `${el.scrollHeight}px`
    // No explicit height when empty: element visually follows minHeight (GSAP-animated)
  }, [text])

  // Sync box-shadow and layer1 directly when focus state changes
  useEffect(() => {
    const wrapper = glowWrapperRef.current
    const layer1  = glowLayer1Ref.current
    if (!wrapper || !layer1) return
    if (focused || listening) {
      const t = setTimeout(() => {
        wrapper.style.boxShadow = '0 0 0 3px rgba(23,121,247,0.1), 0 4px 28px rgba(23,121,247,0.18)'
      }, focused ? 420 : 0)
      return () => clearTimeout(t)
    } else {
      const hasText = !!textRef.current
      wrapper.style.boxShadow = hasText
        ? '0 0 0 3px rgba(23,121,247,0.1), 0 4px 28px rgba(23,121,247,0.18)'
        : '0 2px 8px 0 rgba(0,0,0,0.06)'
      if (!hasText) layer1.style.background = 'var(--border-input)'
    }
  }, [focused, listening])

  // Set initial hidden state for typewriter placeholder
  useEffect(() => {
    if (typewriterRef.current) gsap.set(typewriterRef.current, { opacity: 0, y: 6 })
  }, [])

  // Animate typewriter placeholder in/out
  useEffect(() => {
    const el = typewriterRef.current
    if (!el) return
    gsap.killTweensOf(el)
    if (typewriterActive) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    } else {
      gsap.to(el, { opacity: 0, y: -6, duration: 0.22, ease: 'power2.in' })
    }
  }, [typewriterActive])

  // Set initial hidden state for settled placeholder
  useEffect(() => {
    if (settledPlaceholderRef.current) gsap.set(settledPlaceholderRef.current, { opacity: 0, y: 6 })
  }, [settled])

  // Animate settled placeholder in/out
  useEffect(() => {
    const el = settledPlaceholderRef.current
    if (!el) return
    if (focused || text) {
      gsap.to(el, { opacity: 0, y: -6, duration: 0.22, ease: 'power2.in' })
    } else {
      gsap.fromTo(el,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }
      )
    }
  }, [focused, text, settled])

  // Expand / collapse textarea height on focus — only before conversation starts
  const LINE_HEIGHT = 26 // px per line (text-base leading-relaxed)
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    // Once settled at the bottom, keep compact regardless of focus
    if (settled) return
    gsap.killTweensOf(el)
    // Expand on focus; shrink on blur only if no text (text content keeps it tall naturally)
    const target = focused ? LINE_HEIGHT * 4 : LINE_HEIGHT
    gsap.to(el, {
      minHeight: target,
      duration: 0.4,
      ease: 'expo.out',
      onComplete: () => {
        if (!focused && !text) el.style.minHeight = ''
      },
    })
  }, [focused, settled]) // eslint-disable-line react-hooks/exhaustive-deps

  // Slide mic into logo's spot when logo hides, slide back when logo returns

  // Close dropdowns + deactivate when clicking outside the entire component
  useEffect(() => {
    function handleOutsideClick(e) {
      if (outerRef.current && !outerRef.current.contains(e.target)) {
        setUploadOpen(false)
        setMentionQuery(null)
        textareaRef.current?.blur()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Force compact on settle — clear all inline height styles and release to CSS
  useEffect(() => {
    if (!settled) return
    const el = textareaRef.current
    if (!el) return
    gsap.killTweensOf(el)
    el.style.minHeight = ''
    el.style.height = 'auto'
  }, [settled])

  const filteredItems = mentionQuery === null
    ? []
    : MENTION_ITEMS.filter(item =>
        mentionQuery === ''
          ? true
          : item.name.toLowerCase().startsWith(mentionQuery.toLowerCase())
      )

  // Keep activeIndex in bounds when filtered list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [mentionQuery])

  function handleChange(e) {
    const val = e.target.value
    const cursor = e.target.selectionStart
    textRef.current = val
    setText(val)
    if (val.length > text.length) onKeystroke?.('add')

    const mention = getActiveMention(val, cursor)
    if (mention) {
      setMentionQuery(mention.query)
      setMentionStart(mention.start)
      setUploadOpen(false)
    } else {
      setMentionQuery(null)
    }
  }

  function selectMention(item) {
    const before = text.slice(0, mentionStart)
    const after  = text.slice(mentionStart + 1 + (mentionQuery?.length ?? 0))
    const newText = before + '@' + item.handle + ' ' + after
    setText(newText)
    setMentionQuery(null)
    // Restore focus
    setTimeout(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      const pos = (before + '@' + item.handle + ' ').length
      el.setSelectionRange(pos, pos)
    }, 0)
  }

  function openMention() {
    const el = textareaRef.current
    if (!el) return
    setUploadOpen(false)
    const cursor = el.selectionStart
    const newText = text.slice(0, cursor) + '@' + text.slice(cursor)
    setText(newText)
    setMentionQuery('')
    setMentionStart(cursor)
    el.focus()
    setTimeout(() => {
      el.setSelectionRange(cursor + 1, cursor + 1)
    }, 0)
  }

  function handleKeyDown(e) {
    if (mentionQuery !== null && filteredItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => (i + 1) % filteredItems.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        selectMention(filteredItems[activeIndex])
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMentionQuery(null)
        return
      }
    }

    if (uploadOpen && e.key === 'Escape') {
      e.preventDefault()
      setUploadOpen(false)
      return
    }

    if (e.key === 'Enter' && !e.shiftKey && mentionQuery === null) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!text.trim() || loading) return
    const message = text.trim()
    setText('')
    setMentionQuery(null)
    setUploadOpen(false)
    // Snap textarea to compact before the input transitions to the bottom
    gsap.killTweensOf(textareaRef.current)
    gsap.set(textareaRef.current, { minHeight: LINE_HEIGHT, height: 'auto' })
    onSubmit?.(message)
  }

  const mentionOpen = mentionQuery !== null && filteredItems.length > 0

  return (
    <div
      ref={outerRef}
      data-inspector="ChatInput"
      className="relative w-full max-w-2xl mx-auto"
      onMouseDown={e => {
        const tag = e.target.tagName.toLowerCase()
        if (tag === 'textarea' || tag === 'input') return
        if (e.target.closest('button')) return
        e.preventDefault()
        textareaRef.current?.focus()
      }}
    >

      {/* Card — two-layer gradient border: orange (mouse) crossfades to blue (focused) */}
      <div
        ref={glowWrapperRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          padding: '1px',
          borderRadius: (mentionOpen || uploadOpen)
            ? (settled ? '0 0 1rem 1rem' : '1rem 1rem 0 0')
            : '1rem',
          transition: 'border-radius 200ms ease',
          willChange: 'transform',
        }}
      >
        {/* Layer 1 — orange border (direct DOM, no React re-renders) */}
        <div ref={glowLayer1Ref} style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'var(--border-input)',
          opacity: (focused || listening) ? 0 : 1,
          transition: 'opacity 350ms ease',
          transitionDelay: (focused || listening) ? '420ms' : '0ms',
          pointerEvents: 'none',
          willChange: 'opacity',
        }} />

        {/* Layer 2 — blue active border: stays visible when text exists */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: '#1779F7',
          opacity: (focused || !!text || listening) ? 1 : 0,
          transition: 'opacity 300ms ease',
          transitionDelay: (focused && !text && !listening) ? '420ms' : '0ms',
          pointerEvents: 'none',
        }} />

      <div
        className="overflow-hidden"
        style={{
          position: 'relative', zIndex: 1,
          background: 'var(--bg-card)',
          borderRadius: (mentionOpen || uploadOpen)
            ? (settled ? '0 0 calc(1rem - 1px) calc(1rem - 1px)' : 'calc(1rem - 1px) calc(1rem - 1px) 0 0')
            : 'calc(1rem - 1px)',
        }}
      >
        <div className="pl-5" style={{ paddingRight: 10, paddingTop: (!settled && focused) ? 20 : 10, paddingBottom: (!settled && focused) ? 10 : 10, transition: 'padding 400ms ease' }}>
          {/* Textarea + animated typewriter placeholder */}
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleChange}
              onKeyDown={e => {
                handleKeyDown(e)
                if ((e.key === 'Backspace' || e.key === 'Delete') && text.length > 0) onKeystroke?.('delete')
              }}
              onKeyUp={e => {
                if (e.key === 'Backspace' || e.key === 'Delete') onKeystroke?.('deleteEnd')
              }}
              onFocus={() => {
                clearTimeout(blurTimerRef.current)
                setFocused(true); focusedRef.current = true; onFocusChange?.(true)
              }}
              onBlur={() => {
                blurTimerRef.current = setTimeout(() => {
                  setFocused(false); focusedRef.current = false; onFocusChange?.(false)
                }, 420)
              }}
              placeholder=""
              className="smooth-scroll w-full resize-none bg-transparent outline-none text-base leading-relaxed min-h-[28px] max-h-48 overflow-y-auto"
              style={{ color: 'var(--text-primary)', caretColor: 'var(--text-primary)' }}
            />
            {settled && (
              <div
                ref={settledPlaceholderRef}
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  pointerEvents: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1rem', lineHeight: 1.625,
                  fontFamily: "'Byrd', sans-serif",
                  userSelect: 'none',
                }}
              >
                What else can I dig into for you?
              </div>
            )}
            {typewriterVisible && (
              <div
                ref={typewriterRef}
                aria-hidden="true"
                style={{
                  position:   'absolute',
                  top:        0,
                  left:       0,
                  right:      0,
                  pointerEvents: 'none',
                  color:      'var(--text-muted)',
                  fontSize:   '1rem',
                  lineHeight: 1.625,
                  fontFamily: "'Byrd', sans-serif",
                  whiteSpace: 'pre-wrap',
                  wordBreak:  'break-word',
                  userSelect: 'none',
                }}
              >
                {typedHint || '\u00A0'}
                <span style={{
                  display:    'inline-block',
                  width:      1.5,
                  height:     '0.85em',
                  background: 'var(--text-muted)',
                  marginLeft: 1,
                  verticalAlign: 'text-bottom',
                  opacity:    blink ? 0.7 : 0,
                  transition: 'opacity 120ms ease',
                  borderRadius: 1,
                }} />
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between" style={{ marginTop: (!settled && focused) ? 16 : 6, transition: 'margin-top 400ms ease' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                {
                  label: 'Add attachment',
                  active: uploadOpen,
                  onClick: () => { setUploadOpen(o => !o); setMentionQuery(null) },
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  ),
                },
                {
                  label: 'Mention',
                  active: mentionQuery !== null,
                  onClick: openMention,
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
                    </svg>
                  ),
                },
              ].map(({ label, active, onClick, icon }) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={onClick}
                  style={{
                    width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? 'var(--bg-active)' : 'transparent',
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'color 150ms ease, background 150ms ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-active)'; clearTimeout(iconLeaveTimerRef.current); hoveringIconsRef.current = true; gsap.to(iconBlendRef, { current: 1, duration: 0.28, ease: 'power2.out' }) }}
                  onMouseLeave={e => { e.currentTarget.style.color = active ? 'var(--text-primary)' : 'var(--text-muted)'; e.currentTarget.style.background = active ? 'var(--bg-active)' : 'transparent'; iconLeaveTimerRef.current = setTimeout(() => { hoveringIconsRef.current = false; gsap.to(iconBlendRef, { current: 0, duration: 0.4, ease: 'power2.out' }) }, 60) }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Right: voice / submit cross-fade */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div ref={micContainerRef} className="relative w-9 h-9">
              <button
                aria-label="Voice input"
                onClick={toggleListening}
                onMouseDown={e => e.preventDefault()}
                style={{
                  position: 'absolute',
                  top: -6, left: -6, right: -6, bottom: -6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'opacity 200ms ease, transform 200ms ease, color 150ms ease',
                  opacity: (text.trim() || loading) ? 0 : 1,
                  transform: (text.trim() || loading) ? 'scale(0.8)' : 'scale(1)',
                  pointerEvents: (text.trim() || loading) ? 'none' : 'auto',
                  color: listening ? '#1779F7' : 'var(--text-muted)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  clearTimeout(iconLeaveTimerRef.current); hoveringIconsRef.current = true; gsap.to(iconBlendRef, { current: 1, duration: 0.28, ease: 'power2.out' })
                  if (!listening) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                  } else {
                    gsap.to(e.currentTarget.querySelectorAll('span'), { background: '#38BDF8', duration: 0.28, ease: 'power2.out', overwrite: 'auto' })
                  }
                }}
                onMouseMove={e => {
                  if (!listening) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
                  const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
                  gsap.to(e.currentTarget, {
                    rotateY: dx * 22, rotateX: -dy * 22,
                    transformPerspective: 280,
                    duration: 0.25, ease: 'power2.out',
                  })
                  const spans = e.currentTarget.querySelectorAll('span')
                  spans.forEach((span, i) => {
                    const pos = (i / (spans.length - 1)) * 2 - 1
                    const pull = 1 - Math.abs(pos - dx) * 0.65
                    gsap.to(span, { scaleY: 0.6 + pull * 1.4, duration: 0.18, ease: 'power2.out' })
                  })
                }}
                onMouseLeave={e => {
                  if (!listening) {
                    e.currentTarget.style.color = 'var(--text-muted)'
                  } else {
                    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
                    gsap.to(e.currentTarget.querySelectorAll('span'), { scaleY: 1, background: '#1779F7', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
                  }
                  iconLeaveTimerRef.current = setTimeout(() => { hoveringIconsRef.current = false; gsap.to(iconBlendRef, { current: 0, duration: 0.4, ease: 'power2.out' }) }, 60)
                }}
              >
                <div style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: listening ? 'rgba(23,121,247,0.08)' : 'transparent',
                  borderRadius: 10,
                  transition: 'background 200ms ease',
                }}>
                  {listening ? <WaveAnimation /> : <MicIcon />}
                </div>
              </button>
              {/* Submit button — arrow slides out, dots slide in */}
              <button
                aria-label="Submit"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { handleSubmit() }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{
                  background: '#007AFF',
                  borderRadius: 8,
                  transition: 'opacity 200ms ease, background 150ms ease',
                  opacity: (text.trim() || loading) ? 1 : 0,
                  transform: (text.trim() || loading) ? 'scale(1)' : 'scale(0.8)',
                  pointerEvents: (text.trim() || loading) ? 'auto' : 'none',
                }}
                onMouseEnter={e => {
                  clearTimeout(iconLeaveTimerRef.current); hoveringIconsRef.current = true; gsap.to(iconBlendRef, { current: 1, duration: 0.28, ease: 'power2.out' })
                  e.currentTarget.style.background = '#1779F7'
                  gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2, ease: 'back.out(2)' })
                  const beam = beamRef.current
                  beamTweensRef.current.forEach(t => t.kill())
                  gsap.set(beam, { rotation: 0 })
                  const rot = gsap.to(beam, { rotation: 360, transformOrigin: '50% 50%', duration: 6, ease: 'none', repeat: -1 })
                  const tl  = gsap.timeline()
                  tl.to(beam, { opacity: 0.85, duration: 0.5, ease: 'power2.out' })
                    .to(beam, { opacity: 0.45, duration: 1.6, ease: 'sine.inOut' })
                    .to(beam, { opacity: 0.75, duration: 1.8, ease: 'sine.inOut' })
                    .to(beam, { opacity: 0.35, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true })
                  beamTweensRef.current = [rot, tl]
                }}
                onMouseLeave={e => {
                  iconLeaveTimerRef.current = setTimeout(() => { hoveringIconsRef.current = false; gsap.to(iconBlendRef, { current: 0, duration: 0.4, ease: 'power2.out' }) }, 60)
                  e.currentTarget.style.background = '#007AFF'
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' })
                  beamTweensRef.current.forEach(t => t.kill())
                  beamTweensRef.current = []
                  gsap.to(beamRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' })
                }}
                onMouseDown={e => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1, ease: 'power2.in' })}
                onMouseUp={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.15, ease: 'back.out(3)' })}
              >
                {/* Radiance beam — rotates inside button, clipped by overflow-hidden */}
                <div ref={beamRef} style={{
                  position: 'absolute', inset: -12,
                  background: 'conic-gradient(from 0deg, rgba(10,40,110,0.5) 0%, transparent 12%, rgba(255,255,255,0.1) 24%, rgba(56,189,248,0.38) 34%, rgba(23,121,247,0.28) 44%, transparent 56%, rgba(10,40,110,0.35) 78%, rgba(10,40,110,0.5) 100%)',
                  opacity: 0, pointerEvents: 'none', willChange: 'transform',
                }} />
                {/* Arrow — slides left out when loading */}
                <span
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
                    transform: loading ? 'translateX(-120%)' : 'translateX(0)',
                    opacity: loading ? 0 : 1,
                  }}
                >
                  {/* Arrow paths only, no outer rect (button is the bg) */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="8.08" y="0.75" width="1.67" height="16.67" rx="0.83" fill="white"/>
                    <path d="M3.17 7.33L9 1.5L14.83 7.33" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>

                {/* Dots — slides in from right when loading */}
                <span
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
                    transform: loading ? 'translateX(0)' : 'translateX(120%)',
                    opacity: loading ? 1 : 0,
                  }}
                >
                  <ThinkingDots />
                </span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Mention dropdown — floats below or above depending on settled */}
      <div
        className="absolute left-0 right-0 z-50"
        style={{
          [settled ? 'bottom' : 'top']: '100%',
          display: 'grid',
          gridTemplateRows: mentionOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
        }}
      >
        <div className="overflow-hidden">
          <div
            className={`px-4 ${settled ? 'border-x border-t rounded-t-2xl pt-3 pb-4' : 'border-x border-b rounded-b-2xl pb-4 pt-3'}`}
            style={{
              background: 'var(--bg-card)',
              borderColor: hovered ? 'var(--border-default)' : 'var(--bg-active)',
              boxShadow: settled
                ? '0 -8px 16px 0 rgba(0,0,0,0.08)'
                : '0 8px 16px 0 rgba(0,0,0,0.08)',
            }}
          >
            {/* Label */}
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Mention
            </p>

            {/* Items */}
            <div className="flex flex-col gap-1">
              {filteredItems.map((item, i) => {
                const focused = i === activeIndex
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectMention(item)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left"
                    style={{
                      background: focused ? 'var(--bg-active)' : 'transparent',
                      border: focused ? '1.5px solid var(--border-default)' : '1.5px solid transparent',
                      opacity: focused ? 1 : 0.3,
                      transition: 'opacity 150ms ease, background 150ms ease',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: focused ? 'var(--text-secondary)' : 'var(--border-default)',
                          color: focused ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {item.handle}
                      </span>
                    </div>
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      <ReturnIcon />
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5 text-xs">
                Close <EscIcon />
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                Select <ReturnIcon />
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                Navigate <NavigateIcon />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload dropdown */}
      <div
        className="absolute left-0 right-0 z-50"
        style={{
          [settled ? 'bottom' : 'top']: '100%',
          display: 'grid',
          gridTemplateRows: uploadOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
        }}
      >
        <div className="overflow-hidden">
          <div
            className={`px-4 ${settled ? 'border-x border-t rounded-t-2xl pt-3 pb-4' : 'border-x border-b rounded-b-2xl pb-4 pt-3'}`}
            style={{
              background: 'var(--bg-card)',
              borderColor: hovered ? 'var(--border-default)' : 'var(--bg-active)',
              boxShadow: settled
                ? '0 -8px 16px 0 rgba(0,0,0,0.08)'
                : '0 8px 16px 0 rgba(0,0,0,0.08)',
            }}
          >
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Upload
            </p>
            <button
              onClick={() => setUploadOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left"
              style={{
                background: 'var(--bg-active)',
                border: '1.5px solid var(--border-default)',
                color: 'var(--text-primary)',
                transition: 'background 150ms ease',
              }}
            >
              <div className="flex items-center gap-2">
                <AttachIcon />
                <span className="text-sm">Upload file</span>
              </div>
              <span className="flex items-center justify-center w-7 h-7 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                <ReturnIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}
