import { useState, useEffect, useMemo } from 'react'
import Button from '../Button'
import ReactApexChart from 'react-apexcharts'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

// ── AG Grid themes ────────────────────────────────────────────────────────────

const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 13,
  cellHorizontalPaddingScale: 1.1,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#FFFFFF',
  foregroundColor:            '#181818',
  headerBackgroundColor:      '#F5F5F3',
  headerTextColor:            '#606060',
  borderColor:                '#E5E7EB',
  rowHoverColor:              '#E8E8E6',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:      '#FFFFFF',
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

// ── Mock data ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  'Champion Booking',
  'Champion Service',
  'Champion Sales',
  'New Vehicle Intake',
  'AutoDeal Sales',
  'Fresh Sales',
  'BYD Sales',
  'Good Correspondence',
]

// Foundation palette tokens resolved to hex (b, c, g, l, t, h, s, b60)
const CHART_COLORS = ['#1779F7','#FF7056','#4BA373','#D799E2','#455F61','#6E95A0','#B09495','#74AFFA']

// Generate sparse bar chart data — 3 clusters across ~30 days
function generateChartSeries(projects) {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 0, 1 + i)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
  })

  const series = projects.map((name, pi) => ({
    name,
    data: dates.map((_, di) => {
      // Three activity clusters
      if ((di >= 8 && di <= 10) || (di >= 18 && di <= 22) || (di >= 26 && di <= 29)) {
        return Math.round((Math.random() * 0.7 + 0.05) * 900 * (pi % 3 === 0 ? 0.3 : pi % 3 === 1 ? 0.8 : 0.5))
      }
      return 0
    }),
  }))

  return { dates, series }
}

// Generate table rows
function generateTableRows(projects) {
  return projects.map((name, i) => {
    const totalCalls   = parseFloat((Math.random() * 0.9 + 0.01).toFixed(2))
    const totalMinutes = parseFloat((totalCalls * (Math.random() * 4 + 1)).toFixed(2))
    const prevPeriod   = parseFloat((totalMinutes * (Math.random() * 1.5 + 0.8)).toFixed(2))
    const trend        = parseFloat((((totalMinutes - prevPeriod) / prevPeriod) * 100).toFixed(1))
    return {
      rank:        i + 1,
      name,
      totalCalls:  `${totalCalls}K`,
      totalMinutes:`${totalMinutes}K`,
      prevPeriod:  `${prevPeriod}K`,
      trend,
    }
  })
}

// ── Cell renderers ────────────────────────────────────────────────────────────

function TrendCell({ value }) {
  const up = value > 0
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: up ? '#4ADE80' : '#F87171', fontWeight: 500 }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {up
          ? <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
      {up ? '+' : ''}{value}%
    </span>
  )
}

// ── Date range picker ─────────────────────────────────────────────────────────

