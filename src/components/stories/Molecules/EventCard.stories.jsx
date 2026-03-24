/**
 * Molecules/EventCard
 *
 * Tier: Molecule — adaptive call-event row used in DataPage's event stream.
 * Collapsed: status badge, agent/customer chips, attribute badges.
 * Expanded: 3-tab drawer (Summary, Compliance, Transcript).
 */
import EventCard from '../../data/EventCard.jsx'
import { generateRows, SCHEMAS } from '../../data/mockData.js'

export default {
  title: 'Molecules/EventCard',
  component: EventCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tier: Molecule** — Single call-event row in the DataPage event stream. ' +
          'Collapsed state shows status badge, agent + customer chips, attribute badges (3px left-border + color tint). ' +
          'Click to expand → 3-tab grid row (Summary, Compliance/Details, Transcript). ' +
          '`compact` prop reduces padding for dense lists.',
      },
    },
  },
  argTypes: {
    compact:    { control: 'boolean' },
    animDelay:  { control: 'number' },
  },
}

const [acmeRow] = generateRows('acme', 1)
const [bankRow] = generateRows('globalbank', 1)
const [medRow]  = generateRows('medco', 1)

export const AcmeCorp = {
  args: { event: acmeRow, compact: false, animDelay: 0 },
  parameters: {
    docs: { description: { story: 'Acme Corp schema — Risk, Topic, CSAT, Language attributes.' } },
  },
}

export const GlobalBank = {
  args: { event: bankRow, compact: false, animDelay: 0 },
  parameters: {
    docs: { description: { story: 'GlobalBank schema — Compliance, Regulation, Violation attributes.' } },
  },
}

export const MedCo = {
  args: { event: medRow, compact: false, animDelay: 0 },
  parameters: {
    docs: { description: { story: 'MedCo schema — PHI flag, ICD-10 code, Appointment type.' } },
  },
}

export const Compact = {
  args: { event: acmeRow, compact: true, animDelay: 0 },
  parameters: {
    docs: { description: { story: 'Compact mode — reduced padding for dense event streams.' } },
  },
}

export const StaggeredList = {
  render: () => {
    const rows = generateRows('acme', 4)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((row, i) => (
          <EventCard key={row.id} event={row} animDelay={i * 0.06} />
        ))}
      </div>
    )
  },
  parameters: {
    docs: { description: { story: 'Four cards with staggered entry animation — mirrors DataPage rendering.' } },
  },
}
