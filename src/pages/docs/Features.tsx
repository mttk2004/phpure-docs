import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function Features() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('features');

  useEffect(() => {
    setToc([
      {
        title: "Routing",
        url: "#routing"
      },
      {
        title: "Database và Query Builder",
        url: "#database-va-query-builder"
      },
      {
        title: "HTTP Request và Response",
        url: "#http-request-va-response"
      },
      {
        title: "Session và Cookie",
        url: "#session-va-cookie"
      },
      {
        title: "Validation",
        url: "#validation"
      },
      {
        title: "Auth và Security",
        url: "#auth-va-security"
      },
      {
        title: "Events và Listeners",
        url: "#events-va-listeners"
      }
    ]);
  }, []);

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
