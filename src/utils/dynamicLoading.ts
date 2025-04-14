/**
 * Utilities for dynamic loading and code splitting
 * Helps reduce initial JavaScript bundle size
 */

/**
 * Dynamically import a component with automatic retry
 * Use this for non-critical components to improve initial load time
 */
export function dynamicImport<T>(
  importFn: () => Promise<T>,
  options: { retries?: number; retryDelay?: number } = {}
): Promise<T> {
  const { retries = 2, retryDelay = 1000 } = options;

  return new Promise<T>((resolve, reject) => {
    const attempt = (attemptNumber: number) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          if (attemptNumber < retries) {
            console.debug(`Dynamic import failed, retrying (${attemptNumber + 1}/${retries})...`);
            setTimeout(() => attempt(attemptNumber + 1), retryDelay);
          } else {
            reject(error);
          }
        });
    };

    attempt(0);
  });
}

/**
 * Load resources based on network conditions and viewport visibility
 * @param url URL of the resource to load
 * @param type Resource type ('script', 'style', 'image', etc.)
 * @param priority Priority of the resource ('high', 'low', 'auto')
 */
export function loadResourceAdaptively(
  url: string,
  type: 'script' | 'style' | 'image' | 'font' | 'fetch',
  priority: 'high' | 'low' | 'auto' = 'auto'
): Promise<any> {
  // Check network conditions
  const connection = (navigator as any).connection;
  const isSlowConnection = connection &&
    (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');

  // Adjust priority based on connection
  const effectivePriority = isSlowConnection && priority === 'auto' ? 'low' : priority;

  return new Promise((resolve, reject) => {
    // For low priority resources, delay loading until idle or timeout
    if (effectivePriority === 'low') {
      const scheduleLoad = () => {
        if ('requestIdleCallback' in window) {
          // Simple call without type definitions to avoid unused type warnings
          (window as any).requestIdleCallback(
            () => loadResource(url, type).then(resolve).catch(reject),
            { timeout: 3000 }
          );
        } else {
          setTimeout(() => loadResource(url, type).then(resolve).catch(reject), 300);
        }
      };

      // If IntersectionObserver is available, load when visible
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            scheduleLoad();
            observer.disconnect();
          }
        }, { rootMargin: '200px' });

        // Create a marker element
        const marker = document.createElement('div');
        marker.style.height = '1px';
        marker.style.width = '1px';
        marker.style.position = 'absolute';
        marker.style.visibility = 'hidden';
        document.body.appendChild(marker);

        observer.observe(marker);

        // Fallback - load after a timeout regardless of visibility
        setTimeout(() => {
          if (document.body.contains(marker)) {
            document.body.removeChild(marker);
            observer.disconnect();
            scheduleLoad();
          }
        }, 5000);
      } else {
        // Fallback if IntersectionObserver is not available
        scheduleLoad();
      }
    } else {
      // For high priority resources, load immediately
      loadResource(url, type).then(resolve).catch(reject);
    }
  });
}

/**
 * Helper function to load a resource based on type
 */
function loadResource(url: string, type: 'script' | 'style' | 'image' | 'font' | 'fetch'): Promise<any> {
  switch (type) {
    case 'script':
      return new Promise<HTMLScriptElement>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.head.appendChild(script);
      });

    case 'style':
      return new Promise<HTMLLinkElement>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve(link);
        link.onerror = reject;
        document.head.appendChild(link);
      });

    case 'image':
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    case 'font':
      return new Promise<HTMLLinkElement>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        link.onload = () => resolve(link);
        link.onerror = reject;
        document.head.appendChild(link);
      });

    case 'fetch':
      return fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        return response;
      });

    default:
      return Promise.reject(new Error(`Unsupported resource type: ${type}`));
  }
}
