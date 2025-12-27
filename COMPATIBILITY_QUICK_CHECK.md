# Browser Compatibility Quick Check Guide

## Quick Testing Steps

### 1. Chrome Testing (5 minutes)
```bash
# Open in Chrome
open -a "Google Chrome" http://localhost:5173
# or
start chrome http://localhost:5173
```

**Check:**
- [ ] Page loads without errors (check Console)
- [ ] Switch all 6 themes - colors change instantly
- [ ] Switch to FA language - RTL works
- [ ] Scroll sections - smooth animations
- [ ] Filter by focus - content updates
- [ ] Resize window - responsive layout adjusts

---

### 2. Firefox Testing (5 minutes)
```bash
# Open in Firefox
open -a "Firefox" http://localhost:5173
# or
start firefox http://localhost:5173
```

**Check:**
- [ ] Page loads without errors (check Console)
- [ ] Switch all 6 themes - colors change instantly
- [ ] Switch to FA language - RTL works
- [ ] Scroll sections - smooth animations
- [ ] Filter by focus - content updates
- [ ] Resize window - responsive layout adjusts

---

### 3. Safari Testing (5 minutes - macOS only)
```bash
# Open in Safari
open -a "Safari" http://localhost:5173
```

**Check:**
- [ ] Page loads without errors (check Console)
- [ ] Switch all 6 themes - colors change instantly
- [ ] Switch to FA language - RTL works
- [ ] Scroll sections - smooth animations
- [ ] Filter by focus - content updates
- [ ] Resize window - responsive layout adjusts
- [ ] Test on iPhone/iPad (responsive mode)

---

### 4. Edge Testing (5 minutes)
```bash
# Open in Edge
open -a "Microsoft Edge" http://localhost:5173
# or
start msedge http://localhost:5173
```

**Check:**
- [ ] Page loads without errors (check Console)
- [ ] Switch all 6 themes - colors change instantly
- [ ] Switch to FA language - RTL works
- [ ] Scroll sections - smooth animations
- [ ] Filter by focus - content updates
- [ ] Resize window - responsive layout adjusts

---

## Console Error Checks

### In Each Browser's DevTools:
1. Open DevTools (F12)
2. Go to Console tab
3. Reload page (Ctrl+R / Cmd+R)
4. Look for:
   - ❌ Red errors (none should appear)
   - ⚠️ Yellow warnings (document any)
   - ℹ️ Info messages (safe to ignore)

### Expected: Zero Errors
```
✅ No errors
✅ No warnings about deprecated APIs
✅ All network requests successful
✅ No 404s for resources
```

---

## RTL Testing Checklist

### For Each Browser:
1. Click Language selector → Farsi (FA)
2. Verify:
   - [ ] `<html dir="rtl" lang="fa">`
   - [ ] Text aligns right
   - [ ] Navigation on right side
   - [ ] Profile photo on right in hero
   - [ ] Skills categories flow right-to-left
   - [ ] Scroll direction reversed (some browsers)

---

## Theme Testing Matrix

### Test All 6 Themes in Each Browser:

| Theme       | Chrome | Firefox | Safari | Edge |
|-------------|--------|---------|--------|------|
| Normal      | ✅     | ✅      | ✅     | ✅   |
| Academic    | ✅     | ✅      | ✅     | ✅   |
| Apple       | ✅     | ✅      | ✅     | ✅   |
| Dark        | ✅     | ✅      | ✅     | ✅   |
| Bright      | ✅     | ✅      | ✅     | ✅   |
| Futuristic  | ✅     | ✅      | ✅     | ✅   |

**Quick Check**: Look for instant color changes, no flicker

---

## CSS Feature Verification

### Grid Layout Check
**Where**: Skills section, Projects section
**How**: Resize browser window, verify grid columns adjust

**Expected**:
- Desktop: 3-4 columns
- Tablet: 2 columns
- Mobile: 1 column

---

### Flexbox Check
**Where**: Header, Footer, Cards
**How**: Visual inspection of alignment

**Expected**:
- Items aligned correctly
- Spacing consistent
- No overlap or overflow

---

### Custom Properties Check
**Where**: All elements using theme colors
**How**: Switch themes, verify colors change

**Expected**:
- Instant color change
- No flash of unstyled content
- All elements update

---

## Responsive Design Check

### Breakpoints to Test:
1. **Mobile**: 375px width
2. **Tablet**: 768px width
3. **Desktop**: 1440px width

### In Each Browser:
1. Open DevTools
2. Enable Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test each breakpoint
4. Verify:
   - [ ] No horizontal scroll
   - [ ] Text readable (min 14px)
   - [ ] Touch targets ≥ 44px
   - [ ] Images scale properly
   - [ ] Navigation adapts (hamburger on mobile)

---

## Performance Quick Check

### Chrome/Edge Lighthouse:
```bash
# Run Lighthouse
npx lighthouse http://localhost:5173 --view
```

**Expected Scores**:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Visual Performance Check (All Browsers):
- [ ] Page loads < 2 seconds
- [ ] Theme switch instant (no delay)
- [ ] Smooth scrolling (no jank)
- [ ] Animations smooth (60fps)

---

## Keyboard Navigation Test

### In Each Browser:
1. Reload page
2. Press Tab repeatedly
3. Verify:
   - [ ] Focus indicator visible
   - [ ] Tab order logical (top to bottom)
   - [ ] All interactive elements reachable
   - [ ] No keyboard traps
4. Press Enter on buttons
5. Press Escape on modals
6. Press arrow keys in dropdowns

---

## Common Issues & Quick Fixes

### Issue: Theme doesn't switch
**Check**: DevTools Console for errors
**Fix**: Verify `data-theme` attribute on `<html>` element

### Issue: RTL not working
**Check**: `<html dir="rtl">` attribute present
**Fix**: Verify language selector updates DOM

### Issue: Animations not smooth
**Check**: Hardware acceleration enabled
**Fix**: Add `will-change: transform` to animated elements

### Issue: Console errors about fonts
**Check**: Google Fonts link in `<head>`
**Fix**: Verify network request succeeds

---

## Final Acceptance Check

### All Must Pass:
- [ ] Zero console errors in Chrome
- [ ] Zero console errors in Firefox
- [ ] Zero console errors in Safari
- [ ] Zero console errors in Edge
- [ ] All themes work in all browsers
- [ ] RTL works in all browsers
- [ ] Responsive design works in all browsers
- [ ] No visual glitches in any browser
- [ ] Performance acceptable in all browsers

---

## Time Estimate
- **Total Testing Time**: ~30 minutes
  - Chrome: 5 min
  - Firefox: 5 min
  - Safari: 5 min
  - Edge: 5 min
  - Cross-checks: 10 min

---

## Automated Check (Future)

### Playwright Cross-Browser Testing
```javascript
// tests/compatibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Browser Compatibility', () => {
  test('works in chromium', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ramin Yazdani/);
  });
  
  test('works in firefox', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ramin Yazdani/);
  });
  
  test('works in webkit', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ramin Yazdani/);
  });
});
```

---

**Quick Reference**: 20 minutes total manual testing = Full browser compatibility verified ✅
