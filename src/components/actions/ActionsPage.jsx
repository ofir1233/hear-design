import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Header from '../../lab/components/Header.jsx'

// ── Constants ──────────────────────────────────────────────────────────────────

const COBALT = '#1779F7'
const GREEN  = '#4BA373'
const AMBER  = '#F59E0B'

const AVATAR_COLORS = {
  blue:   '#1779F7', green:  '#4BA373', peach:  '#FF7056',
  lilac:  '#9B6DD6', teal:   '#3BA8A8', orange: '#F59E0B',
  pink:   '#E56BAD', purple: '#7C5FD6', red:    '#EF4444',
}

const ALL_AGENTS = [
  { name: 'Alan Watts',    initials: 'AW', color: 'blue'   },
  { name: 'Robert Chen',   initials: 'RC', color: 'green'  },
  { name: 'Priya Nair',    initials: 'PN', color: 'lilac'  },
  { name: 'John Smith',    initials: 'JS', color: 'teal'   },
  { name: 'Sarah Chen',    initials: 'SC', color: 'peach'  },
  { name: 'Marcus Webb',   initials: 'MW', color: 'orange' },
  { name: 'Lisa Chen',     initials: 'LC', color: 'green'  },
  { name: 'Tyron James',   initials: 'TJ', color: 'red'    },
  { name: 'Yossi Marouani',initials: 'YM', color: 'orange' },
  { name: 'Noam Fine',     initials: 'NF', color: 'lilac'  },
]

const STATUS_OPTIONS   = ['PENDING', 'IN PROGRESS', 'DONE', 'CANCELLED']
const PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW']

const COLUMN_DEFS = [
  { id: 'PENDING',     label: 'Pending'     },
  { id: 'IN PROGRESS', label: 'In progress' },
  { id: 'DONE',        label: 'Done'        },
  { id: 'CANCELLED',   label: 'Cancelled'   },
]

const MOCK_ACTIONS = [
  {
    id: 'a1', title: 'Vacation reservation', status: 'PENDING', priority: 'HIGH',
    assignee: ALL_AGENTS[8],
    date: 'October 28, 2025 at 8:53 PM',
    summary: 'The customer reached out to customer service due to login problems. The agent apologized for the inconvenience and promptly requested the necessary account details.',
    text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
    operatingAgent: ALL_AGENTS[6],
    customer: ALL_AGENTS[0],
    comments: [
      {
        id: 1, author: ALL_AGENTS[0],
        date: 'October 28, 2025 at 8:53 PM',
        text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
        replies: [
          { id: 11, author: ALL_AGENTS[3], date: 'October 28, 2025 at 9:10 PM', text: '@AlanWatts Great catch, I\'ll flag this for the QA team.', replies: [] },
        ],
      },
      {
        id: 2, author: ALL_AGENTS[3],
        date: 'October 28, 2025 at 8:53 PM',
        text: '@JohnSmith Great example of de-escalation. Your tone at 02:30 completely shifted the call\'s energy.',
        replies: [],
      },
    ],
  },
  {
    id: 'a2', title: 'Vacation reservation', status: 'IN PROGRESS', priority: 'MEDIUM',
    assignee: ALL_AGENTS[8],
    date: 'October 28, 2025 at 8:53 PM',
    summary: 'The customer reached out to customer service due to login problems. The agent apologized for the inconvenience.',
    text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
    operatingAgent: ALL_AGENTS[6],
    customer: ALL_AGENTS[0],
    comments: [],
  },
  {
    id: 'a3', title: 'Vacation reservation', status: 'IN PROGRESS', priority: 'HIGH',
    assignee: ALL_AGENTS[8],
    date: 'October 28, 2025 at 8:53 PM',
    summary: 'Customer complaint regarding premium service handling. Needs immediate follow-up.',
    text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
    operatingAgent: ALL_AGENTS[1],
    customer: ALL_AGENTS[3],
    comments: [],
  },
  {
    id: 'a4', title: 'Vacation reservation', status: 'DONE', priority: 'LOW',
    assignee: ALL_AGENTS[9],
    date: 'October 28, 2025 at 8:53 PM',
    summary: 'Resolved. Agent followed correct escalation protocol.',
    text: '@AI, The Reason for Call parameter is tagged incorrectly. This wasn\'t a Billing Inquiry, it was a \'Service Outage Complaint\'. Please reanalyze the first 90 seconds and update the parameter.',
    operatingAgent: ALL_AGENTS[2],
    customer: ALL_AGENTS[4],
    comments: [],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 28 }) {
  const bg = AVATAR_COLORS[color] || color || '#9ca3af'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
      fontFamily: "'Byrd', sans-serif",
    }}>
      {initials}
    </div>
  )
}

