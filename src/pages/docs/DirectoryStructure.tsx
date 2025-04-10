import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DirectoryStructure() {
  const meta = useMDXMeta('directory-structure');
  const { toc } = useToc('directory-structure');
  const { t } = useTranslation();
  const { language } = useLanguage();

  const prev = {
    title: t('navigation.getting-started'),
    href: "/docs/core-concepts"
  };

  const next = {
    title: t('navigation.features'),
    href: "/docs/features"
  };

  return (
    <>
      <SEO
        title={meta?.title || "Cấu trúc thư mục"}
        description={meta?.description || "Tìm hiểu cấu trúc thư mục của PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, PHPure, directory structure, folders"}
        slug={`docs/directory-structure`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Directory Structure", "Organization"]
        }}
      />

      <DocLayout
        title={meta?.title || "Cấu trúc thư mục"}
        prev={prev}
        next={next}
        editPath={`/content/${language}/directory-structure.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="directory-structure" />
      </DocLayout>
    </>
  );
}
