// Import React first to ensure it's initialized before anything else
import React from 'react'
// Import cả hai cách để phù hợp với kiểu dữ liệu
import * as ReactDOMClient from 'react-dom/client'
import * as ReactDOMFull from 'react-dom'

// Tạo interface đúng cho window mở rộng từ cả Window và typeof globalThis
interface ReactProductionType {
  Fragment?: typeof React.Fragment;
  jsx?: typeof React.createElement;
  jsxs?: typeof React.createElement;
  [key: string]: unknown; // Sử dụng unknown thay vì any
}

// Khai báo window interface với phương pháp thân thiện hơn cho TypeScript
declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOMFull & typeof ReactDOMClient;
    react_production?: ReactProductionType;
  }
}

// This makes react_production accessible globally which prevents the undefined error
// Check if window exists first (for SSR safety)
if (typeof window !== 'undefined') {
  // Khởi tạo react_production nếu chưa tồn tại
  if (!window.react_production) {
    window.react_production = {
      Fragment: React.Fragment,
      jsx: React.createElement,
      jsxs: React.createElement
    };
    console.log('[React Init] Created react_production fallback');
  }

  // Support direct window.React usage
  window.React = React;
  // Gộp cả hai phiên bản ReactDOM
  window.ReactDOM = { ...ReactDOMFull, ...ReactDOMClient } as typeof ReactDOMFull & typeof ReactDOMClient;
}

// Now import the rest of the application
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.tsx'
import '@/i18n/config'

// Initialize performance monitoring
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-start')
}

// First contentful paint optimization - render as soon as possible
let root: ReturnType<typeof createRoot> | null = null;

// Immediate render for better FCP
const startRender = () => {
  try {
    const container = document.getElementById('root')
    if (container) {
      root = createRoot(container)
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      )

      // Set marker for first render completion
      if ('performance' in window && 'mark' in performance) {
        performance.mark('app-rendered')
        if (performance.getEntriesByName('app-start', 'mark').length > 0) {
          performance.measure('app-startup-time', 'app-start', 'app-rendered')
        }
      }
    }
  } catch (err) {
    console.error('[Render Error]', err);
  }
}

// Start rendering immediately
startRender()
