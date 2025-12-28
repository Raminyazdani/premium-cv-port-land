# Master Remediation Plan

**Generated:** 2025-12-28  
**Repository:** premium-cv-port-land  
**Purpose:** Prioritized roadmap to address all issues from QA audits

---

## A) Executive Summary

### Total Issues Found

| Source | Blocker/Critical | High | Medium | Low | Total |
|--------|------------------|------|--------|-----|-------|
| QA Visual/Functional Audit | 1 | 8 | 14 | 9 | 32 |
| Frontend Refactor Audit | 3 | 6 | 8 | 5 | 22 |
| Language Audit | 0 | 1 | 1 | 1 | 3 |
| **Unique Issues (after dedup)** | **4** | **12** | **18** | **12** | **46** |

### Categories

| Category | Count |
|----------|-------|
| Product Relevance / Scope | 3 |
| Data Binding / Correctness | 5 |
| i18n / Translations | 4 |
| Build / Performance | 6 |
| Network / Assets | 3 |
| Code Architecture / SOLID | 8 |
| Code Duplication | 5 |
| State Management | 3 |
| UX / UI Polish | 6 |
| Accessibility | 3 |
| Testing | 1 |
| Backend Requirements | 2 |

### Top 10 Highest Impact Fixes

1. **SCOPE-001**: Remove EnhancedUIDemo section (irrelevant demo content breaks CV flow)
2. **DUP-001**: Consolidate filter logic (FilterContext vs focusFilterManager creates inconsistencies)
3. **DATA-001**: Fix footer "Unknown" name bug (data binding issue)
4. **I18N-001**: Address hardcoded English strings in EnhancedUIDemo, ContactSection, ErrorFallback
5. **BUILD-002**: Reduce bundle size (818KB main + 436KB SkillsViz exceeds limits)
6. **DUP-003**: Move debug utilities out of production bundle
7. **PATTERN-001**: Standardize section filter state management
8. **NET-001**: Fix Cloudinary 404 errors for images
9. **SOLID-002**: Refactor dataLoader.ts (SRP violation)
10. **DUP-002**: Consolidate scattered inline translations to i18n.ts

---

## B) Dependency Graph & Ordering Rationale

### Execution Phases

```
Phase 1: BLOCKERS (Must fix first)
    ├── plan_01: Remove EnhancedUIDemo (SCOPE-001, I18N-001, SCOPE-002, SCOPE-003)
    ├── plan_02: Fix footer "Unknown" bug (DATA-001)
    └── plan_03: Fix data validation issues (DATA-002, DATA-003)

Phase 2: CORRECTNESS (After blockers resolved)
    ├── plan_04: Consolidate filter logic (DUP-001, PATTERN-001, PATTERN-002)
    ├── plan_05: Fix i18n hardcoded strings (I18N scattered)
    └── plan_06: Fix network/asset issues (NET-001, NET-002)

Phase 3: BUILD HEALTH (After correctness)
    ├── plan_07: Fix CSS/build warnings (BUILD-001, BUILD-003, BUILD-004)
    ├── plan_08: Remove debug utilities from src (DUP-003, UNUSED-002)
    └── plan_09: Reduce bundle size (BUILD-002)

Phase 4: ARCHITECTURE (After build is clean)
    ├── plan_10: Refactor dataLoader.ts (SOLID-002, SOLID-004)
    ├── plan_11: Refactor CVDataContext.tsx (SOLID-001)
    ├── plan_12: Create SectionWrapper & useFilteredData (PATTERN-004, DESIGN-001)
    └── plan_13: Consolidate inline translations (DUP-002)

Phase 5: POLISH & A11Y (After architecture stable)
    ├── plan_14: Fix UX issues (UI-001 through UI-010)
    ├── plan_15: Fix accessibility issues (A11Y-001, A11Y-002, A11Y-003)
    └── plan_16: Improve SEO (SEO-001)

Phase 6: OPTIONAL / FUTURE
    ├── plan_17: Backend decisions (contact form, booking)
    ├── plan_18: Performance improvements (PERF-001, PERF-002)
    └── plan_19: Code quality guardrails (TEST-001, STYLE-001)
```

### Why This Order?

