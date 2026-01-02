# Visual QA Guide

This guide explains how to use the Visual QA system to catch visual regressions and verify layout correctness across all three languages (EN/DE/FA).

## Overview

The Visual QA system captures deterministic screenshots of the CV website to:

- **Catch visual regressions**: Detect broken layouts, overlapping elements
- **Verify RTL support**: Ensure Persian (FA) renders correctly right-to-left
- **Provide visual proof**: Give PR reviewers quick visual validation
- **Test responsiveness**: Capture screenshots at different viewport sizes

## Running Locally

### Prerequisites

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install chromium
   ```

### Run Visual QA Tests

Run all visual QA tests:
```bash
npm run test:e2e -- e2e/visual-qa.spec.ts
```

Or use the Playwright UI for interactive debugging:
```bash
npx playwright test e2e/visual-qa.spec.ts --ui
```

### Output Location

Screenshots are saved to:
```
frontend/artifacts/visual-qa/
├── en/
│   ├── en-home.png           # Full page screenshot
│   ├── en-basics.png         # Basics section
│   ├── en-education.png      # Education section
│   ├── en-skills.png         # Skills section
│   ├── en-experience.png     # Experience section
│   ├── en-projects.png       # Projects section
│   ├── en-publications.png   # Publications section
│   ├── en-references.png     # References section
│   ├── en-desktop.png        # Desktop viewport (1280x720)
│   ├── en-tablet.png         # Tablet viewport (768x1024)
│   └── en-mobile.png         # Mobile viewport (375x667)
├── de/
│   ├── de-home.png
│   └── ... (same structure as en/)
└── fa/
    ├── fa-home.png
    ├── fa-rtl-layout.png     # RTL-specific screenshot
    └── ... (same structure as en/)
```

## CI Integration

The Visual QA workflow (`.github/workflows/uiqa-visual.yml`) runs automatically on:
- Pull requests to `main` or `develop`
- Manual dispatch

### Workflow Outputs

1. **Artifacts**: Download `visual-qa-screenshots` from the workflow run
2. **Step Summary**: See a table of all captured screenshots in the GitHub Actions summary
3. **Playwright Report**: Download `visual-qa-playwright-report` for detailed test results

### Reviewing PR Screenshots

1. Go to the PR's "Checks" tab
2. Click on "UI QA Visual" workflow run
3. View the step summary for a quick overview
4. Download the `visual-qa-screenshots` artifact
5. Compare screenshots across EN/DE/FA

## Determinism

Screenshots are deterministic due to:

- **Fixed viewport**: Default 1280x720 for consistency
- **Reduced motion**: CSS animations disabled via `prefers-reduced-motion: reduce`
- **Network idle**: Wait for all network requests to complete
- **Stable layout**: Wait for loading indicators to disappear
- **Single browser**: Chromium only for consistent rendering

## Test Categories

### Full Page Screenshots
Captures complete page views for each language.

### Section Screenshots
Captures individual CV sections if they have `data-testid` attributes:
- `data-testid="basics-section"`
- `data-testid="education-section"`
- `data-testid="skills-section"`
- `data-testid="experience-section"`
- `data-testid="projects-section"`
- `data-testid="publications-section"`
- `data-testid="references-section"`

### Content Validation
Verifies:
- No `undefined` or `null` strings in UI
- Body has substantial content
- Name "Ramin" is visible

### RTL Verification
For Persian (FA):
- Verifies `dir="rtl"` attribute
- Verifies `lang="fa"` attribute
- Checks main content has proper dimensions

### Viewport Testing
Tests responsive layouts:
- Desktop: 1280x720
- Tablet: 768x1024
- Mobile: 375x667

## Adding New Screenshots

To capture additional elements, add them to the `sections` array in `e2e/visual-qa.spec.ts`:

```typescript
const sections = [
  { testId: 'basics-section', name: 'basics' },
  { testId: 'your-new-section', name: 'your-new-section' },
  // ...
];
```

The element must have a `data-testid` attribute matching the `testId` value.

## Troubleshooting

### Screenshots Not Captured

1. **Section not visible**: Ensure the element is rendered and visible
2. **Missing `data-testid`**: Add the attribute to the component
3. **Build failure**: Check `build.log` in the workflow artifacts

### Flaky Tests

1. Increase timeout in `waitForStableLayout()`
2. Add specific element wait conditions
3. Check for dynamic content that needs additional waiting

### RTL Issues

1. Verify `dir="rtl"` is set on `<html>` for Persian
2. Check CSS uses logical properties (`margin-inline-start` vs `margin-left`)
3. Compare `fa-home.png` with `en-home.png` for layout differences

## Related Files

- **Test file**: `frontend/e2e/visual-qa.spec.ts`
- **Workflow**: `.github/workflows/uiqa-visual.yml`
- **Playwright config**: `frontend/playwright.config.ts`
- **Existing visual tests**: `frontend/e2e/visual-proof.spec.ts`

## Self-Audit Checklist

Before merging, verify:

- [ ] EN/DE/FA screenshots captured deterministically
- [ ] FA is RTL and visually correct
- [ ] Artifacts uploaded to workflow
- [ ] Tests are not flaky (run multiple times to confirm)
- [ ] Locked CV JSON files unchanged (`src/data/*.json`)
