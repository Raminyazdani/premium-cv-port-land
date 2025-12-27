# Data Normalization Instructions

**applyTo**: `["src/utils/dataLoader.ts", "src/utils/dataNormalizer.ts", "src/utils/dataValidator.ts", "src/utils/debugDataFlow.ts"]`

## Purpose

These files handle loading, normalizing, and validating CV data from language-specific JSON files.

## Critical Rules

### 1. Never Modify Source Data Files
- **DO NOT** touch `src/data/cv.json`, `src/data/ramin_de.json`, or `src/data/ramin_fa.json`
- These are locked, read-only files with hash-based integrity checks

### 2. Normalization Must Be Consistent
- All language data normalizes to the **English schema** (see copilot-instructions.md)
- German keys: `grundlagen` → `basics`, `bildung` → `education`, `fähigkeiten` → `skills`, etc.
- Persian keys: `اطلاعات_پایه` → `basics`, `تحصیلات` → `education`, `مهارت_ها` → `skills`, etc.
- **Never change key mappings** without understanding impact on all three languages

### 3. Handle Missing Data Gracefully
- Always return valid empty structures (e.g., `[]` for arrays, `{}` for objects)
- Never return `undefined` or `null` for top-level sections
- Use optional chaining (`?.`) when accessing nested properties
- Filter out incomplete entries, but log warnings

### 4. Preserve Data Integrity
- Do not silently drop data during normalization
- Do not change data types (e.g., array to object, string to number)
- Use deduplication carefully - only for true duplicates
- Sanitize dates consistently (ISO 8601 format when possible)

### 5. Validation Should Be Non-Destructive
- Validation errors/warnings should not block data loading
- Log issues to console in dev mode for debugging
- Return validation results alongside data

## Key Normalization Patterns

### Array Fields
```typescript
// Always ensure arrays exist
const education = Array.isArray(rawData.bildung) ? rawData.bildung : []
```

### Object Fields
```typescript
// Skills is an object with nested structure
const skills = rawData.fähigkeiten && typeof rawData.fähigkeiten === 'object' 
  ? rawData.fähigkeiten 
  : {}
```

### Nested Arrays (e.g., Certifications)
```typescript
// Certifications have issuer groups with nested cert arrays
const certifications = Array.isArray(rawData.workshop_und_zertifizierungen)
  ? rawData.workshop_und_zertifizierungen.map(issuerGroup => ({
      issuer: issuerGroup.issuer || issuerGroup.aussteller || '',
      certifications: Array.isArray(issuerGroup.certifications) 
        ? issuerGroup.certifications 
        : []
    }))
  : []
```

## Common Pitfalls to Avoid

### ❌ Don't Do This
```typescript
// Silently returning undefined
const basics = data.basics

// Changing data structure
const skills = Object.values(data.skills).flat()

// Dropping fields without logging
const filtered = education.filter(e => e.institution)
```

### ✅ Do This Instead
```typescript
// Always provide defaults
const basics = Array.isArray(data.basics) ? data.basics : []

// Preserve structure
const skills = data.skills && typeof data.skills === 'object' ? data.skills : {}

// Log when filtering
const filtered = education.filter(e => {
  if (!e.institution) {
    console.warn('Dropping education entry without institution:', e)
    return false
  }
  return true
})
```

## Testing Changes

When modifying normalization logic:

1. **Run language verification**: `npm run verify-languages`
2. **Run tests**: `npm run test:language`
3. **Check all three languages**: Verify EN, DE, and FA render correctly
4. **Check console logs**: Look for validation errors/warnings
5. **Verify locked files unchanged**: `git diff src/data/`

## Debugging Normalization Issues

### Check Raw Data Loading
```typescript
// Add debug logs in dataLoader.ts
console.log('Raw data keys:', Object.keys(rawData))
console.log('Raw education:', rawData.bildung || rawData.education)
```

### Check Normalization Output
```typescript
// Add debug logs after normalization
console.log('Normalized keys:', Object.keys(normalized))
console.log('Normalized education:', normalized.education)
```

### Check Validation Results
```typescript
// Check validation output
const { data, validationResult } = loadAndValidateData('de')
console.log('Validation errors:', validationResult.errors)
console.log('Validation warnings:', validationResult.warnings)
```

## Language-Specific Key Mappings

### German (DE) to English (EN)
```
grunddaten → basics
profile → profiles
ausbildung → education
sprachen → languages
schulungen_und_zertifikate → workshop_and_certifications
faehigkeiten → skills
erfahrungen → experiences
projekte → projects
publikationen → publications
referenzen → references
```

### Persian (FA) to English (EN)
```
اطلاعات_پایه → basics
پروفایل‌ها → profiles
تحصیلات → education
زبان‌ها → languages
کارگاه‌ها_و_گواهی‌ها → workshop_and_certifications
مهارت‌ها → skills
سوابق → experiences
پروژه‌ها → projects
انتشارات → publications
معرف‌ها → references
```

### Nested Field Mappings (German)
```
vorname → fname
nachname → lname
e_mail → email
einrichtung → institution
studiengang → studyType
bereich → area
standort → location
aussteller → issuer
zertifizierungen → certifications
titel → title
```

### Nested Field Mappings (Persian)
```
نام → fname
نام خانوادگی → lname
ایمیل → email
موسسه → institution
رشته تحصیلی → studyType
```

## When to Update This File

Update these instructions when:
- Adding support for a new language
- Changing the normalization schema
- Adding new data validation rules
- Discovering common normalization bugs
