import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GettingStarted() {
  const meta = useMDXMeta('getting-started');
  const { toc } = useToc('getting-started');
  const { t } = useTranslation();
  const { language } = useLanguage();

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
        title={meta?.title || "Bắt đầu"}
        description={meta?.description || "Hướng dẫn cài đặt và cấu hình PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, MVC, PHPure, cài đặt, cấu hình"}
        slug={`docs/getting-started`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Installation", "Configuration"]
        }}
      />

      <DocLayout
        title={meta?.title || "Bắt đầu"}
        prev={prev}
        next={next}
        editPath={`/content/${language}/getting-started.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="getting-started" />
      </DocLayout>
    </>
  );
}
