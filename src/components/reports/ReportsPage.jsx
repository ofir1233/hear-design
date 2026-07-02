import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'
import PageHeader from '../PageHeader.jsx'
import Button from '../Button.jsx'
import Badge from '../Badge.jsx'
import { DotsIcon } from '../icons/index.jsx'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ── AG Grid setup (mirrors AlertsPage) ───────────────────────────────────────

ModuleRegistry.registerModules([AllCommunityModule])

const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 14,
  cellHorizontalPaddingScale: 1.15,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:               '#FFFFFF',
  foregroundColor:               '#181818',
  headerBackgroundColor:         '#FFFFFF',
  headerTextColor:               '#606060',
  borderColor:                   '#E5E7EB',
  rowHoverColor:                 '#E8E8E6',
  selectedRowBackgroundColor:    'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:         '#F9F9F7',
  headerColumnResizeHandleColor: '#D1D5DB',
})
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  ...THEME_PARAMS,
  backgroundColor:               '#242424',
  foregroundColor:               '#F4F3F1',
  headerBackgroundColor:         '#242424',
  headerTextColor:               '#9B9B9B',
  borderColor:                   '#333333',
  rowHoverColor:                 '#2A2A2A',
  selectedRowBackgroundColor:    'rgba(23,121,247,0.12)',
  oddRowBackgroundColor:         '#202020',
  headerColumnResizeHandleColor: '#444444',
})

function useIsDark() {
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.dataset.theme === 'dark'))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

// ── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.4 3.9L13 6l-3.6 1.1L8 11 6.6 7.1 3 6l3.6-1.1L8 1z" fill="currentColor" />
      <path d="M13 10.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

function CopyIcon12() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2H4A1.5 1.5 0 002.5 3.5V9A1.5 1.5 0 004 10.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon12() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5l6 2.2v4.6c0 3.4-2.5 6.1-6 6.9-3.5-.8-6-3.5-6-6.9V4.7l6-2.2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function ApertureIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 2.8v7.2l5.1 5.1M17.2 10h-7.2L4.9 15.1M2.8 10h7.2L15.1 4.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

// icons for the actions menu
function RunIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 3l9 5-9 5V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
}
function EditIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M11 2.5l2.5 2.5M2.5 13.5L3 11l7.5-7.5 2.5 2.5L5.5 13.5 2.5 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function HistoryIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 4v4l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.6 8a5.4 5.4 0 105.4-5.4A5.4 5.4 0 003.2 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M2.6 2.6V5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function TrashIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4V2.5h3V4M4.5 4.5l.5 8.5a1 1 0 001 1h4a1 1 0 001-1l.5-8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

// ── Mock data (ExtendedReport) ───────────────────────────────────────────────

const REPORTS = [
  { _id: '694d64ceefa95f9cc2abadb3', title: 'Daily trends report',                  is_active: false, aiGenerated: true,  kind: 'trends',     updated_at: null,                  last_run_at: '03/11/2026 07:32', created_by_name: 'System', report_has_run: true },
  { _id: '695ba702efa95f9cc2abae06', title: 'Weekly trends report',                 is_active: false, aiGenerated: true,  kind: 'trends',     updated_at: null,                  last_run_at: '03/08/2026 06:15', created_by_name: 'System', report_has_run: true },
  { _id: '695ba722efa95f9cc2abae07', title: 'Monthly trends report',                is_active: true,  aiGenerated: true,  kind: 'trends',     updated_at: null,                  last_run_at: '07/01/2026 05:00', created_by_name: 'System', report_has_run: true },
  { _id: '69b994d55c386b25c10c17cc', title: 'Monthly Compliance Violations by CS',  is_active: true,  aiGenerated: false, kind: 'compliance', updated_at: '03/22/2026 10:06:52', last_run_at: '07/01/2026 02:30', created_by_name: 'Anouk Berger', report_has_run: true },
  { _id: '69bae78d60ec7fa0284b8b9c', title: "Weekly Agent's Violations Report",     is_active: true,  aiGenerated: false, kind: 'compliance', updated_at: '03/22/2026 08:11:05', last_run_at: '06/29/2026 09:45', created_by_name: 'Anouk Berger', report_has_run: true },
]

const ACTIVE_QUOTA = { current: 2, limit: 20 }

// ── Small shared pieces ───────────────────────────────────────────────────────

function ActiveToggle({ checked, disabled, onClick }) {
  return (
    <button role="switch" aria-checked={checked} disabled={disabled} onClick={onClick} style={{
      width: 34, height: 20, borderRadius: 99, border: 'none', padding: 0, position: 'relative', flexShrink: 0,
      background: checked ? 'var(--b100)' : 'var(--border-default)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background 200ms ease',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: checked ? 17 : 3, width: 14, height: 14, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.25)', transition: 'left 200ms ease',
      }} />
    </button>
  )
}

function AiGeneratedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px', borderRadius: 5,
      background: 'var(--b20)', color: 'var(--badge-cobalt-text)', flexShrink: 0,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>
      <SparkleIcon size={11} /> AI Generated
    </span>
  )
}

// ── Cell renderers ────────────────────────────────────────────────────────────

function ActiveToggleCellRenderer(params) {
  const r = params.data
  const [busy, setBusy] = useState(false)
  if (!r) return null
  const click = () => { if (busy) return; setBusy(true); params.onToggle(r); setTimeout(() => setBusy(false), 350) }
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <ActiveToggle checked={r.is_active} disabled={busy} onClick={click} />
    </div>
  )
}

function ReportIdCellRenderer(params) {
  const r = params.data
  const [copied, setCopied] = useState(false)
  const [hover, setHover] = useState(false)
  if (!r) return null
  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(r._id).catch(() => {})
    setCopied(true); params.onCopyToast?.('Report ID copied to clipboard'); setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, height: '100%', minWidth: 0 }}>
      {r.aiGenerated && <AiGeneratedBadge />}
      <span style={{ fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r._id}</span>
      <button onClick={copy} title="Copy report ID" aria-label="Copy report ID" style={{
        display: 'flex', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', flexShrink: 0,
        color: copied ? 'var(--g100)' : 'var(--text-muted)', opacity: copied || hover ? 1 : 0, transition: 'opacity 120ms ease',
      }}>
        {copied ? <CheckIcon12 /> : <CopyIcon12 />}
      </button>
    </div>
  )
}

