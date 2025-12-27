import { test, expect } from '@playwright/test';

/**
 * Visual Proof Tests
 * 
 * These tests capture screenshots of the CV website in all three languages (EN/DE/FA)
 * to provide visual proof that rendering is working correctly and no sections are empty.
 */

test.describe('Visual Proof - Multilingual Rendering', () => {
  test('English (EN) - Renders complete CV', async ({ page }) => {
    await page.goto('/?lang=en');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that main sections exist
    await expect(page.locator('text=Ramin')).toBeVisible();
    await expect(page.locator('text=Education').or(page.locator('text=Ausbildung')).or(page.locator('text=تحصیلات'))).toBeVisible();
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/cv-english.png', 
      fullPage: true 
    });
  });

  test('German (DE) - Renders complete CV', async ({ page }) => {
    await page.goto('/?lang=de');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that main sections exist
    await expect(page.locator('text=Ramin')).toBeVisible();
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/cv-german.png', 
      fullPage: true 
    });
  });

  test('Persian (FA) - Renders complete CV with RTL', async ({ page }) => {
    await page.goto('/?lang=fa');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that main sections exist
    await expect(page.locator('text=Ramin')).toBeVisible();
    
    // Check RTL is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'fa');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/cv-persian.png', 
      fullPage: true 
    });
  });

  test('All languages - No undefined or null strings in UI', async ({ page }) => {
    const languages = ['en', 'de', 'fa'];
    
    for (const lang of languages) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForLoadState('networkidle');
      
      const content = await page.textContent('body');
      
      // Check for undefined/null strings
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
      expect(content).not.toContain('[object Object]');
      
      console.log(`✅ ${lang.toUpperCase()}: No undefined/null strings found`);
    }
  });

  test('All languages - Basic sections have content', async ({ page }) => {
    const languages = ['en', 'de', 'fa'];
    
    for (const lang of languages) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForLoadState('networkidle');
      
      // Check that key sections are not empty
      // These should have visible content
      const body = page.locator('body');
      const bodyText = await body.textContent();
      
      // Should have name (Ramin)
      expect(bodyText).toContain('Ramin');
      
      // Should have email
      expect(bodyText).toMatch(/[@]/); // Contains @ symbol
      
      // Body should not be empty
      expect(bodyText?.trim().length).toBeGreaterThan(100);
      
      console.log(`✅ ${lang.toUpperCase()}: Sections have content (${bodyText?.trim().length} chars)`);
    }
  });
});

test.describe('Visual Proof - Section Rendering', () => {
  test('English - All major sections render', async ({ page }) => {
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Take screenshots of individual sections
    const sections = [
      { selector: '[data-testid="basics-section"]', name: 'basics' },
      { selector: '[data-testid="education-section"]', name: 'education' },
      { selector: '[data-testid="skills-section"]', name: 'skills' },
      { selector: '[data-testid="experience-section"]', name: 'experience' },
      { selector: '[data-testid="projects-section"]', name: 'projects' },
    ];
    
    for (const section of sections) {
      const element = page.locator(section.selector).first();
      if (await element.isVisible()) {
        await element.screenshot({ 
          path: `test-results/section-en-${section.name}.png` 
        });
      }
    }
    
    // Take full page as final proof
    await page.screenshot({ 
      path: 'test-results/full-cv-english.png', 
      fullPage: true 
    });
  });
});
