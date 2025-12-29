# Production Deployment Guide

Complete guide for deploying this CV/Portfolio website to production hosting platforms.

---

## Overview

This is a **static site** (frontend-only React SPA) that can be deployed to any modern static hosting platform. This guide covers:

1. **Platform recommendations** and comparison
2. **Step-by-step deployment** for each platform
3. **Configuration requirements**
4. **Custom domain setup**
5. **Troubleshooting**

**Prerequisites**:
- Repository on GitHub
- Node.js 20+ for local testing
- GitHub account with repository access

---

## Quick Deployment (Fastest Path)

Choose your preferred platform and follow the link:
- **[Vercel](#option-1-vercel-recommended)** - Zero-config, fastest setup (~5 min)
- **[Netlify](#option-2-netlify)** - Zero-config, great DX (~5 min)
- **[Cloudflare Pages](#option-3-cloudflare-pages)** - Zero-config, fast CDN (~7 min)
- **[GitHub Pages](#option-4-github-pages)** - Free, GitHub-native (~10 min)

---

## Platform Comparison

| Feature | Vercel | Netlify | Cloudflare Pages | GitHub Pages |
|---------|--------|---------|------------------|--------------|
| **Setup Time** | ~5 min | ~5 min | ~7 min | ~10 min |
| **Zero Config** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Requires workflow |
| **Auto-Detect Vite** | ✅ Yes | ✅ Yes | ✅ Yes | N/A |
| **PR Previews** | ✅ Automatic | ✅ Automatic | ✅ Automatic | ⚠️ Manual setup |
| **Custom Domains** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **HTTPS** | ✅ Automatic | ✅ Automatic | ✅ Automatic | ✅ Automatic |
| **Build Time** | Fast | Fast | Fast | Medium |
| **CDN** | Global | Global | Global | GitHub's CDN |
| **Free Tier** | Generous | Generous | Generous | Unlimited |
| **Analytics** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ Manual |
| **Environment Vars** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ In workflow |

**Recommendation**: Start with **Vercel** or **Netlify** for the easiest experience.

---

## Option 1: Vercel (Recommended)

**Best for**: Fastest deployment with zero configuration

### Step 1: Sign Up / Log In

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Find your repository: `Raminyazdani/premium-cv-port-land`
3. Click "Import"

### Step 3: Configure Project

**Framework Preset**: Vite (auto-detected)

**Build Settings** (auto-populated from root `vercel.json`):
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

**Root Directory**: Leave blank (use root - the root `vercel.json` handles the frontend subdirectory)

**Environment Variables**: None required (leave empty)

### Step 4: Deploy

1. Click "Deploy"
2. Wait 1-3 minutes for build to complete
3. You'll see "🎉 Deployment Ready"

### Step 5: Get Production URL

Your site is now live at:
```
https://your-project-name.vercel.app
```

**Example**: `https://premium-cv-port-land.vercel.app`

### Step 6: Custom Domain (Optional)

1. Go to project "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions:
   - Add CNAME record: `yourdomain.com` → `cname.vercel-dns.com`
   - Wait for DNS propagation (5-60 minutes)
5. Vercel automatically provisions SSL certificate

### Automatic Deployments

**Production**:
- Every push to `main` branch automatically deploys to production
- URL: `https://your-project-name.vercel.app`

**Preview**:
- Every push to non-main branches gets preview deployment
- Every pull request gets unique preview URL
- See [PR Preview Guide](./deploy_preview_pr.md) for details

### Vercel CLI (Optional)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from command line
vercel

# Deploy to production
vercel --prod
```

---

## Option 2: Netlify

**Best for**: Great developer experience with powerful features

### Step 1: Sign Up / Log In

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" or "Log in"
3. Choose "GitHub" to authenticate
4. Authorize Netlify to access your repositories

### Step 2: Add New Site

1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Authorize Netlify (if first time)
4. Select repository: `Raminyazdani/premium-cv-port-land`

### Step 3: Configure Build Settings

**Site Settings** (auto-detected, verify):
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: Leave blank

**Environment Variables**: None required

### Step 4: Deploy

1. Click "Deploy site"
2. Wait 2-3 minutes for build
3. Site is live!

### Step 5: Get Production URL

Your site is live at:
```
https://random-name-12345.netlify.app
```

**Customize URL**:
1. Go to "Site settings" → "General" → "Site details"
2. Click "Change site name"
3. Enter custom subdomain: `yourname.netlify.app`

### Step 6: Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration:
   - Add A record or CNAME as instructed
   - Netlify automatically provisions SSL
5. Wait for DNS propagation (5-60 minutes)

### Automatic Deployments

**Production**:
- Every push to `main` → production deployment
- URL: `https://yourname.netlify.app`

**Preview**:
- Every PR → deploy preview with unique URL
- See [PR Preview Guide](./deploy_preview_pr.md)

### Netlify CLI (Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## Option 3: Cloudflare Pages

**Best for**: Cloudflare's global CDN and edge network

### Step 1: Sign Up / Log In

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up or log in to Cloudflare
3. Go to "Workers & Pages"

### Step 2: Create Project

1. Click "Create application" → "Pages"
2. Click "Connect to Git"
3. Authorize Cloudflare to access GitHub
4. Select repository: `Raminyazdani/premium-cv-port-land`

### Step 3: Configure Build

**Build Settings**:
- **Production branch**: `main`
- **Framework preset**: Vite (auto-detected)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: Leave blank

**Environment Variables**: None required

### Step 4: Deploy

1. Click "Save and Deploy"
2. Wait 2-4 minutes for build
3. Site is live!

### Step 5: Get Production URL

Your site is live at:
```
https://your-project-name.pages.dev
```

### Step 6: Custom Domain (Optional)

1. Go to "Custom domains" tab
2. Click "Set up a custom domain"
3. Enter your domain
4. Follow DNS setup instructions
5. Cloudflare automatically provisions SSL

### Automatic Deployments

**Production**:
- Push to `main` → automatic deployment

**Preview**:
- Every PR → preview deployment with unique URL
- See [PR Preview Guide](./deploy_preview_pr.md)

---

## Option 4: GitHub Pages

**Best for**: Free hosting, GitHub-native, simple static sites

**Note**: Requires manual workflow setup. See separate section below.

### Step 1: Enable GitHub Pages

1. Go to repository: `https://github.com/Raminyazdani/premium-cv-port-land`
2. Click "Settings" → "Pages"
3. Under "Source", select "GitHub Actions"

### Step 2: Add Deployment Workflow

**Option A**: Use the workflow provided in this guide (see [GitHub Actions Workflow](#github-actions-workflow) below)

**Option B**: Create workflow manually:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Commit and push the workflow

### Step 3: Trigger Deployment

1. Push to `main` branch (or trigger manually)
2. Wait for workflow to complete (~2-3 minutes)
3. Check "Actions" tab for status

### Step 4: Get Production URL

Your site is live at:
```
https://raminyazdani.github.io/premium-cv-port-land/
```

**For custom domain**:
```
https://yourdomain.com
```

### Step 5: Custom Domain (Optional)

1. Go to "Settings" → "Pages"
2. Under "Custom domain", enter your domain
3. Add CNAME or A record in your DNS:
   - CNAME: `yourdomain.com` → `raminyazdani.github.io`
   - Or follow GitHub's IP instructions
4. Wait for DNS propagation
5. Enable "Enforce HTTPS"

### Limitations

- ⚠️ No automatic PR previews (requires custom setup)
- ⚠️ Slower than dedicated CDN platforms
- ⚠️ Base path issues if not using custom domain
- ⚠️ More complex configuration

---

## Post-Deployment Verification

After deploying, verify the following:

### 1. Site Loads Successfully

```bash
# Visit your production URL
https://your-site.com

# Check response
curl -I https://your-site.com
# Should see: HTTP/2 200
```

### 2. Check Core Features

- [ ] Homepage loads without errors
- [ ] All sections render (Education, Experience, Projects, etc.)
- [ ] Language switcher works (EN/DE/FA)
- [ ] Theme switcher works
- [ ] Filter by focus works
- [ ] Images load correctly
- [ ] No console errors (open DevTools)

### 3. Test Different Languages

- [ ] English: `https://your-site.com/?lang=en`
- [ ] German: `https://your-site.com/?lang=de`
- [ ] Persian: `https://your-site.com/?lang=fa`

### 4. Test Performance

```bash
# Use Lighthouse in Chrome DevTools
# Target scores:
# - Performance: >90
# - Accessibility: >90
# - Best Practices: >90
# - SEO: >90
```

### 5. Test Mobile

- Visit site on mobile device
- Check responsive design
- Test touch interactions
- Verify no horizontal scroll

---

## Configuration Files (Optional)

While most platforms auto-detect Vite, you can add configuration files for explicit control:

### Vercel Configuration

**`vercel.json`** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify Configuration

**`netlify.toml`** (optional):
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
```

### Cloudflare Pages Configuration

**Configuration through UI** (no file needed, but you can create `_redirects`):

**`public/_redirects`**:
```
/* /index.html 200
```

---

## Environment Variables

This application **does not require** environment variables for basic functionality.

### Optional Variables

If you want to add analytics or feature flags:

**Vercel**:
1. Go to project "Settings" → "Environment Variables"
2. Add variables:
   ```
   VITE_GA_ID=G-XXXXXXXXXX
   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
   ```

**Netlify**:
1. Go to "Site settings" → "Environment variables"
2. Add variables (same as above)

**Cloudflare Pages**:
1. Go to project "Settings" → "Environment variables"
2. Add variables (same as above)

**GitHub Pages**:
Add to workflow file:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_GA_ID: ${{ secrets.VITE_GA_ID }}
```

---

## SSL/HTTPS Configuration

All recommended platforms provide **automatic HTTPS**:

- ✅ **Vercel**: Automatic Let's Encrypt certificate
- ✅ **Netlify**: Automatic Let's Encrypt certificate
- ✅ **Cloudflare Pages**: Automatic Cloudflare SSL
- ✅ **GitHub Pages**: Automatic certificate after DNS validation

**No manual SSL configuration needed!**

---

## Continuous Deployment

All platforms support automatic deployment:

### Deployment Triggers

- ✅ Push to `main` branch → Production deployment
- ✅ Push to other branches → Preview deployment
- ✅ Pull request opened → Preview deployment
- ✅ Manual trigger (via platform UI or CLI)

### Deployment Process

1. **Trigger**: Push to GitHub
2. **Build**: Platform detects change and starts build
3. **Test**: Runs `npm run build`
4. **Deploy**: Uploads `dist/` to CDN
5. **Notify**: Sends notification (email, Slack, etc.)

**Average deployment time**: 2-4 minutes

---

## Rollback & History

All platforms maintain deployment history:

### Vercel
- Go to "Deployments" tab
- Click any previous deployment
- Click "Promote to Production"

### Netlify
- Go to "Deploys" tab
- Find previous deploy
- Click "Publish deploy"

### Cloudflare Pages
- Go to "Deployments" tab
- Select previous deployment
- Click "Rollback to this deployment"

### GitHub Pages
- Revert commit in Git
- Push to trigger redeploy
- Or manually trigger previous workflow

---

## Monitoring & Analytics

### Built-in Analytics

**Vercel**:
- Go to "Analytics" tab
- View page views, unique visitors, top pages
- Real-time analytics

**Netlify**:
- Go to "Analytics" tab (paid feature)
- Or use Netlify plugin for analytics

**Cloudflare Pages**:
- Go to "Analytics" tab
- View requests, bandwidth, errors
- Real-time data

### External Analytics

Add Google Analytics or Plausible:

1. Add environment variable (see [Environment Variables](#environment-variables))
2. Update code to use analytics (if not already implemented)
3. Deploy

---

## Troubleshooting

### Build Fails

**Symptom**: Deployment fails during build

**Solutions**:
1. Check build logs on platform
2. Test build locally: `npm run build`
3. Check Node.js version (should be 20)
4. Check for dependency issues: `npm audit`
5. Verify all dependencies in `package.json`

### Site Shows 404

**Symptom**: Deployment succeeds but site shows 404

**Solutions**:
1. Verify output directory is `dist`
2. Check `dist/index.html` exists after build
3. Add redirects configuration (see [Configuration Files](#configuration-files-optional))
4. Check base path in `vite.config.ts` (should be `/` for root domain)

### Assets Not Loading

**Symptom**: Page loads but images/styles missing

**Solutions**:
1. Check asset paths are relative or absolute
2. Verify assets in `dist/assets/` after build
3. Check CORS headers (shouldn't be issue for static site)
4. Check browser console for 404 errors
5. Verify Cloudinary URLs are accessible

### Slow Initial Load

**Symptom**: First page load is slow

**Solutions**:
1. Check Lighthouse performance score
2. Enable platform's caching
3. Use platform's image optimization (if available)
4. Consider lazy loading more components
5. Check bundle size: `npm run build` (should see size warning)

### Custom Domain Not Working

**Symptom**: Custom domain shows error or doesn't load

**Solutions**:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours, usually 1-2 hours)
3. Check DNS with: `dig yourdomain.com` or `nslookup yourdomain.com`
4. Verify SSL certificate provisioned
5. Check platform's custom domain status page

---

## Security Considerations

### Automatic Security

All platforms provide:
- ✅ HTTPS/SSL by default
- ✅ Automatic security headers
- ✅ DDoS protection
- ✅ WAF (Web Application Firewall) on some platforms

### Additional Security Headers

Add to `netlify.toml` or Vercel configuration:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### Dependency Security

- ✅ Dependabot enabled in repository
- ✅ Regular security updates
- ✅ `npm audit` in CI pipeline

---

## Cost Considerations

### Free Tiers

| Platform | Build Minutes | Bandwidth | Sites |
|----------|---------------|-----------|-------|
| **Vercel** | 6,000 min/month | 100 GB/month | Unlimited |
| **Netlify** | 300 min/month | 100 GB/month | Unlimited |
| **Cloudflare Pages** | 500 builds/month | Unlimited | Unlimited |
| **GitHub Pages** | Unlimited | 100 GB/month | Unlimited |

**Recommendation**: All free tiers are sufficient for this project.

### Paid Plans (Optional)

Only needed for:
- High traffic (>100 GB/month)
- Many builds (>300-500/month)
- Team features
- Advanced analytics
- Priority support

---

## Next Steps

1. ✅ **Deploy to production** (choose platform above)
2. ✅ **Verify deployment** (run through checklist)
3. ✅ **Set up PR previews** (see [PR Preview Guide](./deploy_preview_pr.md))
4. ✅ **Configure custom domain** (optional)
5. ✅ **Set up monitoring** (optional)
6. ✅ **Test all features** on production URL

---

## Additional Resources

- **PR Preview Guide**: `docs/deploy_preview_pr.md`
- **CI/CD Guide**: `docs/ci.md`
- **Local Development**: `docs/local_dev.md`
- **Stack Detection**: `docs/stack_detection.md`

### Platform Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

*Your site is now ready for production! 🚀*
