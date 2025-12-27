# PR Preview Deployment Guide

Complete guide for enabling and using PR (Pull Request) preview deployments. Preview deployments give each PR a unique URL so you can test changes before merging to production.

---

## Overview

**What are PR Previews?**
- Unique URL for each pull request
- Automatic deployment when PR is created/updated
- Live preview of changes before merging
- Perfect for reviewing visual changes, testing features, or sharing with stakeholders

**Benefits**:
- ✅ Test changes in production-like environment
- ✅ Share preview with team/stakeholders
- ✅ Catch bugs before production
- ✅ No need to run code locally for review
- ✅ Automatic cleanup when PR is closed

---

## Platform Setup

PR previews are **automatic** on most modern hosting platforms. Choose your platform:

- **[Vercel](#vercel-pr-previews-automatic)** - Zero config, instant previews
- **[Netlify](#netlify-pr-previews-automatic)** - Zero config, instant previews
- **[Cloudflare Pages](#cloudflare-pages-pr-previews-automatic)** - Zero config, instant previews
- **[GitHub Pages](#github-pages-pr-previews-manual-setup)** - Requires manual setup

---

## Vercel PR Previews (Automatic)

### Setup (One-Time)

**Prerequisites**:
- Vercel project already deployed (see [Production Deployment Guide](./deploy_production.md))
- GitHub repository connected to Vercel

**That's it!** PR previews work automatically. No configuration needed.

### How It Works

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes** and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/my-new-feature
   ```

3. **Open pull request** on GitHub

4. **Vercel automatically**:
   - Detects new PR
   - Builds the branch
   - Deploys to preview URL
   - Comments on PR with preview URL

### Preview URL Format

```
https://your-project-name-git-branch-name-username.vercel.app
```

**Example**:
```
https://premium-cv-port-land-git-feature-update-raminyazdani.vercel.app
```

### Finding Preview URL

**Option 1: PR Comment**
- Vercel bot comments on PR with preview URL
- Look for comment: "✅ Preview deployed to..."

**Option 2: Vercel Dashboard**
- Go to [vercel.com](https://vercel.com)
- Click your project
- Go to "Deployments" tab
- Find deployment with PR name
- Click to see preview URL

**Option 3: GitHub Checks**
- Scroll to PR checks section
- Click "Details" next to "Vercel - Preview"
- Opens preview URL

### Preview Updates

**Automatic updates**:
- Every commit to PR branch triggers new deployment
- Preview URL stays the same (branch-based)
- Typically updates in 1-3 minutes

**Force redeploy**:
- Push empty commit: `git commit --allow-empty -m "Trigger deploy"`

### Preview Cleanup

**Automatic cleanup**:
- When PR is merged: Preview stays for 7 days (configurable)
- When PR is closed: Preview deleted immediately

### Configuration (Optional)

**`vercel.json`** - Control preview behavior:
```json
{
  "github": {
    "silent": false,
    "enabled": true
  },
  "git": {
    "deploymentEnabled": {
      "main": true,
      "feature/**": true
    }
  }
}
```

---

## Netlify PR Previews (Automatic)

### Setup (One-Time)

**Prerequisites**:
- Netlify site already deployed (see [Production Deployment Guide](./deploy_production.md))
- GitHub repository connected to Netlify

**That's it!** PR previews work automatically.

### How It Works

1. **Create PR** (same as Vercel process above)

2. **Netlify automatically**:
   - Detects PR
   - Builds branch
   - Deploys to preview URL
   - Comments on PR with preview URL

### Preview URL Format

```
https://deploy-preview-{PR-NUMBER}--your-site-name.netlify.app
```

**Example**:
```
https://deploy-preview-42--premium-cv-port-land.netlify.app
```

### Finding Preview URL

**Option 1: PR Comment**
- Netlify bot comments: "Deploy preview for..."
- Click the link

**Option 2: Netlify Dashboard**
- Go to [netlify.com](https://netlify.com)
- Click your site
- Go to "Deploys" tab
- Filter by "Deploy previews"
- Click preview to see URL

**Option 3: GitHub Checks**
- Click "Details" next to "netlify/..." check
- Opens preview URL

### Preview Updates

**Automatic updates**:
- Every commit to PR branch triggers rebuild
- Preview URL changes (includes new commit hash)
- Updates in 2-4 minutes

### Preview Cleanup

**Automatic cleanup**:
- When PR is merged/closed: Preview deleted after 7 days (configurable)

### Configuration (Optional)

**`netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.deploy-preview]
  command = "npm run build"
  
[context.deploy-preview.environment]
  NODE_VERSION = "20"
```

---

## Cloudflare Pages PR Previews (Automatic)

### Setup (One-Time)

**Prerequisites**:
- Cloudflare Pages project deployed (see [Production Deployment Guide](./deploy_production.md))
- GitHub repository connected

**That's it!** PR previews work automatically.

### How It Works

1. **Create PR** (same process as above)

2. **Cloudflare automatically**:
   - Detects PR
   - Builds branch
   - Deploys to preview URL
   - Comments on PR

### Preview URL Format

```
https://pr-{PR-NUMBER}.your-project-name.pages.dev
```

**Example**:
```
https://pr-42.premium-cv-port-land.pages.dev
```

### Finding Preview URL

**Option 1: PR Comment**
- Cloudflare bot comments with preview URL
- Click to visit

**Option 2: Cloudflare Dashboard**
- Go to Cloudflare dashboard
- Navigate to "Workers & Pages"
- Click your project
- Go to "Deployments" tab
- Filter by preview deployments

**Option 3: GitHub Checks**
- Click "Details" next to Cloudflare check

### Preview Updates

**Automatic updates**:
- Every commit triggers rebuild
- Preview URL stays consistent (PR-based)
- Updates in 2-4 minutes

### Preview Cleanup

**Automatic cleanup**:
- Preview deleted when PR is merged/closed

---

## GitHub Pages PR Previews (Manual Setup)

⚠️ **Note**: GitHub Pages does not natively support automatic PR previews. This requires custom workflow setup.

### Option A: Using GitHub Actions + Artifacts (Recommended)

**Workflow**: `.github/workflows/pr-preview.yml`

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [ main ]

permissions:
  contents: read
  pull-requests: write

jobs:
  build-preview:
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
      
      - name: Upload preview artifact
        uses: actions/upload-artifact@v4
        with:
          name: pr-preview-${{ github.event.pull_request.number }}
          path: dist/
          retention-days: 7
      
      - name: Comment PR with artifact link
        uses: actions/github-script@v7
        with:
          script: |
            const pr_number = context.payload.pull_request.number;
            const run_id = context.runId;
            const repo = context.repo;
            
            const artifactUrl = `https://github.com/${repo.owner}/${repo.repo}/actions/runs/${run_id}`;
            
            github.rest.issues.createComment({
              owner: repo.owner,
              repo: repo.repo,
              issue_number: pr_number,
              body: `🔍 **Preview Build Complete**\n\n` +
                    `Download the preview build artifact:\n` +
                    `${artifactUrl}\n\n` +
                    `To test locally:\n` +
                    `1. Download the artifact\n` +
                    `2. Extract the files\n` +
                    `3. Serve with: \`npx serve dist\`\n` +
                    `4. Open http://localhost:3000`
            });
```

**Features**:
- ✅ Builds PR on every commit
- ✅ Uploads build as artifact
- ✅ Comments PR with download link
- ❌ No live URL (manual download required)

### Option B: Using Surge.sh (Free, Live URLs)

**Setup**:

1. **Install Surge CLI**:
   ```bash
   npm install -g surge
   ```

2. **Create Surge token**:
   ```bash
   surge token
   # Copy token
   ```

3. **Add token to GitHub Secrets**:
   - Go to repository "Settings" → "Secrets and variables" → "Actions"
   - Add secret: `SURGE_TOKEN` = your token

4. **Create workflow**: `.github/workflows/pr-preview-surge.yml`

```yaml
name: PR Preview (Surge)

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [ main ]

permissions:
  contents: read
  pull-requests: write

jobs:
  deploy-preview:
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
      
      - name: Install Surge
        run: npm install -g surge
      
      - name: Deploy to Surge
        run: |
          surge ./dist pr-${{ github.event.pull_request.number }}-premium-cv.surge.sh --token ${{ secrets.SURGE_TOKEN }}
      
      - name: Comment PR with preview URL
        uses: actions/github-script@v7
        with:
          script: |
            const pr_number = context.payload.pull_request.number;
            const previewUrl = `https://pr-${pr_number}-premium-cv.surge.sh`;
            
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: pr_number,
              body: `✅ **Preview Deployed**\n\n` +
                    `🔗 Preview URL: ${previewUrl}\n\n` +
                    `This preview will be available until the PR is closed.`
            });
```

**Features**:
- ✅ Live preview URL
- ✅ Free hosting on Surge.sh
- ✅ Automatic comments on PR
- ⚠️ Requires Surge account and token

---

## Using PR Previews

### Workflow Example

**1. Create Feature Branch**:
```bash
git checkout -b feature/update-education-section
```

**2. Make Changes**:
```bash
# Edit files
vim src/components/sections/EducationSection.tsx

# Test locally
npm run dev

# Commit
git add .
git commit -m "Update education section layout"
git push origin feature/update-education-section
```

**3. Open Pull Request**:
- Go to GitHub repository
- Click "Compare & pull request"
- Fill in PR description
- Click "Create pull request"

**4. Wait for Preview** (1-4 minutes):
- Platform builds your branch
- Bot comments with preview URL

**5. Review Preview**:
- Click preview URL
- Test all features
- Check mobile responsiveness
- Verify changes look correct

**6. Share with Team**:
- Copy preview URL
- Share via Slack, email, etc.
- Team can review without local setup

**7. Make Additional Changes** (if needed):
```bash
# Make more changes
git add .
git commit -m "Fix responsive layout"
git push origin feature/update-education-section

# Preview auto-updates (1-4 minutes)
```

**8. Merge When Ready**:
- Click "Merge pull request"
- Production automatically deploys
- Preview cleaned up

---

## PR Preview Best Practices

### Before Opening PR

- ✅ Test locally first: `npm run dev`
- ✅ Run tests: `npm run test`
- ✅ Run linter: `npm run lint`
- ✅ Build locally: `npm run build`
- ✅ Preview build: `npm run preview`

### When Reviewing PR Preview

**Visual Review**:
- [ ] Layout looks correct on desktop
- [ ] Layout looks correct on mobile
- [ ] No horizontal scroll
- [ ] Images load correctly
- [ ] Animations work smoothly
- [ ] No visual glitches

**Functional Review**:
- [ ] All links work
- [ ] Language switcher works (EN/DE/FA)
- [ ] Theme switcher works
- [ ] Filter functionality works
- [ ] No console errors
- [ ] No 404s for assets

**Performance Review**:
- [ ] Page loads quickly
- [ ] No jank or lag
- [ ] Lighthouse score acceptable (if changed)

**Accessibility Review**:
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible (if changed)

### Testing Different Scenarios

**Language Testing**:
```bash
# Test each language
Preview-URL/?lang=en
Preview-URL/?lang=de
Preview-URL/?lang=fa
```

**Theme Testing**:
- Toggle dark/light mode
- Try different theme presets
- Check contrast ratios

**Filter Testing**:
- Test "Full CV" filter
- Test specific focus areas
- Verify sections update correctly

**Mobile Testing**:
- Open preview on mobile device
- Test touch interactions
- Check responsive breakpoints
- Verify no layout issues

---

## Troubleshooting PR Previews

### Preview Not Generated

**Symptom**: PR opened but no preview URL

**Solutions**:
1. **Check platform dashboard**: See if build is running
2. **Check build logs**: Look for errors
3. **Verify configuration**: Ensure PR previews enabled
4. **Check branch name**: Some platforms filter by branch patterns
5. **Wait longer**: First preview may take 5-10 minutes

### Preview Build Failed

**Symptom**: Build fails on preview but works locally

**Solutions**:
1. **Check build logs**: Find specific error
2. **Verify environment**: Check Node.js version
3. **Test build locally**: `npm ci && npm run build`
4. **Check dependencies**: Ensure `package-lock.json` committed
5. **Clear cache**: Trigger fresh build

### Preview Shows Old Content

**Symptom**: Preview doesn't reflect latest changes

**Solutions**:
1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear cache**: Clear browser cache
3. **Check deployment time**: Ensure latest deployment finished
4. **Verify commit**: Check preview is using correct commit
5. **Force redeploy**: Push empty commit

### Preview URL Not Working

**Symptom**: Preview URL gives 404 or error

**Solutions**:
1. **Wait for propagation**: Can take 1-2 minutes
2. **Check URL format**: Ensure correct URL structure
3. **Verify deployment status**: Check platform dashboard
4. **Check redirects**: Ensure SPA redirects configured
5. **Test different browser**: Rule out browser issues

### Multiple Previews for Same PR

**Symptom**: PR has multiple preview URLs

**This is normal** - depends on platform:
- **Vercel**: One URL per branch (updates in place)
- **Netlify**: New URL per commit (shows history)
- **Cloudflare**: One URL per PR (updates in place)

**Recommendation**: Use latest preview URL

---

## Advanced PR Preview Features

### Password Protection (Platform-Dependent)

**Vercel**:
- Available on Pro plan
- Add password protection to preview deployments
- Configure in project settings

**Netlify**:
- Available on all plans
- Go to "Site settings" → "Visitor access"
- Set password for deploy previews

**Cloudflare**:
- Use Cloudflare Access for authentication
- Configure in Cloudflare dashboard

### Custom Preview Domains

**Vercel**:
```json
// vercel.json
{
  "github": {
    "autoAlias": true
  }
}
```

**Netlify**:
- Deploy previews use automatic subdomain
- Can configure custom patterns in settings

### Preview Environment Variables

**Different vars for preview vs production**:

**Vercel**:
- Go to "Settings" → "Environment Variables"
- Select "Preview" scope
- Add preview-specific values

**Netlify**:
```toml
# netlify.toml
[context.deploy-preview.environment]
  VITE_ENV = "preview"
  VITE_API_URL = "https://preview-api.example.com"
```

### Preview Notifications

**Slack Integration**:
- **Vercel**: Settings → Integrations → Slack
- **Netlify**: Settings → Notifications → Slack
- **Cloudflare**: Use webhooks

**Email Notifications**:
- Enable in platform settings
- Get notified on preview success/failure

---

## PR Preview Checklist

### For PR Author

When opening PR:
- [ ] Describe changes in PR description
- [ ] Reference any related issues
- [ ] Wait for preview to be generated
- [ ] Test preview URL yourself first
- [ ] List specific areas to review
- [ ] Mention any known issues

### For PR Reviewer

When reviewing PR:
- [ ] Read PR description
- [ ] Check preview URL works
- [ ] Test main functionality
- [ ] Check responsive design
- [ ] Verify no console errors
- [ ] Test edge cases
- [ ] Leave feedback as PR comments
- [ ] Approve or request changes

---

## Security Considerations

### Public Preview URLs

⚠️ **Preview URLs are publicly accessible** (no authentication by default)

**Implications**:
- Anyone with URL can view preview
- Don't include sensitive data in previews
- Preview data is same as production data
- Consider password protection for sensitive projects

### Preview Environment

**Best practices**:
- Don't use production API keys in previews
- Use separate preview/staging backends (if applicable)
- Review preview URLs before sharing externally
- Don't commit secrets to repository

---

## Cost Considerations

### Free Tiers

| Platform | Preview Builds | Duration | Concurrent |
|----------|----------------|----------|------------|
| **Vercel** | Unlimited | Permanent (until PR closed) | Unlimited |
| **Netlify** | 300 min/month | 7 days after PR closed | Unlimited |
| **Cloudflare** | 500 builds/month | Until PR closed | Unlimited |
| **GitHub Actions** | 2,000 min/month | N/A (artifact-based) | Depends |

**For this project**: Free tiers are sufficient for typical usage.

---

## Next Steps

1. ✅ **Choose deployment platform** (see [Production Deployment](./deploy_production.md))
2. ✅ **Deploy production** first
3. ✅ **Open a test PR** to verify preview deployment works
4. ✅ **Share preview URLs** with team for feedback
5. ✅ **Merge PRs** confidently knowing changes are tested

---

## Additional Resources

- **Production Deployment Guide**: `docs/deploy_production.md`
- **CI/CD Guide**: `docs/ci.md`
- **Local Development Guide**: `docs/local_dev.md`

### Platform Documentation

- [Vercel PR Previews](https://vercel.com/docs/deployments/preview-deployments)
- [Netlify Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)
- [Cloudflare Pages Previews](https://developers.cloudflare.com/pages/platform/preview-deployments/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

*Preview your changes before production! 🔍*
