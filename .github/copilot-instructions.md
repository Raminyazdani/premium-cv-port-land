# Copilot Repository Instructions

This file provides repository-wide instructions for GitHub Copilot coding agents working in this CV website project.

## Project Overview

This is a **JSON-driven multilingual CV/portfolio website** built with:
- **Stack**: Vite + React 19 + TypeScript 5.7 + Tailwind CSS 4
- **Testing**: Vitest + @testing-library/react
- **Languages**: English (EN), German (DE), Persian/Farsi (FA)
- **Features**: RTL support for Persian, language switching, filtering by focus areas

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start dev server on http://localhost:5173
npm run build           # Build for production
npm run preview         # Preview production build
```

### Testing & Validation
```bash
npm run test                    # Run all tests
npm run test:watch              # Run tests in watch mode
npm run test:language           # Run language-specific content tests
npm run verify-languages        # Quick smoke test for EN/DE/FA
npm run generate-hashes         # Generate integrity hashes for locked files
```

### Linting
```bash
npm run lint            # Run ESLint
```

## Locked Files Policy ⚠️

**CRITICAL: These files are READ-ONLY and must NEVER be modified:**

- `src/data/cv.json` (English CV data)
- `src/data/ramin_de.json` (German CV data)
- `src/data/ramin_fa.json` (Persian CV data)

**Why locked?**
- These are production data files containing real CV information
- Past modifications caused missing/corrupted sections in some languages
- Byte-identical integrity is enforced via hash-based tests

**If tests need fixtures:**
- Read directly from locked JSON files at runtime, OR
- Create byte-identical copies in `tests/fixtures/` and document they are copies

**Verification:**
- Locked file integrity is tested in `tests/locked-files-integrity.test.ts`
- Hashes are stored in `tests/locked_files_hashes.json`
- Run `npm run generate-hashes` if you need to regenerate reference hashes (only after explicit user approval)

## Language Selection & Data Loading

### How Language Selection Works
1. **URL parameter**: `?lang=en`, `?lang=de`, or `?lang=fa`
2. **localStorage**: Persisted language preference
3. **Browser language**: Fallback to browser's language
4. **Default**: English (`en`)

**Implementation files:**
- `src/context/LanguageContext.tsx` - Language state management
- `src/lib/i18n.ts` - UI translations (not CV content)
- `src/utils/dataLoader.ts` - CV data loading and language routing

### Data Loading Flow
```
Raw JSON (language-specific keys)
    ↓
dataNormalizer.ts (normalize to English schema)
    ↓
dataLoader.ts (validate & sanitize)
    ↓
CVDataContext (provide to components)
```

**Key files:**
- `src/utils/dataLoader.ts` - Main data loading entry point
- `src/utils/dataNormalizer.ts` - Normalizes DE/FA keys to EN schema
- `src/context/CVDataContext.tsx` - React context for CV data

## Canonical Data Shape (English Schema)

All CV data is normalized to this English schema, regardless of source language:

```typescript
interface CVData {
  basics: Array<{
    fname: string
    lname: string
    email: string
    phone?: string
    birthDate?: string
    Pictures?: Array<{ type_of: string; URL: string }>
  }>
  profiles: Array<{
    network: string
    username?: string
    url: string
  }>
  education: Array<{
    institution: string
    studyType: string
    area?: string
    location?: string
    startDate?: string
    endDate?: string
    gpa?: string
    type_key?: string[]
  }>
  languages: Array<{
    language: string
    fluency: string
    certificate?: string
  }>
  workshop_and_certifications: Array<{
    issuer: string
    certifications: Array<{
      title: string
      date?: string
      type_key?: string[]
    }>
  }>
  skills: {
    [topCategory: string]: {
      [subCategory: string]: Array<{
        long_name: string
        short_name: string
        type_key?: string[]
      }>
    }
  }
  experiences: Array<{
    role: string
    institution: string
    duration: string
    description?: string[]
    type_key?: string[]
  }>
  projects: Array<{
    title: string
    url?: string
    description?: string
    highlights?: string[]
    type_key?: string[]
  }>
  publications: Array<{
    title: string
    authors?: string
    publisher?: string
    date?: string
    doi?: string
    isbn?: string
    type_key?: string[]
  }>
  references: Array<{
    name: string
    position?: string
    email?: string
    phone?: string
    type_key?: string[]
  }>
}
```

## Debugging Missing/Undefined Sections

### Quick Checklist
1. **Check raw data loading**: Verify JSON file loads correctly
   ```bash
   # Run language verification script
   npm run verify-languages
   ```

2. **Check normalization**: Ensure language-specific keys map correctly
   - German: `grunddaten` → `basics`, `ausbildung` → `education`, etc.
   - Persian: `اطلاعات_پایه` → `basics`, `تحصیلات` → `education`, etc.
   - See `src/utils/dataNormalizer.ts` for full key mappings

3. **Check validation**: Look for errors/warnings in dataLoader
   - Validation runs in `src/utils/dataLoader.ts`
   - Check browser console in dev mode for detailed logs

4. **Check component rendering**: Ensure components handle empty arrays
   - All section components should gracefully handle `[]` or `{}`
   - Use `?.` optional chaining for nested properties
   - Display empty states when data is missing

5. **Check type_key filtering**: Filtering by focus area may hide entries
   - Check `src/context/FilterContext.tsx`
   - Try "Full CV" filter to see all entries

### Common Issues
- **"undefined" showing in UI**: Missing null checks in component
- **Empty section**: Check if normalization mapped keys correctly
- **Partial section**: Check if sanitization filtered out entries
- **Inconsistent rendering**: Check if type_key filtering is active

## What "Done" Means for EN/DE/FA

### Acceptance Criteria
✅ All three languages load without errors
✅ All sections (basics, education, skills, etc.) render with content
✅ No "undefined" or "null" strings appear in rendered output
✅ RTL layout works correctly for Persian (FA)
✅ Language switching works via URL param, localStorage, and UI
✅ Tests pass: `npm run test`
✅ Language verification passes: `npm run verify-languages`
✅ Build succeeds: `npm run build`
✅ Locked files remain unchanged (verify with git diff)

### Manual Verification
1. Start dev server: `npm run dev`
2. Test each language:
   - EN: http://localhost:5173/?lang=en
   - DE: http://localhost:5173/?lang=de
   - FA: http://localhost:5173/?lang=fa
3. Check each section renders with real content (not empty)
4. Check RTL layout for Persian (text flows right-to-left)
5. Check no "undefined" strings in UI

## CI/CD & Background Jobs

- **Setup workflow**: `.github/workflows/copilot-setup-steps.yml`
- **CI workflow**: `.github/workflows/ci.yml`
- **Smoke tests**: Validate EN/DE/FA rendering
- **Visual proof**: Playwright screenshots in CI artifacts

See `docs/copilot-background-jobs.md` for details on environment setup and firewall configuration.

## Path-Specific Instructions

For more targeted guidance, see:
- `.github/instructions/data-normalization.instructions.md` - Data loading & normalization
- `.github/instructions/ui-rendering.instructions.md` - Component rendering
- `.github/instructions/tests.instructions.md` - Testing requirements

## Additional Resources

- **Quick Start**: `QUICK_START.md`
- **Full Documentation**: `DOCUMENTATION_INDEX.md`
- **Agent Runbook**: `AGENTS.md`
- **Schema Reference**: `SCHEMA.md`
