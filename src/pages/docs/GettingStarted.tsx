import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';
import { useTranslation } from 'react-i18next';

export default function GettingStarted() {
  const meta = useMDXMeta('getting-started');
  const { toc } = useToc('getting-started');
  const { t } = useTranslation();

  const prev = {
    title: t('navigation.introduction'),
    href: "/docs/introduction"
  };

  const next = {
    title: t('navigation.core-concepts'),
    href: "/docs/core-concepts"
  }

  return (
    <DocLayout
      title={meta?.title || "Bắt đầu"}
      description={meta?.description || "Hướng dẫn cài đặt và cấu hình PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/getting-started.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="getting-started" />
    </DocLayout>
  );
}
