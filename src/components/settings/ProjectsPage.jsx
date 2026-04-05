import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from '../Button'

// ── Shared primitives ───────────────────────────────────────────────────────────

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  height: 36, padding: '0 12px',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}

function focusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e)  { e.currentTarget.style.borderColor = 'var(--border-input)' }

function ChevronIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Dropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
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
          width: '100%', height: 36, padding: '0 12px',
          background: 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 8, cursor: 'pointer',
          fontSize: 13, color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
          transition: 'border-color 150ms ease',
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronIcon open={open} />
      </button>

      {open && anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: anchor.top, left: anchor.left, width: anchor.width,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999, padding: '4px 0',
        }}>
          {options.map(opt => (
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

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5A1 1 0 004.7 12h4.6a1 1 0 001-.93L11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: checked ? 'var(--b100)' : 'var(--bg-active)',
        border: `1px solid ${checked ? 'var(--b100)' : 'var(--border-input)'}`,
        cursor: 'pointer', padding: 0, position: 'relative',
        transition: 'background 200ms ease, border-color 200ms ease',
        outline: 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 20 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: checked ? '#fff' : 'var(--text-muted)',
        transition: 'left 200ms ease, background 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

const AVATAR_COLORS = [
  '#1779F7', '#4BA373', '#FF7056', '#9B6DD6',
  '#6E95A0', '#FF8D78', '#D799E2', '#E2A919',
]

function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length] }

function UserAvatar({ user, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: avatarColor(user.id),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff',
      fontFamily: "'Byrd', sans-serif", userSelect: 'none',
    }}>
      {user.initials}
    </div>
  )
}

// ── Constants ───────────────────────────────────────────────────────────────────

const TIMEZONES = [
  'Asia/Jerusalem', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'UTC',
]

const LANGUAGES = ['English', 'Hebrew', 'Spanish', 'French', 'German', 'Arabic']

const DATA_TYPES = ['AUDIO', 'VIDEO', 'TEXT']

const CUSTOMER_ID_OPTIONS = ['caller_phone_number', 'agent_id', 'customer_email']

const PAGE_FILTER_TABS = ['Data Page', 'Agent Evaluation Page', 'Customers Page']

const PAGE_FILTER_FIELDS = {
  ROOT: ['_id', 'name', 'created_at', 'audio_length', 'processing_status', 'team'],
}

const FILTER_OPERATORS = ['is', 'is not', 'contains', 'does not contain', 'is empty', 'is not empty']

const METADATA_SUGGESTIONS = [
  { key: 'dispatcher_code',          sample: '188223'      },
  { key: 'dispatcher_name',          sample: 'Voice Mail'  },
  { key: 'call_type_label',          sample: 'Disposition' },
  { key: 'audio_length_in_minutes',  sample: '0.7'         },
]

const ALL_ORG_MEMBERS = [
  { id: 1,  name: 'Alan Watts',     email: 'alan@hear.ai',   initials: 'AW' },
  { id: 2,  name: 'Sarah Chen',     email: 'sarah@hear.ai',  initials: 'SC' },
  { id: 3,  name: 'Robert Chen',    email: 'robert@hear.ai', initials: 'RC' },
  { id: 4,  name: 'Priya Nair',     email: 'priya@hear.ai',  initials: 'PN' },
  { id: 5,  name: 'Marcus Webb',    email: 'marcus@hear.ai', initials: 'MW' },
  { id: 6,  name: 'John Smith',     email: 'john@hear.ai',   initials: 'JS' },
  { id: 7,  name: 'Lisa Chen',      email: 'lisa@hear.ai',   initials: 'LC' },
  { id: 8,  name: 'Yossi Marouani', email: 'yossi@hear.ai',  initials: 'YM' },
  { id: 9,  name: 'Noam Fine',      email: 'noam@hear.ai',   initials: 'NF' },
  { id: 10, name: 'Tyron James',    email: 'tyron@hear.ai',  initials: 'TJ' },
]

// ── Mock project data ───────────────────────────────────────────────────────────

