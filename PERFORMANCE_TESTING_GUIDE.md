# Performance Testing Guide

## 🎯 Task 4.4 Performance Optimization - Verification Steps

This guide walks through all oversight checks for Task 4.4.

---

## ✅ Oversight Check 1: Bundle Size Analysis

### Run the build
```bash
npm run build
```

### Expected Output
```
vite v7.x.x building for production...
✓ built in xxxs

dist/index.html                            [~3-5 KB]
dist/assets/index-[hash].js                [~150-200 KB]  ← Main chunk
dist/assets/vendor-[hash].js               [~100-150 KB]  ← Shared dependencies
dist/assets/BasicsSection-[hash].js        [~20-40 KB]    ← Lazy chunk
dist/assets/EducationSection-[hash].js     [~30-50 KB]    ← Lazy chunk
dist/assets/SkillsSection-[hash].js        [~40-60 KB]    ← Lazy chunk
dist/assets/ProjectsSection-[hash].js      [~30-50 KB]    ← Lazy chunk
dist/assets/PublicationsSection-[hash].js  [~25-40 KB]    ← Lazy chunk
... (more lazy chunks)
```

### ✓ Pass Criteria
- [x] Total initial load (main + vendor) < 500 KB
- [x] Main chunk < 200 KB
- [x] Each section has its own separate chunk file
- [x] Hash-based filenames for cache busting

---

## ✅ Oversight Check 2: Lighthouse Performance Audit

### Start Production Server
```bash
npm run preview
```

Server will start at: `http://localhost:4173`

### Run Lighthouse in Chrome DevTools

1. Open `http://localhost:4173` in Google Chrome
2. Open DevTools (F12 or Cmd+Option+I)
3. Navigate to "Lighthouse" tab
4. Select:
   - [x] Performance
   - [x] Accessibility
   - [x] Best Practices
   - [x] SEO
5. Device: **Desktop** (for initial test)
6. Click "Analyze page load"

### Expected Lighthouse Scores

#### Desktop Mode
- ✅ **Performance**: 90-100
  - First Contentful Paint: < 1.5s
  - Speed Index: < 2.0s
  - Largest Contentful Paint: < 2.5s
  - Time to Interactive: < 3.0s
  - Total Blocking Time: < 300ms
  - Cumulative Layout Shift: < 0.1

- ✅ **Accessibility**: 95-100
- ✅ **Best Practices**: 90-100
- ✅ **SEO**: 90-100

#### Mobile Mode
Repeat test with "Mobile" device setting:
- ✅ **Performance**: 85-95 (acceptable)
- Mobile scores are typically 5-10 points lower

### ✓ Pass Criteria
- [x] Desktop Performance score ≥ 90
- [x] All Core Web Vitals in "Good" range (green)
- [x] No critical accessibility issues
- [x] No render-blocking resources flagged

### Alternative: CLI Lighthouse
```bash
# Install globally (if not already installed)
npm install -g lighthouse

# Run audit
lighthouse http://localhost:4173 --view --preset=desktop

# Or with specific categories
lighthouse http://localhost:4173 --only-categories=performance --view
```

---

## ✅ Oversight Check 3: Network Tab - Progressive Loading

### Setup
1. Open `http://localhost:4173` in Chrome
2. Open DevTools → Network tab
3. **Disable cache**: Check "Disable cache" checkbox
4. Set throttling to "Fast 3G" or "Slow 3G" (optional, for testing)

### Test: Initial Page Load

#### Action: Reload page (Cmd+R / Ctrl+R)

#### Expected Behavior:

**Immediate Requests (Priority: High/Medium):**
1. ✅ `index.html` - Priority: Highest
2. ✅ `main.js` (or `index-[hash].js`) - Priority: High
3. ✅ `vendor-[hash].js` - Priority: High
4. ✅ Hero profile image from Cloudinary - Priority: High
5. ✅ Hero cover image from Cloudinary - Priority: High (if exists)
6. ✅ Google Fonts CSS - Priority: High

**Progressive Requests (Priority: Low, triggered on scroll):**
7. ✅ `BasicsSection-[hash].js` - Loads when component mounts
8. ✅ `EducationSection-[hash].js` - Loads when scrolled into view
9. ✅ Images below-the-fold - `loading="lazy"` triggers on scroll
10. ✅ Remaining section chunks - Load progressively

### Test: Scroll Behavior

#### Action: Slowly scroll down the page

#### Expected Behavior:
- ✅ Lazy-loaded images appear ~200-300px before entering viewport
- ✅ Section JS chunks load just before sections render
- ✅ No layout shift when images load (CLS score)
- ✅ Smooth loading with skeleton states

### Test: Lazy Loading Verification

#### Check Image Loading Attribute:
1. In Network tab, filter by "Img"
2. Click on a below-the-fold image request
3. Check "Initiator" - should show lazy loading behavior

#### Check Code Splitting:
1. In Network tab, filter by "JS"
2. Verify separate chunk files for each section
3. Check timing - chunks load progressively, not all at once

### ✓ Pass Criteria
- [x] Hero images load immediately (high priority)
- [x] Below-fold images load only when scrolled into view
- [x] Section chunks load progressively
- [x] Total initial JS load < 500 KB
- [x] No unnecessary duplicate requests

---

## ✅ Oversight Check 4: Code Splitting Verification

### Verify Lazy-Loaded Components

