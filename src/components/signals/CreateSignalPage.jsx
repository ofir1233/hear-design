import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PageHeader from '../PageHeader.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 2.5l7 4.5-7 4.5V2.5z" fill="currentColor" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.4l-6.2 4.5 2.4-7.2L2 9.2h7.6L12 2z" fill="currentColor" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7.5 6.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

function DragHandle() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
      <circle cx="4" cy="4"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="4"  r="1.2" fill="currentColor" />
      <circle cx="4" cy="8"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="8"  r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10.5 3.5l-.7 7a1 1 0 0 1-1 .9H4.2a1 1 0 0 1-1-.9l-.7-7"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C16.9705 21 21 16.9706 21 12C21 7.02944 16.9705 3 12 3C7.02941 3 2.99997 7.02944 2.99997 12M2.99997 12L6.49997 9.97927M2.99997 12L0.979248 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21C9.10067 21 6.52155 19.629 4.87555 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 8.5V13.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Design primitives ─────────────────────────────────────────────────────────

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}

function focusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e)  { e.currentTarget.style.borderColor = 'var(--border-input)' }

// ── Card wrapper ──────────────────────────────────────────────────────────────

function Card({ children }) {
  return (
    <div style={{
      background: 'var(--bg-sidebar)',
      border: '1px solid var(--border-default)',
      borderRadius: 16, padding: '18px 20px',
    }}>
      {children}
    </div>
  )
}

// ── Item row ──────────────────────────────────────────────────────────────────

const MODEL_OPTIONS = [
  'Milky-1-5',
  'internal:hear-base-7B-unified-3-1',
  'Yoko-1-mini',
  'Yoko-1',
  'internal:realtime-Yoko-1',
  'Llama-3.3-70B',
  'internal:realtime-yoko-mini',
  'Milkey-14-mini',
  'benchmark-2.0-f',
  'benchmark-2.0-fl',
  'benchmark-1.5-pro',
  'internal:system-14b-v1',
  'benchmark-1.5 (now 2)',
  'Tomy-1',
  'Tomy-Vanila',
]

const MODEL_HIGHLIGHTED = new Set(['Yoko-1-mini', 'Yoko-1', 'Llama-3.3-70B', 'Tomy-1', 'Tomy-Vanila'])

function ModelDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function toggle() {
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 6, right: window.innerWidth - r.right })
    setOpen(true)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 12px', flexShrink: 0,
          background: open ? 'rgba(215,153,226,0.20)' : 'rgba(215,153,226,0.12)',
          border: '1px solid rgba(215,153,226,0.30)',
          borderRadius: 20, cursor: 'pointer',
          fontSize: 12, fontWeight: 500, color: '#C178D4',
          fontFamily: "'Byrd', sans-serif",
          transition: 'background 130ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(215,153,226,0.20)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(215,153,226,0.12)' }}
      >
        <SparkleIcon />
        {value}
        <ChevronIcon open={open} />
      </button>

      {open && anchor && createPortal(
        <div ref={menuRef} className="thin-scroll" style={{
          position: 'fixed', top: anchor.top, right: anchor.right,
          minWidth: 240,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
          zIndex: 9999, padding: '6px 0',
          maxHeight: 340, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-default) transparent',
        }}>
          {MODEL_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13,
                color: MODEL_HIGHLIGHTED.has(opt) ? '#C178D4' : opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: opt === value ? 600 : 400,
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 100ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}

const TYPE_OPTIONS = ['String', 'Boolean', 'Number', 'List']

function TypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function toggle() {
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left, width: r.width })
    setOpen(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 34, padding: '0 10px',
          background: 'var(--bg-canvas)', border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 8, cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          transition: 'border-color 150ms ease',
          letterSpacing: '0.04em',
        }}
      >
        <span>{value.toUpperCase()}</span>
        <ChevronIcon open={open} />
      </button>

      {open && anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: anchor.top, left: anchor.left, width: anchor.width,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 9999, padding: '4px 0',
        }}>
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13,
                color: opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: opt === value ? 600 : 400,
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 100ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

