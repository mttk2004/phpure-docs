import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MDXContent } from './MDXContent';

interface MDXProviderProps {
  contentKey: string;
}

interface MDXMetadata {
  title?: string;
  description?: string;
  slug?: string;
  [key: string]: unknown; // Cho phép các trường metadata khác với kiểu unknown
}

export function MDXProvider({ contentKey }: MDXProviderProps) {
  const { language } = useLanguage();
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackLanguage, setFallbackLanguage] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        // Thử tải nội dung với ngôn ngữ hiện tại
        const module = await import(`@/content/${language}/${contentKey}.mdx`);
        setContent(module.default);
        setFallbackLanguage(null);
      } catch (primaryError) {
        console.error(`Failed to load MDX content for language ${language}: ${contentKey}`, primaryError);

        // Nếu không thành công, thử tải ngôn ngữ còn lại
        const fallbackLang = language === 'vi' ? 'en' : 'vi';
        try {
          console.log(`Trying fallback language: ${fallbackLang}`);
          const fallbackModule = await import(`@/content/${fallbackLang}/${contentKey}.mdx`);
          setContent(fallbackModule.default);
          setFallbackLanguage(fallbackLang);
        } catch (fallbackError) {
          console.error(`Failed to load fallback MDX content: ${contentKey}`, fallbackError);
          setContent(
            <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
              <p>Không thể tải nội dung. Vui lòng thử lại sau.</p>
              <p className="text-sm text-muted-foreground mt-2">Error: Content not found for key "{contentKey}" in any language.</p>
            </div>
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [contentKey, language]);

  if (isLoading) {
    return <div className="animate-pulse p-4">Đang tải...</div>;
  }

  return (
    <>
      {fallbackLanguage && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
          <p>
            {fallbackLanguage === 'en'
              ? 'Nội dung tiếng Việt chưa sẵn sàng. Đang hiển thị phiên bản tiếng Anh.'
              : 'English content is not available. Showing Vietnamese version instead.'}
          </p>
        </div>
      )}
      <MDXContent>
        {content}
      </MDXContent>
    </>
  );
}

export function useMDXMeta(contentKey: string) {
  const { language } = useLanguage();
  const [meta, setMeta] = useState<MDXMetadata | null>(null);

  useEffect(() => {
    async function loadMeta() {
      try {
        // Thử tải metadata với ngôn ngữ hiện tại
        const module = await import(`@/content/${language}/${contentKey}.mdx`);
        setMeta(module.meta || {});
      } catch (primaryError) {
        console.error(`Failed to load MDX meta for language ${language}: ${contentKey}`, primaryError);

        // Nếu không thành công, thử tải ngôn ngữ còn lại
        const fallbackLang = language === 'vi' ? 'en' : 'vi';
        try {
          const fallbackModule = await import(`@/content/${fallbackLang}/${contentKey}.mdx`);
          setMeta(fallbackModule.meta || {});
        } catch (fallbackError) {
          console.error(`Failed to load fallback MDX meta: ${contentKey}`, fallbackError);
          setMeta({});
        }
      }
    }

    loadMeta();
  }, [contentKey, language]);

  return meta;
}

export default MDXProvider;
