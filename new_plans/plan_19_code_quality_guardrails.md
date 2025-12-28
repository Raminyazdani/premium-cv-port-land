# Plan 19: Code Quality Guardrails

## Title
Establish Code Quality Guardrails and Testing

---

## Scope

### In Scope
- Add ESLint rules to prevent future issues (no-console, max-lines)
- Document coding conventions
- Note missing test coverage areas
- Address file naming inconsistencies (STYLE-001)

### Out of Scope
- Writing comprehensive tests (large effort)
- Setting up new test framework
- CI/CD changes

---

## Symptoms

**What developers experience:**
- No lint rules preventing large files
- No lint rules preventing console.log in production
- Missing tests for critical paths
- Inconsistent file naming (kebab vs camelCase)

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - SOLID-003 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#2-openclosed-principle-ocp-violations)
- [FRONTEND_REFACTOR_AUDIT.md - PATTERN-003 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#4-localstorage-scattered-across-codebase)
- [FRONTEND_REFACTOR_AUDIT.md - STYLE-001 (Low)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#inconsistent-naming)
- [FRONTEND_REFACTOR_AUDIT.md - TEST-001 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#missing-tests)

### Recommended Rules from Audit
```json
{
  "no-console": ["warn", { "allow": ["warn", "error"] }],
  "max-lines": ["warn", { "max": 400 }],
  "max-lines-per-function": ["warn", { "max": 80 }]
}
```

---

## Fix Strategy

### Step 1: Update ESLint Configuration

```javascript
// eslint.config.js or .eslintrc
module.exports = {
  rules: {
    // Prevent console.log in production
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Prevent large files
    'max-lines': ['warn', { 
      max: 400, 
      skipBlankLines: true, 
      skipComments: true 
    }],
    
    // Prevent large functions
    'max-lines-per-function': ['warn', { max: 80 }],
    
    // Encourage explicit types
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

### Step 2: Create .eslintignore exceptions

```
# Exclude generated UI components
src/components/ui/*
# Exclude i18n file (necessarily large)
src/lib/i18n.ts
# Exclude key mappings (config file)
src/config/keyMappings.ts
```

### Step 3: Document Conventions

Create `docs/CODING_CONVENTIONS.md`:

```markdown
# Coding Conventions

## File Naming
- React components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Styles: kebab-case (e.g., `button-styles.css`)

## File Size Limits
- Maximum 400 lines per file (excluding generated code)
- Maximum 80 lines per function

## Console Logging
- Use `console.log` only in development
- Guard with `if (import.meta.env.DEV)`
- Use `console.warn` and `console.error` for warnings/errors

## Translations
- All UI strings in `lib/i18n.ts`
- No inline translation objects in components
- Use `useTranslation()` hook

## State Management
- Use React Context for shared state
- No window events for state synchronization
- localStorage access through storage utility
```

### Step 4: Fix Naming Inconsistencies

```bash
# Current inconsistencies:
# - hooks/ uses kebab-case
# - utils/ uses camelCase

# Standardize to camelCase for TypeScript files
# Or kebab-case for all - choose one and document
```

### Step 5: Document Missing Test Areas

Create `docs/TEST_COVERAGE_GAPS.md`:

```markdown
# Test Coverage Gaps

The following areas lack unit/integration tests:

## Critical (should test before major changes)
- FilterContext filtering logic
- dataLoader sanitization
- dataNormalizer key mapping

## Important (should test eventually)
- Section component empty states
- Language switching
- RTL layout handling

## Nice to have
- Theme persistence
- Sound effects toggling
- Konami code easter egg
```

### Files to Modify
- `frontend/eslint.config.js` or equivalent
- Create `docs/CODING_CONVENTIONS.md`
- Create `docs/TEST_COVERAGE_GAPS.md`

---

## Acceptance Criteria

- [ ] ESLint rules added for no-console, max-lines
- [ ] Generated files excluded from rules
- [ ] CODING_CONVENTIONS.md created
- [ ] TEST_COVERAGE_GAPS.md created
- [ ] Existing code doesn't fail lint (warnings OK)

---

## Regression Tests

### Manual Tests
1. Run `npm run lint`
2. Verify new warnings appear for violations
3. Verify generated files are not flagged

---

## Risk & Rollback

### Risk Level: LOW

**Why low:**
- Rules set to warn, not error
- Documentation only files
- No behavior changes

**Rollback:**
Remove lint rules if too noisy.

---

## Dependencies

**Blocks:** None (final plan)

**Blocked by:** Milestone 4 (all architecture fixes complete)

---

## Commit Message Guidance

### Short
```
chore: add code quality guardrails and documentation

Added ESLint rules for file size and console usage.
Created CODING_CONVENTIONS.md and TEST_COVERAGE_GAPS.md.

Addresses: TEST-001, STYLE-001, PATTERN-003, SOLID-003
```

---

*Plan ready for implementation*
