import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

/**
 * Get the base path for deployment
 * 
 * Priority:
 * 1. VITE_BASE_PATH env var (explicit override)
 * 2. Auto-detect from GITHUB_REPOSITORY for GitHub Pages CI builds
 * 3. Default to '/' for root deployments
 * 
 * @see .env.example for VITE_BASE_PATH documentation
 */
function getBasePath(): string {
  // Explicit base path takes priority
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH
  }
  
  // Auto-detect for GitHub Pages from GITHUB_REPOSITORY (format: "owner/repo")
  // Only in CI (GitHub Actions), not for local development
  const ghRepo = process.env.GITHUB_REPOSITORY
  const ghPages = process.env.GITHUB_PAGES === 'true'
  
  if (ghPages && ghRepo) {
    const repoName = ghRepo.split('/')[1]
    if (repoName) {
      return `/${repoName}/`
    }
  }
  
  // Default: root deployment (Vercel, Netlify, custom domains)
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  // Base path for deployment portability (GitHub Pages, subdirectory deployments)
  base: getBasePath(),
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE - Icon proxy for Phosphor icons
    createIconImportProxy() as PluginOption,
    // sparkPlugin is removed for production builds as it requires Spark workbench environment
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
      }
    }
  }
});
