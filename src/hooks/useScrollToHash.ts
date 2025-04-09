import { useEffect } from 'react';

/**
 * Hook để xử lý hash trong URL và cuộn đến vị trí tương ứng
 * @param delay Thời gian trễ trước khi cuộn (milliseconds)
 */
export function useScrollToHash(delay: number = 0) {
  useEffect(() => {
    const handleScrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Đợi một chút để nội dung render hoàn tất
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, delay);
        }
      }
    };

    // Xử lý khi trang vừa tải xong
    handleScrollToHash();

    // Thêm event listener để xử lý khi URL thay đổi (khi người dùng nhấn back/forward)
    window.addEventListener('hashchange', handleScrollToHash);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleScrollToHash);
    };
  }, [delay]);
}
