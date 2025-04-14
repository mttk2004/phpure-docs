/**
 * React Debug Utilities
 *
 * This file contains utilities to help debug React initialization issues
 * particularly in production builds where errors like "Cannot set property of undefined"
 * might occur due to module loading or initialization order problems.
 */

/**
 * Initialize React global object with proper structure to prevent
 * "Cannot set properties of undefined" errors
 */
export function ensureReactGlobals(): void {
  if (typeof window !== 'undefined') {
    // Make sure React exists on window
    if (!window.React) {
      console.warn('[ReactDebug] Window.React was undefined, initializing empty object');
      window.React = {};
    }

    // Ensure key React properties exist to prevent "Cannot set properties of undefined" errors
    if (!window.React.Children) {
      window.React.Children = {};
    }

    if (!window.React.createElement) {
      window.React.createElement = function() {
        console.warn('[ReactDebug] React.createElement was called before React was fully initialized');
        return null;
      };
    }

    if (!window.React.createContext) {
      window.React.createContext = function() {
        console.warn('[ReactDebug] React.createContext was called before React was fully initialized');
        return { Provider: null, Consumer: null };
      };
    }

    // Log React initialization status
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

/**
 * Create a safe React global object that tracks property access
 * to help identify what's causing initialization errors
 */
export function createReactProxy(): void {
  if (typeof window !== 'undefined' && !window.__REACT_PROXY_ACTIVE) {
    const originalReact = window.React || {};

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
    window.React = reactProxy;
    window.__REACT_PROXY_ACTIVE = true;

    console.debug('[ReactDebug] Installed React proxy for debugging');
  }
}

// Extend Window interface
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __ORIGINAL_REACT?: any;
    __REACT_PROXY_ACTIVE?: boolean;
  }
}
