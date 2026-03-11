/**
 * Inspector entry point — lazy-loaded in dev only.
 * Renders the FAB and the slide-in drawer.
 * Mounted as a sibling of <App /> via src/main.jsx, outside all product stacking contexts.
 *
 * URL hash routing: #tab=Components&component=Button&state=0&page=agent-eval
 * If hash contains a 'tab' param the inspector auto-opens to that state.
 */
import { useState } from 'react'
import FAB              from './FAB.jsx'
import InspectorDrawer  from './InspectorDrawer.jsx'

function hasInspectorHash() {
  try {
    return window.location.hash.length > 1 &&
      new URLSearchParams(window.location.hash.slice(1)).has('tab')
  } catch { return false }
}

export default function Inspector() {
  const [open, setOpen] = useState(hasInspectorHash)

  function handleClose() {
    setOpen(false)
    // Clear inspector hash params so the URL is clean after closing
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return (
    <>
      <FAB open={open} onClick={() => setOpen(o => !o)} />
      <InspectorDrawer open={open} onClose={handleClose} />
    </>
  )
}
