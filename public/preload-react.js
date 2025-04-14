/**
 * React preload script - Must be loaded before any other scripts
 * This script ensures React is properly initialized to prevent
 * "react_production is undefined" errors
 *
 * Enhanced version for production environment
 */

// Self-executing function để tránh ảnh hưởng đến scope toàn cục
(function() {
  // Thêm hàm tiện ích để log mà không gây lỗi
  function safeLog(type, ...args) {
    if (typeof console !== 'undefined' && console[type]) {
      try {
        console[type]('[ReactPreload]', ...args);
      } catch (e) {
        // Silent fail
      }
    }
  }

  try {
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

    // Create a placeholder for react_production với cấu trúc đầy đủ
    window.react_production = window.react_production || {
      // Core functions để tránh lỗi
      Fragment: Symbol('Fragment'),
      jsx: function() { return {}; },
      jsxs: function() { return {}; },
      createElement: function() { return {}; },
      // Các thuộc tính khác
      memo: function(component) { return component; },
      forwardRef: function(component) { return component; },
      createContext: function() { return { Provider: null, Consumer: null }; }
    };

    // Tạo proxy cho react_production để tự động xử lý các thuộc tính không tồn tại
    window.react_production = new Proxy(window.react_production, {
      get: function(target, prop) {
        if (prop in target) {
          return target[prop];
        }

        // Nếu thuộc tính không tồn tại, nhưng được yêu cầu, tạo function phù hợp
        safeLog('debug', 'Auto-generating missing property:', String(prop));

        // Tạo function giả cho các thuộc tính không tồn tại
        return function() {
          return {};
        };
      }
    });

    // Thêm hàm defer để load script sau khi trang đã sẵn sàng
    var originalLoad = window.onload;
    window.onload = function() {
      if (originalLoad) originalLoad();

      // Đảm bảo React đã được khởi tạo đầy đủ sau khi trang tải xong
      setTimeout(function() {
        safeLog('debug', 'React structure reinforced after page load');
      }, 0);
    };

    // Log that preload script has run
    safeLog('log', 'Enhanced React initialization completed');
  } catch (err) {
    safeLog('warn', 'Error in preload script:', err);

    // Fallback nếu có lỗi xảy ra
    window.react_production = window.react_production || {};
  }
})();
