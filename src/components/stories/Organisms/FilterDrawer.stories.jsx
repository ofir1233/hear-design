/**
 * Organisms/FilterDrawer
 *
 * Tier: Organism — fixed-right slide-in filter panel for DataPage.
 * 3 filter rows, AND/OR toggle, 280ms spring slide.
 */
import { useState } from 'react'
import FilterDrawer from '../../data/FilterDrawer.jsx'
import { SCHEMAS } from '../../data/mockData.js'
import Button from '../../Button.jsx'

export default {
  title: 'Organisms/FilterDrawer',
  component: FilterDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Fixed-right filter drawer in DataPage. ' +
          '`translateX` slide animation (280ms spring). 3 filter rows with field + value selects, AND/OR combinator toggle. ' +
          'Receives active schema for field/value options. ' +
          '`open` prop controls visibility — backdrop click or X fires `onClose`.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
  },
}

function DrawerDemo({ schemaId = 'acme', startOpen = true }) {
  const schema = SCHEMAS[schemaId]
  const [open, setOpen] = useState(startOpen)
  return (
    <div style={{ minHeight: 400, position: 'relative', background: 'var(--bg-canvas)', padding: 24 }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Open filter drawer</Button>
      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        schema={schema}
        onApply={(filters) => { setOpen(false); console.log('Applied:', filters) }}
      />
    </div>
  )
}

export const OpenAcme = {
  render: () => <DrawerDemo schemaId="acme" startOpen={true} />,
  parameters: {
    docs: { description: { story: 'Drawer open — Acme Corp schema fields.' } },
  },
}

export const OpenGlobalBank = {
  render: () => <DrawerDemo schemaId="globalbank" startOpen={true} />,
  parameters: {
    docs: { description: { story: 'Drawer open — GlobalBank compliance schema fields.' } },
  },
}

export const Closed = {
  render: () => <DrawerDemo schemaId="acme" startOpen={false} />,
  parameters: {
    docs: { description: { story: 'Drawer closed — click "Open filter drawer" to trigger the slide-in animation.' } },
  },
}
