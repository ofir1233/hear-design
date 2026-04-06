import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Badge from '../Badge'

// ── Shared primitives (matching ProjectsPage patterns) ───────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Mock data ────────────────────────────────────────────────────────────────────

const MOCK_PROMPTS = [
  {
    id: 1,
    definition: 'Customer Summary',
    prompt: 'Focus on: - **Patterns** that appear repeatedly across transcripts, not one-off events. - **Trends** in tone, emotion, and satisfaction over time. - **Actionable insights** that can guide account managers or support teams to improve the customer\'s experience. Important guidelines: - Treat all transcripts as belonging to the *same customer* with consistent context. - Write in clear, natural language suitable for a professional business report. - Avoid generic statements — every insight should be grounded in transcript evidence. - When listing insights, group them by positive themes and pain points. Your response will later be structured into JSON, so focus on content clarity, not formatting.',
    level: 'System',
    status: 'Active',
  },
  {
    id: 2,
    definition: 'Agent Evaluation',
    prompt: 'Writing Requirements: Length: 80–120 words per section. Tone: Professional, objective, constructive. Format: Flowing paragraphs, not bullet points. Language: Specific and evidence-based.',
    level: 'System',
    status: 'Active',
  },
]

const MOCK_DEFINITIONS = [
  { id: 1, name: 'Customer Summary', description: 'Summarizes customer interaction patterns and sentiment trends.' },
  { id: 2, name: 'Agent Evaluation', description: 'Evaluates agent performance based on call transcripts.' },
]

const TABS = ['Prompts', 'Definitions']

// ── Prompt tooltip cell ───────────────────────────────────────────────────────────

function PromptCell({ text }) {
  const [tooltip, setTooltip] = useState(null)
  const cellRef = useRef(null)

  useEffect(() => {
    if (!tooltip) return
    function hide() { setTooltip(null) }
    document.addEventListener('scroll', hide, true)
    return () => document.removeEventListener('scroll', hide, true)
  }, [tooltip])

  function showTooltip() {
    const r = cellRef.current.getBoundingClientRect()
    setTooltip({ top: r.bottom + 6, left: r.left })
  }

  return (
    <>
      <div
        ref={cellRef}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setTooltip(null)}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default' }}
      >
        {text}
      </div>
      {tooltip && createPortal(
        <div style={{
          position: 'fixed', top: tooltip.top, left: tooltip.left,
          maxWidth: 340, zIndex: 9999,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 10, padding: '12px 14px',
          fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
          lineHeight: 1.6, boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>,
        document.body
      )}
    </>
  )
}

// ── Tables ────────────────────────────────────────────────────────────────────────

const SEP  = { width: 1, background: 'var(--border-default)', alignSelf: 'stretch', flexShrink: 0 }
const COL  = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }
const CELL = { fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }

function PromptsTable() {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-active)', borderBottom: '1px solid var(--border-default)', padding: '10px 0' }}>
        <div style={{ width: 48, textAlign: 'center', ...COL }}>#</div>
        <div style={SEP} />
        <div style={{ width: 180, padding: '0 16px', ...COL }}>Definition</div>
        <div style={SEP} />
        <div style={{ flex: 1, padding: '0 16px', ...COL }}>Prompt</div>
        <div style={SEP} />
        <div style={{ width: 110, padding: '0 16px', ...COL }}>Level</div>
        <div style={SEP} />
        <div style={{ width: 110, padding: '0 16px', ...COL }}>Status</div>
      </div>
      {MOCK_PROMPTS.map((row, i) => (
        <div
          key={row.id}
          style={{
            display: 'flex', alignItems: 'center',
            borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
            background: 'var(--bg-canvas)', transition: 'background 100ms ease', padding: '12px 0',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
        >
          <div style={{ width: 48, textAlign: 'center', ...CELL, color: 'var(--text-muted)' }}>{row.id}</div>
          <div style={SEP} />
          <div style={{ width: 180, padding: '0 16px', ...CELL, fontWeight: 500 }}>{row.definition}</div>
          <div style={SEP} />
          <div style={{ flex: 1, padding: '0 16px', minWidth: 0 }}>
            <PromptCell text={row.prompt} />
          </div>
          <div style={SEP} />
          <div style={{ width: 110, padding: '0 16px' }}>
            <Badge variant="tinted" color="coral">{row.level}</Badge>
          </div>
          <div style={SEP} />
          <div style={{ width: 110, padding: '0 16px' }}>
            <Badge variant="tinted" color="green">{row.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function DefinitionsTable() {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-active)', borderBottom: '1px solid var(--border-default)', padding: '10px 0' }}>
        <div style={{ width: 48, textAlign: 'center', ...COL }}>#</div>
        <div style={SEP} />
        <div style={{ width: 200, padding: '0 16px', ...COL }}>Name</div>
        <div style={SEP} />
        <div style={{ flex: 1, padding: '0 16px', ...COL }}>Description</div>
      </div>
      {MOCK_DEFINITIONS.map((row, i) => (
        <div
          key={row.id}
          style={{
            display: 'flex', alignItems: 'center',
            borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
            background: 'var(--bg-canvas)', transition: 'background 100ms ease', padding: '12px 0',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
        >
          <div style={{ width: 48, textAlign: 'center', ...CELL, color: 'var(--text-muted)' }}>{row.id}</div>
          <div style={SEP} />
          <div style={{ width: 200, padding: '0 16px', ...CELL, fontWeight: 500 }}>{row.name}</div>
          <div style={SEP} />
          <div style={{ flex: 1, padding: '0 16px', ...CELL, color: 'var(--text-muted)' }}>{row.description}</div>
        </div>
      ))}
    </div>
  )
}

// ── PromptsPage ───────────────────────────────────────────────────────────────────

export default function PromptsPage() {
  const [activeTab, setActiveTab] = useState('Prompts')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <SectionHeader
        title="Prompts"
        subtitle="View and manage all prompts configured for your organization."
      />

      {/* Underline tab bar */}
      <div style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0 0 10px', fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Byrd', sans-serif",
                  color: isActive ? 'var(--b100)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--b100)' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color 150ms ease, border-color 150ms ease',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === 'Prompts' ? <PromptsTable /> : <DefinitionsTable />}
    </div>
  )
}
