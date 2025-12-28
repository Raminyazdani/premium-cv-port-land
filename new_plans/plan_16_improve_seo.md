# Plan 16: Improve SEO

## Title
Fix SEO Issues for Multilingual Support

---

## Scope

### In Scope
- Fix dynamic title format across languages (SEO-001)
- Verify hreflang tags work correctly
- Ensure initial HTML lang attribute is appropriate

### Out of Scope
- Adding sitemap.xml
- Server-side rendering
- Social media meta tags enhancement

---

## Symptoms

**What users see:**
- Inconsistent title formats between languages
- Potential SEO ranking issues for multilingual content

---

## Evidence

### Report References
- [QA_REPORT.md - SEO-001 (Medium)](../qa/reports/QA_REPORT.md#seo-001-dynamic-title-not-language-aware)

### Current Behavior
```
EN: "Ramin Yazdani - Biotechnologist & Developer"
FA: "Ramin Yazdani - زیستفناور & توسعهدهنده"  (mixed script)
```

### Expected
Consistent format per language:
- EN: "Ramin Yazdani - Biotechnologist & Developer"
- DE: "Ramin Yazdani - Biotechnologe & Entwickler"
- FA: "رامین یزدانی - زیستفناور و توسعه‌دهنده"

---

## Fix Strategy

### Step 1: Review current SEO implementation
```bash
cat frontend/src/utils/seo.ts
grep -n "title\|document.title" frontend/src/
```

### Step 2: Add translated names and titles
```typescript
// lib/i18n.ts or seo.ts
const seoTitles = {
  en: {
    name: 'Ramin Yazdani',
    title: 'Biotechnologist & Developer',
    separator: ' - '
  },
  de: {
    name: 'Ramin Yazdani',
    title: 'Biotechnologe & Entwickler',
    separator: ' - '
  },
  fa: {
    name: 'رامین یزدانی',
    title: 'زیستفناور و توسعه‌دهنده',
    separator: ' - '
  }
}
```

### Step 3: Update document title on language change
```typescript
// In LanguageContext or seo.ts
useEffect(() => {
  const seo = seoTitles[language]
  document.title = `${seo.name}${seo.separator}${seo.title}`
}, [language])
```

### Step 4: Verify hreflang tags
```html
<!-- Should be dynamically added -->
<link rel="alternate" hreflang="en" href="https://example.com/?lang=en" />
<link rel="alternate" hreflang="de" href="https://example.com/?lang=de" />
<link rel="alternate" hreflang="fa" href="https://example.com/?lang=fa" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

### Step 5: Update meta description per language
```typescript
const descriptions = {
  en: 'CV of Ramin Yazdani - Biotechnologist and Software Developer',
  de: 'Lebenslauf von Ramin Yazdani - Biotechnologe und Softwareentwickler',
  fa: 'رزومه رامین یزدانی - زیستفناور و توسعه‌دهنده نرم‌افزار'
}
```

### Files to Modify
- `frontend/src/utils/seo.ts`
- `frontend/src/lib/i18n.ts` (add SEO translations)
- `frontend/src/context/LanguageContext.tsx` (if SEO update happens there)

---

## Acceptance Criteria

- [ ] Title is fully translated in each language
- [ ] No mixed scripts in Persian title
- [ ] Meta description translated per language
- [ ] hreflang tags present and correct
- [ ] Title updates when language changes

---

## Regression Tests

### Manual Tests
1. Load page in EN → Check tab title is English
2. Switch to DE → Check tab title is German
3. Switch to FA → Check tab title is fully Persian
4. View source → Verify hreflang tags
5. Check meta description in DevTools

### Automated Tests
```typescript
test('document title updates with language', async () => {
  render(<App />)
  
  // Set to German
  await userEvent.click(screen.getByRole('button', { name: /language/i }))
  await userEvent.click(screen.getByText('Deutsch'))
  
  expect(document.title).toContain('Biotechnologe')
})
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Metadata changes only
- No functional impact
- Easy to verify

**Rollback:**
Revert changes if titles break.

---

## Dependencies

**Blocks:** None

**Blocked by:** plan_14 (Fix UX Polish)

---

## Commit Message Guidance

### Short
```
fix(seo): translate document title and meta tags per language

Fixed title format to be fully translated in each language.
Added translated meta descriptions. Verified hreflang tags.

Fixes: SEO-001
```

---

*Plan ready for implementation*
