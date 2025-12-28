# Plan 02: Fix Footer "Unknown" Name Bug

## Title
Fix Footer Displaying "Unknown" Instead of Actual Name

---

## Scope

### In Scope
- Fix the data binding issue in Footer.tsx that causes "Unknown" to appear
- Ensure the owner's name displays correctly in all three languages
- Verify the fix works with the existing CVDataContext

### Out of Scope
- Footer redesign or styling changes
- Removing the Konami code easter egg (separate issue UI-002)
- Other footer functionality changes

---

## Symptoms

**What users see:**
- Footer copyright shows "© 2025 Unknown. All rights reserved."
- Expected: "© 2025 Ramin Yazdani. All rights reserved."
- Occurs in all three languages (EN, DE, FA)

---

## Evidence

### Report References
- [QA_REPORT.md - DATA-001 (High)](../qa/reports/QA_REPORT.md#data-001-footer-displays-unknown-instead-of-actual-name)

### Console Evidence
```
Page snapshot shows: paragraph: © 2025 Unknown. All rights reserved.
```

### Expert Review
- **Footer PM Score:** 3/5
- **Footer CV Score:** 2/5 - "Unknown name bug"

---

## Likely Root Cause

**Mechanism:**
The Footer component attempts to extract the owner's name from CV data, but:
1. The data path to `basics[0].fname` + `basics[0].lname` may not be correctly accessed
2. OR: The fallback value "Unknown" is being used when data exists
3. OR: The component renders before CVDataContext has loaded

**Suspected Code Path:**
```
Footer.tsx
└── useCVData() or similar hook
    └── Attempts to get fullName
        └── Uses "Unknown" as fallback
            └── But fallback triggers incorrectly
```

---

## Fix Strategy

### Step 1: Locate the Footer component
```bash
cat frontend/src/components/sections/Footer.tsx | head -50
```

### Step 2: Find the name extraction logic
Look for:
- `fullName`, `name`, `fname`, `lname` variables
- Fallback logic like `|| 'Unknown'` or `?? 'Unknown'`
- useCVData() hook usage

### Step 3: Debug the data path
```typescript
// Add temporary debug logging
console.log('CV Data in Footer:', cvData?.basics)
```

### Step 4: Fix the extraction
Common fixes:
```typescript
// Before (likely broken)
const fullName = cvData?.name || 'Unknown'

// After (correct path)
const basics = cvData?.basics?.[0]
const fullName = basics 
  ? `${basics.fname} ${basics.lname}`.trim() 
  : 'Unknown'
```

### Step 5: Verify the fix
```bash
cd frontend && npm run dev
# Check footer in all 3 languages
```

### Files to Inspect
- `frontend/src/components/sections/Footer.tsx` - Main fix location
- `frontend/src/context/CVDataContext.tsx` - Verify data shape
- `frontend/src/types/cv.ts` - Check type definitions

---

## Acceptance Criteria

- [ ] Footer displays "© 2025 Ramin Yazdani. All rights reserved." (or localized name)
- [ ] Works correctly in EN, DE, and FA languages
- [ ] No "Unknown" appears in footer
- [ ] Build completes without errors
- [ ] No TypeScript errors introduced

---

## Regression Tests

### Manual Tests
1. Load EN version → Check footer shows correct name
2. Load DE version → Check footer shows correct name
3. Load FA version → Check footer shows correct name (RTL layout)
4. Hard refresh page → Verify name appears on first load (not after delay)

### Automated Tests to Add
```typescript
test('Footer displays owner name correctly', async () => {
  render(<Footer />)
  await waitFor(() => {
    expect(screen.getByText(/Ramin Yazdani/i)).toBeInTheDocument()
  })
  expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument()
})
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low risk:**
- Isolated to Footer component
- Simple data binding fix
- No business logic changes

**Rollback:**
Revert the single commit if issues arise.

---

## Dependencies

**Blocks:** None

**Blocked by:** None (can run in parallel with plan_01)

---

## Commit Message Guidance

### Short
```
fix(data): display correct owner name in footer

Fixed data binding issue where footer showed "Unknown" instead of
the actual owner name from CV basics data.

Fixes: DATA-001
```

### Long
```
fix(data): correct footer name extraction from CV data

The footer component was showing "Unknown" because the data
path to extract the owner's name was incorrect. The fix:

- Correctly accesses cvData.basics[0].fname and .lname
- Combines first and last name properly
- Maintains fallback for edge cases (empty data)

Verified working in EN, DE, and FA language modes.

Closes: DATA-001
```

---

*Plan ready for implementation*
