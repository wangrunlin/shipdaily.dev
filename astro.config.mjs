// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://shipdaily.dev',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 将第三方库分离到 vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // 将页面脚本分离
            if (id.includes('/pages/') && id.includes('.astro')) {
              return 'pages';
            }
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    ssr: {
      noExternal: []
    }
  }
});