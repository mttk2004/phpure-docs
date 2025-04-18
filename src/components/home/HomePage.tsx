import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Github, Package, Zap, Code, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { CodeBlock } from '@/components/ui/CodeBlock';
import { GITHUB_REPO_URL, GITHUB_STAR_URL } from '@/utils';
import SEO from '@/components/common/SEO';
import { useTheme } from '@/hooks/useTheme';

// Sử dụng lazy loading cho CodeBlock để tối ưu kích thước bundle
const CodeBlock = lazy(() => import('@/components/ui/CodeBlock').then(mod => ({ default: mod.CodeBlock })));

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

export default function HomePage() {
  const { theme } = useTheme();

  // Define theme-specific primary color class
  const primaryColorClass = theme === 'dark' ? 'text-primary-light' : 'text-primary';

  // State cho hiệu ứng typing
  const [displayCode, setDisplayCode] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Hiệu ứng typing với tốc độ tối ưu hơn
  useEffect(() => {
    if (skipAnimation) {
      setDisplayCode(phpCodeExample);
      setTypingComplete(true);
      return;
    }

    if (displayCode.length < phpCodeExample.length) {
      const timeout = setTimeout(() => {
        // Tăng tốc độ typing theo thời gian
        const charsToAdd = Math.min(
          Math.max(1, Math.floor(displayCode.length / 50) + 1),
          5
        );
        const newLength = Math.min(
          displayCode.length + charsToAdd,
          phpCodeExample.length
        );
        setDisplayCode(phpCodeExample.slice(0, newLength));
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      setTypingComplete(true);
    }
  }, [displayCode, skipAnimation]);

  // Hàm xử lý skip animation
  const handleSkipAnimation = () => {
    setSkipAnimation(true);
  };

  return (
    <>
      <SEO
        title="PHPure Framework - Nhẹ nhàng và Mạnh mẽ"
        description="PHPure là một PHP framework nhẹ nhàng và mạnh mẽ, tập trung vào hiệu suất cao, dễ học và linh hoạt trong phát triển ứng dụng web hiện đại."
        keywords="PHP, framework, MVC, PHPure, web development, lightweight"
        slug="phpure-framework-lightweight-and-powerful"
        type="website"
        ogImage="/images/phpure-og-image.jpg"
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero section */}
        <section className="w-full pt-8 md:pt-12 pb-20 border-b border-border">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-sm rounded-full bg-muted">
              <span className="badge badge--accent font-medium">PHPure v0.0.3 ra mắt</span>
              <div className="w-1 h-1 mx-2 bg-primary rounded-full"></div>
              <a
                href={`${GITHUB_REPO_URL}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${primaryColorClass} hover:${primaryColorClass}/80 transition-colors`}
              >
                Xem chi tiết
              </a>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Framework PHP <span className="box-gradient"><span>nhẹ nhàng</span></span> và{" "}
              <span className="box-gradient"><span>mạnh mẽ</span></span>
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
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs md:text-sm font-medium text-muted-foreground font-script">ExampleController.php</div>
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

                <div className="w-[90vw] min-[380px]:w-[92vw] min-[450px]:w-[93vw] min-[520px]:w-[94vw]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <CodeBlock
                      code={phpCodeExample}
                      language="php"
                      showLineNumbers={false}
                      animatedCode={displayCode}
                      isTypingComplete={typingComplete}
                      skipAnimation={skipAnimation}
                      showCopyButton={false}
                      paddingTop='1rem'
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="w-full py-20">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Thiết kế cho <span className="box-gradient"><span>hiệu suất</span></span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              PHPure tập trung vào trải nghiệm phát triển tuyệt vời với các công cụ hiện đại mà không hy sinh hiệu suất.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg bg-background border-border">
              <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 ${primaryColorClass}`}>
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Hiệu suất cao</h3>
              <p className="text-muted-foreground">
                Được tối ưu hóa cho tốc độ nhanh với mức tiêu thụ bộ nhớ thấp và thời gian phản hồi nhanh.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-background border-border">
              <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 ${primaryColorClass}`}>
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Nhẹ nhàng</h3>
              <p className="text-muted-foreground">
                Không phụ thuộc nặng nề, chỉ bao gồm những gì bạn cần mà không có các thành phần thừa.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-background border-border">
              <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 ${primaryColorClass}`}>
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Dễ học, dễ sử dụng</h3>
              <p className="text-muted-foreground">
                API trực quan và tài liệu rõ ràng giúp bạn bắt đầu nhanh chóng mà không cần kiến thức chuyên sâu.
              </p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="w-full py-16 md:py-24 bg-muted">
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
                href={GITHUB_STAR_URL}
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
        </section>
      </div>
    </>
  );
}
