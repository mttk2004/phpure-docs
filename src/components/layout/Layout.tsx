import React, { useState, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import { GITHUB_REPO_URL } from '@/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Đóng sidebar khi chuyển route trên màn hình nhỏ
  useEffect(() => {
    // Kiểm tra kích thước màn hình khi component mount
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Đóng sidebar khi click bên ngoài trên màn hình nhỏ
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isSidebarOpen &&
        window.innerWidth < 1024 &&
        !(event.target as HTMLElement).closest('aside') &&
        !(event.target as HTMLElement).closest('button[aria-label="Open menu"]')
      ) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isSidebarOpen={isSidebarOpen} onMenuClick={toggleSidebar} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 lg:pl-80 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>

          <footer className="border-t border-border py-6 mt-24">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} PHPure. Tất cả quyền được bảo lưu.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                  <a href="/privacy" className="hover:text-foreground transition-colors">
                    Chính sách bảo mật
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
