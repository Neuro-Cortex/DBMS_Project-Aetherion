// vite.config.ts
// COMPLETE ERROR-FREE VITE CONFIGURATION
// Project Aetherion - Healthcare Management System

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ===============================
// ESM FIX (__dirname support)
// ===============================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ===============================
// VITE CONFIG
// ===============================
export default defineConfig({
  // React plugin
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@react-google-maps/api': path.resolve(__dirname, './src/shims/googleMapsApi.tsx'),
      'qrcode.react': path.resolve(__dirname, './src/shims/QRCode.tsx'),
    }
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,
    cors: true,
    strictPort: false,
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      }
    }
  },

  // Preview server
  preview: {
    port: 4173,
    open: true,
  },

  // Production build
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          firebase: ['firebase'],
          charts: ['recharts'],
          calendar: ['react-big-calendar'],
        }
      }
    }
  },

  // CSS
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      }
    },
    devSourcemap: true,
  },

  // Environment variables
  envPrefix: 'VITE_',
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'firebase',
      'axios',
      'date-fns',
    ],
    exclude: [
      '@react-google-maps/api',
      'qrcode.react',
    ]
  },

  // Worker configuration
  worker: {
    format: 'es',
  },

  // ESBuild options
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    jsx: 'automatic',
    jsxImportSource: 'react',
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __DEV__: process.env.NODE_ENV === 'development',
  },
})