function PriorityBadge({ value, size = 'sm' }) {
  const color = value === 'HIGH' ? '#EF4444' : value === 'MEDIUM' ? AMBER : GREEN
  const fs = size === 'sm' ? 10 : 11
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: size === 'sm' ? 20 : 22, padding: '0 8px',
      background: color, borderRadius: 20,
      fontSize: fs, fontWeight: 700, color: '#fff',
      fontFamily: "'Byrd', sans-serif", letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {value}
    </span>
  )
}

function StatusBadge({ value }) {
  const color = value === 'DONE' ? GREEN : value === 'IN PROGRESS' ? COBALT : value === 'CANCELLED' ? '#EF4444' : AMBER
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 22, padding: '0 10px',
      background: `${color}18`, border: `1px solid ${color}40`,
      borderRadius: 7, fontSize: 11, fontWeight: 700, color,
      fontFamily: "'Byrd', sans-serif", letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {value}
    </span>
  )
}

function Mention({ text }) {
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

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ReplyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5l4-3v2c4 0 6 2 6 6-1-2-3-3-6-3v2L2 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
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

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Inline dropdowns ──────────────────────────────────────────────────────────

function InlineDropdown({ label, value, options, onChange, colorFn }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const color = colorFn ? colorFn(value) : 'var(--text-primary)'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', border: '1px solid var(--border-default)',
        borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
        fontSize: 12, fontWeight: 600, color,
        fontFamily: "'Byrd', sans-serif",
        whiteSpace: 'nowrap',
      }}>
        {value} <ChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 120,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 500, padding: '4px 0',
        }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 14px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: opt === value ? 700 : 400,
              color: opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function AssigneeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Avatar initials={value.initials} color={value.color} size={22} />
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 3,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
        fontFamily: "'Byrd', sans-serif", padding: 0,
      }}>
        {value.name} <ChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 160,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 500, padding: '4px 0',
        }}>
          {ALL_AGENTS.map(agent => (
            <button key={agent.name} onClick={() => { onChange(agent); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left',
              padding: '7px 12px', background: 'none', border: 'none',
              fontSize: 13, fontWeight: agent.name === value.name ? 700 : 400,
              color: 'var(--text-primary)', cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Avatar initials={agent.initials} color={agent.color} size={20} />
              {agent.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Comment composer ──────────────────────────────────────────────────────────

function CommentComposer({ placeholder = 'Leave a comment… Type @ to mention someone', onSubmit }) {
  const [text, setText] = useState('')
  const [mention, setMention] = useState(null)   // { query, start }
  const [assigned, setAssigned] = useState(false)
  const textareaRef = useRef(null)

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    }
  }

  function handleChange(e) {
    const val = e.target.value
    setText(val)
    const pos = e.target.selectionStart
    const before = val.slice(0, pos)
    const m = before.match(/@(\w*)$/)
    setMention(m ? { query: m[1], start: before.lastIndexOf('@') } : null)
  }

  function pickMention(agent) {
    if (!mention) return
    const before = text.slice(0, mention.start)
    const after   = text.slice(mention.start + 1 + mention.query.length)
    const next = before + '@' + agent.name.replace(/\s+/g, '') + ' ' + after
    setText(next)
    setMention(null)
    textareaRef.current?.focus()
  }

  function submit() {
    if (!text.trim()) return
    onSubmit?.({ text, assigned })
    setText('')
    setAssigned(false)
  }

  const filtered = mention
    ? ALL_AGENTS.filter(a => a.name.toLowerCase().includes(mention.query.toLowerCase())).slice(0, 6)
    : []

  return (
    <div style={{
      border: '1px solid var(--border-default)', borderRadius: 10,
      background: 'var(--bg-card)', overflow: 'visible', position: 'relative',
    }}>
      {/* Mention dropdown */}
      {filtered.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 300, padding: '4px 0',
        }}>
          {filtered.map(agent => (
            <button key={agent.name} onMouseDown={e => { e.preventDefault(); pickMention(agent) }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '7px 12px', background: 'none', border: 'none',
              fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Avatar initials={agent.initials} color={agent.color} size={22} />
              {agent.name}
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%', border: 'none', outline: 'none', resize: 'none',
          background: 'transparent', padding: '12px 14px',
          fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
          lineHeight: 1.55, boxSizing: 'border-box',
        }}
      />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderTop: '1px solid var(--border-default)',
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={assigned} onChange={e => setAssigned(e.target.checked)}
            style={{ accentColor: COBALT, width: 14, height: 14, cursor: 'pointer' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>Assign Comment</span>
        </label>
        <button
          onClick={submit}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: text.trim() ? COBALT : 'var(--bg-active)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M7.5 3l4 3.5-4 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── CommentItem (recursive) ───────────────────────────────────────────────────

function CommentItem({ comment, depth = 0 }) {
  const [replying, setReplying] = useState(false)
  const [replies, setReplies] = useState(comment.replies || [])

  function addReply({ text }) {
    const r = {
      id: Date.now(), author: ALL_AGENTS[3],
      date: 'Just now', text, replies: [],
    }
    setReplies(prev => [...prev, r])
    setReplying(false)
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 28 : 0 }}>
      {depth > 0 && (
        <div style={{
          position: 'absolute', left: -16, top: 0, bottom: 0,
          width: 2, background: 'var(--border-default)', borderRadius: 2,
        }} />
      )}
      <div style={{ position: 'relative', display: 'flex', gap: 10, paddingTop: depth > 0 ? 10 : 0 }}>
        <Avatar initials={comment.author.initials} color={comment.author.color} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              {comment.author.name}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {comment.date}
            </span>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55, fontFamily: "'Byrd', sans-serif" }}>
            <Mention text={comment.text} />
          </p>
          <button
            onClick={() => setReplying(r => !r)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: '1px solid var(--border-default)', borderRadius: 6,
              padding: '3px 8px', cursor: 'pointer',
              fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
              transition: 'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <ReplyIcon /> Reply
          </button>
          {replying && (
            <div style={{ marginTop: 8 }}>
              <CommentComposer placeholder="Reply…" onSubmit={addReply} />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.map(r => (
        <div key={r.id} style={{ position: 'relative', paddingLeft: 16, marginTop: 10 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 2, background: 'var(--border-default)', borderRadius: 2,
          }} />
          <CommentItem comment={r} depth={depth + 1} />
        </div>
      ))}
    </div>
  )
}

// ── ActionItemModal ────────────────────────────────────────────────────────────

function ActionItemModal({ item, onClose }) {
  const [status,   setStatus]   = useState(item.status)
  const [priority, setPriority] = useState(item.priority)
  const [assigned, setAssigned] = useState(item.assignee)
  const [comments, setComments] = useState(item.comments)
  const [commentsOpen, setCommentsOpen] = useState(true)

  function addComment({ text, assigned: isAssigned }) {
    setComments(prev => [...prev, {
      id: Date.now(), author: ALL_AGENTS[0],
      date: 'Just now', text, replies: [],
      assigned: isAssigned ? '@you' : null,
    }])
  }

  const priorityColor = v => v === 'HIGH' ? '#EF4444' : v === 'MEDIUM' ? AMBER : GREEN
  const statusColor   = v => v === 'DONE' ? GREEN : v === 'IN PROGRESS' ? COBALT : v === 'CANCELLED' ? '#EF4444' : AMBER

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.45)',
        animation: 'actionFadeIn 180ms ease forwards',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(860px, 92vw)', maxHeight: '88vh',
        zIndex: 501,
        background: 'var(--bg-card)',
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Byrd', sans-serif",
        animation: 'actionSlideUp 220ms cubic-bezier(0.22,1,0.36,1) forwards',
        overflow: 'hidden',
      }}>

        {/* ── Modal header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-default)',
          flexShrink: 0, gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.title}
            </span>
            <PriorityBadge value={priority} size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 120ms ease, color 120ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <ExternalLinkIcon />
            </button>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 120ms ease, color 120ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ── Modal body (two-column) ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left column */}
          <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', borderRight: '1px solid var(--border-default)' }}>

            {/* Call summary */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Call summary</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                {item.summary}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-default)', marginBottom: 16 }} />

            {/* Composer */}
            <div style={{ marginBottom: 20 }}>
              <CommentComposer onSubmit={addComment} />
            </div>

            {/* Comments section */}
            <div>
              <button
                onClick={() => setCommentsOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                  fontFamily: "'Byrd', sans-serif", padding: 0, marginBottom: 14,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: commentsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Comments
              </button>

              {commentsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {comments.length === 0 && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No comments yet.</p>
                  )}
                  {comments.map(c => <CommentItem key={c.id} comment={c} />)}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Details */}
          <div className="smooth-scroll" style={{ width: 220, flexShrink: 0, overflowY: 'auto', padding: '20px 18px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Details</p>

            {[
              {
                label: 'Operating Agent',
                content: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Avatar initials={item.operatingAgent.initials} color={item.operatingAgent.color} size={20} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.operatingAgent.name}</span>
                  </div>
                ),
              },
              {
                label: 'Customer',
                content: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Avatar initials={item.customer.initials} color={item.customer.color} size={20} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.customer.name}</span>
                  </div>
                ),
              },
              {
                label: 'Assigned',
                content: <AssigneeDropdown value={assigned} onChange={setAssigned} />,
              },
              {
                label: 'Priority',
                content: (
                  <InlineDropdown
                    value={priority} options={PRIORITY_OPTIONS}
                    onChange={setPriority}
                    colorFn={priorityColor}
                  />
                ),
              },
              {
                label: 'Status',
                content: (
                  <InlineDropdown
                    value={status} options={STATUS_OPTIONS}
                    onChange={setStatus}
                    colorFn={statusColor}
                  />
                ),
              },
            ].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border-default)' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                {content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes actionFadeIn   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes actionSlideUp  { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>,
    document.body
  )
}

// ── KanbanCard ─────────────────────────────────────────────────────────────────

function KanbanCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-strong, #d1d5db)' : 'var(--border-default)'}`,
        borderRadius: 10,
        padding: '14px 14px 12px',
        cursor: 'pointer',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: "'Byrd', sans-serif" }}>
        {item.title}
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55, fontFamily: "'Byrd', sans-serif" }}>
        <Mention text={item.text} />
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Avatar initials={item.assignee.initials} color={item.assignee.color} size={24} />
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>{item.assignee.name}</p>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>{item.date}</p>
          </div>
        </div>
        <PriorityBadge value={item.priority} />
      </div>
    </div>
  )
}

