# QA Artifacts Directory

This directory contains all media, logs, and traces from the QA audit performed on 2025-12-28.

## Directory Structure

```
qa_artifacts/
├── README.md                    # This file
├── screenshots/                 # All captured screenshots
│   ├── en/                      # English language screenshots
│   │   ├── desktop/             # Desktop viewport (1440×900)
│   │   │   ├── full-page.png
│   │   │   ├── sections/
│   │   │   └── components/
│   │   ├── tablet/              # Tablet viewport (768×1024)
│   │   └── mobile/              # Mobile viewport (390×844)
│   ├── de/                      # German language screenshots
│   ├── fa/                      # Persian language screenshots (RTL)
│   ├── qa-full-page-en-desktop.png
│   ├── qa-fa-desktop-full.png
│   └── enhanced-ui-demo-section.png
├── console_logs/                # Browser console logs
│   ├── en-console.json          # English session logs
│   ├── de-console.json          # German session logs
│   ├── fa-console.json          # Persian session logs
│   └── build.txt                # Build output logs
├── metadata/                    # Audit metadata
│   ├── stack_detection.json     # Detected technology stack
│   ├── run_commands.md          # Commands used for audit
│   ├── test_matrix.md           # Test coverage matrix
│   ├── issues.json              # Machine-readable issues list
│   ├── screenshots-manifest.json # Screenshot inventory
│   └── architecture_notes.md    # Architecture findings
├── network/                     # Network traces (HAR files)
├── traces/                      # Playwright traces
├── a11y/                        # Accessibility scan results
└── performance/                 # Performance/Lighthouse reports
```

## How to View Reports

### Primary Report (Markdown)
Open `qa/reports/QA_REPORT.md` in any markdown viewer or GitHub.

### HTML Report (Browser)
Open `qa/reports/QA_REPORT.html` in a web browser for a styled, interactive view.

### QA Index
See `qa/indexes/QA_INDEX.md` for a complete navigation index to all QA outputs.

### Screenshot Gallery
Screenshots are organized by:
1. **Language** (en, de, fa)
2. **Viewport** (desktop, tablet, mobile)
3. **Type** (full-page, sections, components)

## Key Findings Summary

| Severity | Count |
|----------|-------|
| Blocker  | 1     |
| High     | 8     |
| Medium   | 14    |
| Low      | 9     |

### Critical Issue
**SCOPE-001**: The `EnhancedUIDemo` section should be removed - it contains irrelevant demo content that disrupts the CV flow.

## Audit Scope

- **Languages Tested**: EN, DE, FA
- **Viewports Tested**: Desktop (1440×900), Tablet (768×1024), Mobile (390×844)
- **Sections Tested**: 16 sections across the CV
- **Build Tested**: Production build with Vite

## Notes

- Console logs are in JSON format for machine parsing
- Screenshots use PNG format for lossless quality
- RTL layout was verified for Persian language
- No accessibility scan (axe) was performed (tooling limitation)
- No Lighthouse performance report (tooling limitation)
