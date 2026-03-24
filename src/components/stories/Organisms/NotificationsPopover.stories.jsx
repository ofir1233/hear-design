/**
 * Organisms/NotificationsPopover
 *
 * Tier: Organism — Lab-only notification panel anchored to the bell button in Sidebar.
 * Portal-rendered. 5 notification tags: DATA, SIGNALS, MAGIC_API, AGENT_EVALUATION, CHAT.
 */
import { useRef, useState } from 'react'
import NotificationsPopover from '../../../lab/components/NotificationsPopover.jsx'

export default {
  title: 'Organisms/NotificationsPopover',
  component: NotificationsPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tier: Organism** — Lab-only notification popover anchored to the Sidebar bell button. ' +
          'Portal-rendered (appended to `document.body`). ' +
          '5 tag types: `DATA` + `SIGNALS` navigate on click; `MAGIC_API`, `AGENT_EVALUATION`, `CHAT` are passive. ' +
          'Mark-all-read, per-notification read/dismiss. ' +
          '\n\n**Delivery pipeline:** Server Action → GCP Pub/Sub → MongoDB → PubNub → NotificationProvider → here.',
      },
    },
  },
}

function PopoverDemo() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(true)
  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <button
        ref={anchorRef}
        onClick={() => setOpen(v => !v)}
        style={{
          width: 40, height: 40,
          border: '1.5px solid var(--border-input)',
          borderRadius: 10,
          background: open ? 'var(--bg-active)' : 'transparent',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}
      >
        🔔
        <span style={{
          position: 'absolute', top: -3, right: -3,
          background: '#E8613A', color: '#fff', fontSize: 9, fontWeight: 700,
          minWidth: 16, height: 16, padding: '0 3px', borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>2</span>
      </button>
      <NotificationsPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export const Default = {
  render: () => <PopoverDemo />,
  parameters: {
    docs: { description: { story: 'Bell button anchor — popover is open by default. Click the bell to toggle.' } },
  },
}
