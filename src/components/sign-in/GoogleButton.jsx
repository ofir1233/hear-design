function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

/**
 * GoogleButton — "Continue with Google" sign-in button.
 *
 * Props:
 *   onClick  — called when the button is pressed
 *   loading  — shows "Signing in…" and disables interaction
 *   error    — displays an error message below the button
 */
export default function GoogleButton({ onClick, loading = false, error = '' }) {
  return (
    <div data-inspector="GoogleButton" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '11px 0',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.07)',
          fontSize: 13,
          fontWeight: 500,
          color: '#fff',
          cursor: loading ? 'wait' : 'pointer',
          fontFamily: "'Byrd', sans-serif",
          transition: 'background 150ms ease',
          opacity: loading ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.13)' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
      >
        <GoogleIcon />
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      {error && (
        <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.9)', margin: 0, textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  )
}
