/**
 * Pages/Create Signal Page
 *
 * Tier: Organism — full inner page.
 *
 * Create / Edit signal page. Fixed-layout with a rounded header bar and a
 * single Card containing signal metadata and a dynamic list of expandable
 * item rows.
 *
 * Header controls:
 *   ← Back button         — navigates to /signals
 *   Signal name input     — editable inline title
 *   History button        — ghost border style
 *   Import Configuration  — purple sparkle pill
 *   Save button           — coral primary CTA
 *
 * Card contents:
 *   Signal name field     — full-width text input
 *   ModelDropdown         — purple sparkle pill, 15 model options
 *   Description textarea  — auto-sizing
 *   ItemRows list         — dynamic, add/delete, each expandable to show
 *                           Name + Key + TypeDropdown + Description
 *
 * Inline sub-components:
 *   BackIcon, PlayIcon, SparkleIcon, InfoIcon,
 *   DragHandle, TrashIcon, ChevronIcon, PlusIcon, HistoryIcon,
 *   Card, ModelDropdown, TypeDropdown, ItemRow
 */
import CreateSignalPage from '../../signals/CreateSignalPage.jsx'

export default {
  title: 'Pages/Create Signal Page',
  component: CreateSignalPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Create / Edit Signal inner page. ' +
          'Fixed layout (`position:fixed`, `left: sidebarWidth`) — consistent with DataPage, ReportsPage, and SignalsPage. ' +
          '\n\n**Header:** rounded card bar (bg-sidebar, borderRadius 16, boxShadow) with Back button · editable signal name · ' +
          'History (ghost) · Import Configuration (purple sparkle pill) · Save (coral). ' +
          '\n\n**Content card:** Signal name input · `ModelDropdown` (15 AI models, highlighted in purple) · ' +
          'Description textarea · dynamic `ItemRow` list.' +
          '\n\n**ItemRow expanded:** 2-column grid — left (Name + Key + `TypeDropdown`: String/Boolean/Number/List) · right (Description textarea).' +
          '\n\n**Inline sub-components:** ' +
          '`Card` · `ModelDropdown` · `TypeDropdown` · `ItemRow` · ' +
          'BackIcon · PlayIcon · SparkleIcon · InfoIcon · DragHandle · TrashIcon · ChevronIcon · PlusIcon · HistoryIcon.',
      },
    },
  },
  argTypes: {
    sidebarWidth: {
      control: { type: 'range', min: 0, max: 320, step: 8 },
      description: 'Left offset in px to account for the sidebar width',
    },
  },
}

/** Fresh form — no signal name entered, one default item row. */
export const Default = {
  args: { sidebarWidth: 0 },
}

/** With sidebar offset — matches in-app layout with a 272px sidebar. */
export const WithSidebar = {
  args: { sidebarWidth: 272 },
  parameters: {
    docs: {
      description: {
        story: 'Matches the in-app layout with the sidebar expanded to 272px.',
      },
    },
  },
}
