# Plan 06: Fix Network/Asset Issues

## Title
Fix Cloudinary 404 Errors and API 401 Unauthorized Errors

---

## Scope

### In Scope
- Investigate and fix Cloudinary image 404 errors (NET-001)
- Investigate and fix 401 Unauthorized API errors (NET-002)
- Address Google Fonts blocking issue (NET-003) if feasible
- Update or remove broken image references

### Out of Scope
- Setting up new CDN or image hosting
- Changing image optimization strategy
- Backend API implementation

---

## Symptoms

**What users see:**
- Some images may not load (broken image placeholders)
- Potential console errors visible in dev tools
- Page may load slower due to failed requests

---

## Evidence

### Report References
- [QA_REPORT.md - NET-001 (High)](../qa/reports/QA_REPORT.md#net-001-multiple-404-errors-for-cloudinary-images)
- [QA_REPORT.md - NET-002 (High)](../qa/reports/QA_REPORT.md#net-002-401-unauthorized-api-errors)
- [QA_REPORT.md - NET-003 (Medium)](../qa/reports/QA_REPORT.md#net-003-google-fonts-blocked)

### Console Logs
```
Failed to load resource: 404 @ https://res.cloudinary.com/...
Failed to load resource: 401 (Unauthorized)
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector @ https://fonts.googleapis.com
```

---

## Likely Root Cause

**NET-001 - Cloudinary 404s:**
- Image URLs in CV data may reference deleted/renamed Cloudinary assets
- Cloudinary account settings may have changed
- Transformation URLs may be malformed

**NET-002 - 401 Unauthorized:**
- Frontend may be calling an API endpoint that requires auth
- Backend doesn't exist yet, so API calls fail
- May be from analytics or third-party integrations

**NET-003 - Google Fonts Blocked:**
- Likely browser extension (ad blocker) blocking fonts
- Not a code issue, but could self-host fonts as mitigation

---

## Fix Strategy

### NET-001: Cloudinary Images

#### Step 1: Find Cloudinary URLs in codebase
```bash
grep -rn "cloudinary" frontend/src/
grep -rn "res.cloudinary.com" frontend/src/
```

#### Step 2: Check CV data for image URLs
```bash
grep -n "cloudinary\|Pictures\|URL" frontend/src/data/cv.json
```

#### Step 3: Verify URLs manually
Test each Cloudinary URL in browser to confirm 404 status

#### Step 4: Fix or remove broken references
- Update URLs if images were moved
- Remove image references if assets don't exist
- Add fallback handling for missing images

### NET-002: 401 Unauthorized

#### Step 1: Identify the failing requests
```bash
# Check for fetch/axios calls
grep -rn "fetch\|axios" frontend/src/ | grep -v node_modules
```

#### Step 2: Find API endpoints being called
Look for patterns like:
- `/api/`
- External service URLs
- Analytics endpoints

#### Step 3: Remove or guard unauthorized calls
If calls are to non-existent backend:
```typescript
// Add environment check
if (import.meta.env.VITE_API_ENABLED === 'true') {
  // Make API call
}
```

Or remove the calls entirely if not needed.

### NET-003: Google Fonts

#### Step 1: Document the issue
This is likely a browser extension issue, not code

#### Step 2: Optional: Self-host fonts
```bash
# Download font files
# Add to public/fonts/
# Update CSS to use local fonts
```

### Files to Inspect
- `frontend/src/data/cv.json` - Image URLs
- `frontend/src/utils/analytics.ts` - API calls
- `frontend/src/components/ContactForm.tsx` - API calls
- `frontend/src/components/BookingWidget.tsx` - API calls
- `frontend/index.html` - Font references

---

## Acceptance Criteria

- [ ] No 404 errors for Cloudinary images in console
- [ ] No 401 Unauthorized errors in console
- [ ] Images load correctly or show graceful fallback
- [ ] Build passes
- [ ] Page performance not degraded

---

## Regression Tests

### Manual Tests
1. Open DevTools Network tab
2. Load page in each language
3. Verify no 4xx errors for images
4. Verify no 401 errors
5. Check all visible images render correctly

### Automated Tests
```typescript
test('image URLs are valid', async () => {
  const cvData = await loadCVData('en')
  const imageUrls = cvData.basics[0].Pictures?.map(p => p.URL) || []
  
  for (const url of imageUrls) {
    const response = await fetch(url, { method: 'HEAD' })
    expect(response.ok).toBe(true)
  }
})
```

---

## Risk & Rollback

### Risk Level: LOW to MEDIUM

**Why:**
- NET-001: Low risk - just fixing/removing broken URLs
- NET-002: Low risk - removing/guarding API calls
- NET-003: Low risk - optional self-hosting

**Rollback:**
Revert URL changes; images will show broken state again.

---

## Dependencies

**Blocks:** None

**Blocked by:** None (can run in parallel with plans 01-05)

---

## Commit Message Guidance

### Short
```
fix(network): resolve Cloudinary 404s and unauthorized API errors

Updated broken image URLs and removed/guarded API calls to
non-existent backend endpoints.

Fixes: NET-001, NET-002
```

### Long
```
fix(network): address network errors in console

NET-001 - Cloudinary 404s:
- Updated [X] image URLs that were returning 404
- Added fallback handling for missing images
- Removed references to deleted assets

NET-002 - 401 Unauthorized:
- Removed API calls to non-existent backend
- Guarded analytics calls behind environment check
- Contact form now simulates without API call

NET-003 - Google Fonts (documented):
- Issue is caused by browser extensions
- No code change needed; documented for users

Closes: NET-001, NET-002
Documents: NET-003
```

---

*Plan ready for implementation*
