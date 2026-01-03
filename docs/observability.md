# Observability Setup Guide

This document describes how to set up runtime UX feedback for the CV Portfolio website using Microsoft Clarity, Sentry, and Google Analytics 4 (GA4).

## Overview

The observability integration provides:

- **Microsoft Clarity**: Session replays and heatmaps to understand user behavior
- **Sentry**: Runtime error tracking and optional performance monitoring
- **Google Analytics 4** (optional): Page view and event analytics with consent management

All tools are:
- ✅ **Environment-gated**: Only enabled when env vars are set
- ✅ **Production-only by default**: Disabled in development unless force-enabled
- ✅ **Privacy-safe**: Masking and PII scrubbing enabled by default
- ✅ **Zero overhead when disabled**: No scripts loaded if env vars are missing
- ✅ **Fail-safe**: App works perfectly without any observability configured

## Quick Setup

### 1. Microsoft Clarity

1. Create a free account at [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Create a new project for your website
3. Copy your **Project ID** from Settings → Setup
4. Set the environment variable:
   ```bash
   VITE_CLARITY_ID=your-project-id
   ```

### 2. Sentry

1. Create a free account at [sentry.io](https://sentry.io/)
2. Create a new React project
3. Copy your **DSN** from Settings → Client Keys (DSN)
4. Set the environment variable:
   ```bash
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

### 3. Google Analytics 4 (Optional)

1. Create a free account at [analytics.google.com](https://analytics.google.com/)
2. Create a new property for your website
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Set the environment variable:
   ```bash
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

> **Note**: GA4 events are only sent when:
> - The measurement ID is configured
> - User has given consent (stored in `localStorage`)
> - Do Not Track (DNT) header is not enabled (respects user privacy preference)
> - App is running in production mode

## Environment Variables

Copy `.env.example` to `.env.local` for local development, or configure in your hosting platform for production.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_CLARITY_ID` | No | - | Microsoft Clarity project ID |
| `VITE_CLARITY_FORCE_ENABLE` | No | `false` | Force enable in development |
| `VITE_SENTRY_DSN` | No | - | Sentry DSN URL |
| `VITE_SENTRY_FORCE_ENABLE` | No | `false` | Force enable in development |
| `VITE_SENTRY_RELEASE` | No | - | Release version for tracking |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | No | `0.1` | Performance traces sample rate |
| `VITE_SENTRY_REPLAYS_SESSION_RATE` | No | `0` | Session replay sample rate |
| `VITE_SENTRY_REPLAYS_ERROR_RATE` | No | `0` | Error replay sample rate |
| `VITE_GA4_MEASUREMENT_ID` | No | - | Google Analytics 4 Measurement ID |

## Platform-Specific Setup

### Vercel

1. Go to Project Settings → Environment Variables
2. Add your variables for Production environment:
   ```
   VITE_CLARITY_ID=your-clarity-id
   VITE_SENTRY_DSN=your-sentry-dsn
   ```
3. Redeploy to apply

### Netlify

1. Go to Site Settings → Environment Variables
2. Add variables:
   ```
   VITE_CLARITY_ID=your-clarity-id
   VITE_SENTRY_DSN=your-sentry-dsn
   ```
3. Trigger a new deploy

### GitHub Actions (CI/CD)

Add secrets to your repository:

```yaml
# .github/workflows/deploy.yml
env:
  VITE_CLARITY_ID: ${{ secrets.CLARITY_ID }}
  VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  VITE_GA4_MEASUREMENT_ID: ${{ secrets.GA4_MEASUREMENT_ID }}
```

## Enablement Logic Summary

| Tool | Enabled When | Disabled When |
|------|--------------|---------------|
| **Clarity** | `VITE_CLARITY_ID` set AND (production OR `VITE_CLARITY_FORCE_ENABLE=true`) | Missing ID or dev mode without force flag |
| **Sentry** | `VITE_SENTRY_DSN` set AND (production OR `VITE_SENTRY_FORCE_ENABLE=true`) | Missing DSN or dev mode without force flag |
| **GA4** | `VITE_GA4_MEASUREMENT_ID` set AND consent given AND DNT not enabled AND production mode | Missing ID, no consent, DNT enabled, or dev mode |

## Privacy Considerations

### Microsoft Clarity

By default, Clarity uses **balanced masking** which:
- Masks all text input fields
- Masks sensitive content detected by ML
- Shows page structure and user interactions

For stricter privacy:
```typescript
// In your code, after initialization:
window.clarity?.('set', 'mask', 'strict');
```

### Sentry

By default:
- PII is NOT sent (`sendDefaultPii: false`)
- Email addresses and phone numbers are scrubbed from error messages
- Common extension/browser errors are ignored

For session replays (if enabled):
- Text masking is applied to form inputs
- Consider GDPR/CCPA compliance before enabling

### Google Analytics 4

GA4 has built-in privacy protections:
- Events only sent after user consent
- Do Not Track (DNT) header is respected
- No events sent in development mode
- No PII is included in event data by default

The analytics module:
- Queues events until consent is given
- Respects browser DNT settings (`navigator.doNotTrack`)
- Provides `setAnalyticsConsent(true/false)` for consent management
- Stores consent preference in `localStorage`

## Verification

### Check Clarity is Working

1. Deploy with `VITE_CLARITY_ID` set
2. Open browser DevTools → Network tab
3. Filter by "clarity.ms"
4. You should see requests to `www.clarity.ms/tag/YOUR_ID`
5. Visit [clarity.microsoft.com](https://clarity.microsoft.com/) → Dashboard
6. Session data appears within a few hours

### Check Sentry is Working

1. Deploy with `VITE_SENTRY_DSN` set
2. Open browser DevTools → Console
3. Trigger an error (e.g., `throw new Error('Test error')` in console)
4. Visit [sentry.io](https://sentry.io/) → Issues
5. You should see the test error

### Check GA4 is Working

1. Deploy with `VITE_GA4_MEASUREMENT_ID` set
2. Open browser DevTools → Console
3. Give consent: `localStorage.setItem('analytics_consent', 'true'); location.reload();`
4. Navigate around the site
5. Open browser DevTools → Network tab, filter by "google-analytics"
6. You should see requests to `www.google-analytics.com`
7. Visit [analytics.google.com](https://analytics.google.com/) → Realtime
8. You should see your session

### Local Testing

To test locally without deploying:

```bash
# Create .env.local with force-enable flags
echo "VITE_CLARITY_ID=your-id" >> .env.local
echo "VITE_CLARITY_FORCE_ENABLE=true" >> .env.local
echo "VITE_SENTRY_DSN=your-dsn" >> .env.local
echo "VITE_SENTRY_FORCE_ENABLE=true" >> .env.local

# Start dev server
npm run dev
```

Check browser DevTools → Network for script requests.

## Production Verification Checklist

Use this checklist to verify observability tools are working correctly in production:

### Pre-flight Checks

- [ ] Environment variables are set in hosting platform (Vercel/Netlify/etc.)
- [ ] Production build completed without errors
- [ ] Site is accessible via production URL

### Clarity Verification

- [ ] Open DevTools → Network, filter by "clarity.ms"
- [ ] Requests to `www.clarity.ms/tag/YOUR_ID` are visible
- [ ] No console errors related to Clarity
- [ ] Dashboard shows sessions within 24 hours

### Sentry Verification

- [ ] Open DevTools → Console
- [ ] Run: `throw new Error('Sentry test ' + Date.now())`
- [ ] Check Sentry dashboard for the error
- [ ] Verify PII is scrubbed (no emails/phones in error message)

### GA4 Verification

- [ ] Set consent: `localStorage.setItem('analytics_consent', 'true')`
- [ ] Reload page and navigate around
- [ ] Check Network tab for google-analytics requests
- [ ] Check GA4 Realtime report for your session
- [ ] Verify DNT respect: Enable DNT in browser, reload, confirm no GA4 requests

### Fail-Safe Verification

- [ ] Build succeeds with all observability env vars unset
- [ ] Site functions normally without observability
- [ ] No console errors about missing env vars

## Troubleshooting

### Scripts Not Loading

1. Verify env vars are set: `console.log(import.meta.env.VITE_CLARITY_ID)`
2. Check you're in production mode: `npm run build && npm run preview`
3. Check browser extensions aren't blocking scripts

### Sentry Not Capturing Errors

1. Check DSN is correct (copy-paste from Sentry settings)
2. Verify no ad-blocker is blocking Sentry
3. Check Sentry project settings → Inbound Filters

### Clarity Not Recording Sessions

1. Sessions under 3 seconds may be filtered
2. Bot traffic is automatically filtered
3. Check Clarity Settings → Data Filters

## Best Practices

### Do

- ✅ Enable only in production
- ✅ Set reasonable sample rates for high-traffic sites
- ✅ Add consent banner if required by local laws (GDPR)
- ✅ Use Sentry release tracking for debugging deployments
- ✅ Monitor costs on free tier limits

### Don't

- ❌ Commit `.env.local` with real credentials
- ❌ Enable session replays without privacy review
- ❌ Set 100% sample rates on high-traffic sites
- ❌ Ignore Sentry errors (review and fix or dismiss)

## Free Tier Limits

### Microsoft Clarity

- ✅ Unlimited sessions
- ✅ Unlimited heatmaps
- ✅ No credit card required
- 90-day data retention

### Sentry

- 5K errors/month (Developer plan)
- 10K transactions/month (for performance)
- 50 session replays/month
- Upgrade to Team plan for higher limits

## Additional Resources

- [Microsoft Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GDPR Compliance for Analytics](https://gdpr.eu/cookies/)
