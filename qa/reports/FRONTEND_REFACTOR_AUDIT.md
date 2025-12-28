# Frontend Architecture Refactor Audit

**Generated:** 2025-12-28  
**Repository:** premium-cv-port-land  
**Base Commit:** `5d3b6eb0d05374da6d0c30ba16461e3bc623f41a`  
**Scope:** Diagnostics only — no code changes

---

## Executive Summary

This audit identifies architectural issues, code bloat, duplication, and SOLID violations in the frontend codebase. The codebase has **24,568 lines of TypeScript/TSX** across **137 source files**, with significant opportunities for consolidation and cleanup.

**Key Findings:**
- 🔴 **Duplicate filter logic** in `FilterContext.tsx` and `focusFilterManager.ts`
- 🔴 **Scattered inline translations** across 4+ components instead of centralized i18n
- 🔴 **Debug utilities shipped in production** with 54+ console statements
- 🟠 **Large monolithic files** — 10 files exceed 350 LOC
- 🟠 **Repeated section component patterns** with copy-paste logic
- 🟠 **Inconsistent state management** — mix of Context + custom events + localStorage

---

## A) Repository Structure and Module Map

### Frontend Root
```
/frontend
├── src/
│   ├── App.tsx                    # Main app with 9 nested providers
│   ├── main.tsx                   # Entry point
│   ├── components/                # 30+ components
│   │   ├── sections/              # 15 CV section components
│   │   └── ui/                    # 47 shadcn/ui primitive components
│   ├── context/                   # 6 React contexts
│   ├── hooks/                     # 8 custom hooks
│   ├── lib/                       # 8 utility modules
│   ├── utils/                     # 15 utility modules (⚠️ overlap with lib/)
│   ├── config/                    # 1 file (keyMappings.ts)
│   ├── constants/                 # 2 files
│   ├── data/                      # 3 locked JSON files
│   ├── styles/                    # 5 CSS files
│   └── types/                     # 1 type definition file
├── tests/                         # 11 test files
└── e2e/                           # End-to-end tests
```

### Module Inventory

| Directory | File Count | Total LOC | Primary Purpose |
|-----------|------------|-----------|-----------------|
| components/sections | 15 | ~4,100 | CV section rendering |
| components/ui | 47 | ~4,200 | Shadcn/ui primitives |
| components/ (root) | 30 | ~7,600 | Feature components |
| utils/ | 15 | ~2,500 | Data processing, validation |
| lib/ | 8 | ~1,100 | Language, theme, clipboard |
| context/ | 6 | ~450 | React state providers |
| hooks/ | 8 | ~350 | Custom React hooks |
| config + constants | 3 | ~800 | Key mappings, app constants |

### Dependency Shape (High-Level)

```
App.tsx
 ├── LanguageContext → lib/languageManager.ts → localStorage
 ├── CVDataContext → utils/dataLoader.ts → utils/dataNormalizer.ts
 │                                       → utils/dataValidator.ts
 │                                       → config/keyMappings.ts
 ├── FilterContext → constants/app.ts
 │   └── (DUPLICATE) lib/focusFilterManager.ts (parallel implementation)
 ├── KonamiContext, PWAContext, AccessibilityContext
 └── Section Components
     ├── Import from CVDataContext
     ├── Import from LanguageContext (translations)
     ├── Some use FilterContext (shouldShowEntry)
     └── Some use focusFilterManager (isVisibleWithFilter) ← INCONSISTENT
```

---

## B) Quantitative Bloat Signals

### Top 20 Largest Files (LOC)

