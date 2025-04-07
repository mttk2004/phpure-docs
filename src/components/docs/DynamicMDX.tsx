import React, { useEffect, useState, ComponentType } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MDXContent } from './MDXContent';

interface DynamicMDXProps {
  contentKey: string;
}

export function DynamicMDX({ contentKey }: DynamicMDXProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackLanguage, setFallbackLanguage] = useState<string | null>(null);
  const [ContentComponent, setContentComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    async function loadMDXContent() {
      setIsLoading(true);
      setError(null);

      try {
        // Thử tải nội dung với ngôn ngữ hiện tại
        const module = await import(`@/content/${language}/${contentKey}.mdx`);
        setContentComponent(() => module.default);
        setFallbackLanguage(null);
      } catch (primaryError) {
        console.error(`Failed to load MDX content for language ${language}: ${contentKey}`, primaryError);

        // Nếu không thành công, thử tải ngôn ngữ còn lại
        const fallbackLang = language === 'vi' ? 'en' : 'vi';
        try {
          console.log(`Trying fallback language: ${fallbackLang}`);
          const fallbackModule = await import(`@/content/${fallbackLang}/${contentKey}.mdx`);
          setContentComponent(() => fallbackModule.default);
          setFallbackLanguage(fallbackLang);
        } catch (fallbackError) {
          console.error(`Failed to load fallback MDX content: ${contentKey}`, fallbackError);
          setError(`Không thể tải nội dung "${contentKey}" với bất kỳ ngôn ngữ nào.`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadMDXContent();
  }, [contentKey, language]);

  if (isLoading) {
    return <div className="animate-pulse p-4">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
        <p>Không thể tải nội dung. Vui lòng thử lại sau.</p>
        <p className="text-sm text-muted-foreground mt-2">Error: {error}</p>
      </div>
    );
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
        {ContentComponent ? <ContentComponent /> : null}
      </MDXContent>
    </>
  );
}

export default DynamicMDX;
