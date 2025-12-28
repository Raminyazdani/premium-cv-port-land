# Language Change Audit Report

**Generated:** 2025-12-28  
**Scope:** CV data files + website static text (EN/DE/FA)  
**Status:** DIAGNOSIS ONLY - No product code changes  

---

## Executive Summary

This audit analyzes the multilingual implementation of the CV portfolio website across three languages: English (EN), German (DE), and Persian/Farsi (FA). The assessment covers CV data loading, UI static strings, RTL/LTR support, and SEO considerations.

### Key Findings

| Area | Status | Issues Found |
|------|--------|--------------|
| CV Data Loading | ✅ PASS | All 3 languages load successfully |
| Key Normalization | ✅ PASS | German/Persian keys normalize to English schema |
| UI Translations (i18n.ts) | ✅ GOOD | Comprehensive translations for EN/DE/FA |
| Hardcoded Strings | ⚠️ ISSUE | 92+ hardcoded strings scattered across components |
| RTL Support | ✅ GOOD | Persian correctly sets dir="rtl" |
| SEO Tags | ⚠️ PARTIAL | `<html lang>` updated, but initial HTML is hardcoded EN |
| Document Attributes | ✅ GOOD | `lang` and `dir` set dynamically |

---

## Section A: Language System Design

### A.1 Language Selection Mechanism

**Location:** `frontend/src/context/LanguageContext.tsx`

The language is selected through a priority chain:

1. **URL parameter** (`?lang=en|de|fa`) - Highest priority
2. **localStorage** (`cv-language`) - Persisted user preference
3. **Browser language** (`navigator.language`) - Fallback detection
4. **Default** - English (`en`)

```typescript
// Priority order in detectInitialLanguage():
1. URLSearchParams.get('lang')
2. localStorage.getItem('cv-language')
3. navigator.language.split('-')[0]
4. 'en' (default)
```

### A.2 CV Data Loading

**Location:** `frontend/src/utils/dataLoader.ts`

| Language | Source File | Status |
|----------|-------------|--------|
| EN | `src/data/cv.json` | ✅ Loads directly |
| DE | `src/data/ramin_de.json` | ✅ Normalized via key mapping |
| FA | `src/data/ramin_fa.json` | ✅ Normalized via key mapping |

**Normalization:** The `dataNormalizer.ts` converts language-specific keys to canonical English schema. For example:
- German `grunddaten` → `basics`
- Persian `اطلاعات_پایه` → `basics`

### A.3 Static UI Strings

**Location:** `frontend/src/lib/i18n.ts`

A centralized translation system exists with:
- `UIStrings` interface defining all translatable keys
- Complete translations for EN, DE, FA
- `getUIStrings(lang)` function to retrieve translations
- `useTranslation()` hook for React components

**Coverage:**
- Navigation (~11 keys)
- Section headings (~12 keys)
- Actions/buttons (~22 keys)
- Forms (~15 keys)
- Empty states (~11 keys)
- Accessibility (~8 keys)
- Booking widget (~26 keys)
- PWA (~5 keys)
- Download modal (~15 keys)
- Validation (~5 keys)
- And more...

**TOTAL in i18n.ts:** ~180 translation keys with EN/DE/FA coverage

### A.4 Scattered Translation Objects

Several components have their own local translation objects instead of using `i18n.ts`:

| Component | Keys | Reason |
|-----------|------|--------|
| `CookieConsentBanner.tsx` | 6 | Local `consentTranslations` |
| `TestimonialsSection.tsx` | 9 | Local `testimonialTranslations` |
| `SkillsVisualizationDashboard.tsx` | 12 | Local `chartTranslations` |
| `ProjectCaseStudy.tsx` | 17 | Local `caseStudyTranslations` |

---

## Section B: CV Data Correctness

### B.1 Data Verification Results

```
============================================================
 LANGUAGE VERIFICATION RESULTS
============================================================
 English (EN):  ✅ PASSED
   - basics: 1 entry
   - profiles: 4 entries
   - education: 5 entries
   - languages: 3 entries
   - workshop_and_certifications: 10 entries
   - skills: 8 categories
   - experiences: 5 entries
   - projects: 26 entries
   - publications: 5 entries
   - references: 5 entries

 German (DE):   ✅ PASSED
   - All 10 sections load correctly
   - Key normalization works

 Persian (FA):  ✅ PASSED
   - All 10 sections load correctly
   - Key normalization works
============================================================
```

