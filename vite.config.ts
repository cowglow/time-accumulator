import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

/** GitHub Pages has no server-side routing: a direct visit to e.g.
 *  /time-accumulator/pool/gym would 404. Pages serves 404.html for unknown
 *  paths, so ship the app there too and let it route from the URL. */
const spaFallback = (): Plugin => {
  let outDir = 'dist';
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
};

export default defineConfig({
  base: '/time-accumulator/',
  plugins: [react(), svgr(), spaFallback()],
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