1. **Blockers first**: EnhancedUIDemo is the top blocker because it:
   - Breaks the CV user journey
   - Contains duplicate functionality (language carousel)
   - Shows fake/demo data instead of CV content
   - Cannot be translated (all English hardcoded)

2. **Correctness before architecture**: 
   - Must fix visible user-facing bugs (footer "Unknown", asset 404s) before refactoring
   - Data validation issues can cause silent corruption

3. **Build health before refactoring**:
   - CSS warnings and debug code in bundle add noise to debugging
   - Clean builds make architectural changes easier to verify

4. **Architecture after basics**:
   - SOLID refactors require stable baseline
   - Component extraction (SectionWrapper) depends on knowing current patterns work

5. **Polish last**:
   - UX tweaks are lower risk and less urgent
   - A11y improvements can be done incrementally

---

## C) Milestones

### Milestone 1: Site Renders Correctly in EN/DE/FA
**Goal:** No undefined strings, correct RTL, all sections render

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_01 | Remove EnhancedUIDemo | None |
| plan_02 | Fix footer name bug | None |
| plan_03 | Fix data validation | None |
| plan_05 | Fix hardcoded i18n strings | plan_01 |
| plan_06 | Fix network/asset issues | None |

**Acceptance:** All three languages load, no "undefined" visible, RTL works for FA

---

### Milestone 2: Language System Stable
**Goal:** All UI strings from i18n.ts, no scattered translations

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_04 | Consolidate filter logic | plan_01 |
| plan_13 | Consolidate inline translations | plan_05 |

**Acceptance:** `grep -r "translations = {" src/` returns 0 matches (except i18n.ts)

---

### Milestone 3: UI Correctness & Polish
**Goal:** Remove irrelevant components, fix carousel, polish spacing

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_14 | Fix UX issues | plan_01 |

**Acceptance:** Expert review scores ≥ 4/5 across sections

---

### Milestone 4: Architecture Cleanup
**Goal:** Reduce bloat, shared components, SOLID-compliant code

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_07 | Fix CSS/build warnings | None |
| plan_08 | Remove debug utilities | None |
| plan_09 | Reduce bundle size | plan_01, plan_08 |
| plan_10 | Refactor dataLoader | plan_04 |
| plan_11 | Refactor CVDataContext | plan_10 |
| plan_12 | Create shared components | plan_04, plan_11 |

**Acceptance:** No files > 400 LOC, no console.log in production, bundle < 500KB

---

### Milestone 5: Backend Decisions
**Goal:** Determine if/how to implement contact form & booking

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_17 | Backend scope decision | Milestone 4 |

**Acceptance:** Decision documented, third-party or custom approach chosen

---

### Milestone 6: Performance, A11y & Final QA
**Goal:** Pass Lighthouse, fix a11y issues, final verification

| Plan | Description | Blocks |
|------|-------------|--------|
| plan_15 | Fix accessibility issues | plan_14 |
| plan_16 | SEO improvements | plan_14 |
| plan_18 | Performance improvements | plan_09 |
| plan_19 | Code quality guardrails | Milestone 4 |

**Acceptance:** Lighthouse ≥ 90, axe scan passes, no regressions

---

## D) Issue Mapping Table

