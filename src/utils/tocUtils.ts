import { TocItem } from '@/types';

/**
 * Hàm chuyển đổi chuỗi thành dạng kebab-case (loại bỏ dấu và thay thế khoảng trắng bằng dấu gạch ngang)
 */
export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface HeadingInfo {
  level: number;
  text: string;
  id: string;
}

/**
 * Phân tích nội dung MDX để lấy các heading
 */
export function extractHeadingsFromMDX(content: string): HeadingInfo[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: HeadingInfo[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    let text = match[2].trim();

    // Loại bỏ các ký tự markdown trong tiêu đề
    text = text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .trim();

    const id = toKebabCase(text);

    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Tạo TOC từ nội dung HTML đã được render
 * (fallback cho trường hợp không thể trích xuất từ MDX)
 */
export function extractHeadingsFromDOM(container?: Element): HeadingInfo[] {
  if (typeof document === 'undefined') return [];

  // Target heading elements inside the provided container or any relevant content area
  const selectors = [
    '.mdx-content h2, .mdx-content h3', // For GitHub content
    '.prose h2, .prose h3',             // For MDX content
    'article h2, article h3',           // Generic fallback
    'main h2, main h3'                  // Another fallback
  ];

  // Find container element if not provided
  const targetContainer = container ||
    document.querySelector('.mdx-content') ||
    document.querySelector('.prose') ||
    document.querySelector('article') ||
    document;

  // Get all heading elements from the container
  const headings = Array.from(targetContainer.querySelectorAll('h2, h3'));

  // Process each heading
  const headingInfos: HeadingInfo[] = headings.map((heading) => {
    const headingElement = heading as HTMLElement;
    const id = headingElement.id;
    const text = headingElement.textContent || '';
    const level = parseInt(headingElement.tagName.charAt(1));

    return {
      level,
      text,
      id: id || toKebabCase(text) // Use existing ID or generate one
    };
  });

  console.log('Extracted headings from DOM:', headingInfos.length, headingInfos);
  return headingInfos;
}

/**
 * Chuyển đổi danh sách heading thành cấu trúc TOC phân cấp
 */
export function generateTocFromHeadings(headings: HeadingInfo[]): TocItem[] {
  // Bỏ qua h1 vì thường là tiêu đề trang
  const filteredHeadings = headings.filter(h => h.level > 1);

  const toc: TocItem[] = [];

  // Tạo TOC từ h2
  for (let i = 0; i < filteredHeadings.length; i++) {
    const heading = filteredHeadings[i];

    if (heading.level === 2) {
      const tocItem: TocItem = {
        title: heading.text,
        url: `#${heading.id}`,
        items: []
      };

      // Kiểm tra các heading con (h3) của h2 hiện tại
      let j = i + 1;
      while (j < filteredHeadings.length && filteredHeadings[j].level > 2) {
        if (filteredHeadings[j].level === 3) {
          tocItem.items?.push({
            title: filteredHeadings[j].text,
            url: `#${filteredHeadings[j].id}`
          });
        }
        j++;
      }

      // Chỉ giữ lại thuộc tính items nếu có heading con
      if (tocItem.items?.length === 0) {
        delete tocItem.items;
      }

      toc.push(tocItem);
    }
  }

  return toc;
}

/**
 * Sử dụng các đường dẫn tệp để tạo mục lục từ nội dung MDX trực tiếp
 */
export async function generateTocFromMDXFile(contentKey: string, language: string): Promise<TocItem[]> {
  try {
    const module = await import(`@/content/${language}/${contentKey}.mdx`);

    // Lấy nội dung source code của module nếu có thể
    if (module.__esModule && module.default && typeof module.default.toString === 'function') {
      const content = module.default.toString();
      const headings = extractHeadingsFromMDX(content);
      return generateTocFromHeadings(headings);
    }

    // Fallback: Nếu không thể trích xuất code, trả về mảng rỗng
    return [];
  } catch (error) {
    console.error(`Failed to generate TOC for ${contentKey} in ${language}:`, error);
    return [];
  }
}
