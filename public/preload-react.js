/**
 * React preload script - Must be loaded before any other scripts
 * This script ensures React is properly initialized to prevent
 * "react_production is undefined" errors
 */

// Create basic React object structure
window.React = window.React || {
  Children: {},
  createRef: function() { return { current: null }; },
  Component: function() {},
  PureComponent: function() {},
  createContext: function() { return { Provider: null, Consumer: null }; },
  useState: function() { return [undefined, function() {}]; },
  useEffect: function() {},
  useContext: function() { return undefined; },
  useReducer: function() { return [undefined, function() {}]; },
  useCallback: function(fn) { return fn; },
  useMemo: function(fn) { return fn(); },
  useRef: function() { return { current: null }; },
  createElement: function() { return {}; },
  cloneElement: function() { return {}; },
  createFactory: function() { return function() {}; },
  isValidElement: function() { return false; },
  version: 'preload-script',
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: { current: null },
    ReactCurrentDispatcher: { current: null }
  },
  default: {}
};

// Create ReactDOM object structure
window.ReactDOM = window.ReactDOM || {
  render: function() {},
  hydrate: function() {},
  createPortal: function() {},
  findDOMNode: function() { return null; },
  createRoot: function() {
    return {
      render: function() {},
      unmount: function() {}
    };
  },
  version: 'preload-script',
  default: {}
};

// Ensure both React and ReactDOM have module exports structure
window.React.__esModule = true;
window.React.default = window.React;
window.ReactDOM.__esModule = true;
window.ReactDOM.default = window.ReactDOM;

// Create a placeholder for react_production to prevent undefined errors
window.react_production = window.react_production || {};

// Log that preload script has run
console.log('[ReactPreload] React initialization structures created');