// ── Filter bar helpers ─────────────────────────────────────────────────────────

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const active = value !== null
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        height: 30, padding: '0 11px',
        background: active ? 'var(--bg-active)' : 'none',
        border: '1px solid var(--border-default)', borderRadius: 7,
        cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400,
        color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
        whiteSpace: 'nowrap',
      }}>
        {value ? `${label}: ${value}` : label} <ChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 140,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 400, padding: '4px 0',
        }}>
          <button onClick={() => { onChange(null); setOpen(false) }} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '7px 14px', background: 'none', border: 'none',
            fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >All</button>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 14px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: opt === value ? 700 : 400,
              color: opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── ActionsPage ────────────────────────────────────────────────────────────────

export default function ActionsPage({ sidebarWidth = 0, sidebarTransition = '' }) {
  const [items, setItems] = useState(MOCK_ACTIONS)
  const [activeItem, setActiveItem]     = useState(null)
  const [filterAssignee, setFilterAssignee] = useState(null)
  const [filterStatus,   setFilterStatus]   = useState(null)
  const [filterPriority, setFilterPriority] = useState(null)

  const assigneeNames = [...new Set(ALL_AGENTS.map(a => a.name))]

  // Apply filters
  const visible = items.filter(it => {
    if (filterAssignee && it.assignee.name !== filterAssignee) return false
    if (filterStatus   && it.status   !== filterStatus)          return false
    if (filterPriority && it.priority !== filterPriority)        return false
    return true
  })

  const anyFilter = filterAssignee || filterStatus || filterPriority

  return (
    <div style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
      transition: sidebarTransition,
      background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Byrd', sans-serif",
    }}>
      <Header
        style={{ left: sidebarWidth + 16, transition: sidebarTransition }}
        left={
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Actions
          </span>
        }
      />

      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '64px 24px 12px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-canvas)',
      }}>
        <FilterDropdown label="Assignee" options={assigneeNames} value={filterAssignee} onChange={setFilterAssignee} />
        <FilterDropdown label="Status"   options={STATUS_OPTIONS}   value={filterStatus}   onChange={setFilterStatus} />
        <FilterDropdown label="Priority" options={PRIORITY_OPTIONS} value={filterPriority} onChange={setFilterPriority} />

        {/* Avatar cluster */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
          {ALL_AGENTS.slice(0, 6).map((a, i) => (
            <div key={a.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 6 - i }}>
              <Avatar initials={a.initials} color={a.color} size={26} />
            </div>
          ))}
          {ALL_AGENTS.length > 6 && (
            <div style={{
              marginLeft: -6, width: 26, height: 26, borderRadius: '50%',
              background: 'var(--bg-active)', border: '2px solid var(--bg-canvas)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
            }}>
              +{ALL_AGENTS.length - 6}
            </div>
          )}
        </div>

        {anyFilter && (
          <button onClick={() => { setFilterAssignee(null); setFilterStatus(null); setFilterPriority(null) }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: COBALT, fontFamily: "'Byrd', sans-serif", padding: '0 4px',
          }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Kanban board */}
      <div className="smooth-scroll" style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', gap: 14, height: '100%', minWidth: 720 }}>
          {COLUMN_DEFS.map(col => {
            const colItems = visible.filter(it => it.status === col.id)
            return (
              <div key={col.id} style={{
                flex: '1 1 0', minWidth: 240, maxWidth: 340,
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{col.label}</span>
                  <span style={{
                    minWidth: 22, height: 22, borderRadius: 11,
                    background: 'var(--bg-active)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', padding: '0 6px',
                  }}>
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
                  {colItems.map(item => (
                    <KanbanCard key={item.id} item={item} onClick={setActiveItem} />
                  ))}
                  {colItems.length === 0 && (
                    <div style={{
                      border: '1px dashed var(--border-default)', borderRadius: 10,
                      padding: '24px 16px', textAlign: 'center',
                      fontSize: 12, color: 'var(--text-muted)',
                    }}>
                      No items
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {activeItem && (
        <ActionItemModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  )
}
