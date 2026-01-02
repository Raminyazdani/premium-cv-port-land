/**
 * Sentry integration for error tracking and performance monitoring
 * 
 * Injects Sentry when VITE_SENTRY_DSN is set.
 * Enabled only in production by default, unless VITE_SENTRY_FORCE_ENABLE is set.
 * 
 * Privacy: PII masking is enabled by default.
 * 
 * @see https://docs.sentry.io/platforms/javascript/guides/react/
 */

import * as Sentry from '@sentry/react';

// Regex patterns for PII scrubbing
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

/**
 * Scrub PII from a string
 */
function scrubPii(text: string): string {
  return text
    .replace(EMAIL_REGEX, '[email]')
    .replace(PHONE_REGEX, '[phone]');
}

/**
 * Check if Sentry should be enabled
 */
export function isSentryEnabled(): boolean {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const forceEnable = import.meta.env.VITE_SENTRY_FORCE_ENABLE === 'true';
  const isProd = import.meta.env.PROD;
  
  // Require Sentry DSN to be set
  if (!sentryDsn) {
    return false;
  }
  
  // Enable in production, or if force enabled for testing
  return isProd || forceEnable;
}

/**
 * Initialize Sentry
 * 
 * This function initializes the Sentry SDK with privacy-safe defaults.
 * It should be called once during app initialization, before rendering.
 */
export function initSentry(): void {
  if (!isSentryEnabled()) {
    if (import.meta.env.DEV) {
      console.debug('[Observability] Sentry disabled (missing VITE_SENTRY_DSN or not in production)');
    }
    return;
  }

  // Get the DSN (guaranteed to exist after isSentryEnabled check)
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string;

  try {
    Sentry.init({
      dsn: sentryDsn,
      
      // Environment configuration
      environment: import.meta.env.MODE || 'production',
      
      // Release tracking (set via CI/CD if needed)
      release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
      
      // Performance monitoring - sample rate (adjust based on traffic)
      // Set to 0 to disable performance monitoring, 1.0 for 100%
      tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      
      // Session replay - disabled by default for privacy
      // Can be enabled via env var
      replaysSessionSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_RATE || '0'),
      replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE || '0'),
      
      // Privacy: Don't send PII by default
      sendDefaultPii: false,
      
      // Privacy: Scrub sensitive data from errors
      beforeSend(event) {
        // Scrub PII from event message
        if (event.message) {
          event.message = scrubPii(event.message);
        }
        
        // Scrub PII from exception values
        if (event.exception?.values) {
          for (const exception of event.exception.values) {
            if (exception.value) {
              exception.value = scrubPii(exception.value);
            }
          }
        }
        
        // Scrub PII from breadcrumb messages
        if (event.breadcrumbs) {
          for (const breadcrumb of event.breadcrumbs) {
            if (breadcrumb.message) {
              breadcrumb.message = scrubPii(breadcrumb.message);
            }
          }
        }
        
        return event;
      },
      
      // Don't report these errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Network errors
        'NetworkError',
        'Failed to fetch',
        'Load failed',
        // User-initiated cancellations
        'AbortError',
        'The operation was aborted',
      ],
      
      // Don't report from these URLs
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /^moz-extension:\/\//i,
      ],
    });

    if (import.meta.env.DEV) {
      console.debug('[Observability] Sentry initialized');
    }
  } catch (error) {
    console.error('[Observability] Failed to initialize Sentry:', error);
  }
}

/**
 * Capture an exception in Sentry
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (isSentryEnabled()) {
    Sentry.captureException(error, { extra: context });
  }
}

/**
 * Capture a message in Sentry
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (isSentryEnabled()) {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Set user context in Sentry (for user-aware error tracking)
 * Note: Only use with explicit user consent for privacy compliance
 */
export function setUser(user: { id?: string; username?: string; email?: string } | null): void {
  if (isSentryEnabled()) {
    Sentry.setUser(user);
  }
}

/**
 * Add a breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: {
  category?: string;
  message?: string;
  level?: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}): void {
  if (isSentryEnabled()) {
    Sentry.addBreadcrumb(breadcrumb);
  }
}

/**
 * Get the Sentry Error Boundary component for use in React
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * Export Sentry's withProfiler HOC for component profiling
 */
export const withProfiler = Sentry.withProfiler;
