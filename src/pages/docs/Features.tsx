import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';

export default function Features() {
  const meta = useMDXMeta('features');
  const { toc } = useToc('features');

  const prev = {
    title: "Cấu trúc thư mục",
    href: "/docs/directory-structure"
  };

  const next = {
    title: "Xây dựng ứng dụng",
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
