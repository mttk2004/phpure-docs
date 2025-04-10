import { useEffect } from 'react';

// Tự định nghĩa interface cho LazySizesConfig thay vì import
interface LazySizesConfig {
  lazyClass?: string;
  loadedClass?: string;
  loadingClass?: string;
  preloadClass?: string;
  errorClass?: string;
  autosizesClass?: string;
  fastLoadedClass?: string;
  iframeLoadMode?: number;
  srcAttr?: string;
  srcsetAttr?: string;
  sizesAttr?: string;
  preloadAfterLoad?: boolean;
  expFactor?: number;
  expand?: number;
  loadMode?: number;
}

declare global {
  // Mở rộng window để thêm lazySizes config
  interface Window {
    lazySizesConfig: LazySizesConfig;
  }

  // Định nghĩa kiểu cho navigator.connection
  interface Navigator {
    connection?: {
      saveData: boolean;
      effectiveType: string;
    };
  }
}

/**
 * Hook tối ưu hóa hiệu suất ứng dụng
 *
 * Thực hiện các biện pháp sau:
 * 1. Lazy load components không hiển thị ngay (trì hoãn tải JavaScript)
 * 2. Prefetch components mà người dùng có thể sẽ dùng trong tương lai gần
 * 3. Ngăn chặn không cần thiết re-renders
 * 4. Sử dụng passive event listeners
 * 5. Hủy đăng ký các event listener không cần thiết
 */
export const usePerformanceOptimizations = () => {
  useEffect(() => {
    // Script optimization
    const deferNonCriticalScripts = () => {
      // Tìm tất cả các scripts không quan trọng
      const scripts = document.querySelectorAll('script:not([type="application/ld+json"])');
      scripts.forEach(script => {
        if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
          script.setAttribute('defer', '');
        }
      });
    };

    // Lazy load images
    const setupLazyLoading = () => {
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
        });
      } else {
        // Fallback for browsers not supporting native lazy loading
        import('lazysizes').catch(() => {
          console.warn('Lazysizes could not be loaded');
        });
      }
    };

    // Use Intersection Observer for elements
    const setupIntersectionObserver = () => {
      // Tối ưu hóa cho các phần tử chỉ cần hiển thị khi người dùng xem đến
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Khi phần tử này hiển thị trong viewport, thực hiện tải JS liên quan
              const element = entry.target as HTMLElement;

              // Xử lý các phần tử hình ảnh
              if (element instanceof HTMLImageElement && element.dataset.src) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
              }

              // Tải các scripts dynamic
              if (element.dataset.script) {
                const script = document.createElement('script');
                script.src = element.dataset.script;
                script.defer = true;
                document.body.appendChild(script);
                element.removeAttribute('data-script');
              }

              // Tải các styles dynamic
              if (element.dataset.style) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = element.dataset.style;
                document.head.appendChild(link);
                element.removeAttribute('data-style');
              }

              // Đã xử lý xong, không cần quan sát nữa
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '100px',  // Bắt đầu tải trước khi element cách viewport 100px
          threshold: 0.1        // Bắt đầu tải khi ít nhất 10% element hiển thị
        }
      );

      // Quan sát các elements cần lazy load
      document.querySelectorAll('[data-src], [data-script], [data-style]').forEach(el => {
        observer.observe(el);
      });
    };

    // Sử dụng passive event listeners
    const setupPassiveEventListeners = () => {
      const wheelOpts = { passive: true };
      const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

      document.addEventListener(wheelEvent, () => {}, wheelOpts);
      document.addEventListener('touchstart', () => {}, wheelOpts);
      document.addEventListener('touchmove', () => {}, wheelOpts);
    };

    // Prefetch các routes có thể được truy cập tiếp theo
    const prefetchPossibleRoutes = () => {
      // Prefetch chỉ thực hiện khi mạng tốt và CPU không quá tải
      const connection = navigator.connection;

      if (connection && (connection.saveData || connection.effectiveType === '2g')) {
        // Không prefetch trên kết nối tiết kiệm dữ liệu hoặc mạng chậm
        return;
      }

      // Tìm tất cả các liên kết trên trang
      const links = document.querySelectorAll('a');
      const prefetchedUrls = new Set<string>();

      // Quan sát các liên kết, prefetch khi người dùng hover
      links.forEach(link => {
        if (link.href && !prefetchedUrls.has(link.href) && link.href.startsWith(window.location.origin)) {
          link.addEventListener('mouseenter', () => {
            const linkUrl = new URL(link.href);

            // Tạo một link prefetch
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = linkUrl.pathname;
            document.head.appendChild(prefetchLink);

            prefetchedUrls.add(link.href);
          }, { once: true }); // Chỉ thực hiện một lần
        }
      });
    };

    // Thực hiện tất cả các tối ưu hóa
    deferNonCriticalScripts();
    setupLazyLoading();
    setupIntersectionObserver();
    setupPassiveEventListeners();

    // Thực hiện prefetching sau khi trang đã tải xong
    if (document.readyState === 'complete') {
      prefetchPossibleRoutes();
    } else {
      window.addEventListener('load', prefetchPossibleRoutes);
    }

    // Clean up
    return () => {
      window.removeEventListener('load', prefetchPossibleRoutes);
    };
  }, []);
};

export default usePerformanceOptimizations;
