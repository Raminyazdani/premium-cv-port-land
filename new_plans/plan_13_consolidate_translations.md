# Plan 13: Consolidate Inline Translations

## Title
Move Scattered Translation Objects to Centralized i18n.ts

---

## Scope

### In Scope
- Move inline translation objects from components to lib/i18n.ts
- Update components to use centralized translations
- Remove duplicate translation definitions

### Out of Scope
- Adding new translations (done in plan_05)
- Switching to i18next library
- Refactoring the i18n system architecture

---

## Symptoms

**What developers experience:**
- Translation strings in 4+ different component files
- Difficult to find all translations for a language
- Risk of inconsistent translations
- Harder to update/maintain

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - DUP-002 (Critical)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#2-inline-translations-pattern-medium-priority)
- [LANGUAGE_AUDIT.md - Scattered Translation Objects](../qa/reports/LANGUAGE_AUDIT.md#a4-scattered-translation-objects)

### Files with Inline Translations
| Component | Lines | Translation Keys |
|-----------|-------|------------------|
| ProjectCaseStudy.tsx | 39-97 | 17 keys |
| SkillsVisualizationDashboard.tsx | 50-93 | 12 keys |
| CookieConsentBanner.tsx | 24-56 | 6 keys |
| TestimonialsSection.tsx | 31-126 | 9 keys |

### Example Pattern
```typescript
// Current: Inline translation object
const caseStudyTranslations = {
  en: {
    viewCaseStudy: 'View Case Study',
    closeCase: 'Close Case Study',
    // ...
  },
  de: {
    viewCaseStudy: 'Fallstudie anzeigen',
    // ...
  },
  fa: {
    viewCaseStudy: 'مشاهده مطالعه موردی',
    // ...
  }
}

// Usage
const t = caseStudyTranslations[language]
```

---

## Likely Root Cause

**Mechanism:**
- Components created independently of i18n system
- Developers added translations inline for convenience
- No lint rule enforcing centralized translations

---

## Fix Strategy

### Step 1: Identify all inline translations
```bash
grep -rn "translations = {" frontend/src/components/
grep -rn "Translations = {" frontend/src/components/
```

### Step 2: Add keys to i18n.ts
```typescript
// lib/i18n.ts - Add to UIStrings interface
interface UIStrings {
  // Existing keys...
  
  caseStudy: {
    viewCaseStudy: string
    closeCase: string
    overview: string
    challenge: string
    solution: string
    results: string
    technologies: string
    // ...
  }
  
  charts: {
    skillDistribution: string
    topSkills: string
    proficiencyLevels: string
    // ...
  }
  
  cookies: {
    message: string
    acceptAll: string
    decline: string
    customize: string
    // ...
  }
  
  testimonials: {
    title: string
    previous: string
    next: string
    // ...
  }
}
```

### Step 3: Add translations for each language
```typescript
// In en, de, fa translation objects
en: {
  caseStudy: {
    viewCaseStudy: 'View Case Study',
    closeCase: 'Close Case Study',
    // ...
  }
}

de: {
  caseStudy: {
    viewCaseStudy: 'Fallstudie anzeigen',
    closeCase: 'Fallstudie schließen',
    // ...
  }
}
```

### Step 4: Update components
```typescript
// ProjectCaseStudy.tsx
// Before
const t = caseStudyTranslations[language]

// After
const t = useTranslation()
// Use t.caseStudy.viewCaseStudy instead of t.viewCaseStudy
```

### Step 5: Remove inline translation objects
Delete the local translation objects after migration.

### Step 6: Verify no remaining inline translations
```bash
grep -rn "translations = {" frontend/src/components/
# Should return empty (except possibly test files)
```

### Files to Modify
- `frontend/src/lib/i18n.ts` - Add translation keys
- `frontend/src/components/ProjectCaseStudy.tsx`
- `frontend/src/components/SkillsVisualizationDashboard.tsx`
- `frontend/src/components/CookieConsentBanner.tsx`
- `frontend/src/components/TestimonialsSection.tsx`

---

## Acceptance Criteria

- [ ] All inline translation objects moved to i18n.ts
- [ ] Components use useTranslation() hook
- [ ] No remaining `xxxTranslations = {` patterns in components
- [ ] All translations work in EN/DE/FA
- [ ] TypeScript types updated for new keys

---

## Regression Tests

### Manual Tests
1. View ProjectCaseStudy in DE → Verify German text
2. View SkillsVisualization in FA → Verify Persian text
3. Cookie banner in all languages
4. Testimonials section in all languages

### Automated Tests
```typescript
// Lint-like test
test('no inline translations in components', () => {
  const componentsPath = 'src/components'
  const files = glob.sync(`${componentsPath}/**/*.tsx`)
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    expect(content).not.toMatch(/translations\s*=\s*\{/)
  }
})
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Moving translations, not changing them
- Incremental migration possible
- No runtime behavior change

**Rollback:**
Keep inline translations as backup during migration.

---

## Dependencies

**Blocks:** None

**Blocked by:** plan_05 (Fix Hardcoded i18n - establishes i18n patterns)

---

## Commit Message Guidance

### Short
```
refactor(i18n): consolidate inline translations to lib/i18n.ts

Moved translation objects from 4 components to centralized location.
Components now use useTranslation() hook consistently.

Fixes: DUP-002
```

### Long
```
refactor(i18n): centralize all translations in lib/i18n.ts

Previously, 4 components defined their own translation objects:
- ProjectCaseStudy.tsx: caseStudyTranslations
- SkillsVisualizationDashboard.tsx: chartTranslations
- CookieConsentBanner.tsx: consentTranslations
- TestimonialsSection.tsx: testimonialTranslations

This made it hard to:
- Find all translations for a language
- Ensure consistency across components
- Update translations in one place

Changes:
- Added ~44 translation keys to i18n.ts
- Updated 4 components to use useTranslation()
- Removed inline translation objects

Closes: DUP-002
Related: LANGUAGE_AUDIT scattered translations
```

---

*Plan ready for implementation*
