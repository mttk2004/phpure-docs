import React, { useState, useEffect } from 'react';
import { fetchDocumentation, CURRENT_DOC_VERSION } from '@/utils/githubUtils';
import { MDXContent, MDXComponents } from './MDXContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/contexts/LanguageContext';

interface GithubDocContentProps {
  filename: string;
  version?: string;
  branch?: string;
}

export function GithubDocContent({
  filename,
  version = CURRENT_DOC_VERSION,
  branch = 'main'
}: GithubDocContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // First useEffect - Load documentation
  useEffect(() => {
    async function loadDocumentation() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch the documentation file for the current language
        const documentContent = await fetchDocumentation(filename, language, version, branch);
        setContent(documentContent);
      } catch (error) {
        console.error(`Error loading documentation for ${language}: ${error}`);

        // If the current language failed, try fallback to English if not already English
        if (language !== 'en') {
          try {
            console.log(`Falling back to English documentation for ${filename}`);
            const fallbackContent = await fetchDocumentation(filename, 'en', version, branch);
            setContent(fallbackContent);
          } catch (fallbackError) {
            console.error(`Error loading fallback documentation: ${fallbackError}`);
            setError('Failed to load documentation from GitHub. Please try again later.');
          }
        } else {
          setError('Failed to load documentation from GitHub. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDocumentation();
  }, [filename, branch, version, language]);

  // Second useEffect - Dispatch content-rendered event
  useEffect(() => {
    if (content) {
      window.dispatchEvent(new CustomEvent('content-rendered'));
    }
  }, [content]);

  if (isLoading) {
    return <div className="animate-pulse p-4">Loading documentation...</div>;
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-4 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
        <p>No documentation content found.</p>
      </div>
    );
  }

  return (
    <MDXContent>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Use the styling and components from MDXComponents
          h1: MDXComponents.h1,
          h2: MDXComponents.h2,
          h3: MDXComponents.h3,
          h4: MDXComponents.h4,
          p: MDXComponents.p,
          ul: MDXComponents.ul,
          ol: MDXComponents.ol,
          li: MDXComponents.li,
          blockquote: MDXComponents.blockquote,
          table: MDXComponents.table,
          tr: MDXComponents.tr,
          th: MDXComponents.th,
          td: MDXComponents.td,
          a: MDXComponents.a,
          img: MDXComponents.img,
          hr: MDXComponents.hr,

          // Use the existing code block handler from MDXComponents
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              // For inline code like `utils/helpers.php`
              return <code className="relative rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>{children}</code>;
            }

            // For code blocks, use the existing MDXComponents code handler
            // The React Markdown parser will correctly identify code blocks between ```
            const content = children?.toString() || '';
            const lang = className ? className.replace('language-', '') : '';

            return MDXComponents.code({
              className,
              children: content,
              'data-language': lang,
              ...props
            });
          },

          // Use existing pre handler for code blocks
          pre: ({ node, children, className, ...props }) => {
            return MDXComponents.pre({ className, children, ...props });
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </MDXContent>
  );
}

export default GithubDocContent;
