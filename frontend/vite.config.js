import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      // 所有 /api 请求代理到后端 8080，规避跨域
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // 上传图片的访问路径，开发环境也转发到后端（生产由 Nginx 托管）
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
