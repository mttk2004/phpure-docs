import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function Introduction() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('introduction');

  useEffect(() => {
    // Table of contents có thể được tạo động từ headings của nội dung MDX
    // hoặc định nghĩa trực tiếp nếu cần
    setToc([
      {
        title: "Giới thiệu PHPure",
        url: "#gioi-thieu-phpure"
      },
      {
        title: "Tính năng chính",
        url: "#tinh-nang-chinh"
      },
      {
        title: "Thông tin dự án",
        url: "#thong-tin-du-an"
      },
      {
        title: "Bắt đầu",
        url: "#bat-dau"
      }
    ]);
  }, []);

  const next = {
    title: "Bắt đầu",
    href: "/docs/getting-started"
  };

  return (
    <DocLayout
      title={meta?.title || "Giới thiệu"}
      description={meta?.description || "Tổng quan về PHPure framework và các tính năng chính"}
      next={next}
      editPath="/content/vi/introduction.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="introduction" />
    </DocLayout>
  );
}
