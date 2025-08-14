import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __dirname = dirname(fileURLToPath(import.meta.url))

// 读取package.json获取版本信息
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const appVersion = packageJson.version

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 添加版本检测
        additionalManifestEntries: [
          { url: '/version.json', revision: appVersion }
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24小时
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Clipboard',
        short_name: 'Clipboard',
        description: 'A modern clipboard management application with Gist sync',
        version: appVersion,
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
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