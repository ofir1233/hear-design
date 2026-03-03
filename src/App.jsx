import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import HearLogo from './components/HearLogo.jsx'
import ChatInput from './components/ChatInput.jsx'
import Sidebar from './components/Sidebar.jsx'
import SignIn from './components/SignIn.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const USER_NAME = 'John'

const SIDEBAR_WIDTH = 272

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11.1999V4.80013C2 4.43776 1.99929 4.12563 2.02019 3.86979C2.04172 3.60628 2.08958 3.34403 2.2181 3.0918C2.40983 2.71556 2.71556 2.40983 3.0918 2.2181C3.34403 2.08958 3.60628 2.04172 3.86979 2.02019C4.12563 1.99929 4.43776 2 4.80013 2H6.66667C7.03486 2 7.33334 2.29848 7.33334 2.66667C7.33334 3.03486 7.03486 3.33334 6.66667 3.33334H4.80013C4.41577 3.33334 4.16749 3.33418 3.97852 3.34961C3.79732 3.36442 3.73019 3.38948 3.69727 3.40625C3.57186 3.47016 3.47016 3.57186 3.40625 3.69727C3.38948 3.73019 3.36442 3.79732 3.34961 3.97852C3.33418 4.16749 3.33334 4.41577 3.33334 4.80013V11.1999C3.33334 11.5842 3.33418 11.8327 3.34961 12.0215C3.36441 12.2025 3.38945 12.2697 3.40625 12.3027C3.47037 12.4285 3.57228 12.5307 3.69727 12.5944C3.73014 12.6111 3.7973 12.6363 3.97787 12.651C4.16649 12.6665 4.41455 12.6667 4.79818 12.6667H11.2018C11.5852 12.6667 11.8331 12.6664 12.0215 12.651C12.2017 12.6363 12.2691 12.6112 12.3021 12.5944C12.4277 12.5304 12.5306 12.4274 12.5944 12.3021C12.6111 12.2691 12.6363 12.202 12.651 12.0221C12.6665 11.8336 12.6667 11.5855 12.6667 11.2018V9.33334C12.6667 8.96515 12.9651 8.66667 13.3333 8.66667C13.7015 8.66667 14 8.96515 14 9.33334V11.2018C14 11.5633 14.0007 11.8748 13.9798 12.1302C13.9583 12.3934 13.9103 12.6555 13.7819 12.9076C13.5901 13.284 13.2837 13.5902 12.9076 13.7819C12.6555 13.9103 12.3935 13.9583 12.1302 13.9798C11.8748 14.0007 11.5633 14 11.2018 14H4.79818C4.43654 14 4.12467 14.0007 3.86914 13.9798C3.60592 13.9583 3.34388 13.9103 3.0918 13.7819C2.71526 13.59 2.40964 13.284 2.2181 12.9082C2.08961 12.656 2.04173 12.3937 2.02019 12.1302C1.99929 11.8745 2 11.5622 2 11.1999Z" fill="#898989"/>
      <path d="M13.3333 2C13.7015 2 13.9999 2.29848 13.9999 2.66667V6.66667C13.9999 7.03486 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6666 7.03486 12.6666 6.66667V4.27604L8.13797 8.80469C7.87762 9.06504 7.45561 9.06504 7.19526 8.80469C6.93491 8.54434 6.93491 8.12233 7.19526 7.86198L11.7239 3.33333H9.33328C8.96509 3.33333 8.66662 3.03486 8.66662 2.66667C8.66662 2.29848 8.96509 2 9.33328 2H13.3333Z" fill="#898989"/>
    </svg>
  )
}

const REQUESTS = Array(8).fill({
  id: '#21195386',
  tag: 'Signal Create',
  description: 'Detect and categorize alien/UFO-related content in calls for monitoring and reporting.',
})

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}


