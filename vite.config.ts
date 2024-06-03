import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/oam/api': {
        target: 'https://221.213.100.157:33000', // 后台服务所在位置
        changeOrigin: true, // 修改源
        secure: false, // 忽略ssl认证
        rewrite: (path) => path.startsWith('/api/oam/api') ? path.replace('/api/oam/api', '/oam/api') : path,
      },
    },
  }
})
