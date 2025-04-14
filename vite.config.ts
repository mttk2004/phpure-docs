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
            // React initialization diagnostics
            console.debug('[ReactInit] Starting React initialization - head script');

            // Create placeholder React global with full structure to prevent "Cannot set property" errors
            window.React = window.React || {
              Children: {},
              createContext: function() { return { Provider: null, Consumer: null }; },
              createElement: function() { return null; },
              cloneElement: function() { return null; },
              Component: function(){},
              memo: function(component) { return component; },
              Fragment: Symbol('Fragment'),
              Suspense: Symbol('Suspense'),
              lazy: function(importer) { return {
                $$typeof: Symbol('react.lazy'),
                _payload: { _status: -1, _result: importer },
                _init: function() {}
              }; },
              forwardRef: function(render) { return { render: render }; },
              useRef: function() { return { current: null }; },
              useState: function(initial) { return [initial, function(){}]; },
              useEffect: function() {},
              useContext: function() {},
              version: 'pre-initialized'
            };

            // Create ReactDOM placeholder
            window.ReactDOM = window.ReactDOM || {
              createRoot: function() {
                return {
                  render: function() {},
                  unmount: function() {}
                };
              },
              render: function() {},
              version: 'pre-initialized'
            };

            // Create a proxy to trap any attempts to access React properties
            window._originalReact = window.React;
            window.React = new Proxy(window.React, {
              get(target, prop) {
                if (prop in target) {
                  return target[prop];
                }
                console.warn('[ReactInit] Accessing undefined React property:', prop);
                if (typeof prop === 'string' && ['createElement', 'cloneElement', 'createContext'].includes(prop)) {
                  return function() { return null; };
                }
                // Return empty object for undefined properties to prevent errors
                return {};
              },
              set(target, prop, value) {
                console.debug('[ReactInit] Setting React property:', prop);
                target[prop] = value;
                return true;
              }
            });

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
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
        passes: 2, // Reduce optimization passes to avoid minification issues
        ecma: 2020,
        pure_getters: true,
        unsafe: false, // Disable unsafe optimizations which might cause issues
        unsafe_arrows: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
      },
      mangle: {
        safari10: true,
        properties: false, // Don't mangle property names
        toplevel: false, // Disable toplevel mangling to preserve important globals
        module: false, // Disable module mangling for better compatibility
        keep_fnames: true, // Keep all function names to avoid minification issues
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put all React-related code in a single chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') ||
                id.includes('prop-types') || id.includes('object-assign') ||
                id.includes('react-dom')) {
              return 'react'; // Simplify name to avoid hashes
            }

            // Other chunks
            if (id.includes('@tanstack/react-router') || id.includes('@tanstack/router')) {
              return 'router';
            }

            if (id.includes('@mdx-js') || id.includes('mdx')) {
              return 'mdx';
            }

            if (id.includes('lucide') || id.includes('icons')) {
              return 'icons';
            }

            if (id.includes('i18n') || id.includes('intl')) {
              return 'i18n';
            }

            if (id.includes('highlight') || id.includes('prism') || id.includes('syntax')) {
              return 'syntax';
            }

            if (id.includes('ui') || id.includes('button') || id.includes('component')) {
              return 'ui';
            }

            return 'vendor';
          }

          // App code
          if (id.includes('/src/pages/') || id.includes('/src/routes/')) {
            return 'routes';
          }

          if (id.includes('/src/components/layout/')) {
            return 'layout';
          }

          return null;
        },
        // Simplify file naming to improve caching and avoid routing issues
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
      preserveEntrySignatures: 'exports-only',
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
