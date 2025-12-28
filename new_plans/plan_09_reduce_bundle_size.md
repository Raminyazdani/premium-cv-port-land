# Plan 09: Reduce Bundle Size

## Title
Reduce Main Bundle Size Below 500KB Threshold

---

## Scope

### In Scope
- Analyze bundle composition
- Implement code splitting for large chunks
- Lazy load non-critical components
- Remove unused dependencies if found

### Out of Scope
- Complete rewrite of large files
- Changing visualization libraries
- Removing features (except EnhancedUIDemo in plan_01)

---

## Symptoms

**What users see:**
- Slower initial page load
- Longer time to interactive

**Developer symptoms:**
- Build warning: chunks exceed 500KB
- Main bundle: 818KB
- SkillsVisualizationDashboard: 436KB

---

## Evidence

### Report References
- [QA_REPORT.md - BUILD-002 (High)](../qa/reports/QA_REPORT.md#build-002-large-bundle-sizes-exceeding-500kb-limit)
- [FRONTEND_REFACTOR_AUDIT.md - BLOAT-001 (High)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#bloat-001-10-files-exceed-350-loc)

### Current Bundle Analysis
```
index-DlwatTDZ.js: 818KB (gzip: 225KB)
SkillsVisualizationDashboard-BCDybaUb.js: 436KB (gzip: 116KB)
```

---

## Likely Root Cause

**Main bundle too large because:**
- All sections loaded synchronously
- Heavy libraries (Recharts for visualizations) included upfront
- Debug code included (addressed in plan_08)
- EnhancedUIDemo adds unnecessary weight (addressed in plan_01)

**SkillsVisualizationDashboard large because:**
- Recharts library is large (~40KB gzipped alone)
- Multiple chart types included

---

## Fix Strategy

### Step 1: Analyze bundle composition
```bash
cd frontend
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [visualizer({ open: true })]

npm run build
# Opens bundle visualization
```

### Step 2: Lazy load SkillsVisualizationDashboard
```typescript
// In App.tsx or wherever it's imported

// Before
import SkillsVisualizationDashboard from './components/SkillsVisualizationDashboard'

// After
const SkillsVisualizationDashboard = lazy(() => 
  import('./components/SkillsVisualizationDashboard')
)

// In JSX
<Suspense fallback={<SkillsDashboardSkeleton />}>
  <SkillsVisualizationDashboard />
</Suspense>
```

### Step 3: Lazy load other heavy sections
Consider lazy loading:
- ProjectCaseStudy (543 LOC)
- DownloadModal (465 LOC)
- VideoPlayer (413 LOC)
- TestimonialsSection (383 LOC)

```typescript
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'))
const DownloadModal = lazy(() => import('./components/DownloadModal'))
```

### Step 4: Split vendor chunks
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'recharts': ['recharts'],
        'radix': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        'vendor': ['react', 'react-dom']
      }
    }
  }
}
```

### Step 5: Remove unused imports
```bash
# Check for unused exports
npx ts-prune frontend/src
```

### Step 6: Verify results
```bash
cd frontend && npm run build
# Check new bundle sizes
# Target: main chunk < 500KB
```

### Files to Modify
- `frontend/vite.config.ts` - Code splitting config
- `frontend/src/App.tsx` - Lazy loading
- Components importing heavy sections

---

## Acceptance Criteria

- [ ] Main bundle < 500KB
- [ ] SkillsVisualizationDashboard lazy loaded
- [ ] No visual changes to users
- [ ] Loading states for lazy components
- [ ] Build passes without warnings
- [ ] First Contentful Paint not degraded

---

## Regression Tests

### Manual Tests
1. Load page cold (clear cache)
2. Verify all sections eventually load
3. Check Network tab for chunked loading
4. Verify visualizations render correctly

### Automated Tests
```typescript
test('lazy components load correctly', async () => {
  render(<App />)
  
  // Initially might show loading
  await waitFor(() => {
    expect(screen.getByTestId('skills-dashboard')).toBeInTheDocument()
  })
})
```

### Build Size Check
```bash
# Add to CI
npm run build 2>&1 | grep -E "chunk.*kB"
# Fail if any chunk > 500KB
```

---

## Risk & Rollback

### Risk Level: MEDIUM

**Why medium:**
- Lazy loading changes user experience (loading states)
- Code splitting can break imports if done wrong
- Need to handle Suspense boundaries properly

**Mitigation:**
- Test all lazy loaded components
- Use skeleton loaders
- Monitor Core Web Vitals

**Rollback:**
Remove lazy() wrappers; revert to synchronous imports.

---

## Dependencies

**Blocks:** None

**Blocked by:** 
- plan_01 (Remove EnhancedUIDemo - removes ~10-20KB)
- plan_08 (Remove debug utilities - removes debug code weight)

---

## Commit Message Guidance

### Short
```
perf(build): reduce bundle size with code splitting

Implemented lazy loading for heavy components (SkillsVisualization,
ProjectCaseStudy, DownloadModal). Configured vendor chunk splitting.
Main bundle now under 500KB.

Fixes: BUILD-002, BLOAT-001
```

### Long
```
perf(build): implement code splitting to reduce bundle size

Bundle was 818KB, exceeding the 500KB warning threshold.

Changes:
- Lazy load SkillsVisualizationDashboard (436KB → separate chunk)
- Lazy load ProjectCaseStudy, DownloadModal, VideoPlayer
- Configure manual chunks for Recharts, Radix UI
- Add Suspense boundaries with skeleton loaders

Results:
- Main bundle: 818KB → ~380KB
- Separate chunks load on demand
- Improved initial load time

Closes: BUILD-002, BLOAT-001
```

---

*Plan ready for implementation*
