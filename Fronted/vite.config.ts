// ============================================================================
// 项目入口配置文件
// ============================================================================

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ember-glow/fireworks': path.resolve(__dirname, './packages/@ember-glow/fireworks/src'),
    },
  },
  optimizeDeps: {
    include: ['@ember-glow/fireworks']
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
})

