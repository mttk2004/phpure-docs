import { lazy } from 'react';
import SEO from './SEO';

// Sử dụng lazy loading cho LazyImage để tối ưu kích thước bundle
const LazyImage = lazy(() => import('./LazyImage').then(module => ({ default: module.default })));

export { LazyImage, SEO };

// Export mặc định cho các trường hợp import toàn bộ
export default {
  LazyImage,
  SEO
};
