import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Introduction() {
  const meta = useMDXMeta('introduction');
  const { toc } = useToc('introduction');
  const { t } = useTranslation();
  const { language } = useLanguage();

  const next = {
    title: t('navigation.getting-started'),
    href: "/docs/getting-started"
  };

  return (
    <>
      <SEO
        title={meta?.title || "Giới thiệu"}
        description={meta?.description || "Tổng quan về PHPure framework và các tính năng chính"}
        keywords={meta?.keywords?.toString() || "PHP, framework, MVC, PHPure"}
        slug={`docs/introduction`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Introduction"]
        }}
      />

      <DocLayout
        title={meta?.title || "Giới thiệu"}
        next={next}
        editPath={`/content/${language}/introduction.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="introduction" />
      </DocLayout>
    </>
  );
}
