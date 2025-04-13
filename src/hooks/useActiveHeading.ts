import { useState, useEffect, useRef } from 'react';

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
  const headingElementsRef = useRef<{id: string, top: number}[]>([]);

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

    // Lưu trữ các phần tử heading và vị trí của chúng
    headingElementsRef.current = headingIds
      .map(id => {
        const element = document.getElementById(id);
        if (element) {
          return {
            id,
            top: element.getBoundingClientRect().top + window.scrollY
          };
        }
        return null;
      })
      .filter(item => item !== null) as {id: string, top: number}[];

    // Xác định heading active dựa trên vị trí cuộn hiện tại
    const findActiveHeading = () => {
      if (headingElementsRef.current.length === 0) return;

      // Lấy vị trí cuộn hiện tại + một offset nhỏ để ưu tiên heading phía trên
      const scrollPosition = window.scrollY + 150;

      // Tìm heading gần nhất phía trên vị trí cuộn
      for (let i = headingElementsRef.current.length - 1; i >= 0; i--) {
        const current = headingElementsRef.current[i];
        if (current.top <= scrollPosition) {
          setActiveId(current.id);
          return;
        }
      }

      // Nếu không tìm thấy heading nào, sử dụng heading đầu tiên
      setActiveId(headingElementsRef.current[0].id);
    };

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

    // Ngay sau khi tạo observer, xác định heading active dựa trên vị trí cuộn hiện tại
    findActiveHeading();

    // Thêm sự kiện lắng nghe cuộn trang
    const handleScroll = () => {
      findActiveHeading();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Thêm lắng nghe sự kiện content-rendered để cập nhật active heading
    const handleContentRendered = () => {
      setTimeout(() => {
        // Cập nhật lại vị trí của các heading sau khi nội dung thay đổi
        headingElementsRef.current = headingIds
          .map(id => {
            const element = document.getElementById(id);
            if (element) {
              return {
                id,
                top: element.getBoundingClientRect().top + window.scrollY
              };
            }
            return null;
          })
          .filter(item => item !== null) as {id: string, top: number}[];

        findActiveHeading();
      }, 100);
    };

    window.addEventListener('content-rendered', handleContentRendered);

    // Cleanup
    return () => {
      headingIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('content-rendered', handleContentRendered);
    };
  }, [toc, options]);

  return activeId;
}
