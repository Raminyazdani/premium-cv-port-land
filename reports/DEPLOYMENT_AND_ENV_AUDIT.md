# Deployment & Environment Audit

**Report Date:** 2026-01-02  
**Report Version:** 1.0  
**Scope:** Deployment platforms, build/runtime configuration, environment variable usage  
**Mode:** REPORT-ONLY (no changes implemented)

---

## Executive Summary

This audit covers deployment configuration, environment variables, and platform-specific settings for the premium CV portfolio website. The application is a **static frontend-only site** built with Vite + React, designed to be deployed to various static hosting platforms.

### Key Findings

| Category | Status | Priority |
|----------|--------|----------|
| Multi-Platform Deployment Configs | ✅ Both Vercel & Netlify configured | - |
| GitHub Pages Workflow | ⚠️ Disabled by default | P3 |
| Environment Variable Typing | ✅ TypeScript definitions present | - |
| Env Var Validation | ⚠️ No runtime validation | P2 |
| Committed Secrets | ✅ No secrets detected | - |
| Local Dev vs Prod Parity | ✅ Good separation via import.meta.env | - |
| Build Configuration | ✅ Standard Vite setup | - |

---

## 1. Deployment Surfaces Table

| Platform | Config File(s) | Where Referenced | Notes |
|----------|---------------|------------------|-------|
| **Vercel** | `frontend/vercel.json` | `.github/workflows/pr-preview.yml:L83` (comments), `docs/DEPLOYMENT_GUIDE.md`, `docs/deploy_preview_pr.md` | Primary recommended platform; rewrites to SPA |
| **Netlify** | `frontend/netlify.toml` | `docs/deploy_preview_pr.md`, `docs/DEPLOYMENT_GUIDE.md` | Alternative static hosting; includes build environment |
| **GitHub Pages** | `.github/workflows/deploy-github-pages.yml` | Workflow file only | Disabled by default (`if: false` at line 19) |
| **Local Preview** | `frontend/package.json` scripts | `npm run dev`, `npm run preview` | Vite dev server (5173) and preview (4173) |
| **CI Preview** | `frontend/package.json:L32` | `npm run ci:preview`, `frontend/.lighthouserc.cjs` | Used by Lighthouse CI and smoke tests |

### 1.1 Vercel Configuration Details

**File:** `frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Assessment:**
- ✅ Correct Vite framework detection
- ✅ SPA fallback rewrite configured (all routes → index.html)
- ✅ Standard npm install/build commands
- ⚠️ No environment variable configuration in config file (relies on Vercel dashboard)
- ⚠️ No caching headers configured (uses Vercel defaults)

### 1.2 Netlify Configuration Details

**File:** `frontend/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  command = "npm run build"
  
[context.branch-deploy]
  command = "npm run build"
