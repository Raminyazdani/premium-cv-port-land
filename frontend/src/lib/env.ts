/**
 * Environment Variable Validation
 *
 * Type-safe validation for all VITE_* environment variables.
 * Uses Zod for schema validation with clear error messages.
 *
 * All observability variables are OPTIONAL - missing vars simply disable
 * the corresponding tools. Validation only fails for invalid values
 * (e.g., malformed URLs, out-of-range sample rates).
 *
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

import { z } from 'zod';

/**
 * Sample rate validator (0.0 to 1.0)
 * Returns undefined for empty/undefined strings, validates range for actual values
 */
const sampleRateSchema = z
  .string()
  .optional()
  .transform((val) => {
    // Handle undefined or 'undefined' string (Vite quirk in some environments)
    if (val === undefined || val === 'undefined') return undefined;
    // Handle empty strings
    if (val.trim() === '') return undefined;
    const num = parseFloat(val);
    if (isNaN(num)) {
      throw new Error(`Invalid sample rate: "${val}" is not a number`);
    }
    if (num < 0 || num > 1) {
      throw new Error(`Sample rate must be between 0 and 1, got: ${num}`);
    }
    return num;
  });

/**
 * Boolean flag from string ('true'/'false')
 */
const booleanFlagSchema = z
  .string()
  .optional()
  .transform((val) => val === 'true');

/**
 * Sentry DSN URL validator
 * Must be a valid URL if provided
 */
const sentryDsnSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      // Handle undefined or 'undefined' string (Vite quirk in some environments)
      if (val === undefined || val === 'undefined') return true;
      // Handle empty strings
      if (val.trim() === '') return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'VITE_SENTRY_DSN must be a valid URL' }
  );

/**
 * Environment variables schema
 */
const envSchema = z.object({
  // === Vite built-in vars ===
  DEV: z.boolean().optional().default(false),
  PROD: z.boolean().optional().default(true),
  MODE: z.string().optional().default('production'),

  // === Microsoft Clarity ===
  /** Clarity project ID for session replays and heatmaps */
  VITE_CLARITY_ID: z.string().optional(),
  /** Force enable Clarity in development mode */
  VITE_CLARITY_FORCE_ENABLE: booleanFlagSchema,

  // === Sentry Error Tracking ===
  /** Sentry DSN URL for error tracking */
  VITE_SENTRY_DSN: sentryDsnSchema,
  /** Force enable Sentry in development mode */
  VITE_SENTRY_FORCE_ENABLE: booleanFlagSchema,
  /** Sentry release version for tracking deployments */
  VITE_SENTRY_RELEASE: z.string().optional(),
  /** Performance traces sample rate (0.0 to 1.0) */
  VITE_SENTRY_TRACES_SAMPLE_RATE: sampleRateSchema,
  /** Session replay sample rate (0.0 to 1.0) */
  VITE_SENTRY_REPLAYS_SESSION_RATE: sampleRateSchema,
  /** Error replay sample rate (0.0 to 1.0) */
  VITE_SENTRY_REPLAYS_ERROR_RATE: sampleRateSchema,

  // === Google Analytics 4 ===
  /** GA4 Measurement ID (format: G-XXXXXXXXXX) */
  VITE_GA4_MEASUREMENT_ID: z.string().optional(),

  // === Debug & Development ===
  /** Enable debug logging for CV data loading */
  VITE_DEBUG_CV: booleanFlagSchema,
  /** Enable pseudo-localization for i18n testing */
  VITE_PSEUDO_LOC: booleanFlagSchema,

  // === Deployment ===
  /** Base path for deployments (e.g., '/repo-name/' for GitHub Pages) */
  VITE_BASE_PATH: z.string().optional(),
});

/**
 * Type for the validated environment
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws descriptive errors for invalid values
 */
function parseEnv(): Env {
  const rawEnv = {
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
    VITE_CLARITY_ID: import.meta.env.VITE_CLARITY_ID,
    VITE_CLARITY_FORCE_ENABLE: import.meta.env.VITE_CLARITY_FORCE_ENABLE,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_SENTRY_FORCE_ENABLE: import.meta.env.VITE_SENTRY_FORCE_ENABLE,
    VITE_SENTRY_RELEASE: import.meta.env.VITE_SENTRY_RELEASE,
    VITE_SENTRY_TRACES_SAMPLE_RATE: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
    VITE_SENTRY_REPLAYS_SESSION_RATE: import.meta.env.VITE_SENTRY_REPLAYS_SESSION_RATE,
    VITE_SENTRY_REPLAYS_ERROR_RATE: import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE,
    VITE_GA4_MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    VITE_DEBUG_CV: import.meta.env.VITE_DEBUG_CV,
    VITE_PSEUDO_LOC: import.meta.env.VITE_PSEUDO_LOC,
    VITE_BASE_PATH: import.meta.env.VITE_BASE_PATH,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Environment variable validation failed:\n${errors}`);
  }

  return result.data;
}

/**
 * Validated environment object
 *
 * Use this throughout the codebase instead of direct import.meta.env access
 * for type safety and validation.
 *
 * @example
 * import { env } from '@/lib/env';
 *
 * if (env.VITE_CLARITY_ID && (env.PROD || env.VITE_CLARITY_FORCE_ENABLE)) {
 *   initClarity(env.VITE_CLARITY_ID);
 * }
 */
export const env = parseEnv();

/**
 * Check if we're in development mode
 */
export function isDev(): boolean {
  return env.DEV === true;
}

/**
 * Check if we're in production mode
 */
export function isProd(): boolean {
  return env.PROD === true;
}

/**
 * Get the Sentry traces sample rate with default
 */
export function getSentryTracesSampleRate(): number {
  return env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1;
}

/**
 * Get the Sentry session replay sample rate with default
 */
export function getSentryReplaysSessionRate(): number {
  return env.VITE_SENTRY_REPLAYS_SESSION_RATE ?? 0;
}

/**
 * Get the Sentry error replay sample rate with default
 */
export function getSentryReplaysErrorRate(): number {
  return env.VITE_SENTRY_REPLAYS_ERROR_RATE ?? 0;
}

/**
 * Get the GA4 measurement ID (returns undefined if not set)
 * Only returns a value in production mode unless explicitly configured
 */
export function getGA4MeasurementId(): string | undefined {
  const id = env.VITE_GA4_MEASUREMENT_ID;
  // Treat 'undefined' string (Vite quirk) and empty strings as not set
  if (!id || id === 'undefined' || id.trim() === '') {
    return undefined;
  }
  return id;
}

export default env;
