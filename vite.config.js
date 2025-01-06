import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const extensionPath = (path) => resolve(__dirname, 'extension', path);

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'extension'),
  build: {
    rollupOptions: {
      input: {
        popup: extensionPath('popup.html'),
        background: extensionPath('background.js'),
        content: extensionPath('content.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name][extname]',
        dir: 'dist/extension',
      },
    },
    outDir: '../dist/extension',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
