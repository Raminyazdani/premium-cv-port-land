# Manual Testing Checklist - Phase 4: Robustness & Polish

Use this checklist to manually verify all robustness and polish improvements.

---

## 🔧 Prerequisites

1. Start the dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open browser: http://localhost:5173 (or shown port)

3. Open DevTools (F12)

---

## ✅ Task 4.1: Data Robustness Testing

### Test Invalid Data Scenarios

1. **Empty Education Section**:
   - [ ] Temporarily remove `education` key from cv.json (or create test file)
   - [ ] Page should not crash
   - [ ] Should show "No education data" or empty state
   - [ ] Restore original data

2. **Invalid Date Format**:
   - [ ] Check if any dates show "(Invalid Date)"
   - [ ] All dates should be formatted or show error message (not crash)

3. **Missing Images**:
   - [ ] Check Network tab for any 404 image errors
   - [ ] Images with errors should show fallback or hide gracefully
   - [ ] No broken image icons visible

4. **Console Check**:
   - [ ] No "undefined" errors in console
   - [ ] No "Cannot read property of null" errors
   - [ ] Only expected warnings (if any)

---

## 📱 Task 4.2: Responsive Design Testing

### Mobile Testing (< 640px)

1. **Open DevTools → Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)**

2. **iPhone SE (375x667)**:
   - [ ] Hamburger menu appears in header
   - [ ] Clicking hamburger opens mobile menu
   - [ ] All menu items clickable
   - [ ] Hero section stacks vertically
   - [ ] Avatar size appropriate (96px / 24×24 in Tailwind)
   - [ ] Text readable (minimum 14px)
   - [ ] No horizontal scroll
   - [ ] Skills section shows search bar and buttons stacked
   - [ ] All sections readable and usable

3. **Touch Target Check**:
   - [ ] Enable "Show device toolbar" touch mode
   - [ ] All buttons at least 44×44px
   - [ ] Icon buttons easy to tap
   - [ ] Links have adequate padding
   - [ ] Navigation items easy to tap

### Tablet Testing (640-1024px)

4. **iPad (768x1024)**:
   - [ ] Layout adapts between mobile and desktop
   - [ ] Skills grid shows 2 columns (if applicable)
   - [ ] Cards have appropriate spacing
   - [ ] Images scale correctly
   - [ ] Navigation shows appropriate items

### Desktop Testing (> 1024px)

5. **Desktop (1920x1080)**:
   - [ ] Full navigation visible in header
   - [ ] No hamburger menu
   - [ ] Skills section shows full width grid
   - [ ] All sections have max-width constraint
   - [ ] Content centered appropriately
   - [ ] Large images don't overflow

---

## ♿ Task 4.3: Accessibility Testing

### Keyboard Navigation

1. **Tab Navigation**:
   - [ ] Press Tab from top of page
   - [ ] "Skip to main content" link appears on first Tab
   - [ ] Can press Enter on skip link to jump to content
   - [ ] All interactive elements receive focus
   - [ ] Focus indicators visible (2px outline)
   - [ ] Can Tab through entire page without getting stuck
   - [ ] Can navigate mobile menu with keyboard

2. **Focus Indicators**:
   - [ ] Links show clear focus outline
   - [ ] Buttons show clear focus outline
   - [ ] Form inputs show clear focus outline
   - [ ] Dropdown menus show clear focus outline
   - [ ] Focus outline color contrasts with background

3. **Keyboard Actions**:
   - [ ] Can open mobile menu with Enter/Space
   - [ ] Can close mobile menu with Escape
   - [ ] Can expand/collapse skills categories with Enter/Space
   - [ ] Can activate all buttons with Enter/Space

### Semantic HTML

