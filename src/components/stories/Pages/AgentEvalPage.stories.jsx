/**
 * Pages/AgentEvalPage
 *
 * Tier: Page — agent evaluation dashboard with score cards and evaluation grid.
 * Position fixed, left = sidebarWidth. Design Lab config only.
 */
import AgentEvalPage from '../../agent-eval/AgentEvalPage.jsx'

export default {
  title: 'Pages/AgentEvalPage',
  component: AgentEvalPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Page** — Agent Evaluation dashboard. ' +
          'Score panels, skill breakdowns, evaluation grid with filterable rows. ' +
          'Routed via `activePage === "agent-eval"` in LabApp. ' +
          'Position fixed, `left = sidebarWidth`. ' +
          '\n\nAll data is synthetic mock data — Design Lab config only.',
      },
    },
  },
}

export const Default = {
  args: { sidebarWidth: 0, sidebarTransition: 'none' },
}

export const WithSidebar = {
  args: { sidebarWidth: 272, sidebarTransition: 'left 250ms cubic-bezier(0.4,0,0.2,1)' },
  parameters: {
    docs: { description: { story: 'Full layout with sidebar offset.' } },
  },
}