| Rank | File | LOC | Description |
|------|------|-----|-------------|
| 1 | lib/i18n.ts | 1,449 | UI translations for EN/DE/FA |
| 2 | config/keyMappings.ts | 722 | JSON key mappings for normalization |
| 3 | components/ui/sidebar.tsx | 726 | Shadcn sidebar (generated) |
| 4 | components/ProjectCaseStudy.tsx | 543 | Case study modal component |
| 5 | components/SkillsVisualizationDashboard.tsx | 470 | Charts with Recharts |
| 6 | utils/dataValidator.ts | 468 | CV data validation |
| 7 | components/DownloadModal.tsx | 465 | PDF/JSON download modal |
| 8 | sections/WorkshopAndCertificationsSection.tsx | 423 | Certifications display |
| 9 | components/VideoPlayer.tsx | 413 | Custom video player |
| 10 | sections/PublicationsSection.tsx | 405 | Publications with filtering |
| 11 | utils/seo.ts | 402 | SEO meta tag management |
| 12 | sections/LanguagesSection.tsx | 390 | Language skills display |
| 13 | sections/ProjectsSection.tsx | 385 | Projects grid with filtering |
| 14 | components/TestimonialsSection.tsx | 383 | Testimonials carousel |
| 15 | utils/dataLoader.ts | 381 | Data loading & sanitization |
| 16 | utils/analytics.ts | 355 | Analytics tracking |
| 17 | components/ui/chart.tsx | 351 | Recharts wrapper (generated) |
| 18 | sections/ExperiencesSection.tsx | 350 | Work experience timeline |
| 19 | components/ArticlesSection.tsx | 311 | Articles listing |
| 20 | sections/EducationSection.tsx | 308 | Education cards |

### Top Files with Console Statements (Debug Bloat)

| File | Console Statements | Issue |
|------|-------------------|-------|
| utils/testNormalization.ts | 54 | Debug script shipped in src/ |
| utils/dataLoader.ts | 28 | Heavy logging in production code |
| utils/validateKeyMappings.ts | 26 | Debug script shipped in src/ |
| utils/extractActualKeys.ts | 25 | Debug script shipped in src/ |
| utils/performance.ts | 20 | Monitoring logs |
| context/CVDataContext.tsx | 20 | Debug logging in context |
| utils/debugDataFlow.ts | 19 | Debug utility auto-runs |
| utils/debugNormalizer.ts | 15 | Debug utility auto-runs |
| utils/dataNormalizer.ts | 10 | Debug logging in production |

**Total: 29 files contain console statements**

### Duplicate Code Detection

#### 1. Filter Logic Duplication (HIGH PRIORITY)

**Location 1:** `src/context/FilterContext.tsx` (lines 74-84)
```typescript
export function shouldShowEntry(typeKey: string[] | undefined | null, selectedFocus: string): boolean {
  if (!typeKey || typeKey.length === 0) return true
  if (selectedFocus === DEFAULT_VALUES.FOCUS || selectedFocus === 'Full CV') {
    return true
  }
  return typeKey.some(key => 
    key.toLowerCase().includes(selectedFocus.toLowerCase())
  )
}
```

**Location 2:** `src/lib/focusFilterManager.ts` (lines 116-125)
```typescript
export function isVisibleWithFilter(typeKeys: string[] | null | undefined, currentFilter: FocusFilter): boolean {
  if (currentFilter === 'Full CV') return true
  if (!typeKeys || !Array.isArray(typeKeys)) return false
  return typeKeys.includes(currentFilter)
}
```

**Impact:** Inconsistent behavior between sections. EducationSection and ReferencesSection use `shouldShowEntry`, while ExperiencesSection, SkillsSection, PublicationsSection, and WorkshopAndCertificationsSection use `isVisibleWithFilter`.

#### 2. Inline Translations Pattern (MEDIUM PRIORITY)

Components define their own translation objects instead of using centralized i18n:

| Component | Lines | Pattern |
|-----------|-------|---------|
| ProjectCaseStudy.tsx | 39-97 | `caseStudyTranslations = { en: {...}, de: {...}, fa: {...} }` |
| SkillsVisualizationDashboard.tsx | 50-93 | `chartTranslations = { en: {...}, de: {...}, fa: {...} }` |
| CookieConsentBanner.tsx | 24-56 | `consentTranslations = { en: {...}, de: {...}, fa: {...} }` |
| TestimonialsSection.tsx | 31-126 | `testimonialTranslations = { en: {...}, de: {...}, fa: {...} }` |

**Impact:** Translation strings are scattered, making maintenance difficult.

#### 3. Section Component Pattern Repetition

All section components follow this pattern with copy-paste variations:
1. Import hooks (useMemo, useState, useEffect)
2. Import CV data context
3. Get stored focus filter via different methods
4. Filter items with useMemo
5. Sort items with useMemo
6. Render empty state or grid

**Repeated useMemo chains across sections:**
- EducationSection.tsx: 4 useMemo calls
- ExperiencesSection.tsx: 4 useMemo calls
- ProjectsSection.tsx: 5 useMemo calls
- PublicationsSection.tsx: 7 useMemo calls
- SkillsSection.tsx: 2 useMemo calls
- WorkshopAndCertificationsSection.tsx: 2 useMemo calls

