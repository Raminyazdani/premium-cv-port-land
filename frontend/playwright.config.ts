import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual proof (screenshot) and accessibility tests
 * 
 * This configuration captures screenshots of the CV website in EN/DE/FA
 * and runs axe-core accessibility scans to provide quality assurance.
 * 
 * Tests:
 *   - Visual proof (e2e/visual-proof.spec.ts)
 *   - Accessibility (e2e/accessibility.spec.ts)
 */
export default defineConfig({
  testDir: './e2e',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Timeout for each test (30 seconds)
  timeout: 30 * 1000,
  
  // Timeout for expect assertions (10 seconds)
  expect: {
    timeout: 10 * 1000,
  },
  
  // Reporter to use
  reporter: process.env.CI ? [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ] : 'list',
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:4173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Deterministic settings for CI
    // Fixed viewport for consistent rendering
    viewport: { width: 1280, height: 720 },
    
    // Disable animations for deterministic tests
    reducedMotion: 'reduce',
    
    // Locale for consistent date/number formatting
    locale: 'en-US',
    
    // Timezone for consistent date handling
    timezoneId: 'UTC',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run dev server before starting tests
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
