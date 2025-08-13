import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包到 vendor chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // 将 Zustand 相关库打包到 store chunk
          store: ['zustand'],
          // 将 API 相关库打包到 api chunk
          api: ['axios']
        }
      }
    },
    // 启用代码分割
    chunkSizeWarningLimit: 1000,
    // 优化分包大小
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}) 