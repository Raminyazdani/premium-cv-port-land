# Plan 04: Consolidate Filter Logic

## Title
Consolidate Duplicate Filter Logic (FilterContext vs focusFilterManager)

---

## Scope

### In Scope
- Remove `focusFilterManager.ts` and its window event system
- Standardize all sections to use `FilterContext` and `shouldShowEntry()`
- Update sections currently using `getStoredFocusFilter()` and `isVisibleWithFilter()`
- Remove window event listeners from components

### Out of Scope
- Changing filter options or behavior
- UI changes to filter selectors
- Performance optimizations

---

## Symptoms

**What users see:**
- Inconsistent filtering behavior between sections
- Some sections may not update when filter changes
- Filter changes may require page refresh in some sections

**Developer symptoms:**
- Two parallel implementations for the same functionality
- Different behavior: `shouldShowEntry()` vs `isVisibleWithFilter()` have slightly different logic

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - DUP-001 (Critical)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#1-filter-logic-duplication-high-priority)
- [FRONTEND_REFACTOR_AUDIT.md - PATTERN-001 (High)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#1-inconsistent-filter-state-management-across-sections)
- [FRONTEND_REFACTOR_AUDIT.md - PATTERN-002 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#2-custom-window-events-for-state-sync)

### Code Locations
**FilterContext.tsx (lines 74-84):**
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

**focusFilterManager.ts (lines 116-125):**
```typescript
export function isVisibleWithFilter(typeKeys: string[] | null | undefined, currentFilter: FocusFilter): boolean {
  if (currentFilter === 'Full CV') return true
  if (!typeKeys || !Array.isArray(typeKeys)) return false  // Different behavior!
  return typeKeys.includes(currentFilter)  // Exact match vs includes
}
```

### Affected Components
- EducationSection.tsx - uses `useFilter()` ✓
- ReferencesSection.tsx - uses `useFilter()` ✓
- ExperiencesSection.tsx - uses `getStoredFocusFilter()` ✗
- PublicationsSection.tsx - uses `getStoredFocusFilter()` ✗
- SkillsSection.tsx - uses `getStoredFocusFilter()` ✗
- WorkshopAndCertificationsSection.tsx - uses `getStoredFocusFilter()` ✗

---

## Likely Root Cause

**Mechanism:**
Two implementations were created at different times:
1. `FilterContext` - React-idiomatic context-based state
2. `focusFilterManager` - Utility module with localStorage + window events

Components were updated inconsistently, leading to a mix of approaches.

---

## Fix Strategy

### Step 1: Audit all filter usage
```bash
grep -rn "getStoredFocusFilter\|isVisibleWithFilter\|focusFilterManager" frontend/src/
```

### Step 2: Update ExperiencesSection.tsx
Replace:
```typescript
import { getStoredFocusFilter, isVisibleWithFilter } from '@/lib/focusFilterManager'
// ...
const [focusFilter, setFocusFilter] = useState(getStoredFocusFilter())
useEffect(() => {
  window.addEventListener('focusFilterChange', handleFilterChange)
  // ...
})
```

With:
```typescript
import { useFilter, shouldShowEntry } from '@/context/FilterContext'
// ...
const { selectedFocus } = useFilter()
// Remove useEffect listener
```

### Step 3: Repeat for other sections
- PublicationsSection.tsx
- SkillsSection.tsx
- WorkshopAndCertificationsSection.tsx

### Step 4: Delete focusFilterManager.ts
```bash
rm frontend/src/lib/focusFilterManager.ts
```

### Step 5: Update any imports
```bash
grep -rn "focusFilterManager" frontend/src/
# Fix any remaining imports
```

### Step 6: Verify build and tests
```bash
cd frontend && npm run build && npm run test
```

### Files to Modify
- `frontend/src/components/sections/ExperiencesSection.tsx`
- `frontend/src/components/sections/PublicationsSection.tsx`
- `frontend/src/components/sections/SkillsSection.tsx`
- `frontend/src/components/sections/WorkshopAndCertificationsSection.tsx`
- `frontend/src/lib/focusFilterManager.ts` (delete)

---

## Acceptance Criteria

- [ ] All sections use `useFilter()` hook from FilterContext
- [ ] All sections use `shouldShowEntry()` for filtering
- [ ] `focusFilterManager.ts` is deleted
- [ ] No window event listeners for filter changes
- [ ] Filter changes in header update all sections immediately
- [ ] Build passes
- [ ] All tests pass

---

## Regression Tests

### Manual Tests
1. Change filter in header → All sections update immediately
2. Refresh page → Filter persists from localStorage
3. Each section filters correctly when focus is changed
4. "Full CV" shows all items in every section

### Automated Tests to Add
```typescript
test('all sections respond to filter context changes', () => {
  const { rerender } = render(
    <FilterContext value={{ selectedFocus: 'Full CV' }}>
      <EducationSection />
      <ExperiencesSection />
    </FilterContext>
  )
  // Verify items shown

  rerender(
    <FilterContext value={{ selectedFocus: 'Programming' }}>
      <EducationSection />
      <ExperiencesSection />
    </FilterContext>
  )
  // Verify filtering applied consistently
})
```

---

## Risk & Rollback

### Risk Level: MEDIUM

**Why medium:**
- Touching multiple section components
- Behavior change from `includes()` to `some()` matching
- Need to ensure no sections break

**Mitigation:**
- Test each section individually
- Use feature branch

**Rollback:**
Revert the commit(s); can also restore focusFilterManager from git history.

---

## Dependencies

**Blocks:** plan_12 (Create Shared Section Components)

**Blocked by:** plan_01 (Remove EnhancedUIDemo - to reduce noise during testing)

---

## Commit Message Guidance

### Short
```
refactor(filter): consolidate to FilterContext, remove focusFilterManager

Standardized all sections to use FilterContext instead of mixed
approaches. Deleted focusFilterManager.ts and window event system.

Fixes: DUP-001, PATTERN-001, PATTERN-002
```

### Long
```
refactor(filter): unify filter state management in FilterContext

Previously, filter logic was duplicated:
- FilterContext.tsx with shouldShowEntry()
- focusFilterManager.ts with isVisibleWithFilter()

This caused:
- Inconsistent behavior (different matching logic)
- Some sections not updating on filter change
- Extra complexity with window events

Changes:
- Updated ExperiencesSection to use useFilter()
- Updated PublicationsSection to use useFilter()
- Updated SkillsSection to use useFilter()
- Updated WorkshopSection to use useFilter()
- Deleted focusFilterManager.ts
- Removed all window event listeners

All sections now use React context for filter state.

Closes: DUP-001, PATTERN-001, PATTERN-002
```

---

*Plan ready for implementation*
