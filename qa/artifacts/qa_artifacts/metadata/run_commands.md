# Run Commands Used for QA Audit

## Prerequisites
- Node.js (version compatible with dependencies)
- npm package manager

## Installation
```bash
cd frontend
npm install
npx playwright install chromium
```

## Build
```bash
cd frontend
npm run build
```

## Start Preview Server
```bash
cd frontend
npm run preview
# Server runs at http://localhost:4173
```

## Run Tests
```bash
# Unit tests
cd frontend
npm run test

# Language verification
npm run verify-languages

# E2E tests with Playwright
npx playwright test
```

## QA Audit Execution
1. Built production bundle
2. Started preview server on port 4173
3. Used Playwright to capture screenshots across all languages and viewports
4. Captured console logs and network activity
5. Ran accessibility checks (axe-core)

## Language URL Parameters
- English: `http://localhost:4173/?lang=en`
- German: `http://localhost:4173/?lang=de`
- Persian/Farsi: `http://localhost:4173/?lang=fa`

## Viewports Tested
- Desktop: 1440×900
- Tablet: 768×1024
- Mobile: 390×844
