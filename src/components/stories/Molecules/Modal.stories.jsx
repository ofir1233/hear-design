/**
 * Molecules/Modal
 *
 * Tier: Molecule — centred dialog with backdrop, title, body, and footer slots.
 * Backdrop click + Escape → onClose. Enter/scale animation on open.
 */
import { useState } from 'react'
import Modal from '../../Modal.jsx'
import Button from '../../Button.jsx'

export default {
  title: 'Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Tier: Molecule** — Centred dialog overlay. ' +
          'Backdrop click or Escape fires `onClose`. ' +
          'Enter animation: `translateY(12px) scale(0.97)` → neutral over 220ms. ' +
          'Slots: `title` (string), `children` (body), `footer` (ReactNode, right-aligned). ' +
          '`width` defaults to 440px.',
      },
    },
  },
  argTypes: {
    open:    { control: 'boolean' },
    title:   { control: 'text' },
    width:   { control: 'number' },
    onClose: { action: 'onClose' },
  },
}

function ModalDemo({ title, children, footer, width }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} footer={footer} width={width}>
        {children}
      </Modal>
    </div>
  )
}

export const Default = {
  render: () => (
    <ModalDemo
      title="Confirm delete"
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="danger"    size="sm">Delete</Button>
        </div>
      }
    >
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Are you sure you want to delete this report? This action cannot be undone.
      </p>
    </ModalDemo>
  ),
}

export const Informational = {
  render: () => (
    <ModalDemo
      title="Keyboard shortcuts"
      footer={
        <Button variant="primary" size="sm">Got it</Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
        {[
          ['Escape',   'Close dialog'],
          ['Ctrl + K', 'Open command palette'],
          ['Ctrl + /', 'Focus search'],
        ].map(([key, desc]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <code style={{ background: 'var(--bg-active)', padding: '2px 7px', borderRadius: 5, fontSize: 12, fontFamily: 'monospace' }}>{key}</code>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </ModalDemo>
  ),
}

export const NarrowWidth = {
  render: () => (
    <ModalDemo
      title="Session expired"
      width={320}
      footer={<Button variant="primary" size="sm" fullWidth>Sign in again</Button>}
    >
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Your session has expired. Please sign in to continue.
      </p>
    </ModalDemo>
  ),
  parameters: {
    docs: { description: { story: 'Narrow 320px variant — same component, `width={320}` prop.' } },
  },
}
