import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Github, Package, Zap, Code, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { GITHUB_REPO_URL } from '@/utils';

// Mã PHP mẫu
const phpCodeExample = `<?php

namespace App\\Controllers;

use Core\\Controller;

class HomeController extends Controller
{
    public function index(): void
    {
        $this->render('home', [
          'title' => 'Home - PHPure',
          'message' => 'Welcome to PHPure Framework!',
        ]);
    }
}`;

// Mã PHP mẫu ngắn hơn cho thiết bị di động
const phpCodeExampleMobile = `<?php
namespace App\\Controllers;
use Core\\Controller;

class HomeController extends Controller
{
    public function index(): void
    {
        $this->render('home', [
          'title' => 'Home',
          'message' => 'Welcome!',
        ]);
    }
}`;

export default function HomePage() {
  // State cho hiệu ứng typing
  const [displayCode, setDisplayCode] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Kiểm tra khi component mount
    checkMobile();

    // Thêm event listener để kiểm tra khi thay đổi kích thước màn hình
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Xác định mã code sẽ sử dụng dựa trên thiết bị
  const activeCodeExample = isMobile ? phpCodeExampleMobile : phpCodeExample;

  // Hiệu ứng typing với tốc độ tối ưu hơn
  useEffect(() => {
    if (skipAnimation) {
      setDisplayCode(activeCodeExample);
      setTypingComplete(true);
      return;
    }

    if (displayCode.length < activeCodeExample.length) {
      const timeout = setTimeout(() => {
        // Tăng tốc độ typing theo thời gian
        const charsToAdd = Math.min(
          Math.max(1, Math.floor(displayCode.length / 50) + 1),
          5
        );
        const newLength = Math.min(
          displayCode.length + charsToAdd,
          activeCodeExample.length
        );
        setDisplayCode(activeCodeExample.slice(0, newLength));
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      setTypingComplete(true);
    }
  }, [displayCode, skipAnimation, activeCodeExample]);

  // Hàm xử lý skip animation
  const handleSkipAnimation = () => {
    setSkipAnimation(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="w-full pt-8 md:pt-12 pb-20 border-b border-border">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-sm rounded-full bg-muted">
              <span className="text-muted-foreground">PHPure v1.0 ra mắt</span>
              <div className="w-1 h-1 mx-2 bg-primary rounded-full"></div>
              <a
                href={`${GITHUB_REPO_URL}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Xem chi tiết
              </a>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Framework PHP <span className="text-gradient-primary">nhẹ nhàng</span> và{" "}
              <span className="text-gradient-primary">mạnh mẽ</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              PHPure tập trung vào hiệu suất cao, dễ học và linh hoạt trong phát triển ứng dụng web hiện đại.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link to="/docs">
                <Button size="lg" className="gap-2">
                  <span>Bắt đầu ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
              </a>
            </div>
          </div>

          <div className="relative mx-auto overflow-hidden border rounded-lg shadow-lg border-border bg-glassmorphism backdrop-blur-sm max-w-4xl">
            <div className="relative bg-muted overflow-hidden">
              <div className="flex items-center justify-start p-2 space-x-1.5 bg-background/80 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-sm font-medium text-muted-foreground font-script">example.php</div>
              </div>

              <div className="relative font-mono w-full overflow-hidden">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  {!typingComplete && (
                    <button
                      type="button"
                      onClick={handleSkipAnimation}
                      className="p-1.5 rounded-md bg-background/80 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Skip animation"
                    >
                      Skip
                    </button>
                  )}
                </div>

                <div className="w-full">
                  <CodeBlock
                    code={activeCodeExample}
                    language="php"
                    showLineNumbers={true}
                    animatedCode={displayCode}
                    isTypingComplete={typingComplete}
                    skipAnimation={skipAnimation}
                    showCopyButton={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Thiết kế cho <span className="text-gradient-primary">hiệu suất</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              PHPure tập trung vào trải nghiệm phát triển tuyệt vời với các công cụ hiện đại mà không hy sinh hiệu suất.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg bg-background border-border">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Hiệu suất cao</h3>
              <p className="text-muted-foreground">
                Được tối ưu hóa cho tốc độ nhanh với mức tiêu thụ bộ nhớ thấp và thời gian phản hồi nhanh.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-background border-border">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Nhẹ nhàng</h3>
              <p className="text-muted-foreground">
                Không phụ thuộc nặng nề, chỉ bao gồm những gì bạn cần mà không có các thành phần thừa.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-background border-border">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Dễ học, dễ sử dụng</h3>
              <p className="text-muted-foreground">
                API trực quan và tài liệu rõ ràng giúp bạn bắt đầu nhanh chóng mà không cần kiến thức chuyên sâu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 md:py-24 bg-muted">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Sẵn sàng để bắt đầu với PHPure?
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Bắt đầu xây dựng ứng dụng PHP hiện đại của bạn ngay hôm nay.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/docs">
                <Button size="lg" className="gap-2">
                  <span>Hướng dẫn cài đặt</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <Star className="h-4 w-4" />
                  <span>Star trên GitHub</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
