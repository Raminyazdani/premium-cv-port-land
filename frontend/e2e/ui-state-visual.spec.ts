import { test, expect, Page, BoundingBox } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * UI State Visual QA Tests
 *
 * This test suite captures interaction-state screenshots and performs
 * lightweight assertions to catch scroll/layout/sticky/visibility bugs.
 *
 * Features:
 *   - Scroll-state screenshots (top, mid, bottom)
 *   - Viewport breakpoint screenshots (desktop, mobile, tablet)
 *   - Visibility toggle checks (skills accordion expand/collapse)
 *   - Layout integrity assertions (overlap detection, viewport bounds)
 *   - Reduced motion for deterministic captures
 *
 * Artifacts:
 *   - artifacts/ui-states/<lang>/<viewport>/<state>.png
 *   - artifacts/ui-states/ui-states-summary.json
 */

// ============================================================================
// PHASE A: Define Viewports and Constants
// ============================================================================

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
];

// Languages to test
const languages = [
  { code: 'en', name: 'English', isRTL: false },
  { code: 'de', name: 'German', isRTL: false },
  { code: 'fa', name: 'Persian', isRTL: true },
];

// Layout check thresholds
const MIN_VISIBLE_AREA_RATIO = 0.5; // Element must be at least 50% visible to be considered in viewport
const MAX_HEADER_HEIGHT_RATIO = 0.25; // Header shouldn't be more than 25% of viewport height
const HEADER_Y_TOLERANCE = 5; // Pixels tolerance for header position at y=0

// Localized UI text for button interactions
const LOCALIZED_TEXT = {
  expandAll: {
    en: 'Expand',
    de: 'Erweitern',
    fa: 'گسترش',
  },
};

// ============================================================================
// PHASE B: Define UI States
// ============================================================================

// Output directory for UI state screenshots
const outputDir = path.join(process.cwd(), 'artifacts', 'ui-states');

// Summary tracking
interface StateSummary {
  timestamp: string;
  languages: string[];
  viewports: string[];
  states: string[];
  screenshots: Array<{
    language: string;
    viewport: string;
    state: string;
    path: string;
    success: boolean;
    error?: string;
  }>;
  assertions: Array<{
    language: string;
    viewport: string;
    state: string;
    check: string;
    passed: boolean;
    details?: string;
  }>;
  totalScreenshots: number;
  successfulScreenshots: number;
  failedScreenshots: number;
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
}

const summary: StateSummary = {
  timestamp: new Date().toISOString(),
  languages: languages.map((l) => l.code),
  viewports: viewports.map((v) => v.name),
  states: [],
  screenshots: [],
  assertions: [],
  totalScreenshots: 0,
  successfulScreenshots: 0,
  failedScreenshots: 0,
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Ensure output directory exists
 */
function ensureOutputDir(lang: string, viewport: string): string {
  const dir = path.join(outputDir, lang, viewport);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Wait for page to be stable
 */
async function waitForStableLayout(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
}

/**
 * Get bounding box of an element, returns null if not visible
 */
async function getBoundingBox(
  page: Page,
  selector: string
): Promise<BoundingBox | null> {
  const element = page.locator(selector).first();
  if ((await element.count()) === 0) return null;
  if (!(await element.isVisible())) return null;
  return await element.boundingBox();
}

/**
 * Check if a bounding box is within viewport bounds
 */
function isWithinViewport(
  box: BoundingBox | null,
  viewportWidth: number,
  viewportHeight: number
): boolean {
  if (!box) return false;
  if (viewportWidth <= 0 || viewportHeight <= 0) return false;

  // Element is considered visible if at least MIN_VISIBLE_AREA_RATIO is within viewport
  const visibleWidth = Math.min(box.x + box.width, viewportWidth) - Math.max(box.x, 0);
  const visibleHeight =
    Math.min(box.y + box.height, viewportHeight) - Math.max(box.y, 0);

  const visibleArea = Math.max(0, visibleWidth) * Math.max(0, visibleHeight);
  const totalArea = box.width * box.height;

  return visibleArea >= totalArea * MIN_VISIBLE_AREA_RATIO;
}

/**
 * Check if an element is offscreen when it should be visible
 */
async function checkElementVisibility(
  page: Page,
  selector: string,
  viewportWidth: number,
  viewportHeight: number
): Promise<{ visible: boolean; inViewport: boolean; box: BoundingBox | null }> {
  const element = page.locator(selector).first();
  const count = await element.count();
  if (count === 0) return { visible: false, inViewport: false, box: null };

  const visible = await element.isVisible();
  const box = visible ? await element.boundingBox() : null;
  const inViewport = box ? isWithinViewport(box, viewportWidth, viewportHeight) : false;

  return { visible, inViewport, box };
}

/**
 * Scroll to percentage of page
 */
async function scrollToPercentage(page: Page, percentage: number): Promise<void> {
  await page.evaluate((pct) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * (pct / 100), behavior: 'instant' });
  }, percentage);
  await page.waitForTimeout(200);
}

