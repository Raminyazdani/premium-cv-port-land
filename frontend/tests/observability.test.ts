import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock import.meta.env
const mockEnv = {
  DEV: true,
  PROD: false,
  MODE: 'test',
  VITE_CLARITY_ID: undefined as string | undefined,
  VITE_CLARITY_FORCE_ENABLE: undefined as string | undefined,
  VITE_SENTRY_DSN: undefined as string | undefined,
  VITE_SENTRY_FORCE_ENABLE: undefined as string | undefined,
  VITE_SENTRY_RELEASE: undefined as string | undefined,
  VITE_SENTRY_TRACES_SAMPLE_RATE: undefined as string | undefined,
  VITE_SENTRY_REPLAYS_SESSION_RATE: undefined as string | undefined,
  VITE_SENTRY_REPLAYS_ERROR_RATE: undefined as string | undefined,
};

// Store original import.meta.env
const originalEnv = { ...import.meta.env };

describe('Observability Integration', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetModules();
    // Reset env vars
    Object.keys(mockEnv).forEach((key) => {
      // @ts-expect-error - accessing env dynamically
      import.meta.env[key] = mockEnv[key];
    });
  });

  afterEach(() => {
    // Restore original env
    Object.assign(import.meta.env, originalEnv);
  });

  describe('Clarity', () => {
    it('should be disabled when VITE_CLARITY_ID is not set', async () => {
      import.meta.env.VITE_CLARITY_ID = undefined;
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      expect(isClarityEnabled()).toBe(false);
    });

    it('should be disabled in development even with VITE_CLARITY_ID set', async () => {
      import.meta.env.VITE_CLARITY_ID = 'test-clarity-id';
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      expect(isClarityEnabled()).toBe(false);
    });

    it('should be enabled when force enable is set in dev mode', async () => {
      import.meta.env.VITE_CLARITY_ID = 'test-clarity-id';
      import.meta.env.VITE_CLARITY_FORCE_ENABLE = 'true';
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      expect(isClarityEnabled()).toBe(true);
    });

    it('should be enabled in production when VITE_CLARITY_ID is set', async () => {
      import.meta.env.VITE_CLARITY_ID = 'test-clarity-id';
      import.meta.env.DEV = false;
      import.meta.env.PROD = true;
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      expect(isClarityEnabled()).toBe(true);
    });
  });

  describe('Sentry', () => {
    it('should be disabled when VITE_SENTRY_DSN is not set', async () => {
      import.meta.env.VITE_SENTRY_DSN = undefined;
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      expect(isSentryEnabled()).toBe(false);
    });

    it('should be disabled in development even with VITE_SENTRY_DSN set', async () => {
      import.meta.env.VITE_SENTRY_DSN = 'https://xxx@sentry.io/123';
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      expect(isSentryEnabled()).toBe(false);
    });

    it('should be enabled when force enable is set in dev mode', async () => {
      import.meta.env.VITE_SENTRY_DSN = 'https://xxx@sentry.io/123';
      import.meta.env.VITE_SENTRY_FORCE_ENABLE = 'true';
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      expect(isSentryEnabled()).toBe(true);
    });

    it('should be enabled in production when VITE_SENTRY_DSN is set', async () => {
      import.meta.env.VITE_SENTRY_DSN = 'https://xxx@sentry.io/123';
      import.meta.env.DEV = false;
      import.meta.env.PROD = true;
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      expect(isSentryEnabled()).toBe(true);
    });
  });

  describe('Environment variable gating', () => {
    it('should not load any scripts when both tools are disabled', async () => {
      import.meta.env.VITE_CLARITY_ID = undefined;
      import.meta.env.VITE_SENTRY_DSN = undefined;
      
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      
      expect(isClarityEnabled()).toBe(false);
      expect(isSentryEnabled()).toBe(false);
    });

    it('should require explicit force enable for dev mode', async () => {
      import.meta.env.VITE_CLARITY_ID = 'test-id';
      import.meta.env.VITE_SENTRY_DSN = 'https://xxx@sentry.io/123';
      import.meta.env.DEV = true;
      import.meta.env.PROD = false;
      // Force enable flags not set
      
      const { isClarityEnabled } = await import('@/lib/observability/clarity');
      const { isSentryEnabled } = await import('@/lib/observability/sentry');
      
      expect(isClarityEnabled()).toBe(false);
      expect(isSentryEnabled()).toBe(false);
    });
  });
});
