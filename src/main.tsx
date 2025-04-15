/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Import React first to ensure it's initialized before anything else
import React from 'react'
// Import cả hai cách để phù hợp với kiểu dữ liệu
import * as ReactDOMClient from 'react-dom/client'
import * as ReactDOMFull from 'react-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.tsx'
import '@/i18n/config'

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
    __REACT_PRELOAD_ACTIVE?: boolean;
  }
}

// Kiểm tra xem preload script đã chạy chưa
if (typeof window !== 'undefined' && !window.__REACT_PRELOAD_ACTIVE) {
  console.warn('[Main] React preload script may not have executed correctly');
}

// Universal browser fix - áp dụng cho mọi trình duyệt
(function universalBrowserFix() {
  if (typeof window !== 'undefined') {
    console.debug('[React Init] Running universal browser fixes');

    // 1. Backup của React đối tượng ban đầu để tránh mất dữ liệu
    const originalReact = window.React || {};
    const originalReactDOM = window.ReactDOM || {}; // Thêm biến originalReactDOM
    const originalReactProduction = window.react_production || {};

    // 2. Tạo một reactive observer để theo dõi và khôi phục React object khi cần
    try {
      // Sử dụng MutationObserver để phát hiện thay đổi DOM
      if (typeof MutationObserver === 'function') {
        const reactObserver = new MutationObserver(function() {
          // Khôi phục React.Children nếu nó bị mất
          if (!window.React || !window.React.Children) {
            console.debug('[React Init] Restoring React.Children');
            window.React = {
              ...window.React || {},
              Children: originalReact.Children || {
              map: function(children: React.ReactNode, func: (child: React.ReactNode, index: number) => any, context?: any) { return Array.isArray(children) ? children.map(func, context) : []; },
              forEach: function(children: React.ReactNode, func: (child: React.ReactNode, index: number) => void, context?: any) { Array.isArray(children) && children.forEach(func, context); },
              count: function(children: React.ReactNode) { return Array.isArray(children) ? children.length : 0; },
              only: function() { return null; },
              }
            };
          }

          // Kiểm tra và khôi phục react_production nếu cần
          if (!window.react_production) {
            console.debug('[React Init] Restoring react_production');
            window.react_production = originalReactProduction;
          }

          // Khôi phục ReactDOM nếu cần
          if (!window.ReactDOM) {
            console.debug('[React Init] Restoring ReactDOM');
            window.ReactDOM = originalReactDOM;
          }
        });

        // Bắt đầu giám sát DOM
        reactObserver.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        // Giải phóng observer sau 10 giây để tránh ảnh hưởng đến hiệu suất
        setTimeout(function() {
          reactObserver.disconnect();
        }, 10000);
      }
    } catch (e) {
      console.error('[React Init] Error setting up observer:', e);
    }
    // 3. Đảm bảo mọi thuộc tính React cần thiết đều tồn tại
    // Đảm bảo React.Children luôn tồn tại - vấn đề chính trên Chrome
    if (!window.React.Children) {
      window.React = {
        ...window.React,
        Children: originalReact.Children || {
          map: function(children: React.ReactNode, func: (child: React.ReactNode, index: number) => any, context?: any) { return Array.isArray(children) ? children.map(func, context) : []; },
          forEach: function(children: React.ReactNode, func: (child: React.ReactNode, index: number) => void, context?: any) { Array.isArray(children) && children.forEach(func, context); },
          count: function(children: React.ReactNode) { return Array.isArray(children) ? children.length : 0; },
          only: function() { return null; },
          toArray: function(children: React.ReactNode) { return Array.isArray(children) ? children : []; }
        }
      };
    }

    // Đảm bảo react_production luôn tồn tại
    window.react_production = window.react_production || originalReactProduction || {};
    if (!window.react_production.jsx && window.React.createElement) window.react_production.jsx = window.React.createElement;
    if (!window.react_production.jsxs && window.React.createElement) window.react_production.jsxs = window.React.createElement;
    if (!window.react_production.Fragment && window.React.Fragment) window.react_production.Fragment = window.React.Fragment;

    // 4. Thêm Proxy để đảm bảo bất kỳ thuộc tính không xác định nào cũng sẽ trả về hàm thay vì undefined
    // Sử dụng một biến trung gian để tránh lỗi TypeScript
    const reactProduction = window.react_production;
    window.react_production = new Proxy(reactProduction, {
      get: function(target, prop) {
        const key = prop as string;
        // Kiểm tra nếu thuộc tính tồn tại
        if (key in target) {
          return target[key];
        }
        // Trả về hàm dummy nếu thuộc tính không tồn tại
        return function() { return {}; };
      }
    });

    console.debug('[React Init] Universal browser fixes completed');
  }
})();

// This makes React objects accessible globally
if (typeof window !== 'undefined') {
  // Đảm bảo React và ReactDOM là đối tượng toàn cầu
  window.React = React;
  window.ReactDOM = { ...ReactDOMFull, ...ReactDOMClient } as unknown as typeof ReactDOMFull & typeof ReactDOMClient;
}

// Initialize performance monitoring
if (typeof window !== 'undefined' && 'performance' in window && 'mark' in performance) {
  performance.mark('app-start')
}

// First contentful paint optimization - render as soon as possible
let root: ReturnType<typeof createRoot> | null = null;

// Immediate render for better FCP
const startRender = () => {
  try {
    if (typeof window === 'undefined') return;

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
