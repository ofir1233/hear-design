import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const InspectorRoot = lazy(() => import('./inspector/index.jsx'))

// Replace with your Google Client ID from https://console.cloud.google.com
const GOOGLE_CLIENT_ID = '115558212158-ei3t33s74oeo1dqc5l0i6kji0raq6jss.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
      <Suspense fallback={null}>
        <InspectorRoot />
      </Suspense>
    </GoogleOAuthProvider>
  </StrictMode>,
)