function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ from, to })

  function fmt(iso) {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  function apply() {
    onChange(draft)
    setOpen(false)
  }

  const label = from && to ? `${fmt(from)} - ${fmt(to)}` : 'Select date range'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setDraft({ from, to }); setOpen(o => !o) }}
        style={{
          height: 40, padding: '0 14px',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
          borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif", outline: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M1 5.5h12M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 12, padding: '16px', width: '100%', boxSizing: 'border-box',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              From
            </label>
            <input
              type="date"
              value={draft.from}
              onChange={e => setDraft(d => ({ ...d, from: e.target.value }))}
              style={{
                height: 36, padding: '0 10px',
                background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
                borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              To
            </label>
            <input
              type="date"
              value={draft.to}
              min={draft.from}
              onChange={e => setDraft(d => ({ ...d, to: e.target.value }))}
              style={{
                height: 36, padding: '0 10px',
                background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
                borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
                fontFamily: "'Byrd', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" disabled={!draft.from || !draft.to} onClick={apply}>Apply</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Project filter ────────────────────────────────────────────────────────────

function ProjectFilter({ projects, selected, onChange }) {
  const [open, setOpen] = useState(false)

  function toggle(p) {
    onChange(selected.includes(p) ? selected.filter(x => x !== p) : [...selected, p])
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 40, padding: '0 14px',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
          borderRadius: 8, fontSize: 13, color: selected.length ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: "'Byrd', sans-serif", outline: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, minWidth: 180,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span style={{ flex: 1, textAlign: 'left' }}>
          {selected.length === 0 ? 'All Projects' : selected.length === 1 ? selected[0] : `${selected.length} projects`}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 10, padding: '6px 0', minWidth: 220,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        }}>
          <button
            onClick={() => { onChange([]); setOpen(false) }}
            style={{
              width: '100%', padding: '8px 14px', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif",
            }}
          >
            All Projects
          </button>
          <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
          {projects.map(p => (
            <button
              key={p}
              onClick={() => toggle(p)}
              style={{
                width: '100%', padding: '8px 14px', textAlign: 'left',
                background: selected.includes(p) ? 'var(--bg-active)' : 'none',
                border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: `1.5px solid ${selected.includes(p) ? 'var(--b100)' : 'var(--border-input)'}`,
                background: selected.includes(p) ? 'var(--b100)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selected.includes(p) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </span>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Bar chart ─────────────────────────────────────────────────────────────────

function UsageChart({ series, dates, isDark }) {
  // Only keep dates that have at least one non-zero value across all series
  const activeDateIndices = dates.reduce((acc, _, i) => {
    if (series.some(s => s.data[i] > 0)) acc.push(i)
    return acc
  }, [])
  const filteredDates  = activeDateIndices.map(i => dates[i])
  const filteredSeries = series.map(s => ({ ...s, data: activeDateIndices.map(i => s.data[i]) }))

  // minWidth = active dates × projects × bar width gives enough breathing room
  const scrollMinWidth = Math.max(800, filteredDates.length * series.length * 14)

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: true, tools: { zoom: true, zoomin: true, zoomout: true, pan: true, reset: true, download: true } },
      zoom: { enabled: true, type: 'x' },
      background: 'transparent',
      fontFamily: "'Byrd', sans-serif",
      animations: { enabled: false },
      stacked: false,
      scrollablePlotArea: {
        minWidth: scrollMinWidth,
        scrollbarHeight: 6,
      },
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: CHART_COLORS,
    plotOptions: {
      bar: { columnWidth: '60%', borderRadius: 2 },
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.1 } },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: filteredDates,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px', colors: '#9B9B9B' }, rotate: -30 },
    },
    yaxis: {
      title: {
        text: 'Total Minutes',
        style: { fontSize: '12px', color: '#9B9B9B', fontFamily: "'Byrd', sans-serif", fontWeight: 600 },
      },
      labels: {
        formatter: v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : `${v}`,
        style: { fontSize: '11px', colors: '#9B9B9B' },
      },
    },
    grid: {
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 0, right: 8, top: 8, bottom: 0 },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'bottom',
      fontFamily: "'Byrd', sans-serif",
      fontSize: '12px',
      markers: { width: 12, height: 12, radius: 3 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: v => `${v} min` },
    },
    title: {
      text: 'Time Unit - Day',
      style: { fontSize: '15px', fontWeight: '700', fontFamily: "'Byrd', sans-serif", color: isDark ? '#F4F3F1' : '#181818' },
    },
  }

  return (
    <div style={{
      border: '1px solid var(--border-default)', borderRadius: 10,
      background: 'var(--bg-canvas)', padding: '20px 20px 8px',
      overflow: 'hidden',
    }}>
      <ReactApexChart options={options} series={filteredSeries} type="bar" height={400} />
    </div>
  )
}

// ── UsagePage ─────────────────────────────────────────────────────────────────

export default function UsagePage({ isDark = false }) {
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-06' })
  const [selectedProjects, setSelected] = useState([])

  const [localDark, setLocalDark] = useState(isDark)
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setLocalDark(document.documentElement.dataset.theme === 'dark')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const activeProjects = selectedProjects.length > 0 ? selectedProjects : PROJECTS
  const { dates, series } = useMemo(() => generateChartSeries(activeProjects), [activeProjects])
  const tableRows         = useMemo(() => generateTableRows(activeProjects), [activeProjects])

  const colDefs = useMemo(() => [
    { field: 'rank',         headerName: '#',               width: 60,  sortable: false },
    { field: 'name',         headerName: 'Project Name',    flex: 1,    minWidth: 160, sortable: true, filter: true },
    { field: 'totalCalls',   headerName: 'Total Calls',     width: 130, sortable: true },
    { field: 'totalMinutes', headerName: 'Total Minutes',   width: 140, sortable: true },
    { field: 'prevPeriod',   headerName: 'Previous Period', width: 150, sortable: true },
    { field: 'trend',        headerName: 'Trend',           width: 110, sortable: true, cellRenderer: TrendCell },
  ], [])

  const defaultColDef = useMemo(() => ({ resizable: true }), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={setDateRange} />
        <ProjectFilter
          projects={PROJECTS}
          selected={selectedProjects}
          onChange={setSelected}
        />
      </div>

      {/* Chart */}
      <UsageChart series={series} dates={dates} isDark={localDark} />

      {/* Table */}
      <div style={{
        border: '1px solid var(--border-default)', borderRadius: 10,
        overflow: 'hidden', background: 'var(--bg-canvas)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Projects Breakdown
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Usage per project for the selected period
          </p>
        </div>
        <div style={{ height: 380 }}>
          <AgGridReact
            theme={localDark ? darkTheme : lightTheme}
            rowData={tableRows}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowHeight={44}
            headerHeight={38}
            suppressCellFocus
          />
        </div>
      </div>

    </div>
  )
}