| QA Issue ID | Report Section | Plan # | Status |
|-------------|----------------|--------|--------|
| SCOPE-001 | QA_REPORT.md - Blockers | plan_01 | Planned |
| SCOPE-002 | QA_REPORT.md - Medium | plan_01 | Planned |
| SCOPE-003 | QA_REPORT.md - Medium | plan_01 | Planned |
| DATA-001 | QA_REPORT.md - High | plan_02 | Planned |
| DATA-002 | QA_REPORT.md - High | plan_03 | Planned |
| DATA-003 | QA_REPORT.md - High | plan_03 | Planned |
| I18N-001 | QA_REPORT.md - High | plan_01, plan_05 | Planned |
| I18N-002 | QA_REPORT.md - Medium | plan_05 | Planned |
| BUILD-001 | QA_REPORT.md - High | plan_07 | Planned |
| BUILD-002 | QA_REPORT.md - High | plan_09 | Planned |
| BUILD-003 | QA_REPORT.md - Medium | plan_07 | Planned |
| BUILD-004 | QA_REPORT.md - Medium | plan_07 | Planned |
| BUILD-005 | QA_REPORT.md - Low | plan_08 | Planned |
| NET-001 | QA_REPORT.md - High | plan_06 | Planned |
| NET-002 | QA_REPORT.md - High | plan_06 | Planned |
| NET-003 | QA_REPORT.md - Medium | plan_06 | Planned |
| PERF-001 | QA_REPORT.md - Medium | plan_18 | Planned |
| PERF-002 | QA_REPORT.md - Low | plan_14 | Planned |
| A11Y-001 | QA_REPORT.md - Medium | plan_15 | Planned |
| A11Y-002 | QA_REPORT.md - Medium | plan_15 | Planned |
| A11Y-003 | QA_REPORT.md - Low | plan_15 | Planned |
| UI-001 | QA_REPORT.md - Medium | plan_14 | Planned |
| UI-002 | QA_REPORT.md - Medium | plan_14 | Planned |
| UI-003 | QA_REPORT.md - Medium | plan_18 | Planned |
| UI-004 | QA_REPORT.md - Medium | plan_14 | Planned |
| UI-005 | QA_REPORT.md - Low | plan_14 | Planned |
| UI-006 | QA_REPORT.md - Low | plan_14 | Planned |
| UI-007 | QA_REPORT.md - Low | plan_14 | Planned |
| UI-008 | QA_REPORT.md - Low | plan_14 | Planned |
| UI-009 | QA_REPORT.md - Low | plan_14 | Planned |
| UI-010 | QA_REPORT.md - Low | plan_14 | Planned |
| SEO-001 | QA_REPORT.md - Medium | plan_16 | Planned |
| DUP-001 | FRONTEND_REFACTOR_AUDIT.md | plan_04 | Planned |
| DUP-002 | FRONTEND_REFACTOR_AUDIT.md | plan_13 | Planned |
| DUP-003 | FRONTEND_REFACTOR_AUDIT.md | plan_08 | Planned |
| BLOAT-001 | FRONTEND_REFACTOR_AUDIT.md | plan_09 | Planned |
| BLOAT-002 | FRONTEND_REFACTOR_AUDIT.md | plan_08 | Planned |
| SOLID-001 | FRONTEND_REFACTOR_AUDIT.md | plan_11 | Planned |
| SOLID-002 | FRONTEND_REFACTOR_AUDIT.md | plan_10 | Planned |
| SOLID-003 | FRONTEND_REFACTOR_AUDIT.md | plan_19 | Planned |
| SOLID-004 | FRONTEND_REFACTOR_AUDIT.md | plan_10 | Planned |
| PATTERN-001 | FRONTEND_REFACTOR_AUDIT.md | plan_04 | Planned |
| PATTERN-002 | FRONTEND_REFACTOR_AUDIT.md | plan_04 | Planned |
| PATTERN-003 | FRONTEND_REFACTOR_AUDIT.md | plan_19 | Planned |
| PATTERN-004 | FRONTEND_REFACTOR_AUDIT.md | plan_12 | Planned |
| UNUSED-001 | FRONTEND_REFACTOR_AUDIT.md | plan_18 | Planned |
| UNUSED-002 | FRONTEND_REFACTOR_AUDIT.md | plan_08 | Planned |
| STYLE-001 | FRONTEND_REFACTOR_AUDIT.md | plan_19 | Planned |
| TEST-001 | FRONTEND_REFACTOR_AUDIT.md | plan_19 | Planned |
| DESIGN-001 | FRONTEND_REFACTOR_AUDIT.md | plan_12 | Planned |
| Hardcoded Strings | LANGUAGE_AUDIT.md | plan_05 | Planned |
| Scattered Translations | LANGUAGE_AUDIT.md | plan_13 | Planned |
| Contact Form Backend | BACKEND_REQUIREMENTS_AUDIT.md | plan_17 | Planned |
| Booking Backend | BACKEND_REQUIREMENTS_AUDIT.md | plan_17 | Planned |

---

## E) What We Will NOT Do

### Explicitly Out of Scope

