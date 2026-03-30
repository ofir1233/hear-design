import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

// ── Constants ──────────────────────────────────────────────────────────────────

const COBALT = '#1779F7'
const GREEN  = '#4BA373'
const AMBER  = '#F59E0B'
const CORAL  = '#FF7056'

const AVATAR_COLORS = {
  blue:   '#1779F7', green:  '#4BA373', peach:  '#FF7056',
  lilac:  '#9B6DD6', teal:   '#3BA8A8', orange: '#F59E0B',
  pink:   '#E56BAD', purple: '#7C5FD6',
}

const AGENTS = [
  { name: 'Alan Watts',    initials: 'AW', color: 'blue'   },
  { name: 'Robert Chen',   initials: 'RC', color: 'green'  },
  { name: 'Priya Nair',    initials: 'PN', color: 'lilac'  },
  { name: 'John Smith',    initials: 'JS', color: 'teal'   },
  { name: 'Sarah Chen',    initials: 'SC', color: 'peach'  },
  { name: 'Marcus Webb',   initials: 'MW', color: 'orange' },
]

const MOCK_COMMENTS = [
  {
    id: 1,
    author: { name: 'Alan Watts',  initials: 'AW', color: 'blue'  },
    date: 'October 28, 2025 at 8:53 PM',
    text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
    assigned: null,
    replies: [
      {
        id: 11,
        author: { name: 'John Smith', initials: 'JS', color: 'teal' },
        date: 'October 28, 2025 at 9:10 PM',
        text: '@AlanWatts Great catch, I\'ll flag this for the QA team.',
        assigned: null,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    author: { name: 'John Smith',  initials: 'JS', color: 'teal'  },
    date: 'October 28, 2025 at 8:53 PM',
    text: '@JohnSmith Great example of de-escalation. Your tone at 02:30 completely shifted the call\'s energy. I\'m adding this to our \'Best Practices\' folder for team training. Well done.',
    assigned: null,
    replies: [],
  },
  {
    id: 3,
    author: { name: 'Brendon Green', initials: 'BG', color: 'green' },
    date: 'October 28, 2025 at 9:00 PM',
    text: 'Assigning to @SamanthaLee. This is an escalation from a Premium account. Customer reported repeated disconnects — please prioritize and follow up by EOD.',
    assigned: '@SamanthaLee',
    replies: [],
  },
]

const STATUS_OPTIONS = ['IN PROGRESS', 'DONE', 'PENDING', 'CANCELLED']
const PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW']

// ── Small helpers ──────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 28 }) {
  const bg = AVATAR_COLORS[color] || color || '#9ca3af'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
      fontFamily: "'Byrd', sans-serif",
    }}>
      {initials}
    </div>
  )
}

function Mention({ text }) {
  // Render @mentions in cobalt
  const parts = text.split(/(@\w+)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('@')
          ? <span key={i} style={{ color: COBALT, fontWeight: 600 }}>{part}</span>
          : part
      )}
    </>
  )
}

function ReplyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5l4-3v2c4 0 6 2 6 6-1-2-3-3-6-3v2L2 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

function AssignIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 11c0-2.5 2-4 4.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M9 8l1.5 1.5L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronDown({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

// ── StatusDropdown ─────────────────────────────────────────────────────────────

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const color = value === 'DONE' ? GREEN : value === 'IN PROGRESS' ? COBALT : value === 'CANCELLED' ? '#EF4444' : AMBER

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 28, padding: '0 10px',
          background: `${color}15`, border: `1px solid ${color}40`,
          borderRadius: 7, cursor: 'pointer',
          fontSize: 11, fontWeight: 700, color,
          fontFamily: "'Byrd', sans-serif", letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        {value} <ChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: 130,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 200, padding: '4px 0',
        }}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => { onChange(s); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 14px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: s === value ? 700 : 400,
              color: s === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PriorityDropdown ───────────────────────────────────────────────────────────

function PriorityDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 26, padding: '0 10px',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
          borderRadius: 6, cursor: 'pointer',
          fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
        }}
      >
        {value || '—'} <ChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 110,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 200, padding: '4px 0',
        }}>
          {PRIORITY_OPTIONS.map(p => (
            <button key={p} onClick={() => { onChange(p); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 14px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: p === value ? 700 : 400,
              color: p === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── MentionDropdown ────────────────────────────────────────────────────────────

function MentionDropdown({ query, onSelect, anchorRef }) {
  const filtered = AGENTS.filter(a =>
    a.name.toLowerCase().replace(/\s/g, '').includes(query.toLowerCase())
  )
  if (!filtered.length) return null

  return (
    <div style={{
      position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0,
      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
      borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      zIndex: 300, overflow: 'hidden',
    }}>
      <div style={{
        padding: '8px 14px 4px',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
        textTransform: 'uppercase',
      }}>Agents</div>
      {filtered.map(agent => (
        <button key={agent.name} onMouseDown={e => { e.preventDefault(); onSelect(agent) }} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '8px 14px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Byrd', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
        >
          <Avatar initials={agent.initials} color={agent.color} size={28} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</span>
        </button>
      ))}
    </div>
  )
}

// ── CommentItem ────────────────────────────────────────────────────────────────

function CommentItem({ comment, depth = 0, onReply }) {
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')

  function submitReply() {
    if (!replyText.trim()) return
    onReply(comment.id, replyText)
    setReplyText('')
    setReplying(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Thread line for replies */}
      {depth > 0 && (
        <div style={{
          position: 'absolute', left: -16, top: 0, bottom: 0,
          width: 1.5, background: 'var(--border-default)',
        }} />
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        <Avatar initials={comment.author.initials} color={comment.author.color} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              {comment.author.name}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {comment.date}
            </span>
          </div>
          <p style={{
            margin: '0 0 8px', fontSize: 13, lineHeight: 1.6,
            color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
          }}>
            <Mention text={comment.text} />
          </p>

          {/* Action row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => setReplying(r => !r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                height: 24, padding: '0 8px',
                background: 'none', border: '1px solid var(--border-default)',
                borderRadius: 5, cursor: 'pointer',
                fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                transition: 'all 120ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <ReplyIcon /> Reply
            </button>
            {comment.assigned && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 22, padding: '0 8px',
                background: `${COBALT}10`, border: `1px solid ${COBALT}30`,
                borderRadius: 5, fontSize: 11, color: COBALT,
                fontFamily: "'Byrd', sans-serif",
              }}>
                <AssignIcon /> Assigned to <strong>{comment.assigned}</strong>
              </span>
            )}
          </div>

          {/* Reply composer */}
          {replying && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              marginBottom: 10,
            }}>
              <textarea
                autoFocus
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                rows={2}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '8px 10px', resize: 'none',
                  background: 'var(--bg-canvas)', border: '1px solid var(--b100)',
                  borderRadius: 7, fontSize: 12, lineHeight: 1.5,
                  color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={submitReply} style={{
                  height: 26, padding: '0 12px', borderRadius: 6,
                  background: COBALT, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, color: '#fff',
                  fontFamily: "'Byrd', sans-serif",
                }}>Reply</button>
                <button onClick={() => setReplying(false)} style={{
                  height: 26, padding: '0 12px', borderRadius: 6,
                  background: 'none', border: '1px solid var(--border-default)',
                  cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)',
                  fontFamily: "'Byrd', sans-serif",
                }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies?.length > 0 && (
            <div style={{ paddingLeft: 16, marginTop: 4, position: 'relative' }}>
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CommentComposer ────────────────────────────────────────────────────────────

function CommentComposer({ onSubmit }) {
  const [text, setText] = useState('')
  const [assigned, setAssigned] = useState(false)
  const [mentionQuery, setMentionQuery] = useState(null) // null = closed
  const textareaRef = useRef(null)

  function handleChange(e) {
    const val = e.target.value
    setText(val)
    // Detect @ mention
    const cursor = e.target.selectionStart
    const before = val.slice(0, cursor)
    const match = before.match(/@(\w*)$/)
    setMentionQuery(match ? match[1] : null)
  }

  function selectMention(agent) {
    const cursor = textareaRef.current.selectionStart
    const before = text.slice(0, cursor)
    const after  = text.slice(cursor)
    const replaced = before.replace(/@\w*$/, `@${agent.name.replace(/\s/g, '')} `) + after
    setText(replaced)
    setMentionQuery(null)
    textareaRef.current.focus()
  }

  function handleSubmit() {
    if (!text.trim()) return
    onSubmit({ text, assigned })
    setText('')
    setAssigned(false)
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12, overflow: 'visible',
      position: 'relative',
    }}>
      {/* Text area */}
      <div style={{ position: 'relative' }}>
        {mentionQuery !== null && (
          <MentionDropdown
            query={mentionQuery}
            onSelect={selectMention}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 12px 8px' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder="Add a comment… use @ to mention someone"
            rows={3}
            style={{
              flex: 1, resize: 'none', border: 'none', outline: 'none',
              background: 'transparent', fontSize: 13, lineHeight: 1.6,
              color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: text.trim() ? COBALT : 'var(--bg-active)',
              border: 'none', cursor: text.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms ease', marginTop: 2,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 2.5l4 4-4 4" stroke={text.trim() ? '#fff' : 'var(--text-muted)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Divider + Assign toggle */}
      <div style={{ borderTop: '1px solid var(--border-default)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setAssigned(a => !a)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            border: `2px solid ${assigned ? COBALT : 'var(--border-input)'}`,
            background: assigned ? COBALT : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 150ms ease',
          }}>
            {assigned && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2.5 2.5 4-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
            Assign Comment
          </span>
        </button>
      </div>
    </div>
  )
}

// ── CallPanel ─────────────────────────────────────────────────────────────────

export default function CallPanel({ call, topic, onClose }) {
  const [status,   setStatus]   = useState(call.status   || 'IN PROGRESS')
  const [priority, setPriority] = useState(call.priority || 'MEDIUM')
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [commentsOpen, setCommentsOpen] = useState(true)

  const agent = call.assignedTo || { name: 'Sarah Chen', initials: 'SC', color: 'blue' }

  function addComment({ text, assigned }) {
    const newComment = {
      id: Date.now(),
      author: { name: 'You', initials: 'YO', color: 'orange' },
      date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      text,
      assigned: assigned ? '@You' : null,
      replies: [],
    }
    setComments(c => [newComment, ...c])
  }

  function addReply(parentId, text) {
    const newReply = {
      id: Date.now(),
      author: { name: 'You', initials: 'YO', color: 'orange' },
      date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      text,
      assigned: null,
      replies: [],
    }
    setComments(prev => prev.map(c =>
      c.id === parentId
        ? { ...c, replies: [...c.replies, newReply] }
        : c
    ))
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.3)',
          animation: 'fadeIn 180ms ease forwards',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 420, zIndex: 401,
        background: 'var(--bg-sidebar)',
        borderLeft: 'var(--page-header-border)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 220ms cubic-bezier(0.4,0,0.2,1) forwards',
        fontFamily: "'Byrd', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', flexShrink: 0, gap: 12,
          borderBottom: '1px solid var(--border-default)',
        }}>
          {/* Left: close + title + subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <button onClick={onClose} style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 120ms ease, color 120ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <CloseIcon />
            </button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Call Panel</div>
              <div style={{
                fontSize: 11, color: 'var(--text-muted)', marginTop: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{topic}</div>
            </div>
          </div>
          {/* Right: status */}
          <div style={{ flexShrink: 0 }}>
            <StatusDropdown value={status} onChange={setStatus} />
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* Details card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 12, marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Details</span>
            </div>

            {[
              {
                label: 'Operating Agent',
                content: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar initials="SC" color="peach" size={24} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Sarah Chen</span>
                </div>,
              },
              {
                label: 'Customer',
                content: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar initials="AW" color="blue" size={24} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    {call.destination || 'Unknown Customer'}
                  </span>
                </div>,
              },
              {
                label: 'Assigned',
                content: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar initials={agent.initials} color={agent.color} size={24} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{agent.name}</span>
                  <ChevronDown />
                </div>,
              },
              {
                label: 'Priority',
                content: <PriorityDropdown value={priority} onChange={setPriority} />,
              },
            ].map(({ label, content }, i, arr) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none',
                gap: 12,
              }}>
                <div style={{
                  width: 2, alignSelf: 'stretch',
                  background: 'var(--border-default)', borderRadius: 2, flexShrink: 0,
                }} />
                <div style={{ minWidth: 100, fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
                <div>{content}</div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
            <Avatar initials="YO" color="orange" size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <CommentComposer onSubmit={addComment} />
            </div>
          </div>

          {/* Comments section */}
          <div>
            <button
              onClick={() => setCommentsOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0', marginBottom: commentsOpen ? 14 : 4,
                color: 'var(--text-primary)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 180ms ease', transform: commentsOpen ? 'rotate(90deg)' : 'none' }}>
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Byrd', sans-serif" }}>
                Comments
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 18, height: 18, borderRadius: '50%',
                background: `${CORAL}20`, color: CORAL,
                fontSize: 10, fontWeight: 700,
              }}>{comments.length}</span>
            </button>

            {commentsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border-default)',
                  }}>
                    <CommentItem comment={comment} onReply={addReply} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>,
    document.body
  )
}
