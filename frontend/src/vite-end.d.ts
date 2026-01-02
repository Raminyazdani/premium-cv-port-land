/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

/**
 * Environment variables for the application
 * 
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
interface ImportMetaEnv {
  /** Microsoft Clarity project ID for session replays and heatmaps */
  readonly VITE_CLARITY_ID?: string;
  /** Force enable Clarity in development (set to 'true' to enable) */
  readonly VITE_CLARITY_FORCE_ENABLE?: string;
  
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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}