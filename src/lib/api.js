// Same-origin by default, in both dev and prod:
//  - dev: Vite proxies /api → API_PROXY or the deployed prototype (see vite.config.js)
//  - prod: /api/chat is a Vercel serverless function (api/chat.js). The DB-backed
//    routes (/api/sessions/*, /api/title, /api/dev/*) exist only in backend/server.js,
//    so on Vercel they answer 405 and every caller degrades to localStorage — by design.
// Set VITE_API_URL only to point the whole app at a live backend/server.js host.
// It used to be set on Vercel to a Render instance that went dark, which sent every
// prod request into a 30s hang; keep it unset unless that backend is verified up.
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
