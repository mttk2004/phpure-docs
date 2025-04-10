import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Features() {
  const meta = useMDXMeta('features');
  const { toc } = useToc('features');
  const { t } = useTranslation();
  const { language } = useLanguage();

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
        title={meta?.title || "Tính năng"}
        description={meta?.description || "Khám phá các tính năng của PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, PHPure, features, functionality"}
        slug={`docs/features`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Features", "Functionality"]
        }}
      />

      <DocLayout
        title={meta?.title || "Tính năng"}
        prev={prev}
        next={next}
        editPath={`/content/${language}/features.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="features" />
      </DocLayout>
    </>
  );
}