4. **Inspect Elements**:
   - [ ] Page has single `<h1>` (user's name)
   - [ ] Sections use `<section>` tags
   - [ ] Navigation uses `<nav>` tag
   - [ ] Main content uses `<main>` tag
   - [ ] Footer uses `<footer>` tag
   - [ ] No skipped heading levels (h1 → h2 → h3, not h1 → h3)

### ARIA Attributes

5. **Check ARIA in DevTools**:
   - [ ] Sections have `aria-labelledby` pointing to heading
   - [ ] Buttons with icons only have `aria-label`
   - [ ] Collapsible sections have `aria-expanded`
   - [ ] Modals have `aria-modal="true"`
   - [ ] Loading indicators have `role="status"`

### Image Alt Text

6. **Inspect Images**:
   - [ ] All images have `alt` attribute
   - [ ] Alt text is descriptive
   - [ ] No alt text contains "undefined" or "null"
   - [ ] Decorative images have empty `alt=""`

### Screen Reader Testing (Basic)

7. **VoiceOver (Mac)** or **NVDA (Windows)**:
   - [ ] Enable screen reader
   - [ ] Navigate through page headings
   - [ ] Page structure makes sense
   - [ ] Landmarks are announced correctly
   - [ ] Images are described
   - [ ] Buttons are labeled correctly
   - [ ] Links are descriptive

### Lighthouse Accessibility Audit

8. **Run Lighthouse**:
   - [ ] Open DevTools → Lighthouse tab
   - [ ] Select "Accessibility" category
   - [ ] Click "Analyze page load"
   - [ ] **Target Score**: ≥95 (ideally 100)
   - [ ] Review any issues found
   - [ ] Screenshot the score

### axe DevTools (Optional but Recommended)

9. **Install axe DevTools Extension**:
   - [ ] Chrome: https://chrome.google.com/webstore (search "axe DevTools")
   - [ ] Firefox: https://addons.mozilla.org (search "axe DevTools")

10. **Run axe Scan**:
    - [ ] Open DevTools → axe DevTools tab
    - [ ] Click "Scan ALL of my page"
    - [ ] Review critical issues (should be 0)
    - [ ] Review serious issues (should be 0)
    - [ ] Note any moderate/minor issues

---

## ⚡ Task 4.4: Performance Testing

### Build Analysis

1. **Check Bundle Size**:
   ```bash
   cd frontend
   npm run build
   ```
   - [ ] Main bundle < 500KB (gzipped < 200KB) ✓ (183KB)
   - [ ] CSS bundle < 100KB (gzipped) ✓ (76KB)
   - [ ] Check for any warnings

### Lighthouse Performance Audit

2. **Run Lighthouse**:
   - [ ] Open DevTools → Lighthouse tab
   - [ ] Select "Performance" category
   - [ ] Use "Desktop" device
   - [ ] Click "Analyze page load"
   - [ ] **Target Score**: >90
   - [ ] Screenshot the score

3. **Check Core Web Vitals**:
   - [ ] First Contentful Paint (FCP): < 1.8s
   - [ ] Largest Contentful Paint (LCP): < 2.5s
   - [ ] Total Blocking Time (TBT): < 200ms
   - [ ] Cumulative Layout Shift (CLS): < 0.1
   - [ ] Speed Index: < 3.4s

### Image Lazy Loading

4. **Verify Lazy Loading**:
   - [ ] Open DevTools → Network tab
   - [ ] Filter by "Img"
   - [ ] Scroll down slowly
   - [ ] Images should load as they come into viewport
   - [ ] Hero images load immediately (priority)
   - [ ] Section images load lazily

### Network Throttling

5. **Test on Slow Network**:
   - [ ] Open DevTools → Network tab
   - [ ] Change throttling to "Slow 3G"
   - [ ] Reload page
   - [ ] Page should remain responsive
   - [ ] Loading indicators should appear
   - [ ] No layout shifts

---

## 🌐 Task 4.5: Browser Compatibility Testing

### Chrome/Edge

1. **Chrome (latest)**:
   - [ ] Open site in Chrome
   - [ ] All features work correctly
   - [ ] No console errors
   - [ ] Animations smooth
   - [ ] RTL works for Persian (/?lang=fa)

2. **Edge (latest)**:
   - [ ] Open site in Edge
   - [ ] All features work correctly
   - [ ] No console errors
   - [ ] Same behavior as Chrome

### Firefox

3. **Firefox (latest)**:
   - [ ] Open site in Firefox
   - [ ] All features work correctly
   - [ ] No console errors
   - [ ] Scrolling smooth
   - [ ] RTL works correctly

### Safari (Mac only)

4. **Safari (latest)**:
   - [ ] Open site in Safari
   - [ ] All features work correctly
   - [ ] No console errors
   - [ ] Font rendering correct
   - [ ] Hover states work
   - [ ] RTL works correctly

### Cross-Browser CSS Check

5. **Verify CSS Features**:
   - [ ] CSS Grid working (skills section layout)
   - [ ] Flexbox working (header, cards)
   - [ ] Custom Properties (theme colors change)
   - [ ] Transitions/Animations work
   - [ ] Backdrop filter working (header blur)

### RTL Testing

6. **Test Persian (FA) in All Browsers**:
   - [ ] Add `?lang=fa` to URL
   - [ ] Page direction changes to RTL
   - [ ] Text aligns right
   - [ ] Icons mirror correctly
   - [ ] Layout looks proper
   - [ ] Navigation works
   - [ ] Test in Chrome, Firefox, Safari

---

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Desktop view (1920×1080)
- [ ] Mobile view (375×667)
- [ ] Tablet view (768×1024)
- [ ] Lighthouse Performance score
- [ ] Lighthouse Accessibility score
- [ ] Focus indicator examples
- [ ] Empty states (if applicable)
- [ ] RTL layout (Persian)

---

## 🐛 Issues to Check

Common issues to look for:
- [ ] No JavaScript errors in console
- [ ] No 404 errors in Network tab
- [ ] No images with alt="undefined"
- [ ] No broken links
- [ ] No horizontal scroll on any screen size
- [ ] No layout shifts during load
- [ ] All forms work correctly
- [ ] All modals/dropdowns function
- [ ] Theme switching works
- [ ] Language switching works

---

## ✅ Final Verification

After completing all tests:
- [ ] All critical issues resolved
- [ ] Performance score >90
- [ ] Accessibility score ≥95
- [ ] Works in 4 major browsers
- [ ] Responsive on 3 device sizes
- [ ] No console errors
- [ ] All tests passing (`npm run test`)
- [ ] Build successful (`npm run build`)

---

## 📝 Notes

Use this space to document any issues found:

```
Issue 1:
- Description:
- Browser:
- Steps to reproduce:
- Severity:

Issue 2:
- Description:
- Browser:
- Steps to reproduce:
- Severity:
```

---

## 🎉 Sign-Off

When all items are checked:
- [ ] I have completed all manual tests
- [ ] I have documented any issues found
- [ ] All critical issues have been addressed
- [ ] The application is ready for production

**Tested by**: ________________
**Date**: ________________
**Browsers tested**: ________________
**Devices tested**: ________________
