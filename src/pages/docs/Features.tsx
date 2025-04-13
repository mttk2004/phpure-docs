import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function Features() {
  // Pass true for isGitHubContent and the current version for the version parameter
  const { toc } = useToc('features', true, CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Useful Features");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Tính năng hữu ích' : 'Useful Features');
  }, [language]);

  const prev = {
    title: t('navigation.directory-structure'),
    href: "/docs/directory-structure"
  };

  const next = {
    title: t('navigation.building-applications'),
    href: "/docs/building-applications"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Khám phá các tính năng của PHPure framework" :
          "Explore the useful features provided by PHPure framework"}
        keywords={"PHP, framework, PHPure, features, functionality"}
        slug={`docs/features`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Features", "Functionality"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/features.md`}
        toc={toc}
      >
        <GithubDocContent filename="features.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
