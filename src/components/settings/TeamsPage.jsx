import { useState } from 'react'
import Button from '../Button'

// ── Avatar helpers ───────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#1779F7', '#4BA373', '#FF7056', '#9B6DD6',
  '#6E95A0', '#FF8D78', '#D799E2', '#E2A919',
]
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length] }

function Avatar({ user, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: avatarColor(user.id),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff',
      fontFamily: "'Byrd', sans-serif", userSelect: 'none',
      border: '2px solid var(--bg-canvas)',
      boxSizing: 'border-box',
    }}>
      {user.initials}
    </div>
  )
}

// ── Mock data ────────────────────────────────────────────────────────────────────

const MOCK_TEAMS = [
  {
    id: 1,
    name: 'New Team - 2024-12-29',
    members: [
      { id: 1, name: 'Alan Watts',     initials: 'AW' },
      { id: 8, name: 'Yossi Marouani', initials: 'YM' },
      { id: 5, name: 'Marcus Webb',    initials: 'MW' },
      { id: 6, name: 'John Smith',     initials: 'JS' },
    ],
  },
  {
    id: 2,
    name: 'New Test Team',
    members: [
      { id: 3, name: 'Robert Chen', initials: 'RC' },
      { id: 4, name: 'Priya Nair',  initials: 'PN' },
    ],
  },
]

// ── Checkbox ─────────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `2px solid ${checked ? 'var(--b100)' : 'var(--border-input)'}`,
        background: checked ? 'var(--b100)' : 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 120ms ease, background 120ms ease',
        padding: 0,
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

// ── TeamsPage ────────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(new Set(MOCK_TEAMS.map(t => t.id)))

  const filtered = MOCK_TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const allSelected  = filtered.length > 0 && filtered.every(t => selected.has(t.id))
  const someSelected = filtered.some(t => selected.has(t.id))

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(t => n.delete(t.id)); return n })
    } else {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(t => n.add(t.id)); return n })
    }
  }

  function toggleOne(id) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const selectedCount = filtered.filter(t => selected.has(t.id)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="15" height="15" viewBox="0 0 15 15" fill="none"
        >
          <circle cx="6.5" cy="6.5" r="5" stroke="var(--text-muted)" strokeWidth="1.4"/>
          <path d="M10.5 10.5l2.5 2.5" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or agent code..."
          style={{
            width: '100%', boxSizing: 'border-box',
            height: 38, padding: '0 12px 0 36px',
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
            fontFamily: "'Byrd', sans-serif", outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--b100)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-input)' }}
        />
      </div>

      {/* Select All + team rows */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
        {/* Select All */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Checkbox checked={allSelected || someSelected} onChange={toggleAll} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Select All
            </span>
          </div>
          {/* Count badge */}
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: 'var(--b100)', color: '#fff', fontFamily: "'Byrd', sans-serif",
          }}>
            {selectedCount} / {filtered.length}
          </span>
        </div>

        {/* Team rows */}
        {filtered.map((team, i) => (
          <div
            key={team.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
              background: 'var(--bg-canvas)',
              cursor: 'pointer',
              transition: 'background 100ms ease',
            }}
            onClick={() => toggleOne(team.id)}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
          >
            <Checkbox checked={selected.has(team.id)} onChange={() => toggleOne(team.id)} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              {team.name}
            </span>
          </div>
        ))}
      </div>

      {/* Team detail cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filtered.map(team => (
          <div key={team.id}>
            {/* Team name + count */}
            <p style={{
              margin: '0 0 10px', fontSize: 14, fontWeight: 600,
              color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            }}>
              {team.name} ({team.members.length})
            </p>

            {/* Avatars + actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Stacked avatars */}
              <div style={{ display: 'flex' }}>
                {team.members.map((m, i) => (
                  <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                    <Avatar user={m} size={34} />
                  </div>
                ))}
              </div>

              {/* Manage + three-dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                >
                  Manage
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="2.5" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="7" cy="11.5" r="1.2"/></svg>}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
