import { useState, useEffect, memo } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Component tối ưu hóa tải hình ảnh sử dụng lazy loading và IntersectionObserver
 *
 * @param src - Đường dẫn đến hình ảnh cần tải
 * @param alt - Mô tả hình ảnh
 * @param placeholderSrc - Đường dẫn đến hình ảnh placeholder (optional)
 * @param threshold - Ngưỡng hiển thị để bắt đầu tải (0-1, mặc định 0.1)
 * @param rootMargin - Margin xung quanh viewport (mặc định 100px)
 * @param ...props - Các props khác cho thẻ img
 */
const LazyImage = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlMmUyZTIiLz48L3N2Zz4=',
  threshold = 0.1,
  rootMargin = '100px',
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);

  useEffect(() => {
    // Kiểm tra xem IntersectionObserver có được hỗ trợ không
    if (!('IntersectionObserver' in window)) {
      // Fallback nếu không hỗ trợ
      setCurrentSrc(src);
      return;
    }

    const imgElement = document.createElement('img');
    let observer: IntersectionObserver;

    // Tạo một element ảo để theo dõi
    const containerElement = document.createElement('div');
    containerElement.style.position = 'absolute';
    containerElement.style.visibility = 'hidden';
    document.body.appendChild(containerElement);

    // Theo dõi khi element xuất hiện trong viewport
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Bắt đầu tải ảnh khi xuất hiện trong viewport
          imgElement.src = src;

          // Đánh dấu đã tải khi ảnh tải xong
          imgElement.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
            observer.disconnect();
            document.body.removeChild(containerElement);
          };

          // Xử lý lỗi tải ảnh
          imgElement.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            observer.disconnect();
            document.body.removeChild(containerElement);
          };
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerElement);

    return () => {
      // Dọn dẹp
      if (observer) {
        observer.disconnect();
      }
      if (document.body.contains(containerElement)) {
        document.body.removeChild(containerElement);
      }
    };
  }, [src, placeholderSrc, threshold, rootMargin]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.5,
        filter: isLoaded ? 'none' : 'blur(10px)'
      }}
      {...props}
    />
  );
};

// Sử dụng memo để tránh re-render không cần thiết
export default memo(LazyImage);

/**
 * Sử dụng:
 * <LazyImage
 *   src="/path/to/image.jpg"
 *   alt="Mô tả hình ảnh"
 *   width={600}
 *   height={400}
 *   priority={true} // Đặt true cho hình ảnh quan trọng (hero image)
 * />
 */
