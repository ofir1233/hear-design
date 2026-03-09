import { useState } from 'react'

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDoubleDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 8.5l2-5c.6 0 1.5.4 1.5 1.5V7h3.5c.6 0 1 .5.9 1.1l-.7 4c-.1.5-.5.9-1 .9H5M5 8.5V13M5 8.5H3a1 1 0 00-1 1V12a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11 5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10.5 2.5l3 3L5 14H2v-3L10.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.4 7.3l5.2-3M5.4 8.7l5.2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L13.5 12H1.5L7.5 1.5z" stroke="#F59E0B" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="7.5" y1="6" x2="7.5" y2="9" stroke="#F59E0B" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7.5" cy="10.5" r="0.6" fill="#F59E0B" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="7" y1="6" x2="7" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7" cy="4.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function FeedbackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5c0-.8.9-1.5 2-1.5s2 .7 2 1.5c0 .7-.5 1.3-1.3 1.5L7 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6.5" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ title, right, onCollapse, collapsed }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        {onCollapse && (
          <button onClick={onCollapse} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 6,
            background: 'none', border: '1px solid var(--border-default)',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            {collapsed ? <ChevronDown /> : <ChevronUp />}
          </button>
        )}
      </div>
    </div>
  )
}

function OutlineBtn({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 30, padding: '0 12px',
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        fontSize: 12, color: 'var(--text-secondary)',
        fontFamily: "'Byrd', sans-serif",
        cursor: 'pointer', whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function IconBtn({ children, title }) {
  return (
    <button title={title} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: 6,
      background: 'none', border: '1px solid var(--border-default)',
      cursor: 'pointer', color: 'var(--text-secondary)',
    }}>
      {children}
    </button>
  )
}

// ── Call Summary ──────────────────────────────────────────────────────────────

const MOCK_TAGS = [
  { key: 'Call_Type',   value: 'The Type of call' },
  { key: 'Call_Type',   value: 'The Type of call' },
  { key: 'Agent_Code',  value: 'The agent code in the value' },
  { key: 'Agent_Name',  value: 'The agent code in the value' },
  { key: 'Agent_Name',  value: 'The agent code in the value' },
]

function TagPill({ text, variant }) {
  const isKey = variant === 'key'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 26, padding: '0 10px',
      borderRadius: isKey ? '6px 0 0 6px' : '0 6px 6px 0',
      fontSize: 12, fontFamily: "'Byrd', sans-serif",
      border: `1px solid ${isKey ? 'var(--border-default)' : 'var(--b30)'}`,
      background: isKey ? 'var(--bg-active)' : 'var(--b10)',
      color: isKey ? 'var(--text-secondary)' : 'var(--b100)',
      fontWeight: isKey ? 500 : 400,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}