### B.2 Locked File Integrity

| File | SHA256 Hash | Status |
|------|-------------|--------|
| `cv.json` | `c62f32a8...` | ✅ Unchanged |
| `ramin_de.json` | `7111006f...` | ✅ Unchanged |
| `ramin_fa.json` | `8035095d...` | ✅ Unchanged |

### B.3 RTL/LTR Directionality

| Language | Direction | HTML Attribute | Status |
|----------|-----------|----------------|--------|
| EN | LTR | `dir="ltr"` | ✅ |
| DE | LTR | `dir="ltr"` | ✅ |
| FA | RTL | `dir="rtl"` | ✅ |

The `LanguageContext.tsx` correctly sets:
```typescript
const dir = lang === 'fa' ? 'rtl' : 'ltr'
html.setAttribute('dir', dir)
```

---

## Section C: Static UI String Audit

### C.1 Hardcoded Strings Found

Total hardcoded strings discovered: **92** (as documented in CSV inventory)

Categories breakdown:
- Critical section headings/content: ~15 strings
- Demo section (EnhancedUIDemo): ~20 strings
- Aria-labels for accessibility: ~35 strings
- Fallback texts: ~12 strings
- Download modal labels: ~10 strings

See `LANGUAGE_STRING_INVENTORY.csv` for complete list.

### C.2 Major Problem Areas

#### 1. ContactSection.tsx (Critical)
```typescript
// Lines 10-18: Completely hardcoded
<h2>Let's Connect</h2>
<p>Whether you want to send a message or schedule a call...</p>
<TabsTrigger value="message">Send Message</TabsTrigger>
<TabsTrigger value="booking">Book a Call</TabsTrigger>
```

#### 2. EnhancedUIDemo.tsx (Critical)
All text is English-only:
- "Enhanced UI Features"
- "Premium Interactive Components"
- "3D Language Carousel"
- All feature descriptions

#### 3. ErrorFallback.tsx (Both versions)
```typescript
// Hardcoded error messages
"Something went wrong"
"An error occurred while loading the application"
"Error details"
"Try again"
```

#### 4. Footer.tsx
```typescript
// Line 88: Hardcoded hint
"Try the Konami code 🎮"
```

#### 5. Various aria-labels
```typescript
// Hardcoded accessibility labels
aria-label="Page scroll progress"
aria-label="Previous skill category"
aria-label="Scroll to about section"
aria-label="Close modal"
```

### C.3 Fallback Pattern Issues

Many components use English fallbacks:
```typescript
{t.pwa?.install_app || 'Install App'}  // Good pattern but...
{t.articles?.title || 'Articles & Blog'} // ...reveals missing keys
```

This indicates some translation keys may be missing or optional.

---

## Section D: Consistency Checks

### D.1 Mixed-Language UI Risk

**Risk Level:** MEDIUM

When switching languages, most UI updates correctly. However:
- `EnhancedUIDemo` section always displays English
- `ContactSection` headings always English
- Error fallback pages always English
- Some aria-labels remain English

### D.2 SEO Tag Updates

| Element | Behavior | Status |
|---------|----------|--------|
| `<html lang>` | Updates dynamically | ✅ |
| `<html dir>` | Updates dynamically | ✅ |
| `<title>` | Updates via `initializeSEO()` | ✅ |
| `<meta description>` | Updates dynamically | ✅ |
| `hreflang` tags | Added dynamically | ✅ |
| Initial HTML | Hardcoded `lang="en"` | ⚠️ |

**Issue:** `index.html` has `<html lang="en">` hardcoded. While this is updated by JavaScript, SSR/prerender scenarios would show English initially.

### D.3 Date/Number Formatting

**Location:** `frontend/src/lib/i18n.ts`

The codebase has comprehensive locale-aware formatting:
- `formatDate()` - Uses `Intl.DateTimeFormat`
- `formatNumber()` - Uses `Intl.NumberFormat` with Persian numerals for FA
- `formatCurrency()` - Locale-aware currency formatting
- `formatList()` - Uses `Intl.ListFormat`

### D.4 Font Support

**Persian Font:** `Vazirmatn` is loaded via Google Fonts in `index.html`:
```html
<link rel="preload" href="...family=Vazirmatn:wght@300..700...">
```

### D.5 Bidi Issues

