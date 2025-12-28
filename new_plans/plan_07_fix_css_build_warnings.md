# Plan 07: Fix CSS/Build Warnings

## Title
Fix CSS Parsing Warnings and Build Issues

---

## Scope

### In Scope
- Fix @media query syntax errors (BUILD-001)
- Fix icon proxy warning for non-existent icon (BUILD-003)
- Address source map resolution errors (BUILD-004)

### Out of Scope
- Bundle size reduction (plan_09)
- Debug utility removal (plan_08)
- Major CSS refactoring

---

## Symptoms

**What users see:**
- No visible impact (warnings only affect build output)

**Developer symptoms:**
- Build output shows 3 CSS warnings about ParenthesisBlock tokens
- Icon proxy warning in console
- 10 sourcemap errors during build

---

## Evidence

### Report References
- [QA_REPORT.md - BUILD-001 (High)](../qa/reports/QA_REPORT.md#build-001-css-parsing-warnings-for-media-queries)
- [QA_REPORT.md - BUILD-003 (Medium)](../qa/reports/QA_REPORT.md#build-003-icon-proxy-warning-for-non-existent-icon)
- [QA_REPORT.md - BUILD-004 (Medium)](../qa/reports/QA_REPORT.md#build-004-source-map-resolution-errors)

### Console Evidence
```
@media (width >= (display-mode: standalone)) - Unexpected token ParenthesisBlock
@media (width >= (pointer: coarse)) - Unexpected token ParenthesisBlock
@media (width >= (pointer: fine)) - Unexpected token ParenthesisBlock
[icon-proxy] Proxying non-existent icon: AccessibilityMotion -> Question
Error when using sourcemap for reporting an error: Can't resolve original location
```

---

## Likely Root Cause

**BUILD-001 - CSS Warnings:**
The @media query syntax is invalid. `(width >= (display-mode: standalone))` combines incompatible features. Should be separate queries.

**BUILD-003 - Icon Proxy:**
Component references an icon name `AccessibilityMotion` that doesn't exist in the icon library.

**BUILD-004 - Sourcemap Errors:**
Radix UI or other dependencies have outdated sourcemaps.

---

## Fix Strategy

### BUILD-001: Fix @media queries

#### Step 1: Find the problematic CSS
```bash
grep -rn "display-mode:\|pointer:" frontend/src/styles/
grep -rn "display-mode:\|pointer:" frontend/src/
```

#### Step 2: Fix the syntax
```css
/* Before (invalid) */
@media (width >= (display-mode: standalone)) { }

/* After (valid - separate media features) */
@media (display-mode: standalone) { }
/* OR */
@media (min-width: 768px) and (display-mode: standalone) { }
```

### BUILD-003: Fix icon reference

#### Step 1: Find the icon usage
```bash
grep -rn "AccessibilityMotion" frontend/src/
```

#### Step 2: Replace with valid icon
```typescript
// Before
import { AccessibilityMotion } from 'lucide-react'

// After - use existing icon
import { Accessibility } from 'lucide-react'
// OR remove the reference entirely
```

### BUILD-004: Sourcemap errors

#### Step 1: Update dependencies
```bash
cd frontend && npm update @radix-ui/react-*
```

#### Step 2: Or suppress sourcemap warnings in Vite config
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return
        warn(warning)
      }
    }
  }
})
```

### Files to Modify
- `frontend/src/styles/*.css` - CSS fixes
- Component using `AccessibilityMotion`
- `frontend/vite.config.ts` - Sourcemap handling

---

## Acceptance Criteria

- [ ] Build output shows no @media ParenthesisBlock warnings
- [ ] No icon proxy warnings
- [ ] Sourcemap errors resolved or suppressed
- [ ] Build completes successfully
- [ ] No visual regressions

---

## Regression Tests

### Manual Tests
1. Run `npm run build`
2. Verify clean output with no warnings
3. Run `npm run preview`
4. Verify all styles apply correctly
5. Test PWA installation if display-mode was affected

### Automated Tests
```bash
# Build and check for warnings
cd frontend && npm run build 2>&1 | grep -i "warning\|error"
# Should return empty
```

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- CSS fixes are isolated
- Icon change is simple replacement
- Sourcemap is dev experience only

**Rollback:**
Revert CSS/config changes.

---

## Dependencies

**Blocks:** None

**Blocked by:** None

---

## Commit Message Guidance

### Short
```
fix(build): resolve CSS warnings and icon proxy error

Fixed invalid @media query syntax and replaced non-existent icon.
Suppressed sourcemap resolution warnings from dependencies.

Fixes: BUILD-001, BUILD-003, BUILD-004
```

---

*Plan ready for implementation*
