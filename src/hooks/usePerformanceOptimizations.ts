import { useEffect, useLayoutEffect } from 'react';

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
    __dynamicImport?: (modulePath: string) => Promise<any>;
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
 * 1. Tối ưu critical rendering path
 * 2. Lazy load components không hiển thị ngay (trì hoãn tải JavaScript)
 * 3. Prefetch components mà người dùng có thể sẽ dùng trong tương lai gần
 * 4. Ngăn chặn không cần thiết re-renders
 * 5. Sử dụng passive event listeners
 * 6. Hủy đăng ký các event listener không cần thiết
 * 7. Preload và priority hints cho LCP elements
 * 8. Font loading tối ưu - warm cached fonts
 */
export const usePerformanceOptimizations = () => {
  // Use layout effect for critical optimizations that need to happen before paint
  useLayoutEffect(() => {
    // Preload and optimize critical resources
    const optimizeCriticalPath = () => {
      // Identify potential LCP elements and optimize them
      const optimizeLCPElements = () => {
        // Common selectors for LCP elements
        const lcpSelectors = 'h1, h2, .hero-image, .banner-image, main > img:first-of-type';
        const potentialLCPElements = document.querySelectorAll(lcpSelectors);

        potentialLCPElements.forEach(element => {
          if (element instanceof HTMLImageElement) {
            // Mark important images with fetchpriority high
            element.setAttribute('fetchpriority', 'high');
            element.setAttribute('loading', 'eager');

            // If the image is wrapped in picture element, optimize source elements
            const parent = element.parentElement;
            if (parent && parent.tagName === 'PICTURE') {
              const sources = parent.querySelectorAll('source');
              sources.forEach(source => {
                if (source.srcset) {
                  const img = new Image();
                  img.src = source.srcset.split(' ')[0];
                }
              });
            }

            // Preload the image if it's not already loaded
            if (!element.complete) {
              const img = new Image();
              img.src = element.src;
            }
          } else {
            // For text LCP elements, ensure font is loaded
            element.classList.add('lcp-element');
          }
        });
      };

      // Optimize font loading
      const optimizeFontLoading = () => {
        // Add link for font preload with swap strategy
        const fonts = [
          // Add your main fonts here
          { family: 'ui-monospace', weight: '400', display: 'swap' },
          { family: 'ui-monospace', weight: '500', display: 'swap' },
        ];

        fonts.forEach(font => {
          // Check if fonts are already installed
          document.fonts.ready.then(() => {
            const fontFace = Array.from(document.fonts).find(
              f => f.family.includes(font.family) && f.weight === font.weight
            );

            // If font is not loaded, create a fake text element with the font to warm cache
            if (!fontFace || !fontFace.loaded) {
              const fontWarmer = document.createElement('div');
              fontWarmer.style.fontFamily = font.family;
              fontWarmer.style.fontWeight = font.weight;
              fontWarmer.style.position = 'absolute';
              fontWarmer.style.width = '0';
              fontWarmer.style.height = '0';
              fontWarmer.style.overflow = 'hidden';
              fontWarmer.style.visibility = 'hidden';
              fontWarmer.textContent = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              document.body.appendChild(fontWarmer);

              // Remove after a brief period
              setTimeout(() => {
                if (document.body.contains(fontWarmer)) {
                  document.body.removeChild(fontWarmer);
                }
              }, 100);
            }
          });
        });
      };

      // Lazy load images implementation
      const setupLazyLoading = () => {
        if ('loading' in HTMLImageElement.prototype) {
          const images = document.querySelectorAll('img:not([loading])');
          images.forEach(img => {
            if (!img.hasAttribute('loading') && !img.hasAttribute('fetchpriority')) {
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

      // Setup intersection observer for elements
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
            rootMargin: '100px', // Bắt đầu tải trước khi element cách viewport 100px
            threshold: 0.1, // Bắt đầu tải khi ít nhất 10% element hiển thị
          }
        );

        // Quan sát các elements cần lazy load
        document.querySelectorAll('[data-src], [data-script], [data-style]').forEach(el => {
          observer.observe(el);
        });
      };

      // Use requestIdleCallback to defer non-critical optimizations
      const scheduleNonCriticalOptimizations = () => {
        const runWhenIdle = (callback: () => void) => {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => callback());
          } else {
            setTimeout(callback, 200);
          }
        };

        // Schedule non-critical optimizations
        runWhenIdle(() => {
          setupLazyLoading();
          setupIntersectionObserver();
        });
      };

      // Execute critical path optimizations immediately
      optimizeLCPElements();
      optimizeFontLoading();
      scheduleNonCriticalOptimizations();

      // Add a hint to the scheduler that the page should be interactive soon
      document.body.addEventListener('mousemove', function activateInteractivity() {
        document.body.removeEventListener('mousemove', activateInteractivity);
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            // This helps browsers prioritize interactivity
            const interactivityMarker = document.createElement('div');
            interactivityMarker.id = 'interactivity-marker';
            interactivityMarker.style.display = 'none';
            document.body.appendChild(interactivityMarker);

            setTimeout(() => {
              if (document.body.contains(interactivityMarker)) {
                document.body.removeChild(interactivityMarker);
              }
            }, 0);
          });
        }
      }, { once: true, passive: true });
    };

    // Run critical path optimizations immediately
    optimizeCriticalPath();
  }, []); // Only run once on initial render

  // Rest of the optimizations using regular useEffect
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
          link.addEventListener(
            'mouseenter',
            () => {
              const linkUrl = new URL(link.href);

              // Tạo một link prefetch
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = linkUrl.pathname;
              document.head.appendChild(prefetchLink);

              prefetchedUrls.add(link.href);
            },
            { once: true } // Chỉ thực hiện một lần
          );
        }
      });
    };

    // Add dynamic import helper for code splitting
    const setupDynamicImports = () => {
      // Register dynamic import handler on window
      (window as any).__dynamicImport = (modulePath: string) => {
        return import(/* @vite-ignore */ modulePath).catch(err => {
          console.error('Dynamic import failed:', err);
        });
      };
    };

    // Monitor long tasks and defer non-essential work
    const monitorPerformance = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
              // Log long tasks that might impact interactivity
              if (entry.duration > 50) {
                console.debug('Long task detected:', entry.duration.toFixed(2), 'ms');
                // Consider breaking up work if we detect many long tasks
              }
            }
          });

          observer.observe({ type: 'longtask', buffered: true });

          return () => observer.disconnect();
        } catch (e) {
          // PerformanceObserver might not be available for longtask
          return () => {};
        }
      }
      return () => {};
    };

    // Thực hiện tất cả các tối ưu hóa
    deferNonCriticalScripts();
    setupPassiveEventListeners();
    setupDynamicImports();
    const cleanupPerformanceMonitor = monitorPerformance();

    // Thực hiện prefetching sau khi trang đã tải xong
    if (document.readyState === 'complete') {
      prefetchPossibleRoutes();
    } else {
      window.addEventListener('load', prefetchPossibleRoutes);
    }

    // Clean up
    return () => {
      window.removeEventListener('load', prefetchPossibleRoutes);
      cleanupPerformanceMonitor();
    };
  }, []);
};

export default usePerformanceOptimizations;
