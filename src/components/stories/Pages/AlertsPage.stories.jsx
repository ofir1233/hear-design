/**
 * Pages/Alerts Page
 *
 * Tier: Organism — full page view.
 *
 * Redesigned Alerts monitoring page. Shows 9 mock monitors with:
 *   - Stacked bar chart (weekly alert volume) with stacked/compare mode toggle
 *   - 4 KPI cards with trend delta badges
 *   - Quick filter pills (All / Active only / Triggered today / Never triggered)
 *   - Table sorted by alert count descending
 *   - Inline sparkline per monitor (5-week trend)
 *   - Status dot: green (active + has alerts) / gray (no alerts)
 *   - Inactive rows (0 alerts) visually dimmed, "Never triggered" label
 *   - Bulk selection with activate/deactivate action bar
 *   - Row click highlights monitor in chart
 */
import AlertsPage from '../../alerts/AlertsPage.jsx'

export default {
  title: 'Pages/Alerts Page',
  component: AlertsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Redesigned Alerts monitoring page (HAI-4960). ' +
          'No backend changes — same data, better clarity and scannability.' +
          '\n\n**Layout sections:** Chart · KPI strip · Table' +
          '\n\n**Chart:** Stacked bar by week. Toggle between "Stacked total" (default) and "Compare monitors" mode. Click a table row to highlight that monitor.' +
          '\n\n**KPI cards:** Total Monitors · Total Alerts · Active Monitors · Unique Alerts — each with a trend delta badge (↑↓ vs last period).' +
          '\n\n**Table:** Sorted by alert count descending. Columns: checkbox · # · Name (status dot) · Total Alerts (+ sparkline) · Last 7 Days · Last Triggered · Is Active (toggle) · Created By · Actions (⋮).' +
          '\n\n**Quick filters:** All · Active only · Triggered today · Never triggered.' +
          '\n\n**Bulk actions:** Select rows → bottom bar with Activate / Deactivate.',
      },
    },
  },
  argTypes: {
    sidebarWidth: {
      control: { type: 'range', min: 0, max: 400, step: 8 },
      description: 'Left offset matching sidebar width',
    },
  },
}

export const Default = {
  args: { sidebarWidth: 0, sidebarTransition: 'none' },
  name: 'Alerts Page',
}
