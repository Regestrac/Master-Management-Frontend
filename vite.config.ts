import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
    // Add gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Add brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      components: '/src/components',
      pages: '/src/pages',
      utils: '/src/utils',
      styles: '/src/styles',
      context: '/src/context',
      icons: '/src/icons',
      stores: '/src/stores',
      src: '/src',
      services: '/src/services',
      helpers: '/src/helpers',
      hooks: '/src/hooks',
    },
  },
  build: {
    // Enable minification
    minify: 'terser',
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'react-circular-progressbar'],
          'date-vendor': ['dayjs', 'react-multi-date-picker'],
          'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-color', '@tiptap/extension-highlight', '@tiptap/extension-image', '@tiptap/extension-placeholder', '@tiptap/extension-text-style', '@tiptap/extension-typography'],
          'misc-vendor': ['react-select', 'react-toastify', 'react-tooltip', 'zustand'],

          // Feature chunks
          dashboard: ['src/components/Dashboard/Dashboard', 'src/components/Dashboard/QuickStats', 'src/components/Dashboard/RecentTasks', 'src/components/Dashboard/ActiveGoals'],
          tasks: ['src/components/Tasks/Tasks', 'src/components/Tasks/Details/TaskDetails', 'src/components/Tasks/CreateTaskForm'],
          goals: ['src/components/Goals/Goals'],
          analytics: ['src/components/Analytics/Analytics'],
          calendar: ['src/components/Calendar/Calendar'],
          workspace: ['src/components/Workspace/WorkspaceHome', 'src/components/Workspace/WorkspaceDetail'],
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(name)) {
            return `img/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
    // Target modern browsers
    target: 'es2020',
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: false,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'clsx',
      'zustand',
      'dayjs',
    ],
    exclude: ['@tiptap/react', '@tiptap/starter-kit'],
  },
});
