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

// CRITICAL FIX FOR PRODUCTION: Đảm bảo react_production luôn tồn tại trước React initialization
(function ensureReactProductionExists() {
  // Kiểm tra và đảm bảo react_production được định nghĩa ngay từ đầu
  if (typeof window !== 'undefined') {
    // Đảm bảo react_production đã được tạo
    if (!window.react_production) {
      window.react_production = window.react_production || {};
    }

    // Thêm các phương thức quan trọng nếu chưa có
    const reactProd = window.react_production;
    if (!reactProd.Fragment) reactProd.Fragment = React.Fragment;
    if (!reactProd.jsx) reactProd.jsx = React.createElement;
    if (!reactProd.jsxs) reactProd.jsxs = React.createElement;

    // Đảm bảo mọi thuộc tính không xác định sẽ trả về hàm thay vì undefined
    window.react_production = new Proxy(window.react_production, {
      get: function(target, prop) {
        if (target[prop as keyof typeof target] !== undefined) {
          return target[prop as keyof typeof target];
        }
        // Function trả về object rỗng cho bất kỳ thuộc tính nào không tồn tại
        return function() { return {}; };
      }
    });

    console.debug('[React Init] react_production protection enabled');
  }
})();

// This makes react_production accessible globally which prevents the undefined error
// Check if window exists first (for SSR safety)
if (typeof window !== 'undefined') {
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
