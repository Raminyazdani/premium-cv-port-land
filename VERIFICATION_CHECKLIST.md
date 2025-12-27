# VERIFICATION CHECKLIST

## Phase 1: Automated Validation ✓

Run the key mapping validation test:
```bash
npx tsx src/utils/validateKeyMappings.ts
```

**Expected**: Exit code 0 with message "✅ ALL KEY MAPPINGS ARE CORRECT!"  
**Status**: [ ] PASS / [ ] FAIL

---

## Phase 2: Development Server Testing ✓

### Start the server:
```bash
npm run dev
```

### Test English (default):
- [ ] Page loads without errors
- [ ] Education section shows 4 entries
- [ ] Projects section shows 15+ entries  
- [ ] Experiences section shows 5 entries
- [ ] Publications section shows 3 entries
- [ ] No console errors

### Test German:
- [ ] Click language selector → DE
- [ ] Education section shows entries with German text
- [ ] "Universität des Saarlandes" appears in education
- [ ] Projects section shows entries with German descriptions
- [ ] Experiences section shows entries with German text
- [ ] No "EMPTY" warnings in console
- [ ] Console shows "✅ Education has X entries"

### Test Farsi:
- [ ] Click language selector → FA
- [ ] Page switches to RTL layout
- [ ] Education section shows entries with Farsi text
- [ ] "دانشگاه زارلند" appears in education
- [ ] Projects section shows entries with Farsi descriptions
- [ ] Experiences section shows entries (section name is "سوابق")
- [ ] Workshop/Certifications section shows entries
- [ ] No "EMPTY" warnings in console
- [ ] Console shows "✅ Education has X entries"

### Test Language Persistence:
- [ ] Refresh page - language persists
- [ ] Close browser and reopen - language persists from localStorage

---

## Phase 3: Console Output Verification ✓

Open browser DevTools console and look for:

### Should SEE:
- ✅ "Education has X entries"
- ✅ "Projects has X entries"
- ✅ "Experiences has X entries"
- ✅ "✅ Education: array[X]"
- ✅ "✅ Structure validation passed"

### Should NOT see:
- ❌ "Education array is EMPTY!"
- ❌ "Projects array is EMPTY!"
- ❌ "Experiences array is EMPTY!"
- ❌ "⚠️ All items filtered out!"
- ❌ "❌ NOT AN ARRAY"

---

## Phase 4: Data Integrity Verification ✓

Verify locked files remain unchanged:
```bash
git diff src/data/cv.json
git diff src/data/ramin_de.json  
git diff src/data/ramin_fa.json
```

**Expected**: No output (no changes)  
**Status**: [ ] CONFIRMED

---

## Phase 5: Normalization Test (Optional) ✓

Run the full normalization test suite:
```bash
npx tsx src/utils/testNormalization.ts
```

**Expected**: All sections show ✅ with non-zero entry counts for all languages  
**Status**: [ ] PASS / [ ] FAIL

---

## Final Checklist

- [ ] Automated validation test passes
- [ ] English content displays correctly  
- [ ] German content displays correctly
- [ ] Farsi content displays correctly (with RTL)
- [ ] No console errors or "EMPTY" warnings
- [ ] Language persistence works
- [ ] Locked data files unchanged
- [ ] All manual tests completed

---

## If All Tests Pass:

✅ **BUG FIX VERIFIED**  
✅ **READY FOR PRODUCTION**

## If Any Tests Fail:

1. Check console for specific error messages
2. Review `BUG_FIX_SUMMARY.md` for details
3. Run validation test to identify specific mismatches
4. Verify correct key mappings in `src/config/keyMappings.ts`

---

## Test Results Summary

Date Tested: _______________  
Tested By: _______________

| Test | Status | Notes |
|------|--------|-------|
| Automated Validation | [ ] PASS [ ] FAIL | |
| English Display | [ ] PASS [ ] FAIL | |
| German Display | [ ] PASS [ ] FAIL | |
| Farsi Display | [ ] PASS [ ] FAIL | |
| RTL Layout | [ ] PASS [ ] FAIL | |
| Data Integrity | [ ] PASS [ ] FAIL | |

**Overall Result**: [ ] ALL PASS - READY FOR PRODUCTION
