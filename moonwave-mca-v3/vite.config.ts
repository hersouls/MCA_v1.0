import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // 커스텀 도메인(mca.moonwave.kr) 사용 시 base는 '/'
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // Chart (lazy loaded when needed)
          'chart': ['chart.js', 'react-chartjs-2', 'chartjs-plugin-datalabels'],
          // Animation
          'motion': ['framer-motion'],
          // UI libraries (separated)
          'headless': ['@headlessui/react'],
          'icons': ['lucide-react'],
          'aria': ['react-aria-components'],
          // Database
          'db': ['dexie'],
          // State management
          'state': ['zustand'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
