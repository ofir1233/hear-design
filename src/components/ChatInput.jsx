import { useState, useRef, useEffect, useCallback } from 'react'

const MENTION_ITEMS = [
  { id: 1, name: 'Ai assistant',                  handle: 'Tommy@'    },
  { id: 2, name: 'Another something makes seance', handle: 'Whatever@' },
  { id: 3, name: 'Something makes seance',          handle: 'Whatever@' },
]

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  )
}

function SubmitIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#007AFF"/>
      <rect x="17.1667" y="9.66675" width="1.66667" height="16.6667" rx="0.833333" fill="white"/>
      <path d="M12.1667 16.3333L18 10.5L23.8334 16.3333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 20C2.68629 20 1.28855e-07 17.3137 0 14V6C0.000264 2.68652 2.68645 0 6 0H18C21.3135 0 23.9997 2.68652 24 6V14C24 17.3137 21.3137 20 18 20H6ZM18 17C20.7614 17 23 14.7614 23 12V6C22.9997 3.2388 20.7613 1 18 1H6C3.23874 1 1.00026 3.2388 1 6V12C1 14.7614 3.23858 17 6 17H18ZM9.90332 12.9346C9.9032 13.1907 9.61129 13.337 9.40625 13.1836L7.12402 11.4727C6.95827 11.3483 6.95847 11.0991 7.12402 10.9746L9.40625 9.26367C9.61122 9.10999 9.90296 9.25566 9.90332 9.51172V10.4453H13.0146C13.4442 10.4453 13.793 10.0965 13.793 9.66699V5.77832C13.7932 5.34899 14.1409 5 14.5703 5C14.9997 5 15.3474 5.34899 15.3477 5.77832V9.66699C15.3477 10.9557 14.3033 12 13.0146 12H9.90332V12.9346Z" fill="currentColor"/>
    </svg>
  )
}

function NavigateIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C21.3137 0 24 2.68629 24 6V14C24 17.3137 21.3137 20 18 20H6C2.68629 20 1.28855e-07 17.3137 0 14V6C1.28855e-07 2.68629 2.68629 0 6 0H18ZM6 1C3.23858 1 1 3.23858 1 6V12C1 14.7614 3.23858 17 6 17H18C20.7614 17 23 14.7614 23 12V6C23 3.23858 20.7614 1 18 1H6ZM8.77344 5.125C8.89787 4.95909 9.14703 4.95913 9.27148 5.125L10.9824 7.40625C11.1361 7.61122 10.9904 7.90393 10.7344 7.9043H9.7998V12.5713C9.79931 13.0004 9.45171 13.3486 9.02246 13.3486C8.59349 13.3483 8.24561 13.0002 8.24512 12.5713V7.9043H7.31152C7.05542 7.90409 6.90903 7.61126 7.0625 7.40625L8.77344 5.125ZM14.624 5C15.0531 5.00026 15.401 5.34826 15.4014 5.77734V10.4443H16.335C16.5912 10.4445 16.7377 10.7373 16.584 10.9424L14.873 13.2236C14.7486 13.3895 14.4994 13.3895 14.375 13.2236L12.6641 10.9424C12.5104 10.7374 12.6561 10.4448 12.9121 10.4443H13.8467V5.77734C13.847 5.34814 14.1947 5.00006 14.624 5Z" fill="currentColor"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C21.3137 0 24 2.68629 24 6V14C24 17.3137 21.3137 20 18 20H6C2.68629 20 1.28855e-07 17.3137 0 14V6C1.28855e-07 2.68629 2.68629 0 6 0H18ZM6 1C3.23858 1 1 3.23858 1 6V12C1 14.7614 3.23858 17 6 17H18C20.7614 17 23 14.7614 23 12V6C23 3.23858 20.7614 1 18 1H6ZM12.0059 7.28027C12.6156 7.28032 13.0953 7.40933 13.4453 7.66699C13.7975 7.92484 14.0038 8.27629 14.0625 8.7207L12.8359 8.7959C12.815 8.69108 12.7694 8.59655 12.7002 8.5127C12.631 8.42687 12.5398 8.35886 12.4268 8.30859C12.3157 8.25621 12.1824 8.22949 12.0273 8.22949C11.8199 8.22952 11.6445 8.27429 11.502 8.3623C11.3597 8.44822 11.2891 8.56353 11.2891 8.70801C11.2891 8.82313 11.3347 8.92042 11.4268 9C11.5189 9.07962 11.6772 9.14418 11.9014 9.19238L12.7764 9.36816C13.2457 9.4646 13.5956 9.62022 13.8262 9.83398C14.0566 10.0478 14.1719 10.3289 14.1719 10.6768C14.1718 10.9931 14.079 11.2709 13.8926 11.5098C13.7081 11.7487 13.4537 11.9352 13.1309 12.0693C12.8103 12.2013 12.4405 12.2676 12.0215 12.2676C11.3822 12.2676 10.8726 12.1343 10.4932 11.8682C10.1158 11.5998 9.89506 11.2346 9.83008 10.7734L11.1475 10.7041C11.1873 10.8991 11.2835 11.0486 11.4365 11.1514C11.5895 11.2519 11.7855 11.3018 12.0244 11.3018C12.2592 11.3018 12.4483 11.2571 12.5908 11.167C12.7353 11.0748 12.8084 10.9561 12.8105 10.8115C12.8085 10.6899 12.7569 10.5903 12.6562 10.5127C12.5557 10.4331 12.4008 10.372 12.1914 10.3301L11.3545 10.1641C10.8829 10.0697 10.5314 9.90553 10.3008 9.67285C10.0726 9.44022 9.95898 9.14355 9.95898 8.7832C9.95901 8.47301 10.0423 8.20572 10.21 7.98145C10.3797 7.75717 10.6178 7.58447 10.9238 7.46289C11.232 7.34131 11.5929 7.28027 12.0059 7.28027ZM16.8369 7.28027C17.2581 7.2803 17.6269 7.35682 17.9434 7.50977C18.2599 7.6628 18.5108 7.87759 18.6953 8.1543C18.8797 8.43093 18.9811 8.7559 19 9.12891H17.7363C17.7007 8.88807 17.606 8.69452 17.4531 8.54785C17.3022 8.39901 17.1037 8.32422 16.8584 8.32422C16.651 8.32428 16.4695 8.381 16.3145 8.49414C16.1615 8.60524 16.042 8.76774 15.9561 8.98145C15.8702 9.19518 15.8272 9.45402 15.8271 9.75781C15.8271 10.0659 15.8693 10.3281 15.9531 10.5439C16.0391 10.7598 16.1594 10.9249 16.3145 11.0381C16.4695 11.1512 16.651 11.2079 16.8584 11.208C17.0114 11.208 17.1489 11.1761 17.2705 11.1133C17.3941 11.0504 17.4956 10.9592 17.5752 10.8398C17.657 10.7183 17.7112 10.5721 17.7363 10.4023H19C18.979 10.7713 18.8785 11.097 18.6982 11.3779C18.5201 11.6566 18.2733 11.8741 17.959 12.0312C17.6446 12.1884 17.2725 12.2676 16.8428 12.2676C16.3482 12.2675 15.9227 12.1627 15.5664 11.9531C15.2121 11.7414 14.9398 11.4475 14.749 11.0723C14.5604 10.6971 14.4659 10.2656 14.4658 9.77734C14.4658 9.28277 14.5613 8.84865 14.752 8.47559C14.9448 8.10042 15.2181 7.80728 15.5723 7.59766C15.9265 7.38593 16.3485 7.28027 16.8369 7.28027ZM9.33887 6.85547H6.36133V8.38965H9.11621V9.5127H6.36133V11.0498H9.35156V12.1729H5V5.7334H9.33887V6.85547Z" fill="currentColor"/>
    </svg>
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

function AttachIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.53516 11.4652L11.4294 4.57089C13.4797 2.52064 16.8039 2.52064 18.8541 4.57089C20.9044 6.62114 20.9041 9.94544 18.8539 11.9957L10.8989 19.9506C9.53209 21.3175 7.31639 21.3173 5.94955 19.9505C4.58272 18.5836 4.58238 16.3678 5.94922 15.0009L13.9042 7.04599C14.5876 6.36257 15.6962 6.36257 16.3796 7.04599C17.0631 7.72941 17.0626 8.83718 16.3792 9.5206L9.48486 16.4149" stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Drag indicator dot */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-fuchsia-500" style={{ zIndex: 10 }} />

      {/* Card */}
      <div
        className="bg-white border overflow-hidden"
        style={{
          borderColor: hovered ? '#d1d5db' : '#f3f4f6',
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
              text-gray-800 placeholder-gray-400
              text-base leading-relaxed
              min-h-[28px] max-h-48 overflow-y-auto
            "
          />

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-gray-400">
              <button
                onClick={() => { setUploadOpen(o => !o); setMentionQuery(null) }}
                className="hover:text-gray-600 transition-colors text-2xl font-thin leading-none"
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
                className="absolute inset-0 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600"
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
            className={`bg-white px-4 ${settled ? 'border-x border-t rounded-t-2xl pt-3 pb-4' : 'border-x border-b rounded-b-2xl pb-4 pt-3'}`}
            style={{
              borderColor: hovered ? '#d1d5db' : '#f3f4f6',
              boxShadow: settled
                ? '0 -8px 16px 0 rgba(0,0,0,0.08)'
                : '0 8px 16px 0 rgba(0,0,0,0.08)',
            }}
          >
            {/* Label */}
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
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
                      background: focused ? '#f3f4f6' : 'transparent',
                      border: focused ? '1.5px solid #e5e7eb' : '1.5px solid transparent',
                      opacity: focused ? 1 : 0.3,
                      transition: 'opacity 150ms ease, background 150ms ease',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800">{item.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: focused ? '#374151' : '#e5e7eb',
                          color: focused ? '#374151' : '#9ca3af',
                        }}
                      >
                        {item.handle}
                      </span>
                    </div>
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0">
                      <ReturnIcon />
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                Close <CloseIcon />
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                Select <ReturnIcon />
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
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
            className={`bg-white px-4 ${settled ? 'border-x border-t rounded-t-2xl pt-3 pb-4' : 'border-x border-b rounded-b-2xl pb-4 pt-3'}`}
            style={{
              borderColor: hovered ? '#d1d5db' : '#f3f4f6',
              boxShadow: settled
                ? '0 -8px 16px 0 rgba(0,0,0,0.08)'
                : '0 8px 16px 0 rgba(0,0,0,0.08)',
            }}
          >
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
              Upload
            </p>
            <button
              onClick={() => setUploadOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left"
              style={{
                background: '#f3f4f6',
                border: '1.5px solid #e5e7eb',
                transition: 'background 150ms ease',
              }}
            >
              <div className="flex items-center gap-2">
                <AttachIcon />
                <span className="text-sm text-gray-800">Upload file</span>
              </div>
              <span className="flex items-center justify-center w-7 h-7 flex-shrink-0">
                <ReturnIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
