/**
 * React Debug Utilities - Enhanced version
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
    // Create a basic React object first if it doesn't exist
    if (!window.React) {
      console.info('[ReactDebug] Creating React global object');
      window.React = {};
    }

    // Ensure key React properties exist
    window.React.Children = window.React.Children || {};
    window.React.Fragment = window.React.Fragment || Symbol('Fragment');

    if (!window.React.createElement) {
      window.React.createElement = function() {
        return null;
      };
    }

    if (!window.React.createContext) {
      window.React.createContext = function() {
        return { Provider: null, Consumer: null };
      };
    }

    // Create ReactDOM if it doesn't exist
    if (!window.ReactDOM) {
      window.ReactDOM = {
        createRoot: function() {
          return {
            render: function() {},
            unmount: function() {}
          };
        }
      };
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

// Fix module export issues
export function fixReactExports(): void {
  if (typeof window !== 'undefined') {
    try {
      // Find any React exports in the page
      const possibleReactModules = Object.keys(window)
        .filter(key => /^__REACT_|^REACT_|react/.test(key))
        .map(key => window[key as keyof Window]);

      // Try to identify and fix React exports
      possibleReactModules.forEach(module => {
        if (module && typeof module === 'object') {
          // If it has a createElement property, it's likely React
          if (module.createElement && !module.default) {
            module.default = module;
            module.__esModule = true;
            console.debug('[ReactDebug] Fixed missing default export for React-like module');
          }
        }
      });
    } catch (e) {
      console.warn('[ReactDebug] Error fixing React exports:', e);
    }
  }
}

// Extend Window interface
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __ORIGINAL_REACT?: any;
    __REACT_PROXY_ACTIVE?: boolean;
    __REACT_PROVIDED__?: boolean;
  }
}
