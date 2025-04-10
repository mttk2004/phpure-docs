import { useTheme } from '@/hooks/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  animatedCode?: string;
  isTypingComplete?: boolean;
  skipAnimation?: boolean;
  showCopyButton?: boolean;
  maxWidth?: string; // Thêm để kiểm soát độ rộng tối đa,
  paddingTop?: string
}

export function CodeBlock({
  code,
  language = 'jsx',
  showLineNumbers = true,
  animatedCode,
  isTypingComplete,
  skipAnimation,
  showCopyButton = true,
  maxWidth,
  paddingTop = '2.5rem'
}: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeInitialized, setThemeInitialized] = useState(false);

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

  // Cập nhật trạng thái theme khi theme thay đổi
  useEffect(() => {
    // Chỉ cập nhật khi đã có giá trị theme từ hook
    if (theme) {
      setIsDarkTheme(theme === 'dark');
      setThemeInitialized(true);
    }
  }, [theme]);

  // Hiệu ứng tải trang - ẩn nội dung cho đến khi xác định được theme
  useEffect(() => {
    // Xác định theme từ localStorage hoặc system preference khi component mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setIsDarkTheme(initialTheme === 'dark');
    setThemeInitialized(true);
  }, []);

  // Hàm xử lý sao chép mã
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);

    // Hiển thị tooltip thành công
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Xác định style dựa trên theme
  let codeStyle = isDarkTheme ? vscDarkPlus : vs;

  // Chuẩn hóa style để đồng nhất giữa các theme
  codeStyle = {
    ...codeStyle,
    'code[class*="language-"]': {
      ...codeStyle['code[class*="language-"]'],
      lineHeight: '1.6',
      fontFamily: "'Roboto Mono Variable', monospace",
      // Không còn cho phép xuống dòng trên màn hình nhỏ
      whiteSpace: 'pre',
      fontSize: isMobile ? '0.8125rem' : '0.9375rem',
      tabSize: 4,
    },
    'pre[class*="language-"]': {
      ...codeStyle['pre[class*="language-"]'],
      lineHeight: '1.6',
      fontFamily: "'Roboto Mono Variable', monospace",
      // Không còn cho phép xuống dòng trên màn hình nhỏ
      whiteSpace: 'pre',
      overflow: 'auto',
      fontSize: isMobile ? '0.8125rem' : '0.9375rem',
      tabSize: 4,
    }
  };

  // Sử dụng màu nền phù hợp với theme của trang web
  const bgColor = isDarkTheme ? 'hsl(222, 47%, 11%)' : 'hsl(190, 50%, 98%)';

  // Xác định nội dung hiển thị (animated hoặc static)
  const displayContent = animatedCode !== undefined
    ? (isTypingComplete || skipAnimation ? code : animatedCode)
    : code;

  return (
    <div
      className={`relative font-mono ${styles.codeContainer}`}
      ref={containerRef}
      style={{
        maxWidth: maxWidth || '100%',
        overflowX: isMobile ? 'hidden' : 'auto',
        visibility: themeInitialized ? 'visible' : 'hidden'
      }}
    >
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopyCode}
          className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ''}`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>{t("others.copiedCode")}</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>{t("others.copyCode")}</span>
            </>
          )}
        </button>
      )}

      <div
        className={`w-full ${isMobile ? styles.mobileContainer : ''}`}
        style={{
          maxWidth: '100%',
          overflowX: 'auto' // Luôn cho phép scroll ngang
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            padding: '1rem',
            paddingTop: paddingTop,
            borderRadius: 0,
            fontSize: isMobile ? '0.8125rem' : '0.9375rem',
            fontFamily: "'Roboto Mono Variable', monospace",
            backgroundColor: bgColor,
            transition: 'all 0.2s ease-in-out',
            lineHeight: '1.6',
            maxWidth: '100%',
            overflow: 'auto', // Luôn cho phép scroll
            whiteSpace: 'pre', // Không cho phép xuống dòng
            tabSize: 4,
            MozTabSize: 4,
            OTabSize: 4,
            // Thêm các thuộc tính để ngăn code wrap
            wordBreak: 'keep-all',
            wordSpacing: 'normal',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            // Tùy chỉnh CSS cho cả mobile
            textSizeAdjust: '100%', // Thêm để ngăn iOS thay đổi font size
            WebkitTextSizeAdjust: '100%', // Cho Safari
            MozTextSizeAdjust: '100%', // Cho Firefox
          }}
          wrapLines={true}
          wrapLongLines={false} // Không ngắt dòng
          lineProps={() => ({
            style: {
              display: 'block',
              lineHeight: '1.6',
              whiteSpace: 'pre', // Không cho phép xuống dòng
              tabSize: 4,
              MozTabSize: 4,
              OTabSize: 4,
              // Thêm các thuộc tính để ngăn code wrap
              wordBreak: 'keep-all',
              wordSpacing: 'normal'
            },
            className: styles.syntaxLine
          })}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: isDarkTheme ? '#858585' : '#A0A0A0',
            textAlign: 'right',
            userSelect: 'none',
            fontFamily: "'Roboto Mono Variable', monospace",
            fontSize: isMobile ? '0.8125rem' : '0.9375rem',
            fontStyle: 'normal', // Loại bỏ kiểu italic cho số dòng
            opacity: 0.6, // Làm mờ số dòng
            lineHeight: '1.6'
          }}
          codeTagProps={{
            style: {
              fontSize: isMobile ? '0.8125rem' : '0.9375rem',
              fontFamily: "'Roboto Mono Variable', monospace",
              lineHeight: '1.6',
              whiteSpace: 'pre', // Không còn cho phép xuống dòng
              tabSize: 4,
              MozTabSize: 4,
              OTabSize: 4,
              textSizeAdjust: '100%', // Thêm để ngăn iOS thay đổi font size
              WebkitTextSizeAdjust: '100%', // Cho Safari
              MozTextSizeAdjust: '100%', // Cho Firefox
            }
          }}
        >
          {displayContent}
        </SyntaxHighlighter>
      </div>

      {animatedCode !== undefined && !isTypingComplete && !skipAnimation && (
        <div
          className="absolute bottom-0 right-0 h-4 w-2 bg-primary animate-pulse"
          style={{ margin: '0 0 1rem 0' }}
        />
      )}
    </div>
  );
}
