import DocLayout from '@/components/docs/DocLayout';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import GithubDocContent from '@/components/docs/GithubDocContent';
import { useState, useEffect } from 'react';
import { CURRENT_DOC_VERSION } from '@/utils/githubUtils';

export default function DirectoryStructure() {
  const { toc } = useToc('directory-structure', CURRENT_DOC_VERSION);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>("Directory Structure");

  useEffect(() => {
    // Set title based on language
    setTitle(language === 'vi' ? 'Cấu trúc thư mục' : 'Directory Structure');
  }, [language]);

  const prev = {
    title: t('navigation.core-concepts'),
    href: "/docs/core-concepts"
  };

  const next = {
    title: t('navigation.features'),
    href: "/docs/features"
  };

  return (
    <>
      <SEO
        title={title}
        description={language === 'vi' ?
          "Tìm hiểu cấu trúc thư mục của PHPure framework" :
          "Learn about the directory structure of PHPure framework"}
        keywords={"PHP, framework, PHPure, directory structure, folders"}
        slug={`docs/directory-structure`}
        type="article"
        article={{
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          section: "Docs",
          tags: ["PHPure", "Framework", "Directory Structure", "Organization"]
        }}
      />

      <DocLayout
        title={title}
        prev={prev}
        next={next}
        editPath={`docs/${CURRENT_DOC_VERSION}/${language}/directory-structure.md`}
        toc={toc}
      >
        <GithubDocContent filename="directory-structure.md" version={CURRENT_DOC_VERSION} />
      </DocLayout>
    </>
  );
}
