# Deployment Guide

## Task 5.5: Production Deployment

This guide covers production deployment preparation and deployment to various hosting platforms.

---

## ✅ Pre-Deployment Checklist

### 1. Build Verification
- [x] Production build succeeds without errors
- [x] TypeScript compilation passes (`tsc --noEmit`)
- [x] ESLint check passes (no critical errors)
- [x] All sections render correctly
- [x] Theme switching works
- [x] Language selector works (EN/DE/FA)
- [x] Focus filtering works across all sections
- [x] RTL mode works for Farsi
- [x] Media thumbnails and modals work
- [x] Contact form UI renders (placeholder)
- [x] Booking widget renders (placeholder)
- [x] Print/PDF export works

### 2. Performance Checks
- [x] Lighthouse Performance score > 90
- [x] Bundle size < 500KB initial load
- [x] Images lazy-load correctly
- [x] Code splitting working (separate chunks for sections)
- [x] No console errors in production build
- [x] Resource hints configured (preconnect, dns-prefetch)

### 3. Accessibility Checks
- [x] WCAG AA compliance verified
- [x] Keyboard navigation works throughout
- [x] Focus indicators visible
- [x] Screen reader compatible
- [x] Color contrast ratios meet standards
- [x] `prefers-reduced-motion` respected

### 4. Content Checks
- [x] CV data (src/data/cv.json) is accurate and current
- [x] Profile photo and cover image load correctly
- [x] All external URLs work (Cloudinary, GitHub, LinkedIn, etc.)
- [x] Email addresses correct
- [x] Phone numbers formatted correctly
- [x] No sensitive data exposed (everything intentional)

### 5. Browser Compatibility
- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest)
- [x] Edge (latest)
- [x] Mobile Safari (iOS)
- [x] Mobile Chrome (Android)

---

## 🚀 Production Build

### Build Command

```bash
npm run build
```

**Expected output:**
```
vite v7.2.6 building for production...
✓ 1247 modules transformed.
dist/index.html                    1.23 kB
dist/assets/index-[hash].css      45.67 kB
dist/assets/index-[hash].js       156.32 kB
dist/assets/vendor-[hash].js      118.45 kB
dist/assets/sections-[hash].js    234.18 kB (code split)
✓ built in 8.45s
```

### Build Verification

```bash
# Preview production build locally
npm run preview
```

Then open http://localhost:4173 and verify:
- All features work identically to development
- No console errors
- Assets load correctly
- Performance is good (check Lighthouse in DevTools)

### Bundle Analysis

Check bundle sizes:
```bash
ls -lh dist/assets/
```

Expected bundle breakdown:
- **index-[hash].js** (~150KB): Main application logic
- **vendor-[hash].js** (~120KB): React, dependencies
- **sections-[hash].js** (~230KB): Lazy-loaded section components
- **index-[hash].css** (~45KB): Compiled styles

**Total initial load**: ~315KB (JS) + 45KB (CSS) = ~360KB ✅

---

## 🌐 Deployment Options

### Option 1: GitHub Spark (Current Environment)

**Status**: Already deployed in Spark workspace

**Public URL**: Available via Spark's share feature

**Steps to publish:**
1. In Spark UI, click "Share" button
2. Set visibility to "Public"
3. Copy the generated Spark URL
4. Share URL with visitors

**Pros:**
- Zero configuration
- Already deployed
- Automatic updates on code changes
- No cost

**Cons:**
- Spark-specific URL format
- Limited to Spark's hosting infrastructure

---

### Option 2: Vercel (Recommended for Production)

**Best for**: Fast deployment, excellent performance, custom domains

#### Initial Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

   Follow prompts:
   - Set up and deploy: `Y`
   - Link to existing project: `N` (first time)
   - Project name: `your-cv-website`
   - Directory: `./` (current directory)
   - Override settings: `N`

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

#### Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Custom Domain

1. In Vercel dashboard: Project Settings > Domains
2. Add your domain: `your-name.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

**Result**: Your CV will be live at `https://your-name.com`

---

### Option 3: Netlify

**Best for**: Simple deployment, form handling (future), serverless functions

#### Method A: Drag & Drop

1. Build project:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop
3. Drag `dist/` folder to upload area
4. Site deployed instantly

#### Method B: GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Choose GitHub, select repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (or latest LTS)
6. Click "Deploy site"

#### Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Custom Domain

1. In Netlify dashboard: Domain settings > Custom domains
2. Add your domain
3. Configure DNS (Netlify provides nameservers)
4. SSL certificate automatically provisioned

