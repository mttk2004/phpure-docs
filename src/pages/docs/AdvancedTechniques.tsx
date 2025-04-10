import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/common/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdvancedTechniques() {
  const meta = useMDXMeta('advanced-techniques');
  const { toc } = useToc('advanced-techniques');
  const { t } = useTranslation();
  const { language } = useLanguage();

  const prev = {
    title: t('navigation.building-applications'),
    href: "/docs/building-applications"
  };

  return (
    <>
      <SEO
        title={meta?.title || "Kỹ thuật nâng cao"}
        description={meta?.description || "Các kỹ thuật nâng cao trong PHPure framework"}
        keywords={meta?.keywords?.toString() || "PHP, framework, PHPure, advanced techniques, optimization"}
        slug={`docs/advanced-techniques`}
        type="article"
        article={{
          publishedTime: meta?.publishedAt as string,
          modifiedTime: meta?.updatedAt as string,
          section: "Docs",
          tags: ["PHPure", "Framework", "Advanced Techniques", "Optimization"]
        }}
      />

      <DocLayout
        title={meta?.title || "Kỹ thuật nâng cao"}
        prev={prev}
        editPath={`/content/${language}/advanced-techniques.mdx`}
        toc={toc}
      >
        <DynamicMDX contentKey="advanced-techniques" />
      </DocLayout>
    </>
  );
}
