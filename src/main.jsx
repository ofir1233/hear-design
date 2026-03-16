import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const InspectorRoot = lazy(() => import('./inspector/index.jsx'))

// Replace with your Google Client ID from https://console.cloud.google.com
const GOOGLE_CLIENT_ID = '919982732989-fvnnn6jt8i75tn6i90tnpguoq1016dnj.apps.googleusercontent.com'

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