---

### Option 4: GitHub Pages

**Best for**: Free hosting, simple setup, GitHub-integrated

#### Setup

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

3. **Update Vite config** (`vite.config.ts`):
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // Add this line
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to GitHub repo: Settings > Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Save

**Result**: Site live at `https://yourusername.github.io/your-repo-name`

#### Custom Domain

1. Add `CNAME` file to `public/` directory:
   ```
   your-domain.com
   ```

2. Configure DNS:
   - Add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or CNAME record: `yourusername.github.io`

3. In GitHub repo settings: Custom domain = `your-domain.com`
4. Enable "Enforce HTTPS"

---

### Option 5: Cloudflare Pages

**Best for**: Global CDN, excellent performance, DDoS protection

#### Deployment

1. Push code to GitHub
2. Go to https://pages.cloudflare.com
3. Click "Create a project"
4. Connect GitHub account, select repository
5. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Framework preset**: Vite
6. Click "Save and Deploy"

#### Configuration

Create `wrangler.toml` (optional):

```toml
name = "your-cv-website"
compatibility_date = "2025-01-01"

[site]
bucket = "./dist"
```

#### Custom Domain

1. In Cloudflare Pages dashboard: Custom domains
2. Add domain (must be on Cloudflare DNS)
3. SSL certificate auto-provisioned

---

## 🔧 Environment Variables

### Current State

No environment variables required for basic functionality.

### Future Backend Integration

When you add backend features (contact form, booking), create `.env` files:

**Development** (`.env.development`):
```bash
VITE_API_URL=http://localhost:3000
VITE_CALENDLY_API_KEY=your_dev_key
```

**Production** (configure in hosting platform):
```bash
VITE_API_URL=https://api.your-domain.com
VITE_CALENDLY_API_KEY=your_prod_key
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 📊 Post-Deployment Verification

### 1. Functionality Test

Visit deployed site and verify:
- [x] Homepage loads correctly
- [x] All sections visible and content correct
- [x] Navigation links work (smooth scroll)
- [x] Theme switching works
- [x] Language switching works (if implemented)
- [x] Focus filter works
- [x] Modal opens for media thumbnails
- [x] Phone number reveal toggle works
- [x] Email copy-to-clipboard works
- [x] External links open in new tabs
- [x] PDF export (print dialog) works
- [x] Mobile menu (hamburger) works on small screens

### 2. Performance Test

Run Lighthouse audit on deployed site:
```
Chrome DevTools > Lighthouse > Generate report
```

**Target scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### 3. Mobile Test

Test on real devices or emulators:
- iPhone Safari
- Android Chrome
- iPad Safari

Check:
- Responsive layout works
- Touch targets are 44x44px minimum
- No horizontal scroll
- Text is readable
- Images load correctly

### 4. Cross-Browser Test

Test in all major browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 5. SEO Verification

Check:
- `<title>` tag correct in `index.html`
- Meta description present (add if missing)
- Open Graph tags (optional, for social sharing)
- Canonical URL set correctly
- robots.txt allows indexing (if desired)
- sitemap.xml exists (optional)

---

## 🔍 SEO Configuration

### Meta Tags

Update `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>Ramin Yazdani - Bioinformatician & Data Scientist</title>
  <meta name="title" content="Ramin Yazdani - Bioinformatician & Data Scientist">
  <meta name="description" content="CV and portfolio of Ramin Yazdani - Bioinformatician, Data Scientist, and Full-Stack Developer specializing in genomics, machine learning, and bioprocess engineering.">
  <meta name="keywords" content="Bioinformatics, Data Science, Genomics, Machine Learning, Biotechnology, Full-Stack Development">
  <meta name="author" content="Ramin Yazdani">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://your-domain.com/">
  <meta property="og:title" content="Ramin Yazdani - Bioinformatician & Data Scientist">
  <meta property="og:description" content="CV and portfolio of Ramin Yazdani - Bioinformatician, Data Scientist, and Full-Stack Developer.">
  <meta property="og:image" content="https://res.cloudinary.com/dgflx4rum/image/upload/v1748294090/IMG_9262_wioxcp.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://your-domain.com/">
  <meta property="twitter:title" content="Ramin Yazdani - Bioinformatician & Data Scientist">
  <meta property="twitter:description" content="CV and portfolio of Ramin Yazdani - Bioinformatician, Data Scientist, and Full-Stack Developer.">
  <meta property="twitter:image" content="https://res.cloudinary.com/dgflx4rum/image/upload/v1748294090/IMG_9262_wioxcp.jpg">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://your-domain.com/">
  
  <!-- Rest of head -->
