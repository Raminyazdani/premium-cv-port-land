# Agent Runbook

This document provides a quick runbook for GitHub Copilot coding agents working on this CV website project.

## Quick Start for Agents

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Environment
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Verify installation succeeded
ls -la node_modules/.bin | grep vite
```

### 3. Run Tests
```bash
# Run all tests
npm run test

# Run language-specific verification
npm run test:language

# Quick smoke test for all languages
npm run verify-languages
```

### 4. Build
```bash
# Production build
npm run build

# Check build output
ls -la dist/
```

### 5. Smoke Check All Languages
```bash
# This validates that EN/DE/FA all load correctly
npm run verify-languages

# Expected output:
# ✅ English (EN): PASSED
# ✅ German (DE): PASSED
# ✅ Persian (FA): PASSED
```

## Locked Files Policy (CRITICAL)

### DO NOT TOUCH THESE FILES:
- `src/data/cv.json`
- `src/data/ramin_de.json`
- `src/data/ramin_fa.json`

### Why?
- These contain production CV data
- Past modifications caused missing/corrupted sections
- Byte-identical integrity enforced via hash tests

### Verification Command:
```bash
# Check if locked files were modified
git diff src/data/cv.json src/data/ramin_de.json src/data/ramin_fa.json

# Should show no changes!
```

### If You Need Test Fixtures:
- Read directly from locked files at runtime, OR
- Create byte-identical copies in `tests/fixtures/` and document

## Single Command Validation (EN/DE/FA)

The **single command** that validates all three languages:

```bash
npm run verify-languages
```

This command:
- ✅ Loads JSON for EN, DE, and FA
- ✅ Checks all sections exist (basics, education, skills, etc.)
- ✅ Validates sections have content (not empty)
- ✅ Reports any missing or empty sections
- ✅ Exits with code 0 if all pass, 1 if any fail

### Expected Output:
```
🔍 CV Language Data Verification
================================

============================================================
Verifying ENGLISH
============================================================
✅ JSON file loaded successfully
  ✅ basics                       array[1]
  ✅ profiles                     array[4]
  ✅ education                    array[5]
  ...
Overall Status: ✅ PASSED

[Similar output for German and Persian]

============================================================
FINAL SUMMARY
============================================================
✅ English (EN):  PASSED
✅ German (DE):   PASSED
✅ Persian (FA):  PASSED

✅ ALL LANGUAGES VERIFIED SUCCESSFULLY!
```

## Common Tasks

### Task: Add New Feature
```bash
# 1. Start dev server
npm run dev

# 2. Make changes (but NOT to locked JSON files!)

# 3. Test changes
npm run test

# 4. Verify all languages still work
npm run verify-languages

# 5. Build to ensure no build errors
npm run build

# 6. Commit (locked files should not be in diff)
git status
git diff src/data/  # Should be empty!
```

### Task: Debug Missing/Undefined Sections
```bash
# 1. Run language verification
npm run verify-languages

# 2. Check which sections are missing/empty
# Output will show ❌ or ⚠️ for problem sections

# 3. Run dev server with console logging
npm run dev
# Open browser console to see detailed normalization logs

# 4. Check specific language test
npm run test:language

# 5. Check normalization logic
# See: src/utils/dataNormalizer.ts
# See: src/utils/dataLoader.ts
```

### Task: Fix Test Failure
```bash
# 1. Run failing test
npm run test -- tests/path/to/test.test.ts

# 2. Check if it's a locked file integrity issue
npm run test -- tests/locked-files-integrity.test.ts

# 3. If locked files were modified (DON'T DO THIS!):
git checkout src/data/cv.json src/data/ramin_de.json src/data/ramin_fa.json

# 4. Regenerate hashes if needed (ONLY with user approval)
npm run generate-hashes
```

## Development Workflow

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Run tests in watch mode
npm run test:watch

# Browser: Test each language
# http://localhost:5173/?lang=en
# http://localhost:5173/?lang=de
# http://localhost:5173/?lang=fa
```

## Pre-Commit Checklist

Before committing changes:

- [ ] Tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] Language verification passes: `npm run verify-languages`
- [ ] Locked files unchanged: `git diff src/data/` (should be empty)
- [ ] No "undefined" strings in UI (manual check)
- [ ] RTL works for Persian (manual check at `?lang=fa`)

## Debugging Checklist

When sections are missing or showing "undefined":

1. **Check raw data loading**
   ```bash
   npm run verify-languages
   ```

2. **Check normalization**
   - File: `src/utils/dataNormalizer.ts`
   - Ensure language-specific keys map to English schema
   - German: `bildung` → `education`
   - Persian: `تحصیلات` → `education`

3. **Check validation**
   - File: `src/utils/dataLoader.ts`
   - Check console for errors/warnings in dev mode

4. **Check component rendering**
   - Files: `src/components/**/*.tsx`
   - Ensure null checks and empty state handling
   - No direct render of `undefined` or `null`

5. **Check filtering**
   - File: `src/context/FilterContext.tsx`
   - Try "Full CV" filter to see all entries
   - Some entries hidden by `type_key` filtering

## Environment Details

- **Node**: 18+ required
- **Package Manager**: npm
- **Build Tool**: Vite
- **Test Runner**: Vitest
- **Framework**: React 19 + TypeScript 5.7
- **Styling**: Tailwind CSS 4

## CI/CD

- **Setup Steps**: `.github/workflows/copilot-setup-steps.yml`
- **CI Pipeline**: `.github/workflows/ci.yml`
- **Visual Proof**: Playwright screenshots uploaded as artifacts

For details on Copilot background job environment setup, see:
- `docs/copilot-background-jobs.md`

## Additional Documentation

- **Detailed Instructions**: `.github/copilot-instructions.md`
- **Data Normalization**: `.github/instructions/data-normalization.instructions.md`
- **UI Rendering**: `.github/instructions/ui-rendering.instructions.md`
- **Testing**: `.github/instructions/tests.instructions.md`
- **Schema Reference**: `SCHEMA.md`
- **Quick Start Guide**: `QUICK_START.md`

## What "Done" Means

An agent's work is complete when:

✅ All tests pass (`npm run test`)
✅ Build succeeds (`npm run build`)
✅ All three languages verified (`npm run verify-languages`)
✅ Locked files unchanged (`git diff src/data/`)
✅ No "undefined" strings in UI (manual verification)
✅ RTL layout works for Persian (manual verification at `?lang=fa`)
✅ CI passes (if PR exists)

## Getting Help

If stuck:
1. Check `.github/copilot-instructions.md` for detailed guidance
2. Check path-specific instructions in `.github/instructions/`
3. Run `npm run verify-languages` to diagnose language-specific issues
4. Check console logs in dev mode for validation errors
5. Review existing tests for patterns and examples