function MainApp() {
  const greeting = getGreeting()
  const fullGreeting = `${greeting}, ${USER_NAME}.`
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [settled, setSettled]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [fixedStart, setFixedStart]   = useState(null)
  const [inputOffset, setInputOffset] = useState(0)
  const [messages, setMessages]       = useState([])
  const inputRef = useRef(null)
  const cardsRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [cardsScrolled, setCardsScrolled] = useState(false)
  const [mentionActive, setMentionActive] = useState(false)
  const [hoveredMsg, setHoveredMsg] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const [showGreeting, setShowGreeting]   = useState(false)
  const [showSubtitle, setShowSubtitle]   = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 100)
    const t2 = setTimeout(() => setShowSubtitle(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSubmit(text) {
    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])

    if (!submitted) {
      if (!inputRef.current) return
      const rect = inputRef.current.getBoundingClientRect()
      setFixedStart({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      setSubmitted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInputOffset(window.innerHeight - 32 - rect.bottom)
        })
      })
    }

    setLoading(true)

    const history = [...messages, userMsg].map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.text,
    }))

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
      .then(r => r.json())
      .then(data => {
        setLoading(false)
        setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error || 'Something went wrong.', related: data.related || [] }])
      })
      .catch(() => {
        setLoading(false)
        setMessages(prev => [...prev, { role: 'ai', text: 'Failed to reach the server. Please try again.' }])
      })
  }

  const paddingLeft = isMobile ? '1.5rem' : `calc(${SIDEBAR_WIDTH}px + 1.5rem)`

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#EFEFED', paddingLeft }}
    >
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 90,
            width: 40, height: 40,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <span style={{ width: 18, height: 1.5, background: '#374151', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: '#374151', borderRadius: 2 }} />
          <span style={{ width: 18, height: 1.5, background: '#374151', borderRadius: 2 }} />
        </button>
      )}

      {/* Header */}
      <div
        className="flex flex-col items-center w-full max-w-2xl"
        style={{
          opacity:       submitted ? 0 : 1,
          transform:     submitted ? 'translateY(-20px)' : 'translateY(0)',
          marginBottom:  submitted ? 0 : '1.5rem',
          pointerEvents: submitted ? 'none' : 'auto',
          transition: [
            'opacity 150ms cubic-bezier(0.4, 0, 1, 1)',
            'transform 150ms cubic-bezier(0.4, 0, 1, 1)',
            'margin-bottom 150ms cubic-bezier(0.4, 0, 1, 1)',
          ].join(', '),
        }}
      >
        <HearLogo className="w-20 h-14 mb-6" />
        <div className="text-center">
          <h1
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
            style={{
              opacity: showGreeting ? 1 : 0,
              transform: showGreeting ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {fullGreeting}
          </h1>
          <p
            className="mt-2 text-lg text-gray-400 tracking-wide"
            style={{
              opacity: showSubtitle ? 1 : 0,
              transform: showSubtitle ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            What would you like to explore today?
          </p>
        </div>
      </div>

      {fixedStart && !settled && (
        <div style={{ width: '100%', maxWidth: '42rem', height: fixedStart.height, flexShrink: 0 }} />
      )}

      {/* Chat input */}
      <div
        ref={inputRef}
        style={
          settled
            ? {
                position:  'fixed',
                bottom:    32,
                left:      isMobile ? '50%' : `calc(50% + ${SIDEBAR_WIDTH / 2}px)`,
                transform: 'translateX(-50%)',
                width:     isMobile ? 'calc(100% - 3rem)' : `calc(100% - ${SIDEBAR_WIDTH}px - 3rem)`,
                maxWidth:  '42rem',
                zIndex:    50,
              }
            : fixedStart
            ? {
                position:   'fixed',
                top:        fixedStart.top,
                left:       fixedStart.left,
                width:      fixedStart.width,
                willChange: 'transform',
                transform:  `translateY(${inputOffset}px)`,
                transition: inputOffset !== 0
                  ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
                zIndex: 50,
              }
            : {
                width:    '100%',
                maxWidth: '42rem',
              }
        }
        onTransitionEnd={(e) => {
          if (
            e.target === inputRef.current &&
            e.propertyName === 'transform' &&
            fixedStart &&
            !settled
          ) {
            setSettled(true)
          }
        }}
      >
        <ChatInput onSubmit={(text) => handleSubmit(text)} onMentionChange={setMentionActive} loading={loading} settled={settled} />
      </div>

      {/* Request cards — pre-submit */}
      {!submitted && (
        <div style={{
          width: '100%',
          maxWidth: '42rem',
          marginTop: '1.5rem',
          position: 'relative',
          opacity: mentionActive ? 0.3 : 1,
          transition: 'opacity 200ms ease',
          pointerEvents: mentionActive ? 'none' : 'auto',
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 6,
            height: 1,
            background: '#e5e7eb',
            zIndex: 2,
            opacity: cardsScrolled ? 1 : 0,
            transition: 'opacity 200ms ease',
          }} />
          <div ref={cardsRef} className="cards-scroll" onScroll={e => setCardsScrolled(e.currentTarget.scrollTop > 0)} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            maxHeight: 320,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            paddingBottom: 40,
            paddingRight: 6,
          }}>
            {REQUESTS.map((req, i) => (
              <div
                key={i}
                className="request-card"
                style={{ borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="card-title" style={{ fontSize: 13, fontWeight: 600 }}>Request {req.id}</span>
                    <span className="card-tag" style={{ fontSize: 11, borderRadius: 999, border: '1px solid', padding: '2px 8px', whiteSpace: 'nowrap' }}>{req.tag}</span>
                  </div>
                  <span style={{ color: '#9ca3af', flexShrink: 0 }}><ExternalLinkIcon /></span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{req.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat thread — post-submit */}
      {submitted && settled && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: isMobile ? 0 : SIDEBAR_WIDTH,
          right: 0,
          bottom: 80,
          overflowY: 'auto',
          padding: '40px 24px 160px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(() => {
              const lastAIIndex = messages.reduce((acc, m, i) => m.role === 'ai' ? i : acc, -1)
              return messages.map((msg, i) => {
                const isAI = msg.role === 'ai'
                const showActions = isAI && (i === lastAIIndex || hoveredMsg === i)
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAI ? 'flex-start' : 'flex-end',
                      opacity: 0,
                      animation: 'msgIn 250ms ease forwards',
                    }}
                    onMouseEnter={() => isAI && setHoveredMsg(i)}
                    onMouseLeave={() => isAI && setHoveredMsg(null)}
                  >
                    <div style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: isAI ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                      background: isAI ? 'transparent' : '#111827',
                      color: isAI ? 'rgba(17,24,39,0.85)' : '#fff',
                      fontSize: 14,
                      lineHeight: 1.55,
                      boxShadow: isAI ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      {isAI ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({node, ...props}) => <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, marginBottom: 8 }} {...props} />,
                            th: ({node, ...props}) => <th style={{ border: '1px solid #e5e7eb', padding: '6px 10px', background: '#f9fafb', fontWeight: 600, textAlign: 'left' }} {...props} />,
                            td: ({node, ...props}) => <td style={{ border: '1px solid #e5e7eb', padding: '6px 10px' }} {...props} />,
                            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid #d1d5db', margin: '8px 0', padding: '4px 12px', color: 'rgba(17,24,39,0.6)', fontStyle: 'italic' }} {...props} />,
                            code: ({node, inline, ...props}) => inline
                              ? <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '1px 5px', fontSize: 12, fontFamily: 'monospace' }} {...props} />
                              : <pre style={{ background: '#f3f4f6', borderRadius: 8, padding: '10px 14px', overflowX: 'auto', fontSize: 12, fontFamily: 'monospace', margin: '8px 0' }}><code {...props} /></pre>,
                            p: ({node, ...props}) => <p style={{ margin: '0 0 6px 0', lineHeight: 1.6 }} {...props} />,
                            h1: ({node, ...props}) => <h1 style={{ fontSize: 16, fontWeight: 700, margin: '10px 0 6px', color: '#111827' }} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{ fontSize: 14, fontWeight: 700, margin: '10px 0 6px', color: '#111827' }} {...props} />,
                            h3: ({node, ...props}) => <h3 style={{ fontSize: 13, fontWeight: 600, margin: '8px 0 4px', color: '#111827' }} {...props} />,
                            ul: ({node, ...props}) => <ul style={{ paddingLeft: 18, margin: '4px 0' }} {...props} />,
                            ol: ({node, ...props}) => <ol style={{ paddingLeft: 18, margin: '4px 0' }} {...props} />,
                            li: ({node, ...props}) => <li style={{ marginBottom: 2 }} {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : msg.text}
                    </div>

                    {isAI && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginTop: 4,
                        paddingLeft: 4,
                        opacity: showActions ? 1 : 0,
                        transition: 'opacity 150ms ease',
                        pointerEvents: showActions ? 'auto' : 'none',
                      }}>
                        {[
                          { title: 'Helpful', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.0637 6.63346C13.3964 6.14544 14.0445 5.85642 14.6917 6.07286L14.8305 6.12727L15.0219 6.22141C15.9547 6.72081 16.5166 7.64658 16.5166 8.74691L16.5087 8.98533C16.4917 9.23887 16.4467 9.48335 16.384 9.71773C17.8917 9.79833 18.999 11.1995 18.704 12.7011L18.1129 15.7102C17.9398 16.5906 17.1676 17.2263 16.2696 17.2263L11.5084 17.2263C11.0742 17.2263 10.6754 17.0776 10.3573 16.8302C10.0222 17.1412 9.57489 17.3331 9.08198 17.3333L7.12627 17.3333C6.12119 17.3333 5.30103 16.5438 5.25064 15.5519L5.2482 15.4553L5.2482 10.9349C5.2482 9.8977 6.08904 9.05686 7.12627 9.05686L9.08198 9.05686C9.71988 9.05717 10.2832 9.37624 10.6226 9.86323C11.4507 9.43874 11.7342 9.04471 11.9627 8.60507L11.9706 8.58918L11.9792 8.57389L12.9977 6.74106L13.0637 6.63346ZM7.12627 10.3089C6.78052 10.3089 6.50024 10.5892 6.50024 10.9349L6.50024 15.4553C6.5004 15.8009 6.78062 16.0813 7.12627 16.0813L9.08137 16.0813C9.42687 16.0811 9.70724 15.8008 9.70739 15.4553L9.70739 10.9349C9.70739 10.5893 9.42697 10.3091 9.08137 10.3089L7.12627 10.3089ZM14.317 7.26927C14.2332 7.2316 14.1366 7.26908 14.092 7.34936L13.0735 9.18219C12.6916 9.91696 12.1654 10.5415 10.8824 11.1293L10.8824 15.3483C10.8825 15.6939 11.1627 15.9743 11.5084 15.9743L16.2696 15.9743C16.5688 15.9743 16.8263 15.7622 16.884 15.4687L17.4752 12.4596C17.6272 11.6862 17.0352 10.9663 16.247 10.9661L14.298 10.9661C14.7923 10.3875 15.2644 9.58937 15.2646 8.74691C15.2646 8.06638 14.9146 7.53815 14.317 7.26927Z" fill="#9ca3af"/></svg> },
                          { title: 'Not helpful', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.9363 17.3665C10.6036 17.8546 9.95554 18.1436 9.30826 17.9271L9.16949 17.8727L8.97813 17.7786C8.0453 17.2792 7.48338 16.3534 7.48338 15.2531L7.49133 15.0147C7.5083 14.7611 7.55333 14.5167 7.61604 14.2823C6.10831 14.2017 5.00101 12.8005 5.29597 11.2989L5.88714 8.2898C6.06017 7.40944 6.8324 6.77365 7.73037 6.77365L12.4916 6.77365C12.9258 6.77365 13.3246 6.92236 13.6427 7.16981C13.9778 6.85878 14.4251 6.66691 14.918 6.66667L16.8737 6.66667C17.8788 6.66667 18.699 7.45621 18.7494 8.44815L18.7518 8.54474L18.7518 13.0651C18.7518 14.1023 17.911 14.9431 16.8737 14.9431L14.918 14.9431C14.2801 14.9428 13.7168 14.6238 13.3774 14.1368C12.5493 14.5613 12.2658 14.9553 12.0373 15.3949L12.0294 15.4108L12.0208 15.4261L11.0023 17.2589L10.9363 17.3665ZM16.8737 13.6911C17.2195 13.6911 17.4998 13.4108 17.4998 13.0651L17.4998 8.54474C17.4996 8.19913 17.2194 7.91872 16.8737 7.91872L14.9186 7.91872C14.5731 7.91888 14.2928 8.19923 14.2926 8.54474L14.2926 13.0651C14.2926 13.4107 14.573 13.6909 14.9186 13.6911L16.8737 13.6911ZM9.68302 16.7307C9.76677 16.7684 9.8634 16.7309 9.908 16.6506L10.9265 14.8178C11.3084 14.083 11.8346 13.4585 13.1176 12.8707L13.1176 8.65173C13.1175 8.30605 12.8373 8.0257 12.4916 8.0257L7.73037 8.0257C7.4312 8.0257 7.17369 8.23775 7.11596 8.53129L6.52478 11.5404C6.37285 12.3138 6.96477 13.0337 7.75299 13.0339L9.70197 13.0339C9.20775 13.6125 8.73559 14.4106 8.73543 15.2531C8.73543 15.9336 9.0854 16.4618 9.68302 16.7307Z" fill="#9ca3af"/></svg> },
                          { title: 'Regenerate', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7.06984 12C7.06984 9.42265 9.21665 7.33331 11.8649 7.33331C14.5131 7.33331 16.6599 9.42265 16.6599 12C16.6599 14.5773 14.5131 16.6666 11.8649 16.6666C10.3202 16.6666 8.94594 15.9558 8.06898 14.8518M7.06984 12L8.93458 10.9522M7.06984 12L5.99324 10.1852" stroke="#9ca3af" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                          { title: 'Copy', onClick: () => { navigator.clipboard.writeText(msg.text); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 1500) }, icon: copiedIndex === i
                            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11.8665 9.33332C12.2289 9.33332 12.5411 9.3326 12.7969 9.3535C13.0604 9.37504 13.3227 9.42292 13.5749 9.55141C13.9506 9.74295 14.2567 10.0486 14.4486 10.4251C14.577 10.6772 14.625 10.9392 14.6465 11.2025C14.6674 11.458 14.6667 11.7698 14.6667 12.1315V15.8685C14.6667 16.23 14.6673 16.5415 14.6465 16.7969C14.625 17.0601 14.577 17.3221 14.4486 17.5742C14.257 17.9502 13.9512 18.2567 13.5749 18.4486C13.3228 18.577 13.0607 18.6249 12.7975 18.6465C12.5421 18.6673 12.2307 18.6666 11.8691 18.6666H8.13151C7.76987 18.6666 7.45799 18.6673 7.20247 18.6465C6.93925 18.6249 6.6772 18.577 6.42513 18.4486C6.0486 18.2567 5.74297 17.9506 5.55143 17.5749C5.42294 17.3227 5.37506 17.0604 5.35351 16.7969C5.34306 16.669 5.33842 16.5269 5.33594 16.3717L5.33333 15.8665V12.1334C5.33333 11.7711 5.33262 11.4589 5.35351 11.2031C5.37505 10.9396 5.42291 10.6773 5.55143 10.4251C5.74316 10.0489 6.04889 9.74315 6.42513 9.55141C6.67736 9.4229 6.93961 9.37503 7.20312 9.3535C7.45896 9.3326 7.77109 9.33332 8.13346 9.33332H11.8665ZM8.13346 10.6666C7.7491 10.6666 7.50082 10.6675 7.31185 10.6829C7.13065 10.6977 7.06352 10.7228 7.0306 10.7396C6.90519 10.8035 6.80349 10.9052 6.73958 11.0306C6.72281 11.0635 6.69774 11.1306 6.68294 11.3118C6.66751 11.5008 6.66666 11.7491 6.66666 12.1334V15.8665L6.66862 16.3509C6.67068 16.4845 6.67523 16.5937 6.68294 16.6881C6.69773 16.8691 6.72277 16.9364 6.73958 16.9694C6.80369 17.0951 6.9056 17.1974 7.0306 17.2611C7.06346 17.2778 7.13063 17.3029 7.3112 17.3177C7.49982 17.3331 7.74788 17.3333 8.13151 17.3333H11.8691C12.2527 17.3333 12.5003 17.3331 12.6888 17.3177C12.8694 17.3029 12.9365 17.2778 12.9694 17.2611C13.0946 17.1972 13.197 17.0944 13.2611 16.9687C13.2778 16.9358 13.303 16.8686 13.3177 16.6888C13.3331 16.5003 13.3333 16.2521 13.3333 15.8685V12.1315C13.3333 11.7479 13.3331 11.4998 13.3177 11.3112C13.3029 11.1306 13.2778 11.0635 13.2611 11.0306C13.1974 10.9056 13.0951 10.8037 12.9694 10.7396C12.9364 10.7228 12.8691 10.6977 12.6881 10.6829C12.4993 10.6675 12.2509 10.6666 11.8665 10.6666H8.13346ZM15.8665 5.33332C16.2289 5.33332 16.5411 5.3326 16.7969 5.3535C17.0604 5.37504 17.3227 5.42292 17.5749 5.55141C17.9506 5.74295 18.2567 6.04858 18.4486 6.42511C18.5771 6.67735 18.6249 6.93956 18.6465 7.20311C18.6674 7.45889 18.6667 7.77108 18.6667 8.13345V11.8665C18.6667 12.2289 18.6674 12.5411 18.6465 12.7969C18.6249 13.0603 18.577 13.3221 18.4486 13.5742C18.2567 13.9507 17.9504 14.2569 17.5742 14.4486C17.3222 14.577 17.0601 14.6249 16.7969 14.6465C16.755 14.6499 16.7117 14.6527 16.6668 14.655C16.299 14.6741 16 14.3672 16 13.9989C16 13.6309 16.2989 13.3463 16.6659 13.3195C16.6737 13.3189 16.6813 13.3183 16.6888 13.3177C16.8687 13.303 16.9358 13.2778 16.9687 13.2611C17.0943 13.1971 17.1972 13.0947 17.2611 12.9694C17.2779 12.9364 17.3029 12.8691 17.3177 12.6881C17.3331 12.4992 17.3333 12.2509 17.3333 11.8665V8.13345C17.3333 7.74916 17.3331 7.50071 17.3177 7.31183C17.3029 7.13102 17.2779 7.0636 17.2611 7.03058C17.1974 6.90559 17.0951 6.80368 16.9694 6.73957C16.9364 6.72276 16.8691 6.69772 16.6881 6.68293C16.4993 6.66749 16.2509 6.66665 15.8665 6.66665H12.1335C11.7491 6.66665 11.5008 6.66749 11.3118 6.68293C11.1307 6.69773 11.0635 6.72279 11.0306 6.73957C10.9052 6.80348 10.8035 6.90518 10.7396 7.03058C10.7228 7.0635 10.6977 7.13063 10.6829 7.31183C10.6823 7.31924 10.6818 7.32673 10.6812 7.33432C10.6542 7.70122 10.3691 7.99998 10.0012 7.99998C9.63288 7.99998 9.3259 7.70097 9.34495 7.33315C9.34728 7.28831 9.3501 7.24496 9.35351 7.20311C9.37505 6.93959 9.42291 6.67735 9.55143 6.42511C9.74316 6.04887 10.0489 5.74315 10.4251 5.55141C10.6774 5.4229 10.9396 5.37503 11.2031 5.3535C11.459 5.3326 11.7711 5.33332 12.1335 5.33332H15.8665Z" fill="#9ca3af"/></svg> },
                          { title: 'More', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14.3337C12.5523 14.3337 13 14.7814 13 15.3337C12.9998 15.8858 12.5522 16.3337 12 16.3337C11.4478 16.3337 11.0002 15.8858 11 15.3337C11 14.7814 11.4477 14.3337 12 14.3337ZM12 10.9997C12.5522 10.9997 12.9998 11.4476 13 11.9997C13 12.552 12.5523 12.9997 12 12.9997C11.4477 12.9997 11 12.552 11 11.9997C11.0002 11.4476 11.4478 10.9997 12 10.9997ZM12 7.66669C12.5523 7.66669 13 8.1144 13 8.66669C13 9.21897 12.5523 9.66669 12 9.66669C11.4477 9.66669 11 9.21897 11 8.66669C11 8.1144 11.4477 7.66669 12 7.66669Z" fill="#9ca3af"/></svg> },
                        ].map(({ title, icon, onClick }) => (
                          <button
                            key={title}
                            title={title}
                            onClick={onClick}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 6,
                              transition: 'background 120ms ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}

                    {isAI && i === lastAIIndex && msg.related?.length > 0 && (
                      <div style={{ marginTop: 20, width: '100%', maxWidth: '75%' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>Related</p>
                        {msg.related.map((topic, ri) => (
                          <div
                            key={ri}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '11px 0',
                              borderTop: '1px solid #e5e7eb',
                              cursor: 'pointer',
                              opacity: 0,
                              animation: `slideInRight 220ms cubic-bezier(0.22,1,0.36,1) forwards`,
                              animationDelay: `${ri * 60}ms`,
                            }}
                          >
                            <span style={{ fontSize: 13, color: 'rgba(17,24,39,0.8)', lineHeight: 1.4 }}>{topic}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 12 }}>
                              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            })()}

            {/* Thinking indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'msgIn 250ms ease forwards', opacity: 0 }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {[0, 160, 320].map(delay => (
                    <span key={delay} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#9ca3af',
                      animation: 'dot-bounce 1.1s ease-in-out infinite',
                      animationDelay: `${delay}ms`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

    </div>
  )
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false)
  if (!signedIn) return <SignIn onSignIn={() => setSignedIn(true)} />
  return <MainApp />
}
