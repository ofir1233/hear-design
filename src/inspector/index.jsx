/**
 * Inspector entry point — lazy-loaded in dev only.
 * Renders the FAB and the slide-in drawer.
 * Mounted as a sibling of <App /> via src/main.jsx, outside all product stacking contexts.
 *
 * URL hash routing: #tab=Components&component=Button&state=0&page=agent-eval
 * If hash contains a 'tab' param the inspector auto-opens to that state.
 */
import { useState, Component } from 'react'
import FAB              from './FAB.jsx'
import InspectorDrawer  from './InspectorDrawer.jsx'
import { T } from './theme.js'

function hasInspectorHash() {
  try {
    return window.location.hash.length > 1 &&
      new URLSearchParams(window.location.hash.slice(1)).has('tab')
  } catch { return false }
}

// Top-level error boundary — guarantees that no crash inside the inspector
// can ever propagate to LabApp and take down the whole product. If something
// throws here (AG Grid initialisation, a malformed component def, an effect
// in a preview component, anything) the inspector shows a recovery UI instead
// of a white screen.
class InspectorErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  componentDidCatch() {}
  render() {
    if (this.state.error) return (
      <div className="hear-inspector" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: T.bg, border: `1px solid rgba(220,60,60,0.4)`,
        borderRadius: 10, padding: '14px 18px', maxWidth: 320,
        fontFamily: T.fontMono, boxShadow: '-4px 4px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#E05252', marginBottom: 6 }}>
          Inspector crashed
        </div>
        <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.6, marginBottom: 10 }}>
          {this.state.error.message}
        </div>
        <button
          onClick={() => this.setState({ error: null })}
          style={{
            fontSize: 10, fontFamily: T.fontMono, cursor: 'pointer',
            padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${T.border}`, background: T.bgElevated,
            color: T.textMuted,
          }}
        >
          Reload inspector
        </button>
      </div>
    )
    return this.props.children
  }
}

export default function Inspector() {
  const [open, setOpen] = useState(hasInspectorHash)

  function handleClose() {
    setOpen(false)
    // Clear inspector hash params so the URL is clean after closing
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return (
    <InspectorErrorBoundary>
      <FAB open={open} onClick={() => setOpen(o => !o)} />
      <InspectorDrawer open={open} onClose={handleClose} />
    </InspectorErrorBoundary>
  )
}
