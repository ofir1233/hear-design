/**
 * Organisms/OmniBar
 *
 * Tier: Organism — filter input bar for DataPage.
 * Two-step field → value suggestion dropdown. Token pills slide in on the right.
 */
import { useState } from 'react'
import OmniBar from '../../data/OmniBar.jsx'
import { SCHEMAS } from '../../data/mockData.js'

export default {
  title: 'Organisms/OmniBar',
  component: OmniBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Filter input bar used in DataPage. ' +
          'Two-step suggestion dropdown: type to see field names, select a field to see value suggestions. ' +
          'Active filters render as `slideInRight` token pills on the right. ' +
          'Schema-aware — suggestions come from the active schema\'s attribute definitions.',
      },
    },
  },
}

function OmniBarDemo({ schemaId = 'acme' }) {
  const schema = SCHEMAS[schemaId]
  const [filters, setFilters] = useState([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <OmniBar
        schema={schema}
        filters={filters}
        onFiltersChange={setFilters}
        onRemoveFilter={id => setFilters(f => f.filter(x => x.id !== id))}
      />
      {filters.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Active: {JSON.stringify(filters.map(f => `${f.field}=${f.value}`))}
        </div>
      )}
    </div>
  )
}

export const AcmeSchema = {
  render: () => <OmniBarDemo schemaId="acme" />,
  parameters: {
    docs: { description: { story: 'Acme Corp schema — Risk, Topic, CSAT, Language fields.' } },
  },
}

export const GlobalBankSchema = {
  render: () => <OmniBarDemo schemaId="globalbank" />,
  parameters: {
    docs: { description: { story: 'GlobalBank schema — Compliance, Regulation, Violation fields.' } },
  },
}

export const MedCoSchema = {
  render: () => <OmniBarDemo schemaId="medco" />,
  parameters: {
    docs: { description: { story: 'MedCo schema — PHI flag, ICD-10, Appointment type fields.' } },
  },
}
