/**
 * React Debug Utilities - Enhanced version
 *
 * This file contains utilities to help debug React initialization issues
 * particularly in production builds where errors like "Cannot set property of undefined"
 * might occur due to module loading or initialization order problems.
 */

// Import React và ReactDOM từ node_modules để có đúng kiểu dữ liệu
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOMFull from 'react-dom';

// Định nghĩa kiểu cho các bản sao tạm thời của React
type ReactLike = Partial<typeof React>;
// Loại bỏ khai báo không sử dụng: type ReactDOMLike = Partial<typeof ReactDOMFull & typeof ReactDOMClient>;

/**
 * Initialize React global object with proper structure to prevent
 * "Cannot set properties of undefined" errors
 */
export function ensureReactGlobals(): void {
  if (typeof window !== 'undefined') {
    // Create a basic React object first if it doesn't exist
    if (!window.React) {
      console.info('[ReactDebug] Creating React global object');
      window.React = {} as typeof React;
    }

    // Sử dụng non-null assertion và as để tránh TypeScript error
    const reactObj = window.React as ReactLike;

    // Ensure key React properties exist using bracket notation để tránh read-only error
    if (!reactObj.Children) {
      // Sử dụng unknown thay vì any
      (reactObj as Record<string, unknown>)['Children'] = {};
    }

    if (!reactObj.Fragment) {
      (reactObj as Record<string, unknown>)['Fragment'] = Symbol('Fragment');
    }

    if (!reactObj.createElement) {
      (reactObj as Record<string, unknown>)['createElement'] = function() {
        return null;
      };
    }

    if (!reactObj.createContext) {
      // Bỏ generic T không sử dụng
      (reactObj as Record<string, unknown>)['createContext'] = function() {
        return {
          Provider: null,
          Consumer: null,
          $$typeof: Symbol.for('react.context')
        } as unknown;
      };
    }

    // Create ReactDOM if it doesn't exist
    if (!window.ReactDOM) {
      window.ReactDOM = {
        createRoot: function () {
          return {
            render: function () { },
            unmount: function () { }
          };
        }
      } as unknown as typeof ReactDOMFull & typeof ReactDOMClient;
    }

    // Set up export fallbacks
    if (!window.__REACT_PROVIDED__) {
      try {
        // This patch helps fix issues when modules try to destructure from React
        const originalReactGet = Object.getOwnPropertyDescriptor(window, 'React')?.get;
        Object.defineProperty(window, 'React', {
          get: function() {
            const reactObj = originalReactGet ? originalReactGet.call(this) : window.React;

            // Prevent errors in code that destructures React exports
            reactObj.__esModule = true;
            reactObj.default = reactObj;

            return reactObj;
          },
          configurable: true
        });

        window.__REACT_PROVIDED__ = true;
      } catch (e) {
        console.error('[ReactDebug] Failed to set up React export fallbacks', e);
      }
    }

    // Log React initialization status
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        '[ReactDebug] React global status:',
        {
          isDefined: !!window.React,
          hasChildren: !!window.React.Children,
          hasCreateElement: !!window.React.createElement,
        }
      );
    }
  }
}

/**
 * Create a safe React global object that tracks property access
 * to help identify what's causing initialization errors
 */
export function createReactProxy(): void {
  if (typeof window !== 'undefined' && !window.__REACT_PROXY_ACTIVE) {
    const originalReact = window.React || {} as typeof React;

    // Save original React
    window.__ORIGINAL_REACT = originalReact;

    // Create proxy to track property access
    const reactProxy = new Proxy(originalReact, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        console.debug(`[ReactProxy] Accessing React.${String(prop)}`);

        // If the property doesn't exist, create a dummy function to prevent errors
        if (value === undefined && typeof prop === 'string') {
          console.warn(`[ReactProxy] Missing React property: ${prop}`);

          // For functions, return a dummy function
          if (['createElement', 'cloneElement', 'createContext', 'memo'].includes(prop)) {
            return function reactDummy() {
              console.warn(`[ReactProxy] Called missing React.${prop}`);
              return null;
            };
          }

          // For objects, return an empty object
          return {};
        }

        return value;
      },
      set(target, prop, value) {
        console.debug(`[ReactProxy] Setting React.${String(prop)}`);
        return Reflect.set(target, prop, value);
      }
    });

    // Replace window.React with our proxy
    window.React = reactProxy as typeof React;
    window.__REACT_PROXY_ACTIVE = true;

    console.debug('[ReactDebug] Installed React proxy for debugging');
  }
}

// Fix module export issues
export function fixReactExports(): void {
  if (typeof window !== 'undefined') {
    try {
      // Find any React exports in the page
      const possibleReactModules = Object.keys(window)
        .filter(key => /^__REACT_|^REACT_|react/.test(key))
        // Sử dụng cách chuyển đổi kiểu an toàn hơn
        .map(key => {
          const windowObj = window as unknown as Record<string, unknown>;
          return windowObj[key];
        });

      // Try to identify and fix React exports
      possibleReactModules.forEach(module => {
        if (module && typeof module === 'object') {
          // If it has a createElement property, it's likely React
          const reactLikeModule = module as Record<string, unknown>;
          if (reactLikeModule.createElement && !reactLikeModule.default) {
            reactLikeModule.default = module;
            reactLikeModule.__esModule = true;
            console.debug('[ReactDebug] Fixed missing default export for React-like module');
          }
        }
      });
    } catch (e) {
      console.warn('[ReactDebug] Error fixing React exports:', e);
    }
  }
}

// Extend Window interface - phải tương thích với định nghĩa trong main.tsx
declare global {
  interface Window {
    // Sử dụng kiểu trùng với main.tsx
    React: typeof React;
    ReactDOM: typeof ReactDOMFull & typeof ReactDOMClient;
    __ORIGINAL_REACT?: typeof React;
    __REACT_PROXY_ACTIVE?: boolean;
    __REACT_PROVIDED__?: boolean;
  }
}
