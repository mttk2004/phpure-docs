import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';

export default function CoreConcepts() {
  const meta = useMDXMeta('core-concepts');
  const { toc } = useToc('core-concepts');

  const prev = {
    title: "Bắt đầu",
    href: "/docs/getting-started"
  };

  const next = {
    title: "Cấu trúc thư mục",
    href: "/docs/directory-structure"
  };

  return (
    <DocLayout
      title={meta?.title || "Khái niệm cốt lõi"}
      description={meta?.description || "Tìm hiểu các khái niệm cốt lõi của PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/core-concepts.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="core-concepts" />
    </DocLayout>
  );
}
