import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BuildingApplications() {
  const meta = useMDXMeta('building-applications');
  const { toc } = useToc('building-applications');
  const { t } = useTranslation();
  const { language } = useLanguage();

  const prev = {
    title: t('navigation.features'),
    href: "/docs/features"
  };

  const next = {
    title: t('navigation.advenced-techniques'),
    href: "/docs/advanced-techniques"
  };

  return (
    <>
      <SEO
        title={meta?.title || "Xây dựng ứng dụng"}
        description={meta?.description || "Hướng dẫn xây dựng ứng dụng với PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, PHPure, application development, building"}
        slug={`docs/building-applications`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Application Development", "Web Development"]
        }}
      />

      <DocLayout
        title={meta?.title || "Xây dựng ứng dụng"}
        prev={prev}
        next={next}
        editPath={`/content/${language}/building-applications.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="building-applications" />
      </DocLayout>
    </>
  );
}
