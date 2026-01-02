import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Visual QA Tests
 *
 * These tests capture deterministic screenshots of the CV website in all three
 * languages (EN/DE/FA) for visual QA in CI.
 *
 * Screenshots are stored under artifacts/visual-qa/<lang>/ and uploaded as
 * workflow artifacts for reviewers to inspect.
 *
 * Determinism is ensured via:
 *   - Fixed viewport (1280x720)
 *   - Reduced motion preference
 *   - Network idle waiting
 *   - Stable element waiting
 */

// Output directory for visual QA screenshots
const outputDir = path.join(process.cwd(), 'artifacts', 'visual-qa');

// Languages to test
const languages = [
  { code: 'en', name: 'English', isRTL: false },
  { code: 'de', name: 'German', isRTL: false },
  { code: 'fa', name: 'Persian', isRTL: true },
];

// CV sections to capture (if they exist)
const sections = [
  { testId: 'basics-section', name: 'basics' },
  { testId: 'education-section', name: 'education' },
  { testId: 'skills-section', name: 'skills' },
  { testId: 'experience-section', name: 'experience' },
  { testId: 'projects-section', name: 'projects' },
  { testId: 'publications-section', name: 'publications' },
  { testId: 'references-section', name: 'references' },
];

/**
 * Ensure output directory exists for a language
 */
function ensureOutputDir(lang: string): string {
  const langDir = path.join(outputDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  return langDir;
}

/**
 * Wait for page to be stable (no animations, network idle)
 */
async function waitForStableLayout(page: import('@playwright/test').Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Wait a short time for any CSS transitions to complete
  await page.waitForTimeout(300);

  // Wait for any visible loading indicators to disappear
  const loadingIndicator = page.locator('[data-loading="true"], .loading, .spinner');
  if ((await loadingIndicator.count()) > 0) {
    await loadingIndicator.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      // Ignore if no loading indicator exists
    });
  }
}

test.describe('Visual QA - Full Page Screenshots', () => {
  for (const lang of languages) {
    test(`${lang.name} (${lang.code.toUpperCase()}) - Full page screenshot`, async ({ page }) => {
      const langDir = ensureOutputDir(lang.code);

      // Navigate to page with language
      await page.goto(`/?lang=${lang.code}`);

      // Wait for stable layout
      await waitForStableLayout(page);

      // Verify content loaded
      await expect(page.locator('body')).toContainText('Ramin');

      // RTL check for Persian
      if (lang.isRTL) {
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl');
        await expect(html).toHaveAttribute('lang', 'fa');
      }

      // Capture full page screenshot
      const screenshotPath = path.join(langDir, `${lang.code}-home.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`📸 Captured: ${screenshotPath}`);

      // Verify file was created
      expect(fs.existsSync(screenshotPath)).toBe(true);
    });
  }
});

test.describe('Visual QA - Section Screenshots', () => {
  for (const lang of languages) {
    test(`${lang.name} (${lang.code.toUpperCase()}) - Section screenshots`, async ({ page }) => {
      const langDir = ensureOutputDir(lang.code);
      const capturedSections: string[] = [];

      // Navigate to page with language
      await page.goto(`/?lang=${lang.code}`);

      // Wait for stable layout
      await waitForStableLayout(page);

      // Capture each section if it exists
      for (const section of sections) {
        const element = page.locator(`[data-testid="${section.testId}"]`).first();

        if ((await element.count()) > 0 && (await element.isVisible())) {
          // Scroll element into view for consistent capture
          await element.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100); // Brief wait after scroll

          const screenshotPath = path.join(langDir, `${lang.code}-${section.name}.png`);
          await element.screenshot({ path: screenshotPath });

          capturedSections.push(section.name);
          console.log(`📸 Captured: ${screenshotPath}`);
        }
      }

      // Log summary
      console.log(`\n✅ ${lang.name}: Captured ${capturedSections.length} sections`);
      if (capturedSections.length > 0) {
        console.log(`   Sections: ${capturedSections.join(', ')}`);
      }
    });
  }
});

test.describe('Visual QA - Content Validation', () => {
  test('All languages - No undefined or null strings in UI', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/?lang=${lang.code}`);
      await waitForStableLayout(page);

      const content = await page.textContent('body');

      // Check for undefined/null strings
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
      expect(content).not.toContain('[object Object]');

      console.log(`✅ ${lang.code.toUpperCase()}: No undefined/null strings found`);
    }
  });

  test('All languages - Body has substantial content', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/?lang=${lang.code}`);
      await waitForStableLayout(page);

      const bodyText = await page.locator('body').textContent();

      // Should have name
      expect(bodyText).toContain('Ramin');

      // Should have email (@ symbol)
      expect(bodyText).toMatch(/[@]/);

      // Should have substantial content (at least 100 chars)
      expect(bodyText?.trim().length).toBeGreaterThan(100);

      console.log(`✅ ${lang.code.toUpperCase()}: Content verified (${bodyText?.trim().length} chars)`);
    }
  });
});

test.describe('Visual QA - RTL Layout Verification', () => {
  test('Persian (FA) - RTL layout is correctly applied', async ({ page }) => {
    const langDir = ensureOutputDir('fa');

    await page.goto('/?lang=fa');
    await waitForStableLayout(page);

    // Verify dir and lang attributes
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'fa');

    // Check main content has proper dimensions
    const mainContent = page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.isVisible()) {
      const box = await mainContent.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
        console.log(`✅ Main content visible: ${box.width}x${box.height}px`);
      }
    }

    // Take RTL-specific screenshot
    await page.screenshot({
      path: path.join(langDir, 'fa-rtl-layout.png'),
      fullPage: true,
    });

    console.log('✅ RTL layout verification passed');
  });
});

test.describe('Visual QA - Viewport Consistency', () => {
  const viewports = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test(`English - ${viewport.name} viewport (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      const langDir = ensureOutputDir('en');

      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto('/?lang=en');
      await waitForStableLayout(page);

      // Take screenshot
      const screenshotPath = path.join(langDir, `en-${viewport.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`📸 Captured: ${screenshotPath}`);
    });
  }
});
