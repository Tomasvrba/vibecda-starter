import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    // Keep both engines available while loading only the selected demo's engine.
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'], three: ['three'] } } },
    chunkSizeWarningLimit: 1500,
  },
});
