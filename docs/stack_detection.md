# Stack Detection Report

**Generated**: 2025-12-27  
**Repository**: premium-cv-port-land  
**Detection Method**: Automated inspection of manifest files, configuration, and directory structure

---

## Executive Summary

This is a **frontend-only, single-page application (SPA)** with **NO backend**. The application generates a static build suitable for deployment on any static hosting platform with PR preview support.

**Deployment Recommendation**: Static hosting platforms (Vercel, Netlify, Cloudflare Pages, or GitHub Pages) with automatic PR preview functionality.

---

## Technology Stack

### Core Framework & Runtime

| Component | Technology | Version | Detection Source |
|-----------|-----------|---------|------------------|
| **Frontend Framework** | React | 19.0.0 | package.json dependencies |
| **Language** | TypeScript | 5.7.2 | package.json devDependencies |
| **Build Tool** | Vite | 7.2.6 | package.json devDependencies, vite.config.ts |
| **Runtime** | Node.js | 20.x | .github/workflows/ci.yml |
| **Package Manager** | npm | Latest | package-lock.json present |

### UI & Styling

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **CSS Framework** | Tailwind CSS | 4.1.11 | Utility-first styling |
| **UI Components** | Shadcn UI | v4 | Radix UI primitives |
| **Icons** | Phosphor Icons | 2.1.7 | Icon library |
| **Animations** | Framer Motion | 12.6.2 | Motion library |
| **Theming** | next-themes | 0.4.6 | Dark/light mode |

### Testing & Quality

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Test Framework** | Vitest | 4.0.16 | Unit testing |
| **Test Library** | Testing Library | 16.3.1 | Component testing |
| **E2E Testing** | Playwright | 1.57.0 | End-to-end testing |
| **Linter** | ESLint | 9.28.0 | Code quality |
| **Type Checking** | TypeScript | 5.7.2 | Static type checking |

### Build Configuration

**Entry Points**:
- HTML: `/index.html`
- JavaScript: `/src/main.tsx`
- Styles: `/src/main.css`

**Output Directory**: `dist/`

**Build Process**:
```bash
npm run build
# Executes: tsc -b --noCheck && vite build
```

**Output Artifacts**:
- `dist/index.html` - Entry HTML file
- `dist/assets/*.js` - JavaScript bundles (code-split)
- `dist/assets/*.css` - Stylesheet bundles
- Static assets (images, fonts, etc.)

---

## Architecture Analysis

### Application Type
- **Type**: Single-Page Application (SPA)
- **Routing**: Client-side (React-based, no framework router detected)
- **Rendering**: Client-Side Rendering (CSR)
- **State Management**: React Context API
- **Data Source**: Static JSON files (`src/data/cv.json`, `src/data/ramin_de.json`, `src/data/ramin_fa.json`)

### Directory Structure

```
/
├── src/                      # Source code
│   ├── components/          # React components
│   ├── context/            # React context providers
│   ├── data/               # Static CV data (JSON)
│   │   ├── cv.json         # English data (LOCKED)
│   │   ├── ramin_de.json   # German data (LOCKED)
│   │   └── ramin_fa.json   # Persian data (LOCKED)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── styles/             # Style files
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── main.tsx            # Application entry point
│   └── App.tsx             # Root component
├── public/                  # Static assets
├── tests/                   # Unit tests
├── e2e/                     # E2E tests
├── docs/                    # Documentation
├── .github/                 # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml          # CI workflow (lint, test, build)
│       └── copilot-setup-steps.yml
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vitest.config.ts        # Vitest test configuration
├── playwright.config.ts    # Playwright E2E configuration
└── package.json            # Project manifest
```

### Backend Analysis

**Finding**: **NO BACKEND DETECTED**

**Evidence**:
- No server directories found (`api/`, `backend/`, `server/`)
- No backend frameworks detected (Express, Fastify, NestJS, Django, Flask, etc.)
- No database connections or ORM configurations
- No API endpoint definitions
- All data sourced from static JSON files
- No server-side rendering (SSR) detected

**Implication**: This is a **pure frontend application** suitable for static hosting.

---

## Data Architecture

### Data Source
- **Type**: Static JSON files
- **Location**: `src/data/`
- **Languages Supported**: EN (English), DE (German), FA (Persian/Farsi)
- **Data Integrity**: Hash-based validation in CI/CD

### Locked Files
The following files are **READ-ONLY** and protected by CI integrity checks:

