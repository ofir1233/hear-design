/**
 * Pages/Reports Page
 *
 * Tier: Organism — full page view.
 *
 * Reports list page with a pinned preview strip, list/grid view toggle,
 * status filter tabs, and search. 22 mock reports spanning 5 statuses.
 *
 * Inline sub-components:
 *   Sparkline           — SVG sparkline + gradient fill + pulsing end-dot
 *   StatusBadge         — 5-state: AI Generated / Running / Completed / Failed / Not Executed
 *   SchedulePill        — Daily / Weekly / Monthly / On demand
 *   StatusTabs          — filter bar with live count badges
 *   MenuRow             — single context menu item
 *   RowMenu             — 3-dot menu: Pin/Unpin, Open, Delete
 *   ReportRow           — list-view row: status + ID + name + sparkline + pin icon
 *   ReportCard          — grid-view card: status border + title + sparkline + stats
 *   PinnedReportCard    — featured card in pinned strip
 *   PinnedReportsStrip  — horizontal scrollable strip of pinned cards
 */
import ReportsPage from '../../reports/ReportsPage.jsx'

export default {
  title: 'Pages/Reports Page',
  component: ReportsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Full Reports management page. ' +
          '22 mock reports across 5 statuses: AI Generated · Running · Completed · Failed · Not Executed. ' +
          '\n\n**PinnedReportsStrip** (top): 3 default pinned cards with sparklines, stats, masked API keys. ' +
          'Pin/unpin via RowMenu — strip count badge updates live; strip hides entirely when unpinned to 0. ' +
          '\n\n**List view:** status badge · truncated ID · name · trend sparkline · schedule pill · pin icon (coral BsPinFill when pinned). ' +
          '\n\n**Grid view:** status-colored top border + hover glow box-shadow · 2-line clamped title · sparkline hero · stats. ' +
          '\n\n**Inline sub-components:** ' +
          '`Sparkline` · `StatusBadge` · `SchedulePill` · `StatusTabs` · `ReportRow` · `ReportCard` · ' +
          '`PinnedReportCard` · `PinnedReportsStrip` · `RowMenu` · `MenuRow`.' +
          '\n\n**Status colors:** AI Generated → coral #FF7056 · Running/Completed → green #4BA373 · Failed → red #DC2626.',
      },
    },
  },
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: 'Switches to mobile layout (removes sidebar offset)',
    },
    sidebarWidth: {
      control: { type: 'range', min: 0, max: 320, step: 8 },
      description: 'Left offset in px to account for the sidebar width',
    },
  },
}

/** Default — list view with 3 pinned reports and all 22 reports visible. */
export const Default = {
  args: { isMobile: false, sidebarWidth: 0 },
}

/** With sidebar — offset matches in-app layout with 272px sidebar. */
export const WithSidebar = {
  args: { isMobile: false, sidebarWidth: 272 },
  parameters: {
    docs: {
      description: {
        story: 'Matches in-app layout with the 272px expanded sidebar.',
      },
    },
  },
}

/** Mobile layout — no sidebar offset, full viewport width. */
export const Mobile = {
  args: { isMobile: true, sidebarWidth: 0 },
  parameters: {
    docs: {
      description: {
        story: 'Mobile layout: sidebar offset removed. Reports fill full viewport width.',
      },
    },
  },
}
