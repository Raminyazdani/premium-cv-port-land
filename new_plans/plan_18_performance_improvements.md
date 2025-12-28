# Plan 18: Performance Improvements

## Title
Address Performance Issues and Deprecated API Usage

---

## Scope

### In Scope
- Replace deprecated API calls (PERF-001)
- Investigate double data load issue (UI-003)
- Remove deprecated functions from cv-data.ts (UNUSED-001)

### Out of Scope
- Bundle size optimization (done in plan_09)
- Core Web Vitals optimization
- Server-side rendering

---

## Symptoms

**What users see:**
- Potential slower initial load
- Double data loading may cause flash

**Developer symptoms:**
- Deprecation warnings in console
- Multiple data load messages

---

## Evidence

### Report References
- [QA_REPORT.md - PERF-001 (Medium)](../qa/reports/QA_REPORT.md#perf-001-deprecated-api-usage-warnings)
- [QA_REPORT.md - UI-003 (Medium)](../qa/reports/QA_REPORT.md#ui-003-double-data-load-on-page-navigation)
- [FRONTEND_REFACTOR_AUDIT.md - UNUSED-001 (Low)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#1-dead-code-paths)

### Console Messages
```
getCVData() is deprecated. Use useCVData() hook instead.
getBasics() is deprecated. Use useCVData() + extractBasics() instead.
getProfiles() is deprecated. Use useCVData() + extractProfiles() instead.
🏁 [CVDataContext] STARTING DATA LOAD FOR: en (appears twice)
```

---

## Fix Strategy

### PERF-001: Replace Deprecated API Calls

#### Step 1: Find deprecated function usage
```bash
grep -rn "getCVData\|getBasics\|getProfiles\|getProfilePhotoUrl\|getCoverPhotoUrl" frontend/src/
```

#### Step 2: Replace with new patterns
```typescript
// Before (deprecated)
import { getCVData, getBasics } from '@/lib/cv-data'
const data = getCVData()
const basics = getBasics()

// After
import { useCVData } from '@/context/CVDataContext'
const { data } = useCVData()
const basics = data?.basics?.[0]
```

#### Step 3: Remove deprecated functions
After all usages removed, delete from cv-data.ts:
- `getCVData()`
- `getBasics()`
- `getProfiles()`
- `getProfilePhotoUrl()`
- `getCoverPhotoUrl()`

### UI-003: Fix Double Data Load

#### Step 1: Investigate cause
The double load is likely caused by React.StrictMode re-rendering in development.

```typescript
// Check App.tsx or main.tsx for StrictMode
<React.StrictMode>
  <App />
</React.StrictMode>
```

#### Step 2: Confirm it's dev-only
StrictMode double-rendering only happens in development. Verify in production build.

#### Step 3: If production issue, add loading guard
```typescript
// CVDataContext.tsx
const loadingRef = useRef(false)

useEffect(() => {
  if (loadingRef.current) return
  loadingRef.current = true
  
  loadData().finally(() => {
    loadingRef.current = false
  })
}, [language])
```

### UNUSED-001: Remove Deprecated Functions

After PERF-001 is complete:

```typescript
// lib/cv-data.ts - Remove these:
export function getCVData() { ... }
export function getBasics() { ... }
export function getProfiles() { ... }
export function getProfilePhotoUrl() { ... }
export function getCoverPhotoUrl() { ... }
```

Keep only helper functions that are still used.

### Files to Modify
- Components using deprecated APIs
- `frontend/src/lib/cv-data.ts`
- `frontend/src/context/CVDataContext.tsx` (if fixing double load)

---

## Acceptance Criteria

- [ ] No deprecation warnings in console
- [ ] No double data load messages (or documented as dev-only)
- [ ] Deprecated functions removed from codebase
- [ ] All components use new hook pattern
- [ ] Build passes

---

## Regression Tests

### Manual Tests
1. Open DevTools console
2. Refresh page
3. Verify no deprecation warnings
4. Verify single data load (in production build)

### Automated Tests
```bash
# Check for deprecated function usage
grep -rn "getCVData\|getBasics\|getProfiles" frontend/src/ | grep -v "cv-data.ts"
# Should return empty after fix
```

---

## Risk & Rollback

### Risk Level: LOW to MEDIUM

**Why:**
- Removing deprecated code is straightforward
- Double load fix needs careful testing

**Rollback:**
Revert changes; deprecation warnings will return but app works.

---

## Dependencies

**Blocks:** None

**Blocked by:** plan_09 (Reduce Bundle Size - stable build baseline)

---

## Commit Message Guidance

### Short
```
refactor(perf): remove deprecated APIs and fix double data load

Replaced getCVData/getBasics/getProfiles with useCVData hook.
Removed deprecated functions. Fixed double data loading.

Fixes: PERF-001, UI-003, UNUSED-001
```

---

*Plan ready for implementation*
