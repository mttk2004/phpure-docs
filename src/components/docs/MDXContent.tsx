import React from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Link } from '@tanstack/react-router';
import { useTheme } from '@/hooks/useTheme';

interface MDXContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MDXContent({ children, className }: MDXContentProps) {
  const { theme } = useTheme();

  // Define theme-specific primary color class
  const primaryColorClass = theme === 'dark' ? 'text-primary-light' : 'text-primary';

  return (
    <div className={cn('mdx-content', className)}>
      <div className={cn(
        'prose dark:prose-invert max-w-none',
        'prose-headings:scroll-m-20 prose-headings:font-medium prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h2:border-border prose-h3:text-xl prose-h4:text-lg prose-img:rounded-md',
        `prose-a:${primaryColorClass}`,
        'prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:border-opacity-50 prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none'
      )}>
        {children}
      </div>
    </div>
  );
}

// Các components tái sử dụng cho MDX
export const MDXComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children?.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    return (
      <h1 id={id} className={cn("mt-6 scroll-m-20 text-3xl font-bold tracking-tight", className)} {...props} />
    );
  },
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children?.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    return (
      <h2 id={id} className={cn("mt-10 scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 border-border", className)} {...props} />
    );
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children?.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    return (
      <h3 id={id} className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
    );
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children?.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    return (
      <h4 id={id} className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props} />
    );
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={cn("mt-6 border-l-4 border-primary/50 bg-muted py-2 px-6 rounded-r-md", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const content = props.children?.toString() || '';

    // Trích xuất thông tin ngôn ngữ từ className
    const classNameStr = className || '';
    const languageMatch = classNameStr.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : 'text';

    // Kiểm tra xem code có phải là inline hay không
    const isInlineCode = !content.includes('\n') && content.length < 100;

    // Nếu là inline code và không có ngôn ngữ được chỉ định (hoặc là text), sử dụng giao diện đơn giản
    if (isInlineCode && (!languageMatch || language === 'text')) {
      return (
        <code className={cn("relative rounded-sm muted px-1.5 py-0.5 font-mono text-sm", classNameStr)} {...props} />
      );
    }

    // Sử dụng CodeBlock cho cả inline code có chỉ định ngôn ngữ và code blocks
    return (
      <CodeBlock
        code={content}
        language={language}
        showLineNumbers={!isInlineCode} // Chỉ hiển thị số dòng cho code blocks
        showCopyButton={!isInlineCode}  // Chỉ hiển thị nút copy cho code blocks
      />
    );
  },
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Xử lý đặc biệt cho pre>code
    const codeElement = React.Children.toArray(props.children).find(
      child => React.isValidElement(child) && child.type === 'code'
    ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;

    if (codeElement) {
      const code = codeElement.props.children?.toString() || '';
      // Lấy language từ className, thường có định dạng "language-xxx"
      const classNameStr = codeElement.props.className || '';
      const match = classNameStr.match(/language-(\w+)/);
      const language = match ? match[1] : 'text';

      // Nếu ngôn ngữ không được xác định, cố gắng dự đoán từ nội dung
      let detectedLanguage = language;
      if (detectedLanguage === 'text') {
        // Thử dự đoán ngôn ngữ từ nội dung
        if (code.includes('<?php') || code.includes('namespace ') || code.includes('use ')) {
          detectedLanguage = 'php';
        } else if (code.includes('function') && code.includes('=>')) {
          detectedLanguage = 'js';
        } else if (code.includes('import ') && code.includes('from ')) {
          detectedLanguage = 'jsx';
        } else if (code.includes('<template>') || code.includes('export default {')) {
          detectedLanguage = 'vue';
        } else if (code.includes('class ') && code.includes('extends ')) {
          detectedLanguage = 'typescript';
        }
      }

      return (
        <CodeBlock
          code={code}
          language={detectedLanguage}
          showLineNumbers={true}
          showCopyButton={true}
        />
      );
    }

    // Fallback nếu không phải pre>code
    return <pre className={cn("mt-6 overflow-x-auto rounded-lg border border-border bg-muted p-0", className)} {...props} />;
  },
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t border-border p-0 even:bg-muted", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className={cn("border border-border px-4 py-2 text-left font-semibold", className)} {...props} />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn("border border-border px-4 py-2 text-left", className)} {...props} />
  ),
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { theme } = useTheme();

    // Define theme-specific primary color class
    const primaryColorClass = theme === 'dark' ? 'text-primary-light' : 'text-primary';

    // Kiểm tra nếu href là external link
    const isExternal = href?.startsWith('http') || href?.startsWith('https') || href?.startsWith('//');

    if (isExternal) {
      return (
        <a
          className={cn(`${primaryColorClass} no-underline hover:underline`, className)}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    }

    return (
      <Link
        className={cn(`${primaryColorClass} no-underline hover:underline`, className)}
        to={href || ''}
        {...props}
      />
    );
  },
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn("rounded-md border border-border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
};

export default MDXContent;
