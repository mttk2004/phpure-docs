import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.tsx'
import '@/i18n/config'

// Extend Window interface to add our preload helper
declare global {
  interface Window {
    __vite_preload_helper: (url: string) => string;
  }
}

// Preload helper for CSS and critical assets
// This helps Vite optimize the loading of critical CSS files
window.__vite_preload_helper = (url: string) => {
  // Create a link element to preload the CSS
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = 'style'
  document.head.appendChild(link)
  return url
}

// Initialize performance monitoring
// Register performance metrics regardless of environment
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-start')
}

// First contentful paint optimization - render as soon as possible
let root: ReturnType<typeof createRoot> | null = null;

// Immediate render for better FCP
const startRender = () => {
  const container = document.getElementById('root')
  if (container) {
    root = createRoot(container)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    // Set marker for first render completion
    if ('performance' in window && 'mark' in performance) {
      performance.mark('app-rendered')
      // Check if the start mark exists before measuring
      if (performance.getEntriesByName('app-start', 'mark').length > 0) {
        performance.measure('app-startup-time', 'app-start', 'app-rendered')
      }
    }
  }
}

// Start rendering immediately
startRender()
