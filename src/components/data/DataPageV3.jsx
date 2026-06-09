import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'

// ── AG Grid themes (v33+ theming API) ─────────────────────────────────────────
const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 13,
  cellHorizontalPaddingScale: 1.1,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#F5F5F3',
  foregroundColor:            '#181818',
  headerBackgroundColor:      '#F5F5F3',
  headerTextColor:            '#606060',
  borderColor:                '#E5E7EB',
  rowHoverColor:              '#E8E8E6',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:      '#F5F5F3',
  headerColumnResizeHandleColor: '#D1D5DB',
})
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#242424',
  foregroundColor:            '#F4F3F1',
  headerBackgroundColor:      '#181818',
  headerTextColor:            '#9B9B9B',
  borderColor:                '#333333',
  rowHoverColor:              '#2A2A2A',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.12)',
  oddRowBackgroundColor:      '#242424',
  headerColumnResizeHandleColor: '#444444',
})
import { SCHEMAS, generateRows, generateCompanyRows } from './mockData.js'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Modal from '../Modal.jsx'

ModuleRegistry.registerModules([AllCommunityModule])

// ── Filter data ───────────────────────────────────────────────────────────────

const FILTER_FIELDS = [
  { value: 'id',            label: 'ID' },
  { value: 'callDate',      label: 'Call Date' },
  { value: 'proposedPrice', label: 'Proposed Price' },
  { value: 'destination',   label: 'Destination' },
  { value: 'summary',       label: 'Summary' },
  { value: 'status',        label: 'Status' },
  { value: 'priority',      label: 'Priority' },
  { value: 'assignedTo',    label: 'Assigned To' },
]

const OPERATORS = [
  { value: 'contains',     label: 'Contains' },
  { value: 'not_contains', label: 'Not contains' },
  { value: 'equals',       label: 'Equals' },
  { value: 'not_equal',    label: 'Not equal' },
]

// Date columns get date-specific conditions + a date picker (single or range)
const DATE_FIELDS = new Set(['callDate'])
const isDateField = field => DATE_FIELDS.has(field)
const DATE_OPERATORS = [
  { value: 'on',      label: 'On' },
  { value: 'before',  label: 'Before' },
  { value: 'after',   label: 'After' },
  { value: 'between', label: 'Between' },
]
const DATE_OP_VALUES = new Set(DATE_OPERATORS.map(o => o.value))
const DATE_OP_WORD = { on: 'on', before: 'before', after: 'after', between: 'between' }

// Human-readable value for a chip (formats dates / ranges nicely)
function chipValueLabel(chip) {
  if (!isDateField(chip.field)) return chip.value
  if (chip.operator === 'between') {
    const [a, b] = (chip.value || '').split('..')
    return `${fmtDate(a)} – ${fmtDate(b)}`
  }
  return fmtDate(chip.value)
}

// Each preset is a saved view: which columns are selected + the filters applied.
// Columns reference the shared COLUMN_GROUPS taxonomy; filters on signal columns are UI-level.
const PRESETS = [
  { id: 'agent_v1', label: 'Agent evaluation V1',
    columns: ['id', 'callDate', 'status', 'priority', 'Agent Full Name', 'Team Language', 'Sentiment Score', 'Talk Ratio'],
    filters: [
      { field: 'status',         operator: 'equals', value: 'IN PROGRESS' },
      { field: 'priority',       operator: 'equals', value: 'HIGH' },
      { field: 'Team Language',  operator: 'equals', value: 'English' },
      { field: 'Sentiment Score', operator: 'equals', value: 'Positive' },
      { field: 'Talk Ratio',     operator: 'equals', value: 'Balanced' },
    ]},
  { id: 'high_priority', label: 'High Priority',
    columns: ['id', 'callDate', 'destination', 'status', 'priority', 'assignedTo'],
    filters: [
      { field: 'priority', operator: 'equals',    value: 'HIGH' },
      { field: 'status',   operator: 'not_equal', value: 'DONE' },
    ]},
  { id: 'done_only', label: 'Done',
    columns: ['id', 'callDate', 'proposedPrice', 'summary', 'status', 'priority', 'assignedTo'],
    filters: [{ field: 'status', operator: 'equals', value: 'DONE' }] },
  { id: 'alerts', label: 'Alerts Only',
    columns: ['id', 'callDate', 'status', 'Investment Advice', 'Legal Regulatory Violations', 'Information Violation', 'Loan Mentioned'],
    filters: [
      { field: 'status',                       operator: 'equals', value: 'IN PROGRESS' },
      { field: 'Investment Advice',            operator: 'equals', value: 'Yes' },
      { field: 'Legal Regulatory Violations',  operator: 'equals', value: 'Yes' },
      { field: 'Information Violation',         operator: 'equals', value: 'Yes' },
    ]},
]

// One shared column taxonomy — drives BOTH the Columns tab and the Filters column picker.
// Core fields (Call Details / Financial / Status & Priority / Assignment) map to real row data;
// signal/metadata columns are listed for parity but don't narrow the demo rows.
const COLUMN_GROUPS = [
  { id: 'call',       label: 'Call Details',     section: 'signals',    fields: ['id', 'callDate', 'destination', 'summary'] },
  { id: 'financial',  label: 'Financial',         section: 'signals',    fields: ['proposedPrice'] },
  { id: 'classify',   label: 'Status & Priority', section: 'signals',    fields: ['status', 'priority'] },
  { id: 'assignment', label: 'Assignment',        section: 'signals',    fields: ['assignedTo'] },
  { id: 'metadata',   label: 'Metadata',          section: 'additional', fields: [
    'User Id', 'Lead Id', 'Call Start Time', 'Extension', 'Voipcentral', 'Call Direction Name',
    'Agent Id', 'Agent Full Name', 'Label Name', 'Team Language', 'Agent Name',
    'Call Duration Formatted', 'Audio Length In Minutes', 'Agent Office Name',
  ]},
  { id: 'alerts',     label: 'Alerts',            section: 'additional', fields: [
    'Investment Advice', 'Distressed Client', 'Unprofessional Behavior',
    'Interfering With Or Downplaying KYC Registration Or Proof Of Funds',
    'Deposits Withdrawals Recommendations', 'Legal Regulatory Violations',
    'Third Party', 'Information Violation', 'Loan Mentioned',
  ]},
  { id: 'dynamic',    label: 'Dynamic Metrics',   section: 'additional', fields: ['Sentiment Score', 'Talk Ratio', 'Silence Rate', 'Interruptions', 'Energy Level'] },
  { id: 'workflows',  label: 'Workflows',         section: 'additional', fields: ['Lead Qualification', 'Discovery Call', 'Demo Flow', 'Closing Sequence'] },
]

