import { useTheme } from '@/hooks/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
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
}

export function CodeBlock({
  code,
  language = 'jsx',
  showLineNumbers = true,
  animatedCode,
  isTypingComplete,
  skipAnimation,
  showCopyButton = true,
}: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(theme === 'dark');
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

  // Cập nhật trạng thái theme khi theme thay đổi
  useEffect(() => {
    setIsDarkTheme(theme === 'dark');
  }, [theme]);

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
      fontFamily: "'Cascadia Code', monospace",
      wordWrap: isMobile ? 'break-word' : 'normal',
      whiteSpace: isMobile ? 'pre-wrap' : 'pre',
    },
    'pre[class*="language-"]': {
      ...codeStyle['pre[class*="language-"]'],
      lineHeight: '1.6',
      fontFamily: "'Cascadia Code', monospace",
      wordWrap: isMobile ? 'break-word' : 'normal',
      whiteSpace: isMobile ? 'pre-wrap' : 'pre',
    }
  };

  // Sử dụng màu nền phù hợp với theme của trang web
  const bgColor = isDarkTheme ? 'hsl(222, 47%, 11%)' : 'hsl(0, 0%, 100%)';

  // Xác định nội dung hiển thị (animated hoặc static)
  const displayContent = animatedCode !== undefined
    ? (isTypingComplete || skipAnimation ? code : animatedCode)
    : code;

  return (
    <div className={`relative font-mono ${styles.codeContainer}`}>
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopyCode}
          className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ''}`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>{t("others.copiedCode")}</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>{t("others.copyCode")}</span>
            </>
          )}
        </button>
      )}

      <div className="w-full">
        <SyntaxHighlighter
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            padding: '1rem',
            paddingTop: '1.5rem', // Thêm padding phía trên để có chỗ cho nút sao chép
            borderRadius: 0,
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontFamily: "'Cascadia Code', monospace",
            backgroundColor: bgColor,
            transition: 'all 0.2s ease-in-out',
            lineHeight: '1.6',
            maxWidth: '100%',
            wordWrap: isMobile ? 'break-word' : 'normal',
            whiteSpace: isMobile ? 'pre-wrap' : 'pre',
          }}
          wrapLines={true}
          wrapLongLines={isMobile}
          lineProps={() => ({
            style: {
              display: 'block',
              lineHeight: '1.6',
              wordBreak: isMobile ? 'break-all' : 'normal',
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
            fontFamily: "'Cascadia Code', monospace",
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontStyle: 'normal', // Loại bỏ kiểu italic cho số dòng
            opacity: 0.6, // Làm mờ số dòng
            lineHeight: '1.6'
          }}
          codeTagProps={{
            style: {
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontFamily: "'Cascadia Code', monospace",
              lineHeight: '1.6',
              wordBreak: isMobile ? 'break-all' : 'normal',
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