function CallSummarySection({ call }) {
  const [showTags, setShowTags] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const summaryText = call.summary || 'The customer reached out to customer service due to login problems. The agent apologized for the inconvenience and promptly requested the necessary account details to address the issue effectively, ensuring a swift resolution to the problem at hand, customer reached out to customer service due to login problems.'
  const truncated = summaryText.length > 180 && !expanded

  return (
    <SectionCard>
      <div style={{ padding: '16px 20px' }}>
        {/* Row 1: title + tag toggle + action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", flex: 1 }}>
            Call summary
          </span>
          <button
            onClick={() => setShowTags(t => !t)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 28, padding: '0 12px',
              background: showTags ? 'var(--b10)' : 'var(--bg-canvas)',
              border: `1px solid ${showTags ? 'var(--b30)' : 'var(--border-default)'}`,
              borderRadius: 6,
              fontSize: 12, color: showTags ? 'var(--b100)' : 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {showTags ? 'Hide tags' : 'Show tags'}
            {showTags ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            <IconBtn title="Comment"><CommentIcon /></IconBtn>
            <IconBtn title="Like"><ThumbUpIcon /></IconBtn>
            <IconBtn title="Copy"><CopyIcon /></IconBtn>
            <IconBtn title="Edit"><EditIcon /></IconBtn>
          </div>
        </div>

        {/* Summary text */}
        <p style={{
          margin: 0, fontSize: 13, lineHeight: 1.65,
          color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
        }}>
          {truncated ? summaryText.slice(0, 180) + '… ' : summaryText + ' '}
          <span
            onClick={() => setExpanded(e => !e)}
            style={{ color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {truncated ? 'Show all.' : 'Show less.'}
          </span>
        </p>

        {/* Tags panel */}
        {showTags && (
          <div style={{
            marginTop: 14,
            padding: '12px 14px',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              TAGS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MOCK_TAGS.map((tag, i) => (
                <div key={i} style={{ display: 'inline-flex' }}>
                  <TagPill text={tag.key} variant="key" />
                  <TagPill text={tag.value} variant="value" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

// ── Call Metrics ──────────────────────────────────────────────────────────────

function MetricCell({ label, value, muted }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: muted ? 'var(--bg-active)' : 'var(--bg-canvas)',
      border: '1px solid var(--border-default)',
      borderRadius: 8,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
        color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
        textTransform: 'uppercase', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 14, fontWeight: 600,
          color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
        }}>
          {value}
        </span>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          <InfoIcon />
        </span>
      </div>
    </div>
  )
}

function CallMetricsSection({ call }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const primaryMetrics = [
    { label: 'Relevant call?',              value: 'Yes',                          muted: false },
    { label: 'Requested Service',           value: 'Professional advice',          muted: false },
    { label: 'Relevant status lead',        value: 'Lose lead',                    muted: false },
    { label: 'Direction',                   value: call.callType === 'inbound' ? 'Inbound' : 'Outbound', muted: true },
    { label: 'Reason for losing opportunity', value: 'No open calendar for doctor', muted: false },
    { label: 'Handle time',                 value: '14 mins',                      muted: true },
  ]

  const extraMetrics = [
    { label: 'Call date',   value: call.callDate,  muted: false },
    { label: 'Destination', value: call.destination, muted: false },
    { label: 'Priority',    value: call.priority || 'N/A', muted: false },
    { label: 'Status',      value: call.status || 'N/A',   muted: false },
  ]

  const visibleMetrics = showMore ? [...primaryMetrics, ...extraMetrics] : primaryMetrics

  return (
    <SectionCard>
      <SectionHeader
        title="Call metrics"
        right={<OutlineBtn>Edit metrics</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {visibleMetrics.map((m, i) => (
              <MetricCell key={i} label={m.label} value={m.value} muted={m.muted} />
            ))}
          </div>
          <button
            onClick={() => setShowMore(s => !s)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              width: '100%', height: 34,
              background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
              borderRadius: 8, cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
            }}
          >
            {showMore ? 'Show less' : 'Show more'}
            {showMore ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      )}
    </SectionCard>
  )
}

// ── Agent Evaluation ──────────────────────────────────────────────────────────

const SALES_METRICS = [
  { label: 'Identifying Sales Opportunities',   score: 89 },
  { label: 'Handling Objections',               score: 89 },
  { label: 'Persuasion and Solution Presentation', score: 89 },
  { label: 'Creating a Sense of Urgency',       score: 33 },
]

const PROF_METRICS = [
  { label: 'Customer Needs Assessment', score: 89 },
  { label: 'Self-Introduction',         score: 89 },
  { label: 'Positive Engagement',       score: 89 },
  { label: 'Call Summary and Reflection', score: 89 },
]

function ScoreBar({ label, score }) {
  const barColor = score >= 70 ? '#1779F7' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", flexShrink: 0, marginLeft: 8 }}>
          {score}/100
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--border-default)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: barColor, borderRadius: 2,
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  )
}

function AgentAvatar({ name, initials, color = '#FF7056' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 20px 16px 16px' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 700, color: '#fff',
        fontFamily: "'Byrd', sans-serif",
        border: '2px solid rgba(0,0,0,0.12)',
      }}>
        {initials}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginTop: 2 }}>
          Agent operating
        </div>
      </div>
    </div>
  )
}

