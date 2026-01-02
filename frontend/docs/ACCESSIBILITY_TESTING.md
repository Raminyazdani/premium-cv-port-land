# Accessibility Testing Guide

This document describes how to run accessibility (a11y) tests locally and in CI.

## Overview

The CV website includes automated accessibility testing using:

- **Playwright**: Browser automation for E2E testing
- **axe-core**: Industry-standard accessibility testing engine (via `@axe-core/playwright`)
- **WCAG 2.1**: Tests check for Level A and AA compliance

## Quick Start

### Prerequisites

1. Node.js 20+ installed
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install Playwright browsers (first time only):
   ```bash
   npx playwright install chromium
   ```

### Run Accessibility Tests

```bash
# Build and run all a11y tests
npm run test:e2e:a11y

# Or run all E2E tests (visual + a11y)
npm run test:e2e
```

### View Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Or check the JSON results:

```bash
cat test-results/a11y-results.json
```

## Test Coverage

### Languages Tested

- **English (EN)**: `/?lang=en`
- **German (DE)**: `/?lang=de`
- **Persian (FA)**: `/?lang=fa`

### Checks Performed

1. **WCAG Compliance** (via axe-core)
   - WCAG 2.1 Level A
   - WCAG 2.1 Level AA
   - Fails on serious/critical violations

2. **RTL Support** (Persian/FA)
   - Verifies `dir="rtl"` on `<html>`
   - Verifies `lang="fa"` attribute
   - Captures RTL screenshot

3. **Content Integrity**
   - No "undefined" or "null" strings in UI
   - No "[object Object]" rendering issues

4. **Keyboard Accessibility**
   - Interactive elements are focusable
   - Focus indicators are visible

## Test Files

| File | Description |
|------|-------------|
| `e2e/accessibility.spec.ts` | Main a11y tests with axe-core |
| `e2e/visual-proof.spec.ts` | Visual regression tests |
| `playwright.config.ts` | Playwright configuration |

## CI Integration

Accessibility tests run automatically on:
- Pull requests to `main` or `develop`
- Manual workflow dispatch

### Workflow: `.github/workflows/uiqa-a11y.yml`

The CI workflow:
1. Builds the application
2. Installs Playwright browsers
3. Runs axe-core accessibility scans
4. Uploads reports as artifacts:
   - `playwright-report/` (HTML)
   - `test-results/a11y-results.json` (JSON)

## Interpreting Results

### Violation Severity

| Level | Action |
|-------|--------|
| **Critical** | Must fix - blocks users completely |
| **Serious** | Should fix - major barriers |
| **Moderate** | Consider fixing - affects some users |
| **Minor** | Low priority - minor inconvenience |

Tests fail on **critical** or **serious** violations.

### Example Violation

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
  "help": "Elements must meet minimum color contrast ratio thresholds",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/color-contrast"
}
```

## Allowlist (If Needed)

If you have known issues that cannot be fixed immediately, you can configure axe-core to skip specific rules:

```typescript
// In e2e/accessibility.spec.ts
const accessibilityScanResults = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .disableRules(['rule-to-skip'])  // Add this line
  .analyze();
```

**Important**: Document why each rule is skipped and create a tracking issue to fix it later.

## Troubleshooting

### Tests Timeout

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

### Flaky Tests in CI

The config uses deterministic settings:
- Fixed viewport (1280x720)
- Reduced motion enabled
- Single worker in CI
- Automatic retries

### Missing Browsers

```bash
npx playwright install --with-deps chromium
```

## Resources

- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Documentation](https://playwright.dev/)
- [Deque University](https://dequeuniversity.com/rules/axe/)
