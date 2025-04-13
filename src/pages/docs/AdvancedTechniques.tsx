import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function AdvancedTechniques() {
  const { toc } = useToc('advanced-techniques', true, CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Advanced Techniques");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Kỹ thuật nâng cao' : 'Advanced Techniques');
  }, [language]);

  const prev = {
    title: t('navigation.building-applications'),
    href: "/docs/building-applications"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Các kỹ thuật nâng cao trong PHPure framework" :
          "Advanced techniques in PHPure framework"}
        keywords={"PHP, framework, PHPure, advanced techniques, optimization"}
        slug={`docs/advanced-techniques`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Advanced Techniques", "Optimization"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/advanced-techniques.md`}
        toc={toc}
      >
        <GithubDocContent filename="advanced-techniques.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
