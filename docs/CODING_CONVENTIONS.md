# Coding Conventions

This document outlines the coding conventions and best practices for this project.

## File Naming

### React Components
- **PascalCase** for component files (e.g., `UserProfile.tsx`, `EducationSection.tsx`)
- One component per file (co-located subcomponents are acceptable)

### Hooks
- **camelCase** with `use` prefix (e.g., `useAuth.ts`, `useFilteredData.ts`)
- Custom hooks should start with `use-` in kebab-case or `use` in camelCase

### Utilities
- **camelCase** for utility files (e.g., `formatDate.ts`, `dataLoader.ts`)

### Styles
- **kebab-case** for CSS files (e.g., `button-styles.css`, `main.css`)

### Config Files
- **camelCase** for TypeScript config files (e.g., `keyMappings.ts`, `skillCategoryMappings.ts`)

## File Size Limits

### Maximum Lines Per File: 400
- Files should not exceed 400 lines (excluding blank lines and comments)
- If a file grows too large, consider splitting it into smaller modules
- ESLint enforces this with `max-lines` rule (warning level)

### Maximum Lines Per Function: 80
- Functions should not exceed 80 lines (excluding blank lines and comments)
- Large functions should be broken into smaller, testable units
- ESLint enforces this with `max-lines-per-function` rule (warning level)

### Exceptions
The following files are exempt from line limits due to their nature:
- `src/components/ui/*` - Generated UI components (shadcn/ui)
- `src/lib/i18n.ts` - Translation strings file (necessarily large)
- `src/config/keyMappings.ts` - Key mapping configuration
- `src/config/skillCategoryMappings.ts` - Skill category mappings

## Console Logging

### Production Code
- **Do not use `console.log`** in production code
- Use `console.warn` for warnings
- Use `console.error` for errors
- ESLint enforces this with `no-console` rule (warning level)

### Development-Only Logging
If you need logging for development purposes, guard it:

```typescript
if (import.meta.env.DEV) {
  console.log('Debug information:', data)
}
```

### Logger Utility
Prefer using the logger utility for structured logging:

```typescript
import { logger } from '@/lib/logger'

logger.info('Message', { context: 'data' })
logger.warn('Warning message')
logger.error('Error occurred', error)
```

## Translations (i18n)

### UI Strings
- All user-visible UI strings must be in `src/lib/i18n.ts`
- Use the `useTranslation()` hook to access translations
- No inline translation objects in components

```typescript
// ✅ Good
import { useTranslation } from '@/context/LanguageContext'

function MyComponent() {
  const t = useTranslation()
  return <h1>{t.sections.education}</h1>
}

// ❌ Bad - hardcoded string
function MyComponent() {
  return <h1>Education</h1>
}
```

### Allowed Literals
Single-character punctuation and symbols are allowed without i18n:
- Punctuation: `–`, `|`, `:`, `,`, `.`, `/`, `-`
- Symbols: `+`, `×`, `✓`, `•`, `…`
- Brackets: `(`, `)`, `[`, `]`, `{`, `}`

### Bypassing the Rule
For rare cases where a literal string is acceptable (e.g., brand names):

```typescript
// eslint-disable-next-line react/jsx-no-literals
<span>GitHub</span>
```

## State Management

### React Context
- Use React Context for shared application state
- Prefer multiple focused contexts over one large global context
- Example: `LanguageContext`, `CVDataContext`, `FilterContext`

### Local State
- Use `useState` for component-local state
- Use `useReducer` for complex state logic

### Avoid
- ❌ Window events for state synchronization
- ❌ Global mutable variables
- ❌ Direct DOM manipulation for state

### localStorage Access
- Use the storage utility for localStorage operations
- Always handle cases where localStorage is unavailable (SSR, private browsing)

```typescript
import { storage } from '@/lib/storage'

// Read
const theme = storage.get('theme', 'light')

// Write
storage.set('theme', 'dark')
```

## TypeScript

### Type Annotations
- Use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` if type is truly unknown
- ESLint enforces this with `@typescript-eslint/no-explicit-any` rule (error level)

```typescript
// ✅ Good
function processData(data: CVData): ProcessedData {
  return transform(data)
}

// ❌ Bad
function processData(data: any): any {
  return transform(data)
}
```

### Optional Chaining
- Use optional chaining (`?.`) for potentially undefined values
- Use nullish coalescing (`??`) for default values

```typescript
// ✅ Good
const name = user?.profile?.name ?? 'Unknown'

// ❌ Bad
const name = user && user.profile && user.profile.name || 'Unknown'
```

## Component Patterns

### Props Interface
Define props interfaces for all components:

```typescript
interface EducationCardProps {
  item: EducationEntry
  isHighlighted?: boolean
}

export function EducationCard({ item, isHighlighted = false }: EducationCardProps) {
  // ...
}
```

### Empty State Handling
Always handle empty data gracefully:

```typescript
function EducationSection({ data }: SectionProps) {
  if (!data || data.length === 0) {
    return <EmptyState message={t.empty.no_education} />
  }
  
  return (
    <section>
      {data.map(item => <EducationCard key={item.id} item={item} />)}
    </section>
  )
}
```

### RTL Support
Respect RTL layout for Persian language:

```typescript
const { isRTL } = useLanguage()

<div className={cn("flex", isRTL && "flex-row-reverse")}>
  {/* content */}
</div>
```

## Testing

### Test Files
- Place test files in `tests/` directory or co-located with source files
- Use `.test.ts` or `.test.tsx` extension

### Test Coverage
- Critical paths should have unit tests
- See `docs/TEST_COVERAGE_GAPS.md` for areas needing coverage

## Code Review

Before submitting a PR:
1. Run `npm run lint` - fix errors, warnings are acceptable
2. Run `npm run typecheck` - ensure no type errors
3. Run `npm run test` - ensure tests pass
4. Run `npm run build` - ensure production build works
