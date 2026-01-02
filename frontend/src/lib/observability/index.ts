/**
 * Observability module
 * 
 * This module provides runtime UX feedback through:
 * - Microsoft Clarity: Session replays and heatmaps
 * - Sentry: Error tracking and performance monitoring
 * 
 * Both integrations are gated by environment variables and are
 * disabled by default in development mode.
 * 
 * @module observability
 */

export { initClarity, isClarityEnabled, setClarityTag, identifyClarityUser } from './clarity';
export {
  initSentry,
  isSentryEnabled,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  SentryErrorBoundary,
  withProfiler,
} from './sentry';

/**
 * Initialize all observability tools
 * 
 * Call this once during app startup, before rendering.
 * Each tool will only initialize if its corresponding env var is set.
 */
export function initObservability(): void {
  // Import dynamically to avoid loading if not needed
  import('./clarity').then(({ initClarity }) => initClarity());
  import('./sentry').then(({ initSentry }) => initSentry());
}
