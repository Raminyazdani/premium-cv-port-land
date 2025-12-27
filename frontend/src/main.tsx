import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary"
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

import { initializeLanguage } from './lib/languageManager'
import { initializeTheme } from './lib/themeManager'
import { initPerformanceMonitoring, preloadCriticalResources, reportWebVitals } from './utils/performance'
import { initLayoutStability } from './utils/layoutStability'

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found')
  throw new Error('Root element not found')
}

initLayoutStability()

if (import.meta.env.DEV) {
  initPerformanceMonitoring()
  reportWebVitals()
}

preloadCriticalResources()

try {
  initializeLanguage()
  initializeTheme()
  
  const root = createRoot(rootElement)
  root.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  )
} catch (error) {
  console.error('Failed to initialize app:', error)
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1 style="color: #ef4444;">Application Error</h1>
      <p>Failed to initialize the application. Please refresh the page.</p>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: left; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `
}
