# Quick Script to Complete Remaining Section Localizations

## Pattern to Follow

For each remaining section component, apply this pattern:

### 1. Add import
```typescript
import { useTranslation } from '@/context/LanguageContext'
```

### 2. Get translation hook
```typescript
export function MySection() {
  const t = useTranslation()
  // ... rest of component
}
```

### 3. Replace hardcoded strings

| Hardcoded String | Replace With |
|-----------------|--------------|
| "Education" | `t.sections.education` |
| "Experience" | `t.sections.experiences` |
| "Projects" | `t.sections.projects` |
| "Publications" | `t.sections.publications` |
| "Skills" | `t.sections.skills` |
| "Languages" | `t.sections.languages` |
| "Workshops & Certifications" | `t.sections.certifications` |
| "References" | `t.sections.references` |
| "Contact" | `t.sections.contact` |
| "No X available" | `t.empty.no_X` (e.g., `t.empty.no_education`) |
| "No results" / "No matches" | `t.empty.no_results` |
| "Search" | `t.actions.search` |
| "Filter" / "Filter by" | `t.actions.filter` |
| "Clear" | `t.actions.clear` |
| "View More" | `t.actions.view_more` |
| "View Less" | `t.actions.view_less` |
| "All" (in filters) | `t.filters.all` |
| aria-label="Select theme" | `aria-label={t.a11y.select_theme}` |
| aria-label="Select focus" | `aria-label={t.a11y.select_focus}` |
| aria-label="Open modal" | `aria-label={t.a11y.open_modal}` |
| aria-label="Close modal" | `aria-label={t.a11y.close_modal}` |

## Sections Remaining

### ExperiencesSection.tsx
- [x] Import useTranslation
- [ ] Section title: "Professional Experience" → `t.sections.experiences`
- [ ] Empty state → `t.empty.no_experience`
- [ ] Filter labels → `t.actions.filter`, `t.filters.all`
- [ ] "No results" → `t.empty.no_results`
- [ ] "Clear" → `t.actions.clear`

### PublicationsSection.tsx
- [ ] Import useTranslation
- [ ] Section title: "Publications & Research" → `t.sections.publications`
- [ ] Empty state → `t.empty.no_publications`
- [ ] Status labels: Use existing `t.publications.*` keys
  - "Published" → `t.publications.published`
  - "Submitted" → `t.publications.submitted`
  - "In Review" → `t.publications.in_review`
  - "Waiting" → `t.publications.waiting`
- [ ] "Type" label → `t.publications.type`
- [ ] "Authors" label → `t.publications.authors`
- [ ] "Journal" label → `t.publications.journal`
- [ ] "Year" label → `t.publications.year`
- [ ] "DOI" label → `t.publications.doi`

### SkillsSection.tsx
- [ ] Import useTranslation
- [ ] Section title → `t.sections.skills`
- [ ] Empty state → `t.empty.no_skills`
- [ ] "Proficiency" → `t.skills.proficiency`
- [ ] "Years of Experience" → `t.skills.years`
- [ ] "Category" → `t.skills.category`
- [ ] "All Skills" → `t.skills.all_skills`

### LanguagesSection.tsx
- [ ] Import useTranslation
- [ ] Section title → `t.sections.languages`
- [ ] Empty state → `t.empty.no_languages`
- [ ] "Language" → `t.languages_section.language`
- [ ] "Proficiency" → `t.languages_section.proficiency`
- [ ] Proficiency levels:
  - "Native" → `t.languages_section.native`
  - "Fluent" → `t.languages_section.fluent`
  - "Professional" → `t.languages_section.professional`
  - "Intermediate" → `t.languages_section.intermediate`
  - "Beginner" → `t.languages_section.beginner`
  - "Studying" → `t.languages_section.studying`
- [ ] "Certification" → `t.languages_section.certification`

### WorkshopAndCertificationsSection.tsx
- [ ] Import useTranslation
- [ ] Section title → `t.sections.certifications`
- [ ] Empty state → `t.empty.no_certifications`

### ReferencesSection.tsx
- [ ] Import useTranslation
- [ ] Section title → `t.sections.references`
- [ ] Empty state / "Available on request" → `t.references.available_on_request`
- [ ] "Position" → `t.references.position`
- [ ] "Department" → `t.references.department`
- [ ] "Institution" → `t.references.institution`
- [ ] "Email" → `t.references.email`
- [ ] "Phone" → `t.references.phone`

### ContactSection.tsx
- [ ] Import useTranslation
- [ ] Section title → `t.sections.contact`
- [ ] (ContactForm already updated)

### HeroSection.tsx
- [ ] Check for CTA buttons
- [ ] "Contact Me" → `t.actions.contact_me`
- [ ] "Download CV" → `t.actions.download_cv`

### BasicsSection.tsx
- [ ] Check for any labels
- [ ] "Location" → `t.education.location` or add to basics section
- [ ] "Email" → `t.forms.email` or `t.references.email`

### ProfilesSection.tsx
- [ ] Check for section title
- [ ] Title → `t.sections.profiles`
- [ ] Empty state if applicable

### ThemeSelector.tsx
- [ ] Import useTranslation
- [ ] aria-label → `t.a11y.select_theme`

### FocusFilterSelector.tsx
- [ ] Import useTranslation
- [ ] aria-label → `t.a11y.select_focus`
- [ ] Filter labels → `t.filters.*`
- [ ] "All" → `t.filters.all`
- [ ] "Programming" → `t.filters.programming`
- [ ] "Bioinformatics" → `t.filters.bioinformatics`
- [ ] "Biotechnology" → `t.filters.biotechnology`
- [ ] "Academic" → `t.filters.academic`

### BookingWidget.tsx
- [ ] Check component contents
- [ ] "Book a Call" → `t.actions.book_call`
- [ ] Any other labels → add to i18n and use

### MediaModal.tsx
- [ ] aria-label="Close modal" → `aria-label={t.a11y.close_modal}`
- [ ] Any visible text → use translations

## Validation After Each Update

1. Check TypeScript compilation: `npm run build`
2. Check for console errors in dev: `npm run dev`
3. Test language switching visually
4. Run i18n tests: `npm test src/lib/__tests__/i18n.test.ts`

## Estimated Time

- Each section: 10-15 minutes
- Total remaining: ~2-3 hours of focused work
- Can be done incrementally (one section at a time)

## Tips

1. Use find-and-replace in your editor for common strings
2. Test frequently to catch errors early
3. Check DevTools console for undefined translation warnings
4. Verify RTL layout after updating each section (switch to FA)

## Common Mistakes to Avoid

1. ❌ `<h2>Education</h2>` → Still hardcoded
2. ✅ `<h2>{t.sections.education}</h2>` → Correct

3. ❌ `placeholder="Search..."` → Still hardcoded
4. ✅ `placeholder={t.actions.search}` → Correct

5. ❌ Forgetting to import `useTranslation`
6. ✅ Always import at top of file

7. ❌ Using `t` outside component (in constants at module level)
8. ✅ Use `t` only inside component functions

## Quick Test Command

```bash
# Run all tests including i18n
npm test

# Run only i18n tests
npm test src/lib/__tests__/i18n.test.ts

# Run dev server and test manually
npm run dev
```

## After Completion

Update `I18N_DELIVERABLES.md` with:
- Move completed sections from "Remaining" to "Completed"
- Note any new translation keys added
- Confirm all visual tests passed
