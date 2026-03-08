/**
 * Inspector entry point — lazy-loaded in dev only.
 * Renders the FAB and the slide-in drawer.
 * Mounted as a sibling of <App /> via src/main.jsx, outside all product stacking contexts.
 */
import { useState } from 'react'
import FAB              from './FAB.jsx'
import InspectorDrawer  from './InspectorDrawer.jsx'

export default function Inspector() {
  const [open, setOpen] = useState(() => window.location.pathname.startsWith('/storybook'))

  return (
    <>
      <FAB open={open} onClick={() => setOpen(o => !o)} />
      <InspectorDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
