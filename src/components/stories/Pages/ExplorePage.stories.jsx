/**
 * Pages/ExplorePage
 *
 * Tier: Page — single-call deep-dive view, opened from DataPage.
 * Sections: Call Summary, Quick Stats, Call Metrics, Agent Evaluation,
 * Monitored Events, Transcription, Customer.
 */
import ExplorePage from '../../data/ExplorePage.jsx'

export default {
  title: 'Pages/ExplorePage',
  component: ExplorePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Page** — Deep-dive view for a single call event, opened from DataPage. ' +
          'Sections: Call Summary, Quick Stats Row, Call Metrics, Agent Evaluation, ' +
          'Monitored Events, Transcription (expandable utterances), Customer panel. ' +
          '`onBack` navigates back to DataPage (`/data` route). ' +
          'Position fixed, `left = sidebarWidth`.',
      },
    },
  },
}

const SAMPLE_CALL = {
  id: 'call-001',
  callDate: 'Mar 15, 2024',
  summary: 'Customer contacted enterprise support ahead of Q2 renewal to discuss volume discount tiers. Agent confirmed current contract terms and escalated pricing request to account manager.',
  status: 'COMPLETED',
  priority: 'HIGH',
  callType: 'inbound',
  duration: '8:42',
  assignedTo: { name: 'Sarah Chen', initials: 'SC', color: 'blue' },
  customer: { name: 'Jordan Mills', company: 'Acme Corp', email: 'j.mills@acmecorp.com' },
}

export const Default = {
  args: { call: SAMPLE_CALL, onBack: () => {}, isMobile: false, sidebarWidth: 0 },
}

export const WithSidebar = {
  args: { call: SAMPLE_CALL, onBack: () => {}, isMobile: false, sidebarWidth: 272 },
  parameters: {
    docs: { description: { story: 'With sidebar offset — matches real LabApp layout.' } },
  },
}

export const Mobile = {
  args: { call: SAMPLE_CALL, onBack: () => {}, isMobile: true, sidebarWidth: 0 },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