```

**Assessment:**
- ✅ Node 20 version pinned (matches CI)
- ✅ SPA fallback redirect configured
- ✅ Production NODE_ENV set explicitly
- ✅ Deploy preview and branch deploy contexts configured
- ⚠️ No VITE_* environment variables configured (requires Netlify dashboard)
- ⚠️ No caching headers configured

### 1.3 GitHub Pages Configuration Details

**File:** `.github/workflows/deploy-github-pages.yml`

**Status:** ⛔ **Disabled** (line 19: `if: false`)

**Configuration when enabled:**
- Triggers on push to main or manual dispatch
- Uses `actions/configure-pages@v4` and `actions/deploy-pages@v4`
- Uploads `frontend/dist` as artifact
- No custom base path configured (may fail if repo is not at root)

**Issues:**
| Issue | Impact | Priority |
|-------|--------|----------|
| Workflow globally disabled | Pages deployment not functional | P3 |
| No base path configuration | May fail for non-root repos | P2 |
| Comments suggest using external services | Intentional design decision | - |

---

## 2. Environment Variables Table

### 2.1 Defined Environment Variables

| VAR_NAME | Where Read | Purpose | Build/Runtime | Risk | Default |
|----------|------------|---------|---------------|------|---------|
| `VITE_CLARITY_ID` | `frontend/src/lib/observability/clarity.ts:L21,L66` | Microsoft Clarity project ID for session replays | Build-time | Low | `undefined` (disabled) |
| `VITE_CLARITY_FORCE_ENABLE` | `frontend/src/lib/observability/clarity.ts:L22` | Force Clarity in development mode | Build-time | Low | `undefined` (false) |
| `VITE_SENTRY_DSN` | `frontend/src/lib/observability/sentry.ts:L31,L59` | Sentry Data Source Name for error tracking | Build-time | Medium | `undefined` (disabled) |
| `VITE_SENTRY_FORCE_ENABLE` | `frontend/src/lib/observability/sentry.ts:L32` | Force Sentry in development mode | Build-time | Low | `undefined` (false) |
| `VITE_SENTRY_RELEASE` | `frontend/src/lib/observability/sentry.ts:L69` | Sentry release version tag | Build-time | Low | `undefined` |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | `frontend/src/lib/observability/sentry.ts:L73` | Performance tracing sample rate (0-1) | Build-time | Low | `'0.1'` |
| `VITE_SENTRY_REPLAYS_SESSION_RATE` | `frontend/src/lib/observability/sentry.ts:L77` | Session replay sample rate (0-1) | Build-time | Medium | `'0'` |
| `VITE_SENTRY_REPLAYS_ERROR_RATE` | `frontend/src/lib/observability/sentry.ts:L78` | Error replay sample rate (0-1) | Build-time | Medium | `'0'` |
| `VITE_DEBUG_CV` | `frontend/src/lib/logger.ts:L59` | Enable verbose debug logging | Build-time | Low | `undefined` (false) |
| `VITE_PSEUDO_LOC` | `frontend/src/utils/pseudoLocalization.ts:L69` | Enable pseudo-localization for i18n testing | Build-time | Low | `undefined` (false) |

### 2.2 Built-in Vite Environment Variables

| VAR_NAME | Where Read | Purpose | Value (Dev) | Value (Prod) |
|----------|------------|---------|-------------|--------------|
| `import.meta.env.DEV` | Multiple files | Development mode detection | `true` | `false` |
| `import.meta.env.PROD` | `clarity.ts:L23`, `sentry.ts:L33`, `logger.ts:L34` | Production mode detection | `false` | `true` |
| `import.meta.env.MODE` | `sentry.ts:L66` | Build mode name | `'development'` | `'production'` |

### 2.3 Process Environment Variables (Node.js/Tests)

| VAR_NAME | Where Read | Purpose | Context |
|----------|------------|---------|---------|
| `process.env.NODE_ENV` | `frontend/src/lib/logger.ts:L37,L48` | Environment detection fallback | Test/Node contexts |
| `process.env.DEBUG_CV` | `frontend/src/lib/logger.ts:L69` | Debug mode fallback for tests | Test context |
| `process.env.CI` | `frontend/playwright.config.ts:L20,L23,L26,L37,L83` | CI environment detection | CI workflows |
| `process.env.CI_BASE_URL` | `frontend/scripts/ci-smoke-test.js:L24` | Base URL for smoke tests | CI workflows |
| `process.env.PROJECT_ROOT` | `frontend/vite.config.ts:L8` | Override project root path | Build context |

### 2.4 TypeScript Type Definitions

**File:** `frontend/src/vite-end.d.ts`

All `VITE_*` environment variables are properly typed:

```typescript
interface ImportMetaEnv {
  readonly VITE_CLARITY_ID?: string;
  readonly VITE_CLARITY_FORCE_ENABLE?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_FORCE_ENABLE?: string;
  readonly VITE_SENTRY_RELEASE?: string;
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_REPLAYS_SESSION_RATE?: string;
  readonly VITE_SENTRY_REPLAYS_ERROR_RATE?: string;
}
```

**Assessment:**
- ✅ All custom env vars are typed as optional strings
- ✅ Type definitions match actual usage
- ⚠️ Missing types for `VITE_DEBUG_CV` and `VITE_PSEUDO_LOC`

### 2.5 Environment Variable File

**File:** `frontend/.env.example`

Documents all observability environment variables with comments explaining:
- Purpose of each variable
- Where to obtain values (Clarity dashboard, Sentry dashboard)
- Default behavior (disabled in development)
- Privacy considerations

**Assessment:**
- ✅ Good documentation of optional observability vars
- ✅ Clear instructions for local development
- ✅ No actual secrets or values committed
- ⚠️ Missing `VITE_DEBUG_CV` and `VITE_PSEUDO_LOC` documentation

---

## 3. Runtime Config Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BUILD-TIME (Vite)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   .env.local / .env.production    ──────►   Vite Build Process             │
│   (or platform env vars)                          │                          │
│                                                   ▼                          │
│                                         import.meta.env.VITE_*              │
│                                         (inlined at build time)             │
│                                                   │                          │
└───────────────────────────────────────────────────┼──────────────────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RUNTIME (Browser)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐   │
│   │    main.tsx     │────►│   App.tsx        │────►│ initAnalytics()   │   │
│   │   (entry point) │     │ (calls init)     │     │  ├─ initClarity() │   │
│   └─────────────────┘     └──────────────────┘     │  └─ initSentry()  │   │
│                                                     └───────────────────┘   │
│                                                              │               │
│                                                              ▼               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    CONDITIONAL INITIALIZATION                        │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │                                                                      │   │
│   │   isClarityEnabled():                                               │   │
│   │     IF VITE_CLARITY_ID exists                                       │   │
│   │       AND (PROD mode OR VITE_CLARITY_FORCE_ENABLE === 'true')      │   │
│   │     THEN: Inject Clarity script                                     │   │
│   │     ELSE: Skip (log debug message in DEV)                          │   │
│   │                                                                      │   │
│   │   isSentryEnabled():                                                │   │
│   │     IF VITE_SENTRY_DSN exists                                       │   │
│   │       AND (PROD mode OR VITE_SENTRY_FORCE_ENABLE === 'true')       │   │
│   │     THEN: Initialize Sentry SDK                                     │   │
│   │     ELSE: Skip (log debug message in DEV)                          │   │
│   │                                                                      │   │
│   │   shouldLog('debug'):                                               │   │
│   │     IF VITE_DEBUG_CV === 'true' OR DEBUG_CV === 'true'             │   │
│   │     THEN: Enable debug logging                                      │   │
│   │     ELSE: Suppress debug logs                                       │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Key Observations

1. **All VITE_* variables are build-time constants** - They are inlined during the Vite build and cannot be changed at runtime.

2. **No runtime configuration loading** - The app does not fetch configuration from APIs or read runtime environment variables.

3. **Observability is optional** - Both Clarity and Sentry are gracefully disabled when env vars are not set.

4. **Development mode has protective defaults** - Observability tools are disabled in dev mode by default to prevent accidental data collection during development.

---

## 4. Local Dev vs Production Differences

### 4.1 Build Commands

| Context | Command | Output | Port |
|---------|---------|--------|------|
| **Local Development** | `npm run dev` | Hot-reloading dev server | 5173 |
| **Local Preview** | `npm run build && npm run preview` | Production build served locally | 4173 |
| **CI Preview** | `npm run ci:preview` | Production build for CI testing | 4173 |
| **Production Build** | `npm run build` | Static files in `dist/` | N/A |

### 4.2 Environment Mode Differences

| Aspect | Development (`npm run dev`) | Production (deployed) |
|--------|----------------------------|----------------------|
| `import.meta.env.DEV` | `true` | `false` |
| `import.meta.env.PROD` | `false` | `true` |
| Clarity tracking | Disabled (unless force-enabled) | Enabled if `VITE_CLARITY_ID` set |
| Sentry error tracking | Disabled (unless force-enabled) | Enabled if `VITE_SENTRY_DSN` set |
| Debug logging | Disabled (unless `VITE_DEBUG_CV=true`) | Disabled |
| Info logging | Enabled | Disabled |
| Sourcemaps | Inline | Separate files (`build.sourcemap: true`) |
| Console messages | Verbose | Minimal (errors/warnings only) |

### 4.3 Likely Failure Modes

| Scenario | Symptom | Root Cause | Mitigation |
|----------|---------|------------|------------|
| **Missing env vars in deployment** | No analytics/error tracking | Platform env vars not configured | Configure vars in Vercel/Netlify dashboard |
| **Wrong base path on GitHub Pages** | Broken asset URLs (404s) | Missing `base` config in vite.config.ts | Add `base: '/<repo-name>/'` for Pages |
| **Node version mismatch** | Build failures | Platform uses different Node version | Pin Node 20 in platform settings |
| **SPA routing fails on direct URL** | 404 on page refresh | Missing SPA fallback redirect | Verify rewrites/redirects in platform config |
| **Stale cache after deploy** | Old version displayed | Aggressive browser/CDN caching | Configure cache headers or use versioned filenames |
| **CORS issues with external assets** | Images/fonts fail to load | Cross-origin requests blocked | Configure allowed origins on asset CDN |

### 4.4 Missing Environment Validation

**Issue:** No runtime validation of environment variables

**Evidence:** 
- `frontend/src/lib/observability/clarity.ts:L21-22` - Reads env vars directly
- `frontend/src/lib/observability/sentry.ts:L31-32` - Reads env vars directly

**Risk:** 
- Invalid values (e.g., non-numeric sample rates) may cause runtime errors
- Typos in env var names go undetected

**Suggested Solution:**
```typescript
// Create src/lib/env.ts with Zod validation
import { z } from 'zod'

