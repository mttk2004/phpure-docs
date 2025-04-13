import React, { useState, useEffect, useRef } from 'react';
import { fetchDocumentation, CURRENT_DOC_VERSION } from '@/utils/githubUtils';
import { MDXContent, MDXComponents } from './MDXContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/contexts/LanguageContext';
import { toKebabCase } from '@/utils/tocUtils';  // Import the kebab case utility

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
  const contentRef = useRef<HTMLDivElement>(null);
  const contentRendered = useRef(false);

  // First useEffect - Load documentation
  useEffect(() => {
    async function loadDocumentation() {
      setIsLoading(true);
      setError(null);
      contentRendered.current = false;

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
    if (content && !contentRendered.current) {
      // Use a slightly longer timeout to ensure the content is fully rendered in the DOM
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('content-rendered'));
        contentRendered.current = true;
        console.log('Content rendered event dispatched for:', filename);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [content, filename]);

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

  // Create custom heading components with proper ID generation
  const createHeadingComponent = (level: number) => {
    return ({ children }: { children?: React.ReactNode }) => {
      const text = children?.toString() || '';
      // Generate consistent ID for the heading
      const id = toKebabCase(text);

      // Use the appropriate heading component from MDXComponents
      const Component = MDXComponents[`h${level}` as keyof typeof MDXComponents];

      return <Component id={id}>{children}</Component>;
    };
  };

  return (
    <div ref={contentRef} className="mdx-content">
      <MDXContent>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Use custom heading components with proper ID generation
            h1: createHeadingComponent(1),
            h2: createHeadingComponent(2),
            h3: createHeadingComponent(3),
            h4: createHeadingComponent(4),
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
            code: ({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
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
                ['data-language']: lang,
                ...props
              } as React.HTMLAttributes<HTMLElement>);
            },

            // Use existing pre handler for code blocks
            pre: ({ children, className, ...props }) => {
              return MDXComponents.pre({ className, children, ...props });
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </MDXContent>
    </div>
  );
}

export default GithubDocContent;