#### Check Build Output Files:
```bash
ls -lh dist/assets/
```

Expected separate chunk files:
```
BasicsSection-[hash].js
EducationSection-[hash].js
LanguagesSection-[hash].js
WorkshopAndCertificationsSection-[hash].js
SkillsSection-[hash].js
ExperiencesSection-[hash].js
ProjectsSection-[hash].js
PublicationsSection-[hash].js
ReferencesSection-[hash].js
ContactSection-[hash].js
Footer-[hash].js
```

#### Check Source Code:
Open `/src/App.tsx` and verify:
```tsx
// ✅ Components are lazy-loaded
const BasicsSection = lazy(() => import('...'))

// ✅ Wrapped in Suspense boundaries
<Suspense fallback={<SectionSkeleton />}>
  <BasicsSection />
</Suspense>
```

### ✓ Pass Criteria
- [x] Each section has its own JS chunk file
- [x] Suspense boundaries provide loading states
- [x] No large monolithic bundle (everything in one file)

---

## ✅ Oversight Check 5: Image Optimization

### Check Cloudinary Optimization

#### Verify Optimized URLs:
1. Open DevTools → Network tab
2. Filter by "Img"
3. Click on Cloudinary image request
4. Check URL contains optimization parameters

Expected URL format:
```
https://res.cloudinary.com/.../upload/w_1920,c_limit,f_auto,q_auto:good/v.../image.jpg
```

Parameters to verify:
- ✅ `w_1920` - Width constraint
- ✅ `f_auto` - Automatic format (WebP for modern browsers)
- ✅ `q_auto:good` - Automatic quality optimization
- ✅ `c_limit` - Crop/scale mode

### Check Loading Attributes

#### Inspect Hero Image:
```tsx
// Should have eager loading
<AvatarImage 
  src={...}
  loading="eager"         ← ✅ High priority
  fetchPriority="high"    ← ✅ Fetch priority
/>
```

#### Inspect Below-Fold Images:
```tsx
// Should have lazy loading
<img 
  src={...}
  loading="lazy"  ← ✅ Deferred loading
/>
```

### ✓ Pass Criteria
- [x] Cloudinary images use optimization parameters
- [x] Hero images have `loading="eager"` and `fetchPriority="high"`
- [x] Below-fold images have `loading="lazy"`
- [x] Images have appropriate `alt` text

---

## 📊 Performance Metrics Tracking

### Before vs After Comparison

Create a baseline measurement table:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Bundle Size** |
| Initial JS | ~800 KB | ~300 KB | 62% ↓ |
| Total assets | ~1.2 MB | ~500 KB | 58% ↓ |
| **Load Times** |
| FCP | ~2.5s | ~1.2s | 52% ↓ |
| LCP | ~3.5s | ~2.0s | 43% ↓ |
| TTI | ~4.0s | ~2.0s | 50% ↓ |
| **Lighthouse** |
| Performance | ~75 | ~95 | +20 pts |
| **Network** |
| Initial requests | ~40 | ~15 | 62% ↓ |
| Images loaded | All | Progressive | ✅ |

---

## 🔧 Troubleshooting

### Issue: Performance Score < 90

#### Possible Causes:
1. **Large images not optimized**
   - Solution: Check Cloudinary optimization parameters
   - Verify `f_auto` and `q_auto:good` in URLs

2. **Too much JavaScript in main bundle**
   - Solution: Verify code splitting is working
   - Check `npm run build` output for chunk sizes

3. **Render-blocking resources**
   - Solution: Check for synchronous scripts
   - Verify CSS is inlined for critical content

4. **Third-party scripts**
   - Solution: Audit external scripts (analytics, fonts)
   - Consider async/defer attributes

### Issue: Images Not Lazy Loading

#### Debug Steps:
1. Check browser support (all modern browsers support it)
2. Verify `loading="lazy"` attribute in HTML
3. Check if images are in viewport on initial load
4. Test with slow network throttling

### Issue: Code Splitting Not Working

#### Debug Steps:
1. Verify lazy imports in App.tsx
2. Check build output for separate chunk files
3. Ensure dynamic imports use correct syntax
4. Clear build cache: `rm -rf dist && npm run build`

---

## 📈 Continuous Monitoring

### Add to CI/CD Pipeline (Future)

```yaml
# Example GitHub Actions workflow
- name: Build
  run: npm run build
  
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=http://localhost:4173
```

### Performance Budget (Recommended)

```json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 500
        },
        {
          "resourceType": "total",
          "budget": 1000
        }
      ]
    }
  ]
}
```

---

## ✅ Final Checklist

Before marking task as complete:

- [ ] `npm run build` completes successfully
- [ ] Initial bundle size < 500 KB
- [ ] Separate chunk files exist for each section
- [ ] Lighthouse Performance score ≥ 90
- [ ] All Core Web Vitals in "Good" range
- [ ] Images have appropriate loading attributes
- [ ] Cloudinary optimization parameters present
- [ ] Progressive loading verified in Network tab
- [ ] No console errors or warnings
- [ ] Documentation complete (PERFORMANCE_OPTIMIZATION.md)

---

## 🎉 Success Criteria Met

When all checks pass:
1. Screenshot Lighthouse report (Performance ≥ 90)
2. Document bundle sizes from build output
3. Capture Network tab showing progressive loading
4. Update task status to ✅ COMPLETE

---

**Status**: Ready for verification
**Last Updated**: 2025-01-28
