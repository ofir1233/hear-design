import { useState, useRef, useEffect, useCallback } from 'react'
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
          background: '#FF7056',
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

export default function ChatInput({ onSubmit, onMentionChange, loading = false, settled = false, defaultText = '', initialUploadOpen = false, initialMentionQuery = null, suggestedPrompts = null }) {
  const [text, setText]           = useState(defaultText)
  const [hovered, setHovered]     = useState(false)
  const [focused, setFocused]     = useState(false)
  const [mentionQuery, setMentionQuery] = useState(initialMentionQuery)
  const [mentionStart, setMentionStart] = useState(0)
  const [activeIndex, setActiveIndex]   = useState(0)
  const [uploadOpen, setUploadOpen]     = useState(initialUploadOpen)
  const [listening, setListening] = useState(false)
  const textareaRef    = useRef(null)
  const recognitionRef = useRef(null)

  const activePrompts    = (suggestedPrompts?.length >= 3) ? suggestedPrompts : PROMPTS
  const typewriterActive = !text && !focused && !settled && !loading
  const { display: typedHint, blink } = useTypewriter(typewriterActive, activePrompts)

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous      = false
    rec.interimResults  = true
    rec.lang            = 'en-US'
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setText(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = (e) => {
      setListening(false)
      if (e.error === 'not-allowed') {
        alert('Microphone access was blocked. Please allow microphone permission for this site in your browser settings.')
      }
    }
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  useEffect(() => {
    onMentionChange?.(mentionQuery !== null)
  }, [mentionQuery])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

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
    setText(val)

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
    onSubmit?.(message)
  }

  const mentionOpen = mentionQuery !== null && filteredItems.length > 0

  return (
    <div data-inspector="ChatInput" className="relative w-full max-w-2xl mx-auto">
      {/* Drag indicator dot */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-fuchsia-500" style={{ zIndex: 10 }} />

      {/* Card */}
      <div
        className="border overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          borderColor: hovered ? 'var(--border-default)' : 'var(--bg-active)',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
          transition: 'border-color 200ms ease, border-radius 200ms ease',
          borderRadius: (mentionOpen || uploadOpen)
            ? (settled ? '0 0 1rem 1rem' : '1rem 1rem 0 0')
            : '1rem',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="px-5 pt-5 pb-4">
          {/* Textarea + animated typewriter placeholder */}
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=""
              className="smooth-scroll w-full resize-none bg-transparent outline-none text-base leading-relaxed min-h-[28px] max-h-48 overflow-y-auto"
              style={{ color: 'var(--text-primary)' }}
            />
            {typewriterActive && (
              <div
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
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
              <button
                onClick={() => { setUploadOpen(o => !o); setMentionQuery(null) }}
                className="transition-colors text-2xl font-thin leading-none"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="Add attachment"
              >
                +
              </button>
            </div>

            {/* Right: voice / submit cross-fade */}
            <div className="relative w-9 h-9">
              <button
                aria-label="Voice input"
                onClick={toggleListening}
                style={{
                  transition: 'opacity 200ms ease, transform 200ms ease, background 200ms ease',
                  opacity: (text.trim() || loading) ? 0 : 1,
                  transform: (text.trim() || loading) ? 'scale(0.8)' : 'scale(1)',
                  pointerEvents: (text.trim() || loading) ? 'none' : 'auto',
                  color: listening ? '#FF7056' : 'var(--text-muted)',
                  background: listening ? 'rgba(255,112,86,0.08)' : 'transparent',
                  borderRadius: 10,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {listening ? <WaveAnimation /> : <MicIcon />}
              </button>
              {/* Submit button — arrow slides out, dots slide in */}
              <button
                aria-label="Submit"
                onClick={() => { handleSubmit() }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden hover:opacity-90"
                style={{
                  background: '#007AFF',
                  borderRadius: 8,
                  transition: 'opacity 200ms ease, transform 200ms ease',
                  opacity: (text.trim() || loading) ? 1 : 0,
                  transform: (text.trim() || loading) ? 'scale(1)' : 'scale(0.8)',
                  pointerEvents: (text.trim() || loading) ? 'auto' : 'none',
                }}
              >
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
