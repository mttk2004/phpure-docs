import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';

export default function GettingStarted() {
  const meta = useMDXMeta('getting-started');
  const { toc } = useToc('getting-started');

  const prev = {
    title: "Giới thiệu",
    href: "/docs/introduction"
  };

  return (
    <DocLayout
      title={meta?.title || "Bắt đầu"}
      description={meta?.description || "Hướng dẫn cài đặt và cấu hình PHPure framework"}
      prev={prev}
      editPath="/content/vi/getting-started.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="getting-started" />
    </DocLayout>
  );
}
