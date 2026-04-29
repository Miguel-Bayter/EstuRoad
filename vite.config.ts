/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://eduroad-api.vercel.app',
        changeOrigin: true,
        followRedirects: true,
      },
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/__tests__/**/*.test.ts'],
  },
});
