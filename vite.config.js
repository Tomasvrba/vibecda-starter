import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    // Phaser is the game engine; splitting it keeps game edits small.
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
    chunkSizeWarningLimit: 1500,
  },
});
