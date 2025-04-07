import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function AdvancedTechniques() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('advanced-techniques');

  useEffect(() => {
    setToc([
      {
        title: "Dependency Injection",
        url: "#dependency-injection"
      },
      {
        title: "Service Providers",
        url: "#service-providers"
      },
      {
        title: "Middleware Tùy chỉnh",
        url: "#middleware-tuy-chinh"
      },
      {
        title: "Repository Pattern",
        url: "#repository-pattern"
      },
      {
        title: "Unit Testing",
        url: "#unit-testing"
      },
      {
        title: "REST API",
        url: "#rest-api"
      },
      {
        title: "Caching",
        url: "#caching"
      },
      {
        title: "Task Scheduling",
        url: "#task-scheduling"
      }
    ]);
  }, []);

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
