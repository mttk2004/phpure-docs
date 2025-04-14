import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function Introduction() {
  const { toc } = useToc('introduction', CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Introduction");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Giới thiệu' : 'Introduction');
  }, [language]);

  const next = {
    title: t('navigation.getting-started'),
    href: "/docs/getting-started"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Tổng quan về PHPure framework và các tính năng chính" :
          "Overview of the PHPure framework and its main features"}
        keywords={"PHP, framework, MVC, PHPure"}
        slug={`docs/introduction`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Introduction"]
        }}
      />

      <DocLayout
        title={title}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/introduction.md`}
        toc={toc}
      >
        <GithubDocContent filename="introduction.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
