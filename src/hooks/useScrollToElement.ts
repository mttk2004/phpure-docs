import { useCallback } from 'react';

/**
 * Hook trả về một hàm để xử lý việc cuộn đến một phần tử trong trang
 * @returns Function để xử lý sự kiện click trên các link trong mục lục
 */
export function useScrollToElement() {
  const scrollToElement = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const targetId = url.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Thêm id vào URL
      window.history.pushState({}, '', url);
      // Cuộn mượt đến vị trí
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return scrollToElement;
}