export const PROJECT_NAMES = ['Old Brett Robinson Sales', 'New Acme Corp', 'TechCorp Support']

const INITIAL_PROJECT_STATE = {
  'Old Brett Robinson Sales': {
    name: 'Old Brett Robinson Sales',
    about: 'Sales call recordings for the Brett Robinson automotive group.',
    timezone: 'America/New_York',
    language: 'English',
    members: [
      { id: 1,  name: 'Alan Watts',  email: 'alan@hear.ai',  initials: 'AW' },
      { id: 6,  name: 'John Smith',  email: 'john@hear.ai',  initials: 'JS' },
      { id: 10, name: 'Tyron James', email: 'tyron@hear.ai', initials: 'TJ' },
    ],
    metadataFields: [
      { id: 1, name: 'Agent Name',          key: 'agent_name',          type: 'Text',   required: true,  description: 'The full name of the agent who handled the call.' },
      { id: 2, name: 'Agent ID',            key: 'agent_id',            type: 'Text',   required: true,  description: 'Unique identifier for the agent.' },
      { id: 3, name: 'Call Date & Time',    key: 'call_date',           type: 'Date',   required: true,  description: 'The date and time the call took place.' },
      { id: 4, name: 'Caller Phone Number', key: 'caller_phone_number', type: 'Text',   required: false, description: 'The phone number of the caller.' },
      { id: 5, name: 'Call Department',     key: 'call_department',     type: 'Text',   required: false, description: 'Department handling the call (e.g. Sales, Service).' },
      { id: 6, name: 'Call Type',           key: 'call_type',           type: 'Text',   required: false, description: 'Classification of the call type.' },
    ],
    dataType: 'AUDIO',
    minCallDuration: 30,
    customerId: 'caller_phone_number',
    teams: ['Sales Team', 'QA Team'],
    anonymizer: false,
  },
  'New Acme Corp': {
    name: 'New Acme Corp',
    about: 'Support and onboarding calls for Acme Corporation.',
    timezone: 'America/Los_Angeles',
    language: 'English',
    members: [
      { id: 2, name: 'Sarah Chen',  email: 'sarah@hear.ai',  initials: 'SC' },
      { id: 4, name: 'Priya Nair',  email: 'priya@hear.ai',  initials: 'PN' },
      { id: 7, name: 'Lisa Chen',   email: 'lisa@hear.ai',   initials: 'LC' },
    ],
    metadataFields: [
      { id: 1, name: 'Agent Name',       key: 'agent_name',    type: 'Text', required: true,  description: 'The full name of the agent.' },
      { id: 2, name: 'Call Date & Time', key: 'call_date',     type: 'Date', required: true,  description: 'Date and time of the call.' },
      { id: 3, name: 'Customer ID',      key: 'customer_id',   type: 'Text', required: true,  description: 'Unique customer identifier.' },
      { id: 4, name: 'Call Topic',       key: 'call_topic',    type: 'Text', required: false, description: 'Main topic discussed in the call.' },
    ],
    dataType: 'AUDIO',
    minCallDuration: 60,
    customerId: 'agent_id',
    teams: ['Support Team'],
    anonymizer: true,
  },
  'TechCorp Support': {
    name: 'TechCorp Support',
    about: 'Technical support recordings for TechCorp enterprise clients.',
    timezone: 'Europe/London',
    language: 'English',
    members: [
      { id: 3, name: 'Robert Chen',    email: 'robert@hear.ai', initials: 'RC' },
      { id: 5, name: 'Marcus Webb',    email: 'marcus@hear.ai', initials: 'MW' },
      { id: 9, name: 'Noam Fine',      email: 'noam@hear.ai',   initials: 'NF' },
    ],
    metadataFields: [
      { id: 1, name: 'Agent Name',    key: 'agent_name',    type: 'Text',   required: true,  description: 'The full name of the agent.' },
      { id: 2, name: 'Agent ID',      key: 'agent_id',      type: 'Text',   required: true,  description: 'Unique identifier for the agent.' },
      { id: 3, name: 'Ticket Number', key: 'ticket_number', type: 'Number', required: true,  description: 'Support ticket number associated with the call.' },
      { id: 4, name: 'Product',       key: 'product',       type: 'Text',   required: false, description: 'Product the call is related to.' },
    ],
    dataType: 'VIDEO',
    minCallDuration: 45,
    customerId: 'customer_email',
    teams: ['Tech Support', 'Enterprise QA'],
    anonymizer: false,
  },
}

