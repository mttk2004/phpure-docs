import { useTheme } from '@/hooks/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CodeBlock.module.css';

// Preload và cache theme styles để tránh hiện tượng chớp
const lightStyle = vs;
const darkStyle = vscDarkPlus;

// Tùy chỉnh style cho hai theme
const customizeStyle = (style, isDark, isMobile) => ({
  ...style,
  'code[class*="language-"]': {
    ...style['code[class*="language-"]'],
    lineHeight: '1.6',
    fontFamily: "'Roboto Mono Variable', monospace",
    whiteSpace: 'pre',
    fontSize: isMobile ? '0.8125rem' : '0.9375rem',
    tabSize: 4,
  },
  'pre[class*="language-"]': {
    ...style['pre[class*="language-"]'],
    lineHeight: '1.6',
    fontFamily: "'Roboto Mono Variable', monospace",
    whiteSpace: 'pre',
    overflow: 'auto',
    fontSize: isMobile ? '0.8125rem' : '0.9375rem',
    tabSize: 4,
    backgroundColor: isDark ? 'hsl(222, 47%, 11%)' : 'hsl(190, 50%, 98%)',
  }
});

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  animatedCode?: string;
  isTypingComplete?: boolean;
  skipAnimation?: boolean;
  showCopyButton?: boolean;
  maxWidth?: string;
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
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  // Xác định theme dựa trên giá trị từ localStorage hoặc system preference
  // Sử dụng useRef để lưu trữ giá trị ban đầu và tránh re-render
  const initialTheme = useRef<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme === 'dark' || (!savedTheme && systemPrefersDark) ? 'dark' : 'light';
    }
    return 'light'; // SSR fallback
  }).current;

  const [isDarkTheme, setIsDarkTheme] = useState(initialTheme === 'dark');
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Pre-optimize style caching để tránh tính toán lại khi chuyển đổi theme
  const darkStyleCache = useRef(customizeStyle(darkStyle, true, isMobile));
  const lightStyleCache = useRef(customizeStyle(lightStyle, false, isMobile));

  // Sử dụng useLayoutEffect để áp dụng theme trước khi browser paint
  // Điều này giúp ngăn chặn hiện tượng chớp
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkTheme(initialTheme === 'dark');
    }
  }, [initialTheme]);

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cập nhật theme khi có thay đổi
  useEffect(() => {
    if (theme && !isFirstRender.current) {
      // Chỉ cập nhật khi không phải lần render đầu tiên
      // Điều này giúp tránh hiệu ứng chớp khi tải trang
      setIsDarkTheme(theme === 'dark');
    }

    isFirstRender.current = false;
  }, [theme]);

  // Cập nhật style cache khi mobile state thay đổi
  useEffect(() => {
    darkStyleCache.current = customizeStyle(darkStyle, true, isMobile);
    lightStyleCache.current = customizeStyle(lightStyle, false, isMobile);
  }, [isMobile]);

  // Hàm xử lý sao chép mã
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Xác định style dựa trên theme hiện tại
  const codeStyle = isDarkTheme ? darkStyleCache.current : lightStyleCache.current;

  // Xác định màu nền phù hợp với theme
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
        overflowX: isMobile ? 'hidden' : 'auto'
      }}
      data-theme={isDarkTheme ? 'dark' : 'light'}
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
          overflowX: 'auto'
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
            transition: 'none', // Loại bỏ hoàn toàn transition để tránh chớp
            lineHeight: '1.6',
            maxWidth: '100%',
            overflow: 'auto',
            whiteSpace: 'pre',
            tabSize: 4,
            MozTabSize: 4,
            OTabSize: 4,
            wordBreak: 'keep-all',
            wordSpacing: 'normal',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            textSizeAdjust: '100%',
            WebkitTextSizeAdjust: '100%',
            MozTextSizeAdjust: '100%',
          }}
          wrapLines={true}
          wrapLongLines={false}
          lineProps={() => ({
            style: {
              display: 'block',
              lineHeight: '1.6',
              whiteSpace: 'pre',
              tabSize: 4,
              MozTabSize: 4,
              OTabSize: 4,
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
            fontStyle: 'normal',
            opacity: 0.6,
            lineHeight: '1.6'
          }}
          codeTagProps={{
            style: {
              fontSize: isMobile ? '0.8125rem' : '0.9375rem',
              fontFamily: "'Roboto Mono Variable', monospace",
              lineHeight: '1.6',
              whiteSpace: 'pre',
              tabSize: 4,
              MozTabSize: 4,
              OTabSize: 4,
              textSizeAdjust: '100%',
              WebkitTextSizeAdjust: '100%',
              MozTextSizeAdjust: '100%',
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

      {/* Preload cả hai theme style để tránh chớp khi chuyển đổi */}
      <div className="syntax-block-preload">
        <div data-style="light"></div>
        <div data-style="dark"></div>
      </div>
    </div>
  );
}
