import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 배포를 위한 base URL
  base: '/MCA_v1.0/',
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
          'chart': ['chart.js', 'react-chartjs-2', 'chartjs-plugin-datalabels'],
          'ui': ['@headlessui/react', 'lucide-react', '@heroicons/react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