function AgentEvaluationSection({ call }) {
  const [collapsed, setCollapsed] = useState(false)
  const agent = call.assignedTo || { name: 'John Smith', initials: 'JS', color: '#FF7056' }

  const AVATAR_COLORS = {
    blue: '#418FF4', peach: '#F3AC9E', orange: '#FF7056',
    lilac: '#D799E2', green: '#6AB18A', teal: '#5FA8A0',
    sage: '#8FA882', horizon: '#7AAAB8',
  }
  const avatarColor = AVATAR_COLORS[agent.color] || '#FF7056'

  return (
    <SectionCard>
      <SectionHeader
        title="Agent evaluation"
        right={<OutlineBtn>Edit metrics</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ display: 'flex', padding: '0 20px 20px', gap: 0 }}>
          {/* Agent card */}
          <div style={{
            flexShrink: 0, width: 120,
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 16,
          }}>
            <AgentAvatar name={agent.name} initials={agent.initials} color={avatarColor} />
          </div>

          {/* Score columns */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif", marginBottom: 12,
              }}>
                Sales Techniques
              </div>
              {SALES_METRICS.map(m => <ScoreBar key={m.label} label={m.label} score={m.score} />)}
            </div>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif", marginBottom: 12,
              }}>
                Professionalism
              </div>
              {PROF_METRICS.map(m => <ScoreBar key={m.label} label={m.label} score={m.score} />)}
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ── Monitored Events ──────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  { text: 'agent not following playbook.' },
  { text: 'agent not following playbook.' },
  { text: 'Sentiment score blow 2.0 detected' },
]

