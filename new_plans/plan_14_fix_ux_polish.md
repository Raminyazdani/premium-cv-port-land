# Plan 14: Fix UX/UI Polish Issues

## Title
Address UX and UI Polish Issues from QA Audit

---

## Scope

### In Scope
- Fix testimonials placeholder data (UI-001)
- Remove Konami code hint from footer (UI-002)
- Fix hero role rotation layout shift (UI-004)
- Address other low-priority UI issues (UI-005 through UI-010)

### Out of Scope
- EnhancedUIDemo (removed in plan_01)
- Major redesign
- New features

---

## Symptoms

**What users see:**
- Testimonials with suspicious names ("Dr. Jane Smith", "John Doe")
- "Try the Konami code 🎮" text in professional CV footer
- Minor layout shifts during role rotation
- Various minor polish issues

---

## Evidence

### Report References
- [QA_REPORT.md - UI-001 (Medium)](../qa/reports/QA_REPORT.md#ui-001-testimonials-section-uses-placeholder-data)
- [QA_REPORT.md - UI-002 (Medium)](../qa/reports/QA_REPORT.md#ui-002-try-the-konami-code-easter-egg-in-footer)
- [QA_REPORT.md - UI-004 (Medium)](../qa/reports/QA_REPORT.md#ui-004-hero-role-rotation-may-cause-layout-shift)
- [QA_REPORT.md - UI-005 through UI-010 (Low)](../qa/reports/QA_REPORT.md)

### Issues Summary
| ID | Description | Priority |
|----|-------------|----------|
| UI-001 | Placeholder testimonials | Medium |
| UI-002 | Konami easter egg visible | Medium |
| UI-004 | Hero role layout shift | Medium |
| UI-005 | Cookie consent reappears | Low |
| UI-006 | Quick actions button behavior | Low |
| UI-007 | Skills default expanded | Low |
| UI-008 | Certifications collapsed | Low |
| UI-009 | Reference letters without PDFs | Low |
| UI-010 | Projects without links | Low |

---

## Fix Strategy

### UI-001: Testimonials Placeholder Data

**Option A:** Replace with real testimonials in CV data
```json
// In cv.json (requires user approval for locked file)
"testimonials": [
  {
    "name": "Dr. [Real Name]",
    "position": "Professor at [University]",
    "text": "[Real testimonial]"
  }
]
```

**Option B:** Hide testimonials section if no real data
```typescript
// TestimonialsSection.tsx
if (!testimonials || testimonials.every(t => isPlaceholder(t))) {
  return null // Don't render section
}
```

### UI-002: Remove Konami Hint
```typescript
// Footer.tsx
// Remove or hide the easter egg hint
// Before
<p>Try the Konami code 🎮</p>

// After (either remove or make subtle)
// Option: Remove completely
// Option: Only show if Konami already activated
{konamiActivated && <p>You found the easter egg! 🎮</p>}
```

### UI-004: Fix Hero Layout Shift
```typescript
// HeroSection.tsx
// Add min-height to role rotation container
<div 
  className="min-h-[2rem]" // Prevent layout shift
  aria-live="polite"
>
  {currentRole}
</div>
```

### UI-005: Cookie Consent Persistence
```typescript
// CookieConsentBanner.tsx
// Verify localStorage key is set correctly
useEffect(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent) setShowBanner(false)
}, [])
```

### UI-007 & UI-008: Default Expansion States
These may be intentional design decisions. Document but don't change unless user requests.

### UI-009 & UI-010: Missing Links/PDFs
```typescript
// Only show "View PDF" if URL exists
{reference.pdfUrl && (
  <Button onClick={() => window.open(reference.pdfUrl)}>
    View PDF
  </Button>
)}
```

### Files to Modify
- `frontend/src/components/TestimonialsSection.tsx`
- `frontend/src/components/sections/Footer.tsx`
- `frontend/src/components/sections/HeroSection.tsx`
- `frontend/src/components/CookieConsentBanner.tsx`
- `frontend/src/components/sections/ReferencesSection.tsx`
- `frontend/src/components/sections/ProjectsSection.tsx`

---

## Acceptance Criteria

- [ ] No placeholder testimonials visible (or section hidden)
- [ ] Konami hint removed or hidden
- [ ] No layout shift during hero role rotation
- [ ] Cookie consent respects stored preference
- [ ] View PDF only appears when PDF exists
- [ ] No visual regressions

---

## Regression Tests

### Manual Tests
1. Scroll through all sections
2. Verify testimonials show real data or section hidden
3. Check footer for Konami hint
4. Watch hero section for layout shifts
5. Clear cookies → Verify consent banner appears
6. Accept cookies → Refresh → Verify no banner

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Cosmetic changes
- Each fix is isolated
- No business logic changes

**Rollback:**
Revert individual changes as needed.

---

## Dependencies

**Blocks:** plan_15 (Accessibility - builds on stable UI)

**Blocked by:** plan_01 (Remove EnhancedUIDemo)

---

## Commit Message Guidance

### Short
```
fix(ui): address UX polish issues from QA audit

Fixed testimonials, removed Konami hint, fixed hero layout shift.
Addressed cookie consent and conditional button visibility.

Fixes: UI-001, UI-002, UI-004, UI-005, UI-009, UI-010
```

---

*Plan ready for implementation*
