/**
 * Công cụ tạo sitemap.xml cho PHPure Docs
 *
 * Sau khi build, file sitemap.xml sẽ được tạo ra trong thư mục dist
 * giúp các công cụ tìm kiếm dễ dàng khám phá và lập chỉ mục nội dung trang web
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://phpure.netlify.app';

interface Route {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  languages: string[];
}

// Danh sách các trang của tài liệu
const routes: Route[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly', languages: ['vi', 'en'] },
  { path: '/docs', priority: 0.9, changefreq: 'weekly', languages: ['vi', 'en'] },
  { path: '/docs/introduction', priority: 0.9, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/getting-started', priority: 0.8, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/core-concepts', priority: 0.8, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/directory-structure', priority: 0.7, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/features', priority: 0.7, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/building-applications', priority: 0.7, changefreq: 'monthly', languages: ['vi', 'en'] },
  { path: '/docs/advanced-techniques', priority: 0.6, changefreq: 'monthly', languages: ['vi', 'en'] },
];

// Tạo XML cho từng URL
const generateUrlXml = (route: Route) => {
  const { path, priority, changefreq, languages } = route;
  const url = `${BASE_URL}${path}`;
  const lastMod = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // URL cơ bản
  let urlXml = `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>\n`;

  // Thêm thông tin hreflang cho nhiều ngôn ngữ
  languages.forEach(lang => {
    const langUrl = lang === 'vi' ? url : `${url}?lang=${lang}`;
    urlXml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />\n`;
  });

  // Thêm hreflang x-default (mặc định)
  urlXml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${url}" />
  </url>\n`;

  return urlXml;
};

// Tạo sitemap XML
export function generateSitemap() {
  // Khởi tạo XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Thêm từng URL
  routes.forEach(route => {
    sitemap += generateUrlXml(route);
  });

  // Đóng thẻ urlset
  sitemap += '</urlset>';

  // Ghi file
  const outDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap đã được tạo tại: dist/sitemap.xml');
}

export default generateSitemap;
