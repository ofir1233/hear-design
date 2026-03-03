import { useState, useRef, useEffect, useCallback } from 'react'
import { MicIcon, ReturnIcon, NavigateIcon, EscIcon, AttachIcon } from './icons'

const MENTION_ITEMS = [
  { id: 1, name: 'Ai assistant',                  handle: 'Tommy@'    },
  { id: 2, name: 'Another something makes seance', handle: 'Whatever@' },
  { id: 3, name: 'Something makes seance',          handle: 'Whatever@' },
]

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

export default function ChatInput({ onSubmit, onMentionChange, loading = false, settled = false, defaultText = '', initialUploadOpen = false, initialMentionQuery = null }) {
  const [text, setText]       = useState(defaultText)
  const [hovered, setHovered] = useState(false)
  const [mentionQuery, setMentionQuery] = useState(initialMentionQuery)
  const [mentionStart, setMentionStart] = useState(0)
  const [activeIndex, setActiveIndex]   = useState(0)
  const [uploadOpen, setUploadOpen]     = useState(initialUploadOpen)
  const textareaRef = useRef(null)

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
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="
              w-full resize-none bg-transparent outline-none
              text-base leading-relaxed
              min-h-[28px] max-h-48 overflow-y-auto
            "
            style={{ color: 'var(--text-primary)' }}
          />

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
                style={{
                  transition: 'opacity 200ms ease, transform 200ms ease',
                  opacity: (text.trim() || loading) ? 0 : 1,
                  transform: (text.trim() || loading) ? 'scale(0.8)' : 'scale(1)',
                  pointerEvents: (text.trim() || loading) ? 'none' : 'auto',
                }}
                className="absolute inset-0 flex items-center justify-center rounded-xl"
                style={{ color: 'var(--text-muted)' }}
              >
                <MicIcon />
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
