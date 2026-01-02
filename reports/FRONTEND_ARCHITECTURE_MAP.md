# Frontend Architecture Deep Map

**Report Version:** 1.0  
**Generated:** 2026-01-02  
**Repository:** premium-cv-port-land  
**Report Type:** REPORT-ONLY (No code modifications made)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Routing Architecture](#routing-architecture)
3. [Layout and Shell Structure](#layout-and-shell-structure)
4. [Component Taxonomy](#component-taxonomy)
5. [State Management Architecture](#state-management-architecture)
6. [Data Layer Architecture](#data-layer-architecture)
7. [Internationalization (i18n) Architecture](#internationalization-i18n-architecture)
8. [Accessibility (a11y) Patterns](#accessibility-a11y-patterns)
9. [Styling and Theming Architecture](#styling-and-theming-architecture)
10. [Hotspots Analysis](#hotspots-analysis)
11. [Risks and Constraints](#risks-and-constraints)
12. [Manual Verification Plan](#manual-verification-plan)
13. [Self-Audit](#self-audit)

---

## Executive Summary

This document provides a comprehensive architectural map of the frontend application for the premium-cv-port-land project. The application is a **JSON-driven multilingual CV/portfolio website** built with:

- **Framework:** React 19 + Vite 7 + TypeScript 5.7
- **Styling:** Tailwind CSS 4 + Radix UI Colors
- **UI Components:** Custom components + Radix UI primitives (47 UI components)
- **State Management:** React Context API (6 contexts)
- **i18n:** Custom implementation supporting EN/DE/FA with RTL support
- **Testing:** Vitest + @testing-library/react + Playwright

**Key Architectural Characteristics:**
- Single-page application (SPA) with no client-side routing library
- Hash-based in-page navigation (anchor links)
- Lazy-loaded section components
- JSON data files as source of truth for CV content
- Comprehensive data normalization pipeline for multilingual support

---

## Routing Architecture

### 1.1 How Routing Works Here

**Evidence:** `frontend/src/App.tsx:L1-L226`

This application does **NOT use a traditional routing library** (no React Router, no TanStack Router). Instead, it employs:

1. **Single-page architecture:** All content is rendered on a single page
2. **Hash-based anchor navigation:** Sections are navigated via `#section-id` anchors
3. **Smooth scroll behavior:** Implemented via `handleNavClick` function in Header

**Evidence from `frontend/src/components/sections/Header.tsx:L61-L73`:**
```typescript
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  setIsOpen(false)
  const element = document.querySelector(href)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - LAYOUT_CONSTANTS.HEADER_SCROLL_OFFSET
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
```

### 1.2 Route Table

| Route/Section | Section ID | Purpose | Top Components | Implementation |
|---------------|-----------|---------|----------------|----------------|
| `/` | `#hero` | Landing/Hero section | `HeroSection` | `frontend/src/components/sections/HeroSection.tsx` |
| `/#about` | `#about` | About/Basics info | `BasicsSection` | `frontend/src/components/sections/BasicsSection.tsx` |
| `/#profiles` | `#profiles` | Social profiles | `ProfilesSection` | `frontend/src/components/sections/ProfilesSection.tsx` |
| `/#education` | `#education` | Education history | `EducationSection` | `frontend/src/components/sections/EducationSection.tsx` |
| `/#experience` | `#experience` | Work experience | `ExperiencesSection` | `frontend/src/components/sections/ExperiencesSection.tsx` |
| `/#projects` | `#projects` | Portfolio projects | `ProjectsSection` | `frontend/src/components/sections/ProjectsSection.tsx` |
| `/#publications` | `#publications` | Research/Publications | `PublicationsSection` | `frontend/src/components/sections/PublicationsSection.tsx` |
| `/#languages` | `#languages` | Language skills | `LanguagesSection` | `frontend/src/components/sections/LanguagesSection.tsx` |
| `/#certifications` | `#certifications` | Certifications | `WorkshopAndCertificationsSection` | `frontend/src/components/sections/WorkshopAndCertificationsSection.tsx` |
| `/#skills` | `#skills` | Technical skills | `SkillsSection`, `SkillsVisualizationDashboard` | `frontend/src/components/sections/SkillsSection.tsx` |
| `/#testimonials` | `#testimonials` | Testimonials | `TestimonialsSection` | `frontend/src/components/TestimonialsSection.tsx` |
| `/#articles` | `#articles` | Blog/Articles | `ArticlesSection` | `frontend/src/components/ArticlesSection.tsx` |
| `/#references` | `#references` | References | `ReferencesSection` | `frontend/src/components/sections/ReferencesSection.tsx` |
| `/#contact` | `#contact` | Contact form | `ContactSection` | `frontend/src/components/sections/ContactSection.tsx` |

### 1.3 URL Parameters

| Parameter | Purpose | Evidence |
|-----------|---------|----------|
| `?lang=en\|de\|fa` | Language selection | `frontend/src/context/LanguageContext.tsx:L29-L34` |

---

## Layout and Shell Structure

### 2.1 Layout Diagram (Text)

```
┌──────────────────────────────────────────────────────────────────┐
│                        <ErrorBoundary>                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    <LanguageProvider>                       │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                  <CVDataProvider>                     │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │               <FilterProvider>                  │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │            <KonamiProvider>               │  │  │  │  │
│  │  │  │  │  ┌────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │          <PWAProvider>              │  │  │  │  │  │
│  │  │  │  │  │  ┌──────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │   <AccessibilityProvider>    │  │  │  │  │  │  │
│  │  │  │  │  │  │  ┌────────────────────────┐  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  <SoundEffectsProvider>│  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  ┌──────────────────┐  │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  │<MicroFeedbackProv>│  │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  │ ┌──────────────┐ │  │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  │ │ <AppContent> │ │  │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  │ └──────────────┘ │  │  │  │  │  │  │  │  │
└──────────────────────────────────────────────────────────────────┘

<AppContent> Structure:
┌────────────────────────────────────────────────────────────────────┐
│  <div className="relative">                                         │
│  ├── <CursorFollower />                                             │
│  ├── <ScrollProgressIndicator />                                    │
│  ├── <CelebrationAnimation />                                       │
│  ├── <FloatingActionButton />                                       │
│  ├── <PageCornerCurl />                                             │
│  ├── <CookieConsentBanner />                                        │
│  ├── <OfflineIndicator /> + <UpdateBanner />                        │
│  ├── <a> Skip to content link                                       │
│  ├── <Header />                                                     │
│  ├── <main id="main-content">                                       │
│  │   ├── <HeroSection />                                            │
│  │   ├── <Suspense> <BasicsSection /> </Suspense>                   │
│  │   ├── <Suspense> <ProfilesSection /> </Suspense>                 │
│  │   ├── <Suspense> <EducationSection /> </Suspense>                │
│  │   ├── <Suspense> <ExperiencesSection /> </Suspense>              │
│  │   ├── <Suspense> <ProjectsSection /> </Suspense>                 │
│  │   ├── <Suspense> <PublicationsSection /> </Suspense>             │
│  │   ├── <Suspense> <LanguagesSection /> </Suspense>                │
│  │   ├── <Suspense> <WorkshopAndCertificationsSection /> </Suspense>│
│  │   ├── <Suspense> <SkillsSection /> </Suspense>                   │
│  │   ├── <Suspense> <SkillsVisualizationDashboard /> </Suspense>    │
│  │   ├── <Suspense> <TestimonialsSection /> </Suspense>             │
│  │   ├── <Suspense> <ArticlesSection /> </Suspense>                 │
│  │   ├── <Suspense> <ReferencesSection /> </Suspense>               │
│  │   └── <Suspense> <ContactSection /> </Suspense>                  │
│  ├── <Suspense> <Footer /> </Suspense>                              │
│  └── <Toaster />                                                    │
│  </div>                                                             │
└────────────────────────────────────────────────────────────────────┘
```

**Evidence:** `frontend/src/App.tsx:L110-L199` (AppContent), `frontend/src/App.tsx:L202-L224` (App)

### 2.2 Shared Layout Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Header` | `frontend/src/components/sections/Header.tsx` | Fixed navigation header with language/theme selectors |
| `Footer` | `frontend/src/components/sections/Footer.tsx` | Page footer with credits |
| `SectionWrapper` | `frontend/src/components/composites/SectionWrapper.tsx` | Consistent section structure with title, icon, empty states |
| `SkeletonSection` | `frontend/src/components/ui/skeleton.tsx` | Loading placeholder for lazy-loaded sections |

---

## Component Taxonomy

### 3.1 Component Categories

```
frontend/src/components/
├── ui/                    # 47 UI Primitives (Radix-based)
├── sections/              # 15 Section Components (CV sections)
├── composites/            # 2 Composite Components (shared patterns)
└── [root]                 # 28 Feature Components
```

### 3.2 UI Primitives (`frontend/src/components/ui/`)

**Count:** 47 components  
**Pattern:** Radix UI primitives wrapped with Tailwind styling  
**Evidence:** `frontend/src/components/ui/button.tsx`, `frontend/src/components/ui/card.tsx`, etc.

| Category | Components |
|----------|------------|
| **Form Controls** | `button`, `checkbox`, `form`, `input`, `input-otp`, `label`, `radio-group`, `select`, `slider`, `switch`, `textarea`, `toggle`, `toggle-group` |
| **Layout** | `accordion`, `aspect-ratio`, `card`, `collapsible`, `resizable`, `scroll-area`, `separator`, `tabs` |
| **Navigation** | `breadcrumb`, `dropdown-menu`, `menubar`, `navigation-menu`, `pagination`, `sidebar` |
| **Overlays** | `alert-dialog`, `context-menu`, `dialog`, `drawer`, `hover-card`, `popover`, `sheet`, `tooltip` |
| **Data Display** | `avatar`, `badge`, `calendar`, `carousel`, `chart`, `progress`, `skeleton`, `table` |
| **Feedback** | `alert`, `sonner`, `spinner` |

### 3.3 Section Components (`frontend/src/components/sections/`)

**Count:** 15 components  
**Pattern:** Each section uses `SectionWrapper` for consistent structure

| Component | LOC | Purpose |
|-----------|-----|---------|
| `WorkshopAndCertificationsSection.tsx` | 412 | Certifications display |
| `PublicationsSection.tsx` | 393 | Research publications |
| `LanguagesSection.tsx` | 392 | Language proficiency |
| `ProjectsSection.tsx` | 384 | Project portfolio |
| `ExperiencesSection.tsx` | 337 | Work experience |
| `EducationSection.tsx` | 290 | Education history |
| `SkillsSection.tsx` | 276 | Technical skills |
| `BasicsSection.tsx` | 259 | About/bio section |
| `Header.tsx` | 212 | Navigation header |
| `HeroSection.tsx` | ~200 | Landing hero |
| `ProfilesSection.tsx` | ~150 | Social links |
| `ReferencesSection.tsx` | ~150 | References |
| `ContactSection.tsx` | ~150 | Contact form |
| `Footer.tsx` | ~100 | Page footer |
| `EnhancedUIDemo.tsx` | ~100 | UI demo (dev) |

### 3.4 Feature Components (`frontend/src/components/`)

**Count:** 28 components

| Component | LOC | Purpose |
|-----------|-----|---------|
| `ProjectCaseStudy.tsx` | 481 | Detailed project case studies |
| `DownloadModal.tsx` | 465 | CV download options |
| `SkillsVisualizationDashboard.tsx` | 451 | D3/Recharts skill visualization |
| `VideoPlayer.tsx` | 413 | Video playback component |
| `TestimonialsSection.tsx` | 316 | Testimonials carousel |
| `ArticlesSection.tsx` | 311 | Blog articles |
| `ContactForm.tsx` | 297 | Contact form with validation |
| `BookingWidget.tsx` | 280 | Call booking interface |
| `SkillsCarousel.tsx` | 277 | Skills carousel view |
| `MediaModal.tsx` | 261 | Media lightbox |
| `SoundEffects.tsx` | 258 | Audio feedback |
| `Timeline.tsx` | 239 | Timeline component |
| `LanguageCarousel.tsx` | 227 | Language switcher carousel |
| `ErrorFallback.tsx` | ~150 | Error boundary fallback |
| `CookieConsentBanner.tsx` | ~120 | GDPR consent |
| `OfflineIndicator.tsx` | ~100 | PWA offline status |
| `CursorFollower.tsx` | ~100 | Custom cursor effect |
| `FloatingActionButton.tsx` | ~100 | FAB component |
| `ScrollProgressIndicator.tsx` | ~80 | Scroll progress bar |
| `CelebrationAnimation.tsx` | ~80 | Konami celebration |
| `PageCornerCurl.tsx` | ~80 | Page curl effect |
| `AccessibilityControls.tsx` | ~120 | A11y settings |
| `ThemeSelector.tsx` | ~100 | Theme picker |
| `LanguageSelector.tsx` | ~100 | Language picker |
| `FocusFilterSelector.tsx` | ~100 | Focus filter picker |
| `PWAInstallButton.tsx` | ~80 | PWA install prompt |
| `OptimizedImage.tsx` | ~80 | Lazy image loading |
| `MediaThumbnail.tsx` | ~60 | Media thumbnail |
| `MicroFeedback.tsx` | ~100 | Haptic/visual feedback |
| `SkillTooltip.tsx` | ~60 | Skill hover tooltip |

### 3.5 Composite Components (`frontend/src/components/composites/`)

| Component | Path | Purpose |
|-----------|------|---------|
| `SectionWrapper` | `frontend/src/components/composites/SectionWrapper.tsx` | Shared section wrapper with header, icon, empty states, RTL support |
| `index.ts` | `frontend/src/components/composites/index.ts` | Barrel export |

---

## State Management Architecture

### 4.1 Context Providers Overview

The application uses 6 React Context providers, nested in the following order:

```
LanguageProvider
  └── CVDataProvider
        └── FilterProvider
              └── KonamiProvider
                    └── PWAProvider
                          └── AccessibilityProvider
                                └── SoundEffectsProvider
                                      └── MicroFeedbackProvider
                                            └── AppContent
```

**Evidence:** `frontend/src/App.tsx:L202-L224`

### 4.2 Context Details

| Context | Path | State | Responsibilities |
|---------|------|-------|-----------------|
| **LanguageContext** | `frontend/src/context/LanguageContext.tsx` | `language`, `isRTL` | Language detection (URL, localStorage, browser), i18n hooks, locale formatters |
| **CVDataContext** | `frontend/src/context/CVDataContext.tsx` | `data`, `isValid`, `errors`, `warnings` | Load, normalize, validate CV data for current language |
| **FilterContext** | `frontend/src/context/FilterContext.tsx` | `selectedFocus`, `availableFocusOptions` | Focus-based filtering (Full CV, Programming, etc.) |
| **KonamiContext** | `frontend/src/context/KonamiContext.tsx` | `isUnlocked`, `justUnlocked`, `progress` | Easter egg Konami code detection |
| **PWAContext** | `frontend/src/context/PWAContext.tsx` | `isInstallable`, `isOffline`, `hasUpdate` | PWA lifecycle, service worker, install prompts |
| **AccessibilityContext** | `frontend/src/context/AccessibilityContext.tsx` | `fontSize`, `highContrast`, `dyslexiaFont`, `reducedMotion` | A11y preferences, ARIA announcements |

### 4.3 Provider Pattern: LanguageContext

**Evidence:** `frontend/src/context/LanguageContext.tsx:L28-L54`

```typescript
function detectInitialLanguage(): Language {
  // 1. Check URL parameter (?lang=xx)
  // 2. Check localStorage
  // 3. Check browser language
  // 4. Default to 'en'
}
```

### 4.4 Provider Pattern: CVDataContext

**Evidence:** `frontend/src/context/CVDataContext.tsx:L23-L45`

```typescript
export function CVDataProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  const cvDataState = useMemo(() => {
    const { data, validationResult } = loadAndValidateData(language)
    // Debug logging...
    return { data, isValid, errors, warnings }
  }, [language])

  return (
    <CVDataContext.Provider value={cvDataState}>
      {children}
    </CVDataContext.Provider>
  )
}
```

### 4.5 Custom Hooks

| Hook | Path | Purpose |
|------|------|---------|
| `useLanguage` | `frontend/src/context/LanguageContext.tsx` | Access language state |
| `useTranslation` | `frontend/src/context/LanguageContext.tsx` | Get UI strings for current language |
| `useFormatters` | `frontend/src/context/LanguageContext.tsx` | Locale-aware date/number formatters |
| `useCVData` | `frontend/src/context/CVDataContext.tsx` | Access CV data with validation state |
| `useCV` | `frontend/src/context/CVDataContext.tsx` | Convenience hook for just data |
| `useFilter` | `frontend/src/context/FilterContext.tsx` | Access filter state |
| `useFilteredData` | `frontend/src/hooks/useFilteredData.ts` | Generic filtering hook for sections |
| `useKonami` | `frontend/src/context/KonamiContext.tsx` | Konami code state |
| `usePWA` | `frontend/src/context/PWAContext.tsx` | PWA state |
| `useAccessibility` | `frontend/src/context/AccessibilityContext.tsx` | A11y preferences |
| `useAnnounce` | `frontend/src/context/AccessibilityContext.tsx` | ARIA live announcements |
| `useKonamiCode` | `frontend/src/hooks/use-konami-code.ts` | Konami sequence detection |
| `useCursorFollower` | `frontend/src/hooks/use-cursor-follower.ts` | Custom cursor logic |
| `useMediaModal` | `frontend/src/hooks/use-media-modal.ts` | Media modal state |
| `useMobile` | `frontend/src/hooks/use-mobile.ts` | Mobile detection |
| `useParallax` | `frontend/src/hooks/use-parallax.ts` | Parallax effect |
| `useRevealAnimation` | `frontend/src/hooks/use-reveal-animation.ts` | Scroll reveal |
| `useScrollAnimation` | `frontend/src/hooks/use-scroll-animation.ts` | Scroll-based animation |
| `useMagneticButton` | `frontend/src/hooks/use-magnetic-button.ts` | Magnetic button effect |

---

## Data Layer Architecture

### 5.1 Data Flow Diagram

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    JSON Data Files                       │
                    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
                    │  │  cv.json    │ │ ramin_de.json│ │ ramin_fa.json│       │
                    │  │   (EN)      │ │    (DE)      │ │    (FA)      │       │
                    │  └─────────────┘ └─────────────┘ └─────────────┘        │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │              loadCVDataForLanguage()                     │
                    │              (frontend/src/utils/dataLoader.ts:L23-L33) │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                normalizeCVData()                         │
                    │          (frontend/src/utils/dataNormalizer.ts)         │
                    │   - Maps DE/FA keys to English canonical schema         │
                    │   - Uses keyMappings.ts for field translations          │
                    │   - Uses skillCategoryMappings.ts for skill categories  │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │              validateCVDataStructure()                   │
                    │          (frontend/src/utils/debugDataFlow.ts)          │
                    │   - Validates required fields exist                     │
                    │   - Logs structure issues                               │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                DataValidator.validate()                  │
                    │          (frontend/src/utils/dataValidator.ts)          │
                    │   - Field-level validation                              │
                    │   - Type checking                                       │
                    │   - Returns errors/warnings                             │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                  sanitizeData()                          │
                    │          (frontend/src/utils/sanitizeData.ts)           │
                    │   - Deduplication                                       │
                    │   - Date normalization                                  │
                    │   - type_key cleanup                                    │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                CVDataContext.Provider                    │
                    │          (frontend/src/context/CVDataContext.tsx)       │
                    │   - Provides normalized data to components              │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                  Components                              │
                    │   - useCVData() / useCV() hooks                         │
                    │   - useFilteredData() for focus filtering               │
                    │   - Section-specific rendering                          │
                    └─────────────────────────────────────────────────────────┘
```

### 5.2 Data Files (READ-ONLY)

**⚠️ LOCKED FILES - DO NOT MODIFY**

| File | Language | Path |
|------|----------|------|
| English CV | EN | `frontend/src/data/cv.json` |
| German CV | DE | `frontend/src/data/ramin_de.json` |
| Persian CV | FA | `frontend/src/data/ramin_fa.json` |

**Evidence:** Hash integrity tests at `frontend/tests/locked-files-integrity.test.ts`

### 5.3 Key Normalization Functions

| Function | Path | Purpose |
|----------|------|---------|
| `loadCVDataForLanguage` | `frontend/src/utils/dataLoader.ts:L23-L33` | Load JSON by language |
| `normalizeCVData` | `frontend/src/utils/dataNormalizer.ts:L40-L76` | Normalize keys to EN schema |
| `normalizeBasics` | `frontend/src/utils/dataNormalizer.ts:L141-L165` | Normalize basics section |
| `normalizeSkills` | `frontend/src/utils/dataNormalizer.ts:L209-L246` | Normalize skills (nested structure) |
| `sanitizeData` | `frontend/src/utils/sanitizeData.ts` | Clean and deduplicate data |

### 5.4 Key Mappings

| Mapping File | Path | Purpose |
|--------------|------|---------|
| `keyMappings.ts` | `frontend/src/config/keyMappings.ts` (873 LOC) | Field key translations (DE→EN, FA→EN) |
| `skillCategoryMappings.ts` | `frontend/src/config/skillCategoryMappings.ts` (493 LOC) | Skill category key translations |

### 5.5 Types

**Evidence:** `frontend/src/types/cv.ts` (307 LOC)

Key interfaces:
- `CVData` - Root data structure
- `Basics`, `Education`, `Experience`, `Project`, `Publication`
- `Skills` - Nested structure: `{ [category]: { [subcategory]: SkillItem[] } }`
- `WorkshopIssuer` - Certifications grouped by issuer

---

## Internationalization (i18n) Architecture

### 6.1 i18n Implementation Overview

The application uses a **custom i18n implementation** (not react-i18next or similar libraries).

**Key Files:**
- `frontend/src/lib/i18n.ts` (2001 LOC) - UI string translations
- `frontend/src/context/LanguageContext.tsx` (271 LOC) - Language state
- `frontend/src/utils/dataNormalizer.ts` (334 LOC) - Data key normalization

### 6.2 UI Strings Structure

**Evidence:** `frontend/src/lib/i18n.ts:L9-L456`

```typescript
export interface UIStrings {
  nav: { home, about, education, experience, ... }
  sections: { hero, basics, profiles, education, ... }
  actions: { download_cv, view_more, contact_me, ... }
  forms: { name, email, subject, message, ... }
  education: { institution, degree, field, ... }
  experience: { role, institution, duration, ... }
  // ... 25+ more categories
}
```

### 6.3 Translation Coverage

| Language | Code | Status | RTL |
|----------|------|--------|-----|
| English | `en` | Complete | No |
| German | `de` | Complete | No |
| Persian/Farsi | `fa` | Complete | Yes |

### 6.4 Language Detection Priority

**Evidence:** `frontend/src/context/LanguageContext.tsx:L28-L54`

1. URL parameter: `?lang=en|de|fa`
2. localStorage: `cv-language`
3. Browser language: `navigator.language`
4. Default: `en`

### 6.5 Key i18n Functions

| Function | Path | Purpose |
|----------|------|---------|
| `getUIStrings(lang)` | `frontend/src/lib/i18n.ts:L1621-L1630` | Get UI strings object |
| `t(lang, key)` | `frontend/src/lib/i18n.ts:L1632-L1646` | Get string by dot-path key |
| `interpolate(template, vars)` | `frontend/src/lib/i18n.ts:L1648-L1650` | Variable substitution |
| `formatDate(date, lang, options)` | `frontend/src/lib/i18n.ts:L1689-L1717` | Locale-aware date |
| `formatNumber(value, lang, options)` | `frontend/src/lib/i18n.ts:L1786-L1807` | Locale-aware number |
| `pluralize(count, forms, lang)` | `frontend/src/lib/i18n.ts:L1881-L1905` | Pluralization |
| `formatList(items, lang, type)` | `frontend/src/lib/i18n.ts:L1971-L2001` | List formatting |

### 6.6 RTL Support

**Evidence:** `frontend/src/styles/rtl.css` (267 LOC)

- Applied via `html[dir="rtl"]` selector
- Automatic flex direction reversal
- Margin/padding flipping
- Text alignment adjustment
- Special handling for LTR content (URLs, code, emails)

---

## Accessibility (a11y) Patterns

### 7.1 a11y Features Overview

| Feature | Implementation | Evidence |
|---------|----------------|----------|
| Skip to content | Link in App.tsx | `frontend/src/App.tsx:L134-L139` |
| ARIA live regions | AccessibilityContext | `frontend/src/context/AccessibilityContext.tsx:L170-L184` |
| Font size controls | AccessibilityContext | `frontend/src/context/AccessibilityContext.tsx:L120-L130` |
| High contrast mode | CSS class toggle | `frontend/src/context/AccessibilityContext.tsx:L99-L107` |
| Dyslexia font | CSS class toggle | `frontend/src/context/AccessibilityContext.tsx:L109-L117` |
| Reduced motion | CSS media query + preference detection | `frontend/src/index.css:L46-L59` |
| Semantic HTML | Section aria-labelledby | `frontend/src/components/composites/SectionWrapper.tsx:L89` |
| Focus management | Focus visible styles | Tailwind defaults |
| Keyboard navigation | Tab order, enter handlers | Throughout components |

### 7.2 ARIA Patterns Used

| Pattern | Usage | Evidence |
|---------|-------|----------|
| `aria-labelledby` | Section headings | `SectionWrapper.tsx:L89` |
| `aria-label` | Icon buttons | Throughout Header, FAB |
| `aria-live` | Dynamic announcements | `AccessibilityContext.tsx:L172-L183` |
| `role="menu"` | Dropdown menus | Radix UI components |
| `role="dialog"` | Modals | Radix UI components |
| `role="tablist"` | Tabs | Radix UI components |

### 7.3 Focus Management

**Evidence:** Multiple components

- Skip link: `frontend/src/App.tsx:L134-L139`
- Focus visible styling: Tailwind's `focus-visible:` utilities
- Modal focus trap: Radix UI Dialog/Sheet components

### 7.4 Motion Preferences

**Evidence:** `frontend/src/index.css:L46-L59`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Styling and Theming Architecture

### 8.1 Styling Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Tailwind CSS | 4.1.11 | Utility-first CSS |
| Radix UI Colors | 3.0.0 | Color tokens |
| class-variance-authority | 0.7.1 | Variant handling |
| tailwind-merge | 3.0.2 | Class deduplication |
| framer-motion | 12.6.2 | Animations |

### 8.2 Theme Token Structure

**Evidence:** `frontend/src/styles/theme.css:L126-L255`

```css
#spark-app {
  /* Spacing scale (var based) */
  --size-scale: 1;
  --size-0-5: calc(0.125rem * var(--size-scale));
  /* ... */
  
  /* Border radii */
  --radius-sm: calc(2px * var(--radius-factor) * var(--size-scale));
  /* ... */
  
  /* Neutral colors (mapped to Radix Slate) */
  --color-neutral-1: var(--slate-1);
  /* ... */
  
  /* Accent colors (mapped to Radix Blue) */
  --color-accent-1: var(--blue-1);
  /* ... */
  
  /* Secondary accent (mapped to Radix Violet) */
  --color-accent-secondary-1: var(--violet-1);
  /* ... */
  
  /* Semantic colors */
  --color-fg: var(--color-neutral-12);
  --color-bg: #ffffff;
  --color-focus-ring: var(--color-accent-9);
}
```

### 8.3 CSS File Structure

| File | Path | Purpose |
|------|------|---------|
| `theme.css` | `frontend/src/styles/theme.css` | Radix imports, CSS variables |
| `themes.css` | `frontend/src/styles/themes.css` | Theme variants |
| `rtl.css` | `frontend/src/styles/rtl.css` | RTL overrides |
| `print.css` | `frontend/src/styles/print.css` | Print styles |
| `interactions.css` | `frontend/src/styles/interactions.css` | Hover/focus states |
| `index.css` | `frontend/src/index.css` | Global styles, font stacks |
| `main.css` | `frontend/src/main.css` | Entry point imports |

### 8.4 Dark Mode

**Evidence:** `frontend/src/styles/theme.css:L257-L261`

```css
#spark-app.dark-theme {
  --color-bg: var(--color-neutral-1);
  --color-bg-inset: #000000;
  --color-bg-overlay: var(--color-neutral-3);
}
```

Theme is controlled via Tailwind's `darkMode: ["selector", '[data-appearance="dark"]']`

### 8.5 Component Styling Pattern

**Evidence:** `frontend/src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Used throughout components for conditional class merging.

---

## Hotspots Analysis

### 9.1 Top 10 Largest Files (by LOC)

| Rank | File | LOC | Category | Complexity Notes |
|------|------|-----|----------|------------------|
| 1 | `frontend/src/lib/i18n.ts` | 2001 | i18n | Three complete translations + formatting utilities |
| 2 | `frontend/src/config/keyMappings.ts` | 873 | Config | Field mappings for DE/FA normalization |
| 3 | `frontend/src/components/ui/sidebar.tsx` | 726 | UI | Complex collapsible sidebar component |
| 4 | `frontend/src/utils/dataValidator.ts` | 563 | Utils | Comprehensive data validation |
| 5 | `frontend/src/config/skillCategoryMappings.ts` | 493 | Config | Skill category translations |
| 6 | `frontend/src/components/ProjectCaseStudy.tsx` | 481 | Feature | Case study with gallery/lightbox |
| 7 | `frontend/src/components/DownloadModal.tsx` | 465 | Feature | CV download with format options |
| 8 | `frontend/src/utils/seo.ts` | 451 | Utils | SEO metadata generation |
| 9 | `frontend/src/components/SkillsVisualizationDashboard.tsx` | 451 | Feature | D3/Recharts visualizations |
| 10 | `frontend/src/components/VideoPlayer.tsx` | 413 | Feature | Video player with controls |

### 9.2 Top 10 Complexity Hotspots

| Rank | File | LOC | Complexity Factors |
|------|------|-----|-------------------|
| 1 | `frontend/src/lib/i18n.ts` | 2001 | Massive translation object, locale-aware formatting, pluralization rules |
| 2 | `frontend/src/config/keyMappings.ts` | 873 | Deep nested mappings for 3 languages × all CV fields |
| 3 | `frontend/src/utils/dataNormalizer.ts` | 334 | Recursive normalization logic, multiple section handlers |
| 4 | `frontend/src/utils/dataValidator.ts` | 563 | Many validation rules, error accumulation |
| 5 | `frontend/src/components/sections/WorkshopAndCertificationsSection.tsx` | 412 | Nested issuer→certifications rendering, filtering |
| 6 | `frontend/src/components/sections/PublicationsSection.tsx` | 393 | Complex publication types, identifiers |
| 7 | `frontend/src/context/LanguageContext.tsx` | 271 | Multi-source language detection, many formatting hooks |
| 8 | `frontend/src/components/SkillsVisualizationDashboard.tsx` | 451 | D3/Recharts integration, data transformations |
| 9 | `frontend/src/config/skillCategoryMappings.ts` | 493 | Category normalization across languages |
| 10 | `frontend/src/utils/analytics.ts` | 357 | Event tracking, intersection observers |

### 9.3 Potential Duplication Clusters

| Cluster | Files | Pattern |
|---------|-------|---------|
| **Section filtering logic** | All section components | Each section implements similar `useFilteredData` + local tag filtering |
| **Card rendering** | Section components | Similar Card/CardHeader/CardContent patterns |
| **Icon + label patterns** | Multiple components | Repeated `<Icon size={N} /> <span>{text}</span>` patterns |
| **Date formatting** | Multiple components | Repeated `formatDateRangeSafe` calls |
| **Empty state handling** | Section components | Partially abstracted via SectionWrapper |

### 9.4 Test Coverage Indicators

| Test File | Coverage Area |
|-----------|---------------|
| `frontend/tests/language-content-verification.test.tsx` | EN/DE/FA data loading |
| `frontend/tests/data-normalization.test.ts` | Key normalization |
| `frontend/tests/locked-files-integrity.test.ts` | Data file integrity |
| `frontend/tests/i18n-completeness.test.ts` | Translation completeness |
| `frontend/tests/i18n-formatting.test.ts` | Date/number formatting |
| `frontend/tests/sanitize-data.test.ts` | Data sanitization |
| `frontend/tests/use-filtered-data.test.tsx` | Filter hook |

---

## Risks and Constraints

### 10.1 Identified Risks

| ID | Risk | Symptom | Root Cause | Impact | Priority |
|----|------|---------|------------|--------|----------|
| R1 | i18n.ts is a monolith | 2001 LOC single file | All translations inline | Hard to maintain, slow code review | P2 |
| R2 | No routing library | Hash-based navigation | Initial SPA design | No code splitting by route, poor deep linking | P3 |
| R3 | Provider nesting depth | 8 nested providers | Feature creep | Performance concerns, hard to test | P2 |
| R4 | Duplicate filter logic | Each section reimplements | Pattern not fully extracted | Maintenance burden | P2 |
| R5 | Locked files pattern | Hash-based integrity | Past data corruption | Fragile deployment process | P3 |
| R6 | Large config files | keyMappings.ts 873 LOC | Manual DE/FA translations | Error-prone additions | P2 |

### 10.2 Architectural Constraints

| Constraint | Description | Evidence |
|------------|-------------|----------|
| No server-side rendering | Pure client-side SPA | Vite config, no Next.js/Remix |
| JSON as data source | Static JSON files, not API | `frontend/src/data/*.json` |
| Single-page architecture | No route-based code splitting | All sections in App.tsx |
| Locked data files | Cannot modify CV JSON without hash update | `locked-files-integrity.test.ts` |

---

## Manual Verification Plan

### 11.1 Verification Steps

1. **Routing verification:**
   - [ ] Click all navigation links, verify smooth scroll works
   - [ ] Test URL with `?lang=de`, verify German loads
   - [ ] Test URL with `#education`, verify scrolls to section

2. **Component taxonomy verification:**
   - [ ] Count files in `components/ui/` (should be 47)
   - [ ] Count files in `components/sections/` (should be 15)
   - [ ] Verify SectionWrapper is used by all sections

3. **State management verification:**
   - [ ] Change language, verify all sections re-render
   - [ ] Apply filter, verify sections filter appropriately
   - [ ] Toggle theme, verify persists to localStorage

4. **i18n verification:**
   - [ ] Load each language (EN, DE, FA), verify no missing translations
   - [ ] Verify FA renders RTL
   - [ ] Run `npm run verify-languages`

5. **Accessibility verification:**
   - [ ] Tab through page, verify focus visible
   - [ ] Use skip link, verify jumps to main content
   - [ ] Run `npm run accessibility-audit`

### 11.2 Automated Checks

```bash
cd frontend
npm run test              # All tests
npm run test:language     # Language verification
npm run verify-languages  # Quick smoke test
npm run lint              # ESLint
npm run typecheck         # TypeScript
```

---

## Self-Audit

### Self-audit (task-level)

- [x] I created/used `/reports/` only.
- [x] I did not modify any existing file.
- [x] I produced the deliverables listed for this task (`/reports/FRONTEND_ARCHITECTURE_MAP.md`).
- [x] I did not leave determinable sections as "unknown".
- [x] For any remaining unknowns, I documented why and how to verify manually.

### Safety Checks (end of task)

1. ✅ No changes outside `/reports/`
2. ✅ No existing files were modified
3. ✅ The report file `/reports/FRONTEND_ARCHITECTURE_MAP.md` exists
4. ✅ No section is left "unknown" if it could be determined by repo inspection
5. ✅ Manual verification steps are documented for any areas requiring runtime confirmation

---

*Report generated by: GitHub Copilot Coding Agent*  
*Date: 2026-01-02*  
*Repository: premium-cv-port-land*