1. `src/data/cv.json` - English CV data
2. `src/data/ramin_de.json` - German CV data
3. `src/data/ramin_fa.json` - Persian CV data

**Protection Mechanism**:
- Hash verification in tests (`tests/locked-files-integrity.test.ts`)
- MD5 checksums displayed in CI workflow
- Tests fail if files are modified

### Data Loading Flow
```
Static JSON Files (language-specific)
    ↓
Data Normalizer (src/utils/dataNormalizer.ts)
    ↓
Data Validator (src/utils/dataValidator.ts)
    ↓
CVDataContext (React Context)
    ↓
Components
```

---

## Build & Development Scripts

### Available Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm install` | Install dependencies | First-time setup |
| `npm run dev` | Start dev server | Development (port 5173) |
| `npm run build` | Production build | Creates `dist/` folder |
| `npm run preview` | Preview build | Test production build locally (port 4173) |
| `npm run lint` | Run ESLint | Code quality check |
| `npm run test` | Run all tests | Unit tests |
| `npm run test:watch` | Test watch mode | Development testing |
| `npm run test:language` | Language tests | Verify EN/DE/FA data |
| `npm run verify-languages` | Quick smoke test | Validate language data |
| `npm run generate-hashes` | Generate file hashes | Update locked file hashes |

### Build Output

**Typical build output**:
```
dist/
├── index.html                              # Entry HTML (~1-5 KB)
├── assets/
│   ├── index-[hash].css                   # Main styles (~45 KB)
│   ├── index-[hash].js                    # Main app bundle (~656 KB uncompressed, ~183 KB gzip)
│   └── [various component chunks].js      # Code-split sections
```

**Build Characteristics**:
- Code splitting: Automatic for lazy-loaded React components
- Asset hashing: For cache busting
- Minification: JavaScript and CSS minified
- Tree shaking: Unused code eliminated
- Gzip-ready: Significant compression (30-40% of uncompressed size)

**Performance Notes**:
- Vite shows a warning about chunks > 500 KB (the main index bundle)
- Code splitting is already implemented for major sections
- Further optimization possible but not critical for deployment

---

## CI/CD Current State

### Existing Workflows

**1. `.github/workflows/ci.yml`** - Main CI Pipeline

**Triggers**:
- Push to `main`, `develop`, `copilot/**` branches
- Pull requests to `main`, `develop`
- Manual dispatch

**Jobs**:

1. **lint-and-test**
   - Checkout code
   - Setup Node.js 20
   - Install dependencies (`npm ci`)
   - Verify locked files integrity (MD5 checksums)
   - Run linter (non-blocking)
   - Run unit tests
   - Run language smoke validation
   - Build for production
   - Verify build artifacts (`dist/index.html`, `dist/assets/`)
   - Upload build artifacts (7-day retention)

2. **visual-proof**
   - Build application
   - Run Playwright screenshot tests
   - Upload screenshots and reports (7-day retention)

3. **smoke-validation**
   - Validate English (EN) data
   - Validate German (DE) data
   - Validate Persian (FA) data
   - Ensure no empty sections or undefined values

### CI Gaps (To Be Addressed)

- [ ] No deployment workflow for production
- [ ] No PR preview deployment workflow
- [ ] MD5 checksums should be upgraded to SHA256 for better security
- [ ] No deployment status checks
- [ ] No preview URL comments on PRs

---

## Deployment Requirements Analysis

### Static Hosting Requirements

**Minimum Requirements**:
- Static file hosting
- HTTPS support
- Custom domain support (optional)
- Build command: `npm run build`
- Output directory: `dist`
- Node.js 20 runtime (for build)

**Desired Features**:
- Automatic deployments on push to main
- PR preview deployments with unique URLs
- Build logs and error reporting
- Environment variable support (minimal needs)
- Fast global CDN
- Zero-config or minimal configuration

### Platform Suitability Analysis

| Platform | Suitability | Reasoning |
|----------|-------------|-----------|
| **Vercel** | ⭐⭐⭐⭐⭐ Excellent | Zero-config for Vite, automatic PR previews, fast CDN, generous free tier |
| **Netlify** | ⭐⭐⭐⭐⭐ Excellent | Zero-config for Vite, automatic PR previews, fast CDN, generous free tier |
| **Cloudflare Pages** | ⭐⭐⭐⭐⭐ Excellent | Zero-config for Vite, automatic PR previews, Cloudflare's global network |
| **GitHub Pages** | ⭐⭐⭐ Good | Free, GitHub-native, but limited PR preview support (requires custom setup) |
| **AWS Amplify** | ⭐⭐⭐ Good | Full-featured but more complex configuration |
| **Azure Static Web Apps** | ⭐⭐⭐ Good | Good integration with GitHub, but more complex than Vercel/Netlify |