// ── Divider ─────────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />
}

// ── SectionHeader ───────────────────────────────────────────────────────────────

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

// ── ProjectAccess ───────────────────────────────────────────────────────────────

function ProjectAccess() {
  const [selectedMember, setSelectedMember] = useState(ALL_ORG_MEMBERS[0].email)

  const availableEmails = ALL_ORG_MEMBERS.map(m => m.email)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Project Access"
        subtitle="Control which organization members can access this project."
      />

      {/* Add user row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Dropdown value={selectedMember} options={availableEmails} onChange={setSelectedMember} />
        </div>
        <Button variant="primary" size="sm">Add User</Button>
      </div>
    </div>
  )
}

// ── MetadataSection ─────────────────────────────────────────────────────────────

const FIELD_TYPES = ['Text', 'Number', 'Date', 'Boolean']

let metaNextId = 200

// Compact type dropdown — sits inline inside the table row
function TypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function outside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [open])

  function toggle() {
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, left: r.left })
    setOpen(true)
  }

  const typeColor = { Text: 'var(--b100)', Number: 'var(--g100)', Date: 'var(--l100)', Boolean: 'var(--s100)' }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 28, padding: '0 8px',
          background: open ? 'var(--bg-active)' : 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--b100)' : 'var(--border-input)'}`,
          borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
          fontSize: 11, fontWeight: 600, fontFamily: "'Byrd', sans-serif",
          color: typeColor[value] ?? 'var(--text-secondary)',
          transition: 'border-color 150ms ease, background 150ms ease',
        }}
      >
        {value}
        <ChevronIcon open={open} />
      </button>
      {open && anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: anchor.top, left: anchor.left,
          minWidth: 110,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          zIndex: 9999, padding: '4px 0',
        }}>
          {FIELD_TYPES.map(t => (
            <button key={t} onClick={() => { onChange(t); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '7px 12px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Byrd', sans-serif",
              transition: 'background 100ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <span style={{ fontSize: 12, fontWeight: t === value ? 700 : 500, color: typeColor[t] }}>{t}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

function toSnakeCase(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
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

function MetaFieldRow({ field, onDelete, onChange }) {
  const [open, setOpen] = useState(!field.name) // auto-open new empty fields

  function update(prop, val) {
    const updated = { ...field, [prop]: val }
    if (prop === 'name' && field.key === toSnakeCase(field.name)) {
      updated.key = toSnakeCase(val)
    }
    onChange(updated)
  }

  return (
    <div style={{
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      background: 'var(--bg-canvas)',
    }}>
      {/* Header row — matches ItemRow from CreateSignalPage */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: 'var(--text-muted)', cursor: 'grab', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <DragHandle />
        </span>

        <input
          value={field.name}
          onChange={e => update('name', e.target.value)}
          onClick={e => e.stopPropagation()}
          placeholder="Field name…"
          style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            background: 'none', border: 'none', outline: 'none',
            padding: '2px 4px', borderRadius: 4, cursor: 'text',
            transition: 'background 120ms ease',
          }}
          onFocus={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onBlur={e => { e.currentTarget.style.background = 'none' }}
        />

        {/* Required toggle */}
        <button
          onClick={e => { e.stopPropagation(); update('required', !field.required) }}
          title={field.required ? 'Required' : 'Optional'}
          style={{
            width: 36, height: 20, borderRadius: 10, border: 'none', flexShrink: 0,
            background: field.required ? 'var(--b100)' : 'var(--bg-active)',
            cursor: 'pointer', padding: 0, position: 'relative',
            transition: 'background 200ms ease', outline: 'none',
          }}
        >
          <span style={{
            position: 'absolute', top: 3,
            left: field.required ? 18 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: field.required ? '#fff' : 'var(--text-muted)',
            transition: 'left 200ms ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>

        <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); onDelete() }} leftIcon={<TrashIcon />} />

        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <ChevronIcon open={open} />
        </span>
      </div>

      {/* Expanded body — matches ItemRow layout exactly */}
      {open && (
        <div style={{
          borderTop: '1px solid var(--border-default)',
          padding: '14px 12px 16px',
          display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 12,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              value={field.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Name"
              style={{ ...inputBase, height: 34, padding: '0 10px', fontSize: 13 }}
              onFocus={focusBorder} onBlur={blurBorder}
            />
            <input
              value={field.key}
              onChange={e => update('key', e.target.value)}
              placeholder="Key (snake_case)"
              style={{ ...inputBase, height: 34, padding: '0 10px', fontSize: 13, fontFamily: 'monospace' }}
              onFocus={focusBorder} onBlur={blurBorder}
            />
            <TypeDropdown value={field.type} onChange={val => update('type', val)} />
          </div>
          <textarea
            value={field.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Description — e.g. 'Sentiment of the call: Positive, Neutral, or Negative.'"
            style={{
              ...inputBase, padding: '9px 11px',
              height: '100%', minHeight: 110,
              resize: 'vertical', lineHeight: 1.6,
            }}
            onFocus={focusBorder} onBlur={blurBorder}
          />
        </div>
      )}
    </div>
  )
}

function MetadataSection({ fields, setFields }) {
  function removeField(id) { setFields(prev => prev.filter(f => f.id !== id)) }
  function changeField(id, updated) { setFields(prev => prev.map(f => f.id === id ? updated : f)) }

  function addField() {
    setFields(prev => [...prev, { id: ++metaNextId, name: '', key: '', type: 'Text', required: false, description: '' }])
  }

  function addSuggestion(sugKey) {
    if (fields.some(f => f.key === sugKey)) return
    setFields(prev => [...prev, { id: ++metaNextId, name: sugKey, key: sugKey, type: 'Text', required: false, description: '' }])
  }

  const alreadyAdded = sugKey => fields.some(f => f.key === sugKey)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Metadata"
        subtitle="Define custom fields required when uploading files to this project."
      />

      {/* Field rows — same pattern as ItemRow in CreateSignalPage */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fields.map(field => (
          <MetaFieldRow
            key={field.id}
            field={field}
            onDelete={() => removeField(field.id)}
            onChange={updated => changeField(field.id, updated)}
          />
        ))}

        {/* Add Field button */}
        <button
          onClick={addField}
          style={{
            width: '100%', height: 36, boxSizing: 'border-box',
            background: 'none', border: '1.5px dashed var(--border-input)',
            borderRadius: 10, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: 'var(--b100)',
            fontFamily: "'Byrd', sans-serif",
            transition: 'border-color 150ms ease, background 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b100)'; e.currentTarget.style.background = 'rgba(23,121,247,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-input)'; e.currentTarget.style.background = 'none' }}
        >
          + Add Field
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Suggestions
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {METADATA_SUGGESTIONS.map(({ key, sample }) => {
            const added = alreadyAdded(key)
            return (
              <button
                key={key}
                onClick={() => addSuggestion(key)}
                disabled={added}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: '1px solid var(--border-input)',
                  borderRadius: 7, background: added ? 'var(--bg-active)' : 'var(--bg-canvas)',
                  overflow: 'hidden', cursor: added ? 'default' : 'pointer',
                  fontFamily: "'Byrd', sans-serif", padding: 0,
                  opacity: added ? 0.55 : 1,
                  transition: 'opacity 150ms ease',
                }}
              >
                <span style={{ padding: '4px 8px', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{key}</span>
                <span style={{ padding: '4px 8px', fontSize: 12, color: 'var(--text-muted)', borderLeft: '1px solid var(--border-default)' }}>{sample}</span>
                <span style={{ padding: '4px 7px', fontSize: 13, fontWeight: 600, color: added ? 'var(--text-muted)' : 'var(--b100)', borderLeft: '1px solid var(--border-default)' }}>
                  {added ? '✓' : '+'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── DefaultsSection ─────────────────────────────────────────────────────────────

function DefaultsSection({ dataType, setDataType, minCallDuration, setMinCallDuration, customerId, setCustomerId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Defaults"
        subtitle="Manage default settings for this project."
      />

      <Field label="Data Type">
        <Dropdown value={dataType} options={DATA_TYPES} onChange={setDataType} />
      </Field>

      <Field label="Min Call Duration (seconds)">
        <input
          type="number"
          value={minCallDuration}
          onChange={e => setMinCallDuration(e.target.value)}
          style={inputBase}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </Field>

      <Field label="Customer ID">
        <Dropdown value={customerId} options={CUSTOMER_ID_OPTIONS} onChange={setCustomerId} />
      </Field>
    </div>
  )
}

// ── PageDefaultFilters ──────────────────────────────────────────────────────────

let filterNextId = 1

function PageDefaultFilters() {
  const [activeTab, setActiveTab] = useState('Data Page')
  const [filtersByTab, setFiltersByTab] = useState(
    Object.fromEntries(PAGE_FILTER_TABS.map(t => [t, []]))
  )

  function addFilter(tab) {
    const id = filterNextId++
    setFiltersByTab(prev => ({
      ...prev,
      [tab]: [...prev[tab], { id, field: '', operator: '', value: '' }],
    }))
  }

  function removeFilter(tab, id) {
    setFiltersByTab(prev => ({
      ...prev,
      [tab]: prev[tab].filter(f => f.id !== id),
    }))
  }

  function updateFilter(tab, id, key, val) {
    setFiltersByTab(prev => ({
      ...prev,
      [tab]: prev[tab].map(f => f.id === id ? { ...f, [key]: val } : f),
    }))
  }

  const filters = filtersByTab[activeTab]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Page Default Filters" />

      {/* Underline tab bar */}
      <div style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {PAGE_FILTER_TABS.map(tab => {
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

      {/* Filter list or empty state */}
      {filters.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          No default filters. Add one to pre-filter this page on load.
        </p>
      ) : (
        <div style={{
          border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden',
        }}>
          {filters.map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px',
                borderTop: i > 0 ? '1px solid var(--border-default)' : 'none',
                background: 'var(--bg-canvas)',
              }}
            >
              {/* WHERE / AND connector label */}
              <span style={{
                width: 36, flexShrink: 0, textAlign: 'right', marginRight: 8,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
                textTransform: 'uppercase',
              }}>
                {i === 0 ? 'Where' : 'And'}
              </span>

              {/* Field */}
              <div style={{ width: 160, flexShrink: 0 }}>
                <Dropdown
                  value={f.field}
                  placeholder="Select field"
                  options={PAGE_FILTER_FIELDS.ROOT}
                  onChange={val => updateFilter(activeTab, f.id, 'field', val)}
                />
              </div>

              {/* Operator */}
              <div style={{ width: 140, flexShrink: 0, opacity: f.field ? 1 : 0.4, pointerEvents: f.field ? 'auto' : 'none' }}>
                <Dropdown
                  value={f.operator}
                  placeholder="is"
                  options={FILTER_OPERATORS}
                  onChange={val => updateFilter(activeTab, f.id, 'operator', val)}
                />
              </div>

              {/* Value */}
              <input
                value={f.value}
                onChange={e => updateFilter(activeTab, f.id, 'value', e.target.value)}
                placeholder="Value"
                style={{ ...inputBase, flex: 1 }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />

              {/* Remove */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(activeTab, f.id)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Footer: + Add Filter + Save */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button variant="ghost" size="sm" onClick={() => addFilter(activeTab)}>
          + Add Filter
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </div>
    </div>
  )
}

// ── TeamsSection ────────────────────────────────────────────────────────────────

function TeamsSection({ teams, setTeams }) {
  const [teamInput, setTeamInput] = useState('')

  function addTeam() {
    const name = teamInput.trim()
    if (!name || teams.includes(name)) return
    setTeams(prev => [...prev, name])
    setTeamInput('')
  }

  function removeTeam(name) {
    setTeams(prev => prev.filter(t => t !== name))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Teams"
        subtitle="Manage teams assigned to this project."
      />

      {/* Add team row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={teamInput}
          onChange={e => setTeamInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addTeam() }}
          placeholder="Team name…"
          style={{ ...inputBase, flex: 1 }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <Button variant="secondary" size="sm" onClick={addTeam}>+</Button>
      </div>

      {/* Team pills */}
      {teams.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {teams.map(team => (
            <div
              key={team}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px 4px 12px',
                background: 'var(--bg-active)', border: '1px solid var(--border-default)',
                borderRadius: 20,
                fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif",
              }}
            >
              {team}
              <button
                onClick={() => removeTeam(team)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  padding: 0, fontSize: 14, lineHeight: 1,
                  transition: 'color 120ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--c100)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── SecuritySection ─────────────────────────────────────────────────────────────

function SecuritySection({ anonymizer, setAnonymizer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Security"
        subtitle="Manage project security settings."
      />

      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'var(--bg-canvas)',
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Anonymizer
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
              Removes personal identification data (PPI) from recordings
            </p>
          </div>
          <Toggle checked={anonymizer} onChange={setAnonymizer} />
        </div>
      </div>
    </div>
  )
}

// ── ProjectsPage ────────────────────────────────────────────────────────────────

export default function ProjectsPage({ selectedProject, onProjectChange }) {
  const [localProject, setLocalProject] = useState(PROJECT_NAMES[0])
  const selected = selectedProject ?? localProject
  const setSelected = onProjectChange ?? setLocalProject

  // Per-project state stored as a map
  const [projectData, setProjectData] = useState(() => {
    const data = {}
    PROJECT_NAMES.forEach(name => {
      data[name] = { ...INITIAL_PROJECT_STATE[name] }
    })
    return data
  })

  const p = projectData[selected]

  function update(field, value) {
    setProjectData(prev => ({
      ...prev,
      [selected]: { ...prev[selected], [field]: value },
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Project Basics */}
      <Field label="Project Name">
        <input
          value={p.name}
          onChange={e => update('name', e.target.value)}
          style={inputBase}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </Field>

      <Field label="About the project">
        <textarea
          value={p.about}
          onChange={e => update('about', e.target.value)}
          placeholder="Describe this project…"
          rows={4}
          style={{ ...inputBase, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.6 }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </Field>

      <Field label="Timezone">
        <Dropdown value={p.timezone} options={TIMEZONES} onChange={v => update('timezone', v)} />
      </Field>

      <Field label="Language">
        <Dropdown value={p.language} options={LANGUAGES} onChange={v => update('language', v)} />
      </Field>

      <Divider />

      {/* Project Access */}
      <ProjectAccess />

      <Divider />

      {/* Metadata */}
      <MetadataSection
        fields={p.metadataFields}
        setFields={v => update('metadataFields', typeof v === 'function' ? v(p.metadataFields) : v)}
      />

      <Divider />

      {/* Defaults */}
      <DefaultsSection
        dataType={p.dataType}
        setDataType={v => update('dataType', v)}
        minCallDuration={p.minCallDuration}
        setMinCallDuration={v => update('minCallDuration', v)}
        customerId={p.customerId}
        setCustomerId={v => update('customerId', v)}
      />

      <Divider />

      {/* Page Default Filters */}
      <PageDefaultFilters key={selected} />

      <Divider />

      {/* Teams */}
      <TeamsSection
        teams={p.teams}
        setTeams={v => update('teams', typeof v === 'function' ? v(p.teams) : v)}
      />

      <Divider />

      {/* Security */}
      <SecuritySection
        anonymizer={p.anonymizer}
        setAnonymizer={v => update('anonymizer', v)}
      />

    </div>
  )
}
