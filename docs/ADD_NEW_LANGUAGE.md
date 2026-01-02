# Adding a New Language to the CV Website

This guide explains how to add support for a new language (e.g., Italian, Spanish, French) to the multilingual CV website.

## Overview

As of Issue #01, the CV system uses **canonical English keys** across all language files. This means:
- All CV JSON files share the same structure with English field names
- Only the **content values** differ between languages
- No code changes are needed to add a new language

## Quick Start (3 Steps)

### 1. Add Language Metadata

Edit `frontend/src/context/LanguageContext.tsx`:

```typescript
export const LANGUAGE_METADATA: Record<string, { displayName: string; direction: 'ltr' | 'rtl' }> = {
  en: { displayName: 'English', direction: 'ltr' },
  de: { displayName: 'Deutsch', direction: 'ltr' },
  fa: { displayName: 'فارسی', direction: 'rtl' },
  it: { displayName: 'Italiano', direction: 'ltr' }  // ← Add this line
}
```

### 2. Create CV File

Copy `frontend/src/data/cv.json` to `frontend/src/data/cv_it.json` and translate **only the values**:

```json
{
  "basics": [
    {
      "fname": "Ramin",
      "lname": "Yazdani",
      "label": ["Biotecnologo", "Sviluppatore"],  // ← Translated
      "email": "raya00001@stud.uni-saarland.de",  // ← Same (unchanged)
      "summary": "Sono Ramin Yazdani..."          // ← Translated
    }
  ],
  "education": [
    {
      "institution": "Università del Saarland",    // ← Translated
      "studyType": "Master of Science",
      "area": "Bioinformatica"                     // ← Translated
    }
  ]
}
```

**Important**: 
- Keep all **keys** in English (e.g., `basics`, `education`, `fname`, `lname`)
- Translate only the **values** (content)
- Maintain the same structure as `cv.json`

### 3. Update Locked File Hashes

```bash
cd frontend
npm run generate-hashes
git add tests/locked_files_hashes.json
```

## Optional: Add Structural Key Translations

If you want to translate structural labels (field names) in the UI, extend `frontend/src/data/lang.json`:

```json
{
  "basics": {
    "en": "basics",
    "de": "Grunddaten",
    "fa": "اطلاعات پایه",
    "it": "Dati di base"  // ← Add this
  },
  "fname": {
    "en": "fname",
    "de": "Vorname",
    "fa": "نام کوچک",
    "it": "Nome"  // ← Add this
  }
}
```

## Verification

1. **Language verification**:
   ```bash
   npm run verify-languages
   ```

2. **Manual testing**:
   ```bash
   npm run dev
   ```
   Then visit: `http://localhost:5173/?lang=it`

3. **Build test**:
   ```bash
   npm run build
   ```

## Important Notes

### Canonical Keys (DO NOT CHANGE)

All CV files must use these exact English keys:

**Top-level sections**:
- `basics`
- `profiles`
- `education`
- `languages`
- `workshop_and_certifications`
- `skills`
- `experiences`
- `projects`
- `publications`
- `references`

**Field names** (examples):
- `fname`, `lname`, `email`, `phone`
- `institution`, `studyType`, `area`
- `title`, `description`, `highlights`

### Skills Section Special Case

Skills have **nested category/subcategory labels** that are also **content values**:

```json
{
  "skills": {
    "Programming & Scripting": {           // ← Category label (translate in each file)
      "Programming Languages": [            // ← Subcategory label (translate in each file)
        {
          "long_name": "Python",            // ← Content (translate)
          "short_name": "Python"
        }
      ]
    }
  }
}
```

In Italian (`cv_it.json`):
```json
{
  "skills": {
    "Programmazione e Scripting": {        // ← Translated
      "Linguaggi di Programmazione": [     // ← Translated
        {
          "long_name": "Python",
          "short_name": "Python"
        }
      ]
    }
  }
}
```

### RTL Languages

For right-to-left languages (Arabic, Hebrew, Persian, Urdu):

1. Set `direction: 'rtl'` in metadata
2. The layout will automatically flip
3. Email addresses and URLs remain LTR

Example:
```typescript
ar: { displayName: 'العربية', direction: 'rtl' }
```

## Troubleshooting

### Language doesn't appear in selector

Check that:
1. Metadata entry exists in `LANGUAGE_METADATA`
2. CV file exists: `src/data/cv_<code>.json`
3. Dev server was restarted after adding files

### Content appears in wrong language

Verify:
1. You're translating **values**, not **keys**
2. File is named correctly: `cv_<code>.json` (lowercase)
3. URL parameter matches: `?lang=<code>`

### Build fails

Run:
```bash
npm run typecheck
```

Ensure the CV file structure matches the TypeScript types in `src/types/cv.ts`.

## Example: Full Italian Integration

```typescript
// 1. frontend/src/context/LanguageContext.tsx
it: { displayName: 'Italiano', direction: 'ltr' }

// 2. frontend/src/data/cv_it.json (excerpt)
{
  "basics": [{
    "fname": "Ramin",
    "lname": "Yazdani",
    "label": ["Biotecnologo", "Sviluppatore"],
    "summary": "Sono Ramin Yazdani, appassionato di data science..."
  }]
}

// 3. frontend/src/data/lang.json (optional, excerpt)
{
  "basics": {
    "it": "Dati di base"
  },
  "education": {
    "it": "Istruzione"
  }
}
```

## Summary

Adding a new language requires:
- ✅ **1 line** of metadata
- ✅ **1 JSON file** with translated content
- ✅ **No code changes**

The system automatically:
- Detects available languages
- Handles language switching
- Manages RTL layout
- Updates the UI

For questions or issues, refer to the main documentation in `docs/DOCUMENTATION_INDEX.md`.
