/**
 * Pages/DataPageV2
 *
 * Tier: Page — duplicate of DataPage with a collapsible filter strip.
 * Collapsed: Preset + Clear preset + applied chips + expand toggle.
 * Expanded: adds describe-query input, editable filter rows, Add Filter / Reset / Save / Apply.
 */
import DataPageV2 from '../../data/DataPageV2.jsx'

export default {
  title: 'Pages/DataPageV2',
  component: DataPageV2,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Page** — Variant of DataPage with a collapsible filter system. ' +
          'The pill collapses to a single row (Preset · Clear preset · applied chips · expand) ' +
          'and opens to reveal a describe-query input and full per-row filter builder ' +
          'with Reset / Save / Apply.',
      },
    },
  },
}

export const Default = {
  args: { isMobile: false, sidebarWidth: 0, companyConfig: null },
  parameters: {
    docs: { description: { story: 'Default — filter strip starts collapsed. Click the chevron to expand.' } },
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
    docs: { description: { story: 'Mobile layout.' } },
  },
}
