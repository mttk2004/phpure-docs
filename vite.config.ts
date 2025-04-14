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
Sitemap: https://phpure.netlify.app/sitemap.xml

# Disallow một số đường dẫn không hữu ích cho người dùng (nếu có)
# Disallow: /assets/
# Disallow: /.git/
# Disallow: /node_modules/
`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Improve React performance with automatic babel optimizations
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      },
      // Ensure consistent React version
      jsxRuntime: 'automatic',
    }),
    mdx({
      providerImportSource: '@mdx-js/react',
    }),
    tsconfigPaths(),
    TanStackRouterVite(),
    tailwindcss(),
    // Cải thiện cấu hình nén - sử dụng cả gzip và brotli với mức nén cao hơn
    viteCompression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Giảm ngưỡng xuống 1KB để nén nhiều file hơn
      compressionOptions: {
        level: 9, // Mức nén cao nhất cho gzip
      },
      deleteOriginalAssets: false, // Giữ lại file gốc
      filename: '[path][base].gz',
    }),
    viteCompression({
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Giảm ngưỡng xuống 1KB
      algorithm: (buf) => import('zlib').then(zlib => zlib.brotliCompressSync(buf, {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 }
      })),
      filename: '[path][base].br',
      deleteOriginalAssets: false,
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
    // Inject React initialization script
    {
      name: 'inject-react-globals',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<script>
            // Very early React initialization - basic shell to prevent errors
            window.React = window.React || {};
            window.React.Children = window.React.Children || {};
            window.ReactDOM = window.ReactDOM || {};

            // Minimal initialization to prevent undefined errors
            if (!window.React.createElement) {
              window.React.createElement = function() { return null; };
              window.React.Fragment = Symbol('Fragment');
            }
          </script>
          </head>`
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable minification for easier debugging
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    // Use a more stable output configuration with fewer chunks
    rollupOptions: {
      output: {
        // Use simple chunk names without hashes for better predictability
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        // Bundle React and ReactDOM together
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-dom/client', 'scheduler', 'react/jsx-runtime'],
          'ui-vendor': [
            '@tanstack/react-router',
            'framer-motion',
            'i18next',
            'react-i18next'
          ],
          'syntax': ['react-syntax-highlighter'],
        },
      },
    },
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Other build options
    assetsInlineLimit: 4096,
    target: 'es2015',
  },
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  // Optimization options
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
})
