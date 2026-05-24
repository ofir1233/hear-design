import { useState, useRef, useEffect, useMemo } from 'react'
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

const PRESETS = [
  { id: 'agent_v1',      label: 'Agent evaluation V1', filters: [{ field: 'status',     operator: 'equals', value: 'IN PROGRESS' }] },
  { id: 'high_priority', label: 'High Priority',        filters: [{ field: 'priority',   operator: 'equals', value: 'HIGH'        }] },
  { id: 'done_only',     label: 'Done',                 filters: [{ field: 'status',     operator: 'equals', value: 'DONE'        }] },
  { id: 'alerts',        label: 'Alerts Only',          filters: [{ field: 'hasWarning', operator: 'equals', value: 'true'        }] },
]

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

// ── Column groups (for the inline Columns picker) ─────────────────────────────
// Groups the available COL_DEFS into named sections, matching the platform's
// existing "Manage Columns" modal model. Order in `fields` is the display order
// inside the group; field IDs must match COL_DEFS.field exactly.
const COLUMN_GROUPS = [
  { id: 'call_details', label: 'Call Details', fields: ['id', 'callDate', 'destination', 'summary'] },
  { id: 'commercial',   label: 'Commercial',   fields: ['proposedPrice'] },
  { id: 'status',       label: 'Status & Priority', fields: ['status', 'priority'] },
  { id: 'assignment',   label: 'Assignment',   fields: ['assignedTo'] },
]
const ALL_FIELDS    = COL_DEFS.map(c => c.field)
const FIELD_LABELS  = Object.fromEntries(COL_DEFS.map(c => [c.field, c.headerName]))

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

  for (const f of appliedChips) {
    if (!f.field || !f.value.trim()) continue
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

// ── Filter chip ───────────────────────────────────────────────────────────────

function FilterChip({ chip, onEdit, onRemove }) {
  const fieldLabel = FILTER_FIELDS.find(f => f.value === chip.field)?.label ?? chip.field
  const isNeg = chip.operator === 'not_contains' || chip.operator === 'not_equal'
  const label = `${fieldLabel}${isNeg ? ' ≠' : ':'} ${chip.value}`

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

// ── Filter popover ────────────────────────────────────────────────────────────

function FilterPopover({ anchor, chip, onChange, onDone, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  const canDone = chip.field && chip.value.trim()

  return (
    <div ref={ref} data-inspector="FilterPopover" style={{
      position: 'fixed', left: anchor.x, top: anchor.y,
      zIndex: 600,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
      padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
      width: 250,
    }}>
      <PresetSelect
        fullWidth
        options={[{ value: '', label: 'Field…' }, ...FILTER_FIELDS.map(f => ({ value: f.value, label: f.label }))]}
        value={chip.field}
        onChange={v => onChange({ ...chip, field: v })}
      />

      <PresetSelect
        fullWidth
        options={OPERATORS.map(op => ({ value: op.value, label: op.label }))}
        value={chip.operator}
        onChange={v => onChange({ ...chip, operator: v })}
      />

      <input
        value={chip.value}
        onChange={e => onChange({ ...chip, value: e.target.value })}
        onKeyDown={e => { if (e.key === 'Enter' && canDone) onDone() }}
        placeholder="Value…"
        style={{ ...SEL, width: '100%', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={onDone} disabled={!canDone}>Done</Button>
      </div>
    </div>
  )
}

// ── DataPageV2 ────────────────────────────────────────────────────────────────

export default function DataPageV2({ isMobile = false, sidebarWidth = 272, sidebarTransition, companyConfig = null, onOpenCall }) {
  const [schemaId,       setSchemaId]       = useState('acme')
  const [customPresets,  setCustomPresets]  = useState([])
  const [selectedPreset, setSelectedPreset] = useState('')
  const [chips,          setChips]          = useState([])
  const [appliedChips,   setAppliedChips]   = useState([])
  const [searchText,     setSearchText]     = useState('')
  const [activePopover,  setActivePopover]  = useState(null) // { id, anchor:{x,y} }
  const [editingChip,    setEditingChip]    = useState({ field: '', operator: 'contains', value: '' })
  const [saveModalOpen,  setSaveModalOpen]  = useState(false)
  const [presetNameDraft, setPresetNameDraft] = useState('')
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [queryText,      setQueryText]      = useState('')

  // Columns picker state — visibleFields is applied; draft is what the modal is editing
  const [visibleFields,    setVisibleFields]    = useState(ALL_FIELDS)
  const [columnsModalOpen, setColumnsModalOpen] = useState(false)
  const [columnsDraft,     setColumnsDraft]     = useState(ALL_FIELDS)
  const [columnsSearch,    setColumnsSearch]    = useState('')
  const [expandedGroups,   setExpandedGroups]   = useState(() =>
    new Set(COLUMN_GROUPS.map(g => g.id))   // all groups open by default
  )

  function openColumnsModal() {
    setColumnsDraft(visibleFields)
    setColumnsSearch('')
    setColumnsModalOpen(true)
  }
  function applyColumns() {
    setVisibleFields(columnsDraft)
    setColumnsModalOpen(false)
  }
  function toggleDraftField(field) {
    setColumnsDraft(v => v.includes(field)
      ? v.filter(f => f !== field)
      : [...v, field]
    )
  }
  function toggleGroupExpand(id) {
    setExpandedGroups(s => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // AG Grid columnDefs driven by visibleFields (preserves user-chosen order)
  const activeColDefs = useMemo(
    () => visibleFields.map(f => COL_DEFS.find(c => c.field === f)).filter(Boolean),
    [visibleFields]
  )

  const gridRef = useRef(null)

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
    setAppliedChips([])
    setSearchText('')
    setActivePopover(null)
  }, [schemaId])

  const [gridApi, setGridApi] = useState(null)

  const isDirty    = JSON.stringify(chips) !== JSON.stringify(appliedChips)
  const allPresets = useMemo(() => [...PRESETS, ...customPresets], [customPresets])

  // Full row pool — use company data when config is available, otherwise schema mock data
  const rowPool      = useMemo(() =>
    companyConfig?.companyName
      ? generateCompanyRows(companyConfig)
      : generateRows(schemaId),
  [schemaId, companyConfig])
  const filteredPool = useMemo(() => runFilters(appliedChips, searchText, rowPool), [appliedChips, searchText, rowPool])

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
    setAppliedChips(chips)
  }

  function loadPreset(id) {
    setSelectedPreset(id)
    const newChips = !id
      ? []
      : (allPresets.find(p => p.id === id)?.filters.map(f => ({ ...f, id: _chipId++ })) ?? [])
    setChips(newChips)
  }

  function openPopover(id, el) {
    const r = el.getBoundingClientRect()
    setActivePopover({ id, anchor: { x: r.left, y: r.bottom + 6 } })
    if (id === 'new') {
      setEditingChip({ field: '', operator: 'contains', value: '' })
    } else {
      const c = chips.find(x => x.id === id)
      if (c) setEditingChip({ field: c.field, operator: c.operator, value: c.value })
    }
  }

  function closePopover() { setActivePopover(null) }

  function donePopover() {
    if (!editingChip.field || !editingChip.value.trim()) { closePopover(); return }
    if (activePopover.id === 'new') {
      setChips(c => [...c, { id: _chipId++, ...editingChip }])
    } else {
      setChips(c => c.map(x => x.id === activePopover.id ? { ...x, ...editingChip } : x))
    }
    closePopover()
  }

  function removeChip(id) { setChips(c => c.filter(x => x.id !== id)) }

  function addInlineRow() {
    setChips(c => [...c, { id: _chipId++, field: '', operator: 'contains', value: '' }])
    setFilterExpanded(true)
  }
  function updateInlineRow(id, patch) {
    setChips(c => c.map(x => x.id === id ? { ...x, ...patch } : x))
  }
  function resetToDefaults() {
    setChips([])
    setAppliedChips([])
    setSelectedPreset('')
    setQueryText('')
  }
  function applyRows() { setAppliedChips(chips) }

  const MAX_INLINE_CHIPS = 1

  const left = isMobile ? 0 : sidebarWidth

  return (
    <div
      data-inspector="DataPage"
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
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>Data</span>
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
          <Button variant="ghost" size="sm" onClick={openColumnsModal}>Add columns</Button>
          <Button size="sm">Upload</Button>
          <Button variant="ghost" size="sm" leftIcon={<MoreIcon />} />
        </div>
      </div>

      {/* ── Filter Strip — collapsible pill ──────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
        margin: '8px 16px 0',
        background: 'var(--bg-sidebar)',
        border: 'var(--page-header-border)',
        borderRadius: 12,
        boxShadow: 'var(--page-header-shadow)',
        overflow: 'hidden',
      }}>
        {/* Top row — always visible */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 14px', height: 56,
        }}>
          <span style={{
            fontSize: 'var(--type-p14)', fontWeight: 600, color: 'var(--text-primary)',
            fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
          }}>Preset</span>

          <PresetSelect
            options={[{ value: '', label: 'Select a preset' }, ...allPresets.map(p => ({ value: p.id, label: p.label }))]}
            value={selectedPreset}
            onChange={loadPreset}
          />

          <button
            onClick={() => loadPreset('')}
            disabled={!selectedPreset}
            style={{
              background: 'none', border: 'none',
              fontSize: 'var(--type-p14)',
              fontFamily: "'Byrd', sans-serif",
              color: selectedPreset ? 'var(--text-secondary)' : 'var(--text-muted)',
              cursor: selectedPreset ? 'pointer' : 'default',
              padding: 0,
              textDecoration: selectedPreset ? 'underline' : 'none',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 150ms ease',
            }}
            onMouseEnter={e => { if (selectedPreset) e.currentTarget.style.textDecorationColor = 'currentColor' }}
            onMouseLeave={e => { e.currentTarget.style.textDecorationColor = 'transparent' }}
          >
            Clear preset
          </button>

          {/* Applied chips inline */}
          <div className="smooth-scroll" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            flex: 1, overflowX: 'auto', overflowY: 'hidden',
            minWidth: 0, justifyContent: 'flex-end',
          }}>
            {appliedChips.slice(0, MAX_INLINE_CHIPS).map(chip => (
              <FilterChip
                key={chip.id}
                chip={chip}
                onEdit={() => setFilterExpanded(true)}
                onRemove={() => {
                  setAppliedChips(c => c.filter(x => x.id !== chip.id))
                  setChips(c => c.filter(x => x.id !== chip.id))
                }}
              />
            ))}
            {appliedChips.length > MAX_INLINE_CHIPS && (
              <span
                onClick={() => setFilterExpanded(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  height: 26, padding: '0 10px', borderRadius: 99,
                  background: 'var(--b20)', color: 'var(--b100)',
                  fontSize: 12, fontFamily: "'Byrd', sans-serif",
                  fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                }}
              >
                +{appliedChips.length - MAX_INLINE_CHIPS}
              </span>
            )}
          </div>

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setFilterExpanded(v => !v)}
            aria-label={filterExpanded ? 'Collapse filters' : 'Expand filters'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, flexShrink: 0,
              background: 'none', border: 'none', borderRadius: 8,
              cursor: 'pointer', color: 'var(--text-secondary)',
              transition: 'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ transition: 'transform 180ms ease', transform: filterExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M2 3l5 4 5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 8l5 4 5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Expanded body */}
        {filterExpanded && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            padding: '0 14px 14px',
            borderTop: '1px solid var(--border-default)',
            paddingTop: 14,
          }}>
            {/* Describe + Generate query */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 38, padding: '0 4px 0 12px',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-input)',
              borderRadius: 8,
            }}>
              <input
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                placeholder="Describe the data you want to filter…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 'var(--type-p14)', color: 'var(--text-primary)',
                  fontFamily: "'Byrd', sans-serif",
                }}
              />
              <button
                disabled={!queryText.trim()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 30, padding: '0 12px',
                  background: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  fontSize: 'var(--type-p14)',
                  fontFamily: "'Byrd', sans-serif",
                  color: queryText.trim() ? 'var(--b100)' : 'var(--text-muted)',
                  cursor: queryText.trim() ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.2 2.8L10 5l-2.8 1.2L6 9 4.8 6.2 2 5l2.8-1.2L6 1z" fill="currentColor" />
                </svg>
                Generate query
              </button>
            </div>

            {/* Editable filter rows */}
            {chips.map(chip => (
              <div key={chip.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <PresetSelect
                    fullWidth
                    options={[{ value: '', label: 'Field…' }, ...FILTER_FIELDS.map(f => ({ value: f.value, label: f.label }))]}
                    value={chip.field}
                    onChange={v => updateInlineRow(chip.id, { field: v })}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <PresetSelect
                    fullWidth
                    options={OPERATORS.map(op => ({ value: op.value, label: op.label }))}
                    value={chip.operator}
                    onChange={v => updateInlineRow(chip.id, { operator: v })}
                  />
                </div>
                <input
                  value={chip.value}
                  onChange={e => updateInlineRow(chip.id, { value: e.target.value })}
                  placeholder="Value…"
                  style={{
                    flex: 1, minWidth: 0,
                    height: 32, padding: '0 10px',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-input)',
                    borderRadius: 6,
                    fontSize: 'var(--type-p14)', color: 'var(--text-primary)',
                    fontFamily: "'Byrd', sans-serif",
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => removeChip(chip.id)}
                  aria-label="Remove filter"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 30, height: 30, flexShrink: 0,
                    background: 'none', border: 'none', borderRadius: 6,
                    cursor: 'pointer', color: 'var(--text-muted)',
                    fontSize: 18, lineHeight: 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >×</button>
              </div>
            ))}

            {/* Footer — Add Filter + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <button
                onClick={addInlineRow}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 32, padding: '0 12px',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 8,
                  fontSize: 'var(--type-p14)', color: 'var(--text-primary)',
                  fontFamily: "'Byrd', sans-serif",
                  cursor: 'pointer',
                }}
              >
                Add Filter <PlusIcon />
              </button>

              <div style={{ flex: 1 }} />

              <button
                onClick={resetToDefaults}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 'var(--type-p14)',
                  fontFamily: "'Byrd', sans-serif",
                  color: 'var(--c100)',
                  cursor: 'pointer', padding: '0 6px',
                }}
              >Reset to defaults</button>

              {selectedPreset && customPresets.some(p => p.id === selectedPreset)
                ? <Button variant="ghost" size="sm" onClick={updatePreset}>Update preset</Button>
                : <Button variant="ghost" size="sm" disabled={chips.length === 0} onClick={() => { setPresetNameDraft(''); setSaveModalOpen(true) }}>Save</Button>
              }

              <Button size="sm" variant="outline" onClick={applyRows} disabled={!isDirty}>Apply</Button>
            </div>
          </div>
        )}
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
          columnDefs={activeColDefs}
          defaultColDef={DEFAULT_COL_DEF}
          rowHeight={44}
          headerHeight={38}
          suppressCellFocus={false}
          context={{ onOpenCall }}
        />
      </div>

      {/* ── Filter popover (portal-style) ─────────────────────────────── */}
      {activePopover && (
        <FilterPopover
          anchor={activePopover.anchor}
          chip={editingChip}
          onChange={setEditingChip}
          onDone={donePopover}
          onClose={closePopover}
        />
      )}

      {/* ── Manage Columns modal ──────────────────────────────────────── */}
      <Modal
        open={columnsModalOpen}
        onClose={() => setColumnsModalOpen(false)}
        title="Manage Columns"
        width={560}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setColumnsModalOpen(false)}>Close</Button>
            <Button variant="outline" size="sm" onClick={applyColumns}>Apply</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Search */}
          <div style={{ padding: '4px 0 18px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              height: 44, padding: '0 16px',
              background: 'var(--bg-canvas)',
              border: '1.5px solid var(--border-input)',
              borderRadius: 999,
            }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}>
                <SearchIcon />
              </span>
              <input
                value={columnsSearch}
                onChange={e => setColumnsSearch(e.target.value)}
                placeholder="Search columns..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 'var(--type-p13)', color: 'var(--text-primary)',
                  fontFamily: "'Byrd', sans-serif",
                }}
              />
            </div>
          </div>

          {/* SIGNALS divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '6px 0 14px',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              fontFamily: "'Byrd', sans-serif",
            }}>Signals</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          </div>

          {/* Accordion groups */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            maxHeight: 420, overflowY: 'auto',
            margin: '0 -4px', padding: '0 4px',
          }}>
            {COLUMN_GROUPS.map((group, gi) => {
              const matchingFields = group.fields.filter(f => {
                const label = FIELD_LABELS[f] ?? f
                return label.toLowerCase().includes(columnsSearch.trim().toLowerCase())
              })
              if (matchingFields.length === 0) return null
              const isOpen      = expandedGroups.has(group.id) || columnsSearch.trim().length > 0
              const allChecked  = matchingFields.every(f => columnsDraft.includes(f))

              return (
                <div key={group.id} style={{
                  borderTop: gi === 0 ? 'none' : '1px solid var(--border-default)',
                  padding: '14px 0',
                }}>
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroupExpand(group.id)}
                    style={{
                      display: 'flex', alignItems: 'center', width: '100%',
                      background: 'none', border: 'none', padding: 0,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{
                      flex: 1,
                      fontSize: 'var(--type-p12)', fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: "'Byrd', sans-serif",
                    }}>{group.label}</span>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                      <ChevronDown open={isOpen} />
                    </span>
                  </button>

                  {/* Group body */}
                  {isOpen && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
                      {/* Select All */}
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border-default)',
                        marginBottom: 6,
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={() => {
                            if (allChecked) {
                              setColumnsDraft(v => v.filter(f => !matchingFields.includes(f)))
                            } else {
                              setColumnsDraft(v => {
                                const merged = [...v]
                                matchingFields.forEach(f => { if (!merged.includes(f)) merged.push(f) })
                                return merged
                              })
                            }
                          }}
                          style={{
                            width: 18, height: 18, accentColor: 'var(--b100)',
                            cursor: 'pointer', flexShrink: 0,
                          }}
                        />
                        <span style={{
                          fontSize: 'var(--type-p13)', color: 'var(--text-primary)',
                          fontFamily: "'Byrd', sans-serif",
                        }}>Select All</span>
                      </label>

                      {/* Items */}
                      {matchingFields.map(field => {
                        const checked = columnsDraft.includes(field)
                        return (
                          <label
                            key={field}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '7px 0',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDraftField(field)}
                              style={{
                                width: 18, height: 18, accentColor: 'var(--b100)',
                                cursor: 'pointer', flexShrink: 0,
                              }}
                            />
                            <span style={{
                              fontSize: 'var(--type-p13)', color: 'var(--text-primary)',
                              fontFamily: "'Byrd', sans-serif",
                              textTransform: 'capitalize',
                            }}>
                              {(FIELD_LABELS[field] ?? field).toLowerCase()}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Empty state for search */}
            {COLUMN_GROUPS.every(g => g.fields.every(f => {
              const label = FIELD_LABELS[f] ?? f
              return !label.toLowerCase().includes(columnsSearch.trim().toLowerCase())
            })) && (
              <div style={{
                padding: '32px 12px', textAlign: 'center',
                fontSize: 'var(--type-p14)', color: 'var(--text-muted)',
                fontFamily: "'Byrd', sans-serif",
              }}>
                No columns match "{columnsSearch}"
              </div>
            )}
          </div>
        </div>
      </Modal>

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
                const fl = FILTER_FIELDS.find(f => f.value === c.field)?.label ?? c.field
                return `${fl}: ${c.value}`
              }).join(' · ')}
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}
