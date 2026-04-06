import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community'
import Button from '../Button'
import Badge from '../Badge'

ModuleRegistry.registerModules([AllCommunityModule])

// ── AG Grid themes (matching DataPage) ────────────────────────────────────────

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

// ── Shared primitives ─────────────────────────────────────────────────────────

const inputBase = {
  boxSizing: 'border-box',
  height: 36, padding: '0 12px',
  background: 'var(--bg-canvas)', border: '1px solid var(--border-input)',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}
function focusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function blurBorder(e)  { e.currentTarget.style.borderColor = 'var(--border-input)' }

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="4.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 8.5h19" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="4" y="12" width="4" height="2" rx="1" fill="currentColor" opacity=".5"/>
    </svg>
  )
}

function VisaIcon() {
  return (
    <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
      <rect width="36" height="22" rx="4" fill="#1A1F71"/>
      <text x="5" y="15" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#FFFFFF">VISA</text>
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
      <rect width="36" height="22" rx="4" fill="#252525"/>
      <circle cx="14" cy="11" r="7" fill="#EB001B"/>
      <circle cx="22" cy="11" r="7" fill="#F79E1B"/>
      <path d="M18 5.5a7 7 0 010 11A7 7 0 0118 5.5z" fill="#FF5F00"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CARDS = [
  { id: 1, type: 'visa',       last4: '4242', expiry: '08 / 27', isDefault: true  },
  { id: 2, type: 'mastercard', last4: '5555', expiry: '03 / 26', isDefault: false },
]

const MOCK_INVOICES = [
  { id: 'INV-0041', date: 'Apr 1, 2026',  amount: '$149.00', status: 'Paid'   },
  { id: 'INV-0040', date: 'Mar 1, 2026',  amount: '$149.00', status: 'Paid'   },
  { id: 'INV-0039', date: 'Feb 1, 2026',  amount: '$149.00', status: 'Paid'   },
  { id: 'INV-0038', date: 'Jan 1, 2026',  amount: '$149.00', status: 'Failed' },
]

const PLAN_QUOTAS = [
  { name: 'Reports',               description: 'Automated reports delivered on a recurring schedule to keep your team informed.',                       limit: 90,   unit: 'PER PROJECT' },
  { name: 'Alerts',                description: 'Real-time monitoring rules that trigger notifications based on your defined conditions.',               limit: 13,   unit: 'PER PROJECT' },
  { name: 'Signals',               description: 'Custom analytical indicators used to track and measure specific patterns in your data.',                limit: 14,   unit: 'PER PROJECT' },
  { name: 'Items per Signal Group',description: 'Maximum number of individual items that can be grouped within a single signal group.',                  limit: 50,   unit: 'PER PROJECT' },
  { name: 'Knowledge Documents',   description: 'Reference documents uploaded to the knowledge base for AI-powered search and retrieval.',              limit: 19,   unit: 'PER PROJECT' },
  { name: 'Alert Emails',          description: 'Monitor alert notification emails sent to recipients each calendar month.',                             limit: 5000, unit: 'PER MONTH'   },
]

// ── Card form ─────────────────────────────────────────────────────────────────

function AddCardForm({ onAdd }) {
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc]       = useState('')

  function formatNumber(v) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0,2)} / ${d.slice(2)}` : d
  }

  function handleAdd() {
    if (number.replace(/\s/g,'').length < 16 || expiry.length < 7 || cvc.length < 3) return
    onAdd()
    setNumber(''); setExpiry(''); setCvc('')
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px',
      border: '1px solid var(--border-default)', borderRadius: 10,
      background: 'var(--bg-canvas)',
    }}>
      <div style={{ color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <CardIcon />
      </div>
      <input
        value={number}
        onChange={e => setNumber(formatNumber(e.target.value))}
        placeholder="Card number"
        style={{ ...inputBase, flex: 1, minWidth: 120 }}
        onFocus={focusBorder} onBlur={blurBorder}
      />
      <input
        value={expiry}
        onChange={e => setExpiry(formatExpiry(e.target.value))}
        placeholder="MM / YY"
        style={{ ...inputBase, width: 90 }}
        onFocus={focusBorder} onBlur={blurBorder}
      />
      <input
        value={cvc}
        onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))}
        placeholder="CVC"
        style={{ ...inputBase, width: 70 }}
        onFocus={focusBorder} onBlur={blurBorder}
      />
      <Button variant="primary" size="md" onClick={handleAdd}>Add Card</Button>
    </div>
  )
}

// ── Saved card row ────────────────────────────────────────────────────────────

function CardRow({ card, onRemove, onSetDefault }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px',
        background: 'var(--bg-canvas)', transition: 'background 100ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-canvas)' }}
    >
      <div style={{ flexShrink: 0 }}>
        {card.type === 'visa' ? <VisaIcon /> : <MastercardIcon />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          •••• •••• •••• {card.last4}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", marginLeft: 12 }}>
          Expires {card.expiry}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {card.isDefault ? (
          <Badge variant="tinted" color="cobalt">Default</Badge>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => onSetDefault(card.id)}>Set default</Button>
        )}
        <Button variant="ghost" size="sm" leftIcon={<TrashIcon />} onClick={() => onRemove(card.id)} />
      </div>
    </div>
  )
}

// ── Invoices AG Grid ──────────────────────────────────────────────────────────

function StatusCell({ value }) {
  return <Badge variant="tinted" color={value === 'Paid' ? 'green' : 'coral'}>{value}</Badge>
}

function DownloadCell() {
  return <Button variant="ghost" size="sm" onClick={() => {}}>Download</Button>
}

function InvoicesGrid({ invoices, isDark }) {
  const colDefs = useMemo(() => [
    { field: 'id',     headerName: 'Invoice',  width: 140, sortable: true  },
    { field: 'date',   headerName: 'Date',     width: 150, sortable: true  },
    { field: 'amount', headerName: 'Amount',   width: 120, sortable: true  },
    { field: 'status', headerName: 'Status',   width: 130, cellRenderer: StatusCell },
    { field: 'pdf',    headerName: 'PDF',      width: 130, cellRenderer: DownloadCell, sortable: false },
  ], [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: false,
  }), [])

  return (
    <div style={{ height: 240 }}>
      <AgGridReact
        theme={isDark ? darkTheme : lightTheme}
        rowData={invoices}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowHeight={44}
        headerHeight={38}
        suppressCellFocus
      />
    </div>
  )
}

// ── Plan Quotas ───────────────────────────────────────────────────────────────

function QuotaRow({ quota, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
    }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
          {quota.name}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          {quota.description}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif", lineHeight: 1 }}>
          {quota.limit.toLocaleString()}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {quota.unit}
        </p>
      </div>
    </div>
  )
}

// ── BillingPage ───────────────────────────────────────────────────────────────

export default function BillingPage({ isDark = false }) {
  const [cards, setCards]       = useState(MOCK_CARDS)
  const [invoices]              = useState(MOCK_INVOICES)
  const [showForm, setShowForm] = useState(false)

  function removeCard(id)    { setCards(c => c.filter(x => x.id !== id)) }
  function setDefault(id)    { setCards(c => c.map(x => ({ ...x, isDefault: x.id === id }))) }
  function handleAddCard()   { setShowForm(false) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Payment Methods */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-canvas)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
              Payment Methods
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
              Manage your saved cards
            </p>
          </div>
          {!showForm && (
            <Button
              variant="secondary" size="sm"
              rightIcon={<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              onClick={() => setShowForm(true)}
            >
              Add Card
            </Button>
          )}
        </div>

        {cards.length === 0 && !showForm && (
          <div style={{ padding: '20px' }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
              No payment methods found. Add a payment method to continue.
            </p>
          </div>
        )}

        {cards.map((card, i) => (
          <div key={card.id}>
            {i > 0 && <Divider />}
            <CardRow card={card} onRemove={removeCard} onSetDefault={setDefault} />
          </div>
        ))}

        {showForm && (
          <div style={{ padding: '16px 20px', borderTop: cards.length ? '1px solid var(--border-default)' : 'none' }}>
            <AddCardForm onAdd={handleAddCard} />
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-canvas)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Invoices
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Your billing history and downloadable receipts
          </p>
        </div>
        <InvoicesGrid invoices={invoices} isDark={isDark} />
      </div>

      {/* Plan Quotas */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-canvas)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Plan Quotas
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
            Resource limits set per organization. These quotas define the maximum number of each entity you can create.
          </p>
        </div>
        {PLAN_QUOTAS.map((quota, i) => (
          <QuotaRow key={quota.name} quota={quota} last={i === PLAN_QUOTAS.length - 1} />
        ))}
      </div>

    </div>
  )
}
