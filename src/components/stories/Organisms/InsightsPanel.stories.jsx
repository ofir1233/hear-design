/**
 * Organisms/InsightsPanel
 *
 * Tier: Organism — 6-widget dashboard grid for the Chat/Home page.
 * All data seeded deterministically from config.companyName.
 * Always previews with Design Lab defaults (null config).
 */
import InsightsPanel from '../../dashboard/InsightsPanel.jsx'

export default {
  title: 'Organisms/InsightsPanel',
  component: InsightsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tier: Organisms** — 6-widget call-center intelligence grid. ' +
          'Renders: Call Volume (sparkline), CSAT (week bars), Trending Topics (wide), ' +
          'Top Performer, Open Escalations, Churn Risk. ' +
          '\n\n**Design Inspector / Storybook always use `config={null}`** ' +
          '(resolves to "Demo Company" seed). Pass `companyConfig` from LabApp in production. ' +
          '\n\nNumbers are seeded deterministically from `config.companyName` — stable across reloads.',
      },
    },
  },
  argTypes: {
    config: {
      control: 'object',
      description: 'Company config object. null → "Demo Company" defaults.',
    },
  },
}

/** Design Lab defaults — null config, "Demo Company" seed. */
export const DesignLabDefaults = {
  args: { config: null },
}

/** Named company — different seed produces different numbers. */
export const NamedCompany = {
  args: {
    config: {
      companyName: 'Acme Corp',
      commonTopics: ['Billing Dispute', 'Account Access', 'Refund Request', 'Technical Issue', 'Delivery Status'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Passing a real companyConfig seeds all numbers from the company name hash — consistent for the same company across sessions.',
      },
    },
  },
}
