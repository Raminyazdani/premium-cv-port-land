# Refactor Plan — Phased, Independently Mergeable Steps

**Report Version:** 1.0  
**Generated:** 2026-01-02  
**Repository:** premium-cv-port-land  
**Report Type:** REPORT-ONLY (No code modifications made)

---

## Table of Contents

1. [Principles & Safety Rules](#1-principles--safety-rules)
2. [Phase Overview Table](#2-phase-overview-table)
3. [Step-by-Step Plan (Detailed)](#3-step-by-step-plan-detailed)
   - [Phase 0: CI/CD Hardening](#phase-0-cicd-hardening)
   - [Phase 1: Foundation — Utilities Extraction](#phase-1-foundation--utilities-extraction)
   - [Phase 2: i18n Modularization](#phase-2-i18n-modularization)
   - [Phase 3: Data Layer Type Safety](#phase-3-data-layer-type-safety)
   - [Phase 4: Component Restructuring](#phase-4-component-restructuring)
   - [Phase 5: Provider Consolidation](#phase-5-provider-consolidation)
   - [Phase 6: Test Expansion & Stabilization](#phase-6-test-expansion--stabilization)
4. [Dependency Graph](#4-dependency-graph)
5. [Rollback Strategy Notes](#5-rollback-strategy-notes)
6. [Unknowns + Verification Steps](#6-unknowns--verification-steps)
7. [Self-Audit](#7-self-audit)

---

## 1. Principles & Safety Rules

### 1.1 Core Principles

1. **Smallest Safe Increments**: Each PR must be independently mergeable and reviewable in < 30 minutes.
2. **No Big Bang Refactors**: Avoid replacing entire subsystems at once. Migrate gradually.
3. **Green CI Gate**: Every PR must pass all existing tests before and after changes.
4. **Feature Parity**: No functionality regression allowed — all EN/DE/FA languages must render correctly.
5. **Backwards Compatibility**: Exports must remain stable; no breaking changes to existing consumers.
6. **Test First**: Add/improve tests before refactoring where possible.

### 1.2 Safety Rules

⚠️ **CRITICAL — DO NOT TOUCH LOCKED FILES**

The following files are **READ-ONLY** and must **NEVER** be modified:

| File | Path | Purpose |
|------|------|---------|
| English CV Data | `frontend/src/data/cv.json` | Production CV data (EN) |
| German CV Data | `frontend/src/data/ramin_de.json` | Production CV data (DE) |
| Persian CV Data | `frontend/src/data/ramin_fa.json` | Production CV data (FA) |

**Why?**
- SHA256 hash integrity tests enforce byte-identical content
- Located in: `frontend/tests/locked-files-integrity.test.ts`
- Reference hashes: `frontend/tests/locked_files_hashes.json`

**If tests need fixtures:**
- Read from locked files at runtime, OR
- Create byte-identical copies in `frontend/tests/fixtures/` and document them as copies

### 1.3 Per-Step Reminder

Every step in this plan must follow this checklist:

- [ ] Verify no locked files are modified (`git diff frontend/src/data/*.json`)
- [ ] Run `npm run test` — all tests pass
- [ ] Run `npm run verify-languages` — EN/DE/FA pass
- [ ] Run `npm run build` — production build succeeds
- [ ] Run `npm run lint` — no new errors introduced
- [ ] Manual verification for UI changes (screenshots for review)

---

## 2. Phase Overview Table

| Phase | Goal | Steps | Risk Level | Acceptance Gates |
|-------|------|-------|------------|------------------|
| **Phase 0** | CI/CD Hardening | 5 | Very Low | CI passes with stricter gates; no code changes |
| **Phase 1** | Foundation — Utilities Extraction | 6 | Low | Extracted utilities work; tests pass; no functionality change |
| **Phase 2** | i18n Modularization | 7 | Medium | Split i18n loads correctly; all translations work; no missing keys |
| **Phase 3** | Data Layer Type Safety | 6 | Medium | No `any` in data layer; TypeScript strict passes; data loads correctly |
| **Phase 4** | Component Restructuring | 8 | Medium | Components refactored; render correctly; tests pass |
| **Phase 5** | Provider Consolidation | 4 | Low | Providers simplified; app renders correctly; no functionality regression |
| **Phase 6** | Test Expansion & Stabilization | 5 | Very Low | Test coverage improved; all tests pass; CI stabilized |

**Total Steps:** 41  
**Estimated Timeline:** 8-12 weeks (1 developer, part-time) or 3-4 weeks (full-time)

---

## 3. Step-by-Step Plan (Detailed)

### Phase 0: CI/CD Hardening

**Goal:** Strengthen CI gates before code refactoring to catch regressions early.

---

#### Step 0.1: Add TypeScript Type Check to CI

**Purpose:** Ensure type errors fail the CI pipeline before code reaches production.

**Files Likely Touched:**
- `.github/workflows/ci.yml` (add step)

**Risk Level:** Very Low — adding new check, not modifying existing behavior

**Mitigations:**
- Verify `npm run typecheck` passes locally first
- If existing type errors exist, fix them in separate preparatory PR

**Tests/Verification:**
- Trigger CI manually
- Verify type errors fail the pipeline

**Acceptance Criteria:**
- [ ] `npm run typecheck` runs in CI after lint step
- [ ] TypeScript errors fail the CI pipeline
- [ ] No existing type errors (or fixed in prep PR)

**DO NOT TOUCH LOCKED FILES:** N/A (workflow file only)

---

#### Step 0.2: Make Lint Step Blocking

**Purpose:** Ensure ESLint errors block the CI pipeline (currently uses `continue-on-error: true`).

**Files Likely Touched:**
- `.github/workflows/ci.yml:L46-48` (remove `continue-on-error`)

**Risk Level:** Very Low — may reveal existing lint errors that need fixing

**Mitigations:**
- Run `npm run lint` locally first
- Fix existing lint errors in preparatory PR(s) if needed
- Consider `continue-on-error` only for warnings, not errors

**Tests/Verification:**
- Introduce intentional lint error in test branch
- Verify CI fails

**Acceptance Criteria:**
- [ ] ESLint errors fail the CI pipeline
- [ ] No existing lint errors (or fixed in prep PR)

**DO NOT TOUCH LOCKED FILES:** N/A (workflow file only)

---

#### Step 0.3: Add Prettier Format Check to CI

**Purpose:** Ensure code formatting is consistent across all contributions.

**Files Likely Touched:**
- `.github/workflows/ci.yml` (add `npm run format:check` step)

**Risk Level:** Very Low — format:check script already exists

**Mitigations:**
- Run `npm run format:check` locally first
- If formatting issues exist, run `npm run format` in prep PR

**Tests/Verification:**
- Trigger CI with unformatted file
- Verify CI fails

**Acceptance Criteria:**
- [ ] `npm run format:check` runs in CI
- [ ] Formatting violations fail the CI pipeline
- [ ] All existing files are properly formatted

**DO NOT TOUCH LOCKED FILES:** N/A (workflow file only)

---

#### Step 0.4: Fix Dependabot Directory Configuration

**Purpose:** Ensure Dependabot finds dependencies in `/frontend` directory.

**Files Likely Touched:**
- `.github/dependabot.yml:L4` (change `/` to `/frontend`)

**Risk Level:** Very Low — config change only

**Mitigations:**
- Verify after merge that Dependabot PRs appear for frontend deps

**Tests/Verification:**
- Wait for next Dependabot scan cycle
- Verify PRs target frontend dependencies

**Acceptance Criteria:**
- [ ] `directory` set to `/frontend` for npm ecosystem
- [ ] Dependabot creates PRs for frontend dependency updates

**DO NOT TOUCH LOCKED FILES:** N/A (workflow file only)

---

#### Step 0.5: Add Job Timeout to All CI Jobs

**Purpose:** Prevent hung jobs from consuming Actions minutes indefinitely.

**Files Likely Touched:**
- `.github/workflows/ci.yml` (add `timeout-minutes: 30` to all jobs)
- `.github/workflows/uiqa-*.yml` (add consistent timeouts)

**Risk Level:** Very Low — config change only

**Mitigations:**
- Set generous timeout (30 min) initially
- Monitor actual job durations

**Tests/Verification:**
- Verify timeout is set in workflow runs
- Check no jobs are timing out prematurely

**Acceptance Criteria:**
- [ ] All CI jobs have explicit `timeout-minutes`
- [ ] Timeouts are reasonable for actual job durations

**DO NOT TOUCH LOCKED FILES:** N/A (workflow files only)

---

### Phase 1: Foundation — Utilities Extraction

**Goal:** Extract duplicated logic into reusable utilities before restructuring components.

---

#### Step 1.1: Create `use-reduced-motion.ts` Hook

**Purpose:** Replace inline `window.matchMedia` calls with a reusable, SSR-safe hook.

**Files Likely Touched:**
- `frontend/src/hooks/use-reduced-motion.ts` (new file)
- `frontend/src/components/sections/EducationSection.tsx:L35` (update import)
- `frontend/src/hooks/index.ts` (update barrel export)

**Risk Level:** Low — extracting existing logic

**Mitigations:**
- Test on all three languages
- Verify animation behavior unchanged

**Tests/Verification:**
- Create unit test for hook: `frontend/tests/hooks/use-reduced-motion.test.ts`
- Verify `prefers-reduced-motion: reduce` is respected

**Acceptance Criteria:**
- [ ] Hook exists at `frontend/src/hooks/use-reduced-motion.ts`
- [ ] No direct `window.matchMedia` calls in component render bodies
- [ ] Animation behavior unchanged

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 1.2: Create `domain-utils.ts` for Domain Normalization

**Purpose:** Extract repeated domain normalization logic (Programming, Academic, etc.) to single source.

**Files Likely Touched:**
- `frontend/src/utils/domain-utils.ts` (new file)
- `frontend/src/components/sections/ProjectsSection.tsx:L34-L47, L164-L179, L202-L215` (import utility)
- `frontend/src/components/sections/ExperiencesSection.tsx` (if domain logic exists)
- `frontend/src/components/sections/SkillsSection.tsx` (if domain logic exists)

**Risk Level:** Low — extracting existing logic

**Mitigations:**
- Ensure all existing domain mappings preserved
- Test filter behavior in all sections

**Tests/Verification:**
- Create unit test: `frontend/tests/utils/domain-utils.test.ts`
- Test all known domain values map correctly
- Verify filtering works in ProjectsSection

**Acceptance Criteria:**
- [ ] Single `normalizeDomain()` function in `domain-utils.ts`
- [ ] No duplicated domain normalization logic in components
- [ ] All filter pills display correct domain labels
- [ ] All three languages work correctly

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 1.3: Create `date-utils.ts` for Centralized Date Handling

**Purpose:** Consolidate date parsing and formatting logic scattered across components.

**Files Likely Touched:**
- `frontend/src/utils/date-utils.ts` (new file)
- `frontend/src/components/sections/ExperiencesSection.tsx:L19-L60` (replace `parseDuration`)
- `frontend/src/utils/dataValidation.ts` (may reference new utils)

**Risk Level:** Low — consolidating existing logic

**Mitigations:**
- Preserve all existing date format handling
- Test with all date formats in CV data

**Tests/Verification:**
- Create unit test: `frontend/tests/utils/date-utils.test.ts`
- Test various date formats, "Present", "recent", etc.
- Verify ExperiencesSection renders dates correctly

**Acceptance Criteria:**
- [ ] Single source for date parsing utilities
- [ ] No local `parseDuration`-style functions in section components
- [ ] Dates render correctly for all experiences
- [ ] All three languages work correctly

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 1.4: Standardize Hook Filenames to kebab-case

**Purpose:** Consistent naming convention for hook files.

**Files Likely Touched:**
- `frontend/src/hooks/useFilteredData.ts` → `frontend/src/hooks/use-filtered-data.ts` (rename)
- Update all imports referencing old filename
- `frontend/src/hooks/index.ts` (update barrel export)

**Risk Level:** Very Low — pure rename

**Mitigations:**
- Use IDE refactoring tools or find-and-replace
- Verify no broken imports

**Tests/Verification:**
- `npm run build` succeeds
- `npm run test` passes
- All imports resolve

**Acceptance Criteria:**
- [ ] All hooks use kebab-case filenames (`use-*.ts`)
- [ ] No TypeScript import errors
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 1.5: Consolidate Duplicate Test Files

**Purpose:** Remove duplicate test files to prevent confusion.

**Files Likely Touched:**
- `frontend/tests/data-normalization.test.ts` (keep)
- `frontend/tests/dataNormalization.test.ts` (merge or delete)

**Risk Level:** Very Low — test file consolidation

**Mitigations:**
- Compare test coverage between files
- Merge any unique tests before deletion
- Verify all tests pass after consolidation

**Tests/Verification:**
- `npm run test` passes
- No tests lost in consolidation

**Acceptance Criteria:**
- [ ] Single test file for data normalization
- [ ] All test coverage preserved
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 1.6: Update `.env.example` with Missing Variables

**Purpose:** Document all environment variables for developers.

**Files Likely Touched:**
- `frontend/.env.example` (add `VITE_DEBUG_CV`, `VITE_PSEUDO_LOC`)

**Risk Level:** Very Low — documentation only

**Mitigations:**
- Only add documentation, no code changes

**Tests/Verification:**
- Review `.env.example` for completeness

**Acceptance Criteria:**
- [ ] All `VITE_*` environment variables documented
- [ ] Clear instructions for each variable

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

### Phase 2: i18n Modularization

**Goal:** Split monolithic i18n file (~2001 LOC) into maintainable modules.

---

#### Step 2.1: Create i18n Directory Structure

**Purpose:** Set up directory structure for modular i18n.

**Files Likely Touched:**
- `frontend/src/i18n/` (new directory)
- `frontend/src/i18n/translations/` (new directory)
- `frontend/src/i18n/formatters/` (new directory)
- `frontend/src/i18n/hooks/` (new directory)
- `frontend/src/i18n/types/` (new directory)
- `frontend/src/i18n/index.ts` (new barrel export)

**Risk Level:** Very Low — creating empty directories and structure

**Mitigations:**
- No behavior changes in this step

**Tests/Verification:**
- Directory structure exists
- TypeScript compiles

**Acceptance Criteria:**
- [ ] i18n directory structure created
- [ ] Empty barrel exports compile

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.2: Extract English Translations to JSON

**Purpose:** Move EN translations from i18n.ts to standalone JSON file.

**Files Likely Touched:**
- `frontend/src/i18n/translations/en.json` (new file)
- `frontend/src/lib/i18n.ts:L458-L843` (extract to JSON)

**Risk Level:** Medium — translation file format change

**Mitigations:**
- Verify all keys preserved
- Run translation completeness tests
- Test EN language rendering

**Tests/Verification:**
- `npm run test:language`
- Verify EN renders correctly at `?lang=en`
- No missing translation keys

**Acceptance Criteria:**
- [ ] `en.json` contains all EN translations (~460 keys)
- [ ] EN language renders correctly
- [ ] No "undefined" strings in UI

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.3: Extract German Translations to JSON

**Purpose:** Move DE translations from i18n.ts to standalone JSON file.

**Files Likely Touched:**
- `frontend/src/i18n/translations/de.json` (new file)
- `frontend/src/lib/i18n.ts:L844-L1230` (extract to JSON)

**Risk Level:** Medium — translation file format change

**Mitigations:**
- Same as Step 2.2

**Tests/Verification:**
- `npm run verify-languages` passes for DE
- Verify DE renders correctly at `?lang=de`

**Acceptance Criteria:**
- [ ] `de.json` contains all DE translations (~460 keys)
- [ ] DE language renders correctly
- [ ] No "undefined" strings in UI

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.4: Extract Persian Translations to JSON

**Purpose:** Move FA translations from i18n.ts to standalone JSON file.

**Files Likely Touched:**
- `frontend/src/i18n/translations/fa.json` (new file)
- `frontend/src/lib/i18n.ts:L1231-L1620` (extract to JSON)

**Risk Level:** Medium — translation file format change, RTL content

**Mitigations:**
- Same as Step 2.2
- Additional RTL layout verification

**Tests/Verification:**
- `npm run verify-languages` passes for FA
- Verify FA renders correctly at `?lang=fa`
- Verify RTL layout intact

**Acceptance Criteria:**
- [ ] `fa.json` contains all FA translations (~460 keys)
- [ ] FA language renders correctly with RTL layout
- [ ] No "undefined" strings in UI

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.5: Extract Formatting Utilities

**Purpose:** Move date/number/list formatters to separate files.

**Files Likely Touched:**
- `frontend/src/i18n/formatters/date-formatter.ts` (new file)
- `frontend/src/i18n/formatters/number-formatter.ts` (new file)
- `frontend/src/i18n/formatters/list-formatter.ts` (new file)
- `frontend/src/i18n/formatters/index.ts` (barrel export)
- `frontend/src/lib/i18n.ts:L1689-L2001` (extract formatters)

**Risk Level:** Low — extracting pure functions

**Mitigations:**
- Ensure function signatures unchanged
- Test formatter outputs

**Tests/Verification:**
- `frontend/tests/i18n-formatting.test.ts` passes
- Formatters produce same output

**Acceptance Criteria:**
- [ ] Formatters in separate files
- [ ] Formatting behavior unchanged
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.6: Create Type-Safe Translation Key Types

**Purpose:** Generate TypeScript types from translation keys for compile-time safety.

**Files Likely Touched:**
- `frontend/src/i18n/types/translation-keys.ts` (new file)
- `frontend/src/i18n/hooks/use-t.ts` (type-safe t function)

**Risk Level:** Medium — type system changes

**Mitigations:**
- Types are generated from JSON structure
- No runtime behavior changes

**Tests/Verification:**
- TypeScript compiles with strict mode
- Invalid keys produce type errors

**Acceptance Criteria:**
- [ ] Translation keys are typed
- [ ] Typos in keys caught at compile time
- [ ] IDE autocompletion works for keys

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 2.7: Update Codebase Imports to New i18n Structure

**Purpose:** Migrate all components to use new i18n imports.

**Files Likely Touched:**
- All files importing from `@/lib/i18n`
- Update imports to `@/i18n` or `@/i18n/hooks`
- `frontend/src/lib/i18n.ts` (deprecate or remove after migration)

**Risk Level:** Medium — many file changes

**Mitigations:**
- Use IDE refactoring tools
- Split into multiple PRs if needed (by section)
- Maintain backwards compatibility during transition

**Tests/Verification:**
- `npm run test` passes
- All three languages render correctly
- No TypeScript errors

**Acceptance Criteria:**
- [ ] All components use new i18n imports
- [ ] Old i18n.ts removed or deprecated
- [ ] No regressions in any language

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

### Phase 3: Data Layer Type Safety

**Goal:** Eliminate `any` usage in data normalization layer.

---

#### Step 3.1: Create `RawCVData` Types for Input Data

**Purpose:** Define types for raw JSON structure before normalization.

**Files Likely Touched:**
- `frontend/src/types/raw-cv.ts` (new file)
- Type definitions for each language's raw JSON structure

**Risk Level:** Low — adding types only

**Mitigations:**
- Types are additive
- No runtime behavior changes

**Tests/Verification:**
- TypeScript compiles
- Types match actual JSON structure

**Acceptance Criteria:**
- [ ] `RawCVData` type exists
- [ ] Types cover all three language variants
- [ ] TypeScript compiles without errors

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included (types should match locked file structure)

---

#### Step 3.2: Create Type Guards for Data Validation

**Purpose:** Create type narrowing functions to safely check data types.

**Files Likely Touched:**
- `frontend/src/utils/type-guards.ts` (new file)
- Type guard functions: `isBasics()`, `isEducation()`, etc.

**Risk Level:** Low — adding utility functions

**Mitigations:**
- Pure functions with no side effects
- Unit tests for each guard

**Tests/Verification:**
- Unit tests: `frontend/tests/utils/type-guards.test.ts`
- Type guards correctly narrow types

**Acceptance Criteria:**
- [ ] Type guards for all CV sections
- [ ] TypeScript correctly narrows types after guards
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 3.3: Replace `any` with `unknown` in Normalizer Entry

**Purpose:** Start migration from `any` to `unknown` with type guards.

**Files Likely Touched:**
- `frontend/src/utils/dataNormalizer.ts:L40` (change `rawData: any` to `rawData: unknown`)
- Add type guards for top-level validation

**Risk Level:** Medium — core data pipeline change

**Mitigations:**
- Extensive testing before and after
- Type guards provide safe narrowing
- Run all language verification tests

**Tests/Verification:**
- `npm run test` passes
- `npm run verify-languages` passes
- All three languages render correctly

**Acceptance Criteria:**
- [ ] `normalizeCVData` accepts `unknown` input
- [ ] Type guards validate input before processing
- [ ] No runtime regressions

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 3.4: Migrate Section Normalizers from `any` to Typed

**Purpose:** Replace `any` in section-specific normalizers with proper types.

**Files Likely Touched:**
- `frontend/src/utils/dataNormalizer.ts:L81-L300` (all section normalizers)
- May split into separate files in future step

**Risk Level:** Medium — core data pipeline changes

**Mitigations:**
- One section at a time (education first, then experience, etc.)
- Verify each section renders correctly after change
- Extensive testing

**Tests/Verification:**
- `npm run test` passes
- Each section renders correctly
- No TypeScript errors

**Acceptance Criteria:**
- [ ] No `any` in section normalizers
- [ ] All sections render correctly
- [ ] TypeScript strict mode passes

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 3.5: Split Normalizers by Section

**Purpose:** Separate large normalizer file into section-specific modules.

**Files Likely Touched:**
- `frontend/src/utils/normalizers/` (new directory)
- `frontend/src/utils/normalizers/basics-normalizer.ts` (new file)
- `frontend/src/utils/normalizers/education-normalizer.ts` (new file)
- `frontend/src/utils/normalizers/experience-normalizer.ts` (new file)
- `frontend/src/utils/normalizers/skills-normalizer.ts` (new file)
- `frontend/src/utils/normalizers/index.ts` (barrel export)
- `frontend/src/utils/dataNormalizer.ts` (import from new modules)

**Risk Level:** Medium — file restructuring

**Mitigations:**
- One section at a time
- Maintain existing exports during migration

**Tests/Verification:**
- `npm run test` passes
- All sections render correctly
- No import errors

**Acceptance Criteria:**
- [ ] Each section has own normalizer file
- [ ] Main normalizer imports from modules
- [ ] No regressions

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 3.6: Create View Model Layer

**Purpose:** Add typed view models between raw data and components.

**Files Likely Touched:**
- `frontend/src/data/view-models/` (new directory)
- `frontend/src/data/view-models/education-view-model.ts` (new file)
- `frontend/src/data/view-models/experience-view-model.ts` (new file)
- View model factories for each section

**Risk Level:** Medium — new abstraction layer

**Mitigations:**
- Start with one section as prototype
- Evaluate complexity before full implementation
- May be optional if data layer is sufficiently typed

**Tests/Verification:**
- View models produce expected output
- Components receive typed data

**Acceptance Criteria:**
- [ ] View model layer exists (if implemented)
- [ ] Components receive strongly-typed data
- [ ] No regressions

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

### Phase 4: Component Restructuring

**Goal:** Reorganize components into feature modules with extracted hooks.

---

#### Step 4.1: Create `features/` Directory Structure

**Purpose:** Set up directory structure for feature-based organization.

**Files Likely Touched:**
- `frontend/src/features/` (new directory)
- `frontend/src/features/cv-sections/` (new directory)
- `frontend/src/features/shared/` (new directory)
- `frontend/src/features/header/` (new directory)
- `frontend/src/features/footer/` (new directory)

**Risk Level:** Very Low — creating empty directories

**Mitigations:**
- No behavior changes

**Tests/Verification:**
- Directory structure exists
- TypeScript compiles

**Acceptance Criteria:**
- [ ] Feature directory structure created
- [ ] Ready for component migration

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.2: Migrate EducationSection to Feature Module

**Purpose:** Move EducationSection to feature module, extract data hook.

**Files Likely Touched:**
- `frontend/src/features/cv-sections/education/EducationSection.tsx` (new file)
- `frontend/src/features/cv-sections/education/EducationCard.tsx` (new file, extracted)
- `frontend/src/features/cv-sections/education/use-education-data.ts` (new hook)
- `frontend/src/features/cv-sections/education/index.ts` (barrel export)
- `frontend/src/components/sections/EducationSection.tsx` (redirect or remove)
- `frontend/src/App.tsx` (update lazy import)

**Risk Level:** Medium — component restructuring

**Mitigations:**
- Keep old component as redirect during transition
- Verify rendering unchanged
- Test all three languages

**Tests/Verification:**
- `npm run test` passes
- Education section renders correctly
- Create `frontend/tests/features/education/EducationSection.test.tsx`

**Acceptance Criteria:**
- [ ] EducationSection in feature module
- [ ] Data hook extracted
- [ ] Component under 150 LOC
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.3: Migrate ExperiencesSection to Feature Module

**Purpose:** Same pattern as Step 4.2 for experiences.

**Files Likely Touched:**
- `frontend/src/features/cv-sections/experience/ExperiencesSection.tsx`
- `frontend/src/features/cv-sections/experience/ExperienceCard.tsx`
- `frontend/src/features/cv-sections/experience/use-experience-data.ts`
- `frontend/src/features/cv-sections/experience/index.ts`

**Risk Level:** Medium

**Mitigations:** Same as Step 4.2

**Tests/Verification:** Same as Step 4.2

**Acceptance Criteria:** Same as Step 4.2

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.4: Migrate SkillsSection to Feature Module

**Purpose:** Same pattern as Step 4.2 for skills.

**Files Likely Touched:**
- `frontend/src/features/cv-sections/skills/SkillsSection.tsx`
- `frontend/src/features/cv-sections/skills/SkillsVisualization/` (sub-module)
- `frontend/src/features/cv-sections/skills/use-skills-data.ts`

**Risk Level:** Medium

**Mitigations:** Same as Step 4.2

**Tests/Verification:** Same as Step 4.2

**Acceptance Criteria:** Same as Step 4.2

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.5: Migrate ProjectsSection to Feature Module

**Purpose:** Same pattern as Step 4.2 for projects.

**Files Likely Touched:**
- `frontend/src/features/cv-sections/projects/ProjectsSection.tsx`
- `frontend/src/features/cv-sections/projects/ProjectCard.tsx`
- `frontend/src/features/cv-sections/projects/ProjectCaseStudy/`
- `frontend/src/features/cv-sections/projects/use-projects-data.ts`

**Risk Level:** Medium

**Mitigations:** Same as Step 4.2

**Tests/Verification:** Same as Step 4.2

**Acceptance Criteria:** Same as Step 4.2

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.6: Migrate Remaining Sections to Feature Modules

**Purpose:** Complete migration for remaining sections.

**Files Likely Touched:**
- `frontend/src/features/cv-sections/publications/`
- `frontend/src/features/cv-sections/languages-spoken/`
- `frontend/src/features/cv-sections/certifications/`
- `frontend/src/features/cv-sections/references/`
- `frontend/src/features/cv-sections/profiles/`
- `frontend/src/features/cv-sections/basics/`

**Risk Level:** Medium

**Mitigations:** Same as Step 4.2 (one section per PR)

**Tests/Verification:** Same as Step 4.2

**Acceptance Criteria:** Same as Step 4.2

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.7: Standardize Empty State Patterns

**Purpose:** Ensure all sections use consistent empty state handling.

**Files Likely Touched:**
- `frontend/src/features/shared/EmptyState.tsx` (new or enhanced)
- All section components (update empty state rendering)
- `frontend/src/components/composites/SectionWrapper.tsx` (verify isEmpty prop)

**Risk Level:** Low — UI consistency change

**Mitigations:**
- Define single empty state pattern
- Update sections one at a time
- Visual review of empty states

**Tests/Verification:**
- Visual testing of empty states
- Screenshot comparison

**Acceptance Criteria:**
- [ ] All sections use consistent empty state
- [ ] SectionWrapper isEmpty prop used consistently
- [ ] No "returns null" for empty sections

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 4.8: Fix Hardcoded English Strings

**Purpose:** Replace hardcoded English fallbacks with translation keys.

**Files Likely Touched:**
- `frontend/src/components/sections/ExperiencesSection.tsx:L93`
- `frontend/src/components/sections/ProjectsSection.tsx:L28`
- `frontend/src/components/sections/EducationSection.tsx:L37`
- `frontend/src/components/sections/ReferencesSection.tsx:L187-L194`
- `frontend/src/i18n/translations/en.json` (add fallback keys)
- `frontend/src/i18n/translations/de.json` (add fallback keys)
- `frontend/src/i18n/translations/fa.json` (add fallback keys)

**Risk Level:** Low — i18n improvement

**Mitigations:**
- Add new translation keys for fallbacks
- Test all three languages

**Tests/Verification:**
- Verify fallbacks display localized text
- No English-only text in FA/DE

**Acceptance Criteria:**
- [ ] No hardcoded English strings in components
- [ ] All fallbacks use translation system
- [ ] All three languages render correctly

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

### Phase 5: Provider Consolidation

**Goal:** Reduce provider nesting depth from 8 to 5-6.

---

#### Step 5.1: Create `UXContext` (Consolidate Konami + Sound + Feedback)

**Purpose:** Combine related UX providers into single context.

**Files Likely Touched:**
- `frontend/src/context/UXContext.tsx` (new file)
- `frontend/src/context/KonamiContext.tsx` (merge into UXContext)
- `frontend/src/components/SoundEffects.tsx` (merge provider)
- `frontend/src/components/MicroFeedback.tsx` (merge provider)
- `frontend/src/App.tsx` (update provider tree)

**Risk Level:** Low — consolidating providers

**Mitigations:**
- Ensure all hooks continue to work
- Test Konami code, sound effects, feedback

**Tests/Verification:**
- Konami code triggers correctly
- Sound effects play (if enabled)
- Micro feedback works

**Acceptance Criteria:**
- [ ] Single UXContext replaces three providers
- [ ] All UX features work correctly
- [ ] Provider nesting reduced

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 5.2: Extract Formatters from LanguageContext

**Purpose:** Move `useFormatters` to i18n layer (done in Phase 2), simplify LanguageContext.

**Files Likely Touched:**
- `frontend/src/context/LanguageContext.tsx:L175-L259` (remove formatters)
- Update imports to use i18n formatters instead

**Risk Level:** Low — if Phase 2 completed

**Mitigations:**
- Verify formatters imported from i18n layer
- Test date/number formatting

**Tests/Verification:**
- Formatters work correctly
- LanguageContext simplified

**Acceptance Criteria:**
- [ ] LanguageContext under 100 LOC
- [ ] Formatters in i18n layer
- [ ] No regressions

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 5.3: Move `shouldShowEntry` to Utils

**Purpose:** Remove utility function from FilterContext to utils layer.

**Files Likely Touched:**
- `frontend/src/utils/filter-utils.ts` (new or add to existing)
- `frontend/src/context/FilterContext.tsx:L74-L84` (remove function)
- Update imports in section components

**Risk Level:** Very Low — moving function

**Mitigations:**
- Ensure function behavior unchanged
- Update all imports

**Tests/Verification:**
- Filtering behavior unchanged
- All sections filter correctly

**Acceptance Criteria:**
- [ ] `shouldShowEntry` in utils layer
- [ ] FilterContext exports only context-related items
- [ ] No regressions

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 5.4: Create `AppProviders` Wrapper Component

**Purpose:** Clean up App.tsx by wrapping all providers in single component.

**Files Likely Touched:**
- `frontend/src/app/AppProviders.tsx` (new file)
- `frontend/src/App.tsx` (simplify to use AppProviders)

**Risk Level:** Low — code organization

**Mitigations:**
- Ensure provider order maintained
- Test app renders correctly

**Tests/Verification:**
- App renders correctly
- All context hooks work

**Acceptance Criteria:**
- [ ] AppProviders wraps all providers
- [ ] App.tsx simplified
- [ ] Provider nesting visible in one file

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

### Phase 6: Test Expansion & Stabilization

**Goal:** Improve test coverage and stabilize the codebase.

---

#### Step 6.1: Add Component Tests for EducationSection

**Purpose:** Establish pattern for section component testing.

**Files Likely Touched:**
- `frontend/tests/components/EducationSection.test.tsx` (new file)
- Test rendering, empty states, filtering, RTL

**Risk Level:** Very Low — adding tests only

**Mitigations:**
- Tests are additive

**Tests/Verification:**
- New tests pass
- Coverage increases

**Acceptance Criteria:**
- [ ] EducationSection test file exists
- [ ] Tests cover rendering, empty states, filtering
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 6.2: Add Component Tests for Remaining Sections

**Purpose:** Replicate Step 6.1 for all section components.

**Files Likely Touched:**
- `frontend/tests/components/ExperiencesSection.test.tsx`
- `frontend/tests/components/SkillsSection.test.tsx`
- `frontend/tests/components/ProjectsSection.test.tsx`
- `frontend/tests/components/PublicationsSection.test.tsx`
- (etc. for all sections)

**Risk Level:** Very Low — adding tests only

**Mitigations:** Same as Step 6.1

**Tests/Verification:** Same as Step 6.1

**Acceptance Criteria:**
- [ ] All sections have test files
- [ ] Tests cover key functionality
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 6.3: Add Filter Context Integration Tests

**Purpose:** Test filter state + component rendering together.

**Files Likely Touched:**
- `frontend/tests/integration/filter-flow.test.tsx` (new file)
- Test filter selection → section filtering

**Risk Level:** Very Low — adding tests only

**Mitigations:** Same as Step 6.1

**Tests/Verification:** Same as Step 6.1

**Acceptance Criteria:**
- [ ] Filter integration tests exist
- [ ] Tests verify filtering works end-to-end
- [ ] Tests pass

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 6.4: Add Language Switching Integration Tests

**Purpose:** Test language change → content update together.

**Files Likely Touched:**
- `frontend/tests/integration/language-switching.test.tsx` (new or enhance)
- Test EN → DE → FA switching

**Risk Level:** Very Low — adding tests only

**Mitigations:** Same as Step 6.1

**Tests/Verification:** Same as Step 6.1

**Acceptance Criteria:**
- [ ] Language switching tests exist
- [ ] Tests verify content updates on language change
- [ ] RTL layout tests for FA

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

#### Step 6.5: Expand E2E Test Coverage

**Purpose:** Add end-to-end tests for critical user flows.

**Files Likely Touched:**
- `frontend/e2e/navigation.spec.ts` (new file)
- `frontend/e2e/language-switch.spec.ts` (enhance)
- `frontend/e2e/contact-form.spec.ts` (new file)
- `frontend/e2e/download-cv.spec.ts` (new file)

**Risk Level:** Very Low — adding tests only

**Mitigations:** Same as Step 6.1

**Tests/Verification:**
- New E2E tests pass
- Critical flows covered

**Acceptance Criteria:**
- [ ] E2E tests cover navigation, language switch, contact, download
- [ ] Tests pass in CI
- [ ] Screenshots uploaded as artifacts

**DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

## 4. Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PHASE DEPENDENCY GRAPH                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌───────────────────┐                                                         │
│   │   PHASE 0         │                                                         │
│   │   CI/CD Hardening │                                                         │
│   │   [0.1 - 0.5]     │                                                         │
│   └─────────┬─────────┘                                                         │
│             │                                                                   │
│             │ (no code dependencies, can run in parallel with Phase 1)          │
│             │                                                                   │
│             ▼                                                                   │
│   ┌───────────────────┐         ┌───────────────────┐                           │
│   │   PHASE 1         │────────►│   PHASE 2         │                           │
│   │   Foundation      │         │   i18n            │                           │
│   │   [1.1 - 1.6]     │         │   Modularization  │                           │
│   │                   │         │   [2.1 - 2.7]     │                           │
│   │   • Utilities     │         │                   │                           │
│   │   • Hook naming   │         │   Depends on:     │                           │
│   │   • Test cleanup  │         │   • 1.4 (naming)  │                           │
│   └─────────┬─────────┘         └─────────┬─────────┘                           │
│             │                             │                                     │
│             │                             │                                     │
│             ▼                             ▼                                     │
│   ┌───────────────────────────────────────────────────┐                         │
│   │                    PHASE 3                         │                         │
│   │                Data Layer Type Safety              │                         │
│   │                    [3.1 - 3.6]                     │                         │
│   │                                                    │                         │
│   │   Depends on:                                      │                         │
│   │   • Phase 1 (utilities, especially date-utils)    │                         │
│   │   • Phase 2 (i18n structure for key mappings)     │                         │
│   └───────────────────────┬───────────────────────────┘                         │
│                           │                                                     │
│                           ▼                                                     │
│   ┌───────────────────────────────────────────────────┐                         │
│   │                    PHASE 4                         │                         │
│   │              Component Restructuring               │                         │
│   │                    [4.1 - 4.8]                     │                         │
│   │                                                    │                         │
│   │   Depends on:                                      │                         │
│   │   • Phase 1 (utilities available)                 │                         │
│   │   • Phase 2 (i18n imports updated)                │                         │
│   │   • Phase 3 (typed data layer)                    │                         │
│   └───────────────────────┬───────────────────────────┘                         │
│                           │                                                     │
│                           ▼                                                     │
│   ┌───────────────────────────────────────────────────┐                         │
│   │                    PHASE 5                         │                         │
│   │              Provider Consolidation                │                         │
│   │                    [5.1 - 5.4]                     │                         │
│   │                                                    │                         │
│   │   Depends on:                                      │                         │
│   │   • Phase 2 (formatters in i18n layer)            │                         │
│   │   • Phase 4 (components updated)                  │                         │
│   └───────────────────────┬───────────────────────────┘                         │
│                           │                                                     │
│                           ▼                                                     │
│   ┌───────────────────────────────────────────────────┐                         │
│   │                    PHASE 6                         │                         │
│   │            Test Expansion & Stabilization          │                         │
│   │                    [6.1 - 6.5]                     │                         │
│   │                                                    │                         │
│   │   Depends on:                                      │                         │
│   │   • All previous phases (testing final state)     │                         │
│   │   • Can run incrementally after each phase        │                         │
│   └───────────────────────────────────────────────────┘                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Step-Level Dependencies (Within Phases)

#### Phase 0: All steps independent (can be done in any order)

#### Phase 1:
- 1.1 → Independent
- 1.2 → Independent
- 1.3 → Independent
- 1.4 → Independent
- 1.5 → Independent
- 1.6 → Independent

#### Phase 2:
- 2.1 → Independent (directory setup)
- 2.2, 2.3, 2.4 → Depend on 2.1 (translation extraction)
- 2.5 → Depends on 2.1 (formatters)
- 2.6 → Depends on 2.2-2.4 (type generation)
- 2.7 → Depends on 2.1-2.6 (final migration)

#### Phase 3:
- 3.1 → Independent
- 3.2 → Depends on 3.1
- 3.3 → Depends on 3.2
- 3.4 → Depends on 3.3
- 3.5 → Depends on 3.4
- 3.6 → Optional, depends on 3.5

#### Phase 4:
- 4.1 → Independent (directory setup)
- 4.2-4.6 → Depend on 4.1, independent of each other
- 4.7 → Can be done anytime after 4.1
- 4.8 → Depends on Phase 2 (i18n keys)

#### Phase 5:
- 5.1 → Independent
- 5.2 → Depends on Phase 2 (formatters extracted)
- 5.3 → Independent
- 5.4 → Depends on 5.1-5.3

#### Phase 6: All steps independent (testing)

---

## 5. Rollback Strategy Notes

### General Rollback Principles

1. **Each PR is independently revertable**: Use `git revert` on any merged PR
2. **Feature flags for major changes**: New i18n loading can coexist with old during transition
3. **Old exports maintained**: During migration, old module paths continue to work
4. **No database migrations**: All changes are frontend code; no data migrations needed

### Phase-Specific Rollback

#### Phase 0 (CI/CD)
- **Rollback**: Revert workflow changes
- **Risk**: Very low, CI config only
- **Recovery time**: Minutes

#### Phase 1 (Utilities)
- **Rollback**: Revert utility extraction PRs; inline logic back into components
- **Risk**: Low, pure refactoring
- **Recovery time**: Hours

#### Phase 2 (i18n)
- **Rollback**: Restore old `lib/i18n.ts` from git history
- **Risk**: Medium, many files affected
- **Mitigation**: Keep old file as backup during transition
- **Recovery time**: Hours

#### Phase 3 (Data Layer)
- **Rollback**: Restore old normalizer from git history
- **Risk**: Medium, core data pipeline
- **Mitigation**: Comprehensive tests before each change
- **Recovery time**: Hours

#### Phase 4 (Components)
- **Rollback**: Restore old component structure from git history
- **Risk**: Medium, many files
- **Mitigation**: Maintain redirects from old paths during transition
- **Recovery time**: Hours to days (depending on scope)

#### Phase 5 (Providers)
- **Rollback**: Restore old provider structure from git history
- **Risk**: Low, internal organization
- **Recovery time**: Hours

#### Phase 6 (Tests)
- **Rollback**: N/A (adding tests only)
- **Risk**: Very low
- **Recovery time**: N/A

### Emergency Rollback Procedure

If a deployed change causes production issues:

1. **Immediate**: Redeploy from last known good commit
   ```bash
   git checkout <last-good-sha>
   npm run build
   # Deploy via Vercel/Netlify CLI or dashboard
   ```

2. **Assessment**: Identify root cause in reverted PR

3. **Fix Forward**: Create new PR with fix, not rollback of rollback

4. **Post-Mortem**: Document what went wrong and update tests

---

## 6. Unknowns + Verification Steps

| Unknown | Why Unknown | Verification Steps |
|---------|-------------|-------------------|
| **Performance impact of JSON i18n loading** | Requires runtime measurement | 1. Benchmark current bundle size<br>2. Implement JSON loading<br>3. Compare bundle size and load time<br>4. If regression, consider bundling JSON |
| **Type generation tool for i18n** | Multiple options exist | 1. Evaluate `typesafe-i18n`, `typed-locale`, custom script<br>2. Choose based on maintenance, features<br>3. Prototype with one language |
| **ESLint boundary plugin compatibility** | Requires testing with current config | 1. Test `eslint-plugin-boundaries` or `eslint-plugin-import`<br>2. Configure rules for layer boundaries<br>3. Verify no false positives |
| **Test coverage baseline** | Not measured | 1. Run `npm run test:coverage`<br>2. Record baseline percentages<br>3. Set improvement targets |
| **CI time impact of more tests** | Depends on test implementation | 1. Measure current CI duration<br>2. Add tests incrementally<br>3. Monitor CI duration<br>4. Implement test sharding if needed |
| **Persian native speaker availability** | External dependency | 1. Identify team member or contractor<br>2. Schedule RTL QA sessions<br>3. Document feedback loop |
| **Tailwind RTL utilities support** | Requires testing with current Tailwind 4 | 1. Test `rtl:` prefix in sample component<br>2. Verify with current tailwind.config.js<br>3. Document if additional config needed |
| **View model layer necessity** | Design decision | 1. Prototype for one section (Education)<br>2. Measure complexity reduction<br>3. Decide whether to implement broadly |

### Pre-Implementation Verification Checklist

Before starting Phase 1, verify:

- [ ] Run `npm run test` — all tests pass
- [ ] Run `npm run test:coverage` — record baseline
- [ ] Run `npm run verify-languages` — EN/DE/FA pass
- [ ] Run `npm run build` — build succeeds
- [ ] Run `npm run lint` — record lint status
- [ ] Note current bundle size (vite-bundle-visualizer)
- [ ] Note current CI duration

---

## 7. Self-Audit

### Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`/reports/rport_refactor_plan.md`).
- [x] I did not leave determinable sections as "unknown".
- [x] For any remaining unknowns, I documented why and how to verify manually.

### Safety Checks

1. ✅ **No changes outside `/reports/`**: Only created `/reports/rport_refactor_plan.md`
2. ✅ **No existing files modified**: This is a new file
3. ✅ **The report file requested by this task exists**: `/reports/rport_refactor_plan.md`
4. ✅ **No section is left "unknown" if determinable**: All sections completed
5. ✅ **Unknown items documented**: See Section 6 for unknowns with verification plans

### Coverage Checklist

| Required Section | Status |
|------------------|--------|
| Principles & safety rules (include constraints reminder) | ✅ Complete |
| Phase overview table: Phase → Goal → Steps count → Risks → Acceptance gates | ✅ Complete |
| Step-by-step plan (detailed) with purpose, file paths, risk, mitigations, tests, acceptance criteria | ✅ Complete (41 steps) |
| Dependency graph (text) | ✅ Complete |
| Rollback strategy notes | ✅ Complete |
| Unknowns + verification steps | ✅ Complete (8 unknowns) |

### Per-Step "Do Not Touch Locked Files" Reminder

Every step in this plan includes the reminder:

> **DO NOT TOUCH LOCKED FILES:** ✓ Reminder included

---

## Evidence Citations Index

| Citation | Description |
|----------|-------------|
| `frontend/src/data/cv.json` | Locked English CV data |
| `frontend/src/data/ramin_de.json` | Locked German CV data |
| `frontend/src/data/ramin_fa.json` | Locked Persian CV data |
| `frontend/tests/locked-files-integrity.test.ts` | Hash integrity test file |
| `frontend/tests/locked_files_hashes.json` | Reference hashes for locked files |
| `.github/workflows/ci.yml` | Main CI workflow |
| `.github/dependabot.yml` | Dependabot configuration |
| `frontend/src/lib/i18n.ts` | Monolithic i18n file (~2001 LOC) |
| `frontend/src/utils/dataNormalizer.ts` | Data normalization with `any` usage |
| `frontend/src/context/LanguageContext.tsx` | Language context with mixed responsibilities |
| `frontend/src/App.tsx:L202-L224` | 8-level provider nesting |
| `frontend/src/components/sections/ProjectsSection.tsx:L34-L47` | Duplicated domain logic |
| `frontend/src/components/sections/ExperiencesSection.tsx:L19-L60` | Local date parsing |
| `frontend/src/components/sections/EducationSection.tsx:L35` | Inline window.matchMedia |
| `frontend/src/hooks/useFilteredData.ts` | Inconsistent hook naming |
| `frontend/tests/dataNormalization.test.ts` | Duplicate test file |
| `frontend/.env.example` | Missing env var documentation |

---

*End of Refactor Plan Report*

*Report generated by: GitHub Copilot Coding Agent*  
*Date: 2026-01-02*  
*Repository: premium-cv-port-land*
