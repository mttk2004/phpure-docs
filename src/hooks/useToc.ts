import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TocItem } from '@/types';
import { generateTocFromHeadings, extractHeadingsFromDOM, toKebabCase } from '@/utils';
import { fetchDocumentation, CURRENT_DOC_VERSION } from '@/utils/githubUtils';

/**
 * Extract headings from GitHub markdown content
 *
 * @param content The markdown content as a string
 * @returns Array of headings with level information
 */
function extractHeadingsFromMarkdown(content: string): { level: number; title: string; id: string }[] {
  if (!content) return [];

  // Match all headings (# Heading1, ## Heading2, etc)
  const headingRegex = /^(#{1,6})\s+(.+?)$/gm;
  const headings: { level: number; title: string; id: string }[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    // Generate consistent ID for the heading
    const id = toKebabCase(title);
    headings.push({ level, title, id });
  }

  return headings;
}

/**
 * Hook to automatically generate TOC from content
 * - For GitHub markdown: extract from markdown content
 * - Fallback to DOM extraction when needed
 */
export function useToc(contentKey: string, version: string = CURRENT_DOC_VERSION): { toc: TocItem[]; isLoading: boolean } {
  const { language } = useLanguage();
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const domExtractionAttempted = useRef(false);
  const maxRetries = useRef(5); // Max number of DOM extraction attempts
  const retryCount = useRef(0);

  useEffect(() => {
    async function loadToc() {
      setIsLoading(true);
      domExtractionAttempted.current = false;
      retryCount.current = 0;

      try {
        // Try to get markdown content from GitHub with language preference
        const filename = `${contentKey}.md`;

        try {
          // Try to get content with the current language
          const content = await fetchDocumentation(filename, language, version);
          const headings = extractHeadingsFromMarkdown(content);
          const generatedToc = generateTocFromHeadings(headings.map(heading => ({
            ...heading,
            text: heading.title
          })));

          if (generatedToc.length > 0) {
            setToc(generatedToc);
            setIsLoading(false);
            return;
          }
        } catch (langError) {
          console.log(`Error generating TOC from ${language} documentation: ${langError}`);

          // Only try fallback if current language is not English
          if (language !== 'en') {
            try {
              // Fallback to English if the current language failed
              const fallbackContent = await fetchDocumentation(filename, 'en', version);
              const headings = extractHeadingsFromMarkdown(fallbackContent);
              const generatedToc = generateTocFromHeadings(headings.map(heading => ({
                ...heading,
                text: heading.title
              })));

              if (generatedToc.length > 0) {
                setToc(generatedToc);
                setIsLoading(false);
                return;
              }
            } catch (fallbackError) {
              console.error(`Error generating TOC from fallback English documentation: ${fallbackError}`);
            }
          }
        }

        // If we get here, both attempts failed or found no headings
        // We'll wait for DOM-based extraction as a fallback
        console.log("Will rely on DOM-based extraction for TOC");
      } catch (error) {
        console.error(`Error generating TOC from GitHub markdown: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    function extractFromDOM() {
      domExtractionAttempted.current = true;
      // Extract from DOM
      const articleElement = document.querySelector('.mdx-content');
      if (articleElement) {
        const headings = extractHeadingsFromDOM(articleElement);
        const generatedToc = generateTocFromHeadings(headings);
        if (generatedToc.length > 0) {
          console.log('Successfully extracted TOC from DOM:', generatedToc);
          setToc(generatedToc);
          retryCount.current = 0; // Reset retry count on success
        } else if (retryCount.current < maxRetries.current) {
          // Retry DOM extraction if no headings were found
          console.log(`No headings found in DOM extraction attempt ${retryCount.current + 1}/${maxRetries.current}`);
          retryCount.current++;
          setTimeout(() => {
            domExtractionAttempted.current = false; // Reset so we can try again
            extractFromDOM();
          }, 300);
        }
      } else if (retryCount.current < maxRetries.current) {
        // If article element not found, retry after a short delay
        console.log(`Article element not found, retry attempt ${retryCount.current + 1}/${maxRetries.current}`);
        retryCount.current++;
        setTimeout(() => {
          domExtractionAttempted.current = false; // Reset so we can try again
          extractFromDOM();
        }, 300);
      }
    }

    // Register event listener to extract TOC after content is rendered
    const handleContentRendered = () => {
      console.log('Content rendered event received, extracting TOC from DOM');
      // Give a small delay to ensure React has finished rendering
      setTimeout(() => {
        if (!domExtractionAttempted.current) {
          extractFromDOM();
        }
      }, 100);
    };

    window.addEventListener('content-rendered', handleContentRendered);

    loadToc();

    return () => {
      window.removeEventListener('content-rendered', handleContentRendered);
    };
  }, [contentKey, language, version]);

  return { toc, isLoading };
}
