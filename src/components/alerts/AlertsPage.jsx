import { useState } from 'react'

// ── Icons ──────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function BugIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 3V1M4.5 4.5L3 3M9.5 4.5L11 3M3 7H1M11 7h2M4.5 9.5L3 11M9.5 9.5L11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2 2h4M2 2v4M12 2H8M12 2v4M2 12h4M2 12v-4M12 12H8M12 12v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8"   r="1.2" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

// ── Mini sparkline ─────────────────────────────────────────────────────────────

function MiniSparkline({ data, color = 'var(--c100)' }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          width: 5,
          height: Math.max(2, (v / max) * 20),
          borderRadius: '2px 2px 0 0',
          background: color,
          opacity: v === 0 ? 0.25 : 0.65,
          flexShrink: 0,
        }} />
      ))}
    </div>
  )
}

// ── Stacked bar chart ─────────────────────────────────────────────────────────

const CHART_COLORS = ['#FDA4A4', '#FBBF8A', '#7DC4A8', '#93C5FD', '#A78BFA', '#FCD34D', '#86EFAC', '#F9A8D4']

function StackedBarChart({ monitors, weeks }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 16,
      height: 140, padding: '0 8px', width: '100%', justifyContent: 'center',
    }}>
      {weeks.map((wk, wi) => {
        const total = monitors.reduce((s, m) => s + (m.weekData[wi] || 0), 0)
        const maxTotal = Math.max(...weeks.map((_, i) => monitors.reduce((s, m) => s + (m.weekData[i] || 0), 0)), 1)
        const barH = Math.max(4, (total / maxTotal) * 120)
        return (
          <div key={wk} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', width: 44, height: barH, borderRadius: '4px 4px 0 0', overflow: 'hidden', gap: 1 }}>
              {monitors.map((m, mi) => {
                const segH = total > 0 ? ((m.weekData[wi] || 0) / total) * barH : 0
                return segH > 0 ? (
                  <div key={m.id} style={{ height: segH, background: CHART_COLORS[mi % CHART_COLORS.length], flexShrink: 0 }} />
                ) : null
              })}
            </div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>{wk}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MONITORS = [
  { id: '0c84c05e', name: 'Third Party',                                       totalAlerts: 247, last7days: 47, lastTriggered: 'Today, 16:21',  isActive: true,  createdBy: 'Anouk', weekData: [6,  60, 40, 22, 30] },
  { id: 'aef03144', name: 'Information Violation',                             totalAlerts: 25,  last7days: 8,  lastTriggered: 'Today, 14:58',  isActive: true,  createdBy: 'Yossi M.', weekData: [4, 14, 12, 6, 10] },
  { id: '5d8f3e7c', name: 'Interfering w/ KYC / Proof of Funds',              totalAlerts: 19,  last7days: 3,  lastTriggered: 'Jun 1, 19:57',  isActive: true,  createdBy: 'Anouk', weekData: [3, 10, 9, 5, 6]  },
  { id: 'dd1e4d67', name: 'Distressed Client',                                totalAlerts: 15,  last7days: 2,  lastTriggered: 'Jun 1, 20:37',  isActive: true,  createdBy: 'Anouk', weekData: [2, 8,  6, 3, 5]  },
  { id: '5d8f3eb2', name: 'Legal & Regulatory Violations',                    totalAlerts: 8,   last7days: 0,  lastTriggered: 'May 29, 20:19', isActive: true,  createdBy: 'Anouk', weekData: [1, 4,  3, 2, 2]  },
  { id: '5d8f3d61', name: 'Unprofessional Behavior',                          totalAlerts: 3,   last7days: 1,  lastTriggered: 'Jun 1, 20:37',  isActive: true,  createdBy: 'Anouk', weekData: [0, 2,  2, 1, 1]  },
  { id: '5d8f3eaf', name: 'Deposits/Withdrawals Recommendations',             totalAlerts: 2,   last7days: 0,  lastTriggered: 'Jun 1, 19:56',  isActive: true,  createdBy: 'Anouk', weekData: [0, 1,  1, 0, 1]  },
  { id: 'dd1e4d78', name: 'Investment Advice',                                totalAlerts: 0,   last7days: 0,  lastTriggered: null,            isActive: true,  createdBy: 'Anouk', weekData: [0, 0,  0, 0, 0]  },
  { id: 'd80be7d1', name: 'Loan Mentioned',                                   totalAlerts: 0,   last7days: 0,  lastTriggered: null,            isActive: true,  createdBy: 'Anouk', weekData: [0, 0,  0, 0, 0]  },
]

const WEEKS = ['Wk 20', 'Wk 21', 'Wk 22', 'Wk 23', 'Wk 24']

const QUICK_FILTERS = [
  { id: 'all',              label: 'All' },
  { id: 'active-only',      label: 'Active only' },
  { id: 'triggered-today',  label: 'Triggered today' },
  { id: 'never-triggered',  label: 'Never triggered' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function AlertsPage({ sidebarWidth = 272, sidebarTransition = 'none' }) {
  const [chartMode, setChartMode]         = useState('stacked')   // 'stacked' | 'compare'
  const [activeFilter, setActiveFilter]   = useState('all')
  const [selectedRows, setSelectedRows]   = useState(new Set())
  const [highlightedId, setHighlightedId] = useState(null)

  const filteredMonitors = MONITORS.filter(m => {
    if (activeFilter === 'active-only')     return m.isActive
    if (activeFilter === 'triggered-today') return m.lastTriggered?.startsWith('Today')
    if (activeFilter === 'never-triggered') return m.totalAlerts === 0
    return true
  })

  function toggleRow(id) {
    setSelectedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll(e) {
    setSelectedRows(e.target.checked ? new Set(filteredMonitors.map(m => m.id)) : new Set())
  }

  const allSelected = filteredMonitors.length > 0 && filteredMonitors.every(m => selectedRows.has(m.id))

  // ── shared vars ──
  const s = {
    position: 'fixed', top: 0,
    left: sidebarWidth, right: 0, bottom: 0,
    transition: sidebarTransition,
    overflow: 'auto',
    background: 'var(--bg-canvas)',
  }

  return (
    <div style={s}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Alerts</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'var(--bg-active)', color: 'var(--text-muted)',
              padding: '2px 8px', borderRadius: 99, border: '1px solid var(--border-default)',
            }}>
              {MONITORS.length} monitors
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 500, padding: '6px 12px',
              borderRadius: 8, border: '1px solid var(--border-default)',
              background: 'var(--bg-canvas)', color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <BugIcon /> Debug Query
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, padding: '6px 12px',
              borderRadius: 8, border: 'none',
              background: 'var(--c100)', color: '#fff', cursor: 'pointer',
            }}>
              <PlusIcon /> Create Alert
            </button>
          </div>
        </div>

        {/* ── Chart card ── */}
        <div style={{
          background: 'var(--bg-card, var(--bg-sidebar))',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Alert Volume
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* mode toggle */}
              <div style={{
                display: 'flex', background: 'var(--bg-active)', borderRadius: 7, padding: 3, gap: 2,
              }}>
                {[['stacked', 'Stacked total'], ['compare', 'Compare monitors']].map(([id, label]) => (
                  <button key={id} onClick={() => setChartMode(id)} style={{
                    fontSize: 11, fontWeight: 500,
                    padding: '4px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                    background: chartMode === id ? 'var(--bg-canvas)' : 'transparent',
                    color: chartMode === id ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: chartMode === id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 150ms',
                  }}>
                    {label}
                  </button>
                ))}
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 500, padding: '5px 9px',
                borderRadius: 7, border: '1px solid var(--border-default)',
                background: 'var(--bg-canvas)', color: 'var(--text-muted)', cursor: 'pointer',
              }}>
                <ExpandIcon /> Expand
              </button>
            </div>
          </div>
          <StackedBarChart monitors={filteredMonitors.length ? filteredMonitors : MONITORS} weeks={WEEKS} />
          <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', marginTop: 6, opacity: 0.6 }}>
            Click a row to highlight in chart
          </p>
        </div>

        {/* ── KPI strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { label: 'Total Monitors',  value: 9,   delta: '—',       dir: 'neutral' },
            { label: 'Total Alerts',    value: 319,  delta: '↓ 8%',   dir: 'down'    },
            { label: 'Active Monitors', value: 9,   delta: '↑ 2',     dir: 'up'      },
            { label: 'Unique Alerts',   value: 280,  delta: '↓ 5%',   dir: 'down'    },
          ].map(({ label, value, delta, dir }) => (
            <div key={label} style={{
              background: 'var(--bg-card, var(--bg-sidebar))',
              border: '1px solid var(--border-default)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 }}>
                {label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>
                {value}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 11, fontWeight: 600,
                padding: '2px 7px', borderRadius: 99,
                background: dir === 'up' ? '#EDFAF3' : dir === 'down' ? '#FFF0EE' : 'var(--bg-active)',
                color:      dir === 'up' ? '#1a8a4a' : dir === 'down' ? '#C4391A' : 'var(--text-muted)',
              }}>
                {delta} vs last period
              </span>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div style={{
          background: 'var(--bg-card, var(--bg-sidebar))',
          border: '1px solid var(--border-default)',
          borderRadius: 12, overflow: 'hidden',
        }}>

          {/* table toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--border-default)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {QUICK_FILTERS.map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                  fontSize: 11, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 99, cursor: 'pointer',
                  border: `1px solid ${activeFilter === f.id ? 'var(--text-primary)' : 'var(--border-default)'}`,
                  background: activeFilter === f.id ? 'var(--text-primary)' : 'var(--bg-canvas)',
                  color: activeFilter === f.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  transition: 'all 150ms',
                }}>
                  {f.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Sorted by alert count ↓
            </span>
          </div>

          {/* table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {[
                  <th key="cb" style={{ width: 36, padding: '8px 12px' }}>
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                  </th>,
                  <th key="num" style={thStyle}>#</th>,
                  <th key="name" style={{ ...thStyle, textAlign: 'left' }}>Name</th>,
                  <th key="total" style={thStyle}>Total Alerts</th>,
                  <th key="last7" style={thStyle}>Last 7 Days</th>,
                  <th key="triggered" style={thStyle}>Last Triggered</th>,
                  <th key="active" style={thStyle}>Is Active</th>,
                  <th key="created" style={thStyle}>Created By</th>,
                  <th key="actions" style={{ width: 36 }}></th>,
                ]}
              </tr>
            </thead>
            <tbody>
              {filteredMonitors.map((m, idx) => {
                const isSelected   = selectedRows.has(m.id)
                const isHighlighted = highlightedId === m.id
                const isInactive   = m.totalAlerts === 0
                const rowAlpha     = isInactive ? 0.45 : 1

                return (
                  <tr
                    key={m.id}
                    onClick={() => setHighlightedId(prev => prev === m.id ? null : m.id)}
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      opacity: rowAlpha,
                      background: isHighlighted ? 'var(--bg-active)' : isSelected ? 'var(--bg-active)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 120ms',
                    }}
                  >
                    {/* checkbox */}
                    <td style={{ padding: '10px 12px', width: 36 }} onClick={e => { e.stopPropagation(); toggleRow(m.id) }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(m.id)} style={{ cursor: 'pointer' }} />
                    </td>

                    {/* # */}
                    <td style={{ ...tdStyle, width: 28, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>
                      {idx + 1}
                    </td>

                    {/* name */}
                    <td style={{ ...tdStyle }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                          background: m.isActive && m.totalAlerts > 0 ? '#4BA373' : 'var(--border-default)',
                        }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{m.name}</span>
                      </div>
                    </td>

                    {/* total alerts + sparkline */}
                    <td style={{ ...tdStyle }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', minWidth: 24 }}>{m.totalAlerts}</span>
                        <MiniSparkline data={m.weekData} color={isInactive ? 'var(--border-default)' : 'var(--c100)'} />
                      </div>
                    </td>

                    {/* last 7 days */}
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {isInactive
                        ? <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Never triggered</span>
                        : `${m.last7days} this week`}
                    </td>

                    {/* last triggered */}
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {m.lastTriggered
                        ? m.lastTriggered
                        : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>}
                    </td>

                    {/* is active toggle */}
                    <td style={{ ...tdStyle }}>
                      <div style={{
                        width: 32, height: 18, borderRadius: 99,
                        background: m.isActive ? 'var(--b100, #1779F7)' : 'var(--border-default)',
                        cursor: 'pointer', transition: 'background 200ms',
                        position: 'relative', flexShrink: 0,
                      }}>
                        <div style={{
                          position: 'absolute', top: 3, left: m.isActive ? 14 : 3,
                          width: 12, height: 12, borderRadius: '50%', background: '#fff',
                          transition: 'left 200ms',
                        }} />
                      </div>
                    </td>

                    {/* created by */}
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          background: 'var(--bg-active)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)',
                        }}>
                          {m.createdBy.slice(0, 2).toUpperCase()}
                        </div>
                        {m.createdBy}
                      </div>
                    </td>

                    {/* actions */}
                    <td style={{ ...tdStyle, width: 36, color: 'var(--text-muted)' }} onClick={e => e.stopPropagation()}>
                      <MoreIcon />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* bulk action bar */}
          {selectedRows.size > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 18px',
              background: 'var(--text-primary)',
              borderTop: '1px solid var(--border-default)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-inverse)', opacity: 0.7 }}>
                {selectedRows.size} monitor{selectedRows.size > 1 ? 's' : ''} selected
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Activate', 'Deactivate'].map(label => (
                  <button key={label} style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: label === 'Activate' ? '#4BA373' : 'rgba(255,255,255,0.12)',
                    color: '#fff',
                  }}>
                    {label}
                  </button>
                ))}
                <button onClick={() => setSelectedRows(new Set())} style={{
                  fontSize: 11, fontWeight: 500,
                  padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'rgba(255,255,255,0.5)',
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Style constants ────────────────────────────────────────────────────────────

const thStyle = {
  fontSize: 10, fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: 'var(--text-muted)',
  padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '10px 12px',
  verticalAlign: 'middle',
}