#### 4. Date Formatting Duplication

| Location | Function |
|----------|----------|
| utils/dataValidation.ts | `formatDateSafe()`, `formatDateRangeSafe()`, `parseDateSafe()` |
| lib/i18n.ts | `formatDate()`, `formatDateDisplay()`, `formatDateRange()` |
| sections/ExperiencesSection.tsx | `parseDuration()` (lines 19-60) — **custom inline implementation** |

---

## C) SOLID Principle Violations

### 1. Single Responsibility Principle (SRP) Violations

#### a) CVDataContext.tsx
**File:** `src/context/CVDataContext.tsx`  
**Lines:** 22-97  
**Issue:** Context does too much — loads data, logs debug info, validates structure.  
**Why it matters:** Hard to test, debug, and maintain; mixing concerns.  
**Recommendation:** Extract logging to a debug utility; keep context focused on state.

#### b) dataLoader.ts
**File:** `src/utils/dataLoader.ts`  
**Lines:** 36-140 (loadAndValidateData function)  
**Issue:** Single function handles loading, normalizing, logging, validating, and sanitizing.  
**Why it matters:** 400+ lines, hard to test individual steps.  
**Recommendation:** Create separate functions for each step; compose in a pipeline.

#### c) Section Components
**Files:** All sections/*.tsx  
**Issue:** Each section handles filtering, sorting, empty states, debug logging, AND rendering.  
**Why it matters:** Duplicate logic across 15 files.  
**Recommendation:** Extract filtering/sorting to a shared hook; use composition.

### 2. Open/Closed Principle (OCP) Violations

#### a) keyMappings.ts
**File:** `src/config/keyMappings.ts`  
**Lines:** 1-722  
**Issue:** Adding a new language requires modifying every key mapping object.  
**Why it matters:** Error-prone, brittle, prevents adding languages dynamically.  
**Recommendation:** Structure mappings as `{ en: {...}, de: {...}, fa: {...} }` at the top level.

#### b) focusFilterManager.ts
**File:** `src/lib/focusFilterManager.ts`  
**Lines:** 6, 14-40  
**Issue:** Focus filter options are hardcoded. Adding a new filter requires code changes.  
**Why it matters:** Filter options come from data but are duplicated as constants.  
**Recommendation:** Derive filter options from CV data dynamically.

### 3. Liskov Substitution Principle (LSP) Violations

#### a) Inconsistent type_key handling
**Files:** Multiple sections  
**Issue:** Some sections expect `string[]`, others handle `{name: string}[]`.  
**Evidence:**
- `dataLoader.ts` line 335: `sanitizeTypeKey()` handles both formats
- `PublicationsSection.tsx` line 204: Manual conversion of type_key objects

**Why it matters:** Components can't reliably consume type_key without defensive code.  
**Recommendation:** Normalize type_key format in dataLoader; ensure consistent type.

### 4. Interface Segregation Principle (ISP) Violations

#### a) CVData type is monolithic
**File:** `src/types/cv.ts`  
**Lines:** 1-307  
**Issue:** All components import the entire CVData type even if they only need one section.  
**Why it matters:** Poor tree-shaking, tight coupling.  
**Recommendation:** Export individual section types; import only what's needed.

#### b) i18n.ts exports giant UIStrings interface
**File:** `src/lib/i18n.ts`  
**Lines:** 9-260 (UIStrings interface)  
**Issue:** Components import entire UIStrings even for 2-3 keys.  
**Why it matters:** Tight coupling, refactoring difficulty.  
**Recommendation:** Allow accessing translation keys by path string.

### 5. Dependency Inversion Principle (DIP) Violations

#### a) Direct JSON imports
**Files:** `dataLoader.ts`, `debugNormalizer.ts`, `testNormalization.ts`  
**Issue:** Utils directly import `@/data/cv.json` etc. instead of receiving data as parameters.  
**Why it matters:** Can't test with mock data; tied to file structure.  
**Recommendation:** Pass raw data as parameters; let caller handle loading.

#### b) focusFilterManager uses window.dispatchEvent
**File:** `src/lib/focusFilterManager.ts`  
**Lines:** 86  
**Issue:** Module dispatches custom events directly to window.  
**Why it matters:** Components mix Context-based and event-based state updates.  
**Recommendation:** Use only React Context for filter state; remove custom events.

---

## D) Component Design System Diagnosis

### Current Architecture vs. Professional Layered Model

| Layer | Expected | Actual Status |
|-------|----------|---------------|
| **Primitives** | Typography, Button, Card, Stack/Grid | ✅ Present in ui/ (shadcn) |
| **Composites** | SectionHeader, EntryCard, FilterBar | ⚠️ Missing; logic duplicated in each section |
| **Sections** | EducationSection, ExperiencesSection | ⚠️ Present but bloated with duplicate logic |
| **Views/Pages** | CvPage, SettingsPage | ❌ Missing; App.tsx handles everything |
| **Providers** | Data, Language, Filter | ⚠️ Present but redundant (focusFilterManager) |

### Missing Abstractions

1. **SectionWrapper** — common section container with heading, icon, empty state
2. **FilterableList** — reusable filtered/sorted list with useMemo optimization
3. **EntryCard** — unified card component for education, experience, project entries
4. **DateRangeBadge** — standardized date display component
5. **TypeKeyBadges** — standardized type_key badge rendering

### Duplicated Patterns

All section components repeat:
```tsx
// Empty state check
if (data.length === 0) {
  return (
    <section id="..." className="py-16 ...">
      <Icon />
      <h2>{t.sections.xxx}</h2>
      <p>{t.empty.no_xxx}</p>
    </section>
  )
}

// Full render with filtering
return (
  <section id="..." className="...">
    <div className="container max-w-...">
      <h2>...</h2>
      <Separator />
      {filteredData.map(...)}
    </div>
  </section>
)
```

### Inconsistent Component Patterns

| Component | Filter Source | Filter Function | State Management |
|-----------|--------------|-----------------|------------------|
| EducationSection | useFilter() | shouldShowEntry | Context |
| ExperiencesSection | getStoredFocusFilter() | isVisibleWithFilter | useState + useEffect |
| ProjectsSection | None (internal only) | local filtering | useState |
| PublicationsSection | getStoredFocusFilter() | isVisibleWithFilter | useState + useEffect |
| SkillsSection | getStoredFocusFilter() | isVisibleWithFilter | useState + useEffect |
| WorkshopSection | getStoredFocusFilter() | isVisibleWithFilter | useState + useEffect |
| ReferencesSection | useFilter() | shouldShowEntry | Context |

---

## E) State/Data Flow Audit

### Language/Data Loading Flow

```
1. main.tsx: initializeLanguage() — sets document lang/dir
2. LanguageContext.Provider: detectInitialLanguage() — URL → localStorage → browser
3. CVDataContext.Provider: loadAndValidateData(language) — on language change
   3.1. loadCVDataForLanguage() — imports JSON
   3.2. normalizeCVData() — converts DE/FA keys to EN
   3.3. DataValidator.validate() — checks structure
   3.4. sanitizeData() — cleans nulls, dedupes
4. Components: useCVData() — access normalized data
```

### Global State Management

| State | Location | Persistence | Update Method |
|-------|----------|-------------|---------------|
| Language | LanguageContext | localStorage | setLanguage() |
| Theme | themeManager.ts | localStorage | setTheme() |
| Focus Filter | FilterContext | localStorage | setSelectedFocus() |
| Focus Filter (dup) | focusFilterManager.ts | localStorage | setFocusFilter() |
| Konami Unlock | KonamiContext | session | state |
| PWA Status | PWAContext | n/a | native APIs |
| Accessibility | AccessibilityContext | localStorage | state |
| Sound Settings | SoundEffects.tsx | localStorage | local state |
| Analytics Consent | CookieConsentBanner | localStorage | local state |

### Anti-Patterns Identified

#### 1. Heavy Work in Context Provider
**Location:** `CVDataContext.tsx` lines 25-90  
**Issue:** useMemo contains 60+ lines of logging and validation.  
**Impact:** Slows renders; pollutes console; hard to debug.

#### 2. Custom Events for State Sync
**Location:** `focusFilterManager.ts` line 86  
```typescript
window.dispatchEvent(new CustomEvent('focusFilterChange', { detail: { filter } }))
```
**Location:** Components subscribe with useEffect:
```typescript
window.addEventListener('focusFilterChange', handleFilterChange)
```
**Issue:** Bypasses React state; causes render inconsistencies.

#### 3. Debug Code Auto-Runs in Production
**Location:** `debugNormalizer.ts` lines 94-99
```typescript
if (import.meta.env.DEV) {
  console.log('🚀 Running normalization diagnostics...')
  diagnoseNormalization('en')
  diagnoseNormalization('de')
  diagnoseNormalization('fa')
}
```
**Issue:** This runs on every module load in dev, adding noise.

#### 4. localStorage Scattered Across Codebase
29 direct localStorage access points across 10+ files. No unified storage layer.

#### 5. Unbounded Re-renders Risk
**Location:** `App.tsx` lines 86-98
```typescript
useEffect(() => {
  ...
  const focusOptions = extractAllTypeKeys(data)
  setAvailableFocusOptions(focusOptions)
}, [data, errors, warnings, setAvailableFocusOptions])
```
**Issue:** setAvailableFocusOptions in deps can cause loops if not memoized.

---

## F) Refactor Plan

### Phase 1: No-Regret Low-Risk Cleanups

| Action | Effort | Risk | Impact | Acceptance Criteria |
|--------|--------|------|--------|---------------------|
| Move debug utils to scripts/ folder | S | Low | Med | testNormalization.ts, debugNormalizer.ts, validateKeyMappings.ts, extractActualKeys.ts not in src/ |
| Remove/guard console statements | S | Low | Med | No console.log in production bundle |
| Delete duplicate focusFilterManager.ts | S | Low | High | Only FilterContext used for focus state |
| Consolidate inline translations to i18n.ts | M | Low | Med | No component-local translation objects |
| Unify date formatting to i18n.ts | S | Low | Med | Single date formatting source |
| Extract parseDuration from ExperiencesSection | S | Low | Low | Function in utils/dataValidation.ts |

### Phase 2: Structural Re-Architecture

| Action | Effort | Risk | Impact | Acceptance Criteria |
|--------|--------|------|--------|---------------------|
| Create SectionWrapper component | M | Med | High | Sections use common wrapper for heading, icon, empty state |
| Create useFilteredData hook | M | Med | High | Sections import hook instead of inline useMemo chains |
| Create EntryCard composite component | M | Med | Med | Education, Experience, Project cards share base |
| Unify type_key format | M | Med | High | All type_key are string[] after normalization |
| Remove window event subscriptions | M | Med | Med | All filter state via React Context |
| Create storage abstraction layer | M | Low | Med | Single util for localStorage access |

### Phase 3: Optional Improvements

| Action | Effort | Risk | Impact | Acceptance Criteria |
|--------|--------|------|--------|---------------------|
| Extract PageLayout component | M | Low | Med | App.tsx cleaner; routing-ready |
| Design token consolidation | L | Med | Med | CSS variables unified across theme.css, themes.css |
| Key mappings restructure for extensibility | L | Med | Low | Adding language doesn't require editing every object |
| Component library documentation | L | Low | Low | Storybook or similar for ui/ components |

---

## G) Guardrails to Prevent Relapse

### Lint Rules

```json
// eslint.config.js additions
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "max-lines": ["warn", { "max": 400, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["warn", { "max": 80 }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### File Size Limits

- **Hard limit:** 500 LOC per file (excluding ui/ generated components)
- **Warning at:** 300 LOC
- **Note:** ui/ components (sidebar.tsx, chart.tsx, etc.) are generated by shadcn and are excluded from limits. However, if customizing them significantly, consider splitting into smaller modules.

### Component Conventions

1. **Sections** must use SectionWrapper (once created)
2. **Filtering logic** must use useFilteredData hook (once created)
3. **Translations** must be in lib/i18n.ts — no inline translation objects
4. **Date formatting** must use lib/i18n.ts formatDate functions

### Folder Conventions

```
src/
├── components/
│   ├── ui/           # Primitives (shadcn, auto-generated)
│   ├── composites/   # Shared compound components (NEW)
│   ├── sections/     # CV sections (use composites)
│   └── features/     # Feature-specific components (NEW)
├── hooks/            # Custom React hooks
├── context/          # React contexts only
├── lib/              # Utilities (no React, no side effects)
├── utils/            # DEPRECATED → merge into lib/
├── config/           # Configuration objects
├── constants/        # Constant values
├── types/            # TypeScript types
└── styles/           # CSS files
```

### PR Checklist Items

- [ ] No new console.log statements (except guarded by DEV check)
- [ ] No inline translation objects
- [ ] No direct localStorage access (use storage util)
- [ ] New sections use SectionWrapper
- [ ] New filtering uses useFilteredData hook
- [ ] File does not exceed 400 LOC

---

## Out-of-Scope Checks

### Unused Files/Components

| File | Status | Evidence |
|------|--------|----------|
| utils/testNormalization.ts | Unused in app | Only CLI script; should be in scripts/ |
| utils/debugNormalizer.ts | Debug only | Auto-runs in dev; no exports used |
| utils/validateKeyMappings.ts | Unused in app | Only CLI script |
| utils/extractActualKeys.ts | Unused in app | Only CLI script |
| lib/cv-data.ts | Partially deprecated | getCVData() marked deprecated, still has helpers |
| utils/debugDataFlow.ts | Import used | validateCVDataStructure used in dataLoader |

### Dead Code Paths

1. `lib/cv-data.ts`: `getCVData()`, `getBasics()`, `getProfiles()`, `getProfilePhotoUrl()`, `getCoverPhotoUrl()` — all deprecated with console.warn
2. `focusFilterManager.ts`: Entire file duplicates FilterContext functionality

### Inconsistent Naming

| Pattern A | Pattern B | Files |
|-----------|-----------|-------|
| `camelCase` filenames | `kebab-case` filenames | hooks/ uses kebab, utils/ uses camelCase |
| `useXxx` hooks | Non-hook functions in same files | lib/i18n.ts exports both hooks and utils |

### Inconsistent Styling Approach

- **index.css:** Tailwind utilities + custom CSS
- **theme.css, themes.css:** CSS custom properties (some overlap)
- **rtl.css:** RTL-specific overrides
- **print.css:** Print styles
- **interactions.css:** Animation utilities
- **Components:** Tailwind classes + cn() utility

No CSS modules used. Styling is 100% utility-first Tailwind + raw CSS.

### Missing Tests

| Area | Status |
|------|--------|
| FilterContext.tsx | No unit tests |
| focusFilterManager.ts | No unit tests |
| Section filtering logic | No unit tests |
| dataLoader sanitization | No unit tests |
| Component empty states | No unit tests |

---

## Self-Overseer Checklist

- [x] Report contains evidence and specific file references
- [x] Refactor plan is phased, prioritized, and minimal (no rewrite)
- [x] JSON summary exists and matches the markdown report
- [x] Locked files (src/data/*.json) are unchanged

---

## Appendix: File Inventory

### All Files Over 200 LOC

| File | LOC |
|------|-----|
| lib/i18n.ts | 1,449 |
| components/ui/sidebar.tsx | 726 |
| config/keyMappings.ts | 722 |
| components/ProjectCaseStudy.tsx | 543 |
| components/SkillsVisualizationDashboard.tsx | 470 |
| utils/dataValidator.ts | 468 |
| components/DownloadModal.tsx | 465 |
| sections/WorkshopAndCertificationsSection.tsx | 423 |
| components/VideoPlayer.tsx | 413 |
| sections/PublicationsSection.tsx | 405 |
| utils/seo.ts | 402 |
| sections/LanguagesSection.tsx | 390 |
| sections/ProjectsSection.tsx | 385 |
| components/TestimonialsSection.tsx | 383 |
| utils/dataLoader.ts | 381 |
| utils/analytics.ts | 355 |
| components/ui/chart.tsx | 351 |
| sections/ExperiencesSection.tsx | 350 |
| components/ArticlesSection.tsx | 311 |
| sections/EducationSection.tsx | 308 |
| types/cv.ts | 307 |
| utils/dataNormalizer.ts | 304 |
| components/ContactForm.tsx | 295 |
| components/BookingWidget.tsx | 278 |
| components/ui/menubar.tsx | 276 |
| sections/SkillsSection.tsx | 276 |
| components/SkillsCarousel.tsx | 267 |
| context/LanguageContext.tsx | 259 |
| components/ui/dropdown-menu.tsx | 259 |
| components/MediaModal.tsx | 259 |
| sections/BasicsSection.tsx | 258 |
| components/SoundEffects.tsx | 258 |
| components/ui/context-menu.tsx | 254 |
| components/ui/carousel.tsx | 242 |
| components/Timeline.tsx | 239 |
| App.tsx | 232 |
| components/ui/skeleton.tsx | 231 |
| components/LanguageCarousel.tsx | 227 |
| components/MicroFeedback.tsx | 223 |
