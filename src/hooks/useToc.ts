import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TocItem } from '@/types';
import { extractHeadingsFromMDX, generateTocFromHeadings, extractHeadingsFromDOM } from '@/utils';

/**
 * Hook để tự động tạo TOC từ nội dung MDX
 */
export function useToc(contentKey: string): { toc: TocItem[]; isLoading: boolean } {
  const { language } = useLanguage();
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const domExtractionAttempted = useRef(false);

  // Lắng nghe sự kiện content-rendered để trích xuất TOC từ DOM khi nội dung đã được render hoàn tất
  useEffect(() => {
    function extractTocFromDOM() {
      if (domExtractionAttempted.current || toc.length > 0) return;

      domExtractionAttempted.current = true;
      // Đợi một chút để đảm bảo MDX đã được render đầy đủ
      setTimeout(() => {
        const domToc = extractHeadingsFromDOM();
        if (domToc.length > 0) {
          setToc(domToc);
        }
      }, 500);
    }

    // Đăng ký sự kiện render hoàn tất (nếu được kích hoạt từ DynamicMDX)
    window.addEventListener('content-rendered', extractTocFromDOM);

    // Thiết lập timeout dự phòng để trích xuất DOM nếu không nhận sự kiện
    const fallbackTimer = setTimeout(extractTocFromDOM, 1000);

    return () => {
      window.removeEventListener('content-rendered', extractTocFromDOM);
      clearTimeout(fallbackTimer);
    };
  }, [toc]);

  // Cố gắng trích xuất TOC từ nội dung MDX
  useEffect(() => {
    async function loadToc() {
      setIsLoading(true);
      domExtractionAttempted.current = false;

      try {
        // Thử tải nội dung với ngôn ngữ hiện tại
        const module = await import(`@/content/${language}/${contentKey}.mdx`);

        // Phương pháp 1: Trích xuất từ source code
        if (module.__esModule && module.default && typeof module.default.toString === 'function') {
          try {
            const content = module.default.toString();
            const headings = extractHeadingsFromMDX(content);
            const generatedToc = generateTocFromHeadings(headings);

            if (generatedToc.length > 0) {
              setToc(generatedToc);
            } else {
              // Nếu không thể trích xuất được headings từ source code,
              // chúng ta sẽ dựa vào DOM extraction ở useEffect trên
              console.log('No headings extracted from source, waiting for DOM extraction');
            }
          } catch (parseError) {
            console.error('Error parsing MDX source:', parseError);
            // Dựa vào DOM extraction
          }
        } else {
          // Không thể trích xuất source code, sẽ dựa vào DOM extraction
          console.log('Cannot extract source code, will use DOM extraction');
        }
      } catch (primaryError) {
        console.error(`Failed to generate TOC for ${contentKey} in ${language}:`, primaryError);

        // Thử với ngôn ngữ khác nếu ngôn ngữ hiện tại không khả dụng
        const fallbackLang = language === 'vi' ? 'en' : 'vi';
        try {
          const fallbackModule = await import(`@/content/${fallbackLang}/${contentKey}.mdx`);

          if (fallbackModule.__esModule && fallbackModule.default && typeof fallbackModule.default.toString === 'function') {
            const content = fallbackModule.default.toString();
            const headings = extractHeadingsFromMDX(content);
            const generatedToc = generateTocFromHeadings(headings);

            if (generatedToc.length > 0) {
              setToc(generatedToc);
            }
          }
        } catch (fallbackError) {
          console.error(`Failed to generate TOC with fallback language:`, fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadToc();
  }, [contentKey, language]);

  return { toc, isLoading };
}
