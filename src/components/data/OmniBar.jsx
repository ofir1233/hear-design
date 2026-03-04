import { useState, useRef, useEffect } from 'react'

function FilterToken({ filter, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 6px 3px 8px',
      background: `${filter.color}15`,
      border: `1px solid ${filter.color}40`,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-primary)',
      animation: 'slideInRight 200ms cubic-bezier(0.22,1,0.36,1) both',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: filter.color, flexShrink: 0,
        display: 'inline-block',
      }} />
      <span style={{ color: 'var(--text-secondary)' }}>{filter.key}:</span>
      <span>{filter.value}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '0 0 0 2px',
          display: 'flex', alignItems: 'center',
          fontSize: 15, lineHeight: 1,
          fontFamily: 'inherit',
        }}
      >×</button>
    </div>
  )
}

export default function OmniBar({ schema, filters, onFiltersChange, onRemoveFilter }) {
  const [inputValue, setInputValue]   = useState('')
  const [focused, setFocused]         = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const inputRef = useRef(null)

  // Build suggestions based on input content
  useEffect(() => {
    if (!focused || !inputValue.trim()) {
      setSuggestions([])
      return
    }

    if (selectedField) {
      // Show value suggestions for the chosen field
      const values = [...new Set(
        schema.events.flatMap(e =>
          e.attributes.filter(a => a.key === selectedField).map(a => a.value)
        )
      )]
      const query = inputValue.slice(selectedField.length + 2).toLowerCase()
      setSuggestions(
        values
          .filter(v => v.toLowerCase().includes(query))
          .map(v => {
            const color = schema.events
              .flatMap(e => e.attributes)
              .find(a => a.key === selectedField && a.value === v)?.color || '#606060'
            return { type: 'value', label: v, field: selectedField, color }
          })
      )
    } else {
      const query = inputValue.toLowerCase()
      setSuggestions(
        schema.filterFields
          .filter(f => f.toLowerCase().includes(query))
          .map(f => ({ type: 'field', label: f, color: '#606060' }))
      )
    }
  }, [inputValue, focused, schema, selectedField])

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const parts = inputValue.split(':')
      if (parts.length >= 2) {
        const key   = parts[0].trim()
        const value = parts.slice(1).join(':').trim()
        if (key && value) {
          const attr = schema.events.flatMap(ev => ev.attributes).find(a => a.key === key && a.value === value)
          const color = attr?.color || '#6E95A0'
          onFiltersChange(prev => [...prev, { key, value, color }])
          setInputValue('')
          setSelectedField(null)
          setSuggestions([])
        }
      } else if (inputValue.trim()) {
        onFiltersChange(prev => [...prev, { key: inputValue.trim(), value: 'any', color: '#6E95A0' }])
        setInputValue('')
        setSuggestions([])
      }
    } else if (e.key === 'Backspace' && inputValue === '' && filters.length > 0) {
      onFiltersChange(prev => prev.slice(0, -1))
    } else if (e.key === 'Escape') {
      setInputValue('')
      setSelectedField(null)
      setSuggestions([])
      inputRef.current?.blur()
    }
  }

  function selectSuggestion(sug) {
    if (sug.type === 'field') {
      setSelectedField(sug.label)
      setInputValue(`${sug.label}: `)
      setSuggestions([])
      inputRef.current?.focus()
    } else {
      onFiltersChange(prev => [...prev, { key: sug.field, value: sug.label, color: sug.color }])
      setInputValue('')
      setSelectedField(null)
      setSuggestions([])
      inputRef.current?.focus()
    }
  }

  return (
    <div
      data-inspector="OmniBar"
      style={{
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-canvas)',
        flexShrink: 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '10px 24px',
        minHeight: 48,
      }}>
        {/* Active filter tokens */}
        {filters.map((f, i) => (
          <FilterToken
            key={`${f.key}-${f.value}-${i}`}
            filter={f}
            onRemove={() => onRemoveFilter(i)}
          />
        ))}

        {/* Filter input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => {
              const v = e.target.value
              setInputValue(v)
              if (selectedField && !v.startsWith(`${selectedField}: `)) {
                setSelectedField(null)
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={filters.length === 0 ? 'Filter by field: value  (e.g. Risk: High)' : 'Add filter…'}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              minWidth: 200,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              zIndex: 300,
              overflow: 'hidden',
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={() => selectSuggestion(s)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 12px',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 100ms ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {s.type === 'value' ? (
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: s.color, flexShrink: 0, display: 'inline-block',
                    }} />
                  ) : (
                    <span style={{
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: 'var(--text-muted)',
                      flexShrink: 0,
                    }}>Field</span>
                  )}
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
