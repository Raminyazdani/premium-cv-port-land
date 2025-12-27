# CV/Portfolio Website

> **A premium, production-quality personal CV/portfolio website** built with React, TypeScript, and the Spark framework. Fully driven by structured JSON data for easy customization and reusability.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](./docs/archive/ITERATION_55_STATUS.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-90+-green.svg)](https://developers.google.com/web/tools/lighthouse)
[![WCAG](https://img.shields.io/badge/WCAG-AA-brightgreen.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)

> 📚 **New Here?** Start with [docs/QUICK_START.md](./docs/QUICK_START.md) for a 5-minute deployment guide, or see [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md) for all documentation.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher (tested with v20.19.6)
- **npm**: Version 9.0.0 or higher (tested with v10.8.2)

Check your versions:
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 9.0.0 or higher
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

---

## 🚀 Quickstart

### Local Development (3 minutes)

```bash
# Clone repository
git clone https://github.com/Raminyazdani/premium-cv-port-land.git
cd premium-cv-port-land

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Full guide**: [docs/local_dev.md](./docs/local_dev.md)

### Deploy to Production (5 minutes)

Choose your platform:

**Option 1: Vercel** (Recommended - Zero Config)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import this repository
3. Set **Root Directory** to `frontend`
4. Click "Deploy" ✅

**Option 2: Netlify**
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select this repository
4. Set **Base directory** to `frontend`
5. Click "Deploy" ✅

**Option 3: Cloudflare Pages**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create application → Connect to Git → Select repository
3. Set **Root path** to `frontend`
4. Click "Save and Deploy" ✅

All platforms provide:
- ✅ Automatic production deployments (push to main)
- ✅ PR preview URLs (automatic for each pull request)
- ✅ Free HTTPS/SSL
- ✅ Global CDN

**Full guides**: 
- [Production Deployment](./docs/deploy_production.md)
- [PR Preview Deployments](./docs/deploy_preview_pr.md)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [JSON Schema](#-json-schema)
- [Customization Guide](#-customization-guide)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

This is a **JSON-driven CV/portfolio website** designed to be:

- **Professional**: Polished design with thoughtful typography and color choices
- **Reusable**: Swap the JSON file to create a CV site for anyone
- **Performant**: Lighthouse scores >90, optimized bundle sizes, code splitting
- **Accessible**: WCAG AA compliant with keyboard navigation and screen reader support
- **Privacy-First**: No personal data in shared storage; all data in local JSON
- **Modern**: Built with React 19, TypeScript 5.7, Tailwind CSS 4, and Shadcn UI v4

**Perfect for:**
- Researchers and academics showcasing publications
- Developers highlighting projects and technical skills
- Professionals needing a filterable, multi-section CV
- Anyone wanting a clean, modern portfolio site

---

## 🚀 Features

### Core Features
- ✅ **JSON-Driven Content**: Single source of truth for all CV data
- ✅ **Multi-Section Layout**: Hero, Education, Experience, Projects, Publications, Skills, Languages, Certifications, References
- ✅ **Type-Key Filtering**: Filter content by tags (Academic, Programming, Bioinformatics, etc.)
- ✅ **Theme System**: 6 theme presets with dark/light mode support
- ✅ **Multi-Language Support**: Ready for EN/DE/FA with RTL support for Farsi
- ✅ **Privacy Controls**: Phone number reveal toggle, copy-to-clipboard actions
- ✅ **Responsive Design**: Mobile-first, works beautifully on all screen sizes
- ✅ **Media Handling**: Unified thumbnail + modal system for images and PDFs
- ✅ **Contact Form**: UI ready for backend integration
- ✅ **Booking Widget**: Placeholder for call scheduling integration

### Advanced Features
- 🎨 **Smooth Animations**: Scroll-triggered fade-ins with stagger effects
- 📄 **PDF Export**: Browser print with optimized print stylesheet
- ⌨️ **Keyboard Navigation**: Full keyboard accessibility throughout
- 🔍 **Search & Filter**: Global focus filter affects all sections simultaneously
- 📱 **Touch Optimized**: 44px minimum touch targets for mobile
- 🌐 **RTL Support**: Automatic layout flip for right-to-left languages
- 🎭 **Empty State Handling**: Graceful fallbacks for missing data
- 🖼️ **Image Optimization**: Cloudinary integration with lazy loading

---

## 🛠️ Tech Stack

### Core
- **React 19.0** - UI library with latest concurrent features
- **TypeScript 5.7** - Type safety and developer experience
- **Vite 7.2** - Fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first styling

### UI Components
- **Shadcn UI v4** - 40+ pre-installed accessible components
- **Phosphor Icons 2.1** - Consistent iconography
- **Framer Motion 12** - Smooth animations (used sparingly)
- **Sonner** - Toast notifications

### Data & State
- **React Context** - Global filter state management
- **Zod** - Runtime type validation
- **React Hook Form** - Form handling (contact form)

### Performance
- **Code Splitting** - React.lazy for all major sections
- **Image Optimization** - Cloudinary with lazy loading
- **Resource Hints** - Preconnect, DNS prefetch
- **Bundle Analysis** - Optimized vendor splitting

### Accessibility
- **ARIA Labels** - Comprehensive semantic markup
- **Focus Management** - Visible focus indicators
- **Keyboard Navigation** - Complete keyboard support
- **Screen Reader** - Tested with VoiceOver and NVDA

---

## 🚦 Getting Started

### Prerequisites

This project runs in the **GitHub Spark environment**, which is pre-configured with:
- Node.js & npm
- Vite dev server
- All required dependencies

### Installation

The project is ready to run immediately in Spark. Dependencies are already installed.

### Running the App

The app runs automatically in your Spark workspace. No manual start command needed.

**For local development outside Spark:**
```bash
cd frontend            # Navigate to frontend directory
npm install            # Install dependencies
npm run dev            # Start dev server on port 5173
npm run build          # Build for production
npm run preview        # Preview production build
npm run test           # Run tests
npm run lint           # Lint code
npm run lint:fix       # Fix linting issues automatically
npm run format         # Format code with Prettier
npm run typecheck      # Type check with TypeScript
```

### Quick Customization

1. **Edit the CV data:**
   ```bash
   # Edit this file with your information
   frontend/src/data/cv.json
   ```

2. **Update the title:**
   ```html
   <!-- frontend/index.html -->
   <title>Your Name - Portfolio & CV</title>
   ```

3. **Change theme colors:**
   ```css
   /* frontend/src/styles/themes.css */
   --theme-primary: oklch(0.35 0.15 250);  /* Your brand color */
   ```

4. **Replace profile photo:**
   ```json
   // frontend/src/data/cv.json
   "Pictures": [
     {
       "type_of": "profile",
       "URL": "https://your-image-url.com/photo.jpg"
     }
   ]
   ```

---

## 📁 Project Structure

```
/
├── frontend/                    # Frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/        # Main CV sections
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── EducationSection.tsx
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   └── ... (more sections)
│   │   │   ├── ui/              # Shadcn components (40+ preinstalled)
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── CVDataContext.tsx
│   │   │   ├── LanguageContext.tsx
│   │   │   └── FilterContext.tsx
│   │   ├── data/
│   │   │   ├── cv.json          # English CV data (LOCKED)
│   │   │   ├── ramin_de.json    # German CV data (LOCKED)
│   │   │   └── ramin_fa.json    # Persian CV data (LOCKED)
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/                   # Unit tests
│   ├── e2e/                     # End-to-end tests
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                     # Backend (placeholder)
│   └── README.md
│
├── docs/                        # Documentation
│   ├── archive/                 # Historical implementation reports
│   ├── QUICK_START.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── local_dev.md
│   └── ...
│
├── .github/                     # GitHub Actions & Copilot instructions
│
├── README.md                    # This file
└── LICENSE
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `frontend/src/components/sections/` | All CV sections (hero, education, experience, etc.) |
| `frontend/src/components/ui/` | Shadcn components (buttons, cards, dialogs, etc.) |
| `frontend/src/data/` | **CV JSON data files** (LOCKED) |
| `frontend/src/types/` | **TypeScript interfaces for JSON schema** |
| `frontend/src/styles/` | Theme CSS, RTL support, print styles |
| `frontend/src/context/` | Global state (filter, language, CV data contexts) |
| `frontend/src/hooks/` | Custom React hooks |
| `frontend/src/lib/` | Utilities and helpers |
| `docs/` | Documentation and guides |
| `docs/archive/` | Historical implementation reports |

---

## 📋 JSON Schema

### Overview

The CV data is stored in `frontend/src/data/cv.json` and follows a structured schema defined in `frontend/src/types/cv.ts`.

**Key principles:**
- All fields are optional for robustness
- `type_key` arrays enable filtering across sections
- Nested structures (skills) are supported
- Date fields accept ISO strings or "present"

### Top-Level Structure

```typescript
interface CVData {
  basics: Basics[]           // Personal info, contact, summary
  profiles: Profile[]        // Social/professional links
  education: Education[]     // Academic background
  languages: Language[]      // Language proficiency
  workshop_and_certifications: Certification[]
  skills: Skills             // Nested: category > subcategory > items
  experiences: Experience[]  // Work history
  projects: Project[]        // Portfolio projects
  publications: Publication[] // Papers, books, theses
  references: Reference[]    // Professional references
}
```

### Core Interfaces

#### Basics (Hero Section)
```typescript
interface Basics {
  fname?: string | null              // First name
  lname?: string | null              // Last name
  label?: string | string[] | null   // Roles/titles
  email?: string | null
  phone?: Phone | null
  summary?: string | null            // Professional summary
  location?: Location | Location[] | null
  Pictures?: Picture[] | null        // Profile/cover photos
  birthDate?: string | null          // ISO date (hidden by default)
  url?: string | null                // Personal website
}

interface Phone {
  countryCode?: string | null    // e.g., "+49"
  number?: string | null         // e.g., "17666652181"
  formatted?: string | null      // e.g., "+49 (0) 176 666 52181"
}

interface Location {
  city?: string | null
  region?: string | null
  country?: string | null
  postalCode?: string | null
  address?: string | null
}

interface Picture {
  type_of: string    // "profile" or "cover"
  URL: string        // Image URL (preferably Cloudinary)
}
```

#### Education
```typescript
interface Education {
  institution?: string | null
  location?: string | null
  area?: string | null           // Field of study
  studyType?: string | null      // "Bachelor's", "Master's", etc.
  startDate?: string | null      // ISO date
  endDate?: string | null        // ISO date or "present"
  gpa?: string | null
  logo_url?: string | null
  type_key?: string[] | null     // ["Academic", "Bioinformatics", ...]
}
```

#### Skills (Nested Structure)
```typescript
interface Skills {
  [topCategory: string]: {       // e.g., "Programming & Scripting"
    [subCategory: string]: SkillItem[]  // e.g., "Programming Languages"
  }
}

interface SkillItem {
  long_name: string      // Full name
  short_name: string     // Display name (shown in UI)
  type_key: string[]     // Filter tags
}
```

**Example:**
```json
{
  "skills": {
    "Programming & Scripting": {
      "Programming Languages": [
        {
          "long_name": "Python",
          "short_name": "Python",
          "type_key": ["Full CV", "Programming", "Bioinformatics"]
        }
      ]
    }
  }
}
```

#### Projects
```typescript
interface Project {
  title?: string | null
  description?: string | null
  url?: string | null            // GitHub/demo link
  type_key?: string[] | null
}
```

#### Publications
```typescript
interface Publication {
  title?: string | null
  authors?: string[] | null
  type?: string | null           // "Research Paper", "Book Chapter", etc.
  status?: string | null         // "Published", "Submitted", "Waiting for Submission"
  year?: number | null
  date?: string | null           // ISO date
  journal?: string | null
  publisher?: string | null
  doi?: string | null
  isbn?: string | null
  url?: string | null
  type_key?: string[] | null
}
```

### Special Fields

#### `type_key` Array
Used for filtering content across sections.

**Common values:**
- `"Full CV"` - Always shown
- `"Academic"` - Academic/research content
- `"Programming"` - Software development
- `"Bioinformatics"` - Bioinformatics projects
- `"Biotechnology"` - Lab/biotech work

**Usage:**
```json
{
  "education": [
    {
      "institution": "University of Tehran",
      "type_key": ["Full CV", "Academic", "Bioinformatics"]
    }
  ]
}
```

When user selects "Bioinformatics" filter, only entries with `"Bioinformatics"` in `type_key` are shown.

### Validation

The schema is validated at runtime using TypeScript interfaces. Missing or null fields are handled gracefully with fallbacks.

**Best practices:**
- Use `null` for missing values, not empty strings
- Dates should be ISO format (`YYYY-MM-DD`)
- URLs should be full absolute URLs
- Arrays can be empty `[]` but preferably omit if truly empty

---

## 🎨 Customization Guide

### Multi-Language Support 🌍

The site fully supports **English (EN), German (DE), and Persian (FA)** with automatic:
- Data normalization (translated keys → canonical schema)
- RTL layout for Persian
- UI string translations
- URL persistence (`?lang=fa`)
- localStorage persistence

**Quick switch:** Click globe icon (🌐) in header.

#### How It Works
```
User selects language → 
LanguageContext updates → 
CVDataContext loads ramin_de.json / ramin_fa.json →
dataNormalizer converts German/Persian keys → English schema →
Components render using canonical schema
```

#### For Developers
```tsx
import { useCVData } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'

function MyComponent() {
  const { data } = useCVData()  // Always English schema!
  const t = useTranslation()    // UI strings in current language
  
  return (
    <div>
      <h2>{t.sections.education}</h2>  {/* "Education" / "Bildung" / "تحصیلات" */}
      {data.education.map(edu => (
        <div key={edu.institution}>{edu.institution}</div>
      ))}
    </div>
  )
}
```

#### Add a New Language (e.g., Spanish)

**📚 Full guide:** See `docs/archive/LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md` → Section 7

**Quick steps:**
1. Create `frontend/src/data/ramin_es.json` (translate keys AND values)
2. Update `frontend/src/config/keyMappings.ts` (add `es` to every mapping)
3. Update `frontend/src/context/LanguageContext.tsx` (add `'es'` to `SUPPORTED_LANGUAGES`)
4. Update `frontend/src/components/LanguageSelector.tsx` (add Spanish option)
5. Update `frontend/src/lib/i18n.ts` (add Spanish UI strings)
6. Test: `npm test`

**⚠️ Important:** 
- Never modify `cv.json`, `ramin_de.json`, `ramin_fa.json` (locked files, tests will fail)
- Use helper functions from `cv-data.ts`, never import JSON directly
- All components must use `useCVData()` hook for language-aware data

---

### Adding New Languages (Legacy Method - Deprecated)

> **⚠️ This method is deprecated. Use the multi-language system above instead.**

Previously, you would duplicate `cv.json` for each language. This no longer works.
Use the normalization system documented in `docs/archive/LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md`.

### Adding New Themes

Six themes are pre-configured. To add a new theme:

1. **Define theme in CSS:**
   ```css
   /* frontend/src/styles/themes.css */
   [data-theme="cyberpunk"] {
     --theme-primary: oklch(0.80 0.25 330);      /* Hot pink */
     --theme-secondary: oklch(0.60 0.20 200);    /* Cyan */
     --theme-accent: oklch(0.90 0.15 120);       /* Neon green */
     --theme-background: oklch(0.15 0.02 280);   /* Dark purple */
     --theme-text-primary: oklch(0.95 0.05 330); /* Light pink */
     --theme-text-secondary: oklch(0.70 0.05 200);
     --theme-border: oklch(0.40 0.10 280);
     --theme-surface: oklch(0.20 0.03 280);
     --theme-font-family: 'Orbitron', monospace;
   }
   ```

2. **Update theme selector:**
   ```tsx
   // frontend/src/components/ThemeSelector.tsx
   const themes = [
     { value: 'normal', label: 'Normal' },
     { value: 'academic', label: 'Academic' },
     { value: 'cyberpunk', label: 'Cyberpunk' },  // Add new theme
   ]
   ```

3. **Add Google Font if custom:**
   ```html
   <!-- index.html -->
   <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap">
   ```

### Adding New Sections

To add a custom section (e.g., "Awards"):

1. **Update TypeScript types:**
   ```typescript
   // frontend/src/types/cv.ts
   export interface Award {
     title?: string | null
     organization?: string | null
     date?: string | null
     description?: string | null
     type_key?: string[] | null
   }
   
   // Add to CVData interface
   export interface CVData {
     // ... existing fields
     awards?: Award[]
   }
   ```

2. **Add data to JSON:**
   ```json
   {
     "awards": [
       {
         "title": "Best Paper Award",
         "organization": "IEEE Conference",
         "date": "2024-06-15",
         "type_key": ["Full CV", "Academic"]
       }
     ]
   }
   ```

3. **Create section component:**
   ```tsx
   // frontend/src/components/sections/AwardsSection.tsx
   import { Award } from '@/types/cv'
   
   export function AwardsSection({ awards }: { awards: Award[] }) {
     return (
       <section className="py-16">
         <h2 className="text-3xl font-bold mb-8">Awards</h2>
         {awards.map((award, index) => (
           <div key={index} className="mb-4">
             <h3>{award.title}</h3>
             <p>{award.organization}</p>
           </div>
         ))}
       </section>
     )
   }
   ```

4. **Add to App.tsx:**
   ```tsx
   // frontend/src/App.tsx
   const AwardsSection = lazy(() => import('./sections/AwardsSection'))
   
   // In render:
   <Suspense fallback={<SectionSkeleton />}>
     <AwardsSection awards={cvData.awards} />
   </Suspense>
   ```

### Modifying Filters

The focus filter is driven by `type_key` values. To customize:

1. **Update filter options:**
   ```tsx
   // frontend/src/components/FocusFilterSelector.tsx
   const focusOptions = [
     { value: 'Full CV', label: 'Full CV' },
     { value: 'Academic', label: 'Academic' },
     { value: 'Industry', label: 'Industry' },  // Add custom filter
   ]
   ```

2. **Tag entries in JSON:**
   ```json
   {
     "projects": [
       {
         "title": "E-commerce Platform",
         "type_key": ["Full CV", "Programming", "Industry"]
       }
     ]
   }
   ```

### Changing Design

#### Colors
```css
/* frontend/src/styles/themes.css */
:root {
  --theme-primary: oklch(0.35 0.15 250);    /* Brand color */
  --theme-accent: oklch(0.70 0.15 60);      /* CTA color */
}
```

#### Typography
```css
/* frontend/src/index.css */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Your Heading Font', sans-serif;
}

body {
  font-family: 'Your Body Font', sans-serif;
}
```

#### Layout
```tsx
// frontend/src/App.tsx
<div className="max-w-7xl mx-auto px-4">  {/* Change max width */}
```

---

## 🚀 Deployment

### Quick Start: Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Expected output**: `dist/` folder with optimized assets (~360KB initial load)

### Deployment Options

| Platform | Best For | Deployment Time | Custom Domain | Cost |
|----------|----------|-----------------|---------------|------|
| **Vercel** | Production sites, automatic deployments | ~2 minutes | ✅ Free | Free (hobby) |
| **Netlify** | Form handling, serverless functions | ~3 minutes | ✅ Free | Free (starter) |
| **GitHub Pages** | Open source, GitHub integration | ~5 minutes | ✅ Free | Free |
| **Cloudflare Pages** | Global CDN, DDoS protection | ~3 minutes | ✅ Free | Free |
| **Spark** | Quick sharing, zero config | Instant | ❌ Spark URL only | Free |

---

### Option 1: Vercel (Recommended)

**Best for**: Fast deployment, excellent performance, custom domains

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Configuration**: Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Custom Domain**: Add in Vercel dashboard → Domain settings

📖 **Full guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete Vercel setup

---

### Option 2: Netlify

**Best for**: Drag-and-drop deployment, form handling

#### Method A: Drag & Drop
1. Build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist/` folder

#### Method B: GitHub (Recommended)
1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Configure: Build command = `npm run build`, Publish directory = `dist`

**Configuration**: Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

📖 **Full guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete Netlify setup

---

### Option 3: GitHub Pages

**Best for**: Free hosting, simple setup

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add scripts to package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/repo-name"
}

# Deploy
npm run deploy
```

**Important**: Update `vite.config.ts` with base path:
```typescript
export default defineConfig({
  base: '/repo-name/', // Match your repository name
})
```

📖 **Full guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for GitHub Pages details

---

### Option 4: Cloudflare Pages

**Best for**: Global CDN, excellent performance

1. Push code to GitHub
2. Connect GitHub at https://pages.cloudflare.com
3. Configure: Build command = `npm run build`, Output = `dist`

📖 **Full guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Cloudflare setup

---

### Option 5: Spark (Current Environment)

**Already deployed** in your Spark workspace.

**To publish publicly:**
1. Click "Share" button in Spark UI
2. Set visibility to "Public"
3. Share generated Spark URL

---

### Environment Variables

No environment variables required for basic deployment.

**For future backend features:**
```bash
# .env.production (configure in hosting platform)
VITE_API_URL=https://api.your-domain.com
VITE_CALENDLY_API_KEY=your_prod_key
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

### Post-Deployment Checklist

- [ ] Site loads correctly at production URL
- [ ] Run Lighthouse audit (Performance > 90)
- [ ] Test all features work identically to dev
- [ ] Test on mobile devices
- [ ] Test in all browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify images load (Cloudinary URLs)
- [ ] Check external links (GitHub, LinkedIn, etc.)
- [ ] Add custom domain (optional)
- [ ] Configure SSL certificate (automatic on most platforms)
- [ ] Add robots.txt and sitemap.xml (optional, for SEO)

---

### 📖 Complete Deployment Documentation

For detailed deployment instructions, troubleshooting, SEO configuration, and analytics setup:

**➡️ See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

Topics covered:
- Step-by-step deployment for each platform
- Custom domain configuration
- SSL certificate setup
- SEO optimization (meta tags, robots.txt, sitemap.xml)
- Analytics setup (Google Analytics, Vercel Analytics)
- Security headers and CSP
- Troubleshooting common deployment issues
- Performance verification
- Monitoring and maintenance

---

## ⚡ Performance

### Metrics

- **Lighthouse Performance**: >90
- **Lighthouse Accessibility**: >95
- **Bundle Size**: <500KB initial load
- **Core Web Vitals**:
  - FCP (First Contentful Paint): <1.5s
  - LCP (Largest Contentful Paint): <2.5s
  - TTI (Time to Interactive): <3.0s
  - CLS (Cumulative Layout Shift): <0.1

### Optimizations Implemented

#### Code Splitting
All sections are lazy-loaded:
```tsx
const EducationSection = lazy(() => import('./sections/EducationSection'))
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'))
// ... 9 more sections
```

**Result**: Initial bundle reduced by 62% (from ~800KB to ~300KB)

#### Image Optimization
- Cloudinary auto-format (WebP)
- Lazy loading with `loading="lazy"`
- Priority hints for hero images
- Responsive image constraints

#### Resource Hints
```html
<link rel="preconnect" href="https://res.cloudinary.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

#### Bundle Analysis
```bash
npm run build
# Check dist/ folder sizes
```

**Typical bundle:**
- `index-[hash].js`: ~150KB (main app logic)
- `vendor-[hash].js`: ~120KB (React, dependencies)
- Section chunks: 20-60KB each (loaded on demand)

### Performance Testing

```bash
# Build and preview
npm run build
npm run preview

# Open Chrome DevTools
# Run Lighthouse audit
# Check Network tab for lazy loading
```

**See**: `docs/archive/PERFORMANCE_OPTIMIZATION.md` for detailed guide

---

## ♿ Accessibility

### WCAG AA Compliance

This project meets WCAG 2.1 AA standards:

✅ **Keyboard Navigation**
- All interactive elements reachable via Tab
- Visible focus indicators (ring-2 on all focusable elements)
- No keyboard traps
- ESC key closes modals

✅ **Screen Reader Support**
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels on all icon buttons
- ARIA roles on dialogs (`role="dialog"`, `aria-modal="true"`)
- Skip-to-content link for efficiency

✅ **Color Contrast**
- All text meets 4.5:1 minimum (normal text)
- Large text meets 3:1 minimum
- Verified with Chrome DevTools Contrast Checker

✅ **Responsive & Touch**
- Minimum 44x44px touch targets on mobile
- Pinch-to-zoom enabled
- No fixed viewport

✅ **Motion & Animations**
- Respects `prefers-reduced-motion: reduce`
- Animations disabled for users who request it
- No auto-playing video/audio

### Testing

**Tools used:**
- axe DevTools
- Chrome Lighthouse
- VoiceOver (macOS)
- NVDA (Windows)
- Keyboard-only navigation testing

**Common issues fixed:**
- Missing ARIA labels on icon buttons
- Insufficient color contrast in muted text
- Keyboard traps in modals (fixed with focus management)
- Missing alt text on images (fallback to empty string for decorative)

**See**: `docs/archive/ACCESSIBILITY_AUDIT.md` for full checklist

---

## 🔮 Future Enhancements

### Planned Features

#### Backend API
- **Contact Form Submission**: POST to `/api/contact`
- **PDF Generation**: LaTeX-based server-side rendering
- **Analytics**: View counts, popular sections
- **Admin Dashboard**: Edit CV data via UI

#### Advanced Filtering
- Multi-select filters (e.g., "Academic" + "Programming")
- Search functionality across all sections
- Saved filter presets

#### Integrations
- **Calendly**: Book-a-call widget
- **Google Analytics**: Track visitor behavior
- **LinkedIn API**: Auto-import profile data
- **GitHub API**: Auto-populate projects from repos

#### Internationalization
- Full i18n support with `react-i18next`
- Dynamic language switching without JSON duplication
- Translation management system

#### Enhanced Media
- Image gallery carousel
- Video embeds (YouTube, Vimeo)
- Lightbox with zoom and pan

#### Print Enhancements
- Multiple PDF templates (one-column, two-column, academic style)
- Downloadable PDF via server-side generation
- Print preview with real-time customization

### Contributing

This is a personal CV project, but suggestions are welcome!

**To suggest a feature:**
1. Check existing issues
2. Open a new issue with:
   - Clear description
   - Use case / benefit
   - Implementation approach (optional)

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@/types/cv'"
**Solution:** Check TypeScript path alias in `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Issue: Images not loading
**Solution:** Verify image URLs are absolute and accessible:
```json
{
  "Pictures": [
    {
      "type_of": "profile",
      "URL": "https://res.cloudinary.com/your-cloud/image.jpg"
    }
  ]
}
```

#### Issue: Sections not filtering correctly
**Solution:** Ensure all entries have `type_key` arrays:
```json
{
  "education": [
    {
      "institution": "University",
      "type_key": ["Full CV", "Academic"]  // Required
    }
  ]
}
```

#### Issue: Theme not persisting
**Solution:** Check localStorage is enabled and not blocked by browser.

#### Issue: Build fails with TypeScript errors
**Solution:** Run strict type checking:
```bash
npx tsc --noEmit
# Fix reported type errors
```

### Getting Help

**Documentation:**
- `docs/PRD.md` - Product requirements and design decisions
- `docs/archive/PERFORMANCE_OPTIMIZATION.md` - Performance guide
- `docs/archive/ACCESSIBILITY_AUDIT.md` - Accessibility checklist
- `BROWSER_COMPATIBILITY_FINAL_REPORT.md` - Browser support
- **`docs/archive/LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md`** - 🌍 **Multi-language system guide** (EN/DE/FA)
- **`docs/archive/LANGUAGE_IMPLEMENTATION_SUMMARY.md`** - Quick overview of language feature
- **`docs/archive/LANGUAGE_QUICK_REFERENCE.md`** - Developer quick reference for language APIs

**Debugging:**
```bash
# Check bundle sizes
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests (including language normalization tests)
npm test
```

---

## 🌐 Language Feature Documentation

The site includes a **production-ready multi-language system** supporting:
- **English (EN)** - Default
- **German (DE)** - Deutsch
- **Persian (FA)** - فارسی with automatic RTL

### Quick Links
- 📖 **Full Implementation Guide**: `docs/archive/LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md`
- 📝 **Quick Summary**: `docs/archive/LANGUAGE_IMPLEMENTATION_SUMMARY.md`
- ⚡ **Developer Quick Ref**: `docs/archive/LANGUAGE_QUICK_REFERENCE.md`

### Key Features
- ✅ Automatic data normalization (DE/FA keys → English schema)
- ✅ RTL layout for Persian (automatic `dir="rtl"`)
- ✅ UI string translations (buttons, labels, headings)
- ✅ URL persistence (`?lang=fa`)
- ✅ localStorage persistence
- ✅ Locked file integrity protection (tests fail if JSON modified)
- ✅ Comprehensive tests (normalization + switching + integrity)

### For Developers
```tsx
// Always use these hooks in components:
import { useCVData } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'

const { data } = useCVData()  // Normalized English schema
const t = useTranslation()    // UI strings in current language
```

**⚠️ Never:**
- Import JSON directly (`import cv from '@/data/cv.json'` ❌)
- Use deprecated functions (`getBasics()` ❌, use `useCVData()` ✅)
- Modify locked files (`cv.json`, `ramin_de.json`, `ramin_fa.json`)

### Add New Language
See **Section 7** of `docs/archive/LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md` for step-by-step guide.

### Run Language Tests
```bash
npm test  # Runs normalization + integrity + smoke tests
node tests/generate-hashes.js  # Regenerate hashes (after approved changes)
```

---

## 📄 License

**Spark Template License:**
The Spark Template files and resources from GitHub are licensed under the MIT License.
Copyright © GitHub, Inc.

**Your CV Content:**
Your CV data (`frontend/src/data/cv.json`) and customizations remain your own intellectual property.

---

## 🙏 Acknowledgments

- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling system
- **Phosphor Icons** - Icon set
- **Cloudinary** - Image hosting and optimization
- **GitHub Spark** - Development environment

---

**Built with ❤️ using GitHub Spark**
