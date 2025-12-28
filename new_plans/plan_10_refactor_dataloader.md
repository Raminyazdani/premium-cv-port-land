# Plan 10: Refactor dataLoader.ts

## Title
Refactor dataLoader.ts to Follow Single Responsibility Principle

---

## Scope

### In Scope
- Split the monolithic `loadAndValidateData()` function
- Create separate functions for each step (load, normalize, validate, sanitize)
- Improve testability by allowing dependency injection

### Out of Scope
- Changing the data normalization logic itself
- Adding new validation rules
- Changes to CV JSON files

---

## Symptoms

**What developers experience:**
- 381 LOC file with 28 console statements
- `loadAndValidateData()` does 5 different things
- Hard to test individual steps
- Debugging requires reading entire function

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - SOLID-002 (High)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#b-dataloaderts)
- [FRONTEND_REFACTOR_AUDIT.md - SOLID-004 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#a-direct-json-imports)

### Current Code (lines 36-140)
```typescript
export async function loadAndValidateData(language: Language) {
  // 1. Load JSON (lines 40-60)
  // 2. Normalize keys (lines 62-75)
  // 3. Validate structure (lines 77-95)
  // 4. Sanitize data (lines 97-120)
  // 5. Log debug info (lines 122-138)
  // All in one 100+ line function
}
```

---

## Likely Root Cause

**Mechanism:**
- Function grew organically as features were added
- No refactoring to extract responsibilities
- Testing required calling entire pipeline

---

## Fix Strategy

### Step 1: Extract loading step
```typescript
// New: loadCVDataForLanguage.ts
export async function loadCVDataForLanguage(language: Language): Promise<RawCVData> {
  switch (language) {
    case 'en': return (await import('@/data/cv.json')).default
    case 'de': return (await import('@/data/ramin_de.json')).default
    case 'fa': return (await import('@/data/ramin_fa.json')).default
  }
}
```

### Step 2: Keep normalize as separate function
Already exists as `normalizeCVData()` in dataNormalizer.ts

### Step 3: Keep validate as separate function
Already exists as `validateCVData()` in dataValidator.ts

### Step 4: Extract sanitization
```typescript
// New: sanitizeData.ts
export function sanitizeData(data: CVData): CVData {
  return {
    ...data,
    education: data.education.filter(isValidEducation),
    projects: deduplicateProjects(data.projects),
    // ... other sanitization
  }
}
```

### Step 5: Create pipeline function
```typescript
// Simplified loadAndValidateData
export async function loadAndValidateData(language: Language) {
  // Step 1: Load
  const rawData = await loadCVDataForLanguage(language)
  
  // Step 2: Normalize
  const normalizedData = normalizeCVData(rawData, language)
  
  // Step 3: Validate
  const validationResult = validateCVData(normalizedData)
  
  // Step 4: Sanitize
  const cleanData = sanitizeData(normalizedData)
  
  // Step 5: Log (dev only)
  if (import.meta.env.DEV) {
    logDataLoadSummary(language, validationResult)
  }
  
  return { data: cleanData, validationResult }
}
```

### Step 6: Update tests
Create unit tests for each extracted function

### Files to Modify
- `frontend/src/utils/dataLoader.ts` - Refactor main function
- Create `frontend/src/utils/sanitizeData.ts`
- Create `frontend/src/utils/loadCVDataForLanguage.ts` (if not exists)
- Update tests

---

## Acceptance Criteria

- [ ] Each step is a separate, testable function
- [ ] `loadAndValidateData()` is < 50 lines
- [ ] Each extracted function has clear input/output types
- [ ] Console statements guarded by DEV check
- [ ] All existing tests pass
- [ ] Data loading behavior unchanged

---

## Regression Tests

### Manual Tests
1. Load each language (EN, DE, FA)
2. Verify data appears correctly
3. Verify console shows validation warnings (dev mode)
4. Verify production build has no debug output

### Unit Tests
```typescript
describe('sanitizeData', () => {
  it('removes invalid entries', () => {
    const data = { education: [validEntry, invalidEntry] }
    const result = sanitizeData(data)
    expect(result.education).toHaveLength(1)
  })
})

describe('loadCVDataForLanguage', () => {
  it('loads English data', async () => {
    const data = await loadCVDataForLanguage('en')
    expect(data.basics).toBeDefined()
  })
})
```

---

## Risk & Rollback

### Risk Level: MEDIUM

**Why medium:**
- Core data loading path
- Need to preserve exact behavior
- Many components depend on this

**Mitigation:**
- Extract one function at a time
- Test after each extraction
- Preserve all edge case handling

**Rollback:**
Revert to monolithic version.

---

## Dependencies

**Blocks:** plan_11 (Refactor CVDataContext)

**Blocked by:** plan_04 (Consolidate Filter Logic - reduces complexity)

---

## Commit Message Guidance

### Short
```
refactor(data): split dataLoader into single-responsibility functions

Extracted loading, sanitization, and logging into separate functions.
loadAndValidateData now orchestrates the pipeline cleanly.

Fixes: SOLID-002, SOLID-004
```

---

*Plan ready for implementation*
