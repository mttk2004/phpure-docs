import React, { useState, useEffect } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  title: {
    vi: string;
    en: string;
  };
  href?: string;
  children?: NavItem[];
  isNew?: boolean; // Đánh dấu mục mới
}

interface SidebarProps {
  isOpen: boolean;
}

const navItems: NavItem[] = [
  {
    title: {
      vi: 'Giới thiệu',
      en: 'Introduction'
    },
    href: '/docs/introduction',
  },
  {
    title: {
      vi: 'Bắt đầu',
      en: 'Getting Started'
    },
    href: '/docs/getting-started',
  },
  {
    title: {
      vi: 'Cơ bản',
      en: 'Fundamentals'
    },
    children: [
      {
        title: {
          vi: 'Khái niệm cốt lõi',
          en: 'Core Concepts'
        },
        href: '/docs/core-concepts',
      },
      {
        title: {
          vi: 'Cấu trúc thư mục',
          en: 'Directory Structure'
        },
        href: '/docs/directory-structure'
      },
      {
        title: {
          vi: 'Tính năng',
          en: 'Features'
        },
        href: '/docs/features'
      },
    ],
  },
  {
    title: {
      vi: 'Hướng dẫn nâng cao',
      en: 'Advanced Guide'
    },
    isNew: true,
    children: [
      {
        title: {
          vi: 'Xây dựng ứng dụng',
          en: 'Building Applications'
        },
        href: '/docs/building-applications',
        isNew: true,
      },
      {
        title: {
          vi: 'Kỹ thuật nâng cao',
          en: 'Advanced Techniques'
        },
        href: '/docs/advanced-techniques',
        isNew: true,
      },
    ],
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const { language } = useLanguage();
  const matches = useMatches();
  const currentPath = matches.length > 0 ? matches[matches.length - 1].pathname : '';

  // Lưu trạng thái mở/đóng của các mục có menu con - sử dụng ID ổn định hơn thay vì tiêu đề
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'fundamentals': true,
    'advanced': true
  });

  // Kiểm tra xem đường dẫn hiện tại có thuộc menu con không
  const isChildActive = (items?: NavItem[]) => {
    if (!items) return false;
    return items.some(item => item.href === currentPath);
  };

  // Mở ban đầu các mục có mục con active, chỉ chạy một lần khi mount
  useEffect(() => {
    const updatedSections: Record<string, boolean> = { ...openSections };

    // Mở các mục có con active
    navItems.forEach((section, i) => {
      const sectionId = getSectionId(i, section);
      if (isChildActive(section.children)) {
        updatedSections[sectionId] = true;
      }
    });

    setOpenSections(updatedSections);
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm lấy ID ổn định cho mỗi mục (không phụ thuộc vào ngôn ngữ)
  const getSectionId = (index: number, section: NavItem): string => {
    return section.href?.replace(/\//g, '-') || `section-${index}`;
  };

  const toggleSection = (sectionId: string, event: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan tỏa lên trên (nếu có)
    event.preventDefault();
    event.stopPropagation();

    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isSectionOpen = (index: number, section: NavItem): boolean => {
    const sectionId = getSectionId(index, section);
    // Nếu section có trong state, sử dụng giá trị đó
    if (sectionId in openSections) {
      return openSections[sectionId];
    }
    // Giá trị mặc định nếu chưa có trong state
    return false;
  };

  return (
    <aside
      className={cn(
        'fixed top-16 bottom-0 left-0 z-30 w-full max-w-72 overflow-y-auto border-r border-border bg-background/95 backdrop-blur-sm lg:translate-x-0 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <nav className="p-4 space-y-2">
        {navItems.map((section, i) => {
          // Kiểm tra nếu đây là menu có con và có mục con đang active
          const isActive = section.href === currentPath;
          const hasActiveChild = isChildActive(section.children);
          const sectionTitle = language === 'vi' ? section.title.vi : section.title.en;
          const sectionId = getSectionId(i, section);
          const isOpen = isSectionOpen(i, section);

          return (
            <div key={i} className="space-y-1">
              {section.href ? (
                <Link
                  to={section.href}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors w-full",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                  activeProps={{ className: "bg-primary/10 text-primary" }}
                >
                  <span className="flex items-center gap-2 w-full">
                    {sectionTitle}
                    {section.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary ml-auto translate-x-1">
                        {language === 'vi' ? 'Mới' : 'New'}
                      </span>
                    )}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={(e) => toggleSection(sectionId, e)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    hasActiveChild
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-2 w-full">
                    {sectionTitle}
                    {section.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary ml-auto -translate-x-1">
                        {language === 'vi' ? 'Mới' : 'New'}
                      </span>
                    )}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>
              )}

              {section.children && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-2 pl-3 border-l border-border space-y-1 py-1">
                        {section.children.map((item, j) => {
                          const itemTitle = language === 'vi' ? item.title.vi : item.title.en;
                          const isItemActive = item.href === currentPath;

                          return (
                            <Link
                              key={j}
                              to={item.href || ''}
                              className={cn(
                                "block py-1 px-2 text-sm rounded-md transition-all",
                                isItemActive
                                  ? "font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                              activeProps={{ className: "font-medium" }}
                            >
                              <div className="flex items-center justify-between">
                                <span className={isItemActive ? "underline underline-offset-4" : ""}>{itemTitle}</span>
                                {item.isNew && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary no-underline">
                                    {language === 'vi' ? 'Mới' : 'New'}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
