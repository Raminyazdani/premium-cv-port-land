# Plan 11: Refactor CVDataContext.tsx

## Title
Refactor CVDataContext to Follow Single Responsibility Principle

---

## Scope

### In Scope
- Extract debug logging from CVDataContext
- Simplify the context to only provide data and loading state
- Move side effects to appropriate locations

### Out of Scope
- Changing how data is loaded
- Adding new context features
- Modifying other contexts

---

## Symptoms

**What developers experience:**
- Context does too much (load, log, validate, provide)
- 60+ lines of useMemo with mixed concerns
- Debug output clutters console
- Hard to test in isolation

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - SOLID-001 (High)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#a-cvdatacontexttsx)

### Current Code (lines 22-97)
```typescript
// CVDataContext.tsx
export function CVDataProvider({ children }) {
  const { language } = useLanguage()
  
  const { data, isLoading, errors, warnings } = useMemo(() => {
    // 60+ lines including:
    // - Data loading
    // - Debug logging (20+ console statements)
    // - Error handling
    // - Validation result processing
  }, [language])
  
  return <CVDataContext.Provider value={{ data, isLoading, errors, warnings }}>
    {children}
  </CVDataContext.Provider>
}
```

---

## Likely Root Cause

**Mechanism:**
- Debug logging added during development
- Never extracted to separate utility
- Context became a catch-all for data pipeline

---

## Fix Strategy

### Step 1: Extract debug logging to utility
```typescript
// utils/debugDataLoading.ts
export function logDataLoadingDebug(
  language: Language,
  data: CVData,
  validationResult: ValidationResult
) {
  if (!import.meta.env.DEV) return
  
  console.group(`📊 CV Data Loaded: ${language}`)
  console.log('Sections:', Object.keys(data))
  console.log('Validation:', validationResult)
  console.groupEnd()
}
```

### Step 2: Simplify CVDataContext
```typescript
// CVDataContext.tsx (simplified)
export function CVDataProvider({ children }) {
  const { language } = useLanguage()
  const [state, setState] = useState<CVDataState>({
    data: null,
    isLoading: true,
    errors: [],
    warnings: []
  })
  
  useEffect(() => {
    async function loadData() {
      setState(prev => ({ ...prev, isLoading: true }))
      
      const result = await loadAndValidateData(language)
      
      // Debug logging in separate module
      logDataLoadingDebug(language, result.data, result.validationResult)
      
      setState({
        data: result.data,
        isLoading: false,
        errors: result.validationResult.errors,
        warnings: result.validationResult.warnings
      })
    }
    
    loadData()
  }, [language])
  
  return (
    <CVDataContext.Provider value={state}>
      {children}
    </CVDataContext.Provider>
  )
}
```

### Step 3: Create custom hook for common patterns
```typescript
// hooks/useCVSection.ts
export function useCVSection<K extends keyof CVData>(section: K) {
  const { data, isLoading } = useCVData()
  return {
    data: data?.[section],
    isLoading
  }
}
```

### Files to Modify
- `frontend/src/context/CVDataContext.tsx` - Simplify
- Create `frontend/src/utils/debugDataLoading.ts`
- Create `frontend/src/hooks/useCVSection.ts` (optional)

---

## Acceptance Criteria

- [ ] CVDataContext < 50 lines
- [ ] Debug logging in separate utility
- [ ] No console statements in context file
- [ ] Context only provides data and loading state
- [ ] All components still receive data correctly

---

## Regression Tests

### Manual Tests
1. Load page in each language
2. Verify data loads correctly
3. Verify loading state shows appropriately
4. Check dev console for debug output (should still appear)

### Unit Tests
```typescript
describe('CVDataContext', () => {
  it('provides data after loading', async () => {
    const { result } = renderHook(() => useCVData(), {
      wrapper: CVDataProvider
    })
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.data).toBeDefined()
  })
})
```

---

## Risk & Rollback

### Risk Level: MEDIUM

**Why medium:**
- Core context used by all components
- Need to preserve exact API
- State management change

**Mitigation:**
- Keep same context value shape
- Test all section components
- Gradual extraction

**Rollback:**
Revert to original implementation.

---

## Dependencies

**Blocks:** plan_12 (Create Shared Components)

**Blocked by:** plan_10 (Refactor dataLoader - cleaner loading function)

---

## Commit Message Guidance

### Short
```
refactor(context): simplify CVDataContext, extract debug logging

Moved debug logging to separate utility. Context now only handles
state management, not logging or complex processing.

Fixes: SOLID-001
```

---

*Plan ready for implementation*
