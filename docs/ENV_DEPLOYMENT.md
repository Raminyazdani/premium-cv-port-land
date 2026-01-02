# Environment Variables &amp; Deployment Guide

This document describes all environment variables used by the CV Portfolio website, how they're validated, and platform-specific deployment instructions.

## Overview: Build-Time vs. Runtime

This is a **static Vite app** — all environment variables are **build-time constants**. They are:

1. Read during `npm run build`
2. Embedded directly into the JavaScript bundle
3. Cannot be changed after deployment without rebuilding

**Important**: Never commit sensitive values to `.env` files in version control. Use platform-specific environment variable configuration instead.

## Environment Variable Validation

All `VITE_*` environment variables are validated at build time using Zod schemas in `src/lib/env.ts`. Validation:

- ✅ **Fails fast** for invalid values (malformed URLs, out-of-range sample rates)
- ✅ **Allows missing** optional values (observability is disabled when unset)
- ✅ **Provides clear error messages** for configuration issues

### Example Validation Error

```
Environment variable validation failed:
  - VITE_SENTRY_TRACES_SAMPLE_RATE: Sample rate must be between 0 and 1, got: 1.5
```

## All Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| **Observability** ||||
| `VITE_CLARITY_ID` | string | - | Microsoft Clarity project ID |
| `VITE_CLARITY_FORCE_ENABLE` | boolean | `false` | Force enable Clarity in dev mode |
| `VITE_SENTRY_DSN` | URL | - | Sentry DSN for error tracking |
| `VITE_SENTRY_FORCE_ENABLE` | boolean | `false` | Force enable Sentry in dev mode |
| `VITE_SENTRY_RELEASE` | string | - | Release version for Sentry |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | 0-1 | `0.1` | Performance traces sample rate |
| `VITE_SENTRY_REPLAYS_SESSION_RATE` | 0-1 | `0` | Session replay sample rate |
| `VITE_SENTRY_REPLAYS_ERROR_RATE` | 0-1 | `0` | Error replay sample rate |
| **Debug &amp; Development** ||||
| `VITE_DEBUG_CV` | boolean | `false` | Enable verbose CV data logging |
| `VITE_PSEUDO_LOC` | boolean | `false` | Enable pseudo-localization |
| **Deployment** ||||
| `VITE_BASE_PATH` | string | `/` | Base path for subdirectory deployments |

### Type Notes

- **boolean**: Set as `'true'` or `'false'` string; any other value is treated as `false`
- **0-1**: Must be a number between 0.0 and 1.0; invalid values fail validation
- **URL**: Must be a valid URL; invalid values fail validation

## Platform-Specific Setup

### Vercel

1. Go to **Project Settings → Environment Variables**
2. Add variables for the appropriate environment (Production/Preview/Development)

```bash
# Required for observability (optional)
VITE_CLARITY_ID=your-clarity-id
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Optional: Set release version
VITE_SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
```

3. Click **Save** and trigger a new deployment

**Headers Configuration**: Cache and security headers are configured in `vercel.json`:
- Assets get 1-year cache with `immutable` flag
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.) applied globally

### Netlify

1. Go to **Site Settings → Environment Variables**
2. Add variables:

```bash
VITE_CLARITY_ID=your-clarity-id
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

3. Trigger a new deploy

**Headers Configuration**: Cache and security headers are configured in `netlify.toml`:
- Assets get 1-year cache with `immutable` flag
- Security headers applied globally

### GitHub Pages

GitHub Pages requires a base path because it deploys to `username.github.io/repo-name/`.

**Automatic Configuration** (Recommended):

The `vite.config.ts` automatically detects GitHub Pages deployments when:
- `GITHUB_PAGES=true` environment variable is set
- `GITHUB_REPOSITORY` is available (automatically set by GitHub Actions)

The workflow in `.github/workflows/deploy-github-pages.yml` handles this automatically.

**Manual Configuration**:

Set the base path explicitly:

```bash
VITE_BASE_PATH=/your-repo-name/
```

**To Enable GitHub Pages Deployment**:

1. Edit `.github/workflows/deploy-github-pages.yml`
2. Remove the `if: false` line
3. Go to repository **Settings → Pages**
4. Under "Source", select **GitHub Actions**
5. Push to main or trigger manually

### GitHub Actions (CI/CD)

Add secrets to your repository and reference them in workflows:

```yaml
# .github/workflows/deploy.yml
jobs:
  build:
    steps:
      - name: Build
        run: npm run build
        env:
          VITE_CLARITY_ID: ${{ secrets.CLARITY_ID }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          VITE_SENTRY_RELEASE: ${{ github.sha }}
```

**Never** commit secrets directly in workflow files.

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   # For testing observability locally
   VITE_CLARITY_ID=your-clarity-id
   VITE_CLARITY_FORCE_ENABLE=true
   
   VITE_SENTRY_DSN=your-sentry-dsn
   VITE_SENTRY_FORCE_ENABLE=true
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

**Note**: `.env.local` is git-ignored by default.

## Security Headers

Both Vercel and Netlify configurations include security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enable XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict features |

### Content Security Policy (CSP)

A baseline CSP is not included by default because:
1. It requires careful tuning to avoid breaking legitimate scripts
2. Sentry and Clarity inject scripts dynamically
3. Inline styles from UI libraries may be blocked

If you need CSP, test thoroughly and consider:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.clarity.ms https://*.sentry.io 'unsafe-inline'; connect-src 'self' https://*.sentry.io https://www.clarity.ms; img-src 'self' data: https:;
```

## Caching Strategy

| Resource | Cache-Control | Notes |
|----------|--------------|-------|
| `/assets/*` | `max-age=31536000, immutable` | Vite hashes filenames |
| `*.js`, `*.css` | `max-age=31536000, immutable` | Content-addressed |
| `*.woff2` | `max-age=31536000, immutable` | Fonts |
| `/index.html` | `max-age=0, must-revalidate` | Always fetch latest |

## Troubleshooting

### Build fails with "Environment variable validation failed"

Check the error message for the specific variable and fix the value:
- Sample rates must be 0.0-1.0
- URLs must be valid (start with `https://`)
- Boolean flags should be `'true'` or `'false'` strings

### Observability not working in production

1. Verify environment variables are set in your platform
2. Trigger a new build (env vars are build-time constants)
3. Check browser DevTools Network tab for script requests
4. Check browser console for initialization messages

### Assets 404 on GitHub Pages

Ensure the base path is correctly set:
1. Check `GITHUB_PAGES=true` is set in the workflow
2. Or manually set `VITE_BASE_PATH=/repo-name/`
3. Verify assets in `dist/` have correct paths

## Related Documentation

- [Observability Setup](observability.md) - Detailed Clarity/Sentry configuration
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [.env.example](../frontend/.env.example) - Template with all variables