**Recommendation**: **Vercel, Netlify, or Cloudflare Pages** (in that order) for easiest setup with best PR preview support.

---

## Environment Configuration

### Current State
- No environment variables detected in codebase
- No `.env` files present
- All configuration is build-time static
- External URLs hardcoded in JSON data and components

### Preview-Safe Configuration Analysis

**Checked for hardcoded values**:
- ✅ No hardcoded `localhost` URLs detected
- ✅ No backend API URLs (no backend exists)
- ✅ External resources use absolute URLs (Cloudinary CDN, Google Fonts)
- ✅ No CORS issues (static site, no API calls)

**Preview Safety**: Application is **preview-safe by design** (no dynamic configuration needed).

### Optional Environment Variables

While not strictly required, these could enhance the deployment:

```env
# Optional: Analytics
VITE_GA_ID=                    # Google Analytics tracking ID
VITE_PLAUSIBLE_DOMAIN=         # Plausible analytics domain

# Optional: Feature flags
VITE_ENABLE_CONTACT_FORM=false # Toggle contact form (placeholder)
VITE_ENABLE_BOOKING=false      # Toggle booking widget (placeholder)

# Optional: Build optimization
VITE_BUNDLE_ANALYZER=false     # Enable bundle analysis
```

**Note**: The `VITE_` prefix is required for environment variables to be exposed to the client-side code in Vite.

---

## Internationalization (i18n)

### Current Implementation
- **Languages Supported**: English (EN), German (DE), Persian (FA)
- **Implementation**: Separate JSON data files per language
- **UI Translations**: `src/lib/i18n.ts`
- **RTL Support**: Full RTL layout support for Persian
- **Language Detection**: URL parameter (`?lang=en|de|fa`), localStorage, browser language

### Language Files
- `src/data/cv.json` - English data (default)
- `src/data/ramin_de.json` - German data
- `src/data/ramin_fa.json` - Persian data

### Deployment Considerations
- All languages included in single build
- No server-side language detection needed
- Client-side language switching works in static hosting
- RTL CSS automatically applied for Persian

---

## Performance Characteristics

### Build Performance
- **Build Time**: ~10 seconds (typical)
- **Bundle Size**: ~656 KB main bundle uncompressed (~183 KB gzipped)
- **Code Splitting**: Automatic for lazy-loaded sections

### Runtime Performance (from README)
- **Lighthouse Score**: >90
- **Initial Load**: <500 KB target (achieved with gzip)
- **Code Splitting**: Sections lazy-loaded
- **Image Optimization**: Cloudinary CDN with lazy loading
- **Caching**: Asset hashing for cache busting

### Optimization Status
- ✅ Code splitting implemented
- ✅ Asset optimization configured
- ✅ Lazy loading for images
- ✅ Minification enabled
- ✅ Tree shaking enabled
- ⚠️ Main bundle size warning (not critical, can be improved)

---

## Security Considerations

### Current Security Posture
- ✅ No sensitive data in repository (all CV data is intentionally public)
- ✅ No API keys or secrets in code
- ✅ No backend to secure
- ✅ Hash-based integrity checks for critical data files
- ✅ Dependency security scanning (Dependabot enabled via `.github/dependabot.yml`)
- ✅ No user input processing (contact form is UI-only placeholder)

### Deployment Security Recommendations
- Enable HTTPS (automatic on modern platforms)
- Configure security headers (CSP, X-Frame-Options, etc.)
- Consider adding Subresource Integrity (SRI) for external scripts
- Monitor for dependency vulnerabilities (already enabled)

---

## Testing Infrastructure

### Test Types

| Type | Framework | Location | Purpose |
|------|-----------|----------|---------|
| **Unit Tests** | Vitest | `tests/*.test.ts(x)` | Component and utility testing |
| **E2E Tests** | Playwright | `e2e/*.spec.ts` | Full user flow testing |
| **Smoke Tests** | Node.js scripts | `scripts/verify-languages.js` | Quick validation |
| **Integrity Tests** | Vitest | `tests/locked-files-integrity.test.ts` | Data file protection |

