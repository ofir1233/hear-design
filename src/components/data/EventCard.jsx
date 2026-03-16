import { useState } from 'react'
import { STATUS_COLORS } from './mockData.js'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function AttributeBadge({ attr }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px 3px 7px',
      borderLeft: `3px solid ${attr.color}`,
      borderRadius: '0 5px 5px 0',
      background: `${attr.color}14`,
      fontSize: 11,
      fontWeight: 500,
      flexShrink: 0,
    }}>
      <span style={{ color: attr.color, fontWeight: 600 }}>{attr.key}</span>
      <span style={{ color: 'var(--text-secondary)' }}>{attr.value}</span>
    </div>
  )
}

function QuickActions() {
  return (
    <div
      style={{ display: 'flex', gap: 4, flexShrink: 0 }}
      onClick={e => e.stopPropagation()}
    >
      {[
        { label: '↗', title: 'Open' },
        { label: '↓', title: 'Download' },
        { label: '···', title: 'More' },
      ].map(({ label, title }) => (
        <button
          key={label}
          title={title}
          style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-active)',
            border: '1px solid var(--border-default)',
            borderRadius: 6, cursor: 'pointer',
            fontSize: label === '···' ? 10 : 13,
            color: 'var(--text-secondary)',
            letterSpacing: label === '···' ? 1 : 0,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function CompliancePanel({ compliance }) {
  const scoreColor = compliance.score >= 70 ? '#4BA373' : compliance.score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
          {compliance.score}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Compliance Score</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>out of 100</div>
        </div>
      </div>
      {compliance.flags.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Flags
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {compliance.flags.map((flag, i) => (
              <div key={i} style={{ fontSize: 12, color: '#EF4444', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {compliance.rules.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Rules Triggered
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {compliance.rules.map((rule, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 4,
                background: 'var(--bg-active)', color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}>
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
      {compliance.flags.length === 0 && (
        <div style={{ fontSize: 13, color: '#4BA373' }}>✓ No compliance flags detected</div>
      )}
    </div>
  )
}

function MetadataPanel({ metadata }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
          </div>
        </div>
      ))}
    </div>
  )
}

function AgentAnalysisPanel({ analysis }) {
  const isPositive = analysis.sentiment.toLowerCase().includes('positive')
  const isNegative = analysis.sentiment.toLowerCase().includes('negative') || analysis.sentiment.toLowerCase().includes('critical') || analysis.sentiment.toLowerCase().includes('distressed')
  const sentimentColor = isPositive ? '#4BA373' : isNegative ? '#EF4444' : '#F59E0B'
  const sentimentBg    = isPositive ? '#4BA37320' : isNegative ? '#EF444420' : '#F59E0B20'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sentiment</div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
          background: sentimentBg, color: sentimentColor,
        }}>
          {analysis.sentiment}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Keywords
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {analysis.keywords.map((kw, i) => (
            <span key={i} style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: 'var(--bg-active)', color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}>
              {kw}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Summary
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {analysis.summary}
        </p>
      </div>
    </div>
  )
}

const TABS = ['Compliance Check', 'Custom Metadata', 'Agent Analysis']

export default function EventCard({ event, compact = false, animDelay = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [hovered, setHovered] = useState(false)

  const statusColor = STATUS_COLORS[event.status]

  return (
    <div
      data-inspector="EventCard"
      style={{
        background: hovered ? 'var(--bg-active)' : 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        animation: `msgIn 280ms cubic-bezier(0.22,1,0.36,1) ${animDelay}ms both`,
        transition: 'background 150ms ease',
      }}
      onClick={() => setExpanded(e => !e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Card skeleton ─────────────────────────────── */}
      <div style={{ padding: compact ? '10px 16px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Left: time + duration */}
          <div style={{ width: 68, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {formatTime(event.timestamp)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              {event.duration}
            </div>
          </div>

          {/* Center: status + agent + customer */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0, overflow: 'hidden' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              fontSize: 11, fontWeight: 600,
              padding: '2px 8px', borderRadius: 999,
              background: `${statusColor}18`,
              color: statusColor,
              border: `1px solid ${statusColor}40`,
              textTransform: 'capitalize',
              flexShrink: 0,
            }}>
              {event.status}
            </span>

            <span style={{
              fontSize: 12, color: 'var(--text-secondary)',
              background: 'var(--bg-active)', padding: '2px 8px',
              borderRadius: 6, flexShrink: 0,
            }}>
              {event.agent.name}
            </span>

            <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
              {event.customer.id}
            </span>

            <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
              · {event.customer.segment}
            </span>
          </div>

          {/* Right: quick actions on hover */}
          {hovered && <QuickActions />}
        </div>

        {/* Attribute badges — hidden in compact mode */}
        {!compact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {event.attributes.map(attr => (
              <AttributeBadge key={attr.key} attr={attr} />
            ))}
          </div>
        )}
      </div>

      {/* ── Expandable detail ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateRows: expanded ? '1fr' : '0fr',
        transition: 'grid-template-rows 300ms ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ borderTop: '1px solid var(--border-default)' }}>

            {/* Tab bar */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-default)',
              padding: '0 16px',
              background: 'var(--bg-card)',
            }}>
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={e => { e.stopPropagation(); setActiveTab(i) }}
                  style={{
                    padding: '10px 12px',
                    fontSize: 12,
                    fontWeight: activeTab === i ? 600 : 400,
                    color: activeTab === i ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === i ? '2px solid var(--color-brand)' : '2px solid transparent',
                    cursor: 'pointer',
                    marginBottom: -1,
                    transition: 'color 120ms ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab panel */}
            <div
              style={{ padding: '14px 16px', background: 'var(--bg-card)', minHeight: 80 }}
              onClick={e => e.stopPropagation()}
            >
              {activeTab === 0 && <CompliancePanel compliance={event.compliance} />}
              {activeTab === 1 && <MetadataPanel metadata={event.metadata} />}
              {activeTab === 2 && <AgentAnalysisPanel analysis={event.agentAnalysis} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
