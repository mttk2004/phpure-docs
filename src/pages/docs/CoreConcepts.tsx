import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CoreConcepts() {
  const meta = useMDXMeta('core-concepts');
  const { toc } = useToc('core-concepts');
  const { t } = useTranslation();
  const { language } = useLanguage();

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
        title={meta?.title || "Khái niệm cốt lõi"}
        description={meta?.description || "Tìm hiểu các khái niệm cốt lõi của PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, MVC, PHPure, architecture, core concepts"}
        slug={`docs/core-concepts`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "MVC", "Architecture"]
        }}
      />

      <DocLayout
        title={meta?.title || "Khái niệm cốt lõi"}
        prev={prev}
        next={next}
        editPath={`/content/${language}/core-concepts.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="core-concepts" />
      </DocLayout>
    </>
  );
}