function ItemRow({ label, onDelete, initialName = '', initialDesc = '' }) {
  const [open, setOpen] = useState(!!initialName)
  const [rowLabel, setRowLabel] = useState(label)
  const [itemName, setItemName] = useState(initialName)
  const [itemKey, setItemKey] = useState('')
  const [itemType, setItemType] = useState('String')
  const [itemDesc, setItemDesc] = useState(initialDesc)

  // Sync when parent updates initialName/initialDesc (e.g. after editSignal loads)
  useEffect(() => { if (initialName) { setItemName(initialName); setRowLabel(initialName) } }, [initialName])
  useEffect(() => { if (initialDesc) setItemDesc(initialDesc) }, [initialDesc])

  function handleNameChange(val) {
    setItemName(val)
    setRowLabel(val)  // keep header label in sync
  }

  return (
    <div style={{
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      background: 'var(--bg-canvas)',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', cursor: 'pointer',
        userSelect: 'none',
      }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: 'var(--text-muted)', cursor: 'grab', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <DragHandle />
        </span>
        <input
          value={rowLabel}
          onChange={e => setRowLabel(e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            background: 'none', border: 'none', outline: 'none',
            padding: '2px 4px', borderRadius: 4,
            cursor: 'text',
            transition: 'background 120ms ease',
          }}
          onFocus={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onBlur={e => { e.currentTarget.style.background = 'none' }}
        />
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', flexShrink: 0,
            transition: 'color 120ms ease, background 120ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#E53E3E'; e.currentTarget.style.background = 'rgba(229,62,62,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
        >
          <TrashIcon />
        </button>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <ChevronIcon open={open} />
        </span>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{
          borderTop: '1px solid var(--border-default)',
          padding: '14px 12px 16px',
          display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 12,
        }}>
          {/* Left: Name + Key + Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              value={itemName}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Name"
              style={{ ...inputBase, height: 34, padding: '0 10px', fontSize: 13 }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
            <input
              value={itemKey}
              onChange={e => setItemKey(e.target.value)}
              placeholder="Key"
              style={{ ...inputBase, height: 34, padding: '0 10px', fontSize: 13 }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
            <TypeDropdown value={itemType} onChange={setItemType} />
          </div>

          {/* Right: Description */}
          <textarea
            value={itemDesc}
            onChange={e => setItemDesc(e.target.value)}
            placeholder="Description Example : Sentiment of the call : Positive, Neutral, or Negative. Use 'Negative' if the customer is very unhappy, 'Neutral' if no emotions are expressed, and 'Positive' if the customer is happy."
            style={{
              ...inputBase, padding: '9px 11px',
              height: '100%', minHeight: 110,
              resize: 'vertical', lineHeight: 1.6,
            }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CreateSignalPage({ sidebarWidth = 0, sidebarTransition = 'left 280ms ease', editSignal = null, onBack }) {
  const isEditing = !!editSignal
  const [name, setName] = useState('')
  const [model, setModel] = useState('Yoko-1')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([{ id: 1, label: 'Item 1' }])
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    if (editSignal) {
      setName(editSignal.name ?? '')
      setDescription(editSignal.context ?? '')
      setItems([{ id: 1, label: editSignal.name, initialName: editSignal.name, initialDesc: editSignal.context }])
    }
  }, [editSignal])

  function addItem() {
    setItems(prev => [...prev, { id: nextId, label: `Item ${nextId}` }])
    setNextId(n => n + 1)
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  return (
    <div
      data-inspector="CreateSignalPage"
      style={{
        position: 'fixed', top: 0, left: sidebarWidth, right: 0, bottom: 0,
        transition: sidebarTransition,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        left={
          <>
            {/* Back button */}
            <button
              onClick={() => onBack ? onBack() : navigate('/signals')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 10px',
                background: 'none', border: '1px solid var(--border-default)',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, color: 'var(--text-secondary)',
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 130ms ease, color 130ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <BackIcon /> Signals
            </button>

            {/* Breadcrumb chevron */}
            <svg width="5" height="9" viewBox="0 0 5 9" fill="none" style={{ color: 'var(--text-muted)' }}>
              <path d="M1 1l3 3.5L1 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Title — editable name */}
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Signal name…"
              style={{
                fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif",
                background: 'none', border: 'none', outline: 'none',
                padding: '0 4px', borderRadius: 5,
                width: 200,
                transition: 'background 130ms ease',
              }}
              onFocus={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onBlur={e => { e.currentTarget.style.background = 'none' }}
            />
          </>
        }
        actions={
          <>
            {/* History */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 10px',
                background: 'none', border: 'none',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, color: 'var(--text-secondary)',
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 130ms ease, color 130ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <HistoryIcon /> History
            </button>

            {/* Import Configuration */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 12px',
                background: 'none', border: '1px solid var(--border-default)',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, color: 'var(--text-secondary)',
                fontFamily: "'Byrd', sans-serif",
                transition: 'background 130ms ease, color 130ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              Import Configuration
            </button>

            {/* Save */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 14px',
                background: 'var(--c100)', border: 'none',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, color: '#fff',
                fontFamily: "'Byrd', sans-serif",
                transition: 'opacity 130ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {isEditing ? 'Save Changes' : 'Save'}
            </button>
          </>
        }
      />

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Card 1: Signal name + model + description ───────────────────── */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Signal name…"
                  style={{
                    ...inputBase,
                    flex: 1,
                    height: 36, padding: '0 12px',
                    fontSize: 14, fontWeight: 500,
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />

                {/* Model selector dropdown */}
                <ModelDropdown value={model} onChange={setModel} />
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-default)' }} />

              {/* Description row */}
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Description / Context — describe what this signal should detect or analyze…"
                  rows={4}
                  style={{
                    ...inputBase, flex: 1, padding: '9px 11px',
                    height: 'auto', resize: 'vertical', lineHeight: 1.65,
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </div>
          </Card>

          {/* ── Items ──────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(it => (
              <ItemRow
                key={it.id}
                label={it.label}
                initialName={it.initialName ?? ''}
                initialDesc={it.initialDesc ?? ''}
                onDelete={() => deleteItem(it.id)}
              />
            ))}
          </div>

          {/* ── Add Item ───────────────────────────────────────────────────── */}
          <button
            onClick={addItem}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', height: 40,
              background: 'none', border: '1.5px dashed var(--border-default)',
              borderRadius: 10, cursor: 'pointer',
              fontSize: 13, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif",
              transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--c100)'
              e.currentTarget.style.color = 'var(--c100)'
              e.currentTarget.style.background = 'rgba(255,112,86,0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'none'
            }}
          >
            <PlusIcon /> Add Item
          </button>

        </div>
      </div>
    </div>
  )
}