function MonitoredEventsSection() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SectionCard>
      <SectionHeader
        title="Monitored events detected"
        right={
          <>
            <OutlineBtn>Go to Alerts</OutlineBtn>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6,
              background: 'none', border: '1px solid var(--border-default)',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}>
              <ChevronDoubleDown />
            </button>
          </>
        }
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MOCK_EVENTS.map((ev, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WarningIcon />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
                  {ev.text}
                </span>
              </div>
              <OutlineBtn>
                <FeedbackIcon /> Give feedback
              </OutlineBtn>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

// ── Transcription ─────────────────────────────────────────────────────────────

function TranscriptionSection() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SectionCard>
      <SectionHeader
        title="Transcription"
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            maxHeight: 280, overflowY: 'auto',
          }}>
            {[
              { speaker: 'Agent',    time: '0:05', text: 'Thank you for calling, how can I help you today?' },
              { speaker: 'Customer', time: '0:12', text: 'Hi, I\'m calling because I\'m having trouble logging into my account.' },
              { speaker: 'Agent',    time: '0:18', text: 'I\'m sorry to hear that. Let me pull up your account information. Could you please provide me with your account number or email address?' },
              { speaker: 'Customer', time: '0:28', text: 'Sure, my email is michael.johnson@email.com' },
              { speaker: 'Agent',    time: '0:35', text: 'Thank you. I can see your account here. Let me check what seems to be the issue.' },
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{
                  fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                  flexShrink: 0, paddingTop: 1, width: 32,
                }}>
                  {line.time}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                    fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {line.speaker}:&nbsp;
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.5 }}>
                    {line.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ── Customer Section ──────────────────────────────────────────────────────────

const CUSTOMER_HISTORY = [
  { agent: { name: 'Michael Johns.', initials: 'EC', color: '#1779F7' }, sentiment: 'Natural',  topic: 'Credit card payme...', date: '11/11/12', open: false },
  { agent: { name: 'Michael Johns.', initials: 'MJ', color: '#4BA373' }, sentiment: 'Negative', topic: 'Payment problems',      date: '11/11/10', open: true, current: true },
  { agent: { name: 'Sarah Williams', initials: 'SW', color: '#D799E2' }, sentiment: 'Natural',  topic: 'Fixing issue',          date: '11/11/9',  open: false },
  { agent: { name: 'David Martinez', initials: 'DM', color: '#F59E0B' }, sentiment: 'Positive', topic: 'Vacation order',        date: '11/11/8',  open: false },
]

function CustomerSection() {
  const [collapsed, setCollapsed] = useState(false)

  const thStyle = {
    padding: '8px 12px',
    fontSize: 11, fontWeight: 600,
    color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
    textTransform: 'uppercase', letterSpacing: '0.06em',
    textAlign: 'left', borderBottom: '1px solid var(--border-default)',
    background: 'var(--bg-canvas)',
    whiteSpace: 'nowrap',
  }

  const tdStyle = {
    padding: '10px 12px',
    fontSize: 13, color: 'var(--text-secondary)',
    fontFamily: "'Byrd', sans-serif",
    borderBottom: '1px solid var(--border-default)',
    whiteSpace: 'nowrap',
  }

  const SENTIMENT_COLORS = { Positive: '#4BA373', Negative: '#EF4444', Natural: 'var(--text-secondary)' }

  return (
    <SectionCard>
      <SectionHeader
        title="Customer"
        right={<OutlineBtn>Go to Customer page</OutlineBtn>}
        onCollapse={() => setCollapsed(c => !c)}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Agent', 'Sentiment', 'Topic', 'Call Date', 'Call'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CUSTOMER_HISTORY.map((row, i) => (
                <tr key={i} style={{ background: row.current ? 'rgba(23,121,247,0.05)' : 'transparent' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: row.agent.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: '#fff',
                        fontFamily: "'Byrd', sans-serif",
                        flexShrink: 0,
                      }}>
                        {row.agent.initials}
                      </div>
                      <span style={{
                        color: row.current ? 'var(--b100)' : 'var(--text-secondary)',
                        fontWeight: row.current ? 500 : 400,
                      }}>
                        {row.agent.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: SENTIMENT_COLORS[row.sentiment] || 'var(--text-secondary)' }}>
                    {row.sentiment}
                  </td>
                  <td style={tdStyle}>{row.topic}</td>
                  <td style={tdStyle}>{row.date}</td>
                  <td style={tdStyle}>
                    <span style={{
                      color: row.current ? 'var(--b100)' : 'var(--text-muted)',
                      fontWeight: row.current ? 600 : 400,
                      cursor: 'pointer',
                    }}>
                      Open
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}

// ── ExplorePage ───────────────────────────────────────────────────────────────

export default function ExplorePage({ call, onBack, isMobile = false, sidebarWidth = 272, sidebarTransition }) {
  const left = isMobile ? 0 : sidebarWidth

  const topic = call.destination?.toUpperCase() || 'AUTO ACCIDENT CLAIM'

  return (
    <div
      data-inspector="ExplorePage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Top header bar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: '1px solid var(--border-input)',
        background: 'var(--bg-sidebar)',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            height: 30, padding: '0 10px',
            background: 'none', border: '1px solid var(--border-default)',
            borderRadius: 6, cursor: 'pointer',
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif",
          }}
        >
          <BackIcon /> Data
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: "'Byrd', sans-serif" }}>›</span>
        <span style={{
          fontSize: 13, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: 320,
        }}>
          {call.id}
        </span>
      </div>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Topic header card */}
          <SectionCard>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                  textTransform: 'uppercase', marginBottom: 4,
                }}>
                  TOPIC
                </div>
                <h1 style={{
                  margin: 0, fontSize: 22, fontWeight: 700,
                  color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                  lineHeight: 1.2,
                }}>
                  {topic}
                </h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 4 }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  height: 32, padding: '0 12px',
                  background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
                  borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                  position: 'relative',
                }}>
                  <CommentIcon />
                  Comments
                  <span style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--c100)', color: '#fff',
                    fontSize: 9, fontWeight: 700, fontFamily: "'Byrd', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>3</span>
                </button>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  height: 32, padding: '0 12px',
                  background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
                  borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
                }}>
                  <ShareIcon /> Share
                </button>
              </div>
            </div>
          </SectionCard>

          <CallSummarySection call={call} />
          <CallMetricsSection call={call} />
          <AgentEvaluationSection call={call} />
          <MonitoredEventsSection />
          <TranscriptionSection />
          <CustomerSection />

        </div>
      </div>
    </div>
  )
}
