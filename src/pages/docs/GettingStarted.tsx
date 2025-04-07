import { useEffect, useState } from 'react';
import DocLayout from '@/components/docs/DocLayout';
import { useMDXMeta } from '@/components/docs/MDXProvider';
import DynamicMDX from '@/components/docs/DynamicMDX';

interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export default function GettingStarted() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const meta = useMDXMeta('getting-started');

  useEffect(() => {
    setToc([
      {
        title: "Yêu cầu hệ thống",
        url: "#yeu-cau-he-thong"
      },
      {
        title: "Cài đặt",
        url: "#cai-dat",
        items: [
          { title: "Cài đặt thông qua Composer", url: "#cai-dat-thong-qua-composer" },
          { title: "Cài đặt thủ công", url: "#cai-dat-thu-cong" }
        ]
      },
      {
        title: "Cấu trúc thư mục",
        url: "#cau-truc-thu-muc"
      },
      {
        title: "Cấu hình cơ bản",
        url: "#cau-hinh-co-ban"
      }
    ]);
  }, []);

  const prev = {
    title: "Giới thiệu",
    href: "/docs/introduction"
  };

  return (
    <DocLayout
      title={meta?.title || "Bắt đầu"}
      description={meta?.description || "Hướng dẫn cài đặt và cấu hình PHPure framework"}
      prev={prev}
      editPath="/content/vi/getting-started.mdx"
      toc={toc}
    >
      <DynamicMDX contentKey="getting-started" />
    </DocLayout>
  );
}
