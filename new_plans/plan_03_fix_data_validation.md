# Plan 03: Fix Data Validation Issues

## Title
Fix Invalid Date Format and Duplicate Entry in CV Data

---

## Scope

### In Scope
- Document the invalid date "2020-9-31" in certification data (DATA-002)
- Document the duplicate project entry (DATA-003)
- Request user approval to modify locked CV JSON files
- If approved, fix the data; if not, improve validation handling

### Out of Scope
- Adding new data validation rules
- Changing the validation system architecture
- Other data quality issues not specifically flagged

---

## Symptoms

**What users see:**
- Console warning: `Certification 0.0: Invalid date format "2020-9-31"`
- Console warning: `Duplicate project entry found at index 3: "Cosmetic Shop Marketplace Template (Django)"`
- These don't cause visible UI bugs but indicate data quality issues

---

## Evidence

### Report References
- [QA_REPORT.md - DATA-002 (High)](../qa/reports/QA_REPORT.md#data-002-invalid-date-format-in-cv-data)
- [QA_REPORT.md - DATA-003 (High)](../qa/reports/QA_REPORT.md#data-003-duplicate-project-entry-detected)

### Console Logs
- [en-console.json](../qa/artifacts/qa_artifacts/console_logs/en-console.json)

---

## Likely Root Cause

**DATA-002 - Invalid Date:**
- The date "2020-9-31" is invalid because September only has 30 days
- This is a data entry error in the CV JSON file
- Likely intended to be "2020-9-30" or "2020-10-1"

**DATA-003 - Duplicate Entry:**
- The project "Cosmetic Shop Marketplace Template (Django)" appears twice
- This is a data entry error from copy-paste during CV editing

---

## Fix Strategy

### Option A: Fix the Data (Requires User Approval)

**⚠️ LOCKED FILES WARNING:**
The following files are locked and require explicit user approval to modify:
- `frontend/src/data/cv.json`
- `frontend/src/data/ramin_de.json`
- `frontend/src/data/ramin_fa.json`

**If user approves:**

### Step 1: Identify the incorrect date
```bash
grep -n "2020-9-31" frontend/src/data/*.json
```

### Step 2: Fix the date
Change `"2020-9-31"` to a valid date (e.g., `"2020-09-30"` or confirm with user)

### Step 3: Identify the duplicate project
```bash
grep -n "Cosmetic Shop Marketplace" frontend/src/data/cv.json
```

### Step 4: Remove the duplicate entry
Delete one of the duplicate project entries

### Step 5: Regenerate locked file hashes
```bash
cd frontend && npm run generate-hashes
```

### Step 6: Verify validation passes
```bash
cd frontend && npm run test
```

---

### Option B: Improve Validation Handling (No Locked File Changes)

If user does NOT approve locked file changes:

### Step 1: Update dataValidator to handle edge cases
In `frontend/src/utils/dataValidator.ts`:
- Make the date validation warning less severe
- Add auto-correction for common date errors
- Skip duplicate entries silently or with info-level log

### Step 2: Update dataLoader sanitization
In `frontend/src/utils/dataLoader.ts`:
- Sanitize invalid dates to nearest valid date
- Filter out exact duplicates during load

---

## Acceptance Criteria

### If Option A (data fix):
- [ ] No "Invalid date format" warnings in console
- [ ] No "Duplicate project entry" warnings in console
- [ ] Locked file hashes updated
- [ ] All tests pass

### If Option B (validation fix):
- [ ] Invalid dates handled gracefully (warning only, not error)
- [ ] Duplicates filtered during data loading
- [ ] No user-visible impact from invalid data

---

## Regression Tests

### Manual Tests
1. Load page → Check console for data validation warnings
2. Verify certifications section renders correctly
3. Verify projects section has no duplicates

### Automated Tests
```typescript
test('data validator handles invalid dates gracefully', () => {
  const data = { certifications: [{ date: '2020-9-31' }] }
  const result = validateCVData(data)
  expect(result.errors).toHaveLength(0) // Warnings OK, errors not
})
```

---

## Risk & Rollback

### Risk Level: LOW (Option A) / VERY LOW (Option B)

**Option A risks:**
- Modifying locked files could trigger integrity test failures
- Need to regenerate hashes after changes

**Option B risks:**
- None significant; just improving error handling

**Rollback:**
Revert changes; locked file hashes in version control

---

## Dependencies

**Blocks:** None

**Blocked by:** None (can run in parallel with plans 01-02)

---

## Commit Message Guidance

### Short (Option A)
```
fix(data): correct invalid date and remove duplicate project

Fixed CV data issues:
- Changed invalid date "2020-9-31" to valid format
- Removed duplicate project entry

Fixes: DATA-002, DATA-003
```

### Short (Option B)
```
fix(validation): handle invalid dates and duplicates gracefully

Updated data validation to:
- Warn but not error on invalid dates
- Auto-filter duplicate entries during load

Fixes: DATA-002, DATA-003
```

---

*Plan ready for implementation (pending user decision on locked files)*
