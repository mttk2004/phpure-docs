import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Edit, ChevronRight } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/utils';
import { useTranslation } from 'react-i18next';

interface DocNavItem {
  title: string;
  href: string;
}

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  editPath?: string;
  prev?: DocNavItem;
  next?: DocNavItem;
  toc?: {
    title: string;
    url: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

export default function DocLayout({
  children,
  title,
  description,
  editPath,
  prev,
  next,
  toc,
}: DocLayoutProps) {
  const { t } = useTranslation();

  // Xử lý hash trong URL để cuộn đến vị trí tương ứng sau khi trang được tải
  useEffect(() => {
    const handleScrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Đợi một chút để nội dung render hoàn tất
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    };

    // Xử lý khi trang vừa tải xong
    handleScrollToHash();

    // Thêm event listener để xử lý khi URL thay đổi (khi người dùng nhấn back/forward)
    window.addEventListener('hashchange', handleScrollToHash);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleScrollToHash);
    };
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* SEO Meta Tags - Sử dụng tính năng mới của React 19 */}
      <title>PHPure Documentation - {title}</title>
      {description && <meta name="description" content={description} />}

      {/* Đường dẫn */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link to="/docs" className="hover:text-foreground transition-colors">
          {t('common.docs')}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px] gap-12">
        {/* Phần nội dung chính */}
        <div className="min-w-0">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {children}
          </div>

          {/* Điều hướng giữa các trang */}
          <div className="mt-16 border-t border-border pt-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              {prev ? (
                <Link
                  to={prev.href}
                  className="flex flex-col p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t('docs.previous')}</span>
                  </div>
                  <span className="font-medium">{prev.title}</span>
                </Link>
              ) : <div />}

              {next && (
                <Link
                  to={next.href}
                  className="flex flex-col p-4 border border-border rounded-lg hover:bg-muted transition-colors text-right"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
                    <span>{t('docs.next')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{next.title}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Link chỉnh sửa trên GitHub */}
          {editPath && (
            <div className="flex justify-start mt-8">
              <a
                href={`${GITHUB_REPO_URL}/edit/main${editPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>{t('docs.editOnGitHub')}</span>
              </a>
            </div>
          )}
        </div>

        {/* Mục lục */}
        {toc && toc.length > 0 && (
          <div className="hidden md:block relative">
            <div className="fixed w-[200px] top-24 max-h-[calc(100vh-6rem)] overflow-auto pr-2">
              <h3 className="text-xs font-semibold uppercase mb-4">{t('docs.onThisPage')}</h3>
              <ul className="space-y-4 text-sm">
                {toc.map((section, i) => (
                  <li key={i} className="space-y-2">
                    <a
                      href={section.url}
                      onClick={(e) => {
                        e.preventDefault();
                        const targetId = section.url.replace('#', '');
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                          // Thêm id vào URL
                          window.history.pushState({}, '', section.url);
                          // Cuộn mượt đến vị trí
                          targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="block text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.title}
                    </a>

                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-2 ml-4 pt-2">
                        {section.items.map((item, j) => (
                          <li key={j}>
                            <a
                              href={item.url}
                              onClick={(e) => {
                                e.preventDefault();
                                const targetId = item.url.replace('#', '');
                                const targetElement = document.getElementById(targetId);
                                if (targetElement) {
                                  // Thêm id vào URL
                                  window.history.pushState({}, '', item.url);
                                  // Cuộn mượt đến vị trí
                                  targetElement.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="block text-muted-foreground hover:text-foreground transition-colors text-xs"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
