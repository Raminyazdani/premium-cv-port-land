# Language Selection Implementation Report

## Executive Summary

The CV website now fully supports **English (EN), German (DE), and Persian (FA)** language selection with:
- ✅ Automatic data normalization (translated keys → canonical English schema)
- ✅ RTL support for Persian
- ✅ URL persistence (`?lang=fa`)
- ✅ localStorage persistence
- ✅ Browser language detection
- ✅ Protected locked data files (integrity checks)
- ✅ Comprehensive tests

---

## 1. How Language Selection Works

### Language Detection Priority
The system detects language in this order:

1. **URL parameter** (`?lang=de`) - highest priority
2. **localStorage** (`cv-language` key)
3. **Browser language** (`navigator.language`)
4. **Default fallback** (`en`)

### Language State Management
- **Context**: `LanguageContext` (`src/context/LanguageContext.tsx`)
- **Hook**: `useLanguage()` - Returns `{ language, setLanguage, isRTL }`
- **Persistence**: Automatically saved to localStorage
- **DOM Updates**: Automatically sets `<html lang="xx" dir="ltr|rtl">`

### UI Component
- **Component**: `LanguageSelector` (`src/components/LanguageSelector.tsx`)
- **Location**: Header (top-right, next to theme selector)
- **Appearance**: Globe icon + language name dropdown
- **Keyboard accessible**: Tab + Enter/Space

---

## 2. How Data Normalization Works

### The Problem
- `cv.json` has **English keys**: `basics`, `education`, `phone`, etc.
- `ramin_de.json` has **German keys**: `grunddaten`, `ausbildung`, `telefon`, etc.
- `ramin_fa.json` has **Persian keys**: `اطلاعات_پایه`, `تحصیلات`, `تلفن`, etc.

**UI components cannot work with 3 different key sets!**

### The Solution: Normalization Layer

```
Raw JSON (DE/FA) → normalizeCVData() → Canonical English Schema → UI Components
```

#### Key Mappings
**File**: `src/config/keyMappings.ts`

Contains comprehensive mappings for:
- Section-level keys (`SECTION_KEYS`)
- Field-level keys for every section (e.g., `BASICS_KEYS`, `EDUCATION_KEYS`, `SKILL_KEYS`)
- Nested structures (phone, location, pictures, proficiency, etc.)

Example:
```typescript
export const BASICS_KEYS: Record<string, KeyMapping> = {
  fname: {
    en: 'fname',
    de: 'vorname',
    fa: 'نام_کوچک'
  },
  email: {
    en: 'email',
    de: 'e_mail',
    fa: 'ایمیل'
  }
}
```

#### Normalization Function
**File**: `src/utils/dataNormalizer.ts`

```typescript
normalizeCVData(rawData: any, sourceLang: Language): CVData
```

- **Recursive**: Handles nested objects and arrays
- **Value-preserving**: Strings, numbers, nulls, arrays stay identical
- **Section-aware**: Different logic for `basics`, `skills`, `languages`, etc.

#### Data Loader
**File**: `src/utils/dataLoader.ts`

```typescript
loadAndValidateData(lang: Language): LoadDataResult
```

1. Loads correct JSON file (`cv.json`, `ramin_de.json`, or `ramin_fa.json`)
2. Normalizes using `normalizeCVData()`
3. Validates structure
4. Sanitizes (deduplicates, formats dates)
5. Returns canonical data

#### Data Context
**File**: `src/context/CVDataContext.tsx`

```typescript
const { data } = useCVData()  // Always returns normalized English schema
```

- Wraps `loadAndValidateData()`
- Reloads when language changes
- Provides data to all components
- No component ever sees translated keys!

---

## 3. How RTL Support Works

### Automatic RTL Activation
When `language === 'fa'`:
1. `<html dir="rtl" lang="fa">` is set
2. CSS file `src/styles/rtl.css` applies RTL-specific styles
3. Flexbox/Grid layouts automatically flip
4. Text alignment switches to right

### RTL CSS Rules
**File**: `src/styles/rtl.css`