const COLUMN_SECTIONS = [
  { key: 'signals',    label: 'Signals' },
  { key: 'additional', label: 'Additional Columns' },
]

// Resolve a column key to a human label (core fields have nice labels in FILTER_FIELDS)
function colLabel(key) {
  return FILTER_FIELDS.find(f => f.value === key)?.label ?? key
}

let _chipId = 1

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FunnelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 2.5h11l-4.5 5.5V12l-2-1V8L1.5 2.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="8"    r="1.2" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDown({ open }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
      style={{ flexShrink: 0, transition: 'transform 160ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Custom styled preset dropdown ─────────────────────────────────────────────

function PresetSelect({ options, value, onChange, fullWidth }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, width: fullWidth ? '100%' : undefined }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 30, padding: '0 10px',
          background: open ? 'var(--bg-active)' : 'var(--bg-canvas)',
          border: `1px solid ${open ? 'var(--border-default)' : 'var(--border-input)'}`,
          borderRadius: 6,
          fontSize: 'var(--type-p14)', color: open ? 'var(--text-primary)' : selected?.value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif",
          cursor: 'pointer', whiteSpace: 'nowrap',
          width: fullWidth ? '100%' : undefined,
          minWidth: fullWidth ? undefined : 100,
          boxSizing: 'border-box',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{selected?.label ?? 'None'}</span>
        <ChevronDown open={open} />
      </button>

      <div style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        zIndex: 600,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        minWidth: '100%',
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 130ms ease, transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {options.map(opt => {
          const isActive = opt.value === value
          return (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                padding: '8px 12px',
                fontSize: 'var(--type-p14)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Byrd', sans-serif",
                cursor: 'pointer',
                background: isActive ? 'var(--bg-active)' : 'transparent',
                transition: 'background 120ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-active)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {opt.label}
              {isActive && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6l3 3 5-5" stroke="var(--color-brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.275 5.25782C14.0544 4.91375 14.9447 4.91372 15.7242 5.25782C16.2744 5.50079 16.6679 5.94461 17.0025 6.41407C17.3398 6.8873 17.7101 7.52631 18.1587 8.29688L23.0503 16.6963C23.4989 17.4667 23.871 18.1045 24.1158 18.6309C24.3582 19.1523 24.5504 19.7152 24.4869 20.3145C24.3969 21.1632 23.948 21.9315 23.2564 22.4297C22.7692 22.7806 22.1868 22.8959 21.6119 22.9482C21.0313 23.0011 20.2892 23 19.3921 23H9.60699C8.70997 23 7.96789 23.0011 7.38726 22.9482C6.81237 22.8959 6.22996 22.7806 5.74273 22.4297C5.05103 21.9314 4.60221 21.1631 4.51226 20.3145C4.44875 19.7151 4.64092 19.1523 4.88335 18.6309C5.12813 18.1045 5.50019 17.4667 5.94878 16.6963L10.8414 8.29493C11.2895 7.52522 11.6596 6.88702 11.9966 6.41407C12.331 5.94477 12.7246 5.50079 13.275 5.25782ZM14.9166 7.0879C14.6516 6.97092 14.3475 6.97092 14.0826 7.0879C14.0343 7.10923 13.8989 7.19163 13.6255 7.5752C13.3547 7.95541 13.0379 8.498 12.5699 9.30176L7.6773 17.7031C7.20883 18.5077 6.89344 19.0518 6.69683 19.4746C6.4983 19.9016 6.49561 20.0563 6.50054 20.1035C6.53009 20.3823 6.67841 20.6386 6.91167 20.8066C6.95449 20.8374 7.09532 20.913 7.5689 20.9561C8.03736 20.9987 8.67095 21 9.60699 21H19.3921C20.3282 21 20.9618 20.9987 21.4302 20.9561C21.9041 20.9129 22.0447 20.8374 22.0875 20.8066C22.3208 20.6385 22.469 20.3822 22.4986 20.1035C22.5035 20.0563 22.5008 19.9016 22.3023 19.4746C22.1057 19.0518 21.7903 18.5077 21.3218 17.7031L16.4302 9.30274C15.9618 8.49833 15.6446 7.95551 15.3736 7.5752C15.1007 7.19226 14.9652 7.10952 14.9166 7.0879ZM13.4996 15V11C13.4996 10.4477 13.9473 10 14.4996 10C15.0518 10 15.4995 10.4477 15.4996 11V15C15.4996 15.5523 15.0518 16 14.4996 16C13.9473 16 13.4996 15.5523 13.4996 15ZM15.5503 18.0996C15.5503 18.6511 15.1038 19.0985 14.5523 19.0996L14.4517 19.1006C14.1862 19.1011 13.9307 18.9952 13.7427 18.8076C13.555 18.6201 13.4499 18.3659 13.4498 18.1006V18C13.4498 17.4477 13.8975 17 14.4498 17H14.5503C15.1026 17 15.5503 17.4477 15.5503 18V18.0996Z" fill="var(--c100)"/>
    </svg>
  )
}

// ── Shared select style ───────────────────────────────────────────────────────

const SEL = {
  height: 32, padding: '0 10px',
  background: 'var(--bg-canvas)',
  border: '1px solid var(--border-default)',
  borderRadius: 6,
  fontSize: 'var(--type-p14)',
  color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif",
  outline: 'none',
  cursor: 'pointer',
  width: '100%',
}

// ── Alert tooltip ─────────────────────────────────────────────────────────────

function AlertTooltip() {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)
  function show() {
    const r = ref.current?.getBoundingClientRect()
    if (r) setPos({ x: r.left + r.width / 2, y: r.top })
  }
  return (
    <>
      <div ref={ref} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'default' }}
        onMouseEnter={show} onMouseLeave={() => setPos(null)}>
        <WarningIcon />
      </div>
      {pos && (
        <div style={{
          position: 'fixed', left: pos.x, top: pos.y - 8,
          transform: 'translate(-50%, -100%)',
          background: 'var(--d100)', color: 'var(--p100)',
          fontSize: 'var(--type-p14)', fontWeight: 500,
          fontFamily: "'Byrd', sans-serif",
          lineHeight: 1.4, padding: '5px 10px', borderRadius: 6,
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          Alert has been activated in this call
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--d100)',
          }} />
        </div>
      )}
    </>
  )
}

// ── Cell renderers ────────────────────────────────────────────────────────────

function IdCell({ value, data, context }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
      {data?.hasWarning && <AlertTooltip />}
      <span
        onClick={() => data && context?.onOpenCall?.(data)}
        style={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: 'var(--b100)', cursor: 'pointer', textDecoration: 'underline',
          textDecorationColor: 'transparent',
          transition: 'text-decoration-color 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.textDecorationColor = 'var(--b100)' }}
        onMouseLeave={e => { e.currentTarget.style.textDecorationColor = 'transparent' }}
      >
        {value}
      </span>
    </div>
  )
}

const STATUS_COLOR = { 'IN PROGRESS': 'cobalt', 'DONE': 'green' }
function StatusCell({ value }) {
  if (!value) return null
  const color = STATUS_COLOR[value]
  if (!color) return null
  return <Badge variant="tinted" color={color} shape="pill">{value}</Badge>
}

const PRIORITY_COLOR = { HIGH: 'coral', MEDIUM: 'lilac', LOW: 'teal' }
function PriorityCell({ value }) {
  if (!value) return null
  const color = PRIORITY_COLOR[value]
  if (!color) return null
  return <Badge variant="tinted" color={color} shape="pill">{value}</Badge>
}

const AVATAR_COLORS = {
  blue: '#418FF4', peach: '#F3AC9E', orange: '#FF7056',
  lilac: '#D799E2', green: '#6AB18A', teal: '#5FA8A0',
  sage: '#8FA882', horizon: '#7AAAB8',
}

function AvatarIcon({ color, initials }) {
  const fill = AVATAR_COLORS[color] ?? AVATAR_COLORS.blue
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="24" height="24" rx="12" fill={fill} />
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="black" strokeOpacity="0.2" />
      <text x="12" y="16" textAnchor="middle" fill="#F2F2F2" fontSize="8.5"
        fontWeight="700" fontFamily="Byrd, sans-serif" letterSpacing="0.3">{initials}</text>
    </svg>
  )
}

function AssignedToCell({ value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
      <AvatarIcon color={value.color} initials={value.initials} />
      <span style={{ fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value.name}
      </span>
    </div>
  )
}

// ── Column defs ───────────────────────────────────────────────────────────────

const COL_DEFS = [
  { field: 'id',            headerName: 'ID',             width: 210, cellRenderer: IdCell },
  { field: 'callDate',      headerName: 'CALL DATE',      width: 160 },
  { field: 'proposedPrice', headerName: 'PROPOSED PRICE', width: 155, type: 'numericColumn',
    valueFormatter: p => p.value != null ? p.value.toLocaleString() : '' },
  { field: 'destination',   headerName: 'DESTINATION',    width: 165 },
  { field: 'summary',       headerName: 'SUMMERY',        flex: 1, minWidth: 200 },
  { field: 'status',        headerName: 'STATUS',         width: 135, cellRenderer: StatusCell },
  { field: 'priority',      headerName: 'PRIORITY',       width: 110, cellRenderer: PriorityCell },
  { field: 'assignedTo',    headerName: 'ASSIGNED TO',    width: 160, cellRenderer: AssignedToCell,
    valueGetter: p => p.data?.assignedTo, sortable: false },
]

const DEFAULT_COL_DEF = { resizable: true, sortable: true }

// ── Filter logic ──────────────────────────────────────────────────────────────

function runFilters(appliedChips, searchText, allData) {
  let data = allData

  if (searchText.trim()) {
    const q = searchText.toLowerCase()
    data = data.filter(row =>
      ['id', 'callDate', 'destination', 'summary', 'status', 'priority'].some(k =>
        String(row[k] ?? '').toLowerCase().includes(q)
      ) || String(row.assignedTo?.name ?? '').toLowerCase().includes(q)
    )
  }

  const DATA_FIELDS = new Set(['id', 'callDate', 'proposedPrice', 'destination', 'summary', 'status', 'priority', 'assignedTo'])
  for (const f of appliedChips) {
    if (!f.field || !f.value.trim()) continue
    if (!DATA_FIELDS.has(f.field)) continue   // signal columns: UI-only, don't narrow demo rows
    data = data.filter(row => {
      const cellVal = f.field === 'assignedTo'
        ? (row.assignedTo?.name ?? '').toLowerCase()
        : String(row[f.field] ?? '').toLowerCase()
      const fVal = f.value.toLowerCase()
      switch (f.operator) {
        case 'contains':     return cellVal.includes(fVal)
        case 'not_contains': return !cellVal.includes(fVal)
        case 'equals':       return cellVal === fVal
        case 'not_equal':    return cellVal !== fVal
        default:             return true
      }
    })
  }

  return data
}

// ── Collapsed chips pill ──────────────────────────────────────────────────────


function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9 2l2 2-6.5 6.5L2 11l.5-2.5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

const OP_SYMBOL = { equals: '=', not_equal: '≠', contains: '~', not_contains: '!~' }

function CollapsedChips({ selectedFields, chips, onClearAll, onRemoveColumn, onEdit, isCustomPreset, onSave, onUpdatePreset }) {
  const [open, setOpen]       = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const closeTimer            = useRef(null)

  function cancelClose() { clearTimeout(closeTimer.current) }
  function scheduleClose() { closeTimer.current = setTimeout(() => setOpen(false), 300) }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const chipFor = field => chips.find(c => c.field === field)
  // Union of selected columns + any filtered field, in a stable order
  const fields = [...new Set([...selectedFields, ...chips.map(c => c.field)])]

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}
      onMouseEnter={() => { cancelClose(); setOpen(true) }}
      onMouseLeave={scheduleClose}
    >
      {/* Pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 28, padding: '0 11px',
        background: 'var(--b20)', border: '1px solid var(--b60)',
        borderRadius: 99, fontSize: 12, color: 'var(--b100)',
        fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap', cursor: 'default',
      }}>
        {fields.length} selected
        <span
          onClick={e => { e.stopPropagation(); onClearAll() }}
          style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1, opacity: 0.7 }}
        >×</span>
      </div>

      {/* Dropdown — styled to match Manage Columns modal */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          zIndex: 200, width: 340,
          overflow: 'hidden',
        }}>
          {/* Title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px 12px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            <span style={{
              fontSize: 16, fontWeight: 600, color: 'var(--text-primary)',
              fontFamily: "'Byrd', sans-serif",
            }}>Selected columns</span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--b100)',
              background: 'var(--b20)', borderRadius: 99, padding: '2px 8px',
              fontFamily: "'Byrd', sans-serif",
            }}>{fields.length}</span>
          </div>

          {/* Rows — every selected column; filtered ones show their value pill */}
          <div style={{ padding: '4px 0' }}>
            {fields.map(field => {
              const chip = chipFor(field)
              const opLabel = chip ? ((isDateField(field) ? DATE_OPERATORS : OPERATORS).find(o => o.value === chip.operator)?.label ?? '') : ''
              const pill = chip ? `${opLabel}: ${chipValueLabel(chip)}` : null
              const isHovered = hoveredId === field
              return (
                <div
                  key={field}
                  onClick={() => { onEdit(field); setOpen(false) }}
                  onMouseEnter={() => setHoveredId(field)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                    padding: '8px 12px 8px 20px', cursor: 'pointer',
                    background: isHovered ? 'rgba(23,121,247,0.06)' : 'transparent',
                    transition: 'background 100ms',
                  }}
                >
                  <span style={{
                    flex: 1, fontFamily: "'Byrd', sans-serif", fontSize: 14, fontWeight: 500,
                    color: 'var(--text-primary)', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{colLabel(field)}</span>

                  {/* Filter value pill, or a dashed "Add filter" pill — same as the modal */}
                  {pill
                    ? <span style={{
                        display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                        height: 24, padding: '0 10px',
                        background: 'var(--b20)', border: '1px solid var(--b60)', borderRadius: 99,
                        fontSize: 12, color: 'var(--b100)', fontFamily: "'Byrd', sans-serif",
                        maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{pill}</span>
                    : <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                        height: 24, padding: '0 10px', borderRadius: 99,
                        border: '1px dashed var(--b60)', background: 'transparent',
                        color: 'var(--b100)', fontSize: 12, fontWeight: 500,
                        fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M1.5 2.5h11l-4.5 5.5V12l-2-1V8L1.5 2.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                        Add filter
                      </span>}

                  {/* Remove the column (and any filter on it) */}
                  <span
                    role="button"
                    title="Remove column"
                    onClick={e => { e.stopPropagation(); onRemoveColumn(field) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, flexShrink: 0, borderRadius: 6, cursor: 'pointer', fontSize: 15, lineHeight: 1, color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >×</span>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
          }}>
            <Button variant="ghost" size="sm" onClick={onClearAll}>Clear all</Button>
            {isCustomPreset
              ? <Button size="sm" onClick={() => { onUpdatePreset(); setOpen(false) }}>Update preset</Button>
              : <Button size="sm" onClick={() => { onSave(); setOpen(false) }}>Save as preset</Button>
            }
          </div>
        </div>
      )}
    </div>
  )
}

// ── Filter chip ───────────────────────────────────────────────────────────────

function FilterChip({ chip, onEdit, onRemove }) {
  const fieldLabel = colLabel(chip.field)
  const isNeg = chip.operator === 'not_contains' || chip.operator === 'not_equal'
  const label = isDateField(chip.field)
    ? `${fieldLabel} ${DATE_OP_WORD[chip.operator] ?? ''} ${chipValueLabel(chip)}`.replace(/\s+/g, ' ').trim()
    : `${fieldLabel}${isNeg ? ' ≠' : ':'} ${chip.value}`

  return (
    <div
      data-inspector="FilterChip"
      style={{
      display: 'flex', alignItems: 'center', gap: 0,
      height: 26, borderRadius: 99,
      background: 'var(--b20)', border: '1px solid var(--b30)',
      fontSize: 12, color: 'var(--b100)',
      fontFamily: "'Byrd', sans-serif",
      whiteSpace: 'nowrap', flexShrink: 0, userSelect: 'none',
    }}>
      <span
        onClick={onEdit}
        style={{ padding: '0 8px 0 10px', cursor: 'pointer', lineHeight: 1 }}
      >
        {label}
      </span>
      <button
        onClick={onRemove}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, marginRight: 3,
          borderRadius: '50%', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--b100)', fontSize: 15, lineHeight: 1,
          flexShrink: 0,
        }}
      >×</button>
    </div>
  )
}

// ── Filter modal (inline per-column editing) ──────────────────────────────────

function FilterModal({ open, initialField, chips, selectedColumns, onToggleColumn, onUpsert, onRemove, onClose }) {
  const [search, setSearch]           = useState('')
  const [expanded, setExpanded]       = useState(() => new Set())
  const [activeField, setActiveField] = useState(null)
  const [hoveredField, setHoveredField] = useState(null)
  const [draft, setDraft]             = useState({ operator: 'equals', value: '' })
  const rowRefs    = useRef({})

  useEffect(() => {
    if (!open) return
    setSearch('')
    setActiveField(null)
    if (initialField) {
      // Edit a specific column: expand its group and open its inline editor
      const g = COLUMN_GROUPS.find(grp => grp.fields.includes(initialField))
      setExpanded(g ? new Set([g.id]) : new Set())
      openEditor(initialField)
      const t = setTimeout(() => rowRefs.current[initialField]?.scrollIntoView({ block: 'nearest' }), 40)
      return () => clearTimeout(t)
    }
    setExpanded(new Set())
  }, [open, initialField])

  const chipFor = field => chips.find(c => c.field === field)

  function isComplete(field, op, value) {
    if (isDateField(field)) {
      if (op === 'between') { const [a, b] = (value || '').split('..'); return !!(a && b) }
      return !!value
    }
    return !!(value && String(value).trim())
  }

  function openEditor(field) {
    const existing = chipFor(field)
    const isD = isDateField(field)
    setDraft(existing
      ? { operator: existing.operator, value: existing.value }
      : { operator: isD ? 'on' : 'equals', value: '' })
    setActiveField(field)
  }

  function update(next) {
    setDraft(next)
    if (isComplete(activeField, next.operator, next.value)) onUpsert(activeField, next)
    else onRemove(activeField)
  }

  function setOp(op) {
    let value = draft.value
    if (isDateField(activeField)) {
      if (op === 'between' && !value.includes('..')) value = `${value}..`
      else if (op !== 'between' && value.includes('..')) value = value.split('..')[0]
    }
    update({ operator: op, value })
  }

  function clearActive() {
    if (activeField) onRemove(activeField)
    setActiveField(null)
  }

  function markerText(field) {
    const c = chipFor(field)
    if (!c || !isComplete(field, c.operator, c.value)) return null
    const val = isDateField(field) ? chipValueLabel(c) : c.value
    const opLabel = (isDateField(field) ? DATE_OPERATORS : OPERATORS)
      .find(o => o.value === c.operator)?.label ?? ''
    return `${opLabel}: ${val}`.trim()
  }

  const isD = isDateField(activeField)
  const [rangeFrom, rangeTo] = (draft.value || '').split('..')
  const dateInput = {
    height: 34, padding: '0 8px', boxSizing: 'border-box',
    background: 'var(--bg-canvas)', border: '1px solid var(--border-input)', borderRadius: 8,
    fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)', outline: 'none',
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Add filter"
        width={520}
        padding={24}
        footer={<Button size="sm" onClick={onClose}>Done</Button>}
      >
        <div>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
            padding: '10px 14px', borderRadius: 10,
            background: 'transparent', border: '1px solid var(--border-input)',
          }}>
            <SearchIcon />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search columns..."
              autoFocus
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Sectioned, grouped column list */}
          <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 10 }} className="manage-cols-scroll">
            {COLUMN_SECTIONS.map(section => {
              const groups = COLUMN_GROUPS.filter(g =>
                g.section === section.key &&
                g.fields.some(f => colLabel(f).toLowerCase().includes(search.toLowerCase()))
              )
              if (groups.length === 0) return null
              return (
                <div key={section.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 8px 8px' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap' }}>{section.label}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                  </div>
                  {groups.map(group => {
                    const matched = group.fields.filter(f => colLabel(f).toLowerCase().includes(search.toLowerCase()))
                    const isExpanded = expanded.has(group.id) || search.length > 0
                    const selCount    = group.fields.filter(f => selectedColumns?.has(f)).length
                    const filterCount = group.fields.filter(f => markerText(f)).length
                    return (
                      <div key={group.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <button
                          onClick={() => setExpanded(s => { const n = new Set(s); n.has(group.id) ? n.delete(group.id) : n.add(group.id); return n })}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '13px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
                            {group.label}
                            {selCount > 0 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-active)', borderRadius: 99, padding: '2px 9px', fontFamily: "'Byrd', sans-serif" }}>
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {selCount} selected
                              </span>
                            )}
                            {filterCount > 0 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--b100)', background: 'var(--b20)', borderRadius: 99, padding: '2px 9px', fontFamily: "'Byrd', sans-serif" }}>
                                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                                  <path d="M1.5 2.5h11l-4.5 5.5V12l-2-1V8L1.5 2.5z" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                                </svg>
                                {filterCount} filtered
                              </span>
                            )}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: 'transform 180ms', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                            <path d="M3 5l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        {isExpanded && matched.map(f => {
                          const mark = markerText(f)
                          const active = activeField === f
                          const checked = selectedColumns?.has(f)
                          return (
                            <div
                              key={f}
                              ref={el => { if (el) rowRefs.current[f] = el }}
                              style={{
                                marginBottom: 4, borderRadius: 10,
                                ...(active ? { border: '1px solid var(--b60)', background: '#fff', boxShadow: '0 2px 12px rgba(23,121,247,0.12)' } : {}),
                              }}
                            >
                              {/* Row */}
                              <div
                                onMouseEnter={() => setHoveredField(f)}
                                onMouseLeave={() => setHoveredField(null)}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 32, boxSizing: 'border-box', padding: active ? 12 : '4px 12px', borderRadius: 8, background: active ? 'transparent' : (hoveredField === f ? 'rgba(23,121,247,0.05)' : 'none'), fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)', transition: 'background 100ms' }}
                              >
                                {/* Checkbox — adds the column to the view (no filter) */}
                                <div
                                  role="checkbox"
                                  aria-checked={checked}
                                  title={checked ? 'Hide column' : 'Show column'}
                                  onClick={e => {
                                    e.stopPropagation()
                                    onToggleColumn(f)
                                    if (checked) {           // deselecting → collapse editor + clear its filter
                                      if (activeField === f) setActiveField(null)
                                      onRemove(f)
                                    }
                                  }}
                                  style={{
                                    width: 16, height: 16, flexShrink: 0, borderRadius: 4,
                                    border: `1.5px solid ${checked ? 'var(--b100)' : 'var(--border-input)'}`,
                                    background: checked ? 'var(--b100)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 120ms',
                                  }}
                                >
                                  {checked && (
                                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>

                                {/* Name — click to add/edit a filter (only once the column is added) */}
                                <span
                                  onClick={() => { if (checked) openEditor(f) }}
                                  style={{ flex: 1, cursor: checked ? 'pointer' : 'default' }}
                                >{colLabel(f)}</span>

                                {/* Filter pill / Add filter — only shown after the column is checked */}
                                {checked && (mark
                                  ? <span
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 4px 0 8px', background: 'var(--b20)', border: '1px solid var(--b60)', borderRadius: 99, fontSize: 12, color: 'var(--b100)', whiteSpace: 'nowrap', maxWidth: 220, cursor: 'pointer', transition: 'background 120ms' }}
                                      onClick={() => openEditor(f)}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--b30)' }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--b20)' }}
                                    >
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{mark}</span>
                                      <span
                                        role="button"
                                        title="Clear filter"
                                        onClick={e => { e.stopPropagation(); onRemove(f) }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, flexShrink: 0, borderRadius: 99, cursor: 'pointer', fontSize: 13, lineHeight: 1, color: 'var(--b100)' }}
                                      >×</span>
                                    </span>
                                  : !active && <span
                                      title="Add filter"
                                      onClick={() => openEditor(f)}
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                                        height: 24, padding: '0 10px', borderRadius: 99,
                                        border: '1px dashed var(--b60)', background: 'transparent',
                                        color: 'var(--b100)', fontSize: 12, fontWeight: 500,
                                        fontFamily: "'Byrd', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
                                        transition: 'background 120ms',
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--b20)' }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                                    >
                                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                        <path d="M1.5 2.5h11l-4.5 5.5V12l-2-1V8L1.5 2.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                                      </svg>
                                      Add filter
                                    </span>)}
                              </div>

                              {/* Inline editor — expands in place under the row */}
                              {active && (
                                <>
                                  <div style={{ height: 1, background: 'var(--border-default)', margin: '0 14px' }} />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12 }}>
                                    <div style={{ width: 150 }}>
                                      <PresetSelect
                                        fullWidth
                                        options={(isD ? DATE_OPERATORS : OPERATORS).map(op => ({ value: op.value, label: op.label }))}
                                        value={isD && !DATE_OP_VALUES.has(draft.operator) ? 'on' : draft.operator}
                                        onChange={setOp}
                                      />
                                    </div>
                                    {!isD ? (
                                      <input
                                        value={draft.value}
                                        onChange={e => update({ ...draft, value: e.target.value })}
                                        placeholder="Value"
                                        autoFocus
                                        style={{ flex: 1, minWidth: 0, height: 34, padding: '0 10px', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--border-input)', borderRadius: 8, fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif", color: 'var(--text-primary)', outline: 'none' }}
                                      />
                                    ) : draft.operator === 'between' ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                                        <input type="date" value={rangeFrom || ''} onChange={e => update({ ...draft, value: `${e.target.value}..${rangeTo || ''}` })} style={{ ...dateInput, background: '#fff', flex: 1, minWidth: 0 }} />
                                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                                        <input type="date" value={rangeTo || ''} min={rangeFrom || undefined} onChange={e => update({ ...draft, value: `${rangeFrom || ''}..${e.target.value}` })} style={{ ...dateInput, background: '#fff', flex: 1, minWidth: 0 }} />
                                      </div>
                                    ) : (
                                      <input type="date" value={draft.value} onChange={e => update({ ...draft, value: e.target.value })} style={{ ...dateInput, background: '#fff', flex: 1, minWidth: 0 }} />
                                    )}
                                    {/* Confirm */}
                                    <button
                                      onClick={() => setActiveField(null)}
                                      title="Confirm"
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flexShrink: 0, background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)' }}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--b20)'; e.currentTarget.style.color = 'var(--b100)' }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                                    >
                                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </button>
                                    {/* Remove */}
                                    <button
                                      onClick={clearActive}
                                      title="Remove filter"
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flexShrink: 0, background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 17 }}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--c20)'; e.currentTarget.style.color = 'var(--c100)' }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                                    >×</button>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </Modal>
    </>
  )
}