1. **Complete rewrite** - We will refactor incrementally, not rewrite from scratch
2. **New language additions** - Only fixing existing EN/DE/FA; not adding languages
3. **Backend implementation** - Plan_17 is decision-only; implementation is a separate effort
4. **Design system overhaul** - We will extract shared components, not redesign visuals
5. **New features** - No new sections, animations, or functionality beyond fixes
6. **CI/CD changes** - No workflow modifications unless required for a fix
7. **Dependency major upgrades** - Only patch/minor updates if needed for fixes
8. **Mobile app / PWA enhancements** - PWA icon fix only; no new PWA features
9. **Third-party integrations** - No new analytics, CMS, or service integrations
10. **Automated testing infrastructure** - We note missing tests but don't add test framework changes

### Why These Exclusions?

- **Focus**: Keeps remediation scoped to existing issues
- **Risk**: Avoids introducing new bugs through scope creep
- **Time**: Allows faster completion of critical fixes
- **Stability**: Maintains working functionality while fixing problems

---

## F) Plan Files Summary

| Plan # | Title | Priority | Effort | Issues Covered |
|--------|-------|----------|--------|----------------|
| plan_01 | Remove EnhancedUIDemo Section | Blocker | S | SCOPE-001, SCOPE-002, SCOPE-003, I18N-001 (partial) |
| plan_02 | Fix Footer "Unknown" Name Bug | High | S | DATA-001 |
| plan_03 | Fix Data Validation Issues | High | S | DATA-002, DATA-003 |
| plan_04 | Consolidate Filter Logic | High | M | DUP-001, PATTERN-001, PATTERN-002 |
| plan_05 | Fix Hardcoded i18n Strings | High | M | I18N-001, I18N-002, Hardcoded Strings |
| plan_06 | Fix Network/Asset Issues | High | M | NET-001, NET-002, NET-003 |
| plan_07 | Fix CSS/Build Warnings | Medium | S | BUILD-001, BUILD-003, BUILD-004 |
| plan_08 | Remove Debug Utilities from Src | Medium | S | DUP-003, BLOAT-002, BUILD-005, UNUSED-002 |
| plan_09 | Reduce Bundle Size | High | L | BUILD-002, BLOAT-001 |
| plan_10 | Refactor dataLoader.ts | Medium | M | SOLID-002, SOLID-004 |
| plan_11 | Refactor CVDataContext.tsx | Medium | M | SOLID-001 |
| plan_12 | Create Shared Section Components | Medium | L | PATTERN-004, DESIGN-001 |
| plan_13 | Consolidate Inline Translations | Medium | M | DUP-002, Scattered Translations |
| plan_14 | Fix UX/UI Polish Issues | Low | M | UI-001 through UI-010, PERF-002 |
| plan_15 | Fix Accessibility Issues | Medium | M | A11Y-001, A11Y-002, A11Y-003 |
| plan_16 | Improve SEO | Low | S | SEO-001 |
| plan_17 | Backend Scope Decision | Low | S | Contact Form, Booking |
| plan_18 | Performance Improvements | Low | M | PERF-001, UI-003, UNUSED-001 |
| plan_19 | Code Quality Guardrails | Low | M | TEST-001, STYLE-001, PATTERN-003, SOLID-003 |

---

## G) Self-Audit Checklist

- [x] All QA_REPORT.md issues mapped to plans
- [x] All FRONTEND_REFACTOR_AUDIT.md issues mapped to plans
- [x] All BACKEND_REQUIREMENTS_AUDIT.md items mapped (as plan_17)
- [x] All LANGUAGE_AUDIT.md issues mapped to plans
- [x] Dependencies documented for each phase
- [x] Milestones have clear acceptance criteria
- [x] Out-of-scope items explicitly listed
- [x] Plan ordering is feasible (no circular dependencies)
- [x] Each plan covers exactly one cohesive topic

---

## H) Next Steps

1. Review this MASTER_PLAN.md for accuracy
2. Create individual plan files (plan_01.md through plan_19.md)
3. Execute plans in order, starting with Phase 1 (Blockers)
4. Update this document as plans are completed

---

*Generated by QA Consolidation Agent*
