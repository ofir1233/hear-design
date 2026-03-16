import { useState } from 'react'

const OPERATORS = ['is', 'is not', 'contains', 'does not contain']

const EMPTY_ROW = () => ({ field: '', operator: 'is', value: '' })

export default function FilterDrawer({ open, onClose, schema, onApply }) {
  const [rows, setRows]   = useState([EMPTY_ROW()])
  const [logic, setLogic] = useState('AND')

  function addRow() {
    if (rows.length < 3) setRows(prev => [...prev, EMPTY_ROW()])
  }

  function updateRow(i, key, value) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: value } : r))
  }

  function removeRow(i) {
    if (rows.length > 1) setRows(prev => prev.filter((_, idx) => idx !== i))
  }

  function getValues(field) {
    return [...new Set(
      schema.events.flatMap(e =>
        e.attributes.filter(a => a.key === field).map(a => a.value)
      )
    )]
  }

  function handleApply() {
    const validRows = rows.filter(r => r.field && r.value)
    if (validRows.length === 0) return
    const newFilters = validRows.map(r => {
      const attr = schema.events.flatMap(e => e.attributes)
        .find(a => a.key === r.field && a.value === r.value)
      return { key: r.field, value: r.value, color: attr?.color || '#1779F7' }
    })
    onApply(newFilters)
    setRows([EMPTY_ROW()])
  }

  function handleReset() {
    setRows([EMPTY_ROW()])
  }

  const selectStyle = {
    width: '100%',
    padding: '7px 10px',
    fontSize: 13,
    background: 'var(--bg-canvas)',
    border: '1px solid var(--border-input)',
    borderRadius: 6,
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    appearance: 'auto',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 499,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
        }}
      />

      {/* Drawer panel */}
      <div
        data-inspector="FilterDrawer"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
          background: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border-default)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Advanced Filters
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 18, borderRadius: 6,
              transition: 'color 120ms ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >×</button>
        </div>

        {/* Filter rows */}
        <div className="smooth-scroll" style={{
          flex: 1, padding: '16px 20px',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {rows.map((row, i) => (
            <div key={i}>
              {/* Logic connector between rows */}
              {i > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <div style={{
                    display: 'flex', gap: 0,
                    border: '1px solid var(--border-default)',
                    borderRadius: 6, overflow: 'hidden',
                  }}>
                    {['AND', 'OR'].map(l => (
                      <button
                        key={l}
                        onClick={() => setLogic(l)}
                        style={{
                          padding: '4px 14px', fontSize: 11, fontWeight: 700,
                          letterSpacing: '0.06em', border: 'none', cursor: 'pointer',
                          background: logic === l ? 'var(--color-brand)' : 'transparent',
                          color: logic === l ? '#fff' : 'var(--text-muted)',
                          transition: 'background 120ms ease, color 120ms ease',
                          fontFamily: 'inherit',
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Row card */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                padding: 12, borderRadius: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                position: 'relative',
                marginBottom: i < rows.length - 1 ? 0 : 12,
              }}>
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(i)}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 20, height: 20,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: 16, borderRadius: 4,
                      fontFamily: 'inherit',
                    }}
                  >×</button>
                )}

                {/* Field */}
                <select
                  value={row.field}
                  onChange={e => updateRow(i, 'field', e.target.value)}
                  style={{ ...selectStyle, color: row.field ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  <option value="">Select field…</option>
                  {schema.filterFields.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>

                {/* Operator */}
                <select
                  value={row.operator}
                  onChange={e => updateRow(i, 'operator', e.target.value)}
                  style={selectStyle}
                >
                  {OPERATORS.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>

                {/* Value */}
                {row.field && getValues(row.field).length > 0 ? (
                  <select
                    value={row.value}
                    onChange={e => updateRow(i, 'value', e.target.value)}
                    style={{ ...selectStyle, color: row.value ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  >
                    <option value="">Select value…</option>
                    {getValues(row.field).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={row.value}
                    onChange={e => updateRow(i, 'value', e.target.value)}
                    placeholder="Enter value…"
                    style={{
                      width: '100%', padding: '7px 10px', fontSize: 13,
                      background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
                      borderRadius: 6, color: 'var(--text-primary)', outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Add condition */}
          {rows.length < 3 && (
            <button
              onClick={addRow}
              style={{
                width: '100%', padding: '8px', fontSize: 13,
                color: 'var(--text-muted)',
                background: 'transparent',
                border: '1px dashed var(--border-default)',
                borderRadius: 8, cursor: 'pointer',
                transition: 'border-color 120ms ease, color 120ms ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-input)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              + Add condition
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          display: 'flex', gap: 8,
          flexShrink: 0,
        }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1, padding: '9px', fontSize: 13, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)',
              transition: 'background 120ms ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 1, padding: '9px', fontSize: 13, fontWeight: 600,
              background: 'var(--color-brand)', border: 'none', borderRadius: 8,
              cursor: 'pointer', color: '#fff',
              transition: 'opacity 120ms ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}
