import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

  return {
  plugins: [vue()],
  esbuild: {
    drop: mode === 'production' ? ['console'] : []
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // development proxy to bypass CORS during local testing
  // any request beginning with `/api` will be forwarded to the real
  // backend. the full path including `/api/v1/...` is preserved.
  server: {
    proxy: {
      '/api': {
        target: apiBase,
        changeOrigin: true,
        secure: false
        // no rewrite: keep the full path `/api/v1/...` as is
      }
    }
  }
  }
})
