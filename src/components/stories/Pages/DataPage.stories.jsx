/**
 * Pages/DataPage
 *
 * Tier: Page — full event-stream data browser.
 * Schema switcher, OmniBar, EventStream, FilterDrawer. Design Lab config only.
 */
import DataPage from '../../data/DataPage.jsx'

export default {
  title: 'Pages/DataPage',
  component: DataPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Page** — Full event-stream data browser. ' +
          'Contains: schema switcher (Acme Corp / GlobalBank / MedCo), OmniBar filter input, ' +
          'virtualised EventStream (2 000 rows), and FilterDrawer. ' +
          'Position fixed, `left = sidebarWidth`. ' +
          '\n\n**Design Lab config** — `companyConfig={null}` uses all three schemas freely.',
      },
    },
  },
}

export const Default = {
  args: { isMobile: false, sidebarWidth: 0, companyConfig: null },
  parameters: {
    docs: { description: { story: 'Full DataPage with no sidebar offset. Switch schemas via the header tabs.' } },
  },
}

export const WithSidebar = {
  args: { isMobile: false, sidebarWidth: 272, companyConfig: null },
  parameters: {
    docs: { description: { story: 'Sidebar offset applied — mirrors the real LabApp layout.' } },
  },
}

export const Mobile = {
  args: { isMobile: true, sidebarWidth: 0, companyConfig: null },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: { description: { story: 'Mobile layout — OmniBar and stream stack vertically.' } },
  },
}
