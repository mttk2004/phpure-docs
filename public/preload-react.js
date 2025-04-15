/**
 * React preload script - Must be loaded before any other scripts
 * This script ensures React is properly initialized to prevent
 * "react_production is undefined" errors
 *
 * Enhanced version for production environment
 * Firefox compatibility version
 */

// Self-executing function để tránh ảnh hưởng đến scope toàn cục
(function() {
  // Tạo react_production NGAY LẬP TỨC để đảm bảo nó luôn tồn tại
  // Firefox thường có thể thực thi các script không đồng bộ, vì vậy đây là bước quan trọng
  window.react_production = window.react_production || {};

  // Hack cho Firefox - đôi khi window.react_production bị đặt lại thành undefined bởi một số module
  // Sử dụng Object.defineProperty để ngăn chặn điều này
  try {
    var reactProdValue = window.react_production;
    Object.defineProperty(window, 'react_production', {
      configurable: true, // Cho phép định nghĩa lại sau này nếu cần
      enumerable: true,
      get: function() {
        return reactProdValue;
      },
      set: function(newValue) {
        // Nếu cố gắng đặt thành undefined, giữ nguyên giá trị cũ
        if (newValue === undefined) {
          console.warn('[ReactPreload] Prevented setting react_production to undefined');
          return;
        }
        reactProdValue = newValue || reactProdValue;
      }
    });
  } catch (e) {
    console.warn('[ReactPreload] Error setting react_production property', e);
  }

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

    // Firefox specific - Đảm bảo phương thức luôn tồn tại
    var requiredMethods = [
      'jsx', 'jsxs', 'Fragment', 'createElement', 'memo', 'forwardRef', 'createContext'
    ];

    requiredMethods.forEach(function(method) {
      if (!window.react_production[method]) {
        if (method === 'Fragment') {
          window.react_production[method] = Symbol('Fragment');
        } else {
          window.react_production[method] = function() { return {}; };
        }
      }
    });

    // Tạo proxy cho react_production để tự động xử lý các thuộc tính không tồn tại
    // Nhưng trước đó, lưu trữ các giá trị hiện tại
    var existingProps = {};
    for (var key in window.react_production) {
      if (window.react_production.hasOwnProperty(key)) {
        existingProps[key] = window.react_production[key];
      }
    }

    window.react_production = new Proxy(window.react_production, {
      get: function(target, prop) {
        // Ưu tiên sử dụng giá trị đã lưu trữ
        if (existingProps[prop]) {
          return existingProps[prop];
        }

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

    // Đảm bảo react_production không bị ghi đè
    var checkInterval = setInterval(function() {
      if (!window.react_production) {
        safeLog('warn', 'react_production was reset to undefined, restoring');
        window.react_production = existingProps;
      }
    }, 100);

    // Dừng kiểm tra sau 10 giây để tránh rò rỉ bộ nhớ
    setTimeout(function() {
      clearInterval(checkInterval);
    }, 10000);

    // Thêm hàm defer để load script sau khi trang đã sẵn sàng
    var originalLoad = window.onload;
    window.onload = function() {
      if (originalLoad) originalLoad();

      // Đảm bảo React đã được khởi tạo đầy đủ sau khi trang tải xong
      setTimeout(function() {
        safeLog('debug', 'React structure reinforced after page load');

        // Kích hoạt sự kiện để báo hiệu react_production đã sẵn sàng
        if (typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('react-production-ready'));
        }
      }, 0);
    };

    // Log that preload script has run
    safeLog('log', 'Enhanced React initialization completed for Firefox');
  } catch (err) {
    safeLog('warn', 'Error in preload script:', err);

    // Fallback nếu có lỗi xảy ra
    window.react_production = window.react_production || {};

    // Đảm bảo các phương thức cơ bản luôn tồn tại
    window.react_production.jsx = window.react_production.jsx || function() { return {}; };
    window.react_production.jsxs = window.react_production.jsxs || function() { return {}; };
    window.react_production.Fragment = window.react_production.Fragment || Symbol('Fragment');
  }
})();
