import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Accessibility (a11y) Tests using axe-core
 *
 * These tests run automated accessibility scans against EN/DE/FA language routes
 * and verify RTL support for Persian (FA).
 *
 * Scans check for WCAG 2.1 Level A and AA compliance.
 * Serious and critical violations will fail the test.
 */

// Interface for structured a11y results
interface A11yResult {
  url: string;
  language: string;
  timestamp: string;
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      target: string[];
      html: string;
      failureSummary: string;
    }>;
  }>;
  passes: number;
  incomplete: number;
  inapplicable: number;
}

// Output directory for a11y results
const outputDir = path.join(process.cwd(), 'test-results');
const resultsPath = path.join(outputDir, 'a11y-results.json');

/**
 * Helper to save a11y results to JSON file
 * Appends new results to existing file or creates new one
 */
function saveA11yResult(result: A11yResult): void {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load existing results or start with empty array
  let allResults: A11yResult[] = [];
  if (fs.existsSync(resultsPath)) {
    try {
      allResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    } catch {
      allResults = [];
    }
  }

  // Remove any existing result for this language (from retries)
  allResults = allResults.filter((r) => r.language !== result.language);

  // Add new result
  allResults.push(result);

  // Sort by language for consistent output
  allResults.sort((a, b) => a.language.localeCompare(b.language));

  // Save to file
  fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));
  console.log(`📄 A11y result for ${result.language} saved to: ${resultsPath}`);
}

test.describe('Accessibility (a11y) Tests', () => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'fa', name: 'Persian (FA)' },
  ];

  for (const lang of languages) {
    test(`${lang.name} (${lang.code.toUpperCase()}) - No serious/critical a11y violations`, async ({
      page,
    }) => {
      const url = `/?lang=${lang.code}`;

      // Navigate to page
      await page.goto(url);

      // Wait for content to load and JavaScript to execute
      await page.waitForLoadState('networkidle');

      // Additional wait for any dynamic content
      await page.waitForTimeout(500);

      // Run axe-core accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Create structured result
      const result: A11yResult = {
        url: page.url(),
        language: lang.code,
        timestamp: new Date().toISOString(),
        violations: accessibilityScanResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact || 'unknown',
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map((n) => ({
            target: n.target as string[],
            html: n.html,
            failureSummary: n.failureSummary || '',
          })),
        })),
        passes: accessibilityScanResults.passes.length,
        incomplete: accessibilityScanResults.incomplete.length,
        inapplicable: accessibilityScanResults.inapplicable.length,
      };

      // Save result immediately (so it's captured even if test fails)
      saveA11yResult(result);

      // Log summary
      console.log(`\n📊 A11y Results for ${lang.name}:`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Passes: ${result.passes}`);
      console.log(`   Violations: ${result.violations.length}`);
      console.log(`   Incomplete: ${result.incomplete}`);

      // Filter for serious/critical violations
      const seriousOrCritical = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );

      // Log violations if any
      if (accessibilityScanResults.violations.length > 0) {
        console.log('\n   Violations by impact:');
        const impactCounts: Record<string, number> = {};
        for (const v of accessibilityScanResults.violations) {
          const impact = v.impact || 'unknown';
          impactCounts[impact] = (impactCounts[impact] || 0) + 1;
        }
        for (const [impact, count] of Object.entries(impactCounts)) {
          console.log(`     - ${impact}: ${count}`);
        }
      }

      // Fail on serious/critical violations
      if (seriousOrCritical.length > 0) {
        console.log('\n   ❌ Serious/Critical violations found:');
        for (const v of seriousOrCritical) {
          console.log(`     - [${v.impact}] ${v.id}: ${v.help}`);
          console.log(`       Help: ${v.helpUrl}`);
        }
      }

      // Assert no serious/critical violations
      expect(
        seriousOrCritical,
        `Found ${seriousOrCritical.length} serious/critical accessibility violations in ${lang.name}`
      ).toHaveLength(0);
    });
  }

  test('Persian (FA) - RTL layout verification', async ({ page }) => {
    await page.goto('/?lang=fa');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that dir="rtl" is set on the html element
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');

    // Check that lang="fa" is set (or includes 'fa')
    const langAttr = await html.getAttribute('lang');
    expect(langAttr).toBe('fa');

    console.log('\n✅ RTL verification passed for Persian (FA):');
    console.log('   - dir="rtl" is set');
    console.log('   - lang="fa" is set');

    // Optional: Check for basic RTL layout issues
    // Verify main content container has proper RTL styling
    const mainContent = page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.isVisible()) {
      const box = await mainContent.boundingBox();
      if (box) {
        // Just verify the element has reasonable dimensions
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
        console.log(`   - Main content visible (${box.width}x${box.height}px)`);
      }
    }

    // Take screenshot for visual proof
    await page.screenshot({
      path: 'test-results/a11y-rtl-persian.png',
      fullPage: true,
    });
    console.log('   - Screenshot saved: test-results/a11y-rtl-persian.png');
  });
});

test.describe('Accessibility - Focus and Keyboard Navigation', () => {
  test('English - Interactive elements are keyboard accessible', async ({
    page,
  }) => {
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');

    // Check that interactive elements are focusable
    const focusableSelectors = [
      'button',
      'a[href]',
      '[role="button"]',
      'input',
      'select',
      'textarea',
    ];

    for (const selector of focusableSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count > 0) {
        // Check first element of each type is focusable
        const first = elements.first();
        if (await first.isVisible()) {
          await first.focus();
          // Element should receive focus
          await expect(first).toBeFocused();
        }
      }
    }

    console.log('✅ Interactive elements are keyboard accessible');
  });
});
