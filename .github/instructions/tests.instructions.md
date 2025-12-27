# Testing Instructions

**applyTo**: `["tests/**/*.test.ts", "tests/**/*.test.tsx"]`

## Purpose

Guidelines for writing and maintaining tests in this multilingual CV website project.

## Critical Rules

### 1. Tests Must Not Modify Locked Files
- **Never** write tests that modify `src/data/cv.json`, `src/data/ramin_de.json`, or `src/data/ramin_fa.json`
- If tests need fixtures, either:
  - Read from locked files at runtime, OR
  - Create byte-identical copies in `tests/fixtures/` and document they are copies

### 2. Test All Three Languages
When testing data loading, normalization, or rendering:
```typescript
describe('Data Loading', () => {
  ['en', 'de', 'fa'].forEach(lang => {
    it(`loads ${lang} data without errors`, () => {
      const result = loadAndValidateData(lang as Language)
      expect(result.validationResult.errors).toHaveLength(0)
      expect(result.data.basics).toBeDefined()
    })
  })
})
```

### 3. Test for Absence of "undefined" Strings
```typescript
test('should not render undefined strings', () => {
  const { container } = render(<EducationSection data={testData} />)
  expect(container.textContent).not.toContain('undefined')
  expect(container.textContent).not.toContain('null')
})
```

### 4. Use Proper Cleanup
```typescript
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

### 5. Mock External Dependencies
```typescript
import { vi } from 'vitest'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  getUIStrings: () => ({ sections: { education: 'Education' } }),
  t: (lang: string, key: string) => key
}))
```

## Test Categories

### Locked Files Integrity Tests
**File**: `tests/locked-files-integrity.test.ts`

Ensures locked files haven't been modified:
```typescript
import { describe, it, expect } from 'vitest'
import * as crypto from 'crypto'
import * as fs from 'fs'
import lockedHashes from './locked_files_hashes.json'

it('cv.json has not been modified', () => {
  const currentHash = computeSHA256('src/data/cv.json')
  expect(currentHash).toBe(lockedHashes.locked_files['src/data/cv.json'].hash)
})
```

### Data Normalization Tests
**File**: `tests/data-normalization.test.ts`

Tests normalization logic for all languages:
```typescript
describe('Data Normalization', () => {
  it('normalizes German keys to English schema', () => {
    const result = normalizeCVData(germanData, 'de')
    expect(result.basics).toBeDefined()
    expect(result.education).toBeDefined()
    expect(Array.isArray(result.education)).toBe(true)
  })
  
  it('preserves all sections during normalization', () => {
    const result = normalizeCVData(persianData, 'fa')
    const sections = [
      'basics', 'profiles', 'education', 'languages',
      'workshop_and_certifications', 'skills', 'experiences',
      'projects', 'publications', 'references'
    ]
    sections.forEach(section => {
      expect(result[section]).toBeDefined()
    })
  })
})
```

### Language Content Verification Tests
**File**: `tests/language-content-verification.test.tsx`

Validates content loads and renders for all languages:
```typescript
describe('Language Content Verification', () => {
  languages.forEach(lang => {
    it(`loads and validates ${lang} data`, () => {
      const result = loadAndValidateData(lang)
      
      // No validation errors
      expect(result.validationResult.errors).toHaveLength(0)
      
      // Has basics
      expect(result.data.basics).toHaveLength(1)
      expect(result.data.basics[0].fname).toBeTruthy()
      
      // Has education
      expect(result.data.education.length).toBeGreaterThan(0)
    })
  })
})
```

### Component Rendering Tests
**File**: `tests/i18n-integration.test.tsx`

Tests component rendering in different languages:
```typescript
describe('Component Rendering', () => {
  it('renders education section with German data', () => {
    const { getByText } = render(
      <LanguageProvider initialLang="de">
        <EducationSection />
      </LanguageProvider>
    )
    
    expect(getByText(/Ausbildung/i)).toBeInTheDocument()
  })
  
  it('applies RTL layout for Persian', () => {
    const { container } = render(
      <LanguageProvider initialLang="fa">
        <App />
      </LanguageProvider>
    )
    
    expect(container.querySelector('[dir="rtl"]')).toBeInTheDocument()
  })
})
```

## Testing Patterns

### Setup Test Providers
```typescript
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'

function renderWithProviders(
  ui: React.ReactElement,
  { language = 'en' } = {}
) {
  return render(
    <LanguageProvider initialLang={language}>
      <CVDataProvider>
        <FilterProvider>
          {ui}
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}
```

### Test Empty States
```typescript
it('shows empty state when no data', () => {
  const { getByText } = render(<EducationSection data={[]} />)
  expect(getByText(/no education/i)).toBeInTheDocument()
})
```

### Test Error Handling
```typescript
it('handles malformed data gracefully', () => {
  const badData = [null, undefined, { invalid: 'data' }]
  const { container } = render(<EducationSection data={badData} />)
  
  // Should not crash
  expect(container).toBeInTheDocument()
  
  // Should not show undefined
  expect(container.textContent).not.toContain('undefined')
})
```

### Test Language Switching
```typescript
it('updates content when language changes', async () => {
  const { getByText, rerender } = renderWithProviders(<App />, { language: 'en' })
  expect(getByText(/Education/i)).toBeInTheDocument()
  
  // Switch to German
  rerender(<App />, { language: 'de' })
  await waitFor(() => {
    expect(getByText(/Ausbildung/i)).toBeInTheDocument()
  })
})
```

## Running Tests

### All Tests
```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### Specific Tests
```bash
npm run test:language     # Language content tests only
npm run test -- tests/locked-files-integrity.test.ts
```

### Debugging Tests
```typescript
import { screen, debug } from '@testing-library/react'

test('debug example', () => {
  render(<MyComponent />)
  
  // Print entire DOM
  screen.debug()
  
  // Print specific element
  screen.debug(screen.getByRole('button'))
})
```

## Test Stability Requirements

### Avoid Flaky Tests
- Don't rely on timing (use `waitFor` instead of `setTimeout`)
- Don't rely on specific order unless necessary
- Mock random/time-dependent behavior
- Clean up side effects (localStorage, timers, etc.)

### Use Proper Assertions
```typescript
// ✅ Good: Specific assertions
expect(result.data.basics).toHaveLength(1)
expect(result.data.basics[0].fname).toBe('Ramin')

// ❌ Bad: Vague assertions
expect(result).toBeTruthy()
expect(result.data).toBeDefined()
```

### Keep Tests Fast
- Mock heavy operations (API calls, file I/O)
- Use shallow rendering when deep isn't needed
- Share expensive setup via `beforeAll` when safe
- Avoid unnecessary waiting

## CI Integration

Tests run in CI via `.github/workflows/ci.yml`:
- All tests must pass
- Locked file integrity must pass
- No console errors allowed
- Coverage thresholds must be met

## When to Update This File

Update these instructions when:
- Adding new test patterns
- Discovering common test failures
- Changing test infrastructure
- Adding new testing tools
