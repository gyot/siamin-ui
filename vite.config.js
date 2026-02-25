import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // development proxy to bypass CORS during local testing
  // any request beginning with `/api` will be forwarded to the real
  // backend (specified by the VITE_API_BASE_URL env variable).
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'https://backend-siamin.bpmpntb.id',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})