const envSchema = z.object({
  VITE_CLARITY_ID: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z.string()
    .transform(Number)
    .pipe(z.number().min(0).max(1))
    .optional(),
  // ... etc
})

export const env = envSchema.parse(import.meta.env)
```

**Priority:** P2

**Acceptance Criteria:**
- [ ] Environment variables are validated at startup
- [ ] Invalid values produce clear error messages
- [ ] Type-safe access to env vars throughout codebase

---

## 5. Risk Assessment

### 5.1 Committed Secrets Check

**Status:** ✅ **No secrets detected**

**Evidence:**
- `frontend/.env.example` contains only placeholder/empty values
- No `.env`, `.env.local`, `.env.production` files in repository
- `frontend/runtime.config.json` contains only non-secret app ID
- All env vars documented as "optional" with empty defaults

**Verification performed:**
- Searched for patterns: API keys, tokens, passwords, DSN strings
- Reviewed all JSON config files
- Checked workflow files for hardcoded secrets

### 5.2 Environment Variable Risks

| Risk | Severity | Details | Mitigation |
|------|----------|---------|------------|
| **VITE_SENTRY_DSN exposure** | Medium | DSN is visible in client-side JavaScript; attackers could send fake errors | Use Sentry's rate limiting and ingest rules |
| **No env var validation** | Medium | Invalid values may cause silent failures | Add Zod validation (see §4.4) |
| **Missing documentation for all vars** | Low | `VITE_DEBUG_CV` and `VITE_PSEUDO_LOC` not in `.env.example` | Update `.env.example` |
| **TypeScript definitions incomplete** | Low | Two env vars missing from type definitions | Update `vite-end.d.ts` |

### 5.3 Deployment Configuration Risks

| Risk | Severity | Details | Mitigation |
|------|----------|---------|------------|
| **No caching headers defined** | Medium | Relies on platform defaults; may lead to stale content | Add explicit cache headers in platform config |
| **GitHub Pages base path** | Medium | Will fail if deployed to non-root path | Add conditional `base` in vite.config.ts |
| **Platform env var sync** | Low | Different platforms may have different vars configured | Document required env vars per platform |
| **No preview environment validation** | Low | Preview deployments may behave differently than prod | Add smoke tests for preview environments |

### 5.4 Security Posture

| Check | Status | Evidence |
|-------|--------|----------|
| No hardcoded secrets | ✅ Pass | Full codebase search |
| No exposed private keys | ✅ Pass | No key files found |
| No committed env files | ✅ Pass | `.gitignore` excludes `.env*` |
| HTTPS enforced | ✅ Pass (platforms) | Vercel/Netlify enforce HTTPS by default |
| CSP headers | ⚠️ Unknown | Not configured in available files |
| CORS | ⚠️ Unknown | No explicit configuration |

---

## 6. Recommendations

### 6.1 High Priority (P1)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| - | (No P1 deployment issues identified) | - | - |

### 6.2 Medium Priority (P2)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 1 | Add runtime validation for environment variables using Zod | 2 hours | Prevents silent failures from invalid config |
| 2 | Add cache headers to Vercel/Netlify configs | 1 hour | Improves cache consistency across deploys |
| 3 | Configure GitHub Pages base path for portability | 30 min | Enables Pages deployment for non-root repos |
| 4 | Document required env vars for each platform | 1 hour | Reduces deployment friction |

### 6.3 Low Priority (P3)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 5 | Add missing env vars to `.env.example` (`VITE_DEBUG_CV`, `VITE_PSEUDO_LOC`) | 15 min | Improves documentation completeness |
| 6 | Add missing types to `vite-end.d.ts` | 15 min | Improves TypeScript coverage |
| 7 | Enable or remove disabled GitHub Pages workflow | 15 min | Reduces workflow file clutter |
| 8 | Add CSP headers via platform config | 1-2 hours | Improves security posture |

---

## 7. Unknowns + Verification Steps

| Unknown | Why Unknown | Verification Steps |
|---------|-------------|-------------------|
| Whether Vercel/Netlify have env vars configured | Cannot access platform dashboards | 1. Log into Vercel/Netlify dashboard<br>2. Navigate to project settings → Environment Variables<br>3. Verify VITE_* vars are set for production |
| Whether CSP headers are configured at platform level | Not visible in repo config | 1. Deploy to platform<br>2. Check response headers with `curl -I <url>`<br>3. Look for `Content-Security-Policy` header |
| Whether CORS is properly configured for assets | External assets on Cloudinary | 1. Open browser DevTools → Network<br>2. Check for CORS errors on Cloudinary images<br>3. Verify `Access-Control-Allow-Origin` headers |
| Whether GitHub Pages would work with current config | Workflow is disabled | 1. Remove `if: false` from workflow<br>2. Set `base` in vite.config.ts if needed<br>3. Trigger manual deployment<br>4. Verify assets load correctly |
| Whether preview deployments receive correct env vars | Cannot test without actual PR | 1. Create test PR<br>2. Check Vercel/Netlify preview URL<br>3. Verify observability tools are enabled/disabled as expected |

---

## 8. Appendix: File References

### 8.1 Deployment Configuration Files

| File | Purpose | Lines Analyzed |
|------|---------|----------------|
| `frontend/vercel.json` | Vercel deployment config | L1-9 |
| `frontend/netlify.toml` | Netlify deployment config | L1-21 |
| `.github/workflows/deploy-github-pages.yml` | GitHub Pages workflow | L1-75 |
| `.github/workflows/pr-preview.yml` | PR preview workflow | L1-85 |

### 8.2 Environment Variable Files

| File | Purpose | Lines Analyzed |
|------|---------|----------------|
| `frontend/.env.example` | Template/documentation | L1-40 |
| `frontend/src/vite-end.d.ts` | TypeScript definitions | L1-32 |
| `frontend/vite.config.ts` | Build configuration | L1-42 |

### 8.3 Environment Variable Consumers

| File | Variables Used | Lines |
|------|----------------|-------|
| `frontend/src/lib/observability/clarity.ts` | `VITE_CLARITY_ID`, `VITE_CLARITY_FORCE_ENABLE` | L21-22, L66 |
| `frontend/src/lib/observability/sentry.ts` | `VITE_SENTRY_DSN`, `VITE_SENTRY_*` | L31-33, L59-78 |
| `frontend/src/lib/logger.ts` | `VITE_DEBUG_CV`, `DEBUG_CV` | L34, L46, L59, L69 |
| `frontend/src/utils/pseudoLocalization.ts` | `VITE_PSEUDO_LOC` | L69 |
| `frontend/src/utils/analytics.ts` | (uses `import.meta.env.DEV`) | L40, L173 |
| `frontend/src/main.tsx` | `import.meta.env.DEV` | L6, L34 |
| `frontend/src/App.tsx` | `import.meta.env.DEV` | L64 |

---

## Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`/reports/DEPLOYMENT_AND_ENV_AUDIT.md`).
- [x] I did not leave determinable sections as "unknown".
- [x] For any remaining unknowns, I documented why and how to verify manually.

---

## Safety Checks

1. ✅ **No changes outside `/reports/`** - Only created `/reports/DEPLOYMENT_AND_ENV_AUDIT.md`
2. ✅ **No existing files were modified** - This is a new file
3. ✅ **The report file requested by this task exists** - `/reports/DEPLOYMENT_AND_ENV_AUDIT.md`
4. ✅ **No section is left "unknown" if determinable** - All determinable sections completed via repo inspection
5. ✅ **Unknown items documented** - See Section 7 for unknowns with verification plans
6. ✅ **No secrets reproduced** - All sensitive patterns documented by name only, no values included
