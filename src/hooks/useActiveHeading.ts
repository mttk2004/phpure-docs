import { useState, useEffect } from 'react';

interface TocItem {
  title: string;
  url: string;
  items?: {
    title: string;
    url: string;
  }[];
}

/**
 * Hook theo dõi các heading và trả về ID của heading đang active khi cuộn trang
 * @param toc Mảng các mục lục
 * @param options Cấu hình cho IntersectionObserver
 * @returns ID của heading đang active
 */
export function useActiveHeading(
  toc?: TocItem[],
  options = {
    rootMargin: '-100px 0px -80% 0px',
    threshold: 0
  }
) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    // Tạo danh sách các ID cần theo dõi
    const headingIds: string[] = [];
    toc.forEach(section => {
      if (section.url) {
        const id = section.url.replace('#', '');
        if (id) headingIds.push(id);
      }

      section.items?.forEach(item => {
        if (item.url) {
          const id = item.url.replace('#', '');
          if (id) headingIds.push(id);
        }
      });
    });

    // Callback khi có element nào đó đi vào viewport
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Lọc các mục đang hiển thị
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      // Nếu có mục đang hiển thị thì chọn mục đầu tiên (cao nhất trong trang)
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    // Tạo Observer
    const observer = new IntersectionObserver(observerCallback, options);

    // Đăng ký theo dõi các phần tử heading
    headingIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Xử lý trường hợp khi trang vừa tải hoặc không có phần tử nào được observe
    if (headingIds.length > 0) {
      const firstElement = document.getElementById(headingIds[0]);
      if (firstElement && window.scrollY < 200) {
        setActiveId(headingIds[0]);
      }
    }

    // Cleanup
    return () => {
      headingIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, [toc, options.rootMargin, options.threshold]);

  return activeId;
}