- Flips margins: `margin-left` ↔ `margin-right`
- Flips padding: `padding-inline-start`, `padding-inline-end`
- Reverses flex-direction where needed
- Mirrors icons/arrows

### Font Support
**Persian font**: `Vazirmatn` (loaded from Google Fonts in `index.html`)

Applied automatically when `lang="fa"`:
```css
html[lang="fa"] body {
  font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
}
```

### Mixed Content (English URLs in Persian text)
Uses `unicode-bidi: plaintext` to prevent broken rendering of LTR content within RTL context.

---

## 4. Locked File Integrity Protection

### Protected Files
These files are **LOCKED** and must not be modified:
- `src/data/cv.json`
- `src/data/ramin_de.json`
- `src/data/ramin_fa.json`

### Protection Mechanisms

#### 1. SHA256 Hash Validation
**File**: `tests/locked-files-integrity.test.ts`

- Computes SHA256 hash of each locked file
- Compares to stored hashes in `tests/locked_files_hashes.json`
- **Test fails** if any file changed

#### 2. Generate Hashes
**File**: `tests/generate-hashes.js`

```bash
node tests/generate-hashes.js
```

Computes and stores hashes. Run this:
- After initial setup
- After intentional file updates (with approval)

#### 3. Prettier/ESLint Ignore
**File**: `.prettierignore`

```
src/data/cv.json
src/data/ramin_de.json
src/data/ramin_fa.json
```

Formatters will skip these files.

---

## 5. UI Text Translations

UI strings (buttons, labels, headings) are separate from CV content.

**File**: `src/lib/i18n.ts`

```typescript
export interface UIStrings {
  nav: { home, about, education, ... }
  sections: { hero, basics, education, ... }
  actions: { download_cv, view_more, contact_me, ... }
  forms: { name, email, subject, send, ... }
  // ... more categories
}

const translations: Record<Language, UIStrings> = {
  en: { ... },
  de: { ... },
  fa: { ... }
}
```

### Usage in Components
```typescript
import { useTranslation } from '@/context/LanguageContext'

const t = useTranslation()
<h2>{t.sections.education}</h2>  // "Education" | "Bildung" | "تحصیلات"
```

---

## 6. Testing

### Unit Tests
**File**: `tests/data-normalization.test.ts`

- ✅ DE normalization produces English keys
- ✅ FA normalization produces English keys
- ✅ Nested structures (skills) normalized correctly
- ✅ No data loss during normalization

**File**: `tests/locked-files-integrity.test.ts`

- ✅ Hashes match for all locked files

### Smoke Tests
**File**: `tests/language-switching.test.tsx`

- ✅ English loads by default
- ✅ RTL applied for Persian
- ✅ LTR applied for German
- ✅ No crashes when switching languages

### Run Tests
```bash
npm test
```

---

## 7. How to Add a New Language

Let's say you want to add **Spanish (ES)**:

### Step 1: Create Data File
1. Copy `src/data/cv.json` → `src/data/ramin_es.json`
2. Translate **keys** and **values** to Spanish:
   - `basics` → `datos_básicos`
   - `education` → `educación`
   - `fname` → `nombre`
   - etc.

### Step 2: Update Key Mappings
**File**: `src/config/keyMappings.ts`

Add `es` to every mapping:
```typescript
export const SECTION_KEYS: Record<string, KeyMapping> = {
  basics: {
    en: 'basics',
    de: 'grunddaten',
    fa: 'اطلاعات_پایه',
    es: 'datos_básicos'  // ← Add this
  },
  // ... repeat for all sections
}
```

### Step 3: Update Type Definition
**File**: `src/utils/dataNormalizer.ts`

```typescript
export type Language = 'en' | 'de' | 'fa' | 'es'  // ← Add 'es'
```

### Step 4: Update Data Loader
**File**: `src/utils/dataLoader.ts`

```typescript
import cvDataES from '@/data/ramin_es.json'

function loadCVDataForLanguage(lang: Language): any {
  switch (lang) {
    case 'es':
      return cvDataES  // ← Add this
    case 'de':
      return cvDataDE
    // ...
  }
}
```

