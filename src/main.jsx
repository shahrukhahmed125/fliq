import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import { GoogleOAuthProvider } from '@react-oauth/google'

console.log('Starting React app...')

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
