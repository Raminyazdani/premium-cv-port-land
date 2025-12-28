# Plan 05: Fix Hardcoded i18n Strings

## Title
Replace Hardcoded English Strings with i18n Translations

---

## Scope

### In Scope
- Add missing translation keys to `lib/i18n.ts`
- Replace hardcoded strings in:
  - ContactSection.tsx (headings, tab labels)
  - ErrorFallback.tsx (error messages)
  - Footer.tsx (Konami hint)
  - Various aria-labels across components
- Handle Persian date format "تاکنون" (I18N-002)

### Out of Scope
- EnhancedUIDemo translations (section removed in plan_01)
- Scattered translation objects in components (addressed in plan_13)
- Adding new languages beyond EN/DE/FA

---

## Symptoms

**What users see:**
- ContactSection shows English "Let's Connect", "Send Message", "Book a Call" in all languages
- Error pages show English-only error messages
- Accessibility labels remain English when using DE/FA

---

## Evidence

### Report References
- [LANGUAGE_AUDIT.md - Hardcoded Strings](../qa/reports/LANGUAGE_AUDIT.md#c1-hardcoded-strings-found)
- [LANGUAGE_STRING_INVENTORY.csv](../qa/reports/LANGUAGE_STRING_INVENTORY.csv)
- [QA_REPORT.md - I18N-002 (Medium)](../qa/reports/QA_REPORT.md#i18n-002-persian-date-format-warning)

### Key Files with Hardcoded Strings
| File | Strings Count | Priority |
|------|---------------|----------|
| ContactSection.tsx | 4 | High |
| ErrorFallback.tsx | 4 | High |
| Footer.tsx | 1 | Medium |
| Various aria-labels | 35+ | Medium |

---

## Likely Root Cause

**Mechanism:**
- Components were created before i18n system was complete
- Developers used English strings as placeholders
- No lint rule prevents hardcoded strings
- aria-labels often overlooked in i18n efforts

---

## Fix Strategy

### Step 1: Add missing keys to i18n.ts

Add to `frontend/src/lib/i18n.ts`:

```typescript
// In UIStrings interface and translations:

// Contact section
contact: {
  title: 'Let\'s Connect' / 'Kontaktieren Sie mich' / 'با من در ارتباط باشید',
  description: 'Whether you want to send a message...',
  send_message: 'Send Message',
  book_call: 'Book a Call',
},

// Error fallback
errors: {
  something_went_wrong: 'Something went wrong',
  error_occurred: 'An error occurred while loading the application',
  error_details: 'Error details',
  try_again: 'Try again',
  runtime_error: 'This spark has encountered a runtime error',
  unexpected: 'Something unexpected happened',
},

// Footer
footer: {
  konami_hint: 'Try the Konami code 🎮',
},

// Accessibility labels
a11y: {
  scroll_progress: 'Page scroll progress',
  previous_skill: 'Previous skill category',
  next_skill: 'Next skill category',
  // ... add all missing labels
}
```

### Step 2: Update ContactSection.tsx
```typescript
// Before
<h2>Let's Connect</h2>

// After
const t = useTranslation()
<h2>{t.contact.title}</h2>
```

### Step 3: Update ErrorFallback.tsx
```typescript
// Use i18n for error messages
const t = useTranslation()
<h2>{t.errors.something_went_wrong}</h2>
```

### Step 4: Update aria-labels
```typescript
// Before
<button aria-label="Previous skill category">

// After
<button aria-label={t.a11y.previous_skill}>
```

### Step 5: Handle Persian "تاکنون" date
In `dataValidator.ts` or `i18n.ts`:
```typescript
const PRESENT_EQUIVALENTS = ['Present', 'present', 'تاکنون', 'Gegenwart', 'heute']

function isValidEndDate(date: string): boolean {
  return PRESENT_EQUIVALENTS.includes(date) || isValidDateFormat(date)
}
```

### Files to Modify
- `frontend/src/lib/i18n.ts` - Add translation keys
- `frontend/src/components/sections/ContactSection.tsx`
- `frontend/src/components/ErrorFallback.tsx`
- `frontend/src/ErrorFallback.tsx` (root version)
- `frontend/src/components/sections/Footer.tsx`
- Multiple components with aria-labels

---

## Acceptance Criteria

- [ ] ContactSection displays translated text in DE/FA
- [ ] ErrorFallback shows translated error messages
- [ ] No console warnings about "تاکنون" date format
- [ ] All high-priority hardcoded strings replaced
- [ ] Build passes
- [ ] Tests pass

---

## Regression Tests

### Manual Tests
1. Load page in DE → Verify ContactSection is German
2. Load page in FA → Verify ContactSection is Persian
3. Trigger error → Verify error page is translated
4. Check RTL layout for FA error page

### Automated Tests
```typescript
test('ContactSection uses translations', async () => {
  // German
  render(<LanguageProvider lang="de"><ContactSection /></LanguageProvider>)
  expect(screen.getByText('Kontaktieren Sie mich')).toBeInTheDocument()
})
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Adding translations doesn't break existing functionality
- Fallbacks ensure graceful degradation
- Changes are additive

**Rollback:**
Revert commits; English fallbacks will still work.

---

## Dependencies

**Blocks:** plan_13 (Consolidate Inline Translations)

**Blocked by:** plan_01 (Remove EnhancedUIDemo - reduces scope)

---

## Commit Message Guidance

### Short
```
feat(i18n): add translations for ContactSection, ErrorFallback, aria-labels

Added missing translation keys and replaced hardcoded English strings
in critical components. Handles Persian "تاکنون" date format.

Fixes: I18N-001 (remaining), I18N-002
```

### Long
```
feat(i18n): replace hardcoded strings with translations

Added translations for:
- ContactSection headings and labels (DE/FA)
- ErrorFallback error messages (DE/FA)
- Footer Konami hint (DE/FA)
- 35+ aria-labels (DE/FA)

Also fixed the Persian date validation to accept "تاکنون"
(meaning "Present") as a valid endDate value.

Files changed:
- lib/i18n.ts: Added ~50 new translation keys
- ContactSection.tsx: Uses t.contact.*
- ErrorFallback.tsx: Uses t.errors.*
- Multiple components: Updated aria-labels

Closes: I18N-002
Partial: I18N-001 (completes after plan_01 removes EnhancedUIDemo)
```

---

*Plan ready for implementation*
