/**
 * preload-react.js - Enhanced version with cross-browser support
 * This script khởi tạo các đối tượng React cần thiết trước khi các module khác được tải
 * Để đảm bảo tương thích trên mọi trình duyệt (Chrome, Firefox, Safari)
 */

(function() {
  "use strict";

  // Tạo một bản backup cho React object
  var _react = window.React || {};
  var _reactDOM = window.ReactDOM || {};
  var _react_production = window.react_production || {};

  // Khởi tạo React với cách tiếp cận comprehensive hơn
  function initializeReactObjects() {
    // Khởi tạo React.Children - đây là phần gây lỗi trong Chrome
    window.React = window.React || {};
    if (!window.React.Children) {
      window.React.Children = {
        map: function(children, func, context) { return Array.isArray(children) ? children.map(func, context) : []; },
        forEach: function(children, func, context) { Array.isArray(children) && children.forEach(func, context); },
        count: function(children) { return Array.isArray(children) ? children.length : 0; },
        only: function() { return null; },
        toArray: function(children) { return Array.isArray(children) ? children : []; }
      };
    }

    // Thiết lập các thuộc tính React cốt lõi
    if (!window.React.createRef) window.React.createRef = function() { return { current: null }; };
    if (!window.React.Component) window.React.Component = function() { this.props = {}; this.state = {}; };
    if (!window.React.PureComponent) window.React.PureComponent = function() { this.props = {}; this.state = {}; };
    if (!window.React.createContext) window.React.createContext = function() { return { Provider: null, Consumer: null }; };
    if (!window.React.useState) window.React.useState = function(initialState) { return [initialState, function() {}]; };
    if (!window.React.useEffect) window.React.useEffect = function() {};
    if (!window.React.useContext) window.React.useContext = function() { return undefined; };
    if (!window.React.useReducer) window.React.useReducer = function(reducer, initialState) { return [initialState, function() {}]; };
    if (!window.React.useCallback) window.React.useCallback = function(fn) { return fn; };
    if (!window.React.useMemo) window.React.useMemo = function(fn) { return fn(); };
    if (!window.React.useRef) window.React.useRef = function() { return { current: null }; };
    if (!window.React.Fragment) window.React.Fragment = Symbol('Fragment');
    if (!window.React.Suspense) window.React.Suspense = function() {};
    if (!window.React.createElement) window.React.createElement = function() { return {}; };
    if (!window.React.cloneElement) window.React.cloneElement = function() { return {}; };
    if (!window.React.createFactory) window.React.createFactory = function() { return function() {}; };
    if (!window.React.isValidElement) window.React.isValidElement = function() { return false; };
    if (!window.React.version) window.React.version = 'preload-script';
    if (!window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
        ReactCurrentOwner: { current: null },
        ReactCurrentDispatcher: { current: null }
      };
    }

    // Đảm bảo React có cấu trúc ES module đúng để các module có thể import đúng
    window.React.default = window.React;
    window.React.__esModule = true;

    // Khởi tạo ReactDOM đầy đủ
    window.ReactDOM = window.ReactDOM || {};
    if (!window.ReactDOM.render) window.ReactDOM.render = function() {};
    if (!window.ReactDOM.hydrate) window.ReactDOM.hydrate = function() {};
    if (!window.ReactDOM.createPortal) window.ReactDOM.createPortal = function() {};
    if (!window.ReactDOM.findDOMNode) window.ReactDOM.findDOMNode = function() { return null; };
    if (!window.ReactDOM.createRoot) {
      window.ReactDOM.createRoot = function() {
        return {
          render: function() {},
          unmount: function() {}
        };
      };
    }
    if (!window.ReactDOM.version) window.ReactDOM.version = 'preload-script';

    // Thiết lập ES module structure cho ReactDOM
    window.ReactDOM.default = window.ReactDOM;
    window.ReactDOM.__esModule = true;

    // Khởi tạo react_production - critical cho file biên dịch
    window.react_production = window.react_production || {};
    if (!window.react_production.jsx) window.react_production.jsx = window.React.createElement || function() { return {}; };
    if (!window.react_production.jsxs) window.react_production.jsxs = window.React.createElement || function() { return {}; };
    if (!window.react_production.Fragment) window.react_production.Fragment = window.React.Fragment || Symbol('Fragment');
  }

  // Sử dụng Object.defineProperty để tạo các đối tượng React an toàn (tránh bị ghi đè)
  function setupSafeReactObjects() {
    try {
      // Tạo đối tượng React an toàn với getter và setter
      Object.defineProperty(window, 'React', {
        configurable: true,
        enumerable: true,
        get: function() {
          return _react;
        },
        set: function(newVal) {
          // Merge properties từ newVal vào _react đã lưu
          if (newVal && typeof newVal === 'object') {
            for (var key in newVal) {
              if (newVal.hasOwnProperty(key)) {
                _react[key] = newVal[key];
              }
            }
          }
        }
      });

      // Tạo đối tượng ReactDOM an toàn
      Object.defineProperty(window, 'ReactDOM', {
        configurable: true,
        enumerable: true,
        get: function() {
          return _reactDOM;
        },
        set: function(newVal) {
          if (newVal && typeof newVal === 'object') {
            for (var key in newVal) {
              if (newVal.hasOwnProperty(key)) {
                _reactDOM[key] = newVal[key];
              }
            }
          }
        }
      });

      // Tạo react_production an toàn
      Object.defineProperty(window, 'react_production', {
        configurable: true,
        enumerable: true,
        get: function() {
          return _react_production;
        },
        set: function(newVal) {
          // Nếu cố gắng đặt giá trị undefined, giữ nguyên đối tượng hiện tại
          if (newVal === undefined) {
            console.warn('[ReactPreload] Prevented setting react_production to undefined');
            return;
          }

          // Cập nhật các thuộc tính thay vì thay thế toàn bộ đối tượng
          if (newVal && typeof newVal === 'object') {
            for (var key in newVal) {
              if (newVal.hasOwnProperty(key)) {
                _react_production[key] = newVal[key];
              }
            }
          }
        }
      });

      console.log('[ReactPreload] Enhanced React initialization completed for all browsers');
    } catch (e) {
      console.error('[ReactPreload] Error setting up safe React objects:', e);
    }
  }

  // 1. Đầu tiên, khởi tạo các đối tượng React cần thiết
  initializeReactObjects();

  // 2. Sau đó, thiết lập các đối tượng an toàn để ngăn chúng bị undefined
  setupSafeReactObjects();

  // 3. Khởi tạo đối tượng toàn cầu để giám sát
  window.__REACT_PRELOAD_ACTIVE = true;
})();
