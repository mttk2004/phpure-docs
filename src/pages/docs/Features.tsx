import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const meta = useMDXMeta('features');
  const { toc } = useToc('features');
  const { t } = useTranslation()

  const prev = {
    title: t('navigation.directory-structure'),
    href: "/docs/directory-structure"
  };

  const next = {
    title: t('navigation.building-applications'),
    href: "/docs/building-applications"
  };

  return (
    <DocLayout
      title={meta?.title || "Tính năng"}
      description={meta?.description || "Khám phá các tính năng của PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/features.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="features" />
    </DocLayout>
  );
}
