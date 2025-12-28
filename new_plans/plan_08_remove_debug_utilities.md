# Plan 08: Remove Debug Utilities from Src

## Title
Move Debug Scripts Out of Production Source Directory

---

## Scope

### In Scope
- Move debug/test scripts from `src/utils/` to `scripts/` folder
- Guard remaining console.log statements with `import.meta.env.DEV`
- Remove auto-executing debug code

### Out of Scope
- Adding new linting rules (plan_19)
- Refactoring the utilities themselves
- Performance monitoring removal

---

## Symptoms

**What users see:**
- Console filled with debug messages in development
- Potentially some debug output in production

**Developer symptoms:**
- 29 files contain console statements
- Debug scripts auto-run on import
- Production bundle includes unused debug code

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - DUP-003 (Critical)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#3-debug-utilities-shipped-in-production-source)
- [FRONTEND_REFACTOR_AUDIT.md - BLOAT-002 (High)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#top-files-with-console-statements-debug-bloat)
- [QA_REPORT.md - BUILD-005 (Low)](../qa/reports/QA_REPORT.md#build-005-development-logs-in-production-build)
- [FRONTEND_REFACTOR_AUDIT.md - UNUSED-002 (Low)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#unused-filescomponents)

### Files with Most Console Statements
| File | Count |
|------|-------|
| utils/testNormalization.ts | 54 |
| utils/dataLoader.ts | 28 |
| utils/validateKeyMappings.ts | 26 |
| utils/extractActualKeys.ts | 25 |
| utils/performance.ts | 20 |
| context/CVDataContext.tsx | 20 |

---

## Likely Root Cause

**Mechanism:**
- Debug scripts created during development
- Never moved to a non-bundled location
- `debugNormalizer.ts` has auto-executing code at module level
- No dev/prod guards on console statements

---

## Fix Strategy

### Step 1: Create scripts directory
```bash
mkdir -p frontend/scripts
```

### Step 2: Move debug utilities
```bash
mv frontend/src/utils/testNormalization.ts frontend/scripts/
mv frontend/src/utils/debugNormalizer.ts frontend/scripts/
mv frontend/src/utils/validateKeyMappings.ts frontend/scripts/
mv frontend/src/utils/extractActualKeys.ts frontend/scripts/
```

### Step 3: Update any imports
```bash
grep -rn "testNormalization\|debugNormalizer\|validateKeyMappings\|extractActualKeys" frontend/src/
# Remove or update any imports
```

### Step 4: Guard console statements in remaining files

For production code, wrap console statements:
```typescript
// Before
console.log('Data loaded:', data)

// After
if (import.meta.env.DEV) {
  console.log('Data loaded:', data)
}
```

Priority files to update:
- `frontend/src/utils/dataLoader.ts`
- `frontend/src/context/CVDataContext.tsx`
- `frontend/src/utils/dataNormalizer.ts`

### Step 5: Remove auto-executing code

In `debugNormalizer.ts` (now in scripts/), remove:
```typescript
// Remove this auto-execution block
if (import.meta.env.DEV) {
  console.log('🚀 Running normalization diagnostics...')
  diagnoseNormalization('en')
  diagnoseNormalization('de')
  diagnoseNormalization('fa')
}
```

### Step 6: Verify build
```bash
cd frontend && npm run build
# Check output size decreased
# Verify no debug output in production
```

### Files to Move
- `src/utils/testNormalization.ts` → `scripts/testNormalization.ts`
- `src/utils/debugNormalizer.ts` → `scripts/debugNormalizer.ts`
- `src/utils/validateKeyMappings.ts` → `scripts/validateKeyMappings.ts`
- `src/utils/extractActualKeys.ts` → `scripts/extractActualKeys.ts`

### Files to Modify
- `src/utils/dataLoader.ts` - Guard console logs
- `src/context/CVDataContext.tsx` - Guard console logs
- `src/utils/dataNormalizer.ts` - Guard console logs

---

## Acceptance Criteria

- [ ] Debug scripts moved to `frontend/scripts/`
- [ ] No auto-executing debug code in src/
- [ ] Console statements in production code are guarded
- [ ] Production build has no debug output
- [ ] Build size reduced
- [ ] Tests still pass

---

## Regression Tests

### Manual Tests
1. Run production build
2. Serve and check console for debug messages
3. Verify no runtime errors from missing debug files
4. Confirm scripts still work from new location

### Automated Tests
```bash
# Check for unguarded console.log
grep -rn "console.log" frontend/src/ | grep -v "import.meta.env"
# Should return minimal matches
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Moving files, not deleting
- Scripts not used in runtime
- Guards don't change behavior, just suppress output

**Rollback:**
Move files back; remove guards.

---

## Dependencies

**Blocks:** plan_09 (Reduce Bundle Size - cleaner baseline)

**Blocked by:** None

---

## Commit Message Guidance

### Short
```
refactor(build): move debug utilities to scripts, guard console logs

Moved CLI debug scripts out of src/utils to scripts/ folder.
Added DEV guards to remaining console statements in production code.

Fixes: DUP-003, BLOAT-002, BUILD-005, UNUSED-002
```

---

*Plan ready for implementation*
