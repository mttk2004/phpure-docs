import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';

export default function DirectoryStructure() {
  const meta = useMDXMeta('directory-structure');
  const { toc } = useToc('directory-structure');

  const prev = {
    title: "Khái niệm cốt lõi",
    href: "/docs/core-concepts"
  };

  const next = {
    title: "Tính năng",
    href: "/docs/features"
  };

  return (
    <DocLayout
      title={meta?.title || "Cấu trúc thư mục"}
      description={meta?.description || "Tìm hiểu cấu trúc thư mục của PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/directory-structure.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="directory-structure" />
    </DocLayout>
  );
}
