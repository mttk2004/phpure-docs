import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import fs from 'fs'
import { compression as viteCompression } from 'vite-plugin-compression2'
import { splitVendorChunkPlugin } from 'vite'

// Nội dung robots.txt mặc định
const defaultRobotsTxt = `# PHPure Documentation Website - robots.txt
# Cho phép tất cả robot truy cập vào tất cả các trang

User-agent: *
Allow: /

# Đảm bảo Googlebot mobile có thể truy cập
User-agent: Googlebot-Mobile
Allow: /

# Đường dẫn đến sitemap
Sitemap: https://phpure-docs.example.com/sitemap.xml

# Disallow một số đường dẫn không hữu ích cho người dùng (nếu có)
# Disallow: /assets/
# Disallow: /.git/
# Disallow: /node_modules/
`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      providerImportSource: '@mdx-js/react',
    }),
    tsconfigPaths(),
    TanStackRouterVite(),
    viteCompression(),
    splitVendorChunkPlugin(),
    tailwindcss(),
    // Thêm plugin nén gzip và brotli
    viteCompression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240, // Chỉ nén file lớn hơn 10KB
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240,
    }),
    // Plugin phục vụ robots.txt trong môi trường phát triển
    {
      name: 'serve-robots-txt',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/robots.txt') {
            const publicRobotsPath = path.join(__dirname, 'public/robots.txt');

            if (fs.existsSync(publicRobotsPath)) {
              // Phục vụ file robots.txt từ thư mục public nếu có
              const content = fs.readFileSync(publicRobotsPath, 'utf-8');
              res.setHeader('Content-Type', 'text/plain');
              res.end(content);
            } else {
              // Phục vụ nội dung mặc định nếu không có file
              res.setHeader('Content-Type', 'text/plain');
              res.end(defaultRobotsTxt);
            }
            return;
          }
          next();
        });
      }
    },
    // Plugin tạo file SEO khi build
    {
      name: 'generate-seo-files',
      closeBundle: async () => {
        try {
          // Tạo sitemap.xml
          const { generateSitemap } = await import('./src/utils/generateSitemap');
          generateSitemap();

          // Kiểm tra xem có file robots.txt từ public/ không (nếu không, tạo mới)
          const distRobotsPath = path.join('dist', 'robots.txt');
          if (!fs.existsSync(distRobotsPath)) {
            console.log('Không tìm thấy robots.txt từ thư mục public, tạo mới...');
            fs.writeFileSync(distRobotsPath, defaultRobotsTxt);
            console.log('Robots.txt đã được tạo');
          } else {
            console.log('Sử dụng robots.txt từ thư mục public');
          }

        } catch (error) {
          console.error('Lỗi khi tạo file SEO:', error);
        }
      }
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Tối ưu hóa bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // Nhiều lần tối ưu
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // Sử dụng splitVendorChunkPlugin thay vì manualChunks tùy chỉnh
        // manualChunks bị comment để tránh xung đột
        /* manualChunks: (id) => {
          // Xác định chunks theo pattern để tối ưu hơn
          if (id.includes('node_modules')) {
            // Nhóm React và các thư viện phụ thuộc vào React vào cùng một chunk
            if (id.includes('react') || id.includes('@mdx-js/react') || id.includes('mdx'))
              return 'react-vendor';

            // Các thư viện UI vẫn giữ nguyên
            if (id.includes('framer-motion') || id.includes('clsx') || id.includes('tailwind-merge'))
              return 'ui-vendor';

            // Routing vẫn giữ nguyên
            if (id.includes('tanstack') || id.includes('router'))
              return 'router';

            // i18n vẫn giữ nguyên
            if (id.includes('i18next'))
              return 'i18n';

            // Các thư viện nhỏ khác gộp vào vendor
            return 'vendor';
          }
        }, */
      },
    },
    // Tăng giới hạn cảnh báo kích thước chunk lên 1000kB (1MB)
    chunkSizeWarningLimit: 1000,
    // Tối ưu hóa assets
    assetsInlineLimit: 4096, // 4KB
  },
  // Tối ưu hóa quá trình dev và preview
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router'],
    exclude: ['@mdx-js/react'], // Tránh tối ưu quá sớm modules có side effects
  },
  esbuild: {
    // Loại bỏ code không sử dụng
    pure: ['console.log', 'console.info', 'console.debug', 'console.trace'],
    // Tối ưu hóa code
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    legalComments: 'none', // Loại bỏ các comment về license
  },
})