const DATE_RANGES = [
  { key: 'today',   label: 'Today' },
  { key: 'week',    label: 'This week' },
  { key: 'month',   label: 'This month' },
  { key: 'quarter', label: 'This quarter' },
  { key: 'year',    label: 'This year' },
  { key: 'custom',  label: 'Custom range' },
]

function fmtDate(iso) {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+m - 1]} ${+d}`
}

function ColumnsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 3h11M1 6.5h11M1 10h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="4" cy="3" r="1.5" fill="var(--bg-sidebar)" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9" cy="6.5" r="1.5" fill="var(--bg-sidebar)" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="10" r="1.5" fill="var(--bg-sidebar)" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="2.5" width="11" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5.5h11" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 1v3M9 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// ── DataPage ──────────────────────────────────────────────────────────────────

export default function DataPageV3({ isMobile = false, sidebarWidth = 272, sidebarTransition, companyConfig = null, onOpenCall }) {
  const [schemaId,       setSchemaId]       = useState('acme')
  const [customPresets,  setCustomPresets]  = useState([])
  const [selectedPreset, setSelectedPreset] = useState('')
  const [chips,          setChips]          = useState([])
  const [searchText,     setSearchText]     = useState('')
  const [activePopover,  setActivePopover]  = useState(null) // { id }
  const [filterStep,     setFilterStep]     = useState('column') // 'column' | 'config'
  const [editingChip,    setEditingChip]    = useState({ field: '', operator: 'contains', value: '' })
  const [saveModalOpen,    setSaveModalOpen]    = useState(false)
  const [presetNameDraft,  setPresetNameDraft]  = useState('')
  const [manageColsOpen,   setManageColsOpen]   = useState(false)
  const [colSearch,        setColSearch]        = useState('')
  const [expandedGroups,   setExpandedGroups]   = useState(() => new Set())
  const [draftCols,        setDraftCols]        = useState(() => new Set())
  const [dateRange,      setDateRange]      = useState(null)
  const [dateRangeOpen,  setDateRangeOpen]  = useState(false)
  const [customFrom,      setCustomFrom]      = useState('')
  const [customTo,        setCustomTo]        = useState('')
  const [customDateField, setCustomDateField] = useState('equals')

  const gridRef      = useRef(null)
  const dateRangeRef   = useRef(null)
  const manageColsRef  = useRef(null)

  // Track dark mode — switch AG Grid theme reactively
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.dataset.theme === 'dark')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    setSelectedPreset('')
    setChips([])
    setSearchText('')
    setActivePopover(null)
  }, [schemaId])

  useEffect(() => {
    if (!dateRangeOpen) return
    function handleClick(e) {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target))
        setDateRangeOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dateRangeOpen])

  useEffect(() => {
    if (!manageColsOpen) return
    function handleClick(e) {
      if (manageColsRef.current && !manageColsRef.current.contains(e.target))
        setManageColsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [manageColsOpen])

  const [gridApi, setGridApi] = useState(null)

  const allPresets = useMemo(() => [...PRESETS, ...customPresets], [customPresets])

  // Full row pool — use company data when config is available, otherwise schema mock data
  const rowPool      = useMemo(() =>
    companyConfig?.companyName
      ? generateCompanyRows(companyConfig)
      : generateRows(schemaId),
  [schemaId, companyConfig])
  const filteredPool = useMemo(() => runFilters(chips, searchText, rowPool), [chips, searchText, rowPool])

  // Infinite-row datasource — slices filteredPool on demand
  const datasource = useMemo(() => ({
    getRows(params) {
      const chunk   = filteredPool.slice(params.startRow, params.endRow)
      const lastRow = params.startRow + chunk.length >= filteredPool.length
        ? filteredPool.length
        : undefined          // undefined = more rows exist, keep scrollbar open
      params.successCallback(chunk, lastRow)
    },
  }), [filteredPool])

  // Push new datasource to grid whenever filters change
  useEffect(() => {
    gridApi?.setGridOption('datasource', datasource)
  }, [datasource, gridApi])

  function applyColumns() {
    if (gridApi) COL_DEFS.forEach(c => gridApi.setColumnVisible(c.field, draftCols.has(c.field)))
    setManageColsOpen(false)
  }

  function savePreset() {
    if (!presetNameDraft.trim()) return
    const id = `custom_${Date.now()}`
    setCustomPresets(p => [...p, {
      id,
      label:   presetNameDraft.trim(),
      filters: chips.map(({ id: _id, ...rest }) => rest),
    }])
    setSelectedPreset(id)
    setSaveModalOpen(false)
    setPresetNameDraft('')
  }

  function updatePreset() {
    setCustomPresets(p => p.map(p2 =>
      p2.id === selectedPreset
        ? { ...p2, filters: chips.map(({ id: _id, ...rest }) => rest) }
        : p2
    ))
  }

  function loadPreset(id) {
    setSelectedPreset(id)
    const preset = id ? allPresets.find(p => p.id === id) : null
    setChips(preset ? preset.filters.map(f => ({ ...f, id: _chipId++ })) : [])
    // Select the preset's columns plus any filtered field, so the view matches
    const cols = preset ? [...(preset.columns ?? []), ...preset.filters.map(f => f.field)] : []
    setDraftCols(new Set(cols))
  }

  // Inline-edit model: opening the panel shows the column list; editing happens per-column.
  function openPopover(id) {
    const c = id && id !== 'new' ? chips.find(x => x.id === id) : null
    setActivePopover({ field: c?.field ?? null })
  }
  function closePopover() { setActivePopover(null) }

  function upsertFilter(field, patch) {
    setDraftCols(s => s.has(field) ? s : new Set(s).add(field))  // filtering a column implies it's selected
    setChips(cs => {
      const ex = cs.find(c => c.field === field)
      if (ex) return cs.map(c => c.field === field ? { ...c, operator: patch.operator, value: patch.value } : c)
      return [...cs, { id: _chipId++, field, operator: patch.operator, value: patch.value }]
    })
  }
  function removeFilterByField(field) { setChips(cs => cs.filter(c => c.field !== field)) }

  function removeChip(id) { setChips(c => c.filter(x => x.id !== id)) }

  const left = isMobile ? 0 : sidebarWidth

  return (
    <div
      data-inspector="DataPageV3"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page Header — floating pill ──────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 52, flexShrink: 0,
        margin: '16px 16px 0',
        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 16,
        boxShadow: 'var(--page-header-shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>Data V2</span>
          {companyConfig?.companyName && (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
              <span style={{ fontSize: 'var(--type-p13)', color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif" }}>{companyConfig.companyName}</span>
            </>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          <Badge variant="tinted" color="teal" shape="pill">
            Total records&nbsp;{filteredPool.length}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 30, padding: '0 10px',
            background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
            borderRadius: 6, flexShrink: 0, width: 190,
          }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <SearchIcon />
            </span>
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 'var(--type-p14)', color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif",
              }}
            />
            {searchText && (
              <button onClick={() => setSearchText('')} style={{
                display: 'flex', alignItems: 'center', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, fontSize: 15, lineHeight: 1,
              }}>×</button>
            )}
          </div>
          <Button size="sm">Upload</Button>
          <Button variant="ghost" size="sm" leftIcon={<MoreIcon />} />
        </div>
      </div>

      {/* ── Filter Strip — floating pill ─────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 14px', height: 48, flexShrink: 0,
        margin: '8px 16px 0',
        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 12,
        boxShadow: 'var(--page-header-shadow)',
        minWidth: 0,
      }}>
        {/* Preset selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{
            fontSize: 'var(--type-p14)', fontWeight: 500, color: 'var(--text-secondary)',
            fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
          }}>Preset:</span>
          <PresetSelect
            options={[{ value: '', label: 'None' }, ...allPresets.map(p => ({ value: p.id, label: p.label }))]}
            value={selectedPreset}
            onChange={loadPreset}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'var(--border-input)', flexShrink: 0 }} />

        {/* Chips + Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          {(draftCols.size > 0 || chips.length > 0) && (
            <CollapsedChips
              selectedFields={[...draftCols]}
              chips={chips}
              onClearAll={() => { setChips([]); setDraftCols(new Set()) }}
              onRemoveColumn={field => {
                setDraftCols(s => { const n = new Set(s); n.delete(field); return n })
                removeFilterByField(field)
              }}
              onEdit={field => setActivePopover({ field })}
              isCustomPreset={selectedPreset && customPresets.some(p => p.id === selectedPreset)}
              onSave={() => { setPresetNameDraft(''); setSaveModalOpen(true) }}
              onUpdatePreset={updatePreset}
            />
          )}
          <button
            onClick={() => openPopover('new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              height: 28, padding: '0 11px',
              background: 'none', border: '1px solid var(--border-input)',
              borderRadius: 99, fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif", cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b100)'; e.currentTarget.style.color = 'var(--b100)'; e.currentTarget.style.background = 'var(--b20)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-input)';  e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none' }}
          >
            <PlusIcon /> Add filter
          </button>
        </div>


        {/* Date range picker */}
        <div ref={dateRangeRef} style={{ position: 'relative', flexShrink: 0 }}>
          {/* Trigger pill */}
          <button
            onClick={() => setDateRangeOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 11px',
              background: dateRange ? 'var(--b20)' : 'none',
              border: `1px solid ${dateRange ? 'var(--b60)' : 'var(--border-input)'}`,
              borderRadius: 99,
              fontSize: 12, color: dateRange ? 'var(--b100)' : 'var(--text-secondary)',
              fontFamily: "'Byrd', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            <CalendarIcon />
            {!dateRange
              ? 'Date range'
              : dateRange === 'custom'
                ? (customFrom && customTo
                    ? `${fmtDate(customFrom)} – ${fmtDate(customTo)}`
                    : 'Custom range')
                : DATE_RANGES.find(r => r.key === dateRange)?.label
            }
            {dateRange && (
              <span
                onClick={e => {
                  e.stopPropagation()
                  setDateRange(null)
                  setCustomFrom('')
                  setCustomTo('')
                  setDateRangeOpen(false)
                }}
                style={{ marginLeft: 2, fontSize: 14, lineHeight: 1, opacity: 0.7 }}
              >×</span>
            )}
          </button>

          {/* Dropdown */}
          {dateRangeOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
              overflow: 'hidden', zIndex: 100, width: 240,
            }}>
              {/* Quick options */}
              <div style={{ padding: 6 }}>
                {DATE_RANGES.filter(r => r.key !== 'custom').map(r => {
                  const active = dateRange === r.key
                  return (
                    <button
                      key={r.key}
                      onClick={() => { setDateRange(r.key); setDateRangeOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', textAlign: 'left',
                        padding: '8px 10px', border: 'none', cursor: 'pointer', borderRadius: 8,
                        background: active ? 'var(--b20)' : 'transparent',
                        fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif",
                        color: active ? 'var(--b100)' : 'var(--text-primary)',
                        fontWeight: active ? 600 : 400,
                        transition: 'background 100ms ease',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-active)' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      {r.label}
                      {active && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="var(--b100)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Custom range toggle */}
              <button
                onClick={() => setDateRange(dateRange === 'custom' ? null : 'custom')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left',
                  padding: '11px 16px', border: 'none', cursor: 'pointer',
                  borderTop: '1px solid var(--border-default)',
                  background: dateRange === 'custom' ? 'var(--b20)' : 'transparent',
                  fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif",
                  color: dateRange === 'custom' ? 'var(--b100)' : 'var(--text-primary)',
                  fontWeight: dateRange === 'custom' ? 600 : 400,
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={e => { if (dateRange !== 'custom') e.currentTarget.style.background = 'var(--bg-active)' }}
                onMouseLeave={e => { if (dateRange !== 'custom') e.currentTarget.style.background = 'transparent' }}
              >
                Custom range
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transition: 'transform 160ms', transform: dateRange === 'custom' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Custom date inputs — expands when Custom is selected */}
              {dateRange === 'custom' && (
                <div style={{ padding: '14px 16px 16px', borderTop: '1px solid var(--border-default)' }}>
                  {/* From → To row */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '1px solid var(--border-input)',
                    borderRadius: 10, overflow: 'hidden',
                  }}>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={e => setCustomFrom(e.target.value)}
                      style={{
                        flex: 1, minWidth: 0, padding: '9px 10px', boxSizing: 'border-box',
                        background: 'transparent', border: 'none',
                        fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif",
                        color: 'var(--text-primary)', outline: 'none',
                      }}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }}>→</span>
                    <input
                      type="date"
                      value={customTo}
                      min={customFrom || undefined}
                      onChange={e => setCustomTo(e.target.value)}
                      style={{
                        flex: 1, minWidth: 0, padding: '9px 10px', boxSizing: 'border-box',
                        background: 'transparent', border: 'none',
                        fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif",
                        color: 'var(--text-primary)', outline: 'none', textAlign: 'right',
                      }}
                    />
                  </div>

                  {/* Apply */}
                  <div style={{ marginTop: 12 }}>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={!customFrom || !customTo}
                      onClick={() => setDateRangeOpen(false)}
                    >Apply</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── AG Grid ──────────────────────────────────────────────────────── */}
      <div data-inspector="DataGrid" style={{ flex: 1, overflow: 'hidden', padding: 0, border: 'var(--page-header-border)', boxShadow: 'var(--page-header-shadow)', borderRadius: 16, margin: '16px 16px 16px', background: 'var(--bg-sidebar)' }}>
        <AgGridReact
          ref={gridRef}
          theme={isDark ? darkTheme : lightTheme}
          className="hear-grid"
          rowModelType="infinite"
          cacheBlockSize={100}
          maxBlocksInCache={10}
          infiniteInitialRowCount={100}
          onGridReady={e => setGridApi(e.api)}
          columnDefs={COL_DEFS}
          defaultColDef={DEFAULT_COL_DEF}
          rowHeight={44}
          headerHeight={38}
          suppressCellFocus={false}
          context={{ onOpenCall }}
        />
      </div>

      {/* ── Filter modal (inline per-column editing) ──────────────────── */}
      <FilterModal
        open={!!activePopover}
        initialField={activePopover?.field ?? null}
        chips={chips}
        selectedColumns={draftCols}
        onToggleColumn={field => setDraftCols(s => { const n = new Set(s); n.has(field) ? n.delete(field) : n.add(field); return n })}
        onUpsert={upsertFilter}
        onRemove={removeFilterByField}
        onClose={closePopover}
      />

      {/* ── Save preset modal ─────────────────────────────────────────── */}
      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save as preset"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={savePreset} disabled={!presetNameDraft.trim()}>Save preset</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            fontSize: 'var(--type-p14)', fontWeight: 500,
            color: 'var(--text-secondary)', fontFamily: "'Byrd', sans-serif",
          }}>
            Preset name
          </label>
          <input
            value={presetNameDraft}
            onChange={e => setPresetNameDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') savePreset() }}
            placeholder="e.g. High priority in progress"
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              height: 38, padding: '0 12px',
              background: 'var(--bg-canvas)',
              border: '1.5px solid var(--border-default)',
              borderRadius: 8,
              fontSize: 13, color: 'var(--text-primary)',
              fontFamily: "'Byrd', sans-serif",
              outline: 'none',
              transition: 'border-color 150ms ease',
            }}
            onFocus={e  => { e.currentTarget.style.borderColor = 'var(--b100)' }}
            onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
          />
          {chips.length > 0 && (
            <p style={{
              margin: '4px 0 0', fontSize: 'var(--type-p14)',
              color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", lineHeight: 1.5,
            }}>
              {chips.length} filter{chips.length > 1 ? 's' : ''} will be saved:&nbsp;
              {chips.map(c => {
                const fl = colLabel(c.field)
                return `${fl}: ${c.value}`
              }).join(' · ')}
            </p>
          )}
        </div>
      </Modal>

    </div>
  )
}
