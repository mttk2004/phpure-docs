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
    // Inject React globals into HTML before other scripts
    {
      name: 'inject-react-globals',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<script>
            // Ensure React and ReactDOM are available globally before any other scripts load
            window.React = window.React || {};
            window.ReactDOM = window.ReactDOM || {};

            // Helper to preload assets
            window.__vite_preload_helper = function(url) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = url;
              link.as = url.endsWith('.css') ? 'style' : 'script';
              document.head.appendChild(link);
              return url;
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3, // Tăng số lượt tối ưu hóa
        ecma: 2020, // Sử dụng tính năng ECMAScript mới hơn để nén tốt hơn
        pure_getters: true, // Optimize getter functions
        unsafe: true, // Allow unsafe optimizations for better minification
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
        properties: false, // Tránh minify các property name để tránh lỗi
        toplevel: true, // Better dead code elimination
        module: true,
        keep_fnames: /^React|ReactDOM/, // Preserve React function names
      },
      format: {
        comments: false, // Loại bỏ tất cả comments
        ecma: 2020,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create a single vendor bundle for all React-related code
          if (id.includes('node_modules')) {
            if (id.includes('react') ||
                id.includes('scheduler') ||
                id.includes('prop-types') ||
                id.includes('object-assign') ||
                id.includes('react-dom')) {
              return 'vendor-react'; // Keep all React core in one chunk
            }

            // Group major frameworks together
            if (id.includes('@tanstack/react-router') || id.includes('@tanstack/router')) {
              return 'vendor-router';
            }

            // Group MDX dependencies
            if (id.includes('@mdx-js') || id.includes('mdx')) {
              return 'vendor-mdx';
            }

            // Icons are less critical and can be separate
            if (id.includes('lucide') || id.includes('icons')) {
              return 'vendor-icons';
            }

            // Group internationalization
            if (id.includes('i18n') || id.includes('intl')) {
              return 'vendor-i18n';
            }

            // Group syntax highlighting
            if (id.includes('highlight') || id.includes('prism') || id.includes('syntax')) {
              return 'vendor-syntax';
            }

            // All UI components should depend on React, not the other way around
            if (id.includes('ui') || id.includes('button') || id.includes('component')) {
              return 'app-ui';
            }

            // All other libraries
            return 'vendor-other';
          }

          // Application code chunking
          if (id.includes('/src/pages/') || id.includes('/src/routes/')) {
            return 'app-routes';
          }

          if (id.includes('/src/components/layout/')) {
            return 'app-layout';
          }

          return null; // Let other files follow default chunking
        },
        // Tối ưu tên file để cải thiện cache
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
      preserveEntrySignatures: 'exports-only', // Improve tree shaking
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline small assets to avoid additional requests
    target: 'esnext', // Nhắm tới các trình duyệt hiện đại hơn để tối ưu kích thước
    cssCodeSplit: true, // Tách CSS riêng cho mỗi chunk
    sourcemap: false, // Tắt sourcemap trong production
    reportCompressedSize: true, // Hiển thị kích thước sau khi nén
  },
  define: {
    // Ensure proper React references
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router'],
    exclude: ['@mdx-js/react'],
    esbuildOptions: {
      define: {
        global: 'globalThis' // Fix issues with global in some packages
      },
      // Additional esbuild optimizations
      treeShaking: true,
      minify: true,
      legalComments: 'none',
    }
  },
  esbuild: {
    pure: ['console.log', 'console.info', 'console.debug', 'console.trace'],
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    legalComments: 'none',
    treeShaking: true, // Đảm bảo loại bỏ code không sử dụng
    target: 'esnext', // Ensure we're using modern JavaScript features
    supported: {
      'dynamic-import': true, // Ensure dynamic imports work correctly
    },
  },
})
