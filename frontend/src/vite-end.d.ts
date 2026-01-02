/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

/**
 * Environment variables for the application
 * 
 * All VITE_* variables are build-time constants embedded during the build.
 * All variables are optional - the app works without any of them.
 * 
 * @see https://vitejs.dev/guide/env-and-mode.html
 * @see .env.example for documentation of each variable
 */
interface ImportMetaEnv {
  // === Vite built-in vars ===
  /** True in development mode */
  readonly DEV: boolean;
  /** True in production mode */
  readonly PROD: boolean;
  /** Current mode (development, production, test) */
  readonly MODE: string;

  // === Microsoft Clarity ===
  /** Microsoft Clarity project ID for session replays and heatmaps */
  readonly VITE_CLARITY_ID?: string;
  /** Force enable Clarity in development (set to 'true' to enable) */
  readonly VITE_CLARITY_FORCE_ENABLE?: string;
  
  // === Sentry Error Tracking ===
  /** Sentry DSN for error tracking */
  readonly VITE_SENTRY_DSN?: string;
  /** Force enable Sentry in development (set to 'true' to enable) */
  readonly VITE_SENTRY_FORCE_ENABLE?: string;
  /** Sentry release version */
  readonly VITE_SENTRY_RELEASE?: string;
  /** Sentry performance traces sample rate (0.0 to 1.0) */
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
  /** Sentry session replay sample rate (0.0 to 1.0) */
  readonly VITE_SENTRY_REPLAYS_SESSION_RATE?: string;
  /** Sentry error replay sample rate (0.0 to 1.0) */
  readonly VITE_SENTRY_REPLAYS_ERROR_RATE?: string;

  // === Debugging & Development ===
  /** Enable debug logging for CV data loading */
  readonly VITE_DEBUG_CV?: string;
  /** Enable pseudo-localization for i18n testing */
  readonly VITE_PSEUDO_LOC?: string;

  // === Deployment ===
  /** Base path for deployments (e.g., '/repo-name/' for GitHub Pages) */
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}