import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function CoreConcepts() {
  const { toc } = useToc('core-concepts', true, CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Core Concepts");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Khái niệm cốt lõi' : 'Core Concepts');
  }, [language]);

  const prev = {
    title: t('navigation.getting-started'),
    href: "/docs/getting-started"
  };

  const next = {
    title: t('navigation.directory-structure'),
    href: "/docs/directory-structure"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Tìm hiểu các khái niệm cốt lõi của PHPure framework" :
          "Learn about the core concepts of the PHPure framework"}
        keywords={"PHP, framework, MVC, PHPure, architecture, core concepts"}
        slug={`docs/core-concepts`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "MVC", "Architecture"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/core-concepts.md`}
        toc={toc}
      >
        <GithubDocContent filename="core-concepts.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
