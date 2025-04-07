import React, { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function CoreConcepts() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('core-concepts');

  useEffect(() => {
    setToc([
      {
        title: "Mô hình MVC",
        url: "#mo-hinh-mvc"
      },
      {
        title: "Routing",
        url: "#routing"
      },
      {
        title: "Controllers",
        url: "#controllers"
      },
      {
        title: "Models",
        url: "#models"
      },
      {
        title: "Views",
        url: "#views"
      },
      {
        title: "Middleware",
        url: "#middleware"
      }
    ]);
  }, []);

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
