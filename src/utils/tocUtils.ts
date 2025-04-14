import { TocItem } from '@/types';

/**
 * Function to convert text to kebab-case (removes accents and replaces spaces with hyphens)
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
 * Extract headings from DOM after content has been rendered
 */
export function extractHeadingsFromDOM(container?: Element): HeadingInfo[] {
  if (typeof document === 'undefined') return [];

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
 * Convert a list of headings into a hierarchical TOC structure
 */
export function generateTocFromHeadings(headings: HeadingInfo[]): TocItem[] {
  // Skip h1 as it's usually the page title
  const filteredHeadings = headings.filter(h => h.level > 1);

  const toc: TocItem[] = [];

  // Create TOC from h2
  for (let i = 0; i < filteredHeadings.length; i++) {
    const heading = filteredHeadings[i];

    if (heading.level === 2) {
      const tocItem: TocItem = {
        title: heading.text,
        url: `#${heading.id}`,
        items: []
      };

      // Check for child headings (h3) of current h2
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

      // Only keep items property if there are child headings
      if (tocItem.items?.length === 0) {
        delete tocItem.items;
      }

      toc.push(tocItem);
    }
  }

  return toc;
}