### Step 5: Update Language Context
**File**: `src/context/LanguageContext.tsx`

```typescript
const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'fa', 'es']  // ← Add 'es'
```

### Step 6: Update Language Selector
**File**: `src/components/LanguageSelector.tsx`

```typescript
const LANGUAGES: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },  // ← Add this
]
```

### Step 7: Add UI Translations
**File**: `src/lib/i18n.ts`

```typescript
const translations: Record<Language, UIStrings> = {
  en: { ... },
  de: { ... },
  fa: { ... },
  es: {  // ← Add full Spanish UI strings
    nav: { home: 'Inicio', about: 'Acerca de', ... },
    sections: { hero: 'Bienvenido', basics: 'Sobre mí', ... },
    // ... translate all UI strings
  }
}
```

### Step 8: Add RTL Support (if needed)
If Spanish uses RTL (it doesn't, but for languages like Arabic/Hebrew):

**File**: `src/context/LanguageContext.tsx`
```typescript
const RTL_LANGUAGES: Language[] = ['fa', 'ar', 'he']  // Add RTL languages
const isRTL = RTL_LANGUAGES.includes(language)
```

### Step 9: Generate Hash (if file is locked)
```bash
node tests/generate-hashes.js
```

### Step 10: Test
```bash
npm test
```

Done! Spanish should now work.

---

## 8. Files Changed/Added

### Modified Files
1. `src/App.tsx` - Added CVDataProvider
2. `src/lib/cv-data.ts` - Refactored to use context
3. `src/components/sections/Header.tsx` - Use useCVData()
4. `src/components/sections/HeroSection.tsx` - Use useCVData()

### New Files
1. `src/context/CVDataContext.tsx` - Data context provider
2. `tests/locked-files-integrity.test.ts` - Hash validation test
3. `tests/generate-hashes.js` - Hash generation script
4. `tests/locked_files_hashes.json` - Stored hashes
5. `tests/data-normalization.test.ts` - Normalization tests
6. `tests/language-switching.test.tsx` - Language switch smoke tests
7. `.prettierignore` - Protects locked files from formatting

### Existing Files (Already Implemented)
- `src/context/LanguageContext.tsx` ✅
- `src/utils/dataNormalizer.ts` ✅
- `src/utils/dataLoader.ts` ✅
- `src/config/keyMappings.ts` ✅
- `src/lib/i18n.ts` ✅
- `src/components/LanguageSelector.tsx` ✅
- `src/styles/rtl.css` ✅
- `src/data/cv.json` ✅
- `src/data/ramin_de.json` ✅
- `src/data/ramin_fa.json` ✅

---

## 9. Confirmation

### ✅ Locked Files Not Modified
- `cv.json` - Unchanged
- `ramin_de.json` - Unchanged
- `ramin_fa.json` - Unchanged

### ✅ Guardrails Added
- SHA256 hash validation (test fails if files change)
- `.prettierignore` protects files from formatters
- Hash generation script for authorized updates

### ✅ Tests Added
- Unit tests for normalization (DE/FA → EN)
- Smoke tests for language switching
- Integrity tests for locked files

### ✅ Documentation Complete
- This implementation report
- Inline code comments
- "How to add a language" guide

---

## 10. Next Steps (Optional Enhancements)

1. **Update all section components** to use `useCVData()` instead of deprecated `cv-data.ts` functions
2. **Add E2E tests** with Playwright/Cypress for full user flow
3. **Add language-specific PDF export** (different PDF per language)
4. **Add more languages** (e.g., French, Spanish, Arabic)
5. **Add language-specific SEO** (meta tags per language)
6. **Add language-specific analytics** (track which languages users prefer)

---

## Support

For questions or issues:
1. Check this report first
2. Review inline code comments
3. Run tests: `npm test`
4. Check console for warnings

---

**Report generated**: 2025-01-30
**Status**: ✅ Production Ready
