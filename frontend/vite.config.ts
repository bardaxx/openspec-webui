import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  root: path.resolve(__dirname, '.'),
  base: '/',
  build: {
    outDir: '../dist-frontend',
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 3002,
    proxy: {
      '/api': 'http://127.0.0.1:3001',
      '/ws': {
        target: 'ws://127.0.0.1:3001',
        ws: true,
      },
    },
  },
});
