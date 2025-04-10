import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import fs from 'fs'
import { compression as viteCompression } from 'vite-plugin-compression2'

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
    TanStackRouterVite(),
    react(),
    mdx({
      providerImportSource: '@mdx-js/react',
    }),
    tsconfigPaths(),
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
    }
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
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách các thư viện lớn thành những chunk riêng biệt
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'clsx', 'tailwind-merge'],
          'router': ['@tanstack/react-router'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
    // Giới hạn kích thước chunk
    chunkSizeWarningLimit: 1000,
  },
  // Tối ưu hóa quá trình dev và preview
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  esbuild: {
    // Loại bỏ code không sử dụng
    pure: ['console.log', 'console.info', 'console.debug', 'console.trace'],
    // Tối ưu hóa code
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
})
