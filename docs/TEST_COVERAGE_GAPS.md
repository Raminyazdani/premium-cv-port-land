# Test Coverage Gaps

This document identifies areas of the codebase that currently lack unit or integration tests.

## Overview

The codebase has some test coverage but several critical paths remain untested. This document serves as a reference for prioritizing future test development.

---

## Critical (Test Before Major Changes)

These areas handle core functionality and should be tested before making significant modifications.

### FilterContext Filtering Logic
**File:** `src/context/FilterContext.tsx`

**What to test:**
- Filter state updates correctly on user interaction
- Filtered data matches expected output for each focus area
- "Full CV" mode shows all items
- Filter persists correctly (if implemented)

**Priority:** High - affects what users see in all sections

---

### dataLoader Sanitization
**File:** `src/utils/dataLoader.ts`

**What to test:**
- Loading data for each language (EN, DE, FA)
- Handling of malformed JSON
- Proper error handling when files are missing
- Sanitization removes invalid entries
- Data structure is validated correctly

**Priority:** High - entry point for all CV data

---

### dataNormalizer Key Mapping
**File:** `src/utils/dataNormalizer.ts`

**What to test:**
- German keys normalize to English schema
- Persian keys normalize to English schema
- Nested fields are mapped correctly
- Missing fields default to appropriate empty values
- No data is silently dropped during normalization

**Priority:** High - incorrect normalization breaks language support

---

## Important (Should Test Eventually)

These areas are important for user experience but less likely to cause critical failures.

### Section Component Empty States
**Files:** `src/components/sections/*.tsx`

**What to test:**
- Components render gracefully with empty arrays
- Components handle undefined data without crashing
- Empty state messages display correctly
- No "undefined" or "null" strings appear in rendered output

**Priority:** Medium - affects user experience

---

### Language Switching
**Files:** `src/context/LanguageContext.tsx`, `src/lib/languageManager.ts`

**What to test:**
- URL parameter (`?lang=xx`) sets language correctly
- localStorage persists language preference
- Browser language fallback works
- Default to English when no preference found
- Language switch triggers data reload

**Priority:** Medium - core multilingual feature

---

### RTL Layout Handling
**Files:** Various components

**What to test:**
- Persian (FA) applies `dir="rtl"` to document
- Flex directions reverse for RTL
- Icon/text spacing adjusts for RTL
- No visual glitches in RTL mode

**Priority:** Medium - important for Persian users

---

### Data Validation
**File:** `src/utils/dataValidator.ts`

**What to test:**
- Valid data passes validation
- Missing required fields trigger errors
- Malformed entries trigger warnings
- Validation results include appropriate error messages

**Priority:** Medium - helps catch data issues

---

## Nice to Have (Lower Priority)

These features are less critical and can be tested when time permits.

### Theme Persistence
**Files:** `src/lib/themeManager.ts`, `src/context/ThemeContext.tsx`

**What to test:**
- Theme preference saves to localStorage
- Theme loads correctly on page reload
- System preference fallback works
- Theme toggle updates UI correctly

---

### Sound Effects Toggling
**File:** `src/components/SoundEffects.tsx`

**What to test:**
- Sound effects can be toggled on/off
- Preference persists across sessions
- Sounds play at appropriate times
- Sounds respect user preference

---

### Konami Code Easter Egg
**File:** `src/hooks/use-konami-code.ts`

**What to test:**
- Correct key sequence triggers callback
- Incorrect sequence doesn't trigger
- Works with keyboard navigation

---

### Accessibility Controls
**File:** `src/components/AccessibilityControls.tsx`

**What to test:**
- High contrast mode applies correctly
- Large text mode adjusts font sizes
- Reduced motion disables animations
- Preferences persist across sessions

---

## Existing Test Coverage

The following areas have some test coverage (see `tests/` directory):

- ✅ Locked files integrity (`tests/locked-files-integrity.test.ts`)
- ✅ Language content verification (`tests/language-content-verification.test.tsx`)
- ✅ Skills normalization (`tests/skills-normalization.test.ts`)
- ✅ Data sanitization (`tests/sanitize-data.test.ts`)
- ✅ Robustness scenarios (`tests/robustness.test.tsx`)
- ✅ Section wrapper component (`tests/section-wrapper.test.tsx`)
- ✅ Language switching UI (`tests/language-switching.test.tsx`)
- ✅ useFilteredData hook (`tests/use-filtered-data.test.tsx`)
- ✅ i18n integration (`tests/i18n-integration.test.tsx`)

---

## How to Contribute Tests

1. Pick an area from this document
2. Create test file in `tests/` directory
3. Follow patterns from existing tests
4. Run `npm run test` to verify tests pass
5. Update this document to move the item to "Existing Test Coverage"

### Test File Naming
- Unit tests: `<feature>.test.ts` or `<feature>.test.tsx`
- Integration tests: `<feature>-integration.test.tsx`

### Test Commands
```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run with coverage report
npm run test:language     # Run language-specific tests
```

---

*Last updated: 2025-01-XX*
