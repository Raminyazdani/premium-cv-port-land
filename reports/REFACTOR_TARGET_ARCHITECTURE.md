# Refactor Target Architecture Proposal

**Report Version:** 1.0  
**Generated:** 2026-01-02  
**Repository:** premium-cv-port-land  
**Report Type:** REPORT-ONLY (No code modifications made)

---

## Table of Contents

1. [Design Goals](#design-goals)
2. [Current Pain Points](#current-pain-points)
3. [Target Architecture Diagram](#target-architecture-diagram)
4. [Proposed Directory Tree](#proposed-directory-tree)
5. [Module Boundary Rules](#module-boundary-rules)
6. [Naming Conventions](#naming-conventions)
7. [i18n + RTL Strategy](#i18n--rtl-strategy)
8. [Migration Strategy Notes](#migration-strategy-notes)
9. [Risks & Mitigations](#risks--mitigations)
10. [Unknowns + Verification Steps](#unknowns--verification-steps)
11. [Self-Audit](#self-audit)

---

## Design Goals

The target architecture aims to achieve:

1. **Modular Separation of Concerns**
   - Clear boundaries between UI primitives, feature modules, data layer, and i18n layer
   - Each module should have a single, well-defined responsibility

2. **Type-Safe Data Flow**
   - Eliminate `any` usage in data normalization layer
   - Use TypeScript generics and type guards for robust data handling
   - Create strongly-typed view models for components

3. **Scalable i18n Architecture**
   - Split monolithic i18n file (~2001 LOC) into language-specific modules
   - Support EN/DE/FA with proper RTL handling baked into architecture
   - Type-safe translation keys with compile-time checking

4. **Reduced Duplication**
   - Extract repeated patterns (domain normalization, filtering, date handling)
   - Create shared utilities and hooks for cross-cutting concerns
   - Standardize empty state, loading state, and error state patterns

5. **Testability**
   - Each layer should be testable in isolation
   - Clear dependency injection patterns for mocking
   - Separation of business logic from rendering logic

6. **File Size Management**
   - No single file should exceed 400 LOC (excluding auto-generated code)
   - Large components should be split into smaller, focused sub-components
   - Config files should be generated or split logically

7. **Progressive Enhancement**
   - Architecture should support lazy loading by feature/section
   - Future-proof for potential SSR adoption
   - Support for offline-first PWA patterns

8. **Accessibility-First Design**
   - A11y patterns baked into base components
   - RTL support as first-class citizen
   - Consistent focus management and keyboard navigation

---

## Current Pain Points

### 2.1 Monolithic i18n File

**Symptom:** Single file with ~2001 LOC containing all translations and formatting utilities.

**Root Cause:** All translations inline in a single `translations` object.

**Where:** `frontend/src/lib/i18n.ts:L1-L2001`

**Evidence:**
```typescript
// frontend/src/lib/i18n.ts contains:
// - UIStrings interface (~450 keys)
// - EN translations (L458-L843)
// - DE translations (L844-L1230)
// - FA translations (L1231-L1620)
// - Formatting utilities (L1621-L2001)
```

**Impact:**
- Hard to maintain translations (3x duplicated structure)
- Slow code review for translation changes
- No separation between UI strings and CV content keys

---

### 2.2 Pervasive `any` Usage in Data Layer

**Symptom:** 22+ `any` occurrences in data normalization, undermining type safety.

**Root Cause:** Dynamic JSON data from multiple languages with different key structures.

**Where:** `frontend/src/utils/dataNormalizer.ts:L40-L300`

**Evidence:**
```typescript
// frontend/src/utils/dataNormalizer.ts:L40-L48
export function normalizeCVData(rawData: any, sourceLang: Language): CVData {
  // ...
  const normalized: any = {}
```

**Impact:**
- Type errors not caught at compile time
- IDE autocompletion degraded
- Runtime errors from unexpected data shapes

---

### 2.3 Deep Provider Nesting (8 Levels)

**Symptom:** App component has 8 nested context providers.

**Root Cause:** Feature-by-feature provider additions without consolidation.

**Where:** `frontend/src/App.tsx:L202-L224`

**Evidence:**
```tsx
<LanguageProvider>
  <CVDataProvider>
    <FilterProvider>
      <KonamiProvider>
        <PWAProvider>
          <AccessibilityProvider>
            <SoundEffectsProvider>
              <MicroFeedbackProvider>
                <AppContent />
              </MicroFeedbackProvider>
            </SoundEffectsProvider>
          </AccessibilityProvider>
        </PWAProvider>
      </KonamiProvider>
    </FilterProvider>
  </CVDataProvider>
</LanguageProvider>
```

**Impact:**
- Performance concerns from re-render cascades
- Testing complexity
- Difficult to understand context dependencies

---

### 2.4 Duplicated Domain Filtering Logic

**Symptom:** Domain/category normalization repeated 3+ times in same component.

**Root Cause:** Pattern not extracted to utility.

**Where:** `frontend/src/components/sections/ProjectsSection.tsx:L34-L47`, L164-L179, L202-L215

**Evidence:**
```typescript
// Repeated logic for domain normalization
const normalized = key.toLowerCase()
if (normalized === 'programming') domains.add('Programming')
else if (normalized === 'bioinformatics') domains.add('Bioinformatics')
// ... etc.
```

**Impact:**
- Bug fixes must be applied in multiple places
- Increased component LOC
- Inconsistent behavior risk

---

### 2.5 Large Section Components (250-400+ LOC)

**Symptom:** Section components mix data fetching, filtering, formatting, and rendering.

**Root Cause:** All logic placed in component body rather than extracted hooks.

**Where:**
- `frontend/src/components/sections/WorkshopAndCertificationsSection.tsx` (412 LOC)
- `frontend/src/components/sections/PublicationsSection.tsx` (393 LOC)
- `frontend/src/components/sections/LanguagesSection.tsx` (392 LOC)
- `frontend/src/components/sections/ProjectsSection.tsx` (384 LOC)
- `frontend/src/components/sections/ExperiencesSection.tsx` (337 LOC)

**Impact:**
- Hard to test individual concerns
- Difficult to reuse logic
- Long code review cycles

---

### 2.6 Mixed Responsibilities in LanguageContext

**Symptom:** Single context handles language state, DOM manipulation, translations, and formatters.

**Root Cause:** Incremental feature additions.

**Where:** `frontend/src/context/LanguageContext.tsx` (271 LOC)

**Evidence:**
- Language state management (L14-L114)
- DOM attribute manipulation (L59-L73)
- Translation hook `useTranslation` (L144-L147)
- Formatters hook `useFormatters` (L175-L259)
- Skill category label hook (L267-L271)

**Impact:**
- SRP violation
- Testing requires mocking multiple concerns
- Changes to formatting may affect language switching

---

### 2.7 Inconsistent Empty State Patterns

**Symptom:** Each section implements its own empty state rendering.

**Root Cause:** SectionWrapper empty state isn't consistently used.

**Where:**
- `ExperiencesSection.tsx:L223-L241` - Custom Card empty state
- `ProjectsSection.tsx:L254-L272` - Different Card layout
- `SkillsSection.tsx:L103-L105` - Returns null
- `EducationSection.tsx:L256-L267` - Filter empty state

**Impact:**
- Inconsistent UX
- Repeated boilerplate
- Harder to update styling globally

---

### 2.8 Hardcoded English Strings

**Symptom:** English fallback strings scattered across components.

**Root Cause:** Quick fixes without i18n integration.

**Where:**
- `ExperiencesSection.tsx:L93` - `'Untitled Role'`
- `ProjectsSection.tsx:L28` - `'Untitled Project'`
- `EducationSection.tsx:L37` - `'Unknown Institution'`
- `ProjectsSection.tsx:L38-L44` - Domain labels (Programming, Academic, etc.)
- `ReferencesSection.tsx:L187-L194` - Hardcoded headings and privacy notes

**Impact:**
- i18n incomplete for non-English users
- Poor UX for edge cases
- Inconsistent localization

---

## Target Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application Shell                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           Provider Layer                                │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │ AppProviders (consolidated: Core | Features | UX)                 │  │ │
│  │  │  - LanguageProvider (state only)                                  │  │ │
│  │  │  - CVDataProvider                                                 │  │ │
│  │  │  - FilterProvider                                                 │  │ │
│  │  │  - AccessibilityProvider                                          │  │ │
│  │  │  - PWAProvider                                                    │  │ │
│  │  │  - UXProvider (consolidated: Konami, Sound, Feedback)             │  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Layer Architecture                              │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   UI Primitives     │  │   Feature Modules   │  │   Data Layer        │  │
│  │   (/ui)             │  │   (/features)       │  │   (/data)           │  │
│  │                     │  │                     │  │                     │  │
│  │  • Button, Card     │  │  • cv-sections/     │  │  • loaders/         │  │
│  │  • Badge, Avatar    │  │    - Education      │  │  • normalizers/     │  │
│  │  • Input, Form      │  │    - Experience     │  │  • validators/      │  │
│  │  • Dialog, Sheet    │  │    - Skills         │  │  • sanitizers/      │  │
│  │  • Carousel, Tabs   │  │    - Projects       │  │  • types/           │  │
│  │  • etc (47 items)   │  │    - Publications   │  │  • view-models/     │  │
│  │                     │  │    - etc.           │  │                     │  │
│  │  Zero business      │  │                     │  │  Language-agnostic  │  │
│  │  logic              │  │  • header/          │  │  data processing    │  │
│  │                     │  │  • footer/          │  │                     │  │
│  │                     │  │  • hero/            │  │                     │  │
│  │                     │  │                     │  │                     │  │
│  │                     │  │  • shared/          │  │                     │  │
│  │                     │  │    - SectionWrapper │  │                     │  │
│  │                     │  │    - EmptyState     │  │                     │  │
│  │                     │  │    - FilterBar      │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                      │                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   i18n Layer        │  │   Shared Hooks      │  │   Utilities         │  │
│  │   (/i18n)           │  │   (/hooks)          │  │   (/utils)          │  │
│  │                     │  │                     │  │                     │  │
│  │  • translations/    │  │  • useLanguage      │  │  • date-utils       │  │
│  │    - en.json        │  │  • useTranslation   │  │  • domain-utils     │  │
│  │    - de.json        │  │  • useFormatters    │  │  • string-utils     │  │
│  │    - fa.json        │  │  • useFilteredData  │  │  • type-guards      │  │
│  │  • formatters/      │  │  • useSection       │  │  • seo              │  │
│  │    - date           │  │  • useMediaQuery    │  │  • analytics        │  │
│  │    - number         │  │  • useReducedMotion │  │                     │  │
│  │    - list           │  │  • useFocusTrap     │  │                     │  │
│  │  • pluralization/   │  │                     │  │                     │  │
│  │  • key-types.ts     │  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           Context Layer                                 │ │
│  │  (/context)                                                             │ │
│  │                                                                         │ │
│  │  • LanguageContext     (state + persistence only)                       │ │
│  │  • CVDataContext       (data loading + validation state)                │ │
│  │  • FilterContext       (filter state only)                              │ │
│  │  • AccessibilityContext (a11y preferences)                              │ │
│  │  • PWAContext          (install/offline state)                          │ │
│  │  • UXContext           (consolidated: konami, sound, feedback)          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow (Normalized)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          Data Loading Flow                                 │
│                                                                            │
│   JSON Files (Static)      ──►   Loader          ──►   Normalizer         │
│   ┌──────────────────┐          ┌───────────────┐     ┌───────────────┐   │
│   │ cv.json (EN)     │          │ loadCVData()  │     │ normalize()   │   │
│   │ ramin_de.json    │   ──►    │ - selects     │ ──► │ - maps keys   │   │
│   │ ramin_fa.json    │          │   by language │     │ - uses types  │   │
│   └──────────────────┘          └───────────────┘     └───────────────┘   │
│                                                               │            │
│                                                               ▼            │
│   ┌───────────────┐      ┌───────────────┐      ┌───────────────────┐     │
│   │  Validator    │  ◄── │  Sanitizer    │  ◄── │  Type-safe CVData │     │
│   │  - errors     │      │  - dedupe     │      │  (canonical EN)   │     │
│   │  - warnings   │      │  - dates      │      └───────────────────┘     │
│   └───────────────┘      │  - type_key   │               │                │
│          │               └───────────────┘               │                │
│          ▼                                               ▼                │
│   ┌───────────────────────────────────────────────────────────────┐       │
│   │                  CVDataContext.Provider                        │       │
│   │   { data: CVData, isValid: boolean, errors, warnings }         │       │
│   └───────────────────────────────────────────────────────────────┘       │
│                                    │                                       │
│                                    ▼                                       │
│   ┌───────────────────────────────────────────────────────────────┐       │
│   │                 Section Components                             │       │
│   │   useCV() → useFilteredData() → View Model → Render            │       │
│   └───────────────────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Proposed Directory Tree

```
frontend/
├── src/
│   ├── app/                          # Application shell
│   │   ├── App.tsx                   # Main app component (slim)
│   │   ├── AppProviders.tsx          # Consolidated providers
│   │   └── AppContent.tsx            # Main content with sections
│   │
│   ├── components/
│   │   └── ui/                       # UI Primitives (existing 47 components)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── ... (existing shadcn/ui components)
│   │
│   ├── features/                     # Feature modules (NEW)
│   │   ├── cv-sections/              # CV section features
│   │   │   ├── education/
│   │   │   │   ├── EducationSection.tsx
│   │   │   │   ├── EducationCard.tsx
│   │   │   │   ├── useEducationData.ts
│   │   │   │   └── index.ts
│   │   │   ├── experience/
│   │   │   │   ├── ExperiencesSection.tsx
│   │   │   │   ├── ExperienceCard.tsx
│   │   │   │   ├── useExperienceData.ts
│   │   │   │   └── index.ts
│   │   │   ├── skills/
│   │   │   │   ├── SkillsSection.tsx
│   │   │   │   ├── SkillsVisualization/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── RadarChart.tsx
│   │   │   │   │   └── TreeMap.tsx
│   │   │   │   ├── useSkillsData.ts
│   │   │   │   └── index.ts
│   │   │   ├── projects/
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectCaseStudy/
│   │   │   │   │   ├── CaseStudy.tsx
│   │   │   │   │   ├── Gallery.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── useProjectsData.ts
│   │   │   │   └── index.ts
│   │   │   ├── publications/
│   │   │   ├── languages-spoken/
│   │   │   ├── certifications/
│   │   │   ├── references/
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroAvatar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── footer/
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── contact/
│   │   │   ├── ContactSection.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── useContactForm.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── download/
│   │   │   ├── DownloadModal.tsx
│   │   │   ├── PDFGenerator.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── shared/                   # Shared feature components
│   │       ├── SectionWrapper.tsx
│   │       ├── EmptyState.tsx
│   │       ├── FilterBar.tsx
│   │       ├── TagFilter.tsx
│   │       ├── SectionSkeleton.tsx
│   │       └── index.ts
│   │
│   ├── data/                         # Data layer (NEW structure)
│   │   ├── sources/                  # JSON files (existing, locked)
│   │   │   ├── cv.json
│   │   │   ├── ramin_de.json
│   │   │   └── ramin_fa.json
│   │   ├── loaders/
│   │   │   ├── cvDataLoader.ts       # Load JSON by language
│   │   │   └── index.ts
│   │   ├── normalizers/
│   │   │   ├── cvNormalizer.ts       # Main normalizer
│   │   │   ├── sectionNormalizers/   # Per-section normalizers
│   │   │   │   ├── basicsNormalizer.ts
│   │   │   │   ├── educationNormalizer.ts
│   │   │   │   ├── experienceNormalizer.ts
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   ├── validators/
│   │   │   ├── cvValidator.ts
│   │   │   ├── sectionValidators/
│   │   │   └── index.ts
│   │   ├── sanitizers/
│   │   │   ├── dateSanitizer.ts
│   │   │   ├── deduplicator.ts
│   │   │   ├── typeKeySanitizer.ts
│   │   │   └── index.ts
│   │   ├── view-models/              # Typed view models for components
│   │   │   ├── EducationViewModel.ts
│   │   │   ├── ExperienceViewModel.ts
│   │   │   └── ...
│   │   ├── types/
│   │   │   ├── cv.ts                 # CVData types (existing)
│   │   │   ├── raw-data.ts           # Raw JSON types
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── i18n/                         # i18n layer (NEW structure)
│   │   ├── translations/
│   │   │   ├── en.json               # English UI strings
│   │   │   ├── de.json               # German UI strings
│   │   │   └── fa.json               # Persian UI strings
│   │   ├── formatters/
│   │   │   ├── dateFormatter.ts
│   │   │   ├── numberFormatter.ts
│   │   │   ├── listFormatter.ts
│   │   │   └── index.ts
│   │   ├── pluralization/
│   │   │   ├── rules.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useTranslation.ts
│   │   │   ├── useFormatters.ts
│   │   │   └── useT.ts               # Key-based translation accessor
│   │   ├── types/
│   │   │   └── i18n.types.ts         # Generated translation key types
│   │   └── index.ts
│   │
│   ├── context/                      # React contexts (simplified)
│   │   ├── LanguageContext.tsx       # Language state only (~50 LOC)
│   │   ├── CVDataContext.tsx         # Data loading state
│   │   ├── FilterContext.tsx         # Filter state (move utility to utils)
│   │   ├── AccessibilityContext.tsx
│   │   ├── PWAContext.tsx
│   │   ├── UXContext.tsx             # Consolidated (Konami, Sound, Feedback)
│   │   └── index.ts
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── use-language.ts           # Re-export from context
│   │   ├── use-translation.ts        # Re-export from i18n
│   │   ├── use-formatters.ts         # Re-export from i18n
│   │   ├── use-filtered-data.ts
│   │   ├── use-section.ts            # Generic section data hook
│   │   ├── use-media-query.ts
│   │   ├── use-reduced-motion.ts     # Extracted from inline window calls
│   │   ├── use-focus-trap.ts
│   │   └── index.ts
│   │
│   ├── utils/                        # Pure utilities
│   │   ├── date-utils.ts             # Centralized date handling
│   │   ├── domain-utils.ts           # Domain normalization (extracted)
│   │   ├── string-utils.ts
│   │   ├── type-guards.ts            # Type narrowing utilities
│   │   ├── seo.ts
│   │   ├── analytics.ts
│   │   └── index.ts
│   │
│   ├── config/                       # Configuration
│   │   ├── keyMappings/              # Split large mapping file
│   │   │   ├── sectionKeys.ts
│   │   │   ├── basicsKeys.ts
│   │   │   ├── educationKeys.ts
│   │   │   └── index.ts
│   │   ├── skillCategoryMappings.ts
│   │   ├── app.config.ts
│   │   └── index.ts
│   │
│   ├── styles/                       # Stylesheets (existing)
│   │   ├── theme.css
│   │   ├── themes.css
│   │   ├── rtl.css
│   │   ├── print.css
│   │   └── interactions.css
│   │
│   └── lib/                          # External library wrappers
│       ├── utils.ts                  # cn() helper
│       ├── logger.ts
│       └── clipboard.ts
│
├── tests/                            # Test files (existing, expanded)
│   ├── unit/
│   │   ├── data/
│   │   │   ├── normalizers/
│   │   │   ├── validators/
│   │   │   └── sanitizers/
│   │   ├── i18n/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/
│   │   ├── data-flow.test.ts
│   │   ├── filter-flow.test.tsx
│   │   └── language-switching.test.tsx
│   ├── components/
│   │   ├── sections/
│   │   └── ui/
│   └── e2e/
│
└── package.json
```

### Key Changes from Current Structure

| Current | Proposed | Rationale |
|---------|----------|-----------|
| `components/sections/*.tsx` (15 files, 250-400 LOC each) | `features/cv-sections/{section}/` with extracted hooks | SRP, testability |
| `components/*.tsx` (28 feature files) | `features/{domain}/` organized by feature | Feature-based organization |
| `lib/i18n.ts` (2001 LOC) | `i18n/translations/*.json` + `i18n/formatters/` + `i18n/hooks/` | Maintainability, scalability |
| `utils/dataNormalizer.ts` | `data/normalizers/{section}Normalizer.ts` | Type safety, single responsibility |
| `context/LanguageContext.tsx` (271 LOC) | `context/LanguageContext.tsx` (~50 LOC) + `i18n/hooks/` | SRP |
| `data/*.json` in src | `data/sources/*.json` | Clear data layer boundary |
| `config/keyMappings.ts` (873 LOC) | `config/keyMappings/{category}Keys.ts` | Maintainability |

---

## Module Boundary Rules

### 5.1 Layer Import Rules

```
┌─────────────────────────────────────────────────────────────────┐
│                    Import Dependency Rules                       │
│                                                                  │
│   Layer                    Can Import From                       │
│   ─────                    ───────────────                       │
│   app/                     All layers                            │
│   features/                components/ui/, hooks/, utils/,       │
│                           data/view-models/, i18n/hooks/,        │
│                           context/                               │
│   components/ui/           utils/, lib/, types only              │
│   hooks/                   context/, utils/, types               │
│   context/                 data/, i18n/, utils/, types           │
│   data/                    config/, types/, lib/ only            │
│   i18n/                    types/, lib/ only                     │
│   utils/                   types/, lib/ only                     │
│   config/                  types/ only                           │
│   lib/                     None (pure utilities)                 │
│   types/                   None (pure types)                     │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Forbidden Imports

| From | Cannot Import |
|------|---------------|
| `components/ui/` | `features/`, `context/`, `data/` |
| `data/` | `components/`, `features/`, `context/`, `hooks/` |
| `i18n/` | `components/`, `features/`, `context/`, `data/` |
| `utils/` | `components/`, `features/`, `context/`, `hooks/` |
| `config/` | Everything except `types/` |

### 5.3 Feature Module Rules

1. **Barrel Exports**: Each feature module must have an `index.ts` exporting public API
2. **No Cross-Feature Imports**: Features cannot import from sibling features directly
3. **Shared Via Hooks**: Cross-cutting logic goes in `hooks/` or `features/shared/`
4. **Lazy Loading**: Feature sections should be lazy-loadable via `React.lazy()`

### 5.4 ESLint Enforcement (Recommended)

```javascript
// eslint.config.js addition
{
  rules: {
    'import/no-restricted-paths': ['error', {
      zones: [
        // UI components cannot import from features
        {
          target: './src/components/ui',
          from: './src/features',
          message: 'UI components cannot depend on features'
        },
        // Data layer cannot import from UI
        {
          target: './src/data',
          from: './src/components',
          message: 'Data layer cannot depend on UI'
        },
        // etc.
      ]
    }]
  }
}
```

---

## Naming Conventions

### 6.1 File Naming

| Category | Convention | Example |
|----------|------------|---------|
| Components (React) | PascalCase | `EducationSection.tsx`, `ProjectCard.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-filtered-data.ts`, `use-formatters.ts` |
| Utilities | kebab-case | `date-utils.ts`, `domain-utils.ts` |
| Types | kebab-case with `.types` suffix | `cv.types.ts`, `i18n.types.ts` |
| Tests | Mirror source with `.test` suffix | `EducationSection.test.tsx` |
| JSON data | kebab-case | `en.json`, `de.json` |
| Config | kebab-case or camelCase | `app.config.ts`, `skillCategoryMappings.ts` |

### 6.2 Component Naming

| Type | Pattern | Example |
|------|---------|---------|
| Section Components | `{Name}Section` | `EducationSection`, `SkillsSection` |
| Card Components | `{Name}Card` | `ProjectCard`, `ExperienceCard` |
| Modal Components | `{Name}Modal` | `DownloadModal`, `MediaModal` |
| Form Components | `{Name}Form` | `ContactForm` |
| Wrapper Components | `{Name}Wrapper` | `SectionWrapper` |
| Provider Components | `{Name}Provider` | `LanguageProvider` |

### 6.3 Hook Naming

| Type | Pattern | Example |
|------|---------|---------|
| Data Hooks | `use{Section}Data` | `useEducationData`, `useProjectsData` |
| State Hooks | `use{State}` | `useLanguage`, `useFilter` |
| Utility Hooks | `use{Utility}` | `useMediaQuery`, `useReducedMotion` |
| Context Hooks | `use{Context}` | `useCVData`, `useAccessibility` |

### 6.4 i18n Key Naming

| Category | Pattern | Example |
|----------|---------|---------|
| Navigation | `nav.{item}` | `nav.home`, `nav.education` |
| Section Titles | `sections.{section}` | `sections.education`, `sections.skills` |
| Actions | `actions.{action}` | `actions.download_cv`, `actions.view_more` |
| Forms | `forms.{field}` | `forms.name`, `forms.email` |
| Errors | `errors.{type}` | `errors.required`, `errors.invalid_email` |
| Fallbacks | `fallbacks.{item}` | `fallbacks.no_data`, `fallbacks.unknown` |
| Filters | `filters.{type}` | `filters.all`, `filters.programming` |
| A11y | `a11y.{item}` | `a11y.skip_to_content`, `a11y.loading` |

### 6.5 CSS Class Naming

- Continue using Tailwind utility classes
- Custom classes: `cv-{component}-{modifier}` for application-specific styles
- RTL overrides: Handled via `html[dir="rtl"]` selectors in `rtl.css`

---

## i18n + RTL Strategy

### 7.1 Translation File Structure

**Current (monolithic):**
```typescript
// i18n.ts (~2001 LOC)
const translations = {
  en: { nav: {...}, sections: {...}, ... },
  de: { nav: {...}, sections: {...}, ... },
  fa: { nav: {...}, sections: {...}, ... }
}
```

**Proposed (modular):**
```
i18n/
├── translations/
│   ├── en.json     # ~460 keys
│   ├── de.json     # ~460 keys
│   └── fa.json     # ~460 keys
├── formatters/
│   ├── dateFormatter.ts    # formatDate, formatDateRange
│   ├── numberFormatter.ts  # formatNumber, formatPercent
│   └── listFormatter.ts    # formatList
├── hooks/
│   ├── useTranslation.ts   # Returns t function
│   ├── useFormatters.ts    # Returns formatters
│   └── useT.ts             # Type-safe key accessor
└── types/
    └── i18n.types.ts       # Generated from JSON schema
```

### 7.2 Type-Safe Translation Keys

**Generate types from JSON:**
```typescript
// i18n/types/i18n.types.ts (auto-generated)
type TranslationKeys = 
  | 'nav.home'
  | 'nav.education'
  | 'sections.education'
  | 'forms.name'
  // ... all 460 keys

export function t(key: TranslationKeys): string
```

**Benefits:**
- Typos in translation keys caught at compile time
- IDE autocompletion for translation keys
- Easy to find unused translations

### 7.3 RTL Implementation Strategy

**Current Implementation (keep, enhance):**
1. `html[dir="rtl"]` set via `LanguageContext`
2. `rtl.css` provides global overrides
3. `isRTL` flag available in components

**Enhancements:**

1. **Use Tailwind RTL Utilities (v3+):**
   ```tsx
   // Instead of manual flex-row-reverse
   <div className="flex rtl:flex-row-reverse">
   
   // Instead of manual margin flipping
   <Icon className="me-2" /> {/* margin-end = mr in LTR, ml in RTL */}
   ```

2. **Create RTL-Aware Component Variants:**
   ```tsx
   // components/ui/button.tsx
   const buttonVariants = cva(
     "inline-flex items-center gap-2",
     {
       variants: {
         iconPosition: {
           start: "flex-row rtl:flex-row-reverse",
           end: "flex-row-reverse rtl:flex-row"
         }
       }
     }
   )
   ```

3. **Centralize Direction Logic:**
   ```typescript
   // hooks/use-direction.ts
   export function useDirection() {
     const { isRTL } = useLanguage()
     return {
       isRTL,
       dir: isRTL ? 'rtl' : 'ltr',
       start: isRTL ? 'right' : 'left',
       end: isRTL ? 'left' : 'right'
     }
   }
   ```

### 7.4 Persian (FA) Specific Considerations

1. **Persian Numerals:** Consider `Intl.NumberFormat('fa-IR')` for numbers
2. **Persian Calendar:** Support Jalali dates if needed (library: `date-fns-jalali`)
3. **Mixed Content:** Ensure English terms in Persian text render correctly via `unicode-bidi: embed`
4. **Font Support:** Ensure Persian fonts loaded (current implementation uses `Vazirmatn`)

---

## Migration Strategy Notes

### 8.1 Migration Principles

1. **Incremental PRs**: Each PR should be reviewable in <30 minutes
2. **No Big Bang**: Avoid replacing entire systems at once
3. **Feature Flags**: New architecture can coexist with old
4. **Backwards Compatible**: Exports must remain stable during migration
5. **Test-First**: Add tests before refactoring
6. **Green CI**: Every PR must pass all tests

### 8.2 Migration Phases

#### Phase 1: Foundation (Low Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 1.1 | Extract `use-reduced-motion.ts` hook | Very Low | S |
| 1.2 | Create `domain-utils.ts` for domain normalization | Low | S |
| 1.3 | Create `date-utils.ts` centralized date handling | Low | S |
| 1.4 | Standardize hook filenames (all kebab-case) | Very Low | S |
| 1.5 | Consolidate duplicate test files | Very Low | S |

#### Phase 2: i18n Modularization (Medium Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 2.1 | Extract EN translations to `en.json` | Medium | M |
| 2.2 | Extract DE translations to `de.json` | Medium | M |
| 2.3 | Extract FA translations to `fa.json` | Medium | M |
| 2.4 | Extract formatters to separate files | Low | S |
| 2.5 | Generate type-safe translation keys | Medium | M |
| 2.6 | Update imports across codebase | Medium | L |

#### Phase 3: Data Layer Refactoring (Higher Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 3.1 | Create `RawCVData` type for input data | Medium | M |
| 3.2 | Replace `any` with `unknown` + type guards | Medium | M |
| 3.3 | Split normalizers by section | Medium | M |
| 3.4 | Split validators by section | Medium | M |
| 3.5 | Create view model layer | Medium | M |

#### Phase 4: Component Restructuring (Medium Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 4.1 | Create `features/` directory structure | Very Low | S |
| 4.2 | Migrate `EducationSection` to feature module | Medium | M |
| 4.3 | Extract `useEducationData` hook | Low | S |
| 4.4 | Repeat for each section (one per PR) | Medium | M each |
| 4.5 | Consolidate `SectionWrapper` usage | Low | M |

#### Phase 5: Provider Consolidation (Low Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 5.1 | Create `UXContext` (Konami + Sound + Feedback) | Low | M |
| 5.2 | Extract formatters from `LanguageContext` | Low | M |
| 5.3 | Move `shouldShowEntry` to utils | Very Low | S |
| 5.4 | Create `AppProviders` wrapper | Low | S |

#### Phase 6: Test Expansion (Low Risk)
| Step | Change | Risk | PR Size |
|------|--------|------|---------|
| 6.1 | Add `EducationSection` component tests | Very Low | M |
| 6.2 | Add remaining section component tests | Very Low | M each |
| 6.3 | Add filter integration tests | Very Low | M |
| 6.4 | Expand E2E coverage | Very Low | M |

### 8.3 Rollback Strategy

- Each phase is independently rollback-able
- Feature flags allow gradual rollout
- Old module exports maintained during migration
- CI gates prevent broken code from merging

---

## Risks & Mitigations

### 9.1 Risk Matrix

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | i18n key changes break translations | Medium | High | Generate types, add tests for all keys |
| R2 | Data normalization regression | Medium | High | Comprehensive tests before refactoring |
| R3 | RTL layout breaks during migration | Low | Medium | Visual regression tests, manual QA on FA |
| R4 | Performance regression from new layers | Low | Medium | Profile before/after, lazy loading |
| R5 | Import cycle issues | Medium | Low | ESLint rules, careful dependency design |
| R6 | CI time increase from more tests | High | Low | Parallelize test runs, test sharding |
| R7 | Developer confusion during transition | Medium | Medium | Clear documentation, migration guide |
| R8 | Locked files accidentally modified | Low | High | Integrity tests, pre-commit hooks |

### 9.2 Detailed Mitigations

**R1: i18n Key Changes**
- Generate TypeScript types from JSON schema
- Add snapshot tests for all translation keys
- Create migration script to update imports
- Use codemod for bulk updates

**R2: Data Normalization Regression**
- 100% test coverage on normalizers before refactoring
- Add language-specific snapshot tests
- Verify all three languages render correctly before each PR
- Keep old normalizer as fallback during migration

**R3: RTL Layout Breaks**
- Add visual regression tests with Percy or Chromatic
- Manual QA checklist for Persian layout
- Test on real RTL browsers (not just `dir="rtl"`)
- Involve Persian speaker in review

**R4: Performance Regression**
- Benchmark before migration (Lighthouse, Core Web Vitals)
- Add performance budget to CI
- Profile React renders with DevTools
- Keep bundle size comparable

**R5: Import Cycle Issues**
- Use `madge` or similar tool to detect cycles
- ESLint `import/no-cycle` rule
- Clear layer boundaries prevent most cycles
- Review dependency graph in PRs

---

## Unknowns + Verification Steps

| Unknown | Why Unknown | How to Verify |
|---------|-------------|---------------|
| Performance impact of modular i18n | Requires runtime measurement | Benchmark JSON loading vs inline object |
| Type generation tool for i18n keys | Multiple options exist | Evaluate `typed-locale`, `typesafe-i18n`, custom script |
| Tailwind RTL utilities compatibility | Requires testing with current config | Test `rtl:` prefix in sample components |
| View model layer necessity | Design decision | Prototype for one section, measure complexity |
| Test coverage baseline | Not measured | Run `vitest --coverage` to establish baseline |
| ESLint boundary enforcement | Plugin may need configuration | Test `eslint-plugin-boundaries` or custom rules |
| Feature module lazy loading overhead | Requires bundle analysis | Compare bundle sizes before/after |
| Persian speaker availability for RTL QA | External dependency | Identify team member or contractor |

### Manual Verification Steps

1. **Performance Baseline:**
   ```bash
   cd frontend
   npm run build
   npx vite-bundle-visualizer
   # Record current bundle size
   ```

2. **Test Coverage Baseline:**
   ```bash
   npm run test -- --coverage
   # Record coverage percentages
   ```

3. **Tailwind RTL Support:**
   ```tsx
   // Create test component with rtl: prefix
   <div className="text-left rtl:text-right">Test</div>
   // Verify it works with current Tailwind config
   ```

4. **i18n Key Count:**
   ```bash
   # Count translation keys
   grep -o '"[a-z_]*":' src/lib/i18n.ts | wc -l
   ```

5. **Import Cycle Detection:**
   ```bash
   npx madge --circular src/
   ```

---

## Self-Audit

### Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`/reports/REFACTOR_TARGET_ARCHITECTURE.md`).
- [x] I did not leave determinable sections as "unknown" - unknowns are documented with verification steps.
- [x] For any remaining unknowns, I documented why and how to verify manually.

### Safety Checks

1. ✅ **No changes outside `/reports/`**: This report is the only file created.
2. ✅ **No existing files modified**: All analysis was read-only.
3. ✅ **Report file exists**: `/reports/REFACTOR_TARGET_ARCHITECTURE.md` created.
4. ✅ **No "unknown" sections without justification**: All unknowns have verification steps.
5. ✅ **Evidence-based findings**: All issues include file paths and line numbers where possible.

### Coverage Checklist

| Required Section | Status |
|------------------|--------|
| Design goals (bullets) | ✅ Complete (8 goals) |
| Current pain points (evidence-backed) | ✅ Complete (8 pain points with evidence) |
| Target architecture diagram (text) | ✅ Complete (2 diagrams) |
| Proposed directory tree (future state) | ✅ Complete (detailed tree) |
| Module boundary rules (import constraints) | ✅ Complete (rules + ESLint config) |
| Naming conventions | ✅ Complete (5 categories) |
| i18n + RTL strategy | ✅ Complete (4 sections) |
| Migration strategy notes | ✅ Complete (6 phases, detailed) |
| Risks & mitigations | ✅ Complete (8 risks with mitigations) |
| Unknowns + verification steps | ✅ Complete (8 unknowns with verification) |

---

## Evidence Citations Index

| Citation | Description |
|----------|-------------|
| `frontend/src/lib/i18n.ts:L1-L2001` | Monolithic i18n file |
| `frontend/src/utils/dataNormalizer.ts:L40-L300` | `any` usage in normalization |
| `frontend/src/App.tsx:L202-L224` | 8-level provider nesting |
| `frontend/src/components/sections/ProjectsSection.tsx:L34-L47` | Duplicated domain logic |
| `frontend/src/components/sections/WorkshopAndCertificationsSection.tsx` | 412 LOC section component |
| `frontend/src/components/sections/PublicationsSection.tsx` | 393 LOC section component |
| `frontend/src/components/sections/ExperiencesSection.tsx:L93` | Hardcoded English fallback |
| `frontend/src/context/LanguageContext.tsx` | 271 LOC mixed responsibilities |
| `frontend/src/components/sections/ExperiencesSection.tsx:L223-L241` | Custom empty state |
| `frontend/src/components/sections/SkillsSection.tsx:L103-L105` | Returns null for empty |
| `frontend/src/config/keyMappings.ts` | 873 LOC config file |
| `frontend/src/styles/rtl.css` | 257 LOC RTL stylesheet |

---

*End of Refactor Target Architecture Proposal*

*Report generated by: GitHub Copilot Coding Agent*  
*Date: 2026-01-02*  
*Repository: premium-cv-port-land*
