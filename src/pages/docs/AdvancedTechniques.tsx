import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';
import { useToc } from '@/hooks';

export default function AdvancedTechniques() {
  const meta = useMDXMeta('advanced-techniques');
  const { toc } = useToc('advanced-techniques');

  const prev = {
    title: "Xây dựng ứng dụng",
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
