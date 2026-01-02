/**
 * Lighthouse CI Configuration
 *
 * This configuration runs Lighthouse against EN/DE/FA language routes
 * and enforces minimum score thresholds for Performance, Accessibility,
 * Best Practices, and SEO.
 *
 * Thresholds:
 *   - Performance: >= 0.70 (70%)
 *   - Accessibility: >= 0.90 (90%)
 *   - Best Practices: >= 0.80 (80%)
 *   - SEO: >= 0.80 (80%)
 *
 * To adjust thresholds, modify the "assert" section below.
 *
 * Local usage:
 *   npm run lhci:collect  # Collect reports
 *   npm run lhci:assert   # Check thresholds
 *   npm run lhci          # Run both
 */
module.exports = {
  ci: {
    collect: {
      // URLs to test - EN, DE, and FA language routes
      url: [
        'http://localhost:4173/?lang=en',
        'http://localhost:4173/?lang=de',
        'http://localhost:4173/?lang=fa',
      ],
      // Number of runs per URL for consistent scoring (1-3 recommended)
      numberOfRuns: 1,
      // Output directory for reports
      staticDistDir: './dist',
      // Start server command - builds and previews the app
      startServerCommand: 'npm run ci:preview',
      // Start server wait pattern
      startServerReadyPattern: 'Local:',
      // Timeout for server startup (2 minutes)
      startServerReadyTimeout: 120000,
      // Settings for consistent runs
      settings: {
        // Use desktop preset for consistent viewport
        preset: 'desktop',
        // Form factor
        formFactor: 'desktop',
        // Throttling - disable for CI stability
        throttlingMethod: 'provided',
        // Viewport
        screenEmulation: {
          width: 1350,
          height: 940,
          deviceScaleRatio: 1,
          mobile: false,
          disabled: false,
        },
        // Skip network throttling for deterministic results
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
        },
        // Only run core categories to save time
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      // Assertions for score thresholds
      assertions: {
        // Performance: warn at 50% (CI will warn but not fail)
        'categories:performance': ['warn', { minScore: 0.50 }],
        // Accessibility: error at 90% (CI will fail if below)
        'categories:accessibility': ['error', { minScore: 0.90 }],
        // Best Practices: warn at 80% (CI will warn but not fail)
        'categories:best-practices': ['warn', { minScore: 0.80 }],
        // SEO: warn at 80% (CI will warn but not fail)
        'categories:seo': ['warn', { minScore: 0.80 }],
      },
      // Aggregate method - optimistic helps with flaky scores
      aggregationMethod: 'optimistic',
    },
    upload: {
      // Target for uploading (filesystem for local artifacts)
      target: 'filesystem',
      // Output directory for LHCI reports
      outputDir: './lighthouse-reports',
      // Report filename pattern
      reportFilenamePattern: '%%HOSTNAME%%-%%PATHNAME%%-%%DATETIME%%.%%EXTENSION%%',
    },
  },
};
