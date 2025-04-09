import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';

export default function BuildingApplications() {
  const meta = useMDXMeta('building-applications');
  const { toc } = useToc('building-applications');
  const { t } = useTranslation()

  const prev = {
    title: t('navigation.features'),
    href: "/docs/features"
  };

  const next = {
    title: t('navigation.advenced-techniques'),
    href: "/docs/advanced-techniques"
  };

  return (
    <DocLayout
      title={meta?.title || "Xây dựng ứng dụng"}
      description={meta?.description || "Hướng dẫn xây dựng ứng dụng với PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/building-applications.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="building-applications" />
    </DocLayout>
  );
}