URLs and emails (LTR content in RTL context) should be handled carefully. The current implementation relies on browser defaults, which is generally acceptable.

---

## Section E: Recommendations

### Strategy 1: Minimal Dictionary Approach (No Library)

**Effort:** Small (S)  
**Migration:** 1-2 days

**Approach:**
1. Move all scattered translation objects into `i18n.ts`
2. Add missing keys for hardcoded strings
3. Use typed keys throughout

**Pros:**
- No new dependencies
- Consistent with existing pattern
- Type-safe with TypeScript

**Cons:**
- Manual key management
- No extraction tooling
- No plural rules (beyond current implementation)

**Steps:**
1. Audit all hardcoded strings → Add to `UIStrings` interface
2. Move local translation objects (CookieConsent, Testimonials, etc.) to `i18n.ts`
3. Replace hardcoded strings with `t.xxx.yyy` calls
4. Add ESLint rule to flag string literals in JSX (optional)

### Strategy 2: i18next Library Integration

**Effort:** Medium (M)  
**Migration:** 3-5 days

**Approach:**
Use `react-i18next` for:
- Namespace support
- Missing key detection
- Interpolation
- Plural handling

**Pros:**
- Industry standard
- Rich ecosystem
- Translation extraction tools
- ICU message format support

**Cons:**
- New dependency (~13KB gzipped)
- Migration effort
- Learning curve for team

**Steps:**
1. Install `i18next` and `react-i18next`
2. Configure with lazy loading for language files
3. Convert existing `i18n.ts` translations to i18next format
4. Replace `useTranslation()` hook with i18next version
5. Keep CV JSON approach (no change needed)

**Compatibility with CV JSON:**
CV data remains separate from UI strings. i18next handles only `t()` calls for static UI text.

### Strategy 3: Full Product Internationalization

**Effort:** Large (L)  
**Migration:** 7-14 days

**Approach:**
Complete i18n infrastructure with:
- Translation extraction workflow
- Lint rules forbidding raw strings
- CI checks for missing translations
- Translation management platform integration

**Pros:**
- Professional-grade i18n
- Scalable to more languages
- Translation workflow automation
- Quality assurance

**Cons:**
- Significant upfront effort
- Requires process changes
- May be overkill for 3-language CV site

**Steps:**
1. Implement Strategy 2 (i18next)
2. Add `eslint-plugin-i18next` for lint rules
3. Set up translation extraction with `i18next-parser`
4. Create CI workflow to check for missing keys
5. Consider Crowdin/Lokalise integration for translation management

---

## Section F: Out-of-the-Box Essential Checks

### F.1 SEO Tags and Language

| Check | Result |
|-------|--------|
| `<html lang>` attribute updates | ✅ Yes |
| `document.dir` updates | ✅ Yes |
| `document.lang` updates | ✅ Yes |
| Meta tags update with language | ✅ Yes |
| hreflang alternates added | ✅ Yes |

### F.2 Reduced Motion Preference

The codebase **does** respect `prefers-reduced-motion`:
- `Header.tsx` checks `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Animations are conditionally disabled
- RTL layout changes are not animated separately (they should be instant)

### F.3 UI/CV Language Mismatch Risk

**Finding:** The language selector (including `LanguageCarousel`) correctly changes both:
1. UI strings (via `LanguageContext` → `useTranslation()`)
2. CV data (via `CVDataContext` → `loadAndValidateData(lang)`)

Both are kept in sync through the shared language state.

---

## Self-Overseer Checklist

- [x] LANGUAGE_AUDIT.md exists and is evidence-based
- [x] LANGUAGE_STRING_INVENTORY.csv exists and covers all UI strings found
- [x] LANGUAGE_AUDIT.json exists and matches the markdown report
- [x] At least 3 solution strategies are proposed with trade-offs
- [x] Locked CV JSON files are unchanged (hash verified)

---

## Appendix: File References

| File | Purpose |
|------|---------|
| `frontend/src/lib/i18n.ts` | Central UI translations |
| `frontend/src/lib/languageManager.ts` | Language utility functions |
| `frontend/src/context/LanguageContext.tsx` | React context for language state |
| `frontend/src/utils/dataLoader.ts` | CV data loading |
| `frontend/src/utils/dataNormalizer.ts` | Key normalization for DE/FA |
| `frontend/src/config/keyMappings.ts` | Key mapping definitions |
| `frontend/src/utils/seo.ts` | SEO meta tag management |