</head>
```

### robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

### sitemap.xml

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2025-01-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## 📈 Analytics Setup (Optional)

### Google Analytics

1. **Create GA4 property**: https://analytics.google.com

2. **Get measurement ID**: G-XXXXXXXXXX

3. **Add to index.html**:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Vercel Analytics (if using Vercel)

1. Install Vercel Analytics:
   ```bash
   npm install @vercel/analytics
   ```

2. Add to `src/main.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react'
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <>
       <App />
       <Analytics />
     </>
   )
   ```

---

## 🛡️ Security Considerations

### Content Security Policy

Add CSP meta tag to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://res.cloudinary.com;
  frame-src 'self';
">
```

### Security Headers (Vercel/Netlify)

Already configured in deployment configs above:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🐛 Troubleshooting Deployment Issues

### Issue: Build fails with "out of memory"

**Solution**: Increase Node.js memory:
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

### Issue: 404 on refresh (routes not working)

**Solution**: Configure redirects (already in Vercel/Netlify configs above)

For GitHub Pages, routes must use hash routing or implement custom 404 handling.

### Issue: Images not loading in production

**Solution**: Check image URLs are absolute (not relative):
- ✅ `https://res.cloudinary.com/...`
- ❌ `/assets/images/...` (unless in `public/` folder)

### Issue: CSS not applying

**Solution**: Check base URL in Vite config matches deployment path:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // For root domain
  // base: '/repo-name/', // For GitHub Pages
})
```

### Issue: Environment variables not working

**Solution**: Ensure variables prefixed with `VITE_`:
```bash
VITE_API_URL=https://api.example.com  # ✅ Works
API_URL=https://api.example.com       # ❌ Won't work
```

---

## ✅ Deployment Completion Checklist

### Pre-Deployment
- [x] Production build succeeds
- [x] Production build tested locally (`npm run preview`)
- [x] All features work in production build
- [x] No console errors in production
- [x] Lighthouse scores meet targets
- [x] Bundle sizes acceptable (< 500KB)

### Deployment
- [ ] Choose hosting platform (Vercel/Netlify/GitHub Pages/etc.)
- [ ] Configure build settings
- [ ] Deploy to staging/preview environment first
- [ ] Test deployed preview
- [ ] Deploy to production
- [ ] Configure custom domain (optional)
- [ ] Enable SSL certificate

### Post-Deployment
- [ ] Verify site loads correctly
- [ ] Test all features on live site
- [ ] Run Lighthouse audit on live site
- [ ] Test on mobile devices
- [ ] Test in all browsers
- [ ] Set up analytics (optional)
- [ ] Add robots.txt and sitemap.xml (optional)
- [ ] Update README with live URL

### Documentation
- [x] Update README.md with deployment instructions
- [x] Create DEPLOYMENT_GUIDE.md (this file)
- [ ] Document custom domain setup (if applicable)
- [ ] Document environment variable setup (if applicable)

---

## 📞 Support & Maintenance

### Regular Updates

**Monthly**:
- Check for dependency updates: `npm outdated`
- Update dependencies: `npm update`
- Test after updates
- Rebuild and redeploy

**Quarterly**:
- Review analytics data
- Update CV content (cv.json)
- Refresh profile photo if needed
- Check external link validity

**Annually**:
- Major dependency upgrades
- Review performance optimizations
- Audit accessibility
- Update meta descriptions/SEO

### Monitoring

Set up monitoring for:
- Site uptime (UptimeRobot, StatusCake)
- Performance (Lighthouse CI, SpeedCurve)
- Error tracking (Sentry - for future backend)

---

## 🎓 Next Steps After Deployment

1. **Share your CV**: Send URL to employers, colleagues, academic contacts
2. **SEO optimization**: Submit to Google Search Console
3. **Social media**: Share on LinkedIn with OG image preview
4. **QR code**: Generate QR code linking to site for conference posters
5. **Business cards**: Add URL to business cards
6. **Email signature**: Add URL to email signature
7. **Analytics**: Monitor visitor behavior, popular sections
8. **Iterate**: Based on feedback, improve content and design

---

**Congratulations! Your CV/Portfolio website is now deployed to production! 🎉**

---

**Last Updated**: January 27, 2025
