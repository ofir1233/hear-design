/**
 * Pages/Create Report Page
 *
 * Tier: Organism — full inner page.
 *
 * Create / Edit Report form page. 3-tier collapsible section layout with
 * isDirty tracking and a discard confirmation modal on back navigation.
 *
 * Exported sub-components (named exports from CreateReportPage.jsx):
 *   Toggle       — checkbox with label
 *   ChoiceGroup  — segmented or pill radio group
 *   Tag          — dismissible label chip
 *   Section      — collapsible form section with optional badge
 *   Field        — form field wrapper with label, hint, tooltip
 *   ToggleRow    — toggle switch with optional subtext
 *
 * Section tiers:
 *   Tier 1 (Critical, always open): Basic Info · Prompts
 *   Tier 2 (Standard, open):        Configuration · Recipients
 *   Tier 3 (Advanced, closed):      Options · Chart Setup
 *
 * Configuration fields:
 *   Frequency          — Hourly/Daily/Weekly/Monthly (ChoiceGroup seg)
 *   Execution Time     — ToggleRow + time input
 *   Lookback Period    — [1,3,5,7,30,60,90,180,365] days (ChoiceGroup pill)
 *   Exclusions         — days-of-week multi-select dropdown
 *   Revisions          — free-text input
 *
 * Recipients:
 *   Notify by Email    — comma-separated with validation
 *   Access Control     — agent avatar picker, max 5
 *
 * Options (ToggleRows with tooltips):
 *   Stick to template · Is AI Accessible · Use Agentic Method · Experimental Mode
 *
 * Chart Setup:
 *   Chart prompt input · Chart type selector (Auto/Line/Bar/Pie)
 */
import CreateReportPage, {
  Toggle,
  ChoiceGroup,
  Tag,
  Section,
  Field,
  ToggleRow,
} from '../../reports/CreateReportPage.jsx'

export default {
  title: 'Pages/Create Report Page',
  component: CreateReportPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Create / Edit Report form page. ' +
          'Fixed layout (`position:fixed`) consistent with other full-page organisms. ' +
          '\n\n**3-tier collapsible sections:** ' +
          'Tier 1 (Critical, always open): Basic Info + Prompts. ' +
          'Tier 2 (Standard, collapsible+open): Configuration + Recipients. ' +
          'Tier 3 (Advanced, collapsible+closed): Options + Chart Setup. ' +
          '\n\n**Exported named sub-components:** ' +
          '`Toggle` · `ChoiceGroup` · `Tag` · `Section` · `Field` · `ToggleRow`. ' +
          '\n\n**Basic Info:** title with char counter (amber at 90%, red at 100% of 120 chars). ' +
          '\n\n**Prompts:** dynamic rows — add/remove, first row locked. ' +
          '\n\n**Configuration:** Frequency (seg) · Execution Time (toggle+input) · ' +
          'Lookback Period (pill: 1/3/5/7/30/60/90/180/365d) · Exclusions (day picker) · Revisions (text). ' +
          '\n\n**Recipients:** Email input (comma-sep validation) · Access Control (agent avatar picker, max 5). ' +
          '\n\n**Options:** Stick to template · Is AI Accessible · Use Agentic Method · Experimental Mode — each with ⓘ tooltip. ' +
          '\n\n**Chart Setup:** prompt input · type selector (Auto/Line/Bar/Pie). ' +
          '\n\n**isDirty:** any field change sets dirty — Back/Cancel shows discard modal if dirty.',
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

/** Fresh form — all fields empty, Tier 3 sections collapsed. */
export const Default = {
  args: { sidebarWidth: 0 },
}

/** With sidebar offset — matches in-app layout with a 272px sidebar. */
export const WithSidebar = {
  args: { sidebarWidth: 272 },
  parameters: {
    docs: {
      description: {
        story: 'Matches in-app layout with the sidebar at 272px.',
      },
    },
  },
}

/** Section sub-component — open and collapsed states. */
export const SectionOpen = {
  name: 'Sub-component: Section (open)',
  render: () => (
    <div style={{ padding: 24, maxWidth: 540, background: 'var(--bg-canvas)' }}>
      <Section title="Configuration" collapsible defaultOpen badge={0}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          Section body content goes here.
        </div>
      </Section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Collapsible section in open state. Badge shows active-values count when &gt; 0.',
      },
    },
  },
}

export const SectionCollapsed = {
  name: 'Sub-component: Section (collapsed)',
  render: () => (
    <div style={{ padding: 24, maxWidth: 540, background: 'var(--bg-canvas)' }}>
      <Section title="Advanced Options" collapsible defaultOpen={false} badge={3}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Byrd', sans-serif" }}>
          Section body content goes here.
        </div>
      </Section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Collapsed section with badge=3 — indicates 3 active values inside without opening.',
      },
    },
  },
}

/** ToggleRow sub-component. */
export const ToggleRowStory = {
  name: 'Sub-component: ToggleRow',
  render: () => (
    <div style={{ padding: 24, maxWidth: 400, background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleRow label="Stick to template" subtext="Prevent AI from deviating from the report structure" />
      <ToggleRow label="Is AI Accessible" />
      <ToggleRow label="Experimental Mode" subtext="Enable beta features — may affect report stability" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ToggleRow: label + optional subtext + toggle switch with ⓘ tooltip. Used in Options tier.',
      },
    },
  },
}

/** Tag sub-component. */
export const TagStory = {
  name: 'Sub-component: Tag',
  render: () => (
    <div style={{ padding: 24, display: 'flex', gap: 8, flexWrap: 'wrap', background: 'var(--bg-canvas)' }}>
      <Tag label="Monday" onRemove={() => {}} />
      <Tag label="Tuesday" onRemove={() => {}} />
      <Tag label="Saturday" onRemove={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tag: dismissible label chip. Used in Exclusions (day picker) and Recipients fields.',
      },
    },
  },
}

/** ChoiceGroup sub-component — segmented variant. */
export const ChoiceGroupSeg = {
  name: 'Sub-component: ChoiceGroup (segmented)',
  render: () => (
    <div style={{ padding: 24, background: 'var(--bg-canvas)' }}>
      <ChoiceGroup
        variant="seg"
        value="daily"
        options={[
          { value: 'hourly',  label: 'Hourly'  },
          { value: 'daily',   label: 'Daily'   },
          { value: 'weekly',  label: 'Weekly'  },
          { value: 'monthly', label: 'Monthly' },
        ]}
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Segmented variant — used for Frequency selection. Active segment: cobalt-tinted bg + bold text.',
      },
    },
  },
}

/** ChoiceGroup sub-component — pill variant. */
export const ChoiceGroupPill = {
  name: 'Sub-component: ChoiceGroup (pill)',
  render: () => (
    <div style={{ padding: 24, background: 'var(--bg-canvas)' }}>
      <ChoiceGroup
        variant="pill"
        value="7"
        options={[
          { value: '1',   label: '1d'  },
          { value: '3',   label: '3d'  },
          { value: '7',   label: '7d'  },
          { value: '30',  label: '30d' },
          { value: '90',  label: '90d' },
          { value: '365', label: '1y'  },
        ]}
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pill variant — used for Lookback Period. 9 options: 1/3/5/7/30/60/90/180/365 days.',
      },
    },
  },
}
