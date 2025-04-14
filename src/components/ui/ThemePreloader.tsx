import { useEffect } from 'react';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Component này sẽ preload (nạp trước) các styles của syntax highlighter
 * để tránh hiện tượng chớp (flash) khi chuyển đổi theme
 */
export default function ThemePreloader() {
  useEffect(() => {
    // Preload cả light và dark styles
    const preloadStyles = () => {
      try {
        // Tạo một stylesheet tạm thời để nạp trước các styles
        const styleSheet = document.createElement('style');

        // Tạo các placeholders cho các styles chính để nạp trước
        let preloadCSS = '';

        // Thêm một số selectors chính từ syntax highlighter
        preloadCSS += `
          .light-theme-preload { color: ${vs['color'] || '#000'}; }
          .dark-theme-preload { color: ${vscDarkPlus['color'] || '#fff'}; }
          .light-preload-token { color: ${vs['punctuation']?.color || '#000'}; }
          .dark-preload-token { color: ${vscDarkPlus['punctuation']?.color || '#fff'}; }
        `;

        styleSheet.textContent = preloadCSS;
        document.head.appendChild(styleSheet);

        // Tạo các phần tử ẩn để nạp trước các background và styles chính
        const preloadContainer = document.createElement('div');
        preloadContainer.className = 'syntax-block-preload';
        preloadContainer.style.cssText = 'position:absolute;width:0;height:0;opacity:0;visibility:hidden;overflow:hidden;';

        // Thêm các phần tử preload cho cả hai theme
        preloadContainer.innerHTML = `
          <div style="background-color:hsl(222, 47%, 11%)"></div>
          <div style="background-color:hsl(190, 50%, 98%)"></div>
          <span class="light-theme-preload"></span>
          <span class="dark-theme-preload"></span>
          <span class="light-preload-token"></span>
          <span class="dark-preload-token"></span>
        `;

        document.body.appendChild(preloadContainer);

        // Dọn dẹp sau 2 giây (khi đã nạp xong styles)
        setTimeout(() => {
          if (document.body.contains(preloadContainer)) {
            document.body.removeChild(preloadContainer);
          }
        }, 2000);
      } catch (error) {
        console.error('Error preloading syntax highlighter styles:', error);
      }
    };

    preloadStyles();
  }, []);

  return null; // Component này không render bất kỳ thứ gì
}
