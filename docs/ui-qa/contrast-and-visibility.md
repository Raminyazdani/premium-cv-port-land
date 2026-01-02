# Contrast and Visibility Detection Guide

This guide explains how to use the automated contrast and visibility detection system to catch color-contrast problems and focus visibility issues.

## Overview

The Contrast and Visibility system automatically detects:

- **Color contrast issues**: Text/icons blending into background (low contrast)
- **Focus visibility problems**: Missing or invisible focus indicators
- **RTL layout verification**: Persian (FA) layout correctness

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

### Run Contrast and Visibility Tests

Run all contrast and visibility tests:
```bash
npx playwright test e2e/contrast-visibility.spec.ts
```

Or use the Playwright UI for interactive debugging:
```bash
npx playwright test e2e/contrast-visibility.spec.ts --ui
```

### Output Location

Results are saved to:
```
frontend/test-results/
├── a11y-contrast-results.json       # Structured contrast violation data
├── contrast-visibility-summary.json  # Combined summary report
└── focus-visibility/
    ├── contrast-en.png              # Full page contrast evidence
    ├── contrast-de.png
    ├── contrast-fa.png
    ├── focus-en-step-01.png         # Focus state at step 1
    ├── focus-en-step-05.png         # Focus state at step 5
    ├── focus-en-step-10.png         # Focus state at step 10
    ├── focus-en-lang-switcher.png   # Language switcher focus (if exists)
    ├── focus-missing-en-step-*.png  # Missing focus indicator evidence
    ├── focus-results-en.json        # EN focus check details
    ├── focus-results-de.json        # DE focus check details
    ├── focus-results-fa.json        # FA focus check details
    ├── rtl-verification-fa.png      # RTL layout proof
    └── dark-mode-en.png             # Dark mode (if supported)
```

## CI Integration

The workflow (`.github/workflows/uiqa-contrast-visibility.yml`) runs automatically on:
- Pull requests to `main` or `develop`
- Manual dispatch

### Workflow Outputs

1. **Artifacts**: Download `contrast-visibility-report` from the workflow run
2. **Step Summary**: See contrast and focus visibility summary in GitHub Actions
3. **Playwright Report**: Download `contrast-visibility-playwright-report` for detailed results

## What Gets Detected

### Color Contrast Issues

Using axe-core, the system detects:

| Issue | Description | WCAG |
|-------|-------------|------|
| `color-contrast` | Text doesn't meet minimum contrast ratio | WCAG 2.1 AA |
| `link-in-text-block` | Links not distinguishable from surrounding text | WCAG 2.1 A |

**Minimum contrast ratios (WCAG 2.1 AA):**
- Normal text: 4.5:1
- Large text (≥18pt or ≥14pt bold): 3:1
- UI components and graphics: 3:1

### Focus Visibility Issues

The system performs keyboard Tab navigation and checks:

1. **Focus moves on Tab**: `activeElement` changes after each Tab press
2. **Focus indicator visible**: Element has visible:
   - `outline` (width > 0, style != none)
   - `box-shadow` (common for Tailwind focus rings)
   - `border` (some designs use border for focus)

3. **Screenshots captured at**:
   - First focusable element (step 1)
   - Mid navigation (step 10)
   - Every 5 steps
   - Language switcher (if exists)
   - Any element missing focus indicator

## Interpreting Results

### a11y-contrast-results.json

```json
{
  "language": "en",
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must have sufficient color contrast",
      "nodes": [
        {
          "target": ["button.submit-btn"],
          "html": "<button class=\"submit-btn\">Submit</button>",
          "failureSummary": "Element has insufficient color contrast of 2.5:1"
        }
      ]
    }
  ],
  "totalContrastIssues": 1
}
```

### focus-results-*.json

```json
{
  "language": "en",
  "totalSteps": 20,
  "missingFocusIndicators": [
    {
      "step": 3,
      "selector": "div.card",
      "tagName": "div",
      "screenshotPath": "focus-missing-en-step-3.png"
    }
  ],
  "screenshots": ["focus-en-step-01.png", "focus-en-step-05.png"]
}
```

## Theme Mode Support

The system checks for dark mode support:

- **Detected**: If a dark mode toggle exists, contrast tests should be run for both modes
- **Not detected**: Documented as N/A

Currently, this project:
- [ ] Has dark mode toggle
- [x] Does not have dark mode toggle (N/A)

## Troubleshooting

### Flaky Focus Tests

1. Increase wait time after Tab press (currently 100ms)
2. Check for focus trap elements (modals, dialogs)
3. Verify elements are actually focusable (`tabindex`, native elements)

### Missing Screenshots

1. Check if `test-results/focus-visibility/` directory was created
2. Verify Playwright has write permissions
3. Look for errors in the test log

### False Positives

Axe-core may report issues that are not actual problems:

1. **Color-contrast on icons**: Icon fonts may be flagged incorrectly
2. **Hidden elements**: Axe may scan elements that are visually hidden

Review violations manually before fixing.

## Related Files

- **Test file**: `frontend/e2e/contrast-visibility.spec.ts`
- **Workflow**: `.github/workflows/uiqa-contrast-visibility.yml`
- **Playwright config**: `frontend/playwright.config.ts`
- **Existing a11y tests**: `frontend/e2e/accessibility.spec.ts`

## Self-Audit Checklist

Before merging, verify:

- [x] EN/DE/FA scanned and reported
- [x] FA RTL still correct
- [x] Contrast issues are surfaced with evidence (selectors + screenshots)
- [x] Focus visibility checks detect missing focus indicators
- [x] Artifacts are uploaded and easy to locate
- [x] No locked CV JSON modifications
