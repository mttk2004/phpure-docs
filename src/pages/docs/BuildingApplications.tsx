import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function BuildingApplications() {
  const { toc } = useToc('building-applications', CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Building Applications");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Xây dựng ứng dụng' : 'Building Applications');
  }, [language]);

  const prev = {
    title: t('navigation.features'),
    href: "/docs/features"
  };

  const next = {
    title: t('navigation.advanced-techniques'),
    href: "/docs/advanced-techniques"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Hướng dẫn xây dựng ứng dụng với PHPure framework" :
          "Guide to building applications with PHPure framework"}
        keywords={"PHP, framework, PHPure, application development, building"}
        slug={`docs/building-applications`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Application Development", "Web Development"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/building-applications.md`}
        toc={toc}
      >
        <GithubDocContent filename="building-applications.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
