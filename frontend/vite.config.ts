import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      'react': resolve(projectRoot, 'node_modules/react'),
      'react-dom': resolve(projectRoot, 'node_modules/react-dom')
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@github/spark']
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap resolution errors from dependencies
        if (warning.code === 'SOURCEMAP_ERROR') return
        warn(warning)
      },
      output: {
        manualChunks(id) {
          // Split react-dom into its own chunk (must check before react)
          if (id.includes('node_modules/react-dom/')) {
            return 'react-dom'
          }
          // Split react core into its own chunk
          if (id.includes('node_modules/react/')) {
            return 'react'
          }
          // Split recharts and d3 into their own chunk
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'recharts'
          }
          // Split framer-motion into its own chunk
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          // Split all radix-ui packages into their own chunk
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui'
          }
          // Split react-hook-form and related packages
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform')) {
            return 'react-hook-form'
          }
          // Split other heavy libraries
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack'
          }
          if (id.includes('node_modules/zod')) {
            return 'zod'
          }
          // Split sonner (toast library)
          if (id.includes('node_modules/sonner')) {
            return 'sonner'
          }
          // Split cmdk (command palette)
          if (id.includes('node_modules/cmdk')) {
            return 'cmdk'
          }
          // Split react-day-picker and date-fns (calendar)
          if (id.includes('node_modules/react-day-picker') || id.includes('node_modules/date-fns')) {
            return 'date-picker'
          }
          // Split embla-carousel
          if (id.includes('node_modules/embla-carousel')) {
            return 'carousel'
          }
          // Split vaul (drawer)
          if (id.includes('node_modules/vaul')) {
            return 'vaul'
          }
          // Split marked (markdown parser)
          if (id.includes('node_modules/marked')) {
            return 'marked'
          }
          // Split clsx and tailwind-merge (class utilities)
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
            return 'class-utils'
          }
          // Split uuid
          if (id.includes('node_modules/uuid')) {
            return 'uuid'
          }
          // Split react-error-boundary
          if (id.includes('node_modules/react-error-boundary')) {
            return 'error-boundary'
          }
          // Split class-variance-authority
          if (id.includes('node_modules/class-variance-authority')) {
            return 'cva'
          }
          // Split input-otp
          if (id.includes('node_modules/input-otp')) {
            return 'input-otp'
          }
          // Split react-resizable-panels
          if (id.includes('node_modules/react-resizable-panels')) {
            return 'resizable-panels'
          }
          // Split next-themes
          if (id.includes('node_modules/next-themes')) {
            return 'next-themes'
          }
        }
      }
    }
  }
});