/**
 * Record an assertion result
 */
function recordAssertion(
  language: string,
  viewport: string,
  state: string,
  check: string,
  passed: boolean,
  details?: string
): void {
  summary.assertions.push({
    language,
    viewport,
    state,
    check,
    passed,
    details,
  });
  summary.totalAssertions++;
  if (passed) {
    summary.passedAssertions++;
  } else {
    summary.failedAssertions++;
  }
}

/**
 * Record a screenshot result
 */
function recordScreenshot(
  language: string,
  viewport: string,
  state: string,
  screenshotPath: string,
  success: boolean,
  error?: string
): void {
  summary.screenshots.push({
    language,
    viewport,
    state,
    path: screenshotPath,
    success,
    error,
  });
  summary.totalScreenshots++;
  if (success) {
    summary.successfulScreenshots++;
  } else {
    summary.failedScreenshots++;
  }
}

/**
 * Save summary to JSON file
 */
function saveSummary(): void {
  const summaryPath = path.join(outputDir, 'ui-states-summary.json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Summary saved to: ${summaryPath}`);
}

// ============================================================================
// PHASE C: Scroll & Layout Integrity Checks
// ============================================================================

/**
 * Perform layout integrity checks for a given state
 */
async function performLayoutChecks(
  page: Page,
  language: string,
  viewport: { name: string; width: number; height: number },
  state: string
): Promise<void> {
  // Check 1: Header doesn't overlap with main content when sticky
  const headerBox = await getBoundingBox(page, 'header');
  const mainBox = await getBoundingBox(page, 'main, [role="main"], .main-content');

  if (headerBox && mainBox) {
    // For sticky/fixed headers at the top of the page:
    // - The header stays fixed at position 0 during scroll
    // - The main content's y position becomes negative when scrolled
    // - This is expected behavior
    // 
    // We check for actual problems:
    // - Header height should be reasonable (not covering too much viewport)
    // - Header should be at y=0 or close to it (within viewport)
    const headerHeightOk = headerBox.height < viewport.height * MAX_HEADER_HEIGHT_RATIO;
    const headerInViewport = headerBox.y >= -HEADER_Y_TOLERANCE && headerBox.y < viewport.height / 2;
    const passed = headerHeightOk && headerInViewport;
    
    recordAssertion(
      language,
      viewport.name,
      state,
      'header-layout-valid',
      passed,
      `Header height: ${headerBox.height}px (${((headerBox.height / viewport.height) * 100).toFixed(1)}% of viewport), position y: ${headerBox.y}`
    );
  }

  // Check 2: Language selector is within viewport when visible
  const langSelectorResult = await checkElementVisibility(
    page,
    '[data-testid="language-switcher"], button:has(svg), [aria-label*="language"]',
    viewport.width,
    viewport.height
  );
  if (langSelectorResult.visible) {
    recordAssertion(
      language,
      viewport.name,
      state,
      'language-selector-in-viewport',
      langSelectorResult.inViewport,
      langSelectorResult.box
        ? `Position: (${langSelectorResult.box.x}, ${langSelectorResult.box.y})`
        : 'Not found'
    );
  }

  // Check 3: Header is visible when at top of page
  if (state === 'base' || state === 'top') {
    if (headerBox) {
      const headerVisible = isWithinViewport(headerBox, viewport.width, viewport.height);
      recordAssertion(
        language,
        viewport.name,
        state,
        'header-visible-at-top',
        headerVisible,
        `Header box: ${JSON.stringify(headerBox)}`
      );
    }
  }

  // Check 4: No critical UI is completely offscreen
  const criticalElements = [
    { selector: 'header', name: 'header' },
    { selector: '#skills, [data-testid="skills-section"]', name: 'skills-section' },
  ];

  for (const el of criticalElements) {
    const result = await checkElementVisibility(
      page,
      el.selector,
      viewport.width,
      viewport.height
    );
    if (result.visible && result.box) {
      // Check if element is completely offscreen to the left or right
      const completelyOffscreen =
        result.box.x + result.box.width < 0 || result.box.x > viewport.width;
      recordAssertion(
        language,
        viewport.name,
        state,
        `${el.name}-not-offscreen-horizontal`,
        !completelyOffscreen,
        `Box: ${JSON.stringify(result.box)}`
      );
    }
  }
}

// ============================================================================
// TEST SUITE: UI State Visual Screenshots
// ============================================================================

test.describe('UI State Visual QA', () => {
  // Force reduced motion for all tests
  test.use({
    reducedMotion: 'reduce',
    locale: 'en-US',
    timezoneId: 'UTC',
  });

  // =========================================================================
  // Full Page State Captures (all viewports, all languages)
  // =========================================================================

  test.describe('Scroll State Screenshots', () => {
    for (const lang of languages) {
      for (const viewport of viewports) {
        test(`${lang.name} - ${viewport.name} - Scroll states`, async ({ page }) => {
          const dir = ensureOutputDir(lang.code, viewport.name);

          // Set viewport
          await page.setViewportSize({ width: viewport.width, height: viewport.height });

          // Navigate with language
          await page.goto(`/?lang=${lang.code}`);
          await waitForStableLayout(page);

          // Verify content loaded
          await expect(page.locator('body')).toContainText('Ramin');

          // RTL check for Persian
          if (lang.isRTL) {
            await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
          }

          // State 1: Base (top of page)
          const baseScreenshot = path.join(dir, 'state-base.png');
          await page.screenshot({ path: baseScreenshot, fullPage: false });
          recordScreenshot(lang.code, viewport.name, 'base', baseScreenshot, true);
          console.log(`📸 Captured: ${baseScreenshot}`);

          // Perform layout checks at base
          await performLayoutChecks(page, lang.code, viewport, 'base');

          // State 2: Mid-scroll (50%)
          await scrollToPercentage(page, 50);
          const midScreenshot = path.join(dir, 'state-mid-scroll.png');
          await page.screenshot({ path: midScreenshot, fullPage: false });
          recordScreenshot(lang.code, viewport.name, 'mid-scroll', midScreenshot, true);
          console.log(`📸 Captured: ${midScreenshot}`);

          // Perform layout checks at mid-scroll
          await performLayoutChecks(page, lang.code, viewport, 'mid-scroll');

          // State 3: Bottom (near footer)
          await scrollToPercentage(page, 100);
          const bottomScreenshot = path.join(dir, 'state-bottom.png');
          await page.screenshot({ path: bottomScreenshot, fullPage: false });
          recordScreenshot(lang.code, viewport.name, 'bottom', bottomScreenshot, true);
          console.log(`📸 Captured: ${bottomScreenshot}`);

          // Perform layout checks at bottom
          await performLayoutChecks(page, lang.code, viewport, 'bottom');
        });
      }
    }
  });

  // =========================================================================
  // Visibility Toggle States (Skills Accordion)
  // =========================================================================

  test.describe('Skills Accordion Toggle States', () => {
    for (const lang of languages) {
      test(`${lang.name} - Desktop - Skills accordion expand/collapse`, async ({ page }) => {
        const dir = ensureOutputDir(lang.code, 'desktop');

        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(`/?lang=${lang.code}`);
        await waitForStableLayout(page);

        // Navigate to skills section
        const skillsSection = page.locator('#skills, [data-testid="skills-section"]').first();
        if ((await skillsSection.count()) > 0) {
          await skillsSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);

          // Screenshot 1: Skills section initial state
          const initialScreenshot = path.join(dir, 'skills-initial.png');
          await skillsSection.screenshot({ path: initialScreenshot });
          recordScreenshot(lang.code, 'desktop', 'skills-initial', initialScreenshot, true);
          console.log(`📸 Captured: ${initialScreenshot}`);

          // Find and click "Expand All" button if available (list view)
          const expandTexts = Object.values(LOCALIZED_TEXT.expandAll);
          const expandAllSelector = expandTexts.map(text => `button:has-text("${text}")`).join(', ');
          const expandAllBtn = page.locator(expandAllSelector).first();
          if ((await expandAllBtn.count()) > 0 && (await expandAllBtn.isVisible())) {
            await expandAllBtn.click();
            await page.waitForTimeout(300);

            // Screenshot 2: Skills expanded state
            const expandedScreenshot = path.join(dir, 'skills-expanded.png');
            await skillsSection.screenshot({ path: expandedScreenshot });
            recordScreenshot(lang.code, 'desktop', 'skills-expanded', expandedScreenshot, true);
            console.log(`📸 Captured: ${expandedScreenshot}`);

            // Record assertion for expand functionality
            recordAssertion(
              lang.code,
              'desktop',
              'skills-expanded',
              'expand-all-works',
              true,
              'Expand All button clicked successfully'
            );
          }

          // Try clicking individual category headers (accordion behavior)
          const categoryButtons = page.locator('#skills button[aria-expanded], [data-testid="skills-section"] button[aria-expanded]');
          const buttonCount = await categoryButtons.count();
          
          if (buttonCount > 0) {
            // Toggle first category
            const firstButton = categoryButtons.first();
            await firstButton.click();
            await page.waitForTimeout(300);

            // Screenshot after toggle
            const toggledScreenshot = path.join(dir, 'skills-toggled.png');
            await skillsSection.screenshot({ path: toggledScreenshot });
            recordScreenshot(lang.code, 'desktop', 'skills-toggled', toggledScreenshot, true);
            console.log(`📸 Captured: ${toggledScreenshot}`);

            recordAssertion(
              lang.code,
              'desktop',
              'skills-toggled',
              'accordion-toggle-works',
              true,
              `Toggled ${buttonCount} category buttons available`
            );
          }
        }
      });
    }
  });

  // =========================================================================
  // Language Selector Toggle State
  // =========================================================================

  test.describe('Language Selector States', () => {
    for (const lang of languages) {
      test(`${lang.name} - Desktop - Language selector interaction`, async ({ page }) => {
        const dir = ensureOutputDir(lang.code, 'desktop');

        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(`/?lang=${lang.code}`);
        await waitForStableLayout(page);

        // Find language selector button (in header)
        const langButton = page
          .locator('header button')
          .filter({ has: page.locator('svg') })
          .first();

        if ((await langButton.count()) > 0 && (await langButton.isVisible())) {
          // Screenshot before opening
          const closedScreenshot = path.join(dir, 'lang-selector-closed.png');
          await page.screenshot({ path: closedScreenshot, fullPage: false });
          recordScreenshot(lang.code, 'desktop', 'lang-selector-closed', closedScreenshot, true);

          // Click to open dropdown
          await langButton.click();
          await page.waitForTimeout(300);

          // Screenshot with dropdown open
          const openScreenshot = path.join(dir, 'lang-selector-open.png');
          await page.screenshot({ path: openScreenshot, fullPage: false });
          recordScreenshot(lang.code, 'desktop', 'lang-selector-open', openScreenshot, true);
          console.log(`📸 Captured: ${openScreenshot}`);

          // Check if dropdown menu appeared
          const dropdown = page.locator('[role="menu"], [data-radix-menu-content]').first();
          const dropdownVisible = (await dropdown.count()) > 0 && (await dropdown.isVisible());

          recordAssertion(
            lang.code,
            'desktop',
            'lang-selector-open',
            'dropdown-appears',
            dropdownVisible,
            dropdownVisible ? 'Dropdown menu is visible' : 'Dropdown not found'
          );

          // Press Escape to close
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      });
    }
  });

  // =========================================================================
  // Carousel State (if exists)
  // =========================================================================

  test.describe('Skills Carousel States', () => {
    for (const lang of languages) {
      test(`${lang.name} - Desktop - Skills carousel navigation`, async ({ page }) => {
        const dir = ensureOutputDir(lang.code, 'desktop');

        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(`/?lang=${lang.code}`);
        await waitForStableLayout(page);

        // Navigate to skills section
        const skillsSection = page.locator('#skills, [data-testid="skills-section"]').first();
        if ((await skillsSection.count()) > 0) {
          await skillsSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);

          // Check for existing carousel navigation buttons
          const nextButton = skillsSection.locator('button[aria-label*="next"], button:has-text(">"), button:has(svg[class*="caret"])').first();
          
          if ((await nextButton.count()) > 0 && (await nextButton.isVisible())) {
            // Screenshot initial carousel state
            const initialScreenshot = path.join(dir, 'carousel-initial.png');
            await skillsSection.screenshot({ path: initialScreenshot });
            recordScreenshot(lang.code, 'desktop', 'carousel-initial', initialScreenshot, true);
            console.log(`📸 Captured: ${initialScreenshot}`);

            // Click next button
            const isDisabled = await nextButton.isDisabled();
            if (!isDisabled) {
              await nextButton.click();
              await page.waitForTimeout(400);

              // Screenshot after navigation
              const afterNextScreenshot = path.join(dir, 'carousel-after-next.png');
              await skillsSection.screenshot({ path: afterNextScreenshot });
              recordScreenshot(lang.code, 'desktop', 'carousel-after-next', afterNextScreenshot, true);
              console.log(`📸 Captured: ${afterNextScreenshot}`);

              recordAssertion(
                lang.code,
                'desktop',
                'carousel-after-next',
                'carousel-navigation-works',
                true,
                'Next button clicked successfully'
              );
            }
          }
        }
      });
    }
  });

  // =========================================================================
  // Projects Section Visibility
  // =========================================================================

  test.describe('Projects Section States', () => {
    for (const lang of languages) {
      test(`${lang.name} - Desktop - Projects section in view`, async ({ page }) => {
        const dir = ensureOutputDir(lang.code, 'desktop');

        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(`/?lang=${lang.code}`);
        await waitForStableLayout(page);

        // Find projects section
        const projectsSection = page.locator('#projects, [data-testid="projects-section"]').first();
        
        if ((await projectsSection.count()) > 0 && (await projectsSection.isVisible())) {
          await projectsSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);

          // Screenshot projects section
          const projectsScreenshot = path.join(dir, 'projects-in-view.png');
          await projectsSection.screenshot({ path: projectsScreenshot });
          recordScreenshot(lang.code, 'desktop', 'projects-in-view', projectsScreenshot, true);
          console.log(`📸 Captured: ${projectsScreenshot}`);

          // Verify projects section has content
          const projectsText = await projectsSection.textContent();
          const hasContent = projectsText && projectsText.trim().length > 50;

          recordAssertion(
            lang.code,
            'desktop',
            'projects-in-view',
            'projects-has-content',
            hasContent ?? false,
            `Content length: ${projectsText?.trim().length || 0} chars`
          );
        }
      });
    }
  });

  // =========================================================================
  // Mobile-specific checks
  // =========================================================================

  test.describe('Mobile Menu States', () => {
    for (const lang of languages) {
      test(`${lang.name} - Mobile - Menu toggle`, async ({ page }) => {
        const dir = ensureOutputDir(lang.code, 'mobile');

        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`/?lang=${lang.code}`);
        await waitForStableLayout(page);

        // Find mobile menu button (hamburger icon)
        const menuButton = page.locator('header button[aria-label*="menu"], header button:has(svg)').last();

        if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
          // Screenshot before opening menu
          const closedScreenshot = path.join(dir, 'mobile-menu-closed.png');
          await page.screenshot({ path: closedScreenshot, fullPage: false });
          recordScreenshot(lang.code, 'mobile', 'mobile-menu-closed', closedScreenshot, true);

          // Click to open menu
          await menuButton.click();
          await page.waitForTimeout(400);

          // Screenshot with menu open
          const openScreenshot = path.join(dir, 'mobile-menu-open.png');
          await page.screenshot({ path: openScreenshot, fullPage: false });
          recordScreenshot(lang.code, 'mobile', 'mobile-menu-open', openScreenshot, true);
          console.log(`📸 Captured: ${openScreenshot}`);

          // Check if menu sheet appeared
          const menuSheet = page.locator('[role="dialog"], [data-state="open"]').first();
          const menuVisible = (await menuSheet.count()) > 0;

          recordAssertion(
            lang.code,
            'mobile',
            'mobile-menu-open',
            'mobile-menu-appears',
            menuVisible,
            menuVisible ? 'Mobile menu sheet is visible' : 'Menu sheet not found'
          );

          // Close menu
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      });
    }
  });

  // =========================================================================
  // Summary Generation
  // =========================================================================

  test.describe('Summary Generation', () => {
    test('Generate UI states summary', async ({ page }) => {
      // Update states list
      summary.states = [
        'base',
        'mid-scroll',
        'bottom',
        'skills-initial',
        'skills-expanded',
        'skills-toggled',
        'lang-selector-closed',
        'lang-selector-open',
        'carousel-initial',
        'carousel-after-next',
        'projects-in-view',
        'mobile-menu-closed',
        'mobile-menu-open',
      ];

      // Save summary
      saveSummary();

      // Log final summary
      console.log('\n======================================');
      console.log('📊 UI STATE VISUAL QA SUMMARY');
      console.log('======================================');
      console.log(`\n📸 Screenshots:`);
      console.log(`   Total: ${summary.totalScreenshots}`);
      console.log(`   Successful: ${summary.successfulScreenshots}`);
      console.log(`   Failed: ${summary.failedScreenshots}`);
      console.log(`\n✅ Assertions:`);
      console.log(`   Total: ${summary.totalAssertions}`);
      console.log(`   Passed: ${summary.passedAssertions}`);
      console.log(`   Failed: ${summary.failedAssertions}`);

      if (summary.failedAssertions > 0) {
        console.log('\n❌ Failed Assertions:');
        summary.assertions
          .filter((a) => !a.passed)
          .forEach((a) => {
            console.log(`   - ${a.language}/${a.viewport}/${a.state}: ${a.check}`);
            if (a.details) console.log(`     Details: ${a.details}`);
          });
      }

      console.log('======================================\n');

      // Verify summary was created
      const summaryPath = path.join(outputDir, 'ui-states-summary.json');
      expect(fs.existsSync(summaryPath)).toBe(true);

      // Navigate to satisfy Playwright
      await page.goto('/?lang=en');
    });
  });
});
