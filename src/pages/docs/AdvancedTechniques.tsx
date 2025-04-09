import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';

export default function AdvancedTechniques() {
  const meta = useMDXMeta('advanced-techniques');
  const { toc } = useToc('advanced-techniques');
  const { t } = useTranslation()

  const prev = {
    title: t('navigation.building-applications'),
    href: "/docs/building-applications"
  };

  return (
    <DocLayout
      title={meta?.title || "Kỹ thuật nâng cao"}
      description={meta?.description || "Các kỹ thuật nâng cao trong PHPure framework"}
      prev={prev}
      editPath="/content/vi/advanced-techniques.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="advanced-techniques" />
    </DocLayout>
  );
}