### Test Coverage
- Data normalization and validation
- Language loading (EN/DE/FA)
- Component rendering
- Locked file integrity
- Visual regression (screenshots)

### CI Test Execution
- All tests run on every PR and push
- Playwright tests generate visual proof
- Locked file integrity checked via hash comparison

---

## Accessibility

### WCAG Compliance
- **Target**: WCAG AA
- **Status**: Compliant (per README)
- **Features**:
  - Keyboard navigation throughout
  - Screen reader compatible
  - Sufficient color contrast
  - Focus indicators
  - Semantic HTML
  - ARIA labels where needed
  - Respects `prefers-reduced-motion`

### Testing
- Manual testing checklist exists
- Accessibility tests in component tests
- Playwright can capture accessibility tree

---

## Monorepo Configuration

**Finding**: **NOT a monorepo** (despite `workspaces` in package.json)

**Evidence**:
- `package.json` declares `workspaces: { packages: ["packages/*"] }`
- No `packages/` directory exists in repository
- All code in single root-level structure

**Implication**: Workspace configuration is unused/remnant. Deployment should target root directory.

---

## Deployment Readiness Checklist

### Prerequisites for Deployment
- [x] Build succeeds without errors
- [x] Tests pass
- [x] No console errors in production build
- [x] Static build output (`dist/`) is valid
- [x] All external dependencies are CDN-hosted or bundled
- [x] No environment variables required for basic functionality
- [x] Application is preview-safe (no hardcoded URLs)

### Missing for Production Deployment
- [ ] Deployment platform configured
- [ ] Production URL configured
- [ ] Custom domain (optional)
- [ ] Analytics integration (optional)
- [ ] Error tracking (optional)

### Missing for PR Preview Deployment
- [ ] Platform with PR preview support configured
- [ ] Workflow to comment preview URLs on PRs
- [ ] Preview environment validation

---

## Recommended Deployment Architecture

### Mode 1: Hosted Platform (Recommended)

**Architecture**:
```
GitHub Repository
    ↓ (push to main)
Static Hosting Platform (Vercel/Netlify/Cloudflare)
    ↓ (build & deploy)
Production URL: https://yourname.vercel.app (or custom domain)

GitHub Repository
    ↓ (open PR)
Static Hosting Platform
    ↓ (build & deploy)
Preview URL: https://yourname-git-branch-username.vercel.app
```

**Benefits**:
- Zero or minimal configuration
- Automatic deployments
- Automatic PR previews with unique URLs
- Fast global CDN
- HTTPS by default
- Free for open source

### Mode 2: GitHub Pages (Fallback)

**Architecture**:
```
GitHub Repository
    ↓ (push to main)
GitHub Actions Workflow
    ↓ (build)
GitHub Pages
    ↓ (deploy)
Production URL: https://username.github.io/repo-name

For PR Previews:
    - Custom workflow to build and upload artifacts
    - Comment URLs on PRs (manual or via workflow)
    - Limited to artifact downloads or separate branches
```

**Limitations**:
- No automatic PR preview URLs (requires custom setup)
- Slower than dedicated CDN platforms
- More complex configuration

**Recommendation**: Use Mode 1 (Hosted Platform) for best experience.

---

## Next Steps

Based on this stack detection, the following implementation phases are recommended:

1. **Local Development Documentation** (Phase 1)
   - Document setup and run commands
   - Create troubleshooting guide

2. **Platform Configuration** (Phase 2)
   - Choose platform (Vercel recommended)
   - Add platform configuration file (if needed)
   - Configure build settings

3. **Deployment Documentation** (Phase 2)
   - Production deployment guide
   - PR preview deployment guide
   - Platform-specific setup instructions

4. **CI Enhancements** (Phase 3)
   - Upgrade locked-file validation to SHA256
   - Add deployment status checks
   - Improve error reporting

5. **Optional: GitHub Actions Auto-Deploy** (Phase 4)
   - GitHub Pages workflow (if desired)
   - PR preview workflow (if not using platform)

---

## Conclusion

**Summary**: This is a **frontend-only React SPA** built with Vite, producing static assets suitable for any modern static hosting platform. The application is **preview-safe by design** and requires **minimal configuration** for deployment.

**Recommended Deployment**: **Vercel, Netlify, or Cloudflare Pages** for easiest setup with automatic production and PR preview deployments.

**Time to Deploy**: ~10-15 minutes following platform-specific documentation.

**Confidence**: High - This is an ideal use case for static hosting with PR previews.

---

*End of Stack Detection Report*
