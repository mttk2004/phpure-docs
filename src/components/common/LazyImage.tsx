import React from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      // Thuộc tính quan trọng cho SEO
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}

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

export default LazyImage;
