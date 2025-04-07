import React from 'react';
import { cn } from '@/lib/utils';

interface MDXContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MDXContent({ children, className }: MDXContentProps) {
  return (
    <div className={cn('mdx-content', className)}>
      <div className="prose prose-zinc dark:prose-invert max-w-none
        prose-headings:scroll-m-20
        prose-headings:font-medium
        prose-h1:text-3xl
        prose-h1:font-bold
        prose-h2:text-2xl
        prose-h2:font-semibold
        prose-h2:border-b
        prose-h2:pb-2
        prose-h2:border-border
        prose-h3:text-xl
        prose-h4:text-lg
        prose-img:rounded-md
        prose-a:text-primary
        prose-a:no-underline
        hover:prose-a:underline
        prose-blockquote:border-l-primary
        prose-blockquote:border-opacity-50
        prose-blockquote:bg-muted
        prose-blockquote:py-1
        prose-blockquote:px-4
        prose-blockquote:rounded-r-md
        prose-pre:bg-muted
        prose-pre:border
        prose-pre:border-border
        prose-pre:rounded-md
        prose-code:bg-muted
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:rounded-md
        prose-code:text-sm
        prose-code:before:content-none
        prose-code:after:content-none">
        {children}
      </div>
    </div>
  );
}

// Các components tái sử dụng cho MDX
export const MDXComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("mt-2 scroll-m-20 text-3xl font-bold tracking-tight", className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("mt-10 scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 border-border", className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props} />
  ),
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
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className={cn("relative rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm", className)} {...props} />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("mt-6 overflow-x-auto rounded-lg border border-border bg-muted p-4", className)} {...props} />
  ),
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
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className={cn("text-primary no-underline hover:underline", className)} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn("rounded-md border border-border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
};

export default MDXContent;
