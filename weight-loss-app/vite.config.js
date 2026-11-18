import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Always run Vite via `npm run dev|build|preview` (scripts/vite.mjs), which fixes a
// Windows path-casing issue that otherwise bundles React twice and crashes the app.
const root = process.cwd();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(root, 'src') },
  },
  build: {
    // Express serves ../build (see server/index.js)
    outDir: 'build',
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
