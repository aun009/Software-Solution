import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Split into cacheable chunks — browser only re-downloads what changed
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor':     ['react', 'react-dom', 'react-router-dom'],
            'animations': ['gsap', 'motion'],
            'supabase':   ['@supabase/supabase-js'],
            'state':      ['zustand'],
          },
        },
      },
      // Warn if any single chunk exceeds 1MB
      chunkSizeWarningLimit: 1000,
    },
  };
});
