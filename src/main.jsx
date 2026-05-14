import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from '@/components/ErrorBoundary'

console.log('Starting React app...')

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
