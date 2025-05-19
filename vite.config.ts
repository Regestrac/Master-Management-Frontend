import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: '/src/components',
      pages: '/src/pages',
      utils: '/src/utils',
      styles: '/src/styles',
      context: '/src/context',
      src: '/src',
    },
  },
});
