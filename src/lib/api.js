// In dev, Vite proxies /api → http://localhost:3001 (see vite.config.js).
// In production, VITE_API_URL is set to the Render backend URL.
const BASE = import.meta.env.VITE_API_URL ?? ''

export function apiFetch(path, opts) {
  return fetch(`${BASE}${path}`, opts)
}

// Reads stored tokens and attaches them as headers.
export function apiHeaders(extra = {}) {
  const devToken      = localStorage.getItem('hear-dev-token')
  const demoProfileId = localStorage.getItem('hear-demo-profile-id')
  return {
    ...extra,
    ...(devToken      ? { 'X-Dev-Token':        devToken      } : {}),
    ...(demoProfileId ? { 'X-Demo-Profile-Id':  demoProfileId } : {}),
  }
}
