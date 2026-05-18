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
      '@react-google-maps/api': path.resolve(__dirname, './src/shims/googleMapsApi.tsx'),
      'qrcode.react': path.resolve(__dirname, './src/shims/QRCode.tsx'),
    }
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Production build
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        }
      }
    }
  },

  // CSS
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  },

  // Environment variables
  envPrefix: 'REACT_APP_',
})