function NameCellRenderer(params) {
  const r = params.data
  if (!r) return null
  const Icon = r.kind === 'compliance' ? ApertureIcon : ShieldIcon
  const clickable = r.report_has_run
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: '100%', minWidth: 0 }}>
      <span title={r.kind === 'compliance' ? 'AI Generated Report' : 'System Report'} style={{ color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}><Icon /></span>
      <span
        onClick={clickable ? () => navigate(`/reports/talk/${r._id}`) : undefined}
        title={r.title}
        style={{
          fontSize: 14, fontWeight: 600, color: clickable ? 'var(--b100)' : 'var(--text-secondary)',
          cursor: clickable ? 'pointer' : 'default', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
        onMouseEnter={e => { if (clickable) e.currentTarget.style.textDecoration = 'underline' }}
        onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
      >{r.title}</span>
    </div>
  )
}

function DateCellRenderer(params) {
  if (params.data == null) return null
  return params.value
    ? <span style={{ color: 'var(--text-secondary)' }}>{params.value}</span>
    : <span style={{ color: 'var(--text-muted)' }}>-</span>
}

function CreatedByCellRenderer(params) {
  if (params.data == null) return null
  return <span style={{ color: 'var(--text-secondary)' }}>{params.value || 'N/A'}</span>
}

function ActionsCellRenderer(params) {
  const r = params.data
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const openMenu = () => {
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left })
    setOpen(true)
  }
  useEffect(() => {
    if (!open) return
    const onDown = e => { if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return; setOpen(false) }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', close); window.addEventListener('scroll', close, true)
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true) }
  }, [open])
  if (!r) return null

  const trends = r.kind === 'trends'
  const items = [
    !trends && { key: 'run', label: 'Run', Icon: RunIcon, onClick: () => params.onCopyToast?.(`Running "${r.title}"…`) },
    { key: 'edit', label: trends ? 'View' : 'Edit', Icon: EditIcon, onClick: () => navigate(`/reports/edit/${r._id}`) },
    !trends && { key: 'history', label: 'History', Icon: HistoryIcon, onClick: () => navigate(`/reports/history/${r._id}`) },
    !trends && { key: 'delete', label: 'Delete', Icon: TrashIcon, danger: true, onClick: () => params.onDelete?.(r) },
  ].filter(Boolean)

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <button ref={btnRef} onClick={() => (open ? setOpen(false) : openMenu())} aria-label="Actions" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: 'none',
        background: open ? 'var(--bg-active)' : 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 120ms ease',
      }}>
        <DotsIcon />
      </button>
      {open && pos && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 10002, minWidth: 160, padding: 4, borderRadius: 10,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
        }}>
          {items.map(({ key, label, Icon, onClick, danger }) => (
            <button key={key} onClick={() => { setOpen(false); onClick() }} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px', borderRadius: 6,
              border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
              fontSize: 13, fontFamily: "'Byrd', sans-serif", color: danger ? 'var(--red100)' : 'var(--text-primary)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(229,72,77,0.08)' : 'var(--bg-active)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: danger ? 'var(--red100)' : 'var(--text-muted)', display: 'flex' }}><Icon /></span>
              {label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

// ── Quota pill (header) ─────────────────────────────────────────────────────────

function QuotaPill({ current, limit }) {
  const pct = Math.min(100, (current / limit) * 100)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, height: 22, padding: '0 10px', borderRadius: 99,
      background: 'var(--badge-cobalt-fill)', color: 'var(--badge-cobalt-text)', fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 34, height: 5, borderRadius: 99, background: 'rgba(23,121,247,0.2)', overflow: 'hidden', flexShrink: 0 }}>
        <span style={{ display: 'block', width: `${pct}%`, height: '100%', background: 'var(--b100)', borderRadius: 99 }} />
      </span>
      {current} / {limit}
    </span>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

const ROW_H = 41
const HEADER_H = 56

function ReportsTable({ reports, onToggle, onCopyToast, onDelete }) {
  const isDark = useIsDark()

  const colDefs = useMemo(() => [
    { headerName: '', width: 56, valueGetter: p => (p.node?.rowIndex ?? 0) + 1, cellStyle: { color: 'var(--text-muted)' }, sortable: false, resizable: false, suppressMovable: true },
    { headerName: 'Active', width: 90, cellRenderer: ActiveToggleCellRenderer, cellRendererParams: { onToggle }, sortable: false },
    { headerName: 'Actions', width: 90, cellRenderer: ActionsCellRenderer, cellRendererParams: { onCopyToast, onDelete }, sortable: false, resizable: false },
    { field: '_id', headerName: 'Report ID', flex: 1.2, minWidth: 340, cellRenderer: ReportIdCellRenderer, cellRendererParams: { onCopyToast } },
    { field: 'title', headerName: 'Name', flex: 1, minWidth: 300, cellRenderer: NameCellRenderer },
    { field: 'updated_at', headerName: 'Updated At', width: 190, cellRenderer: DateCellRenderer },
    { field: 'last_run_at', headerName: 'Last Run At', width: 190, cellRenderer: DateCellRenderer },
    { field: 'created_by_name', headerName: 'Created by', flex: 0.7, minWidth: 150, cellRenderer: CreatedByCellRenderer },
  ], [onToggle, onCopyToast, onDelete])

  const gridHeight = HEADER_H + Math.max(reports.length, 3) * ROW_H + 2

  return (
    <div className="hear-grid reports-grid" style={{
      height: gridHeight, width: '100%', borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--border-default)', background: 'var(--bg-card)',
    }}>
      <AgGridReact
        theme={isDark ? darkTheme : lightTheme}
        className="hear-grid"
        rowData={reports}
        columnDefs={colDefs}
        defaultColDef={{ resizable: true, sortable: false, suppressHeaderMenuButton: true }}
        rowHeight={ROW_H}
        headerHeight={HEADER_H}
        suppressCellFocus
        getRowId={p => p.data._id}
        overlayNoRowsTemplate="No reports yet"
      />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────────

export default function ReportsPage({ isMobile = false, sidebarWidth = 272, sidebarTransition = 'none', companyConfig = null }) {
  const [reports, setReports] = useState(REPORTS)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const left = isMobile ? 0 : sidebarWidth

  const showToast = useCallback((msg) => {
    setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const handleToggle = useCallback((r) => {
    setReports(prev => prev.map(x => x._id === r._id ? { ...x, is_active: !x.is_active } : x))
    showToast('Report updated successfully')
  }, [showToast])

  const handleDelete = useCallback((r) => {
    setReports(prev => prev.filter(x => x._id !== r._id))
    showToast(`Deleted "${r.title}"`)
  }, [showToast])

  return (
    <div data-inspector="ReportsPage" style={{
      position: 'fixed', top: 0, left, right: 0, bottom: 0,
      background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: sidebarTransition,
    }}>
      <PageHeader
        title="Reports"
        crumbs={companyConfig?.companyName ? [companyConfig.companyName] : []}
        badge={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Badge variant="tinted" color="cobalt" shape="pill">Total Reports&nbsp;{reports.length}</Badge>
            <QuotaPill current={ACTIVE_QUOTA.current} limit={ACTIVE_QUOTA.limit} />
          </span>
        }
        actions={<Button size="sm" leftIcon={<PlusIcon />} onClick={() => navigate('/reports/create')}>Create Report</Button>}
      />

      <div className="smooth-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ padding: '20px 16px 40px' }}>
          <ReportsTable reports={reports} onToggle={handleToggle} onCopyToast={showToast} onDelete={handleDelete} />
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 10001,
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8,
          background: 'var(--text-primary)', color: 'var(--text-inverse)', fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
