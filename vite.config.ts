import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      components: '/src/components',
      pages: '/src/pages',
      utils: '/src/utils',
      styles: '/src/styles',
      context: '/src/context',
      icons: '/src/icons',
      src: '/src',
    },
  },
});
