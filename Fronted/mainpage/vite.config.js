import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ember-glow/fireworks': resolve(__dirname, '../packages/@ember-glow/fireworks/src')
    }
  },
  optimizeDeps: {
    include: ['@ember-glow/fireworks'],
    exclude: ['cesium']  // 不优化 cesium，使用 CDN
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/geo': {
        target: 'https://geo.datav.aliyun.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo/, '')
      }
    }
  }
})
