import React, { useState, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import Header from './Header';
import Sidebar from './Sidebar';

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

        <main className="flex-1 lg:pl-72 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-2 py-4 sm:p-4  md:p-8">
            {children}
          </div>

          <footer className="border-t border-border py-8 mt-12 md:mt-16">
            <div className="container mx-auto px-2 sm:px-4 md:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} PHPure. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <p>
                    Made with ❤️ by <a href="https://github.com/mttk2004" target="_blank" rel="noopener noreferrer">Mai Tran Tuan Kiet</a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
