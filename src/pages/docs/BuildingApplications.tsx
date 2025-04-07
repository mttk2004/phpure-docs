import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function BuildingApplications() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('building-applications');

  useEffect(() => {
    setToc([
      {
        title: "Tạo project",
        url: "#tao-project"
      },
      {
        title: "Cấu hình Database",
        url: "#cau-hinh-database"
      },
      {
        title: "Tạo Routes",
        url: "#tao-routes"
      },
      {
        title: "Tạo Models",
        url: "#tao-models"
      },
      {
        title: "Tạo Controllers",
        url: "#tao-controllers"
      },
      {
        title: "Tạo Views",
        url: "#tao-views"
      },
      {
        title: "Xử lý Forms",
        url: "#xu-ly-forms"
      },
      {
        title: "Authentication",
        url: "#authentication"
      }
    ]);
  }, []);

  const prev = {
    title: "Tính năng",
    href: "/docs/features"
  };

  const next = {
    title: "Kỹ thuật nâng cao",
    href: "/docs/advanced-techniques"
  };

  return (
    <DocLayout
      title={meta?.title || "Xây dựng ứng dụng"}
      description={meta?.description || "Hướng dẫn xây dựng ứng dụng với PHPure framework"}
      prev={prev}
      next={next}
      editPath="/content/vi/building-applications.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="building-applications" />
    </DocLayout>
  );
}
