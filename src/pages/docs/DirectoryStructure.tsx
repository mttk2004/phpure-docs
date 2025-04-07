import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function DirectoryStructure() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('directory-structure');

  useEffect(() => {
    setToc([
      {
        title: "Tổng quan",
        url: "#tong-quan"
      },
      {
        title: "Thư mục gốc",
        url: "#thu-muc-goc"
      },
      {
        title: "Thư mục app",
        url: "#thu-muc-app"
      },
      {
        title: "Thư mục config",
        url: "#thu-muc-config"
      },
      {
        title: "Thư mục public",
        url: "#thu-muc-public"
      },
      {
        title: "Thư mục routes",
        url: "#thu-muc-routes"
      },
      {
        title: "Thư mục storage",
        url: "#thu-muc-storage"
      }
    ]);
  }, []);

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
