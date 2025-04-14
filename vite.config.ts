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
    // Plugin that injects a script to fix the react_production is undefined error
    {
      name: 'fix-react-production',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<script>
            // Ensure react_production exists to prevent the "react_production is undefined" error
            // Đặt script này với thuộc tính defer=false và async=false để đảm bảo nó chạy sớm
            (function() {
              // Khởi tạo React Production ngay lập tức
              window.react_production = window.react_production || {
                Fragment: Symbol('Fragment'),
                jsx: function() { return null; },
                jsxs: function() { return null; },
                createElement: function() { return null; }
              };

              // Tạo proxy để tự động tạo các thuộc tính không xác định
              window.react_production = new Proxy(window.react_production, {
                get: function(target, prop) {
                  // Nếu thuộc tính không tồn tại, tạo một hàm giả
                  if (target[prop] === undefined) {
                    if (typeof prop === 'string') {
                      console.warn('[React Init] Accessing undefined property: ' + prop);
                      return function() { return null; };
                    }
                  }
                  return target[prop];
                }
              });

              console.log("[Vite Plugin] Created enhanced react_production object");
            })();
          </script>
          </head>`
        );
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'], // Ensure only one copy of React is used
  },
  build: {
    // Use the most conservative minification option
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs during debugging
        drop_debugger: false,
        pure_getters: false,
        keep_classnames: true,
        keep_fnames: true, // Keep function names to avoid minification issues
        passes: 1, // Use minimal passes
        sequences: false, // Be conservative with optimizing sequences
      },
      mangle: {
        keep_classnames: true,
        keep_fnames: true, // Important to keep function names for React
        module: false, // Don't mangle module-specific code
        properties: false, // Don't mangle property names
      },
      format: {
        comments: 'some', // Keep some comments
        ecma: 2015, // Safer target
      },
    },
    rollupOptions: {
      // Explicitly list React as an external dependency to avoid duplication
      external: [],
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-dom/client',
            'scheduler'
          ],
          'ui-vendor': [
            '@tanstack/react-router',
            'framer-motion',
            'i18next',
            'react-i18next'
          ],
          'syntax': ['react-syntax-highlighter'],
        },
        inlineDynamicImports: false,
        // More predictable chunk naming for better imports
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    // Use source maps during development only
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'es2015', // Use a more conservative target for wider compatibility
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true, // Important for React
    }
  },
  define: {
    // Define global constants to help with React's process.env checks
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    // Ensure React's development checks are properly disabled in production
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  // Optimization options
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
    esbuildOptions: {
      define: {
        global: 'globalThis' // Fix issues with global in some packages
      },
      // Less aggressive optimizations
      treeShaking: false,
      minify: false,
    }
  },
})
