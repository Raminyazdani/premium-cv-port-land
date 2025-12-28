# Plan 15: Fix Accessibility Issues

## Title
Address Accessibility Issues from QA Audit

---

## Scope

### In Scope
- Fix PWA icon manifest error (A11Y-001)
- Update deprecated apple-mobile-web-app-capable meta tag (A11Y-002)
- Add missing aria-labels to icon-only buttons (A11Y-003)

### Out of Scope
- Full WCAG 2.1 AA audit
- Screen reader testing infrastructure
- Keyboard navigation overhaul

---

## Symptoms

**What users see:**
- PWA installation may show error
- Screen readers may not describe some buttons

**Developer symptoms:**
- Console error about manifest icon
- Deprecation warning for meta tag
- Missing aria-labels in accessibility audits

---

## Evidence

### Report References
- [QA_REPORT.md - A11Y-001 (Medium)](../qa/reports/QA_REPORT.md#a11y-001-pwa-icon-manifest-warning)
- [QA_REPORT.md - A11Y-002 (Medium)](../qa/reports/QA_REPORT.md#a11y-002-deprecated-apple-web-app-meta-tag)
- [QA_REPORT.md - A11Y-003 (Low)](../qa/reports/QA_REPORT.md#a11y-003-some-buttons-missing-descriptive-labels)

### Console Messages
```
Error while trying to use the following icon from the Manifest: http://localhost:4173/icon...
<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated
```

---

## Fix Strategy

### A11Y-001: PWA Icon Manifest

#### Step 1: Check manifest.json for icon paths
```bash
cat frontend/public/manifest.json | grep -A5 "icons"
```

#### Step 2: Verify icon files exist
```bash
ls -la frontend/public/icon*.png
# OR wherever icons are stored
```

#### Step 3: Fix paths or add missing icons
```json
// manifest.json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### A11Y-002: Deprecated Meta Tag

#### Update in index.html
```html
<!-- Before -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- After -->
<meta name="mobile-web-app-capable" content="yes">
```

### A11Y-003: Missing Aria-Labels

#### Step 1: Find icon-only buttons
```bash
grep -rn "<Button.*<.*Icon" frontend/src/
grep -rn "aria-label" frontend/src/components/
```

#### Step 2: Add aria-labels (using i18n)
```typescript
// Before
<Button variant="ghost" size="icon" onClick={handleClick}>
  <X className="h-4 w-4" />
</Button>

// After
<Button 
  variant="ghost" 
  size="icon" 
  onClick={handleClick}
  aria-label={t.a11y.close}
>
  <X className="h-4 w-4" />
</Button>
```

#### Common buttons needing labels:
- Close buttons (X icon)
- Navigation arrows (prev/next)
- Theme toggle
- Language selector trigger
- Social media links
- Expand/collapse buttons

### Files to Modify
- `frontend/public/manifest.json`
- `frontend/index.html`
- Various components with icon-only buttons
- `frontend/src/lib/i18n.ts` (add a11y translations if needed)

---

## Acceptance Criteria

- [ ] No PWA icon manifest errors in console
- [ ] No deprecation warning for apple meta tag
- [ ] All icon-only buttons have aria-labels
- [ ] Labels are translated (EN/DE/FA)
- [ ] Build passes
- [ ] PWA installation works

---

## Regression Tests

### Manual Tests
1. Open DevTools → Application → Manifest → Verify no icon errors
2. Install as PWA (if supported) → Verify icon appears
3. Use VoiceOver/NVDA → Navigate buttons → Verify labels announced
4. Tab through page → Verify all interactive elements focusable

### Automated Tests
```bash
# Check for buttons without aria-labels
grep -rn '<Button.*icon' frontend/src/ | grep -v 'aria-label'
# Should return minimal matches after fix
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Adding attributes, not changing behavior
- Fixes improve accessibility without side effects
- PWA changes are isolated

**Rollback:**
Revert changes if issues arise.

---

## Dependencies

**Blocks:** None (final polish)

**Blocked by:** plan_14 (Fix UX Polish - stable UI first)

---

## Commit Message Guidance

### Short
```
fix(a11y): fix PWA icons, update meta tags, add aria-labels

Fixed manifest icon path errors, replaced deprecated meta tag,
and added aria-labels to icon-only buttons.

Fixes: A11Y-001, A11Y-002, A11Y-003
```

---

*Plan ready for implementation*
