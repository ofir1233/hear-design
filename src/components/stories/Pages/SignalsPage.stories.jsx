/**
 * Pages/Signals Page
 *
 * Tier: Organism — full page view.
 *
 * AG Grid-powered signals management page. Shows 15 mock signals in a
 * themed community grid with status filter tabs, search, CSV export,
 * and quota indicator. Create button navigates to /signals/create.
 *
 * Inline sub-components:
 *   Toggle              — auto-process toggle switch (AG Grid cell renderer)
 *   StatusBadge         — 4-state status pill (Active/Triggered/Paused/Error)
 *   StatusTabs          — filter tab bar with live count badges
 *   MenuRow             — single item in the 3-dot row context menu
 *   RowMenu             — 3-dot context menu (Run Revision, Export, Clone, Edit, Delete, …)
 *   ToggleCellRenderer  — AG Grid wrapper for Toggle
 *   SourceTagCellRenderer — AI / System / null source tag pill
 *   StatusCellRenderer  — AG Grid wrapper for StatusBadge
 *   ExecutionsCellRenderer — execution count with run icon
 *   ActionsCellRenderer — AG Grid wrapper for RowMenu
 *   IdCellRenderer      — coral-colored ID display
 *
 * External dependencies:
 *   ag-grid-community, ag-grid-react  (AllCommunityModule)
 */
import SignalsPage from '../../signals/SignalsPage.jsx'

export default {
  title: 'Pages/Signals Page',
  component: SignalsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Full Signals management page. ' +
          'Hosts an AG Grid community table (themeQuartz, light/dark via MutationObserver) ' +
          'with 15 mock signals and 9 columns: # | Auto Process | ID | Name | Type | Context | Created At | Executions | Status | Actions. ' +
          '\n\n**Inline sub-components:** ' +
          '`Toggle` (auto-process switch) · `StatusBadge` (Active/Triggered/Paused/Error) · ' +
          '`StatusTabs` (filter bar with count badges) · `RowMenu` (Run Revision/Export/Clone/Edit/Delete) · ' +
          '`SourceTagCellRenderer` (AI/System pills) · `ExecutionsCellRenderer` (run icon + count).' +
          '\n\n**Columns:** # · Auto Process · ID (coral) · Name · Type (AI Generated / System pill) · ' +
          'Context · Created At · Executions · Status · Actions (⋮ menu).' +
          '\n\n**Header controls:** Total signals badge · Quota indicator (9/10 red pill) · Export CSV · Create button.',
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

/** Default view — full signals list with all 15 mock signals. */
export const Default = {
  args: { isMobile: false, sidebarWidth: 0 },
}

/** With sidebar — offset layout as seen inside the app shell. */
export const WithSidebar = {
  args: { isMobile: false, sidebarWidth: 272 },
  parameters: {
    docs: {
      description: {
        story: 'Matches the in-app layout with the 272px sidebar. The page shifts left and the AG Grid fills the remaining space.',
      },
    },
  },
}

/** Mobile layout — no sidebar offset. */
export const Mobile = {
  args: { isMobile: true, sidebarWidth: 0 },
  parameters: {
    docs: {
      description: {
        story: 'Mobile layout: sidebar offset removed. Grid fills full viewport width.',
      },
    },
  },
}
