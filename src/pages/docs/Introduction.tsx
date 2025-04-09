import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';

export default function Introduction() {
  const meta = useMDXMeta('introduction');
  const { toc } = useToc('introduction');
  const { t } = useTranslation();

  const next = {
    title: t('navigation.getting-started'),
    href: "/docs/getting-started"
  };

  return (
    <DocLayout
      title={meta?.title || "Giới thiệu"}
      description={meta?.description || "Tổng quan về PHPure framework và các tính năng chính"}
      next={next}
      editPath="/content/vi/introduction.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="introduction" />
    </DocLayout>
  );
}
