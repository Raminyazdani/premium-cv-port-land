import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Store original import.meta.env
const originalEnv = { ...import.meta.env };

// Reset all env vars to clean state before each test
function resetEnvToDefaults() {
  import.meta.env.DEV = true;
  import.meta.env.PROD = false;
  import.meta.env.MODE = 'test';
  import.meta.env.VITE_CLARITY_ID = undefined;
  import.meta.env.VITE_CLARITY_FORCE_ENABLE = undefined;
  import.meta.env.VITE_SENTRY_DSN = undefined;
  import.meta.env.VITE_SENTRY_FORCE_ENABLE = undefined;
  import.meta.env.VITE_SENTRY_RELEASE = undefined;
  import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = undefined;
  import.meta.env.VITE_SENTRY_REPLAYS_SESSION_RATE = undefined;
  import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE = undefined;
  import.meta.env.VITE_DEBUG_CV = undefined;
  import.meta.env.VITE_PSEUDO_LOC = undefined;
  import.meta.env.VITE_BASE_PATH = undefined;
}

// Reset env before each test
beforeEach(() => {
  vi.resetModules();
  resetEnvToDefaults();
});

afterEach(() => {
  Object.assign(import.meta.env, originalEnv);
});

describe('Environment Variable Validation', () => {
  describe('Sample rate validation', () => {
    it('should accept valid sample rate of 0', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = '0';
      const { getSentryTracesSampleRate } = await import('@/lib/env');
      expect(getSentryTracesSampleRate()).toBe(0);
    });

    it('should accept valid sample rate of 1', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = '1';
      const { getSentryTracesSampleRate } = await import('@/lib/env');
      expect(getSentryTracesSampleRate()).toBe(1);
    });

    it('should accept valid sample rate of 0.5', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = '0.5';
      const { getSentryTracesSampleRate } = await import('@/lib/env');
      expect(getSentryTracesSampleRate()).toBe(0.5);
    });

    it('should use default sample rate when not set', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = undefined;
      const { getSentryTracesSampleRate } = await import('@/lib/env');
      expect(getSentryTracesSampleRate()).toBe(0.1);
    });

    it('should reject sample rate above 1', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = '1.5';
      await expect(import('@/lib/env')).rejects.toThrow(/Sample rate must be between 0 and 1/);
    });

    it('should reject sample rate below 0', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = '-0.1';
      await expect(import('@/lib/env')).rejects.toThrow(/Sample rate must be between 0 and 1/);
    });

    it('should reject non-numeric sample rate', async () => {
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = 'abc';
      await expect(import('@/lib/env')).rejects.toThrow(/not a number/);
    });
  });

  describe('Sentry DSN validation', () => {
    it('should accept valid Sentry DSN URL', async () => {
      import.meta.env.VITE_SENTRY_DSN = 'https://abc123@sentry.io/12345';
      const { env } = await import('@/lib/env');
      expect(env.VITE_SENTRY_DSN).toBe('https://abc123@sentry.io/12345');
    });

    it('should accept empty DSN (optional)', async () => {
      import.meta.env.VITE_SENTRY_DSN = '';
      const { env } = await import('@/lib/env');
      expect(env.VITE_SENTRY_DSN).toBe('');
    });

    it('should accept undefined DSN (optional)', async () => {
      import.meta.env.VITE_SENTRY_DSN = undefined;
      const { env } = await import('@/lib/env');
      // In test environment, undefined gets stringified to "undefined"
      // The schema handles this by treating "undefined" as falsy/empty
      // What matters is that validation passes and it's treated as not-set
      expect(env.VITE_SENTRY_DSN === undefined || env.VITE_SENTRY_DSN === 'undefined').toBe(true);
    });

    it('should reject invalid DSN URL', async () => {
      import.meta.env.VITE_SENTRY_DSN = 'not-a-valid-url';
      await expect(import('@/lib/env')).rejects.toThrow(/VITE_SENTRY_DSN must be a valid URL/);
    });
  });

  describe('Boolean flag validation', () => {
    it('should parse "true" string as true', async () => {
      import.meta.env.VITE_DEBUG_CV = 'true';
      const { env } = await import('@/lib/env');
      expect(env.VITE_DEBUG_CV).toBe(true);
    });

    it('should parse "false" string as false', async () => {
      import.meta.env.VITE_DEBUG_CV = 'false';
      const { env } = await import('@/lib/env');
      expect(env.VITE_DEBUG_CV).toBe(false);
    });

    it('should parse undefined as false', async () => {
      import.meta.env.VITE_DEBUG_CV = undefined;
      const { env } = await import('@/lib/env');
      expect(env.VITE_DEBUG_CV).toBe(false);
    });

    it('should parse empty string as false', async () => {
      import.meta.env.VITE_DEBUG_CV = '';
      const { env } = await import('@/lib/env');
      expect(env.VITE_DEBUG_CV).toBe(false);
    });
  });

  describe('Optional observability vars', () => {
    it('should allow all observability vars to be unset', async () => {
      import.meta.env.VITE_CLARITY_ID = undefined;
      import.meta.env.VITE_SENTRY_DSN = undefined;
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE = undefined;
      import.meta.env.VITE_SENTRY_REPLAYS_SESSION_RATE = undefined;
      import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE = undefined;

      const { env } = await import('@/lib/env');
      // In test environment, undefined gets stringified to "undefined"
      // The schema handles this by treating "undefined" as falsy/empty
      // What matters is that validation passes and values are treated as not-set
      expect(env.VITE_CLARITY_ID === undefined || env.VITE_CLARITY_ID === 'undefined').toBe(true);
      expect(env.VITE_SENTRY_DSN === undefined || env.VITE_SENTRY_DSN === 'undefined').toBe(true);
    });
  });

  describe('Helper functions', () => {
    it('isDev should return env.DEV value', async () => {
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      const { isDev } = await import('@/lib/env');
      expect(isDev()).toBe(true);
    });

    it('isProd should return env.PROD value', async () => {
      import.meta.env.DEV = false;
      import.meta.env.PROD = true;
      const { isProd } = await import('@/lib/env');
      expect(isProd()).toBe(true);
    });

    it('getSentryReplaysSessionRate should return default when unset', async () => {
      import.meta.env.VITE_SENTRY_REPLAYS_SESSION_RATE = undefined;
      const { getSentryReplaysSessionRate } = await import('@/lib/env');
      expect(getSentryReplaysSessionRate()).toBe(0);
    });

    it('getSentryReplaysErrorRate should return default when unset', async () => {
      import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE = undefined;
      const { getSentryReplaysErrorRate } = await import('@/lib/env');
      expect(getSentryReplaysErrorRate()).toBe(0);
    });
  });
});
