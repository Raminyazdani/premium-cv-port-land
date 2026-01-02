/**
 * Microsoft Clarity integration
 * 
 * Injects the Clarity tracking script when VITE_CLARITY_ID is set.
 * Enabled only in production by default, unless VITE_CLARITY_FORCE_ENABLE is set.
 * 
 * Privacy: Masking is enabled by default to protect sensitive content.
 * 
 * @see https://clarity.microsoft.com/
 */

/**
 * Check if Clarity should be enabled
 */
export function isClarityEnabled(): boolean {
  const clarityId = import.meta.env.VITE_CLARITY_ID;
  const forceEnable = import.meta.env.VITE_CLARITY_FORCE_ENABLE === 'true';
  const isProd = import.meta.env.PROD;
  
  // Require Clarity ID to be set
  if (!clarityId) {
    return false;
  }
  
  // Enable in production, or if force enabled for testing
  return isProd || forceEnable;
}

/**
 * Safely call the clarity function
 */
function callClarity(...args: unknown[]): void {
  // Access clarity via indexer to avoid TypeScript issues with dynamic window properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clarityFn = (window as any).clarity;
  if (typeof clarityFn === 'function') {
    clarityFn(...args);
  }
}

/**
 * Check if Clarity is available
 */
function hasClarityFunction(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (window as any).clarity === 'function';
}

/**
 * Initialize Microsoft Clarity
 * 
 * This function injects the Clarity tracking script into the page.
 * It should be called once during app initialization.
 */
export function initClarity(): void {
  if (!isClarityEnabled()) {
    if (import.meta.env.DEV) {
      console.debug('[Observability] Clarity disabled (missing VITE_CLARITY_ID or not in production)');
    }
    return;
  }

  const clarityId = import.meta.env.VITE_CLARITY_ID;
  
  if (!clarityId) {
    return;
  }

  // Check if already initialized
  if (hasClarityFunction()) {
    return;
  }

  try {
    // Clarity initialization script
    // Based on: https://clarity.microsoft.com/
    // The clarity function queues commands until the script loads
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function(c: Window, l: Document, a: string, r: string, i: string) {
      (c as any)[a] = (c as any)[a] || function() {
        // eslint-disable-next-line prefer-rest-params
        ((c as any)[a].q = (c as any)[a].q || []).push(arguments);
      };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      y?.parentNode?.insertBefore(t, y);
    })(window, document, 'clarity', 'script', clarityId);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Enable masking for privacy by default
    // This masks all text input and sensitive content
    // Commands are queued until the script loads
    callClarity('set', 'mask', 'balanced');

    if (import.meta.env.DEV) {
      console.debug('[Observability] Clarity initialized with ID:', clarityId);
    }
  } catch (error) {
    console.error('[Observability] Failed to initialize Clarity:', error);
  }
}

/**
 * Set a custom tag in Clarity for segmentation
 */
export function setClarityTag(key: string, value: string): void {
  callClarity('set', key, value);
}

/**
 * Identify a user session (for cross-device tracking)
 * Note: Only use with explicit user consent for privacy compliance
 */
export function identifyClarityUser(userId: string, sessionId?: string, pageId?: string): void {
  callClarity('identify', userId, sessionId, pageId);
}
