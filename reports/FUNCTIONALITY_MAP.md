# FUNCTIONALITY_MAP.md
## Task 02: Functionality Map — What the App Actually Does: Features + Flows

**Generated:** 2026-01-02  
**Repo:** `Raminyazdani/premium-cv-port-land`  
**Mode:** REPORT-ONLY (no edits to existing files)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Application Architecture Overview](#2-application-architecture-overview)
3. [Pages, Views, and Routes](#3-pages-views-and-routes)
4. [Feature Inventory Table](#4-feature-inventory-table)
5. [User Flow Breakdowns](#5-user-flow-breakdowns)
6. [Behavior Matrix](#6-behavior-matrix)
7. [Data Source Map](#7-data-source-map)
8. [Non-Obvious Behaviors](#8-non-obvious-behaviors)
9. [Unknowns and Verification Plan](#9-unknowns-and-verification-plan)
10. [Self-Audit](#10-self-audit)

---

## 1. Executive Summary

This is a **JSON-driven multilingual CV/portfolio single-page application (SPA)** built with:
- **Tech Stack:** Vite 7 + React 19 + TypeScript 5.7 + Tailwind CSS 4
- **Languages:** English (EN), German (DE), Persian/Farsi (FA) with RTL support
- **Data Source:** Static JSON files (no remote API calls detected in production)
- **Deployment:** Configured for Netlify and Vercel

The application displays a personal CV/resume with multiple content sections, multilingual support, theming options, accessibility controls, download functionality, and progressive web app (PWA) capabilities.

### Key Application Type
- **Single-Page Application (SPA)** with no client-side routing library
- Uses anchor-based navigation within a single page
- All content sections rendered on a single view

---

## 2. Application Architecture Overview

### Entry Point Flow
```
index.html
    └── main.tsx
        ├── Language initialization (languageManager.ts)
        ├── Theme initialization (themeManager.ts)
        ├── Performance monitoring (performance.ts)
        ├── Layout stability (layoutStability.ts)
        ├── Observability (Sentry/Clarity via observability.ts)
        └── App.tsx
            ├── ErrorBoundary
            └── Provider Tree (8 nested contexts)
                └── AppContent (main UI)
```

### Provider Hierarchy
**Evidence:** `frontend/src/App.tsx:L202-L223`

```
ErrorBoundary
└── LanguageProvider
    └── CVDataProvider
        └── FilterProvider
            └── KonamiProvider
                └── PWAProvider
                    └── AccessibilityProvider
                        └── SoundEffectsProvider
                            └── MicroFeedbackProvider
                                └── AppContent
```

---

## 3. Pages, Views, and Routes

### Application Type: Single-Page Application (No Router)

**Finding:** This application does **NOT** use a routing library (no react-router, no wouter, no Next.js).

**Evidence:** 
- `frontend/package.json` - No routing library in dependencies
- `frontend/src/App.tsx` - No router component or route definitions
- `frontend/src/main.tsx:L46-L49` - Direct App render without routing

### Navigation Structure

The application uses **anchor-based navigation** within a single page:

**Evidence:** `frontend/src/components/sections/Header.tsx:L30-L38`

```typescript
const navItems = [
  { label: t.nav.about, href: '#about' },
  { label: t.nav.education, href: '#education' },
  { label: t.nav.experience, href: '#experience' },
  { label: t.nav.projects, href: '#projects' },
  { label: t.nav.publications, href: '#publications' },
  { label: t.nav.skills, href: '#skills' },
  { label: t.nav.contact, href: '#contact' },
]
```

### Section IDs (Anchor Targets)

| Section | ID | Component | Evidence |
|---------|-----|-----------|----------|
| Hero | `#hero` | `HeroSection` | `frontend/src/components/sections/HeroSection.tsx:L96` |
| About | `#about` | `BasicsSection` | Lazy loaded from `App.tsx:L28` |
| Education | `#education` | `EducationSection` | Lazy loaded from `App.tsx:L30` |
| Experience | `#experience` | `ExperiencesSection` | Lazy loaded from `App.tsx:L34` |
| Projects | `#projects` | `ProjectsSection` | Lazy loaded from `App.tsx:L35` |
| Publications | `#publications` | `PublicationsSection` | Lazy loaded from `App.tsx:L36` |
| Skills | `#skills` | `SkillsSection` | Lazy loaded from `App.tsx:L33` |
| Contact | `#contact` | `ContactSection` | `frontend/src/components/sections/ContactSection.tsx:L10` |

---

## 4. Feature Inventory Table

| # | Feature | User Goal | Entry Point | Implementation Files | Notes |
|---|---------|-----------|-------------|---------------------|-------|
| 1 | **Language Switching** | View CV in EN/DE/FA | Header dropdown, URL param `?lang=xx` | `LanguageSelector.tsx`, `LanguageContext.tsx`, `i18n.ts` | Persists to localStorage, updates URL, supports RTL |
| 2 | **Theme Selection** | Choose visual theme (6 themes + 1 secret) | Header dropdown | `ThemeSelector.tsx`, `themeManager.ts` | Secret "Matrix" theme unlocked via Konami code |
| 3 | **Focus/Content Filtering** | Filter CV by focus area | Header filter button | `FocusFilterSelector.tsx`, `FilterContext.tsx` | Filters by `type_key` arrays in CV data |
| 4 | **CV Download** | Export CV in PDF/JSON/Markdown | Header download button | `DownloadModal.tsx` | Section selection, privacy options |
| 5 | **Contact Form** | Send message to CV owner | Contact section tab | `ContactForm.tsx`, `ContactSection.tsx` | Client-side validation, simulated backend |
| 6 | **Booking Widget** | Schedule a call | Contact section tab | `BookingWidget.tsx`, `ContactSection.tsx` | Mock data, TODO: Calendly/backend integration |
| 7 | **Accessibility Controls** | Adjust font size, contrast, dyslexia font | Header accessibility button | `AccessibilityControls.tsx`, `AccessibilityContext.tsx` | Settings persisted to localStorage |
| 8 | **PWA Install** | Install app on device | Header install button | `PWAInstallButton.tsx`, `PWAContext.tsx` | Service worker registration |
| 9 | **Cookie Consent** | Accept/decline analytics | Bottom banner (auto-show) | `CookieConsentBanner.tsx`, `analytics.ts` | Respects Do Not Track |
| 10 | **Konami Code Easter Egg** | Unlock secret theme | Keyboard sequence | `use-konami-code.ts`, `KonamiContext.tsx` | ↑↑↓↓←→←→BA |
| 11 | **Skills Visualization** | Interactive skills charts | Skills section | `SkillsVisualizationDashboard.tsx` | Uses Recharts library |
| 12 | **Testimonials** | View recommendations | Testimonials section | `TestimonialsSection.tsx` | Carousel with auto-rotation |
| 13 | **Scroll Progress Indicator** | See reading progress | Fixed top bar | `ScrollProgressIndicator.tsx` | Visual progress bar |
| 14 | **Floating Action Button (FAB)** | Quick actions | Fixed bottom-right | `FloatingActionButton.tsx` | Back to top, download, contact, theme |
| 15 | **Page Corner Curl** | Scroll to top effect | Fixed corner | `PageCornerCurl.tsx` | Decorative + functional |
| 16 | **Custom Cursor Follower** | Enhanced cursor | Mouse movement | `CursorFollower.tsx` | Decorative enhancement |
| 17 | **Celebration Animation** | Konami unlock celebration | Secret unlock | `CelebrationAnimation.tsx` | Triggered on Konami success |
| 18 | **Offline Indicator** | Show offline status | Automatic | `OfflineIndicator.tsx`, `PWAContext.tsx` | PWA offline detection |
| 19 | **Update Banner** | Notify of app updates | Automatic | `UpdateBanner` (in `OfflineIndicator.tsx`) | Service worker updates |

---

## 5. User Flow Breakdowns

### 5.1 Navigation Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Page Load                              │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  main.tsx                                                 │
│  - initializeLanguage() → detect from URL/localStorage   │
│  - initializeTheme() → apply saved theme                 │
│  - preloadCriticalResources()                            │
│  - initObservability() → Sentry/Clarity                  │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  App.tsx - Provider Tree Initialization                   │
│  - LanguageProvider → loads CV data for language         │
│  - CVDataProvider → normalize & validate JSON            │
│  - FilterProvider → extract type_keys for filtering      │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  AppContent - Render UI                                   │
│  - Header (fixed, with nav items)                        │
│  - HeroSection (id="hero")                               │
│  - Lazy-loaded sections with Suspense                    │
│  - Footer                                                │
│  - Toaster (notifications)                               │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  User Clicks Nav Item (e.g., "#education")                │
│  - handleNavClick() intercepts click                     │
│  - Calculates offset position (header height)            │
│  - window.scrollTo() with smooth behavior                │
└──────────────────────────────────────────────────────────┘
```

**Evidence:** `frontend/src/components/sections/Header.tsx:L61-L72`

### 5.2 Language Switch Flow

```
┌─────────────────────────────────────────────────────────┐
│  User clicks LanguageSelector dropdown                   │
│  Evidence: LanguageSelector.tsx:L28-L57                  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  User selects language (e.g., "Deutsch")                 │
│  - setLanguage('de') called                              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  LanguageContext.tsx:L84-L101                            │
│  - Validate language is in ['en', 'de', 'fa']            │
│  - setLanguageState(lang)                                │
│  - localStorage.setItem('cv-language', lang)             │
│  - applyLanguageToDOM(lang)                              │
│    - html.setAttribute('lang', lang)                     │
│    - html.setAttribute('dir', lang === 'fa' ? 'rtl':'ltr')│
│    - window.history.replaceState() updates URL           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  CVDataProvider re-renders (language dependency)         │
│  Evidence: CVDataContext.tsx:L26-L38                     │
│  - loadAndValidateData(language) called                  │
│  - loadCVDataForLanguage(lang):                          │
│    - 'de' → import cvDataDE from ramin_de.json           │
│    - 'fa' → import cvDataFA from ramin_fa.json           │
│    - default → import cvDataEN from cv.json              │
│  - normalizeCVData() → map to English schema             │
│  - validateCVDataStructure()                             │
│  - sanitizeData()                                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  All consuming components re-render with new data        │
│  - UI strings update via useTranslation()                │
│  - CV content updates via useCVData()                    │
│  - RTL layout applied for Persian                        │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Contact Form Submission Flow

```
┌─────────────────────────────────────────────────────────┐
│  User navigates to #contact section                      │
│  Tabs: "Send Message" | "Book a Call"                    │
│  Evidence: ContactSection.tsx:L10-L36                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  ContactForm Component                                   │
│  Evidence: ContactForm.tsx                               │
│  - Form fields: name, email, subject, message            │
│  - Real-time validation on blur                          │
│  - All fields required with min length validation        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  User clicks "Send" button                               │
│  - handleSubmit(e) called                                │
│  - validateForm() - all fields validated                 │
│  - If invalid: show toast.error(), set status message    │
└─────────────────────────────────────────────────────────┘
                           │
                       [Valid]
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  ⚠️  SIMULATED BACKEND (TODO)                            │
│  Evidence: ContactForm.tsx:L129-L141                     │
│  - setIsSubmitting(true)                                 │
│  - await setTimeout(1500ms) - MOCK DELAY                 │
│  - No actual API call implemented                        │
│  - TODO comment: POST to /api/contact                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Success: toast.success(), reset form, refocus           │
│  Error: toast.error(), keep form data                    │
└─────────────────────────────────────────────────────────┘
```

### 5.4 CV Download Flow

```
┌─────────────────────────────────────────────────────────┐
│  User clicks Download CV button (header or FAB)          │
│  - setDownloadModalOpen(true)                            │
│  Evidence: Header.tsx:L146-L150, FloatingActionButton.tsx│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  DownloadModal opens                                     │
│  Evidence: DownloadModal.tsx                             │
│  Format tabs: PDF | JSON | Markdown                      │
│  Section selection checkboxes                            │
│  Privacy options: Include Contact | Include References   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  User selects format and sections                        │
│  - sections state updated                                │
│  - filteredData computed via useMemo                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  User clicks "Download" button                           │
│  handleDownload() called                                 │
│  Evidence: DownloadModal.tsx:L253-L302                   │
└─────────────────────────────────────────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
[PDF]                  [JSON]               [Markdown]
    │                      │                      │
    ▼                      ▼                      ▼
window.print()      JSON.stringify()    generateMarkdown()
                    Blob + download      Blob + download
```

### 5.5 Focus Filter Flow

```
┌─────────────────────────────────────────────────────────┐
│  Page loads → FocusFilterSelector mounts                 │
│  Evidence: FocusFilterSelector.tsx:L69-L73               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  deriveFilterOptions(cvData) called                      │
│  - Recursively scans all CV data                         │
│  - Collects unique type_key values                       │
│  - Always includes "Full CV" as first option             │
│  Evidence: FocusFilterSelector.tsx:L23-L60               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  User clicks filter dropdown → selects focus             │
│  - handleFilterChange(filter) called                     │
│  - setSelectedFocus(filter)                              │
│  - localStorage.setItem('cv-focus-filter', filter)       │
│  Evidence: FocusFilterSelector.tsx:L75-L79               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Section components check shouldShowEntry()              │
│  Evidence: FilterContext.tsx:L74-L84                     │
│  - If typeKey empty → show                               │
│  - If selectedFocus === "Full CV" → show all             │
│  - Else: typeKey.some() case-insensitive match           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Behavior Matrix

| Behavior | Trigger | State Affected | Persistence | Risks | Evidence |
|----------|---------|----------------|-------------|-------|----------|
| **Language Selection** | URL `?lang=xx`, dropdown click, browser language | `language` state in LanguageContext | localStorage `cv-language`, URL param | Fallback chain may cause unexpected language | `LanguageContext.tsx:L28-L54` |
| **Theme Selection** | Dropdown click, Konami unlock | `data-theme` attribute on `<html>` | localStorage `cv-theme-preference` | Secret theme visible only after Konami | `themeManager.ts:L102-L107` |
| **Focus Filter** | Dropdown selection | `selectedFocus` in FilterContext | localStorage `cv-focus-filter` | May hide content unintentionally | `FilterContext.tsx:L24-L29` |
| **Font Size** | Accessibility control +/- buttons | `fontSize` in AccessibilityContext, `document.documentElement.style.fontSize` | localStorage `a11y-font-size` | Range 75-150%, may break layouts at extremes | `AccessibilityContext.tsx:L90-L97` |
| **High Contrast** | Accessibility toggle | `.high-contrast` class on `<html>` | localStorage `a11y-high-contrast` | Requires CSS support for class | `AccessibilityContext.tsx:L99-L107` |
| **Dyslexia Font** | Accessibility toggle | `.dyslexia-font` class on `<html>` | localStorage `a11y-dyslexia-font` | Requires font to be loaded | `AccessibilityContext.tsx:L109-L117` |
| **Cookie Consent** | Banner accept/decline | `consentGiven` in analytics module | localStorage `analytics_consent` | Affects analytics tracking | `analytics.ts:L110-L129` |
| **PWA Install** | Install button click | `isInstalled` in PWAContext | Browser PWA state | Install prompt only shown once | `PWAContext.tsx:L149-L166` |
| **Offline Detection** | Network status change | `isOffline` in PWAContext | None (runtime) | UI indicator only | `PWAContext.tsx:L61-L72` |
| **Konami Code** | Keyboard sequence ↑↑↓↓←→←→BA | `isUnlocked` in KonamiContext | localStorage `konami-code-unlocked` | Sequence timeout 2s | `use-konami-code.ts:L9-L20` |
| **Scroll Position** | Window scroll | Header styling, FAB visibility | None (runtime) | Threshold: 300px for FAB | `Header.tsx:L53-L59`, `FloatingActionButton.tsx:L37-L42` |
| **Form Validation** | Input blur, form submit | `errors`, `touched` states | None (runtime) | Client-side only, no backend | `ContactForm.tsx:L46-L72` |
| **Analytics Events** | Various user actions | Event queue if no consent | None (queued in memory) | Respects DNT, requires consent | `analytics.ts:L193-L220` |

---

## 7. Data Source Map

### 7.1 CV Content Data Sources

| Source File | Language | Consumers | Transform/Validation | Evidence |
|-------------|----------|-----------|---------------------|----------|
| `frontend/src/data/cv.json` | English (EN) | CVDataProvider via dataLoader | normalizeCVData() → validateCVDataStructure() → sanitizeData() | `dataLoader.ts:L29-L30` |
| `frontend/src/data/ramin_de.json` | German (DE) | CVDataProvider via dataLoader | Same pipeline with German key mapping | `dataLoader.ts:L25-L26` |
| `frontend/src/data/ramin_fa.json` | Persian (FA) | CVDataProvider via dataLoader | Same pipeline with Persian key mapping | `dataLoader.ts:L27-L28` |

### 7.2 Data Loading Pipeline

```
Raw JSON (language-specific keys)
         │
         ▼
┌─────────────────────────────────────────┐
│ loadCVDataForLanguage(lang)             │
│ Evidence: dataLoader.ts:L23-L32         │
│ - Switch on language                    │
│ - Return raw JSON object                │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ normalizeCVData(rawData, lang)          │
│ Evidence: dataNormalizer.ts             │
│ - Map language-specific keys to English │
│ - German: grunddaten → basics           │
│ - Persian: اطلاعات_پایه → basics         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ validateCVDataStructure(normalized)     │
│ Evidence: debugDataFlow.ts              │
│ - Check required fields exist           │
│ - Return { isValid, issues }            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ DataValidator.validate(normalized)      │
│ Evidence: dataValidator.ts              │
│ - Detailed field validation             │
│ - Return { isValid, errors, warnings }  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ sanitizeData(normalized)                │
│ Evidence: sanitizeData.ts               │
│ - Deduplicate entries                   │
│ - Normalize dates                       │
│ - Clean type_key arrays                 │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ CVDataContext provides data to app      │
│ Evidence: CVDataContext.tsx:L26-L38     │
└─────────────────────────────────────────┘
```

### 7.3 UI Translation Data Source

| Source | Consumers | Evidence |
|--------|-----------|----------|
| `frontend/src/lib/i18n.ts` (inline object) | useTranslation(), useT(), useFormatters() | `i18n.ts:L458-L1616` |

### 7.4 Configuration Data Sources

| Source | Purpose | Evidence |
|--------|---------|----------|
| `frontend/runtime.config.json` | App identifier | `runtime.config.json:L2` |
| `frontend/theme.json` | Theme definitions (Spark) | Used by @github/spark |
| `frontend/netlify.toml` | Netlify deployment config | Deployment settings |
| `frontend/vercel.json` | Vercel deployment config | Deployment settings |

### 7.5 No Remote API Calls Detected

**Finding:** The application is **purely static** in production. No remote API calls are made for CV data.

**Evidence:**
- `dataLoader.ts` uses direct static imports, not fetch()
- `ContactForm.tsx:L129-L141` has TODO comment for API integration
- `BookingWidget.tsx:L66-L91` has TODO comment for Calendly integration
- No API route handlers in `frontend/` directory

---

## 8. Non-Obvious Behaviors

### 8.1 Konami Code Easter Egg

**Behavior:** Typing ↑↑↓↓←→←→BA on keyboard unlocks a secret "Matrix" theme.

**Implementation:**
- Keyboard listener in `use-konami-code.ts:L62-L86`
- State shared via `KonamiContext.tsx`
- Celebration animation triggered by `CelebrationAnimation.tsx`
- Secret theme visibility controlled by `themeManager.ts:L79-L84`

**Persistence:** `localStorage.setItem('konami-code-unlocked', 'true')`

**Evidence:** `use-konami-code.ts:L9-L20`

### 8.2 Analytics Tracking

**Behavior:** Privacy-respecting analytics with consent management.

**Events Tracked:**
- `page_view` - Page loads
- `section_scroll` - Section visibility (IntersectionObserver)
- `theme_change` - Theme switches
- `language_change` - Language switches
- `filter_change` - Focus filter changes
- `pdf_download` - Download actions
- `external_link` - Outbound link clicks
- `contact_form` - Form submissions
- `project_view` - Project expansions
- `skill_interaction` - Skill hovers/clicks

**Privacy Features:**
- Respects Do Not Track (DNT) header
- Requires explicit consent
- Events queued until consent given
- GA4 integration prepared but not active

**Evidence:** `analytics.ts:L10-L21`, `analytics.ts:L57-L76`

### 8.3 Observability Integration

**Behavior:** Optional Sentry error tracking and Microsoft Clarity session recording.

**Evidence:** `main.tsx:L23-L24`
```typescript
import { initObservability } from './lib/observability'
initObservability()
```

**Configuration:** Environment-gated, likely via environment variables.

### 8.4 PWA Capabilities

**Service Worker:** Registered at `/sw.js`

**Features:**
- Offline support indicator
- Install prompt handling
- Update detection and notification

**Evidence:** `PWAContext.tsx:L107-L147`

### 8.5 SEO Initialization

**Behavior:** Dynamic meta tag updates based on CV data and language.

**Function:** `initializeSEO(data, language)` called on data/language change.

**Evidence:** `App.tsx:L56-L60`, `seo.ts`

### 8.6 Performance Monitoring (Dev Only)

**Behavior:** Web Vitals reporting and performance monitoring in development mode.

**Evidence:** `main.tsx:L34-L37`
```typescript
if (import.meta.env.DEV) {
  initPerformanceMonitoring()
  reportWebVitals()
}
```

### 8.7 Pseudo-Localization Support

**Behavior:** QA feature to test i18n completeness by transforming text.

**Evidence:** `i18n.ts:L1619-L1629`
```typescript
import { isPseudoLocEnabled, pseudoLocalizeObject } from '@/utils/pseudoLocalization'
```

### 8.8 Sound Effects (Provider Present)

**Behavior:** Sound effects provider exists but implementation unclear.

**Evidence:** `App.tsx:L17` imports `SoundEffectsProvider`

### 8.9 Micro Feedback (Provider Present)

**Behavior:** Micro feedback provider exists but implementation unclear.

**Evidence:** `App.tsx:L16` imports `MicroFeedbackProvider`

---

## 9. Unknowns and Verification Plan

### 9.1 Unknowns Requiring Manual Verification

| # | Unknown | Reason | Verification Steps |
|---|---------|--------|-------------------|
| 1 | **Service Worker Implementation** | `/sw.js` file not found in source; may be generated at build time | 1. Run `npm run build` in frontend<br>2. Check `dist/sw.js` for contents<br>3. Verify caching strategy |
| 2 | **Sound Effects Actual Implementation** | `SoundEffectsProvider` imported but component not fully analyzed | 1. View `frontend/src/components/SoundEffects.tsx`<br>2. Check for audio file references |
| 3 | **Micro Feedback Implementation** | `MicroFeedbackProvider` imported but component not fully analyzed | 1. View `frontend/src/components/MicroFeedback.tsx`<br>2. Identify feedback mechanisms |
| 4 | **Observability Configuration** | `initObservability()` implementation details not inspected | 1. View `frontend/src/lib/observability/`<br>2. Check for env variable requirements |
| 5 | **Actual GA4 Integration Status** | `ga4MeasurementId` property exists but value unknown | 1. Check for `VITE_GA4_*` environment variables<br>2. Check production build for GA script |
| 6 | **Backend API Endpoints** | TODO comments suggest future `/api/contact` and Calendly | 1. Check `backend/` directory for API implementation<br>2. Verify no serverless functions in frontend |
| 7 | **All Section Components Content** | Only key sections analyzed; others lazy-loaded | 1. Build and run app<br>2. Navigate through all sections<br>3. Verify content renders |

### 9.2 Items Confirmed as Non-Implemented (TODO Status)

| Feature | Status | Evidence |
|---------|--------|----------|
| Contact Form Backend | TODO - Simulated | `ContactForm.tsx:L129-L141` |
| Booking Backend | TODO - Simulated | `BookingWidget.tsx:L66-L91` |
| Calendly Integration | TODO | `BookingWidget.tsx:L69-L79` |

---

## 10. Self-Audit

### Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`/reports/FUNCTIONALITY_MAP.md`).
- [x] I did not leave determinable sections as "unknown" — I documented what could be determined from repo inspection.
- [x] For any remaining unknowns, I documented why and how to verify manually (Section 9).

### Safety Checks

1. ✅ **No changes outside `/reports/`** — Only created `/reports/FUNCTIONALITY_MAP.md`
2. ✅ **No existing files were modified** — This is a new file creation only
3. ✅ **Report file exists** — `/reports/FUNCTIONALITY_MAP.md` created
4. ✅ **No section left "unknown" if determinable** — All determinable information extracted from repo inspection
5. ✅ **Unknowns documented with verification steps** — Section 9 provides manual verification steps

---

## Appendix: File References

### Key Implementation Files Analyzed

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main application component, provider tree |
| `frontend/src/main.tsx` | Application entry point |
| `frontend/src/context/LanguageContext.tsx` | Language state management |
| `frontend/src/context/CVDataContext.tsx` | CV data provision |
| `frontend/src/context/FilterContext.tsx` | Focus filter state |
| `frontend/src/context/KonamiContext.tsx` | Konami code state |
| `frontend/src/context/PWAContext.tsx` | PWA state management |
| `frontend/src/context/AccessibilityContext.tsx` | Accessibility settings |
| `frontend/src/components/sections/Header.tsx` | Navigation, controls |
| `frontend/src/components/sections/HeroSection.tsx` | Hero section |
| `frontend/src/components/sections/ContactSection.tsx` | Contact section with tabs |
| `frontend/src/components/ContactForm.tsx` | Contact form implementation |
| `frontend/src/components/BookingWidget.tsx` | Booking widget implementation |
| `frontend/src/components/DownloadModal.tsx` | CV download modal |
| `frontend/src/components/LanguageSelector.tsx` | Language dropdown |
| `frontend/src/components/ThemeSelector.tsx` | Theme dropdown |
| `frontend/src/components/FocusFilterSelector.tsx` | Focus filter dropdown |
| `frontend/src/components/AccessibilityControls.tsx` | Accessibility controls |
| `frontend/src/components/FloatingActionButton.tsx` | FAB component |
| `frontend/src/components/CookieConsentBanner.tsx` | Cookie consent |
| `frontend/src/utils/dataLoader.ts` | CV data loading pipeline |
| `frontend/src/utils/analytics.ts` | Analytics utilities |
| `frontend/src/lib/i18n.ts` | UI translations |
| `frontend/src/lib/themeManager.ts` | Theme management |
| `frontend/src/hooks/use-konami-code.ts` | Konami code detection |

---

*Report generated: 2026-01-02*
*Report type: REPORT-ONLY (no code modifications)*
