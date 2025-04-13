import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function GettingStarted() {
  const { toc } = useToc('getting-started', true, CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Getting Started");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Bắt đầu' : 'Getting Started');
  }, [language]);

  const prev = {
    title: t('navigation.introduction'),
    href: "/docs/introduction"
  };

  const next = {
    title: t('navigation.core-concepts'),
    href: "/docs/core-concepts"
  }

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Hướng dẫn cài đặt và cấu hình PHPure framework" :
          "Installation and configuration guide for PHPure framework"}
        keywords={"PHP, framework, MVC, PHPure, cài đặt, cấu hình, installation, configuration"}
        slug={`docs/getting-started`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Installation", "Configuration"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/getting-started.md`}
        toc={toc}
      >
        <GithubDocContent filename="getting-started.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
